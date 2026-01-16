import express from "express";
import multer from "multer";
import { runOCR } from "../services/ocr.service.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file?.buffer) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const text = await runOCR(req.file.buffer);

        return res.json({
            success: true,
            text,
        });

    } catch (err) {
        console.error("[OCR ERROR]", err);
        return res.status(500).json({
            error: "OCR failed",
        });
    }
});

export default router;