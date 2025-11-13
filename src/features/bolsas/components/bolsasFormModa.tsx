import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Select,
    NumberInput,
    NumberInputField,
    FormControl,
    FormLabel,
    ModalFooter,
    Textarea,
    Button,
    Input,
} from "@chakra-ui/react";

import { Controller, useForm } from "react-hook-form";

import { BolsaFormData, Bolsa } from "./../index";

import { Setor } from "../../setores";
import { Fornecedora } from "../../fornecedoras";
import { useEffect } from "react";
import { toInputDate } from "../../../shared/utils/formatters";

interface BolsaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BolsaFormData) => void;
    initialData: Bolsa | null;
    setores: Setor[];
    fornecedoras: Fornecedora[];
}
export function BolsaFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    setores,
    fornecedoras,
}: BolsaFormModalProps) {
    const { register, handleSubmit, reset, setValue, control } =
        useForm<BolsaFormData>();

    // Quando o modal abre ou muda o initialData, a gente reseta o form
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue("setorId", initialData.setorId);
                setValue("fornecedoraId", initialData.fornecedoraId);
                setValue(
                    "quantidadeDePecasSemCadastro",
                    initialData.quantidadeDePecasSemCadastro
                );
                setValue("observacoes", initialData.observacoes || "");
                setValue(
                    "codigosDePeca",
                    initialData.pecasCadastradas
                        ?.map((p) => p.codigoDaPeca)
                        .join("\n") || ""
                );
                setValue("dataMensagem", toInputDate(initialData.dataMensagem));
            } else {
                reset();
            }
        }
    }, [isOpen, initialData, setValue, reset]);

    const handleFormSubmit = (data: BolsaFormData) => {
        onSave(data);
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {initialData ? "Editar" : "Adicionar"} Bolsa
                </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <Select
                                placeholder="Selecione um Setor"
                                {...register("setorId", { required: true })}
                            >
                                {setores?.map((s) => (
                                    <option key={s.setorId} value={s.setorId}>
                                        {s.nome}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder="Selecione uma Fornecedora"
                                {...register("fornecedoraId", {
                                    required: true,
                                })}
                            >
                                {fornecedoras?.map((f) => (
                                    <option
                                        key={f.fornecedoraId}
                                        value={f.fornecedoraId}
                                    >
                                        {f.codigo ? `${f.codigo} - ` : ""}
                                        {f.nome}
                                    </option>
                                ))}
                            </Select>
                            <Controller
                                name="quantidadeDePecasSemCadastro"
                                control={control}
                                render={({ field }) => (
                                    <NumberInput {...field}>
                                        <NumberInputField placeholder="Peças sem cadastro" />
                                    </NumberInput>
                                )}
                            />
                            <FormControl isRequired>
                                <FormLabel htmlFor="dataMensagem">
                                    Data da Mensagem
                                </FormLabel>
                                <Input
                                    id="dataMensagem"
                                    type="date"
                                    {...register("dataMensagem", {
                                        required: true,
                                    })}
                                />
                            </FormControl>
                            <Textarea
                                placeholder="Observações (opcional)"
                                {...register("observacoes")}
                            />
                            <Textarea
                                placeholder="Cole a lista de códigos das peças aqui, um por linha."
                                {...register("codigosDePeca")}
                                rows={10}
                            />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} type="submit">
                            Salvar
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
