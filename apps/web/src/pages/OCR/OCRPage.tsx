import { useState } from "react";

export default function OCRPage() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const runOCR = async () => {
        if (!file) return;

        setLoading(true);
        setText("");

        const fd = new FormData();
        fd.append("image", file);

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/ocr`,
            { method: "POST", body: fd }
        );

        const json = await res.json();
        setText(json.text || "");
        setLoading(false);
    };

    return (
        <div className="p-4 space-y-4">
            <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
            />

            <button
                onClick={runOCR}
                disabled={!file || loading}
                className="px-4 py-2 bg-orange-500 text-white rounded"
            >
                {loading ? "Scanning…" : "Scan Document"}
            </button>

            {text && (
                <pre className="bg-stone-100 p-3 rounded text-sm whitespace-pre-wrap">
                    {text}
                </pre>
            )}
        </div>
    );
}