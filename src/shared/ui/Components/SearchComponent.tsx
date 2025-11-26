import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchComponentProps {
    value: string;
    onChange: (newValue: string) => void;
    onSearch: () => void;
}

export function SearchComponent({
    value,
    onChange,
    onSearch,
}: SearchComponentProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <InputGroup>
            <Input
                type="text"
                placeholder="Pesquise algo..."
                variant="outline"
                _focus={{ borderColor: "blue.400" }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <InputRightElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
                onClick={onSearch}
            />
        </InputGroup>
    );
}
