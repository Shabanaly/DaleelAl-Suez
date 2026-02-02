/**
 * Auth Service
 * Business logic for Authentication (login, logout, session check)
 */
window.AuthService = {
    async getSession() {
        try {
            if (!window.AuthRepository) throw new Error("AuthRepository not found");
            return await window.AuthRepository.getSession();
        } catch (error) {
            console.error("AuthService: getSession error", error);
            return null; // Return null session on error
        }
    },

    async getUser() {
        try {
            if (!window.AuthRepository) throw new Error("AuthRepository not found");
            return await window.AuthRepository.getUser();
        } catch (error) {
            console.warn("AuthService: getUser error (might be not logged in)", error.measurement);
            return null;
        }
    },

    async isLoggedIn() {
        const session = await this.getSession();
        return !!(session && session.session);
    },

    async signInWithOAuth(provider) {
        if (!window.AuthRepository) throw new Error("AuthRepository not found");

        // Determine redirect URL logic here (Business Logic)
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        
        let basePath = '';
        
        // Handle subfolder deployment (e.g. Github Pages)
        if (pathname.includes('/suez_guide/')) {
            basePath += '/suez_guide';
        }
        
        // Handle 'public' directory structure (Important for local dev)
        if (pathname.includes('/public/')) {
            basePath += '/public';
        }
        
        let redirectUrl = `${origin}${basePath}/index.html`;
        redirectUrl = redirectUrl.replace(/([^:]\/)\/+/g, "$1");

        return await window.AuthRepository.signInWithOAuth(provider, redirectUrl);
    },

    async signOut() {
        if (!window.AuthRepository) throw new Error("AuthRepository not found");
        return await window.AuthRepository.signOut();
    }
};
