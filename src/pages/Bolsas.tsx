import { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    useDisclosure,
    useToast,
    Spinner,
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { useSortableData } from "../shared/hooks/useSortableData";

import {
    useBolsas,
    Bolsa,
    BolsaFormData,
    BolsasTable,
    BolsaFormModal,
} from "../features/bolsas";

import { useFornecedoras } from "../features/fornecedoras/index";
import { toInputDate } from "../shared/utils/formatters";
import { useSetores } from "../features/setores";

export function Bolsas() {
    const [selectedBolsa, setSelectedBolsa] = useState<Bolsa | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { reset, setValue } = useForm<BolsaFormData>();

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

    const { fornecedoras } = useFornecedoras();
    const { setores } = useSetores();

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
            },
            onError: () => {
                toast({ title: "Erro ao deletar bolsa.", status: "error" });
            },
        });
    }

    async function handleStatusChange(
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

    function handleOpenModal(bolsa: Bolsa | null = null) {
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
                <Button colorScheme="teal" onClick={() => handleOpenModal()}>
                    Adicionar Bolsa
                </Button>
            </Flex>

            <BolsasTable
                bolsas={sortedData}
                sortConfig={sortConfig}
                requestSort={requestSort}
                onEdit={handleOpenModal}
                onStatusChange={handleStatusChange}
            />
            <BolsaFormModal
                isOpen={isOpen}
                onClose={onClose}
                onSave={handleSave}
                initialData={selectedBolsa}
                setores={setores ?? []}
                fornecedoras={fornecedoras ?? []}
            />
        </Box>
    );
}
