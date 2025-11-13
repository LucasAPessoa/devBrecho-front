import { Box, Flex, Link as ChakraLink, VStack } from "@chakra-ui/react";
import { Link as RouterLink, Outlet } from "react-router-dom";

export function Layout() {
    return (
        <Flex>
            <Box w="250px" bg="gray.100" p={4} h="100vh">
                <VStack align="stretch" spacing={4}>
                    <ChakraLink as={RouterLink} to="/setores" fontSize="lg">
                        Setores
                    </ChakraLink>
                    <ChakraLink
                        as={RouterLink}
                        to="/fornecedoras"
                        fontSize="lg"
                    >
                        Fornecedoras
                    </ChakraLink>
                    <ChakraLink as={RouterLink} to="/bolsas" fontSize="lg">
                        Bolsas
                    </ChakraLink>
                </VStack>
            </Box>
            <Box flex="1" p={8}>
                <Outlet />{" "}
            </Box>
        </Flex>
    );
}
