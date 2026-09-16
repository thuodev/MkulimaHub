import axios from "axios";

const client = axios.create({
  baseURL: "https://mkulimahub-b53g.onrender.com/api", // Replace with your backend API URL
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
