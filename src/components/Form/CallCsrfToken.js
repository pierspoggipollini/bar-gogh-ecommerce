import axios from "axios";
import apiBaseUrl from "../../config/apiConfig";



export async function callCsrfToken() {
    try {
        const response = await axios.get(`${apiBaseUrl}csrf-token`)
        return response.data;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        throw error; // Puoi decidere se gestire l'errore qui o lasciarlo propagare
    }
}
