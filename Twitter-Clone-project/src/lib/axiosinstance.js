import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers:{
    'Content-Type': 'application/json',
  } // Adjust the base URL as needed
});
export default axiosInstance;