/**
 * Session Manager
 * Handles generating and retrieving persistent session hashes for anonymous users.
 */
window.SessionManager = {
    /**
     * Get or create a session hash
     * @returns {string} UUID-like session hash
     */
    getSessionHash() {
        let hash = localStorage.getItem('device_session_hash');
        if (!hash) {
            hash = crypto.randomUUID();
            localStorage.setItem('device_session_hash', hash);
        }
        return hash;
    }
};
