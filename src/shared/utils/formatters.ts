export function formatDate(date: string): string {
    const limitDate = new Date(2022, 0, 1);
    const inputDate = new Date(date);

    if (isNaN(inputDate.getTime()) || inputDate < limitDate) {
        return "";
    }

    return inputDate.toLocaleDateString("pt-BR", {
        timeZone: "UTC",
    });
}

export function toInputDate(date: string | Date): string {
    if (typeof date === "string") {
        return date.split("T")[0];
    }

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function calculatePrazo(dateMnsg: string) {
    const limitDate = new Date(2022, 0, 1);
    const inputDate = new Date(dateMnsg);

    if (isNaN(inputDate.getTime()) || inputDate < limitDate) {
        return "";
    }

    const prazoDate = new Date(inputDate);
    prazoDate.setDate(prazoDate.getDate() + 15);

    return prazoDate.toLocaleDateString("pt-BR", {
        timeZone: "UTC",
    });
}

export function formatStatusBolsa(
    statusDevolvida: boolean,
    statusDoada: boolean
): string | null {
    if (statusDevolvida) return "DEVOLVIDA";
    if (statusDoada) return "DOADA";
    return null;
}
