import {
    Flex,
    Stack,
    Heading,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { useLogin } from "../features/auth/hooks/useLogin";
import { LoginForm } from "../features/auth/components/LoginForm";

export function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        toggleShowPassword,
        isLoading,
        handleLogin,
    } = useLogin();

    const bgPage = useColorModeValue("gray.50", "gray.800");

    return (
        <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bgPage}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>DevBrechó</Heading>
                    <Text fontSize={"lg"} color={"gray.600"}>
                        Login
                    </Text>
                </Stack>

                <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    toggleShowPassword={toggleShowPassword}
                    isLoading={isLoading}
                    onSubmit={handleLogin}
                />
            </Stack>
        </Flex>
    );
}
