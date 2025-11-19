import { useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    VStack,
    Input,
    Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Fornecedora, FornecedoraFormData } from "../index";

interface FornecedoraFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedFornecedora: Fornecedora | null;
    onSave: (data: FornecedoraFormData) => Promise<void>;
}

export function FornecedoraFormModal({
    isOpen,
    onClose,
    selectedFornecedora,
    onSave,
}: FornecedoraFormModalProps) {
    const { register, handleSubmit, reset, setValue } =
        useForm<FornecedoraFormData>();

    useEffect(() => {
        if (selectedFornecedora) {
            setValue("codigo", selectedFornecedora.codigo);
            setValue("nome", selectedFornecedora.nome);
            setValue("telefone", selectedFornecedora.telefone);
        } else {
            reset({ codigo: "", nome: "", telefone: "" });
        }
    }, [selectedFornecedora, setValue, reset, isOpen]);

    const handleClose = () => {
        reset({ codigo: "", nome: "", telefone: "" });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {selectedFornecedora ? "Editar" : "Adicionar"} Fornecedora
                </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(onSave)}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Código (opcional)"
                                {...register("codigo")}
                            />
                            <Input
                                placeholder="Nome da Fornecedora"
                                {...register("nome", { required: true })}
                            />
                            <Input
                                placeholder="Telefone (opcional)"
                                {...register("telefone")}
                            />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} type="submit">
                            Salvar
                        </Button>
                        <Button variant="ghost" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
