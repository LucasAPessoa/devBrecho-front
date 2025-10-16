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
    nome: string;
    telefone?: string;
}

// Tipagem para o formulário
type FornecedoraFormData = {
    nome: string;
    telefone?: string;
};

export function Fornecedoras() {
    const [fornecedoras, setFornecedoras] = useState<Fornecedora[]>([]);
    const [selectedFornecedora, setSelectedFornecedora] =
        useState<Fornecedora | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { register, handleSubmit, reset, setValue } =
        useForm<FornecedoraFormData>();

    async function fetchFornecedoras() {
        try {
            const response = await api.get("/fornecedora");
            setFornecedoras(response.data);
        } catch (error) {
            toast({ title: "Erro ao buscar fornecedoras.", status: "error" });
        }
    }

    async function handleSave(data: FornecedoraFormData) {
        try {
            if (selectedFornecedora) {
                await api.put(
                    `/fornecedora/${selectedFornecedora.fornecedoraId}`,
                    data
                );
                toast({
                    title: "Fornecedora atualizada com sucesso!",
                    status: "success",
                });
            } else {
                await api.post("/fornecedora", data);
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
            await api.delete(`/fornecedora/${id}`);
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
            setValue("nome", fornecedora.nome);
            setValue("telefone", fornecedora.telefone);
        }
        onOpen();
    }

    function resetModalAndFetch() {
        reset({ nome: "", telefone: "" });
        setSelectedFornecedora(null);
        onClose();
        fetchFornecedoras();
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
                        <Th>Nome</Th>
                        <Th>Telefone</Th>
                        <Th isNumeric>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {fornecedoras.map((f) => (
                        <Tr key={f.fornecedoraId}>
                            <Td>{f.fornecedoraId}</Td>
                            <Td>{f.nome}</Td>
                            <Td>{f.telefone || "N/A"}</Td>
                            <Td isNumeric>
                                <HStack spacing={2} justify="flex-end">
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FaEdit />}
                                        onClick={() => openModal(f)}
                                    />
                                    <IconButton
                                        aria-label="Deletar"
                                        icon={<FaTrash />}
                                        colorScheme="red"
                                        onClick={() =>
                                            handleDelete(f.fornecedoraId)
                                        }
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
        </Box>
    );
}
