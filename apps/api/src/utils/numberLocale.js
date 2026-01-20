// utils/numberLocale.util.js

const TA = {
    0: 'பூஜ்ஜியம்',
    1: 'ஒன்று',
    2: 'இரண்டு',
    3: 'மூன்று',
    4: 'நான்கு',
    5: 'ஐந்து',
    6: 'ஆறு',
    7: 'ஏழு',
    8: 'எட்டு',
    9: 'ஒன்பது',
    10: 'பத்து',
    20: 'இருபது',
    30: 'முப்பது',
    40: 'நாற்பது',
    50: 'ஐம்பது',
    100: 'நூறு'
};

const TE = {
    0: 'సున్నా',
    1: 'ఒకటి',
    2: 'రెండు',
    3: 'మూడు',
    4: 'నాలుగు',
    5: 'ఐదు',
    6: 'ఆరు',
    7: 'ఏడు',
    8: 'ఎనిమిది',
    9: 'తొమ్మిది',
    10: 'పది',
    20: 'ఇరవై',
    30: 'ముప్పై',
    40: 'నలభై',
    50: 'యాభై',
    100: 'వంద'
};

const HI = {
    0: 'शून्य',
    1: 'एक',
    2: 'दो',
    3: 'तीन',
    4: 'चार',
    5: 'पाँच',
    6: 'छह',
    7: 'सात',
    8: 'आठ',
    9: 'नौ',
    10: 'दस',
    20: 'बीस',
    30: 'तीस',
    40: 'चालीस',
    50: 'पचास',
    100: 'सौ'
};

const DICTS = { ta: TA, te: TE, hi: HI };

function numberToWordsBasic(num, lang) {
    const dict = DICTS[lang];
    if (!dict) return num.toString();

    // Exact match
    if (dict[num]) return dict[num];

    // 2-digit handling (eg: 23 → 20 + 3)
    if (num > 10 && num < 100) {
        const tens = Math.floor(num / 10) * 10;
        const ones = num % 10;

        if (dict[tens] && dict[ones]) {
            return `${dict[tens]} ${dict[ones]}`;
        }
    }

    // Fallback
    return num.toString();
}

/**
 * Converts all numbers in a sentence to spoken regional words
 */
export function localizeNumbersInText(text, lang) {
    if (!text || !lang || lang === 'en') return text;

    let found = false;

    const result = text.replace(/₹?\d+(\.\d+)?/g, (match) => {
        found = true;

        // Remove currency symbol
        const num = Number(match.replace('₹', ''));
        if (Number.isNaN(num)) return match;

        const words = numberToWordsBasic(num, lang);

        return match.startsWith('₹')
            ? `${words}`
            : words;
    });

    if (!found) {
        console.warn(
            `[NumberLocalization] No digits found in text: "${text}"`
        );
        return text;
    }

    return result;
}
