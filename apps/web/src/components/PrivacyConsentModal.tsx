type Props = {
    type: "voice" | "ocr";
    onAccept: () => void;
    onCancel: () => void;
};

export function PrivacyConsentModal({ type, onAccept, onCancel }: Props) {
    const isVoice = type === "voice";

    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-[90%] p-5">
                <h2 className="text-lg font-semibold mb-2">
                    {isVoice ? "Voice Recording Consent" : "Document Upload Consent"}
                </h2>

                <p className="text-sm text-stone-700 leading-relaxed">
                    {isVoice ? (
                        <>
                            To use voice features, PayDay needs access to your microphone.
                            <br /><br />
                            <strong>What we do:</strong>
                            <ul className="list-disc ml-5 mt-1">
                                <li>Record audio only when you tap the mic</li>
                                <li>Convert speech to text</li>
                                <li>Generate AI guidance</li>
                            </ul>
                            <br />
                            <strong>What we don’t do:</strong>
                            <ul className="list-disc ml-5 mt-1">
                                <li>No background recording</li>
                                <li>No sharing with third parties</li>
                                <li>No ads or tracking</li>
                            </ul>
                        </>
                    ) : (
                        <>
                            To use OCR, PayDay needs permission to process uploaded documents.
                            <br /><br />
                            <strong>What we do:</strong>
                            <ul className="list-disc ml-5 mt-1">
                                <li>Extract text from your document</li>
                                <li>Help you understand expenses or details</li>
                            </ul>
                            <br />
                            <strong>What we don’t do:</strong>
                            <ul className="list-disc ml-5 mt-1">
                                <li>No resale of documents</li>
                                <li>No permanent storage unless you save</li>
                            </ul>
                        </>
                    )}
                </p>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-stone-100 text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onAccept}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm"
                    >
                        I Agree
                    </button>
                </div>

                <p className="text-[11px] text-stone-500 mt-3">
                    You can change this anytime in Settings → Privacy.
                </p>
            </div>
        </div>
    );
}