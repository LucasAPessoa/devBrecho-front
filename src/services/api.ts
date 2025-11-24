import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                console.warn("Sessão expirada");
                //TODO:Redireccionar a login
            }

            if (status === 500) {
                console.error("Servidor explodiu.");
            }
        }

        return Promise.reject(error);
    }
);
