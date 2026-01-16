import Tesseract from "tesseract.js";
import { cleanOcrText } from "../utils/cleanOcr.js";

export async function runOCR(imageBuffer) {
    console.log("📄 Running OCR");

    const {
        data: { text }
    } = await Tesseract.recognize(
        imageBuffer,
        "eng+hin+tam+tel", // English + Indian langs
        {
            logger: m => console.log("[OCR]", m.status)
        }
    );

    return cleanOcrText(text);
}