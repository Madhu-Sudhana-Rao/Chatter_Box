import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatter-box-2-nvjm.onrender.com/api", 
  withCredentials: true,
});
