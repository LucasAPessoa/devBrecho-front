import axios from "axios";
import { Navigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                console.warn("Sessão expirada");
                localStorage.removeItem("token");
                window.location.href = "/";
                return;
            }

            if (status === 500) {
                console.error("Servidor explodiu.");
            }
        }

        return Promise.reject(error);
    }
);
