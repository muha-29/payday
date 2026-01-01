import express from 'express';
import cors from 'cors';

import incomeRoutes from './routes/income.routes.js';
import savingsRoutes from './routes/savings.routes.js';
import profileRoutes from './routes/profile.routes.js';
import earningsRoutes from './routes/earnings.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/income', incomeRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/dashboard', dashboardRoutes);


export default app;
