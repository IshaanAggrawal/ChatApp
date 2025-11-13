import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-app-czv2.vercel.app/api",
  withCredentials: true,
});
