import {
    Box,
    Button,
    Flex,
    Heading,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
} from "@chakra-ui/react";
import { useSortableData } from "../shared/hooks/useSortableData";
import { BolsasTable, BolsaFormModal } from "../features/bolsas";
import { useFornecedoras } from "../features/fornecedoras";
import { useSetores } from "../features/setores";

import { useBolsasPageLogic } from "../features/bolsas";
import { SearchComponent } from "../shared/ui/Components/SearchComponent";

export function Bolsas() {
    const { fornecedoras } = useFornecedoras();
    const { setores } = useSetores();

    const logic = useBolsasPageLogic();

    const { sortedData, requestSort, sortConfig } = useSortableData(
        logic.bolsas || []
    );

    if (logic.isLoadingBolsas)
        return (
            <Flex justify="center" h="300px">
                <Spinner size="xl" />
            </Flex>
        );
    if (logic.isErrorBolsas)
        return (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Erro ao carregar</AlertTitle>
            </Alert>
        );

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading>Gerenciar Bolsas</Heading>

                <Flex gap={10} align="center">
                    <Button
                        px={10}
                        colorScheme="teal"
                        onClick={() => logic.handleOpenModal()}
                    >
                        Adicionar Bolsa
                    </Button>

                    <SearchComponent
                        value={logic.searchValue}
                        onChange={logic.setSearchValue}
                        onSearch={logic.handleSearch}
                    />
                </Flex>
            </Flex>

            <BolsasTable
                bolsas={sortedData}
                sortConfig={sortConfig}
                requestSort={requestSort}
                onEdit={logic.handleOpenModal}
                onStatusChange={logic.handleStatusChange}
            />

            <BolsaFormModal
                isOpen={logic.isOpen}
                onClose={logic.handleCloseModal}
                onSave={logic.handleSave}
                initialData={logic.selectedBolsa}
                setores={setores ?? []}
                fornecedoras={fornecedoras ?? []}
            />
        </Box>
    );
}
