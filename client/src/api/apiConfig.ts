import axios from 'axios';
import { createAuthClient } from "better-auth/react";

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Axios instance for general API calls
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Better-Auth Client
export const authClient = createAuthClient({
    baseURL: API_BASE_URL
});

// Add a request interceptor to include the JWT/Session if needed
// Better-Auth usually handles this via cookies or fetch wrapping, 
// but for manual axios calls we can ensure consistency.
api.interceptors.request.use(async (config) => {
  // Better-Auth tokens are usually handled via cookies in 'withCredentials'
  // But if using JWT manually, you would fetch it here.
  return config;
});
