import { usePWAInstall } from "../hooks/usePWAInstall";

export function PWAInstallBanner() {
    const { visible, install, dismiss } = usePWAInstall();

    if (!visible) return null;

    return (
        <div className="
      fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]
      bg-white shadow-xl rounded-xl
      w-[92%] max-w-md
      border border-stone-200
      p-4
    ">
            <div className="flex items-start gap-3">
                <div className="text-2xl">📱</div>

                <div className="flex-1">
                    <h4 className="font-semibold text-sm">
                        Install PayDay App
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                        Faster, works offline, and feels like a real app.
                    </p>

                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={install}
                            className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white"
                        >
                            Install
                        </button>

                        <button
                            onClick={dismiss}
                            className="px-3 py-2 text-sm rounded-lg bg-stone-100"
                        >
                            Not now
                        </button>
                    </div>
                </div>

                <button
                    onClick={dismiss}
                    className="text-stone-400 hover:text-stone-600"
                    aria-label="Dismiss"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}