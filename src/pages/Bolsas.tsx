import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    Select,
    Textarea, // Adicionado para o campo de códigos
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
    NumberInput,
    NumberInputField,
    Wrap, // Adicionado para exibir as tags de peças
    Tag, // Adicionado para exibir as tags de peças
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../services/api";

// Tipagens atualizadas
interface Peca {
    pecaCadastradaId: number;
    codigoDaPeca: string;
}

interface Bolsa {
    bolsaId: number;
    quantidadeDePecasSemCadastro: number;
    observacoes: string | null;
    fornecedoraId: number;
    setorId: number;
    fornecedora: { nome: string };
    setor: { nome: string };
    pecasCadastradas: Peca[]; // Inclui a relação com as peças
}
interface Setor {
    setorId: number;
    nome: string;
}
interface Fornecedora {
    fornecedoraId: number;
    nome: string;
}

type BolsaFormData = {
    quantidadeDePecasSemCadastro: number;
    observacoes?: string;
    fornecedoraId: number;
    setorId: number;
    codigosDePeca?: string; // Campo para o Textarea com os códigos
};

export function Bolsas() {
    const [bolsas, setBolsas] = useState<Bolsa[]>([]);
    const [setores, setSetores] = useState<Setor[]>([]);
    const [fornecedoras, setFornecedoras] = useState<Fornecedora[]>([]);
    const [selectedBolsa, setSelectedBolsa] = useState<Bolsa | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { register, handleSubmit, reset, setValue, control } =
        useForm<BolsaFormData>();

    async function fetchData() {
        try {
            const [bolsasRes, setoresRes, fornecedorasRes] = await Promise.all([
                api.get("/bolsa"),
                api.get("/setor"),
                api.get("/fornecedora"),
            ]);
            setBolsas(bolsasRes.data);
            setSetores(setoresRes.data);
            setFornecedoras(fornecedorasRes.data);
        } catch (error) {
            toast({ title: "Erro ao buscar dados.", status: "error" });
        }
    }

    // Função de salvar modificada para processar os códigos das peças
    async function handleSave(data: BolsaFormData) {
        // Converte a string de códigos (separados por quebra de linha) em um array
        const codigosArray =
            data.codigosDePeca
                ?.split("\n")
                .filter((codigo) => codigo.trim() !== "") || [];

        const payload = {
            setorId: Number(data.setorId),
            fornecedoraId: Number(data.fornecedoraId),
            quantidadeDePecasSemCadastro: Number(
                data.quantidadeDePecasSemCadastro
            ),
            observacoes: data.observacoes,
            codigosDePeca: codigosArray, // Envia o array para a API
        };

        try {
            if (selectedBolsa) {
                await api.put(`/bolsa/${selectedBolsa.bolsaId}`, payload);
                toast({
                    title: "Bolsa atualizada com sucesso!",
                    status: "success",
                });
            } else {
                await api.post("/bolsa", payload);
                toast({
                    title: "Bolsa e peças criadas com sucesso!",
                    status: "success",
                });
            }
            resetModalAndFetch();
        } catch (error) {
            toast({ title: "Erro ao salvar bolsa.", status: "error" });
        }
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/bolsa/${id}`);
            toast({ title: "Bolsa deletada com sucesso!", status: "warning" });
            fetchData();
        } catch (error) {
            toast({ title: "Erro ao deletar bolsa.", status: "error" });
        }
    }

    // Função de abrir o modal modificada para lidar com os códigos
    function openModal(bolsa: Bolsa | null = null) {
        setSelectedBolsa(bolsa);
        if (bolsa) {
            setValue("setorId", bolsa.setorId);
            setValue("fornecedoraId", bolsa.fornecedoraId);
            setValue(
                "quantidadeDePecasSemCadastro",
                bolsa.quantidadeDePecasSemCadastro
            );
            setValue("observacoes", bolsa.observacoes || "");
            // Converte o array de peças em uma string para preencher o textarea
            const codigosString = bolsa.pecasCadastradas
                .map((p) => p.codigoDaPeca)
                .join("\n");
            setValue("codigosDePeca", codigosString);
        }
        onOpen();
    }

    function resetModalAndFetch() {
        reset();
        setSelectedBolsa(null);
        onClose();
        fetchData();
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>Gerenciar Bolsas</Heading>
                <Button colorScheme="teal" onClick={() => openModal()}>
                    Adicionar Bolsa
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Setor</Th>
                        <Th>Fornecedora</Th>
                        <Th>Peças Cadastradas</Th>
                        <Th isNumeric>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {bolsas.map((b) => (
                        <Tr key={b.bolsaId}>
                            <Td>{b.bolsaId}</Td>
                            <Td>{b.setor.nome}</Td>
                            <Td>{b.fornecedora.nome}</Td>
                            <Td>
                                <Wrap>
                                    {b.pecasCadastradas.map((p) => (
                                        <Tag key={p.pecaCadastradaId} size="sm">
                                            {p.codigoDaPeca}
                                        </Tag>
                                    ))}
                                    {b.pecasCadastradas.length === 0 &&
                                        "Nenhuma"}
                                </Wrap>
                            </Td>
                            <Td isNumeric>
                                <HStack spacing={2} justify="flex-end">
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FaEdit />}
                                        onClick={() => openModal(b)}
                                    />
                                    <IconButton
                                        aria-label="Deletar"
                                        icon={<FaTrash />}
                                        colorScheme="red"
                                        onClick={() => handleDelete(b.bolsaId)}
                                    />
                                </HStack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={resetModalAndFetch} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {selectedBolsa ? "Editar" : "Adicionar"} Bolsa
                    </ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(handleSave)}>
                        <ModalBody>
                            <VStack spacing={4}>
                                <Select
                                    placeholder="Selecione um Setor"
                                    {...register("setorId", { required: true })}
                                >
                                    {setores.map((s) => (
                                        <option
                                            key={s.setorId}
                                            value={s.setorId}
                                        >
                                            {s.nome}
                                        </option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="Selecione uma Fornecedora"
                                    {...register("fornecedoraId", {
                                        required: true,
                                    })}
                                >
                                    {fornecedoras.map((f) => (
                                        <option
                                            key={f.fornecedoraId}
                                            value={f.fornecedoraId}
                                        >
                                            {f.nome}
                                        </option>
                                    ))}
                                </Select>
                                <Controller
                                    name="quantidadeDePecasSemCadastro"
                                    control={control}
                                    render={({ field }) => (
                                        <NumberInput {...field}>
                                            <NumberInputField placeholder="Peças sem cadastro" />
                                        </NumberInput>
                                    )}
                                />
                                <Textarea
                                    placeholder="Observações (opcional)"
                                    {...register("observacoes")}
                                />
                                {/* CAMPO ADICIONADO PARA OS CÓDIGOS DAS PEÇAS */}
                                <Textarea
                                    placeholder="Cole a lista de códigos das peças aqui, um por linha."
                                    {...register("codigosDePeca")}
                                    rows={10}
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
