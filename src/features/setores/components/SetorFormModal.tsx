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
import { Setor, SetorFormData } from "../index";

interface SetorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSetor: Setor | null;
    onSave: (data: SetorFormData) => Promise<void>;
}

export function SetorFormModal({
    isOpen,
    onClose,
    selectedSetor,
    onSave,
}: SetorFormModalProps) {
    const { register, handleSubmit, reset, setValue } =
        useForm<SetorFormData>();

    useEffect(() => {
        if (selectedSetor) {
            setValue("nome", selectedSetor.nome);
        } else {
            reset({ nome: "" });
        }
    }, [selectedSetor, setValue, reset, isOpen]);

    const handleClose = () => {
        reset({ nome: "" });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {selectedSetor ? "Editar Setor" : "Adicionar Novo Setor"}
                </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(onSave)}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Nome do Setor"
                                {...register("nome", { required: true })}
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
