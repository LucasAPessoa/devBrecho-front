import { api } from "../../../services/api";
import { Setor, SetorFormData } from "../index";

export const createSetor = async (novaSetor: SetorFormData): Promise<Setor> => {
    const { data } = await api.post<Setor>("/Setors", novaSetor);
    return data;
};

export const getAllSetores = async (): Promise<Setor[]> => {
    const { data } = await api.get<Setor[]>("/Setors");
    return data;
};

export const deleteSetor = async (id: number): Promise<void> => {
    await api.delete(`/Setors/${id}`);
};

export const updateSetor = async ({
    id,
    dadosAtualizados,
}: {
    id: number;
    dadosAtualizados: SetorFormData;
}): Promise<Setor> => {
    const { data } = await api.put(`/Setors/${id}`, dadosAtualizados);
    return data;
};
