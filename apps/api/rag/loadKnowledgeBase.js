import fs from "fs";
import path from "path";

export function loadKnowledgeBase() {
    const filePath = path.resolve(
        "apps/api/data/knowledge/payday_faqs.json"
    );

    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
}