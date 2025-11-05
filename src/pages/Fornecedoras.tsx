import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../services/api";

// Tipagem dos dados
interface Fornecedora {
    fornecedoraId: number;
    codigo: string;
    nome: string;
    telefone?: string;
}

interface Setor {
    setorId: number;
    nome: string;
}

interface DetailsBolsa {
    bolsaId: number;
    dataDeEntrada: string;
    dataMensagem: string;
    deletedAt: string | null;
    fornecedora: Fornecedora;
    fornecedoraId: number;
    observacoes: string;
    pecasCadastradas: Peca[];
    quantidadeDePecasSemCadastro: number;
    setor: Setor;
    setorId: number;
    statusDevolvida: boolean | null;
    statusDoada: boolean;
}

interface Peca {
    pecaCadastradaId: number;
    codigoDaPeca: string;
}

// Tipagem para o formulário
type FornecedoraFormData = {
    codigo: string;
    nome: string;
    telefone?: string;
};

export function Fornecedoras() {
    const [fornecedoras, setFornecedoras] = useState<Fornecedora[]>([]);
    const [selectedFornecedora, setSelectedFornecedora] =
        useState<Fornecedora | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [detailsData, setDetailsData] = useState<DetailsBolsa[]>();

    const {
        isOpen: isDetailsOpen,
        onOpen: onDetailsOpen,
        onClose: onDetailsClose,
    } = useDisclosure();

    const toast = useToast();
    const { register, handleSubmit, reset, setValue } =
        useForm<FornecedoraFormData>();

    async function fetchFornecedoras() {
        try {
            const response = await api.get("/fornecedoras");
            setFornecedoras(response.data);
        } catch (error) {
            toast({ title: "Erro ao buscar fornecedoras.", status: "error" });
        }
    }

    async function handleSetStatusDevolvida(bolsaId: number) {
        try {
            const payload = {
                statusDevolvida: false,
                statusDoada: false,
            };
            await api.patch(`/bolsas/${bolsaId}/status`, payload);
            toast({
                title: "Status da bolsa alterado com sucesso!",
                status: "success",
            });
        } catch {
            toast({
                title: "Erro ao alterar status da bolsa.",
                status: "error",
            });
        }
    }

    async function handleSave(data: FornecedoraFormData) {
        try {
            if (selectedFornecedora) {
                await api.put(
                    `/fornecedoras/${selectedFornecedora.fornecedoraId}`,
                    data
                );
                toast({
                    title: "Fornecedora atualizada com sucesso!",
                    status: "success",
                });
            } else {
                await api.post("/fornecedoras", data);
                toast({
                    title: "Fornecedora criada com sucesso!",
                    status: "success",
                });
            }
            resetModalAndFetch();
        } catch (error) {
            toast({ title: `Erro ao salvar fornecedora.`, status: "error" });
        }
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/fornecedoras/${id}`);
            toast({
                title: "Fornecedora deletada com sucesso!",
                status: "warning",
            });
            fetchFornecedoras();
        } catch (error) {
            toast({ title: "Erro ao deletar fornecedora.", status: "error" });
        }
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

        try {
            if (fornecedora) {
                const response = await api.get(
                    `/bolsas/doadasEDevolvidas/${fornecedora.fornecedoraId}`
                );

                const data = response.data;

                setDetailsData(data);
                console.log("DADOS RECEBIDOS:", data);
            }
        } catch (err) {
            console.error("Falha ao buscar detalhes:", err);
        }
    }

    function resetModalAndFetch() {
        reset({ codigo: "", nome: "", telefone: "" });
        setSelectedFornecedora(null);
        onClose();
        fetchFornecedoras();
    }

    function resetDetailsModalAndFetch() {
        onDetailsClose();
    }

    useEffect(() => {
        fetchFornecedoras();
    }, []);

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
                        <Th>ID</Th>
                        <Th>Código</Th>
                        <Th>Nome</Th>
                        <Th>Telefone</Th>
                        <Th isNumeric>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {fornecedoras.map((f) => (
                        <Tr key={f.fornecedoraId}>
                            <Td>{f.fornecedoraId}</Td>
                            <Td>{f.codigo || "N/A"}</Td>
                            <Td onClick={() => openModalDetails(f)}>
                                {f.nome}
                            </Td>
                            <Td>{f.telefone || "N/A"}</Td>
                            <Td isNumeric></Td>
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
                                        spacing={1}
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
                                            {d.quantidadeDePecasSemCadastro}
                                        </p>
                                        <p>
                                            <strong></strong>
                                        </p>
                                        <p>
                                            <strong>Obs:</strong>{" "}
                                            {d.observacoes || "N/A"}
                                        </p>
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
                                        spacing={1}
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
                                            onClick={() => {
                                                handleSetStatusDevolvida(
                                                    d.bolsaId
                                                );
                                            }}
                                        ></button>
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
