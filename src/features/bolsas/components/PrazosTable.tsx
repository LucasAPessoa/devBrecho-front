import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Wrap,
    Tag,
    HStack,
    Box,
    Text,
    VStack,
    Divider,
    Badge,
} from "@chakra-ui/react";
import { FaSortUp, FaSortDown, FaCalendarAlt } from "react-icons/fa";

import { Bolsa } from "../index";

import {
    calculatePrazo,
    formatStatusBolsa,
} from "../../../shared/utils/formatters";

interface PrazosTableProps {
    groupedBolsas: { date: string; bolsas: Bolsa[] }[];
    sortConfig: { key: string; direction: string };
    requestSort: (key: string) => void;
}

const SortIcon = ({
    columnKey,
    sortConfig,
}: {
    columnKey: string;
    sortConfig: { key: string; direction: string };
}) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
        <FaSortUp style={{ display: "inline", marginLeft: 4 }} />
    ) : (
        <FaSortDown style={{ display: "inline", marginLeft: 4 }} />
    );
};

export function PrazosTable({
    groupedBolsas,
    sortConfig,
    requestSort,
}: PrazosTableProps) {
    if (!groupedBolsas || groupedBolsas.length === 0) {
        return <Text>Nenhum prazo encontrado.</Text>;
    }

    const filteredBolsas = groupedBolsas.filter((grupo) => grupo.date !== null);

    const orderedBolsas = filteredBolsas.sort((a, b) => {
        return a.date.localeCompare(b.date);
    });

    return (
        <VStack spacing={8} align="stretch" w="100%">
            {orderedBolsas.map((grupo) => (
                <Box
                    key={grupo.date}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    boxShadow="sm"
                    bg="white"
                >
                    <HStack mb={4} spacing={2}>
                        <FaCalendarAlt color="gray" />
                        <Text fontSize="lg" fontWeight="bold" color="gray.700">
                            Prazo: {calculatePrazo(grupo.date)}
                        </Text>
                        <Badge colorScheme="red" ml={2}>
                            {" "}
                            {grupo.bolsas.length} pendentes
                        </Badge>
                    </HStack>

                    <Divider mb={4} />

                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th
                                    cursor="pointer"
                                    onClick={() => requestSort("setor.nome")}
                                >
                                    Setor{" "}
                                    <SortIcon
                                        columnKey="setor.nome"
                                        sortConfig={sortConfig}
                                    />
                                </Th>
                                <Th
                                    cursor="pointer"
                                    onClick={() =>
                                        requestSort("fornecedora.codigo")
                                    }
                                >
                                    Cód.{" "}
                                    <SortIcon
                                        columnKey="fornecedora.codigo"
                                        sortConfig={sortConfig}
                                    />
                                </Th>
                                <Th
                                    cursor="pointer"
                                    onClick={() =>
                                        requestSort("fornecedora.nome")
                                    }
                                >
                                    Fornecedora{" "}
                                    <SortIcon
                                        columnKey="fornecedora.nome"
                                        sortConfig={sortConfig}
                                    />
                                </Th>

                                <Th>Peças</Th>
                                <Th>Total</Th>

                                <Th
                                    cursor="pointer"
                                    onClick={() => requestSort("prazo")}
                                >
                                    Prazo{" "}
                                    <SortIcon
                                        columnKey="prazo"
                                        sortConfig={sortConfig}
                                    />
                                </Th>

                                <Th>Status</Th>
                                <Th>Obs.</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {grupo.bolsas.map((b) => (
                                <Tr key={b.bolsaId}>
                                    <Td>{b.setor.nome}</Td>
                                    <Td>{b.fornecedora.codigo || "N/A"}</Td>
                                    <Td>{b.fornecedora.nome}</Td>
                                    <Td>
                                        <Wrap>
                                            {b.pecasCadastradas?.map((p) => (
                                                <Tag
                                                    key={p.pecaCadastradaId}
                                                    size="sm"
                                                    colorScheme="teal"
                                                >
                                                    {p.codigoDaPeca}
                                                </Tag>
                                            ))}
                                            {(!b.pecasCadastradas ||
                                                b.pecasCadastradas.length ===
                                                    0) &&
                                                "-"}
                                        </Wrap>
                                    </Td>
                                    <Td fontWeight="bold">
                                        {(b.pecasCadastradas?.length || 0) +
                                            b.quantidadeDePecasSemCadastro}
                                    </Td>

                                    <Td>{calculatePrazo(b.dataMensagem)}</Td>
                                    <Td>
                                        {formatStatusBolsa(
                                            b.statusDevolvida,
                                            b.statusDoada
                                        )}
                                    </Td>
                                    <Td
                                        maxW="200px"
                                        isTruncated
                                        title={b.observacoes || ""}
                                    >
                                        {b.observacoes || "-"}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            ))}
        </VStack>
    );
}
