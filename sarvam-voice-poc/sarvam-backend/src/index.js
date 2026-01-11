import express from "express";
import cors from "cors";
import sttRoute from "./routes/stt.js";
import ttsRoute from "./routes/tts.js";
import chatRoute from "./routes/chat.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/stt", sttRoute);
app.use("/tts", ttsRoute);
app.use("/chat", chatRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log("🚀 Backend running on http://localhost:" + PORT);
});
