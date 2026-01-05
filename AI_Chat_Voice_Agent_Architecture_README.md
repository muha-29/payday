
# 🤖 Personalized AI Chat & Voice Agent – Architecture Overview

This application implements a **personalized, privacy-first AI Chat and Voice Agent** designed to answer user questions based on **their own data**, not generic assumptions. The system combines multiple agents, data stores, and services to deliver accurate, contextual, and secure responses.

---

## 🧠 How the AI Agent Answers Personalized Questions

Unlike traditional chatbots, this agent does **not respond blindly**. Every response is generated using a **user-specific context pipeline**.

### Key principles:
- Each request is scoped to an **authenticated user**
- Context is built **server-side**
- No user data is exposed to the client or other users
- AI responses are generated **on demand**, not pre-trained on user data

---

## 🔄 End-to-End Workflow

1. **User Interaction**
   - User types a message or speaks using voice input in their native language.
   - Voice input is converted to text using the browser’s Speech Recognition API.

2. **Chat / Voice UI → AI Controller**
   - The frontend sends:
     - `question`
     - `language`
     - JWT authentication token
   - No personal data is sent from the client.

3. **Intent Detection Agent**
   - The system detects *what the user is asking* (e.g., earnings, savings, habits, finance advice).
   - This ensures relevant and focused responses.

4. **Context Builder Agent**
   - Based on the detected intent, the agent fetches **only the required user data**.
   - Context is assembled dynamically per request.

5. **MongoDB (Primary Data Store)**
   - Stores:
     - User profiles
     - Earnings and savings data
     - Conversation history
     - Detected intents
   - All records are strictly scoped by `userId`.

6. **AI Model Execution**
   - The AI model receives:
     - User question
     - Personalized context
     - Language hint
   - Produces a **tailored response** aligned with the user’s data.

7. **Text-to-Speech (Optional)**
   - AI response is optionally converted to speech.
   - Language codes are normalized (e.g., `en-IN → en`) for compatibility.
   - TTS failures never block text responses.

8. **Supabase (Object Storage)**
   - Stores generated audio securely.
   - Bucket access is restricted per user.
   - Audio URLs are returned only when available.

9. **Response to Client**
   - Client receives:
     - `answer` (always)
     - `audioUrl` (optional)
   - UI renders chat bubbles with timestamps and sender labels.

---

## 🗄️ Role of Data Stores

### MongoDB
- Primary database for:
  - User financial data
  - Chat history
  - Intent and context metadata
- Ensures **data isolation per user**
- Never exposes raw data to the frontend

### Supabase
- Secure storage for:
  - AI-generated audio files
  - Media assets
- Access controlled via bucket policies
- No public cross-user access

---

## 🧩 Agent Communication Model

The system is **modular**, not monolithic:

- AI Controller orchestrates all actions
- Intent Detector identifies user goals
- Context Builder fetches scoped data
- AI Service generates responses
- TTS Service handles speech (optional)

Each agent has **a single responsibility**, making the system easier to audit, scale, and secure.

---

## 🔐 Security & Privacy by Design

- JWT-based authentication on all AI endpoints
- Context built server-side only
- No cross-user data access
- No training of external AI models on user data
- Sensitive financial data never leaves the backend
- Failures in optional services (TTS, storage) do not affect core chat

---

## 🛡️ Reliability & Fault Tolerance

- Text responses always succeed, even if voice/TTS fails
- Database or storage failures do not crash the system
- Graceful fallbacks ensure uninterrupted chat experience

---

## 📈 Why This Architecture Works

- Personalized, not generic
- Privacy-first and compliant by design
- Scalable agent-based architecture
- Easy to extend with new tools or agents
- Suitable for fintech-grade applications
