export default function Disclaimer() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Disclaimer</h1>

            <p>
                PayDay uses AI to generate responses based on the information you provide.
            </p>

            <h2 className="font-medium mt-4">AI limitations</h2>
            <p>
                AI-generated responses may not always be accurate or complete. Always
                verify critical information independently.
            </p>

            <h2 className="font-medium mt-4">Document uploads</h2>
            <p>
                If you upload documents for OCR, you confirm that:
            </p>
            <ul className="list-disc ml-6 space-y-1">
                <li>You have the right to upload the document</li>
                <li>The document does not contain someone else’s private data</li>
                <li>You understand OCR results may contain errors</li>
            </ul>

            <h2 className="font-medium mt-4">No guarantees</h2>
            <p>
                PayDay does not guarantee financial outcomes, savings, or earnings.
            </p>

            <p className="text-sm text-stone-500">
                Last updated: January 2026
            </p>
        </div>
    );
}