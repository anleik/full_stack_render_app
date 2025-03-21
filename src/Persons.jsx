import React from 'react'

const Persons = ({ persons, deletePerson }) => {
    return (
      <div>
        {persons.map((person, index) => (
          <div key={person.id || index}>
            {person.name} {person.number} 
            <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
          </div>
        ))}
      </div>
    )
  }
  
  export default Persons