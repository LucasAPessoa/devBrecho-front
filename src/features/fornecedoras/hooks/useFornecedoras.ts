import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as fornecedorasApi from "../services/fornecedoras.api";

export const useFornecedoras = () => {
    const queryClient = useQueryClient();

    const {
        data: fornecedoras,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["fornecedoras"],
        queryFn: fornecedorasApi.getAllFornecedoras,
    });

    const { mutate: createFornecedora, isPending: isCreating } = useMutation({
        mutationFn: fornecedorasApi.createFornecedora,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fornecedoras"] });
        },
    });

    const { mutate: deleteFornecedora, isPending: isDeleting } = useMutation({
        mutationFn: fornecedorasApi.deleteFornecedora,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fornecedoras"] });
        },
    });

    const { mutate: updateFornecedora, isPending: isUpdating } = useMutation({
        mutationFn: fornecedorasApi.updateFornecedora,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fornecedoras"] });
        },
    });

    return {
        fornecedoras,
        isLoadingFornecedoras: isLoading,
        isErrorFornecedoras: isError,
        errorFornecedoras: error,

        createFornecedora,
        isCreatingFornecedora: isCreating,
        deleteFornecedora,
        isDeletingFornecedora: isDeleting,
        updateFornecedora,
        isUpdatingFornecedora: isUpdating,
    };
};
