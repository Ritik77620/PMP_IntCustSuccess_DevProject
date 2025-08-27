import axios from 'axios';

const api = axios.create({
  baseURL: 'http://103.160.106.200:7001', // <-- your backend port
  headers: { 'Content-Type': 'application/json' },
});

export default api;
