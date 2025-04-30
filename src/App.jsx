import { useState, useEffect } from "react";
import './App.css';
import personService from './personService';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import Notification from './Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => {
        console.error("Error fetching persons:", error);
        setErrorMessage("Failed to fetch persons.");
        setTimeout(() => setErrorMessage(null), 5000);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      const confirmation = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      );
      if (confirmation) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNewName("");
            setNewNumber("");
            setSuccessMessage(`${newName}'s number updated successfully!`);
            setTimeout(() => setSuccessMessage(null), 5000);
          })
          .catch(error => {
            console.error("Error updating person:", error);
            setErrorMessage(
              `Information of ${existingPerson.name} has already been removed from the server.`
            );
            setTimeout(() => setErrorMessage(null), 5000);
            setPersons(persons.filter(person => person.id !== existingPerson.id));
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setSuccessMessage(`${newName} added successfully!`);
        setTimeout(() => setSuccessMessage(null), 5000);
      })
      .catch(error => {
        console.error("Error adding person:", error);
        const serverMessage = error.response?.data?.error || "Failed to add person.";
        setErrorMessage(serverMessage);
        setTimeout(() => setErrorMessage(null), 5000);
      });
  };

  const deletePerson = (id, name) => {
    const confirmation = window.confirm(`Delete ${name}?`);
    if (confirmation) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setSuccessMessage(`${name} deleted successfully!`);
          setTimeout(() => setSuccessMessage(null), 5000);
        })
        .catch(error => {
          console.error("Error deleting person:", error);
          const serverMessage = error.response?.data?.error || `Failed to delete ${name}.`;
          setErrorMessage(serverMessage);
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      {/* Notifications */}
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="added" />

      {/* Filter Component */}
      <Filter filter={filter} handleFilterChange={(e) => setFilter(e.target.value)} />

      <h3>Add a new</h3>

      {/* PersonForm Component */}
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
        handleSubmit={addPerson}
      />

      <h3>Numbers</h3>

      {/* Persons Component */}
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App