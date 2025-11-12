export type Peca = {
    pecaCadastradaId: number;
    codigoDaPeca: string;
    bolsaId: number;
    bolsa: { bolsaId: number; observacoes: string | null };
};

export type PecaFormData = {
    codigoDaPeca: string;
    bolsaId: number;
};
