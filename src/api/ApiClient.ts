import axios from 'axios';

const API_BASE_URL = 'https://namig.pro/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
