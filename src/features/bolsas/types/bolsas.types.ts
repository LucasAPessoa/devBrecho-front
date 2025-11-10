export type Peca = {
    pecaCadastradaId: number;
    codigoDaPeca: string;
};

export type Fornecedora = {
    fornecedoraId: number;
    codigo: string | null;
    nome: string;
};

export type Bolsa = {
    bolsaId: number;
    quantidadeDePecasSemCadastro: number;
    observacoes: string | null;
    fornecedoraId: number;
    setorId: number;
    fornecedora: {
        nome: string;
        codigo: string | null;
    };
    setor: { nome: string };
    pecasCadastradas: Peca[];
    dataMensagem: string;
    statusDevolvida: boolean;
    statusDoada: boolean;
};

export type Setor = {
    setorId: number;
    nome: string;
};

export type BolsaFormData = {
    quantidadeDePecasSemCadastro: number;
    observacoes?: string;
    fornecedoraId: number;
    setorId: number;
    codigosDePeca?: string;
    dataMensagem: string;
};
