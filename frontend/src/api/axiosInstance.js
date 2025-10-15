import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Attach token dynamically before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // always get latest token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
