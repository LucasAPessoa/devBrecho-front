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

import { Setor, SetorFormData, useSetores } from "../features/setores/index";

export function Setores() {
    const [selectedSetor, setSelectedSetor] = useState<Setor | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { register, handleSubmit, reset, setValue } =
        useForm<SetorFormData>();

    const {
        setores,
        isLoadingSetores,
        isErrorSetores,
        createSetor,
        deleteSetor,
        updateSetor,
    } = useSetores();

    async function handleSaveSetor(data: SetorFormData) {
        if (selectedSetor) {
            updateSetor(
                {
                    id: selectedSetor.setorId,
                    dadosAtualizados: data,
                },
                {
                    onSuccess: () => {
                        toast({
                            title: "Setor atualizado com sucesso!",
                            status: "success",
                        });
                    },
                    onError: () => {
                        toast({
                            title: "Erro ao atualizar o setor",
                            status: "error",
                        });
                    },
                }
            );
        } else {
            createSetor(data, {
                onSuccess: () => {
                    toast({
                        title: "Setor criado com sucesso!",
                        status: "success",
                    });
                },
                onError: () => {
                    toast({
                        title: "Erro ao criado o setor",
                        status: "error",
                    });
                },
            });
        }
        resetModalAndFetch();
    }

    async function handleDeleteSetor(id: number) {
        deleteSetor(id, {
            onSuccess: () => {
                toast({
                    title: "Setor deletado com sucesso!",
                    status: "warning",
                });
            },
            onError: () => {
                toast({ title: "Erro ao deletar setor.", status: "error" });
            },
        });
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
    }

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
                        <Th>Nome</Th>
                        <Th isNumeric>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {setores?.map((setor) => (
                        <Tr key={setor.setorId}>
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
