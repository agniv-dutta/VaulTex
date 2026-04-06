import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const tokenFromStore = useAuthStore.getState().token;
  const tokenFromStorage =
    typeof window !== "undefined" ? localStorage.getItem("vaultex_token") : null;
  const token = tokenFromStore ?? tokenFromStorage;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        localStorage.removeItem("vaultex_token");
        localStorage.removeItem("vaultex_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

