/**
 * Generates and returns a CSRF token for the client.
 * Uses `req.csrfToken()` provided by the CSRF middleware.
 * Responds with the CSRF token in JSON format.
 * Handles errors if there's any issue generating the token.
 */
export async function getCsrfToken(req, res) {
    try {
        const csrfToken = req.csrfToken(); // Generate CSRF token using middleware
        return res.status(200).json({ csrfToken }); // Respond with JSON containing the CSRF token
    } catch (error) {
        console.error("Error generating CSRF token:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
 
