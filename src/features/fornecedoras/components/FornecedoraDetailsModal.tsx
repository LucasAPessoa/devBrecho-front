import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Heading,
    Box,
    VStack,
    Text,
} from "@chakra-ui/react";
import { Bolsa } from "../../bolsas/index";

const BolsaList = ({
    title,
    bolsas,
    onReset,
}: {
    title: string;
    bolsas: Bolsa[];
    onReset: (id: number) => void;
}) => (
    <>
        <Heading size="md" mt={6} mb={3}>
            {title}
        </Heading>
        <Box
            maxH="200px"
            overflowY="auto"
            pr={4}
            borderWidth="1px"
            borderRadius="md"
            p={2}
        >
            {bolsas.length > 0 ? (
                bolsas.map((d) => (
                    <VStack
                        key={d.bolsaId}
                        spacing={2}
                        align="stretch"
                        mb={2}
                        p={2}
                        borderWidth={1}
                        borderRadius="md"
                        bg="gray.50"
                    >
                        {d.quantidadeDePecasSemCadastro !== undefined && (
                            <Text>
                                <strong>Quantidade de Peças:</strong>{" "}
                                {d.quantidadeDePecasSemCadastro +
                                    d.pecasCadastradas.length}
                            </Text>
                        )}
                        <Text>
                            <strong>Bolsa ID:</strong> {d.bolsaId}
                        </Text>
                        <Text>
                            <strong>Obs:</strong> {d.observacoes || "N/A"}
                        </Text>
                        <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => onReset(d.bolsaId)}
                        >
                            Reset
                        </Button>
                    </VStack>
                ))
            ) : (
                <Text>Nenhuma bolsa encontrada.</Text>
            )}
        </Box>
    </>
);

interface FornecedoraDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    detailsData: Bolsa[] | undefined;
    onResetBolsa: (id: number) => void;
}

export function FornecedoraDetailsModal({
    isOpen,
    onClose,
    detailsData,
    onResetBolsa,
}: FornecedoraDetailsModalProps) {
    const devolvidas = detailsData?.filter((b) => b.statusDevolvida) || [];
    const doadas = detailsData?.filter((b) => b.statusDoada) || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Detalhes da Fornecedora</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <BolsaList
                        title="Bolsas Devolvidas"
                        bolsas={devolvidas}
                        onReset={onResetBolsa}
                    />

                    <BolsaList
                        title="Bolsas Doadas"
                        bolsas={doadas}
                        onReset={onResetBolsa}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Fechar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
