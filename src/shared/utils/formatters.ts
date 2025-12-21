export function formatDate(date: string | null): string | null {
    if (!date) return null;

    const inputDate = new Date(date);

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
    const inputDate = new Date(dateMnsg);

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
