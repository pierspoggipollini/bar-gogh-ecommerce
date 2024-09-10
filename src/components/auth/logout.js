import axiosInstance from "../../config/axiosInstance";
import { auth } from "../../firebaseMethod";

export async function logout() {
    // Retrieve the JWT token from localStorage
    const jwtToken = localStorage.getItem('session_JWT_Token');

    // Ensure the JWT token is valid
    if (!jwtToken) {
        console.error('No JWT token found in localStorage');
        // Handle the case where the token is not present (optional)
        return Promise.reject(new Error('No JWT token found'));
    }

    try {
        // Make a request to the server to perform the logout
        const response = await axiosInstance.post("sessionLogout");

        if (response.status === 200) {
            console.log('Logout successful');
            auth.signOut();
            // Once logout is successful on the server, remove the token from localStorage
            localStorage.removeItem('session_JWT_Token');
            // Perform other post-logout actions, like redirecting or updating UI
            return response.data; // If the server sends additional data in the response
        } else {
            console.error('Logout failed:', response.statusText);
            // Handle logout failure
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        // Handle network errors or other errors
        throw error;
    }
}

