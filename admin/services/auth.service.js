const AuthService = {
  // 1. Credentials (Fixed inside code as requested)
  CREDENTIALS: {
    email: "admin@suezguide.com",
    password: "admin",
  },

  // 🌟 Local Storage Keys
  STORAGE_KEY: "admin_user_data",
  SESSION_KEY: "admin_logged_in",

  // 🌟 Get cached user data from localStorage
  getUserData: () => {
    try {
      const cached = localStorage.getItem(AuthService.STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error("❌ خطأ في قراءة بيانات المستخدم:", e);
      return null;
    }
  },

  // 🌟 Save user data to localStorage
  saveUserData: (userData) => {
    try {
      const dataToSave = {
        email: userData.email,
        name: userData.email.split("@")[0], // استخرج الاسم من البريد
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(dataToSave));
      console.log("✅ تم حفظ بيانات المستخدم:", dataToSave);
      return dataToSave;
    } catch (e) {
      console.error("❌ خطأ في حفظ بيانات المستخدم:", e);
      return null;
    }
  },

  // 🌟 Update last activity timestamp
  updateActivity: () => {
    try {
      const userData = AuthService.getUserData();
      if (userData) {
        userData.lastActivity = new Date().toISOString();
        localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(userData));
      }
    } catch (e) {
      console.warn("⚠️ خطأ في تحديث النشاط:", e);
    }
  },

  // 2. Login Logic
  login: (email, password) => {
    if (
      email === AuthService.CREDENTIALS.email &&
      password === AuthService.CREDENTIALS.password
    ) {
      // 🌟 حفظ بيانات المستخدم محليًا
      AuthService.saveUserData({ email });

      sessionStorage.setItem(AuthService.SESSION_KEY, "true");
      return true;
    }
    return false;
  },

  // 3. Logout Logic
  logout: () => {
    // 🌟 حذف البيانات المحفوظة
    try {
      localStorage.removeItem(AuthService.STORAGE_KEY);
      sessionStorage.removeItem(AuthService.SESSION_KEY);
      console.log("✅ تم حذف بيانات المستخدم");
    } catch (e) {
      console.error("❌ خطأ في حذف البيانات:", e);
    }

    window.location.href = window.location.pathname.includes("/pages/")
      ? "../login.html"
      : "login.html";
  },

  // 4. Auth Guard Check
  checkAuth: () => {
    const isLoggedIn = sessionStorage.getItem(AuthService.SESSION_KEY);
    if (isLoggedIn !== "true") {
      // Determine relative path to login.html
      const pathPrefix = window.location.pathname.includes("/pages/")
        ? "../"
        : "";
      window.location.href = pathPrefix + "login.html";
    } else {
      // 🌟 تحديث النشاط عند كل فحص
      AuthService.updateActivity();
    }
  },
};

window.AuthService = AuthService;
