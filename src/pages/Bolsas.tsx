import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    FormControl,
    FormLabel,
    Select,
    Textarea,
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
    Wrap,
    Tag,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import {
    FaEdit,
    FaTrash,
    FaSortUp,
    FaSortDown,
    FaArrowAltCircleUp,
    FaBoxOpen,
} from "react-icons/fa";
import { api } from "../services/api";
import { useSortableData } from "../hooks/useSortableData";

interface Peca {
    pecaCadastradaId: number;
    codigoDaPeca: string;
}

interface Fornecedora {
    fornecedoraId: number;
    codigo: string | null;
    nome: string;
}

interface Bolsa {
    bolsaId: number;
    quantidadeDePecasSemCadastro: number;
    observacoes: string | null;
    fornecedoraId: number;
    setorId: number;
    fornecedora: {
        nome: string;
        codigo: string | null;
    };
    setor: { nome: string };
    pecasCadastradas: Peca[];
    dataMensagem: string;
    statusDevolvida: boolean;
    statusDoada: boolean;
}
interface Setor {
    setorId: number;
    nome: string;
}

type BolsaFormData = {
    quantidadeDePecasSemCadastro: number;
    observacoes?: string;
    fornecedoraId: number;
    setorId: number;
    codigosDePeca?: string;
    dataMensagem: string;
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

    const { sortedData, requestSort, sortConfig } = useSortableData(bolsas);

    async function fetchData() {
        try {
            const [bolsasRes, setoresRes, fornecedorasRes] = await Promise.all([
                api.get("/bolsas"),
                api.get("/setores"),
                api.get("/fornecedoras"),
            ]);
            setBolsas(bolsasRes.data);
            setSetores(setoresRes.data);
            setFornecedoras(fornecedorasRes.data);
        } catch (error) {
            toast({ title: "Erro ao buscar dados.", status: "error" });
        }
    }

    async function handleSave(data: BolsaFormData) {
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
            codigosDasPecas: codigosArray,
            dataMensagem: data.dataMensagem,
        };

        try {
            if (selectedBolsa) {
                await api.put(`/bolsas/${selectedBolsa.bolsaId}`, payload);
                toast({
                    title: "Bolsa atualizada com sucesso!",
                    status: "success",
                });
            } else {
                await api.post("/bolsas", payload);
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
            await api.delete(`/bolsas/${id}`);
            toast({ title: "Bolsa deletada com sucesso!", status: "warning" });
            fetchData();
        } catch (error) {
            toast({ title: "Erro ao deletar bolsa.", status: "error" });
        }
    }

    async function handleSetStatus(
        bolsaId: number,
        payload: { statusDevolvida: boolean; statusDoada: boolean }
    ) {
        try {
            await api.patch(`/bolsas/${bolsaId}/status`, payload);
            toast({
                title: "Status da bolsa alterado com sucesso!",
                status: "success",
            });
            fetchData();
        } catch {
            toast({
                title: "Erro ao alterar status da bolsa.",
                status: "error",
            });
        }
    }

    function handleShowStatus(statusDevolvida: boolean, statusDoada: boolean) {
        return statusDevolvida === true
            ? "DEVOLVIDA"
            : statusDoada === true
            ? "DOADA"
            : null;
    }

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
            const codigosString = bolsa.pecasCadastradas
                .map((p) => p.codigoDaPeca)
                .join("\n");
            setValue("codigosDePeca", codigosString);
            setValue("dataMensagem", toInputDate(bolsa.dataMensagem));
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

    function formatDate(date: string): string {
        const limitDate = new Date(2022, 0, 1);
        const inputDate = new Date(date);

        if (isNaN(inputDate.getTime()) || inputDate < limitDate) {
            return "";
        }

        return inputDate.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
        });
    }

    function toInputDate(date: string | Date): string {
        if (typeof date === "string") {
            return date.split("T")[0];
        }

        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function calculatePrazo(dateMnsg: string) {
        const limitDate = new Date(2022, 0, 1);
        const inputDate = new Date(dateMnsg);

        if (isNaN(inputDate.getTime()) || inputDate < limitDate) {
            return "";
        }

        const prazoDate = new Date(inputDate);
        prazoDate.setDate(prazoDate.getDate() + 15);

        return prazoDate.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
        });
    }
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
                        {(() => {
                            const SortIcon = ({
                                columnKey,
                            }: {
                                columnKey: string;
                            }) => {
                                if (sortConfig.key !== columnKey) return null;
                                return sortConfig.direction === "asc" ? (
                                    <FaSortUp
                                        style={{
                                            display: "inline",
                                            marginLeft: "4px",
                                        }}
                                    />
                                ) : (
                                    <FaSortDown
                                        style={{
                                            display: "inline",
                                            marginLeft: "4px",
                                        }}
                                    />
                                );
                            };

                            return (
                                <>
                                    <Th
                                        cursor="pointer"
                                        userSelect="none"
                                        onClick={() =>
                                            requestSort("setor.nome")
                                        }
                                    >
                                        Setor{" "}
                                        <SortIcon columnKey="setor.nome" />
                                    </Th>
                                    <Th
                                        cursor="pointer"
                                        userSelect="none"
                                        onClick={() =>
                                            requestSort("fornecedora.codigo")
                                        }
                                    >
                                        Cód. Fornecedora{" "}
                                        <SortIcon columnKey="fornecedora.codigo" />
                                    </Th>
                                    <Th
                                        cursor="pointer"
                                        userSelect="none"
                                        onClick={() =>
                                            requestSort("fornecedora.nome")
                                        }
                                    >
                                        Fornecedora{" "}
                                        <SortIcon columnKey="fornecedora.nome" />
                                    </Th>

                                    <Th>Peças Cadastradas</Th>
                                    <Th>Total de Peças</Th>
                                    <Th
                                        cursor="pointer"
                                        userSelect="none"
                                        onClick={() =>
                                            requestSort("dataMensagem")
                                        }
                                    >
                                        Data Mensagem{" "}
                                        <SortIcon columnKey="dataMensagem" />
                                    </Th>

                                    <Th
                                        cursor="pointer"
                                        userSelect="none"
                                        onClick={() =>
                                            requestSort("dataMensagem")
                                        }
                                    >
                                        Prazo{" "}
                                        <SortIcon columnKey="dataMensagem" />
                                    </Th>

                                    <Th>Status</Th>

                                    <Th>Observações</Th>

                                    <Th isNumeric>Ações</Th>
                                </>
                            );
                        })()}
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedData.map((b) => (
                        <Tr key={b.bolsaId}>
                            <Td>{b.setor.nome}</Td>
                            <Td>{b.fornecedora.codigo || "N/A"}</Td>{" "}
                            <Td>{b.fornecedora.nome}</Td>
                            <Td>
                                <Wrap>
                                    {b.pecasCadastradas?.map((p) => (
                                        <Tag key={p.pecaCadastradaId} size="sm">
                                            {p.codigoDaPeca}
                                        </Tag>
                                    ))}
                                    {(!b.pecasCadastradas ||
                                        b.pecasCadastradas.length === 0) &&
                                        "Nenhuma"}
                                </Wrap>
                            </Td>
                            <Td>
                                {b.pecasCadastradas.length +
                                    b.quantidadeDePecasSemCadastro}
                            </Td>
                            <Td>{formatDate(b.dataMensagem)}</Td>
                            <Td>{calculatePrazo(b.dataMensagem)}</Td>
                            <Td>
                                {handleShowStatus(
                                    b.statusDevolvida,
                                    b.statusDoada
                                )}
                            </Td>
                            <Td>{b.observacoes || "N/A"}</Td>
                            <Td isNumeric>
                                <HStack spacing={3} justify="flex-end">
                                    <IconButton
                                        aria-label="Editar"
                                        icon={<FaEdit />}
                                        onClick={() => openModal(b)}
                                    />

                                    <IconButton
                                        aria-label="Devolver"
                                        icon={<FaArrowAltCircleUp />}
                                        colorScheme="blue"
                                        onClick={() =>
                                            handleSetStatus(b.bolsaId, {
                                                statusDevolvida: true,
                                                statusDoada: false,
                                            })
                                        }
                                    />
                                    <IconButton
                                        aria-label="Doar"
                                        icon={<FaBoxOpen />}
                                        colorScheme="blue"
                                        onClick={() =>
                                            handleSetStatus(b.bolsaId, {
                                                statusDevolvida: false,
                                                statusDoada: true,
                                            })
                                        }
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
                                            {f.codigo ? `${f.codigo} - ` : ""}
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
                                <FormControl isRequired>
                                    <FormLabel htmlFor="dataMensagem">
                                        Data da Mensagem
                                    </FormLabel>
                                    <Input
                                        id="dataMensagem"
                                        type="date"
                                        {...register("dataMensagem", {
                                            required: true,
                                        })}
                                    />
                                </FormControl>
                                <Textarea
                                    placeholder="Observações (opcional)"
                                    {...register("observacoes")}
                                />
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
