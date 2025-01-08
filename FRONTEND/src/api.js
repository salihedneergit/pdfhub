import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.51.106.41:3001',
});

export default api;
