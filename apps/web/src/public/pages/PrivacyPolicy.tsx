export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Privacy Policy</h1>

            <p>
                PayDay respects your privacy. We collect only the minimum data required
                to provide financial guidance and app functionality.
            </p>

            <h2 className="font-medium mt-4">What data we collect</h2>
            <ul className="list-disc ml-6 space-y-1">
                <li>Income, savings, and goals entered by you</li>
                <li>Voice inputs converted to text (not stored as raw audio)</li>
                <li>Optional documents uploaded by you (OCR)</li>
            </ul>

            <h2 className="font-medium mt-4">What we do NOT do</h2>
            <ul className="list-disc ml-6 space-y-1">
                <li>We do not access your bank account</li>
                <li>We do not move or control your money</li>
                <li>We do not sell your data</li>
            </ul>

            <h2 className="font-medium mt-4">Data security</h2>
            <p>
                Your data is stored securely and used only to provide insights and
                recommendations within PayDay.
            </p>

            <p className="text-sm text-stone-500">
                Last updated: January 2026
            </p>
        </div>
    );
}