import { useState } from "react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useBolsas, Bolsa, BolsaFormData } from "../index";

export function useBolsasPageLogic() {
    const [selectedBolsa, setSelectedBolsa] = useState<Bolsa | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [searchValue, setSearchValue] = useState("");

    const [appliedSearch, setAppliedSearch] = useState("");

    const {
        bolsas,
        isLoadingBolsas,
        isErrorBolsas,
        createBolsa,
        updateBolsa,
        setStatusBolsa,
    } = useBolsas(appliedSearch);

    function handleOpenModal(bolsa: Bolsa | null = null) {
        setSelectedBolsa(bolsa);
        onOpen();
    }

    function handleCloseModal() {
        setSelectedBolsa(null);
        onClose();
    }

    function handleSave(data: BolsaFormData) {
        const codigosArray =
            data.codigosDePeca
                ?.split("\n")
                .filter((c: string) => c.trim() !== "") || [];

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

        const options = {
            onSuccess: () => {
                toast({
                    title: selectedBolsa
                        ? "Bolsa atualizada!"
                        : "Bolsa criada!",
                    status: "success",
                });
                handleCloseModal();
            },
            onError: () => {
                toast({ title: "Erro ao salvar.", status: "error" });
            },
        };

        if (selectedBolsa) {
            updateBolsa(
                { id: selectedBolsa.bolsaId, dadosAtualizados: payload },
                options
            );
        } else {
            createBolsa(payload, options);
        }
    }

    function handleStatusChange(
        bolsaId: number,
        payload: { statusDevolvida: boolean; statusDoada: boolean }
    ) {
        setStatusBolsa(
            { bolsaId, payload },
            {
                onSuccess: () =>
                    toast({ title: "Status atualizado!", status: "success" }),
                onError: () =>
                    toast({
                        title: "Erro ao atualizar status.",
                        status: "error",
                    }),
            }
        );
    }

    function handleSearch() {
        setAppliedSearch(searchValue);
    }

    return {
        bolsas,
        isLoadingBolsas,
        isErrorBolsas,
        selectedBolsa,
        isOpen,
        handleOpenModal,
        handleCloseModal,
        handleSave,
        handleStatusChange,
        handleSearch,
        searchValue,
        setSearchValue,
        appliedSearch,
    };
}
