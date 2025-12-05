import { useState, useEffect, useMemo } from "react";
import {
    Box,
    Flex,
    Heading,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";

import { Bolsa, useBolsas, PrazosTable } from "../features/bolsas";

export function Prazos() {
    const { getBolsaGroupedByDataMensagem } = useBolsas();

    const [rawGroupedData, setRawGroupedData] = useState<
        { date: string; bolsas: Bolsa[] }[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    }>({
        key: "prazo",
        direction: "asc",
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getBolsaGroupedByDataMensagem();
                setRawGroupedData(data);
                setIsError(false);
            } catch (error) {
                console.error("Erro ao buscar prazos:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const processedData = useMemo(() => {
        if (!rawGroupedData) return [];

        const dataCopy = JSON.parse(JSON.stringify(rawGroupedData));

        return dataCopy.map((grupo: { data: string; bolsas: Bolsa[] }) => {
            grupo.bolsas.sort((a: any, b: any) => {
                const getValue = (obj: any, path: string) => {
                    return path
                        .split(".")
                        .reduce((o, i) => (o ? o[i] : null), obj);
                };

                let valA = getValue(a, sortConfig.key);
                let valB = getValue(b, sortConfig.key);

                if (
                    sortConfig.key === "dataMensagem" ||
                    sortConfig.key === "prazo"
                ) {
                    valA = new Date(a.dataMensagem).getTime();
                    valB = new Date(b.dataMensagem).getTime();
                }

                if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
                if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });

            return grupo;
        });
    }, [rawGroupedData, sortConfig]);

    const handleRequestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    if (isLoading) {
        return (
            <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" color="teal.500" />
            </Flex>
        );
    }

    if (isError) {
        return (
            <Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
                borderRadius="md"
            >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    Opa! Ocorreu um erro
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    Não foi possível carregar a lista de prazos.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>Controle de Prazos</Heading>
            </Flex>

            <PrazosTable
                groupedBolsas={processedData}
                sortConfig={sortConfig}
                requestSort={handleRequestSort}
            />
        </Box>
    );
}
