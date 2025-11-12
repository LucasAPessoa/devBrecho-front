import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as bolsasApi from "../services/bolsas.api";

export const useBolsas = () => {
    const queryClient = useQueryClient();

    const {
        data: bolsas,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["bolsas"],
        queryFn: bolsasApi.getAllBolsas,
    });

    const { mutate: createBolsa, isPending: isCreating } = useMutation({
        mutationFn: bolsasApi.createBolsa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bolsas"] });
        },
    });

    const { mutate: deleteBolsa, isPending: isDeleting } = useMutation({
        mutationFn: bolsasApi.deleteBolsa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bolsas"] });
        },
    });

    const { mutate: updateBolsa, isPending: isUpdating } = useMutation({
        mutationFn: bolsasApi.updateBolsa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bolsas"] });
        },
    });

    const { mutate: setStatusBolsa, isPending: isChangingStatus } = useMutation(
        {
            mutationFn: bolsasApi.setStatusBolsa,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["bolsas"] });
            },
        }
    );

    const {
        mutateAsync: getDoadaEDevolvidaBolsas,
        isPending: isGettingDoadasEDevolvidas,
    } = useMutation({
        mutationFn: bolsasApi.getDoadaEDevolvidaBolsas,
    });

    return {
        bolsas,
        isLoadingBolsas: isLoading,
        isErrorBolsas: isError,
        errorBolsas: error,

        createBolsa,
        isCreatingBolsa: isCreating,
        deleteBolsa,
        isDeletingBolsa: isDeleting,
        updateBolsa,
        isUpdatingBolsa: isUpdating,
        setStatusBolsa,
        isChangingStatusBolsa: isChangingStatus,
        getDoadaEDevolvidaBolsas,
        isGettingDoadasEDevolvidas,
    };
};
