import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    InputGroup,
    InputRightElement,
    IconButton,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface LoginFormProps {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    showPassword: boolean;
    toggleShowPassword: () => void;
    isLoading: boolean;
    onSubmit: () => void;
}

export function LoginForm({
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    isLoading,
    onSubmit,
}: LoginFormProps) {
    const bgBox = useColorModeValue("white", "gray.700");

    return (
        <Box
            rounded={"lg"}
            bg={bgBox}
            boxShadow={"lg"}
            p={8}
            minW={{ base: "90vw", md: "400px" }}
        >
            <Stack spacing={4}>
                <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="dev@brecho.com"
                    />
                </FormControl>

                <FormControl id="password">
                    <FormLabel>Senha</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                        />
                        <InputRightElement h={"full"}>
                            <IconButton
                                variant={"ghost"}
                                aria-label="Toggle password"
                                icon={
                                    showPassword ? (
                                        <ViewOffIcon />
                                    ) : (
                                        <ViewIcon />
                                    )
                                }
                                onClick={toggleShowPassword}
                            />
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Stack spacing={10}>
                    <Stack
                        direction={{ base: "column", sm: "row" }}
                        align={"start"}
                        justify={"space-between"}
                    >
                        <Checkbox>Lembrar de mim</Checkbox>
                        <Text color={"blue.400"} cursor="pointer">
                            Esqueceu?
                        </Text>
                    </Stack>

                    <Button
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{ bg: "blue.500" }}
                        isLoading={isLoading}
                        loadingText="Entrando..."
                        onClick={onSubmit}
                    >
                        Entrar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
