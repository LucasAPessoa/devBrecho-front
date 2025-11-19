import { api } from "../../../services/api";
import { Setor, SetorFormData } from "../index";

export const createSetor = async (novaSetor: SetorFormData): Promise<Setor> => {
    const { data } = await api.post<Setor>("/setores", novaSetor);
    return data;
};

export const getAllSetores = async (): Promise<Setor[]> => {
    const { data } = await api.get<Setor[]>("/setores");
    return data;
};

export const deleteSetor = async (id: number): Promise<void> => {
    await api.delete(`/setores/${id}`);
};

export const updateSetor = async ({
    id,
    dadosAtualizados,
}: {
    id: number;
    dadosAtualizados: SetorFormData;
}): Promise<Setor> => {
    const { data } = await api.put(`/setores/${id}`, dadosAtualizados);
    return data;
};
