import axios from "axios";

// Define the base URL for your API
const API_URL = `http://localhost:5000/api-v1`;

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: API_URL,
});

// Function to set or remove the Authorization token in the headers
export function setAuthToken(token) {
    if (token) {
        // Set the Authorization header if a token is provided
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        // Remove the Authorization header if no token is provided
        delete api.defaults.headers.common["Authorization"];
    }
}

// Export the axios instance
export default api;
