export function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'GoodMorning';
    if (hour < 17) return 'GoodAfternoon';
    return 'GoodEvening';
}

export function getFormattedDate(): string {
    return new Intl.DateTimeFormat('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date());
}