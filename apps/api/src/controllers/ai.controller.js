import VoiceConversation from '../models/voiceConversation.model.js';
import { detectIntent } from '../utils/detectIntent.js';
import { buildContext } from '../utils/buildContext.js';
import { runAI } from '../services/ai.service.js';
import { generateSpeech } from '../services/tts.service.js';

export async function askAI(req, res) {
    const userId = req.user.id;
    const { question, language = 'en' } = req.body;

    const intent = detectIntent(question);
    const context = await buildContext(userId, intent);

    const answer = await runAI({ question, context, language });

    // 🔊 Generate speech
    const { filePath, filename } =
        await generateSpeech(answer, language);

    // TODO: upload to Supabase bucket
    const audioUrl = `/audio/${filename}`;

    await VoiceConversation.create({
        userId,
        question,
        answer,
        language,
        intent
    });


    res.json({ answer, audioUrl });
}