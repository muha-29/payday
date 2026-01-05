import gTTS from 'gtts';
import fs from 'fs';
import path from 'path';

const normalizeLanguage = (lang = 'en') => {
    // Convert browser locales → gTTS-compatible codes
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('te')) return 'te';
    if (lang.startsWith('hi')) return 'hi';
    if (lang.startsWith('ta')) return 'ta';
    if (lang.startsWith('kn')) return 'kn';

    return 'en'; // safe fallback
};

export async function generateSpeech(text, language = 'en') {
    const filename = `voice-${Date.now()}.mp3`;
    const filePath = path.join('/tmp', filename);

    return new Promise((resolve, reject) => {
        const ttsLang = normalizeLanguage(language);
        const tts = new gTTS(text, ttsLang);
        tts.save(filePath, (err) => {
            if (err) reject(err);
            resolve({ filePath, filename });
        });
    });
}
export async function cleanupSpeech(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting TTS file:', err);
    });
}