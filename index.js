import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

require('dotenv').config()
const app = express();
const Person = require('./models/person')

app.use(cors());
app.use(express.json());


morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/', (req, res) => {
  res.send('<h1>Backend is running!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "Person not found" });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const personExists = persons.some(p => p.id === id);

  if (!personExists) {
    return res.status(404).json({ error: "Person not found" });
  }

  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  if (persons.some(p => p.name === name)) {
    return res.status(400).json({ error: "Name must be unique" });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name,
    number
  };

  persons.push(newPerson);
  res.status(201).json(newPerson);
});

app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
