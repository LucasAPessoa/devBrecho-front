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

interface Setor {
    setorId: number;
    nome: string;
}

type SetorFormData = {
    nome: string;
};

export function Setores() {
    const [setores, setSetores] = useState<Setor[]>([]);
    const [selectedSetor, setSelectedSetor] = useState<Setor | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { register, handleSubmit, reset, setValue } =
        useForm<SetorFormData>();

    async function fetchSetores() {
        try {
            const response = await api.get("/setores");
            setSetores(response.data);
        } catch (error) {
            toast({
                title: "Erro ao buscar setores.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    async function handleSaveSetor(data: SetorFormData) {
        try {
            if (selectedSetor) {
                await api.put(`/setores/${selectedSetor.setorId}`, data);
                toast({
                    title: "Setor atualizado com sucesso!",
                    status: "success",
                });
            } else {
                await api.post("/setores", data);
                toast({
                    title: "Setor criado com sucesso!",
                    status: "success",
                });
            }
            resetModalAndFetch();
        } catch (error) {
            toast({ title: `Erro ao salvar setor.`, status: "error" });
        }
    }

    async function handleDeleteSetor(id: number) {
        try {
            await api.delete(`/setores/${id}`);
            toast({ title: "Setor deletado com sucesso!", status: "warning" });
            fetchSetores();
        } catch (error) {
            toast({ title: "Erro ao deletar setor.", status: "error" });
        }
    }

    function openModal(setor: Setor | null = null) {
        setSelectedSetor(setor);
        if (setor) {
            setValue("nome", setor.nome);
        }
        onOpen();
    }

    function resetModalAndFetch() {
        reset({ nome: "" });
        setSelectedSetor(null);
        onClose();
        fetchSetores();
    }

    useEffect(() => {
        fetchSetores();
    }, []);

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>Gerenciar Setores</Heading>
                <Button colorScheme="teal" onClick={() => openModal()}>
                    Adicionar Setor
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Nome</Th>
                        <Th isNumeric>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {setores.map((setor) => (
                        <Tr key={setor.setorId}>
                            <Td>{setor.setorId}</Td>
                            <Td>{setor.nome}</Td>
                            <Td isNumeric>
                                <HStack spacing={2} justify="flex-end">
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FaEdit />}
                                        onClick={() => openModal(setor)}
                                    />
                                    <IconButton
                                        aria-label="Deletar"
                                        icon={<FaTrash />}
                                        colorScheme="red"
                                        onClick={() =>
                                            handleDeleteSetor(setor.setorId)
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
                        {selectedSetor
                            ? "Editar Setor"
                            : "Adicionar Novo Setor"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(handleSaveSetor)}>
                        <ModalBody>
                            <VStack spacing={4}>
                                <Input
                                    placeholder="Nome do Setor"
                                    {...register("nome", { required: true })}
                                />
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} type="submit">
                                {" "}
                                Salvar{" "}
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
