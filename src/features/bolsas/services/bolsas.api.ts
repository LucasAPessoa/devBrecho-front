import { api } from "../../../services/api";
import { Bolsa, BolsaFormData } from "../types/bolsas.types";

export const createBolsa = async (novaBolsa: BolsaFormData): Promise<Bolsa> => {
    const { data } = await api.post<Bolsa>("/bolsas", novaBolsa);
    return data;
};

export const getAllBolsas = async (query?: string): Promise<Bolsa[]> => {
    const { data } = await api.get<Bolsa[]>("/bolsas", {
        params: { query },
    });
    return data;
};

export const deleteBolsa = async (id: number): Promise<void> => {
    await api.delete(`/bolsas/${id}`);
};

export const setStatusBolsa = async ({
    bolsaId,
    payload,
}: {
    bolsaId: number;
    payload: { statusDevolvida: boolean; statusDoada: boolean };
}): Promise<void> => {
    await api.patch(`/bolsas/${bolsaId}/status`, payload);
};

export const updateBolsa = async ({
    id,
    dadosAtualizados,
}: {
    id: number;
    dadosAtualizados: BolsaFormData;
}): Promise<Bolsa> => {
    const { data } = await api.put(`/bolsas/${id}`, dadosAtualizados);
    return data;
};

export const getDoadaEDevolvidaBolsas = async (
    fornecedoraId: number
): Promise<Bolsa[]> => {
    const { data } = await api.get<Bolsa[]>(
        `/bolsas/doadasEDevolvidas/${fornecedoraId}`
    );
    return data;
};

export const searchBolsas = async (query: string): Promise<Bolsa[]> => {
    const { data } = await api.get<Bolsa[]>("/bolsas/search/", {
        params: { query },
    });
    return data;
};

export const getBolsaGroupedByDataMensagem = async (): Promise<
    {
        date: string;
        bolsas: Bolsa[];
    }[]
> => {
    const { data } = await api.get<
        {
            date: string;
            bolsas: Bolsa[];
        }[]
    >("/bolsas/groupedByDataMensagem");
    return data;
};
