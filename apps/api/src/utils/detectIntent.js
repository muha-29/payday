/**
 * Detect high-level user intent from voice/text input
 * This is intentionally simple and deterministic.
 */
export function detectIntent(text = '') {
    const t = text.toLowerCase();

    // Savings intent
    if (
        t.includes('save') ||
        t.includes('saving') ||
        t.includes('goal') ||
        t.includes('deposit')
    ) {
        return 'savings';
    }

    // Earnings / income intent
    if (
        t.includes('earn') ||
        t.includes('income') ||
        t.includes('salary') ||
        t.includes('credit')
    ) {
        return 'earnings';
    }

    // Dashboard / summary intent
    if (
        t.includes('today') ||
        t.includes('summary') ||
        t.includes('status') ||
        t.includes('overview')
    ) {
        return 'dashboard';
    }

    // Fallback
    return 'general';
}
