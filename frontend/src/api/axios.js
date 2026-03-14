import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-room-scheduler.onrender.com/api/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

 
  if (token && !config.url.includes("login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;