import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as setoresApi from "../services/setores.api";

export const useSetores = () => {
    const queryClient = useQueryClient();

    const {
        data: setores,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["setores"],
        queryFn: setoresApi.getAllSetores,
    });

    const { mutate: createSetor, isPending: isCreating } = useMutation({
        mutationFn: setoresApi.createSetor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["setores"] });
        },
    });

    const { mutate: deleteSetor, isPending: isDeleting } = useMutation({
        mutationFn: setoresApi.deleteSetor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["setores"] });
        },
    });

    const { mutate: updateSetor, isPending: isUpdating } = useMutation({
        mutationFn: setoresApi.updateSetor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["setores"] });
        },
    });

    return {
        setores,
        isLoadingSetores: isLoading,
        isErrorSetores: isError,
        errorSetores: error,

        createSetor,
        isCreatingSetor: isCreating,
        deleteSetor,
        isDeletingSetor: isDeleting,
        updateSetor,
        isUpdatingSetor: isUpdating,
    };
};
