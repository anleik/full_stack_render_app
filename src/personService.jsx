import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/persons'
    : 'https://full-stack-render-app-xaaj.onrender.com/api/persons';

const getAll = () => {
  return axios
    .get(baseUrl)
    .then(response => response.data);
};

const create = newPerson => {
  return axios
    .post(baseUrl, newPerson)
    .then(response => response.data);
};

const update = (id, updatedPerson) => {
  return axios
    .put(`${baseUrl}/${id}`, updatedPerson)
    .then(response => response.data);
};

const deletePerson = id => {
  return axios
    .delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, deletePerson };