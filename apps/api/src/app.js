import express from 'express';
import cors from 'cors';

import incomeRoutes from './routes/income.routes.js';
import savingsRoutes from './routes/savings.routes.js';
import profileRoutes from './routes/profile.routes.js';
import earningsRoutes from './routes/earnings.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import aiRoutes from './routes/ai.routes.js';
import sttRoute from "./routes/stt.js";



const app = express();

app.use(cors({
    origin: [
        'https://payday-xi.vercel.app',
        'https://payday-879j.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true
})); 

app.use(express.json());

app.use('/api/income', incomeRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/stt", sttRoute);
app.use('/api/ai', aiRoutes);
app.use("/audio", express.static("public/audio"));



export default app;
