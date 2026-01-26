const AuthService = {
    // 1. Credentials (Fixed inside code as requested)
    CREDENTIALS: {
        email: 'admin@suezguide.com',
        password: 'admin' 
    },

    // 2. Login Logic
    login: (email, password) => {
        if (email === AuthService.CREDENTIALS.email && password === AuthService.CREDENTIALS.password) {
            sessionStorage.setItem('admin_logged_in', 'true');
            return true;
        }
        return false;
    },

    // 3. Logout Logic
    logout: () => {
        sessionStorage.removeItem('admin_logged_in');
        window.location.href = (window.location.pathname.includes('/pages/')) ? '../login.html' : 'login.html';
    },

    // 4. Auth Guard Check
    checkAuth: () => {
        const isLoggedIn = sessionStorage.getItem('admin_logged_in');
        if (isLoggedIn !== 'true') {
            // Determine relative path to login.html
            const pathPrefix = (window.location.pathname.includes('/pages/')) ? '../' : '';
            window.location.href = pathPrefix + 'login.html';
        }
    }
};

window.AuthService = AuthService;
