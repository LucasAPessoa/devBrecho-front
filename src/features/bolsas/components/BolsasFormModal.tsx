import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    NumberInput,
    NumberInputField,
    FormControl,
    FormLabel,
    ModalFooter,
    Textarea,
    Button,
    Input,
} from "@chakra-ui/react";

import Select from "react-select";

import { Controller, useForm } from "react-hook-form";

import { BolsaFormData, Bolsa } from "../index";

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

type OptionType = {
    value: number;
    label: string;
};

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

    const fornecedorasFormatadas = fornecedoras.map((item) => ({
        value: item.fornecedoraId,
        label: item.codigo + " - " + item.nome,
    }));

    const setoresFormatadas = setores.map((item) => ({
        value: item.setorId,
        label: item.nome,
    }));

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
                            <FormControl isRequired>
                                {" "}
                                <FormLabel>Setor</FormLabel>
                                <Controller
                                    name="setorId"
                                    control={control}
                                    render={({
                                        field: { onChange, value, ref },
                                    }) => (
                                        <Select<OptionType>
                                            ref={ref}
                                            placeholder="Selecione um Setor"
                                            options={setoresFormatadas}
                                            value={setoresFormatadas.find(
                                                (c) => c.value === value
                                            )}
                                            onChange={(val) =>
                                                onChange(val?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Fornecedora</FormLabel>
                                <Controller
                                    name="fornecedoraId"
                                    control={control}
                                    render={({
                                        field: { onChange, value, ref },
                                    }) => (
                                        <Select<OptionType>
                                            ref={ref}
                                            placeholder="Selecione uma Fornecedora"
                                            options={fornecedorasFormatadas}
                                            value={fornecedorasFormatadas.find(
                                                (c) => c.value === value
                                            )}
                                            onChange={(val) =>
                                                onChange(val?.value)
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                            <Controller
                                name="quantidadeDePecasSemCadastro"
                                control={control}
                                defaultValue={0}
                                render={({ field }) => (
                                    <NumberInput {...field}>
                                        <NumberInputField placeholder="Peças sem cadastro" />
                                    </NumberInput>
                                )}
                            />
                            <FormControl>
                                <FormLabel htmlFor="dataMensagem">
                                    Data da Mensagem
                                </FormLabel>
                                <Input
                                    id="dataMensagem"
                                    type="date"
                                    {...register("dataMensagem", {
                                        setValueAs: (value) => {
                                            return value === "" ? null : value;
                                        },
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
