export function cleanOcrText(raw) {
    if (!raw) return "";

    return raw
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[^\S\r\n]+/g, " ")
        .trim();
}