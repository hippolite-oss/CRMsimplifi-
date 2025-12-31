// ========== utils/Axios.js ==========
import axios from "axios";

// Déterminer l'URL backend selon l'environnement
const backendType = import.meta.env.VITE_APP_BACKEND_TYPE || "node";
const isProd = import.meta.env.VITE_APP_NODE_ENV === "production";

const getBaseUrl = () => {
  switch (backendType) {
    case "node":
      return isProd
        ? import.meta.env.VITE_APP_NODE_API_PROD_URL
        : import.meta.env.VITE_APP_NODE_API_URL;
    case "django":
      return isProd
        ? import.meta.env.VITE_APP_DJANGO_API_PROD_URL
        : import.meta.env.VITE_APP_DJANGO_API_URL;
    case "laravel":
      return isProd
        ? import.meta.env.VITE_APP_LARAVEL_API_PROD_URL
        : import.meta.env.VITE_APP_LARAVEL_API_URL;
    default:
      return import.meta.env.VITE_APP_NODE_API_URL || "http://localhost:5000";
  }
};

const app_url = getBaseUrl();
console.log("API URL:", app_url);

// Créer l'instance Axios
const Axios = axios.create({
  baseURL: app_url,
  withCredentials: true,
  timeout: 10000,
});

// ========== INTERCEPTEUR REQUEST ==========
// Ajouter le token Bearer à chaque requête
Axios.interceptors.request.use(
  async (config) => {
    // Récupérer le token (localStorage ou sessionStorage)
    const token = localStorage.getItem("accessToken") || 
                  sessionStorage.getItem("accessToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// ========== INTERCEPTEUR RESPONSE ==========
// Gérer le refresh token automatiquement en cas de 401
Axios.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 (token expiré) et pas déjà en retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Récupérer le refresh token
        const refreshToken = localStorage.getItem("refreshToken") || 
                             sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        console.log("🔄 Token expired, refreshing...");

        // Appeler l'API de refresh (sans interceptor pour éviter la boucle)
        const plainAxios = axios.create({
          baseURL: app_url,
          withCredentials: true,
        });

        const response = await plainAxios.post("/api/users/refresh-token", {
          refreshToken,
        });

        if (response.data.success) {
          const newAccessToken = response.data.accessToken;

          // Mettre à jour le token dans le storage approprié
          if (localStorage.getItem("accessToken")) {
            localStorage.setItem("accessToken", newAccessToken);
          } else {
            sessionStorage.setItem("accessToken", newAccessToken);
          }

          // Mettre à jour l'Authorization header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          console.log("✅ Token refreshed successfully");

          // Réessayer la requête originale
          return Axios(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        // Nettoyer les tokens et rediriger vers login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        // Redirection vers login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.error("❌ Response error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default Axios;