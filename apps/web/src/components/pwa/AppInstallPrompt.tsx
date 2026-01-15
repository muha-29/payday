import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

let deferredPrompt: any = null;

export function AppInstallPrompt() {
    console.log('AppInstallPrompt render');
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    /* Only show inside app */
    const isAppRoute = location.pathname.startsWith("/app");

    useEffect(() => {
        const dismissed = localStorage.getItem("pwa_install_dismissed");
        if (dismissed === "true") return;

        const ua = window.navigator.userAgent.toLowerCase();
        const ios =
            /iphone|ipad|ipod/.test(ua) &&
            !(window as any).navigator.standalone;

        setIsIOS(ios);

        window.addEventListener("beforeinstallprompt", (e: any) => {
            e.preventDefault();
            deferredPrompt = e;
            if (!ios) setShow(true);
        });
    }, []);

    if (!isAppRoute || (!show && !isIOS)) return null;

    const installApp = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            localStorage.setItem("pwa_install_dismissed", "true");
        }

        deferredPrompt = null;
        setShow(false);
    };

    const dismiss = () => {
        localStorage.setItem("pwa_install_dismissed", "true");
        setShow(false);
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] bg-white shadow-xl rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="text-sm">
                <strong>📱 Get the PayDay App</strong>
                <div className="text-stone-600">
                    Faster, offline, and better experience
                </div>
            </div>

            {isIOS ? (
                <span className="text-xs text-stone-500">
                    Tap <b>Share</b> → <b>Add to Home Screen</b>
                </span>
            ) : (
                <div className="flex gap-2">
                    <button
                        onClick={installApp}
                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm"
                    >
                        Install
                    </button>
                    <button
                        onClick={dismiss}
                        className="px-3 py-1.5 text-stone-500 text-sm"
                    >
                        Later
                    </button>
                </div>
            )}
        </div>
    );
}