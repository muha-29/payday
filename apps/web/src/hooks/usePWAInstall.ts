import { useEffect, useState } from "react";

const STORAGE_KEY = "pwa_install_dismissed";

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed) return;

        const handler = (e: any) => {
            e.preventDefault(); // required
            setDeferredPrompt(e);
            setVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const install = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === "accepted") {
            localStorage.setItem(STORAGE_KEY, "installed");
        }

        setVisible(false);
        setDeferredPrompt(null);
    };

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, "dismissed");
        setVisible(false);
    };

    return {
        visible,
        install,
        dismiss
    };
}