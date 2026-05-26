import axios from "axios";

// Define the base URL for your API
const API_URL = `http://localhost:5000/api-v1`;

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: API_URL,
});

// Load token immediately on app start
const token = localStorage.getItem("token");

if (token) {
    api.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
}


// Function to set/remove token dynamically
export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] =
            `Bearer ${token}`;

        localStorage.setItem("token", token);
    } else {
        delete api.defaults.headers.common["Authorization"];

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
}

// Handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            setAuthToken(null);

            window.location.href = "/sign-in";
        }

        return Promise.reject(error);
    }
);

// Export the axios instance
export default api;
