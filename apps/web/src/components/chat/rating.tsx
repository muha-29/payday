type StarRatingProps = {
    value?: number | null;
    readonly?: boolean;
    onRate?: (v: number) => void;
};

export function StarRating({
    value = 0,
    readonly = false,
    onRate
}: StarRatingProps) {
    return (
        <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    disabled={readonly}
                    onClick={() => onRate?.(i)}
                    className={`text-lg ${i <= (value || 0)
                        ? "text-yellow-400"
                        : "text-stone-300"
                        } ${readonly ? "cursor-default" : "hover:text-yellow-500"}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}