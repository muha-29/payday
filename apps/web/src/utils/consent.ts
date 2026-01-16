export type ConsentType = "voice" | "ocr";

const key = (type: ConsentType) => `consent_${type}`;

export function hasConsent(type: ConsentType): boolean {
    return localStorage.getItem(key(type)) === "granted";
}

export function grantConsent(type: ConsentType) {
    localStorage.setItem(key(type), "granted");
}

export function revokeConsent(type: ConsentType) {
    localStorage.removeItem(key(type));
}