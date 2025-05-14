import axios from "axios";

const api = axios.create({
  baseURL: "https://bias-backend-g6d6.onrender.com", // 🔁 Change to your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // set to true if using cookies
});

export default api;
