require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
const path = require('path')


app.use(cors());
app.use(express.json());


morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

/* let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]; */

app.get('/', (req, res) => {
  res.send('<h1>Backend is running!</h1>');
});

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => {
      console.error('Error fetching persons from DB:', error)
      res.status(500).json({ error: 'Internal server error' })
    })
})


app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  const updatedPerson = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
    .then(updated => {
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  const person = new Person({ name, number })

  person
    .save()
    .then(saved => res.status(201).json(saved))
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date();
      res.send(
        `<p>Phonebook has info for ${count} people</p><p>${date}</p>`
      );
    })
    .catch(error => next(error));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    console.log(error.message)
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
