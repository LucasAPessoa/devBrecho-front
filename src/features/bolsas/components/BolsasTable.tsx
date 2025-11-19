import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Wrap,
    Tag,
    IconButton,
    HStack,
} from "@chakra-ui/react";
import {
    FaEdit,
    FaArrowAltCircleUp,
    FaBoxOpen,
    FaSortUp,
    FaSortDown,
} from "react-icons/fa";
import { Bolsa } from "../index";
import {
    formatDate,
    calculatePrazo,
    formatStatusBolsa,
} from "../../../shared/utils/formatters";

interface BolsasTableProps {
    bolsas: Bolsa[];
    sortConfig: { key: string; direction: string };
    requestSort: (key: string) => void;
    onEdit: (bolsa: Bolsa) => void;
    onStatusChange: (
        id: number,
        {
            statusDevolvida,
            statusDoada,
        }: { statusDevolvida: boolean; statusDoada: boolean }
    ) => void;
}

export function BolsasTable({
    bolsas,
    sortConfig,
    requestSort,
    onEdit,
    onStatusChange,
}: BolsasTableProps) {
    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === "asc" ? (
            <FaSortUp style={{ display: "inline", marginLeft: 4 }} />
        ) : (
            <FaSortDown style={{ display: "inline", marginLeft: 4 }} />
        );
    };

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <>
                        <Th
                            cursor="pointer"
                            userSelect="none"
                            onClick={() => requestSort("setor.nome")}
                        >
                            Setor <SortIcon columnKey="setor.nome" />
                        </Th>
                        <Th
                            cursor="pointer"
                            userSelect="none"
                            onClick={() => requestSort("fornecedora.codigo")}
                        >
                            Cód. Fornecedora{" "}
                            <SortIcon columnKey="fornecedora.codigo" />
                        </Th>
                        <Th
                            cursor="pointer"
                            userSelect="none"
                            onClick={() => requestSort("fornecedora.nome")}
                        >
                            Fornecedora{" "}
                            <SortIcon columnKey="fornecedora.nome" />
                        </Th>

                        <Th>Peças Cadastradas</Th>
                        <Th>Total de Peças</Th>
                        <Th
                            cursor="pointer"
                            userSelect="none"
                            onClick={() => requestSort("dataMensagem")}
                        >
                            Data Mensagem <SortIcon columnKey="dataMensagem" />
                        </Th>

                        <Th
                            cursor="pointer"
                            userSelect="none"
                            onClick={() => requestSort("dataMensagem")}
                        >
                            Prazo <SortIcon columnKey="dataMensagem" />
                        </Th>

                        <Th>Status</Th>

                        <Th>Observações</Th>

                        <Th isNumeric>Ações</Th>
                    </>
                </Tr>
            </Thead>
            <Tbody>
                {bolsas.map((b) => (
                    <Tr key={b.bolsaId}>
                        <Td>{b.setor.nome}</Td>
                        <Td>{b.fornecedora.codigo || "N/A"}</Td>{" "}
                        <Td>{b.fornecedora.nome}</Td>
                        <Td>
                            <Wrap>
                                {b.pecasCadastradas?.map((p) => (
                                    <Tag key={p.pecaCadastradaId} size="sm">
                                        {p.codigoDaPeca}
                                    </Tag>
                                ))}
                                {(!b.pecasCadastradas ||
                                    b.pecasCadastradas.length === 0) &&
                                    "Nenhuma"}
                            </Wrap>
                        </Td>
                        <Td>
                            {b.pecasCadastradas.length +
                                b.quantidadeDePecasSemCadastro}
                        </Td>
                        <Td>{formatDate(b.dataMensagem)}</Td>
                        <Td>{calculatePrazo(b.dataMensagem)}</Td>
                        <Td>
                            {formatStatusBolsa(
                                b.statusDevolvida,
                                b.statusDoada
                            )}
                        </Td>
                        <Td>{b.observacoes || "N/A"}</Td>
                        <Td isNumeric>
                            <HStack spacing={3} justify="flex-end">
                                <IconButton
                                    aria-label="Editar"
                                    icon={<FaEdit />}
                                    onClick={() => onEdit(b)}
                                />

                                <IconButton
                                    aria-label="Devolver"
                                    icon={<FaArrowAltCircleUp />}
                                    colorScheme="blue"
                                    onClick={() =>
                                        onStatusChange(b.bolsaId, {
                                            statusDevolvida: true,
                                            statusDoada: false,
                                        })
                                    }
                                />
                                <IconButton
                                    aria-label="Doar"
                                    icon={<FaBoxOpen />}
                                    colorScheme="blue"
                                    onClick={() =>
                                        onStatusChange(b.bolsaId, {
                                            statusDevolvida: false,
                                            statusDoada: true,
                                        })
                                    }
                                />
                            </HStack>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}
