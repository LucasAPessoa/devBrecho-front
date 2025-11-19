import { api } from "../../../services/api";
import { Fornecedora, FornecedoraFormData } from "../index";

export const createFornecedora = async (
    novaFornecedora: FornecedoraFormData
): Promise<Fornecedora> => {
    const { data } = await api.post<Fornecedora>(
        "/fornecedoras",
        novaFornecedora
    );
    return data;
};

export const getAllFornecedoras = async (): Promise<Fornecedora[]> => {
    const { data } = await api.get<Fornecedora[]>("/fornecedoras");
    return data;
};

export const deleteFornecedora = async (id: number): Promise<void> => {
    await api.delete(`/fornecedoras/${id}`);
};

export const updateFornecedora = async ({
    id,
    dadosAtualizados,
}: {
    id: number;
    dadosAtualizados: FornecedoraFormData;
}): Promise<Fornecedora> => {
    const { data } = await api.put(`/fornecedoras/${id}`, dadosAtualizados);
    return data;
};
