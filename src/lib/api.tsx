import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // <-- your backend port
  headers: { 'Content-Type': 'application/json' },
});

export default api;
