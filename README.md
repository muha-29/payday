# PayDay

Personal financial assistant for Indian gig workers.

## Monorepo Structure
- apps/web        → React frontend
- apps/edge       → Supabase Edge Functions
- packages/shared → Shared types & constants
- packages/ai     → AI prompts & schemas
- infra           → MongoDB & Ollama configs


Frontend (Web)
 ├─ Mic input (Web Speech API)
 ├─ Wake button (🎤 Ask PayDay)
 ├─ Text transcript
 └─ Audio playback (TTS)

Backend (API)
 ├─ Context builder (earnings, savings, goals)
 ├─ AI prompt orchestration
 └─ Response formatter

AI Layer (Low-cost)
 ├─ Groq / OpenAI (text only)
 ├─ No vector DB initially
 └─ Short prompts (cost control)



| Layer         | Choice                          | Reason                         |
| ------------- | ------------------------------- | ------------------------------ |
| Speech → Text | **Browser Web Speech API**      | Free, instant, no backend cost |
| AI Reasoning  | **Groq / OpenAI (gpt-4o-mini)** | Cheap, fast                    |
| Text → Speech | **Browser SpeechSynthesis API** | Free                           |
| Context       | Your existing MongoDB           | Already there                  |
| Hosting       | Same backend                    | No infra change                |




🎧 PayDay Voice Agent — Final End-to-End Flow
What you want (confirmed)

🎤 User speaks (Indian language)

📝 Speech → Text (browser)

🧠 Text → Groq LLM (with user financial context)

🌍 LLM responds in user’s selected regional language

🔊 Response is spoken by PayDay

🗂️ Conversation history (voice + text + language) stored in MongoDB

🔁 User never needs to read unless they want to

This is correct architecture. Now let’s implement it step-by-step.

🧠 High-Level Architecture (Final)
Frontend (Browser)
 ├─ Voice input (Web Speech API)
 ├─ Transcript (text)
 ├─ Send text + language to backend
 ├─ Receive AI response
 ├─ Speak response (SpeechSynthesis)
 └─ Optional transcript display

Backend (API)
 ├─ Authenticated user
 ├─ Build financial context
 ├─ Send prompt to Groq
 ├─ Receive AI response (text)
 ├─ Persist conversation in MongoDB
 └─ Return response to frontend


No extra services. No heavy infra. Low cost.

🧠 Target Architecture (High-Level)
        User Voice (Mic)
        ↓
        Speech → Text (browser, language-aware)
        ↓
        Intent Detection
        ↓
        Context Builder (personalized)
        ↓
        LLM (Groq / future models)
        ↓
        Response (language-specific)
        ↓
        Text → Speech (same language)
        ↓
        Persist Conversation (MongoDB)




