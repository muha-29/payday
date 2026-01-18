import express from 'express';
import { askLandingBot } from "../controllers/publicBot.controller.js";

const router = express.Router();

router.post("/ask", askLandingBot);

export default router;
