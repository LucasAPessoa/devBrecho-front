import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Select,
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

// Tipagens
interface Peca {
    pecaCadastradaId: number;
    codigoDaPeca: string;
    bolsaId: number;
    bolsa: { bolsaId: number; observacoes: string | null };
}
interface Bolsa {
    bolsaId: number;
    observacoes: string | null;
}
type PecaFormData = {
    codigoDaPeca: string;
    bolsaId: number;
};

export function Pecas() {
    const [pecas, setPecas] = useState<Peca[]>([]);
    const [bolsas, setBolsas] = useState<Bolsa[]>([]);
    const [selectedPeca, setSelectedPeca] = useState<Peca | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { register, handleSubmit, reset, setValue } = useForm<PecaFormData>();

    async function fetchData() {
        try {
            const [pecasRes, bolsasRes] = await Promise.all([
                api.get("/peca"),
                api.get("/bolsa"),
            ]);
            setPecas(pecasRes.data);
            setBolsas(bolsasRes.data);
        } catch (error) {
            toast({ title: "Erro ao buscar dados.", status: "error" });
        }
    }

    async function handleSave(data: PecaFormData) {
        const payload = { ...data, bolsaId: Number(data.bolsaId) };
        try {
            if (selectedPeca) {
                await api.put(
                    `/peca/${selectedPeca.pecaCadastradaId}`,
                    payload
                );
                toast({
                    title: "Peça atualizada com sucesso!",
                    status: "success",
                });
            } else {
                await api.post("/peca", payload);
                toast({ title: "Peça criada com sucesso!", status: "success" });
            }
            resetModalAndFetch();
        } catch (error) {
            toast({ title: "Erro ao salvar peça.", status: "error" });
        }
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/peca/${id}`);
            toast({ title: "Peça deletada com sucesso!", status: "warning" });
            fetchData();
        } catch (error) {
            toast({ title: "Erro ao deletar peça.", status: "error" });
        }
    }

    function openModal(peca: Peca | null = null) {
        setSelectedPeca(peca);
        if (peca) {
            setValue("codigoDaPeca", peca.codigoDaPeca);
            setValue("bolsaId", peca.bolsaId);
        }
        onOpen();
    }

    function resetModalAndFetch() {
        reset({ codigoDaPeca: "", bolsaId: 0 });
        setSelectedPeca(null);
        onClose();
        fetchData();
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>Gerenciar Peças</Heading>
                <Button colorScheme="teal" onClick={() => openModal()}>
                    Adicionar Peça
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Código</Th>
                        <Th>Bolsa ID</Th>
                        <Th isNumeric>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {pecas.map((p) => (
                        <Tr key={p.pecaCadastradaId}>
                            <Td>{p.pecaCadastradaId}</Td>
                            <Td>{p.codigoDaPeca}</Td>
                            <Td>{p.bolsaId}</Td>
                            <Td isNumeric>
                                <HStack spacing={2} justify="flex-end">
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FaEdit />}
                                        onClick={() => openModal(p)}
                                    />
                                    <IconButton
                                        aria-label="Deletar"
                                        icon={<FaTrash />}
                                        colorScheme="red"
                                        onClick={() =>
                                            handleDelete(p.pecaCadastradaId)
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
                        {selectedPeca ? "Editar" : "Adicionar"} Peça
                    </ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(handleSave)}>
                        <ModalBody>
                            <VStack spacing={4}>
                                <Input
                                    placeholder="Código da Peça"
                                    {...register("codigoDaPeca", {
                                        required: true,
                                    })}
                                />
                                <Select
                                    placeholder="Selecione a Bolsa"
                                    {...register("bolsaId", { required: true })}
                                >
                                    {bolsas.map((b) => (
                                        <option
                                            key={b.bolsaId}
                                            value={b.bolsaId}
                                        >
                                            Bolsa ID: {b.bolsaId} (
                                            {b.observacoes || "Sem obs."})
                                        </option>
                                    ))}
                                </Select>
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
