import axios from "axios";
import apiBaseUrl from "./apiConfig";

// Create an axios instance with a base URL and default headers.
const axiosInstance = axios.create({
    baseURL: apiBaseUrl, // Set the base URL for API requests.
    headers: {
        "Content-Type": "application/json", // Set default Content-Type header.
    },
});

// Add an interceptor to handle global authorization.
axiosInstance.interceptors.request.use(
    (config) => {
        // Retrieve JWT token from localStorage.
        const token = localStorage.getItem("session_JWT_Token");

        // If token exists, add Authorization header with Bearer token format.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config; // Return modified request configuration.
    },
    (error) => {
        // Log error and reject the request with a new Error object.
        console.error(error, "No JWT token found in localStorage");
        return Promise.reject(new Error("No JWT token found"));
    },
);

export default axiosInstance; // Export the configured axios instance.
