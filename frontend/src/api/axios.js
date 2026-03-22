import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-room-scheduler.onrender.com/api/",
 // baseURL: "http://127.0.0.1:8000/api/",
 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  // Add the token to the Authorization header if it exists and the request is not for login

 
  if (token && !config.url.includes("login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;