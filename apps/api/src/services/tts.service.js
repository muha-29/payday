import gTTS from 'gtts';
import fs from 'fs';
import path from 'path';

export async function generateSpeech(text, language = 'en') {
    const filename = `voice-${Date.now()}.mp3`;
    const filePath = path.join('/tmp', filename);

    return new Promise((resolve, reject) => {
        const tts = new gTTS(text, language);
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