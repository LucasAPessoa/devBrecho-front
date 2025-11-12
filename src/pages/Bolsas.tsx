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
    Spinner,
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import {
    FaEdit,
    FaSortUp,
    FaSortDown,
    FaArrowAltCircleUp,
    FaBoxOpen,
} from "react-icons/fa";
import { api } from "../services/api";
import { useSortableData } from "../shared/hooks/useSortableData";

import {
    useBolsas,
    //BolsasList,
    Bolsa,
    BolsaFormData,
    Setor,
} from "../features/bolsas";

import { Fornecedora } from "../features/fornecedoras/index";

export function Bolsas() {
    const [setores, setSetores] = useState<Setor[]>([]);
    const [fornecedoras, setFornecedoras] = useState<Fornecedora[]>([]);
    const [selectedBolsa, setSelectedBolsa] = useState<Bolsa | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { register, handleSubmit, reset, setValue, control } =
        useForm<BolsaFormData>();

    const {
        bolsas,
        isLoadingBolsas,
        isErrorBolsas,
        createBolsa,
        updateBolsa,
        deleteBolsa,
        setStatusBolsa,
    } = useBolsas();

    const { sortedData, requestSort, sortConfig } = useSortableData(
        bolsas || []
    );

    async function fetchData() {
        try {
            const [setoresRes, fornecedorasRes] = await Promise.all([
                api.get("/setores"),
                api.get("/fornecedoras"),
            ]);

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

        if (selectedBolsa) {
            updateBolsa(
                { id: selectedBolsa.bolsaId, dadosAtualizados: payload },
                {
                    onSuccess: () => {
                        toast({
                            title: "Bolsa atualizada com sucesso!",
                            status: "success",
                        });
                        resetModalAndFetch();
                    },
                    onError: () => {
                        toast({
                            title: "Erro ao atualizar bolsa.",
                            status: "error",
                        });
                    },
                }
            );
        } else {
            createBolsa(payload, {
                onSuccess: () => {
                    toast({
                        title: "Bolsa e peças criadas com sucesso!",
                        status: "success",
                    });
                    resetModalAndFetch();
                },
                onError: () => {
                    toast({ title: "Erro ao criar bolsa.", status: "error" });
                },
            });
        }
    }

    async function handleDelete(id: number) {
        deleteBolsa(id, {
            onSuccess: () => {
                toast({
                    title: "Bolsa deletada com sucesso!",
                    status: "warning",
                });
                fetchData();
            },
            onError: () => {
                toast({ title: "Erro ao deletar bolsa.", status: "error" });
            },
        });
    }

    async function handleSetStatus(
        bolsaId: number,
        payload: { statusDevolvida: boolean; statusDoada: boolean }
    ) {
        setStatusBolsa(
            { bolsaId, payload },
            {
                onSuccess: () => {
                    toast({
                        title: "Status da bolsa alterado com sucesso!",
                        status: "success",
                    });
                    fetchData();
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

    if (isLoadingBolsas) {
        return (
            <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (isErrorBolsas) {
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
