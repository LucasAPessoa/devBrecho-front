export type Fornecedora = {
    fornecedoraId: number;
    codigo: string;
    nome: string;
    telefone?: string;
};

export type FornecedoraFormData = {
    codigo: string;
    nome: string;
    telefone?: string;
};
