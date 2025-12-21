import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/login.api";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);

            toast({
                title: "Bem-vindo!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });

            navigate("/bolsas");
        },
        onError: (error: any) => {
            const message =
                error.response?.data?.message || "Erro ao tentar logar.";

            toast({
                title: "Erro no login.",
                description: message,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right",
            });
        },
    });

    const handleLogin = () => {
        if (!email || !password) {
            toast({
                title: "Atenção",
                description: "É necessário preencher todos os campos.",
                status: "warning",
                position: "top-right",
            });
            return;
        }

        mutation.mutate({ email, password });
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        toggleShowPassword: () => setShowPassword(!showPassword),

        isLoading: mutation.isPending,
        handleLogin,
    };
};
