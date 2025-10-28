import { useState, useMemo } from "react";

const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export const useSortableData = <T extends object>(
    items: T[],
    config = { key: "", direction: "asc" }
) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedData = useMemo(() => {
        let sortableItems = [...items];

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const valA = getNestedValue(a, sortConfig.key);
                const valB = getNestedValue(b, sortConfig.key);

                let comparison = 0;
                if (valA > valB) {
                    comparison = 1;
                } else if (valA < valB) {
                    comparison = -1;
                }

                return sortConfig.direction === "asc"
                    ? comparison
                    : -comparison;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: string) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return { sortedData, requestSort, sortConfig };
};
