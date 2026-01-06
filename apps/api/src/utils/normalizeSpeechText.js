// utils/normalizeSpeechText.js
import Sanscript from '@indic-transliteration/sanscript';

export function normalizeSpeechText(text, language) {
    if (!text) return text;

    if (language?.startsWith('te')) {
        return Sanscript.t(text, 'itrans', 'telugu');
    }

    return text;
}
