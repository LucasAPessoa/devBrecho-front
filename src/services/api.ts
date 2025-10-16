import axios from "axios";

// Pega a URL base do arquivo .env
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL,
});
