export function ChatLauncher({ onOpen }: { onOpen: () => void }) {
    return (
        <button
            onClick={() => {
                console.log('💬 ChatLauncher clicked');
                onOpen();
            }}
            className="
                fixed bottom-24 left-4 z-[9999]
                w-14 h-14 rounded-full
                bg-orange-500 text-white
                flex items-center justify-center
            "
        >
            💬
        </button>
    );
}