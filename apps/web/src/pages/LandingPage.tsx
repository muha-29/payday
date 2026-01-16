import { usePWAInstall } from "../hooks/usePWAInstall";

export function LandingPage() {
    const { canInstall, install } = usePWAInstall();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">PayDay</h1>

            {canInstall && (
                <button
                    onClick={install}
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                    📲 Install App
                </button>
            )}
        </div>
    );
}