import { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    VStack,
    HStack,
    IconButton,
    Alert,
    Spinner,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";

import {
    useFornecedoras,
    Fornecedora,
    FornecedoraFormData,
} from "../features/fornecedoras/index";

import { useBolsas, Bolsa } from "../features/bolsas";

export function Fornecedoras() {
    const [selectedFornecedora, setSelectedFornecedora] =
        useState<Fornecedora | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [detailsData, setDetailsData] = useState<Bolsa[]>();

    const {
        fornecedoras,
        isLoadingFornecedoras,
        isErrorFornecedoras,
        createFornecedora,
        updateFornecedora,
        deleteFornecedora,
    } = useFornecedoras();

    const { setStatusBolsa, getDoadaEDevolvidaBolsas } = useBolsas();

    const {
        isOpen: isDetailsOpen,
        onOpen: onDetailsOpen,
        onClose: onDetailsClose,
    } = useDisclosure();

    const toast = useToast();

    const { register, handleSubmit, reset, setValue } =
        useForm<FornecedoraFormData>();

    async function handleSetStatusReset(bolsaId: number) {
        const payload = { statusDevolvida: false, statusDoada: false };
        setStatusBolsa(
            { bolsaId, payload },
            {
                onSuccess: () => {
                    toast({
                        title: "Status da bolsa alterado com sucesso!",
                        status: "success",
                    });
                },
                onError: () => {
                    toast({
                        title: "Erro ao alterar status da bolsa.",
                        status: "error",
                    });
                },
            }
        );
    }

    async function handleSave(data: FornecedoraFormData) {
        if (selectedFornecedora) {
            updateFornecedora(
                {
                    id: selectedFornecedora.fornecedoraId,
                    dadosAtualizados: data,
                },
                {
                    onSuccess: () =>
                        toast({
                            title: "Fornecedora atualizada com sucesso!",
                            status: "success",
                        }),
                    onError: () =>
                        toast({
                            title: "Erro ao atualizar a fornecedora!",
                            status: "error",
                        }),
                }
            );
        } else {
            createFornecedora(data, {
                onSuccess: () => {
                    toast({
                        title: "Fornecedora criada com sucesso!",
                        status: "success",
                    });
                },
                onError: () => {
                    toast({
                        title: "Erro ao criar a fornecedora!",
                        status: "error",
                    });
                },
            });
        }
        resetModalAndFetch();
    }

    async function handleDelete(id: number) {
        deleteFornecedora(id, {
            onSuccess: () => {
                toast({
                    title: "Fornecedora deletada com sucesso!",
                    status: "warning",
                });
            },
            onError: () => {
                toast({
                    title: "Erro ao deletar fornecedora.",
                    status: "error",
                });
            },
        });
    }

    function openModal(fornecedora: Fornecedora | null = null) {
        setSelectedFornecedora(fornecedora);
        if (fornecedora) {
            setValue("codigo", fornecedora.codigo);
            setValue("nome", fornecedora.nome);
            setValue("telefone", fornecedora.telefone);
        }
        onOpen();
    }

    async function openModalDetails(fornecedora: Fornecedora | null = null) {
        onDetailsOpen();

        if (fornecedora) {
            const data = await getDoadaEDevolvidaBolsas(
                fornecedora.fornecedoraId,
                {
                    onSuccess: () => {
                        setDetailsData(data);
                    },
                    onError: () => {
                        toast({
                            title: "Erro ao carregar doadas e devolvidas",
                            status: "error",
                        });
                    },
                }
            );
        }
    }

    function resetModalAndFetch() {
        reset({ codigo: "", nome: "", telefone: "" });
        setSelectedFornecedora(null);
        onClose();
    }

    function resetDetailsModalAndFetch() {
        onDetailsClose();
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
                    Não foi possível buscar os dados. Tente recarregar a página
                    ou peça ajuda de um desenvolvedor.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>Gerenciar Fornecedoras</Heading>
                <Button colorScheme="teal" onClick={() => openModal()}>
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
                            <Td onClick={() => openModalDetails(f)}>
                                {f.nome}
                            </Td>
                            <Td>{f.telefone || "N/A"}</Td>
                            <Td isNumeric>
                                <HStack spacing={2} justify="flex-end">
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FaEdit />}
                                        onClick={() => openModal(f)}
                                    />
                                </HStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={resetModalAndFetch}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {selectedFornecedora ? "Editar" : "Adicionar"}{" "}
                        Fornecedora
                    </ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(handleSave)}>
                        <ModalBody>
                            <VStack spacing={4}>
                                <Input
                                    placeholder="Código (opcional)"
                                    {...register("codigo")}
                                />{" "}
                                <Input
                                    placeholder="Nome da Fornecedora"
                                    {...register("nome", { required: true })}
                                />
                                <Input
                                    placeholder="Telefone (opcional)"
                                    {...register("telefone")}
                                />
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} type="submit">
                                Salvar
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={resetModalAndFetch}
                            >
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
            <Modal isOpen={isDetailsOpen} onClose={resetDetailsModalAndFetch}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Detalhes da Fornecedora</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Heading size="md" mt={6} mb={3}>
                            Bolsas Devolvidas
                        </Heading>

                        <Box
                            maxH="200px"
                            overflowY="auto"
                            pr={4}
                            borderWidth="1px"
                            borderRadius="md"
                            p={2}
                        >
                            {detailsData
                                ?.filter(
                                    (bolsa) => bolsa.statusDevolvida === true
                                )
                                .map((d) => (
                                    <VStack
                                        key={d.bolsaId}
                                        spacing={2}
                                        align="stretch"
                                        mb={2}
                                        p={2}
                                        borderWidth={1}
                                        borderRadius="md"
                                        bg="gray.50"
                                    >
                                        <p>
                                            <strong>
                                                Quantidade de Pecas:
                                            </strong>{" "}
                                            {d.quantidadeDePecasSemCadastro +
                                                d.pecasCadastradas.length}
                                        </p>

                                        <p>
                                            <strong>Obs:</strong>{" "}
                                            {d.observacoes || "N/A"}
                                        </p>
                                        <button
                                            color="blue"
                                            onClick={() => {
                                                handleSetStatusReset(d.bolsaId);
                                            }}
                                        >
                                            Reset
                                        </button>
                                    </VStack>
                                ))}

                            {detailsData?.filter(
                                (bolsa) => bolsa.statusDevolvida === true
                            ).length === 0 && (
                                <p>Nenhuma bolsa devolvida encontrada.</p>
                            )}
                        </Box>
                        <Heading size="md" mt={6} mb={3}>
                            Bolsas Doadas
                        </Heading>

                        <Box
                            maxH="200px"
                            overflowY="auto"
                            pr={4}
                            borderWidth="1px"
                            borderRadius="md"
                            p={2}
                        >
                            {detailsData
                                ?.filter((bolsa) => bolsa.statusDoada === true)
                                .map((d) => (
                                    <VStack
                                        key={d.bolsaId}
                                        spacing={2}
                                        align="stretch"
                                        mb={2}
                                        p={2}
                                        borderWidth={1}
                                        borderRadius="md"
                                        bg="gray.50"
                                    >
                                        <p>
                                            <strong>Bolsa ID:</strong>{" "}
                                            {d.bolsaId}
                                        </p>
                                        <p>
                                            <strong>Obs:</strong>{" "}
                                            {d.observacoes || "N/A"}
                                        </p>

                                        <button
                                            color="blue"
                                            onClick={() => {
                                                handleSetStatusReset(d.bolsaId);
                                            }}
                                        >
                                            Reset
                                        </button>
                                    </VStack>
                                ))}

                            {detailsData?.filter(
                                (bolsa) => bolsa.statusDoada === true
                            ).length === 0 && (
                                <p>Nenhuma bolsa doada encontrada.</p>
                            )}
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => isDetailsOpen}
                        >
                            Salvar
                        </Button>
                        <Button variant="ghost" onClick={resetModalAndFetch}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
