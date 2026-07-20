import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20-second timeout for LLM generation
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
