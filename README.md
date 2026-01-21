# 📱 PayDay – Voice-First AI Financial Assistant

PayDay is a **voice-first, AI-powered personal finance assistant** built for Indian users, with a strong focus on **regional languages**, **low-literacy accessibility**, and **offline-tolerant usage**. The platform enables users to track earnings, manage savings goals, and receive AI-driven insights through both **text and voice interfaces**.

This repository contains the **full-stack implementation** covering frontend, backend services, and the AI orchestration layer.

---

## 🚀 Key Features

* 💰 Earnings tracking with daily, weekly, and monthly insights
* 🎯 Savings goals with progress tracking
* 📊 Real-time dashboards and server-driven charts
* 🗣️ Voice-first interaction (STT → AI → TTS)
* 🌐 Regional language support (Tamil, Telugu, Hindi, English)
* 🤖 AI financial coach with safe, rule-based guidance
* 📱 Mobile-first, low-bandwidth friendly UI

---

## 🧱 Technology Stack

### Frontend

* **React + TypeScript** – Web frontend
* **Vite** – Build tooling and dev server
* **Tailwind CSS** – Lightweight, utility-first UI framework
* **Recharts** – Server-driven charts and analytics
* **React Router** – Client-side routing
* **Custom i18n system** – Regional language support
* **Lucide React** – Iconography

### Backend

* **Node.js** – Runtime
* **Express.js** – API framework
* **MongoDB** – Primary data store
* **Mongoose** – ODM and aggregation layer
* RESTful, cloud-native API design
* Server-side aggregation for financial data (daily / weekly / monthly)

### AI Stack

* **Sarvam AI**

  * Speech-to-Text (STT) for Indian accents
  * Text-to-Speech (TTS) for regional languages
* **LLM-based Conversational Agent**
* Server-side translation and localization pipeline
* Number-to-speech localization for regional TTS
* Rule-based AI safety layer with failure isolation

---

## 🧩 High-Level Architecture

```
Frontend (Web / Mobile)
        |
        | REST APIs
        ↓
Backend (Node + Express)
        |
        | MongoDB Aggregations
        ↓
Database (MongoDB)
        |
        | AI Orchestration
        ↓
STT → AI Agent → Translation → Number Localization → TTS
```

---

## 🔄 End-to-End AI Voice Flow

This is the **core architectural flow** that powers PayDay’s voice-first experience.

### 1️⃣ User Input (Voice)

The user speaks in their preferred regional language.

### 2️⃣ Speech-to-Text (STT)

Sarvam AI converts spoken input into text, optimized for Indian accents.

### 3️⃣ Conversational AI Agent

* Intent is detected (earnings, savings, insights, etc.)
* AI generates responses **in English** for consistency, safety, and cost efficiency

### 4️⃣ Translation & Localization

* AI output is translated into the user’s preferred language
* Numeric values are converted into **spoken regional words**

  * Example: `₹20` → `இருபது / ఇరవై / बीस`

### 5️⃣ Text-to-Speech (TTS)

Localized text is converted back into natural, regional speech.

### 6️⃣ Response Delivery

The user receives a clear and natural voice response in their language.

---

## 🧠 AI Safety & Reliability

* AI provides **advisory-only financial guidance**
* Rule-based validation layer enforces safe responses
* AI failures never block:

  * Dashboards
  * Earnings tracking
  * Savings flows
* Designed for future human override and escalation

---

## 📊 Data & Dashboard Architecture

### Server-Side Aggregation

All financial calculations are handled server-side to ensure:

* Accuracy and consistency
* Complete time-series data (including zero-value days)
* No frontend data drift

### Key APIs

* `GET /api/dashboard` – Summary stats + AI insight
* `GET /api/earnings/chart?range=daily|weekly|monthly` – Chart-ready data
* `GET /api/incomes` – Earnings list
* `GET /api/savings` – Savings goals and progress

Charts always render **full calendar ranges** (e.g., all 7 days of a week).

---

## 🌐 Localization & Regional Language Support

* User language preference stored in profile (`/me`)
* AI insights localized server-side
* Frontend remains language-agnostic
* Supported languages:

  * English (`en`)
  * Tamil (`ta`)
  * Telugu (`te`)
  * Hindi (`hi`)

---

## 📴 Offline & Low-Literacy Support

* Voice-first UX minimizes reading dependency
* Cached views for poor connectivity
* Graceful degradation on slow networks
* Minimal frontend computation

---

## 🛡️ Security & Compliance

* JWT-based authentication
* Server-side enforcement of business logic
* No sensitive calculations on frontend
* Data hosted on **India-based servers**
* Architecture ready for fintech compliance extensions

---

## 🧪 Development Setup

```bash
# Install dependencies
npm install

# Run backend
npm run dev

# Run frontend
npm run dev
```

### Environment Variables

```
MONGODB_URI=
JWT_SECRET=
SARVAM_API_KEY=
```

---

## 🛣️ Roadmap

* 🔔 Real-time updates via WebSockets
* 📈 Advanced analytics (streaks, trends)
* 🎯 Savings projections and insights
* 📞 Human advisor escalation
* 🌍 Support for additional Indian languages

---

## 👤 Ownership & Contributions

Core system architecture, backend services, AI orchestration, and regional language R&D were designed and implemented with a focus on **scalability**, **correctness**, and **inclusive access for Indian users**.

---

## 📄 License

MIT License (update as applicable)
