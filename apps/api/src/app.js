import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import incomeRoutes from './routes/income.routes.js';
import savingsRoutes from './routes/savings.routes.js';
import profileRoutes from './routes/profile.routes.js';
import earningsRoutes from './routes/earnings.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import aiRoutes from './routes/ai.routes.js';
import sttRoute from "./routes/stt.js";
import ocrRoutes from "./routes/ocr.js";
import publicBotRoutes from './routes/landingBot.routes.js';

import { loadKnowledgeBase } from "../rag/loadKnowledgeBase.js";
import { assertEnv } from "./utils/assertEnv.js";
import { authMiddleware } from "./middleware/auth.js";
import aiProfileRoute from './routes/profile.ai.js';
assertEnv(); // 🔒 fail fast if env missing




const app = express();
const router = express.Router();


app.use(cors({
    origin: [
        'https://payday-xi.vercel.app',
        'https://payday-879j.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use(express.json());

/* ---------------- RAG INIT ---------------- */

// ✅ Load once at startup
export const KNOWLEDGE_BASE = loadKnowledgeBase();

console.log(
    `📚 Knowledge base loaded: ${KNOWLEDGE_BASE.domains.length} domains`
);

/* ----------------------------------------- */


// routes

app.use('/api/income', incomeRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/public-bot", publicBotRoutes);


app.use('/api/ai', aiRoutes);
app.use("/api/ocr", ocrRoutes);

app.use("/audio", express.static("public/audio"));
app.use("/api/stt", sttRoute);
app.use("/api/usage", aiProfileRoute);



// app.use(cookieParser());
// app.use(authMiddleware); 



export default app;
