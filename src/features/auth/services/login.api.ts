import { api } from "../../../services/api";
import {
    LoginCredentials,
    LoginResponse,
} from "../../../shared/types/auth.type";

export const login = async (
    credentials: LoginCredentials
): Promise<LoginResponse> => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
};
