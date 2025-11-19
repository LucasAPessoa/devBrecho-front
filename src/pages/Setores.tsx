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
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

import {
    Setor,
    SetorFormData,
    useSetores,
    SetorFormModal,
} from "../features/setores/index";

export function Setores() {
    const [selectedSetor, setSelectedSetor] = useState<Setor | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const {
        setores,
        isLoadingSetores,
        isErrorSetores,
        createSetor,
        deleteSetor,
        updateSetor,
    } = useSetores();

    async function handleSaveSetor(data: SetorFormData) {
        const onSuccess = (msg: string) => {
            toast({ title: msg, status: "success" });
            handleCloseModal();
        };
        const onError = (msg: string) => toast({ title: msg, status: "error" });

        if (selectedSetor) {
            updateSetor(
                { id: selectedSetor.setorId, dadosAtualizados: data },
                {
                    onSuccess: () => onSuccess("Setor atualizado com sucesso!"),
                    onError: () => onError("Erro ao atualizar o setor"),
                }
            );
        } else {
            createSetor(data, {
                onSuccess: () => onSuccess("Setor criado com sucesso!"),
                onError: () => onError("Erro ao criar o setor"),
            });
        }
    }

    async function handleDeleteSetor(id: number) {
        if (!window.confirm("Tem certeza que quer apagar este setor, bo?"))
            return;

        deleteSetor(id, {
            onSuccess: () =>
                toast({
                    title: "Setor deletado com sucesso!",
                    status: "warning",
                }),
            onError: () =>
                toast({ title: "Erro ao deletar setor.", status: "error" }),
        });
    }

    function handleOpenModal(setor: Setor | null = null) {
        setSelectedSetor(setor);
        onOpen();
    }

    function handleCloseModal() {
        setSelectedSetor(null);
        onClose();
    }

    if (isLoadingSetores) {
        return (
            <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" color="teal.500" />
            </Flex>
        );
    }

    if (isErrorSetores) {
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
                    Não foi possível carregar os setores.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>Gerenciar Setores</Heading>
                <Button colorScheme="teal" onClick={() => handleOpenModal()}>
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
                                        onClick={() => handleOpenModal(setor)}
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

            <SetorFormModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                selectedSetor={selectedSetor}
                onSave={handleSaveSetor}
            />
        </Box>
    );
}
