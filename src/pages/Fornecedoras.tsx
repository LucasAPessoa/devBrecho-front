import { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    HStack,
    IconButton,
    Alert,
    Spinner,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

import {
    useFornecedoras,
    Fornecedora,
    FornecedoraFormData,
    FornecedoraFormModal,
    FornecedoraDetailsModal,
} from "../features/fornecedoras/index";
import { useBolsas, Bolsa } from "../features/bolsas";

export function Fornecedoras() {
    const [selectedFornecedora, setSelectedFornecedora] =
        useState<Fornecedora | null>(null);
    const [detailsData, setDetailsData] = useState<Bolsa[]>();

    const toast = useToast();
    const {
        isOpen: isFormOpen,
        onOpen: onFormOpen,
        onClose: onFormClose,
    } = useDisclosure();
    const {
        isOpen: isDetailsOpen,
        onOpen: onDetailsOpen,
        onClose: onDetailsClose,
    } = useDisclosure();

    const {
        fornecedoras,
        isLoadingFornecedoras,
        isErrorFornecedoras,
        createFornecedora,
        updateFornecedora,
        deleteFornecedora,
    } = useFornecedoras();

    const { setStatusBolsa, getDoadaEDevolvidaBolsas } = useBolsas();

    async function handleSave(data: FornecedoraFormData) {
        const onSuccess = (msg: string) => {
            toast({ title: msg, status: "success" });
            handleCloseForm();
        };
        const onError = (msg: string) => toast({ title: msg, status: "error" });

        if (selectedFornecedora) {
            updateFornecedora(
                {
                    id: selectedFornecedora.fornecedoraId,
                    dadosAtualizados: data,
                },
                {
                    onSuccess: () =>
                        onSuccess("Fornecedora atualizada com sucesso!"),
                    onError: () => onError("Erro ao atualizar a fornecedora!"),
                }
            );
        } else {
            createFornecedora(data, {
                onSuccess: () => onSuccess("Fornecedora criada com sucesso!"),
                onError: () => onError("Erro ao criar a fornecedora!"),
            });
        }
    }

    async function handleSetStatusReset(bolsaId: number) {
        setStatusBolsa(
            {
                bolsaId,
                payload: { statusDevolvida: false, statusDoada: false },
            },
            {
                onSuccess: () =>
                    toast({ title: "Status resetado!", status: "success" }),
                onError: () =>
                    toast({
                        title: "Erro ao resetar status.",
                        status: "error",
                    }),
            }
        );
    }

    function handleOpenForm(fornecedora: Fornecedora | null = null) {
        setSelectedFornecedora(fornecedora);
        onFormOpen();
    }

    function handleCloseForm() {
        setSelectedFornecedora(null);
        onFormClose();
    }

    async function handleOpenDetails(fornecedora: Fornecedora) {
        onDetailsOpen();

        setDetailsData(undefined);

        await getDoadaEDevolvidaBolsas(fornecedora.fornecedoraId, {
            onSuccess: (data) => setDetailsData(data),
            onError: () =>
                toast({ title: "Erro ao carregar dados", status: "error" }),
        });
    }

    if (isLoadingFornecedoras) {
        return (
            <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (isErrorFornecedoras) {
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
                    Não foi possível buscar os dados.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>Gerenciar Fornecedoras</Heading>
                <Button colorScheme="teal" onClick={() => handleOpenForm()}>
                    Adicionar Fornecedora
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Código</Th>
                        <Th>Nome</Th>
                        <Th>Telefone</Th>
                        <Th isNumeric>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {fornecedoras?.map((f) => (
                        <Tr key={f.fornecedoraId}>
                            <Td>{f.codigo || "N/A"}</Td>
                            <Td
                                cursor="pointer"
                                _hover={{
                                    textDecoration: "underline",
                                    color: "blue.500",
                                }}
                                onClick={() => handleOpenDetails(f)}
                            >
                                {f.nome}
                            </Td>
                            <Td>{f.telefone || "N/A"}</Td>
                            <Td isNumeric>
                                <HStack spacing={2} justify="flex-end">
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FaEdit />}
                                        onClick={() => handleOpenForm(f)}
                                    />
                                </HStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <FornecedoraFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                selectedFornecedora={selectedFornecedora}
                onSave={handleSave}
            />

            <FornecedoraDetailsModal
                isOpen={isDetailsOpen}
                onClose={onDetailsClose}
                detailsData={detailsData}
                onResetBolsa={handleSetStatusReset}
            />
        </Box>
    );
}
