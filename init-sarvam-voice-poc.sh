#!/bin/bash
set -e

echo "🚀 Initializing fresh Sarvam Voice Assistant POC (standalone)"

ROOT_DIR="sarvam-voice-poc"
BACKEND_DIR="sarvam-backend"
FRONTEND_DIR="sarvam-frontend"

mkdir -p $ROOT_DIR
cd $ROOT_DIR

############################################
# BACKEND (Standalone Node.js + Express)
############################################

echo "🔧 Creating backend..."

mkdir -p $BACKEND_DIR/src/{routes,services}
cd $BACKEND_DIR

cat > package.json <<EOF
{
  "name": "sarvam-voice-backend-poc",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "sarvamai": "^1.0.0"
  }
}
EOF

cat > src/index.js <<EOF
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

const PORT = 4000;
app.listen(PORT, () => {
  console.log("🚀 Backend running on http://localhost:" + PORT);
});
EOF

cat > src/routes/stt.js <<EOF
import express from "express";
import multer from "multer";
import { transcribe } from "../services/sarvam.stt.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const text = await transcribe(req.file.stream);
    res.json({ transcript: text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "STT failed" });
  }
});

export default router;
EOF

cat > src/routes/chat.js <<EOF
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text } = req.body;
  res.json({ reply: "Echo: " + text });
});

export default router;
EOF

cat > src/routes/tts.js <<EOF
import express from "express";
import { speak } from "../services/sarvam.tts.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, language = "en" } = req.body;
  const audio = await speak(text, language);
  res.set("Content-Type", "audio/mpeg");
  res.send(audio);
});

export default router;
EOF

cat > src/services/sarvam.stt.js <<EOF
import { SarvamAIClient } from "sarvamai";

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY
});

export async function transcribe(fileStream) {
  const res = await client.speechToText.transcribe({
    file: fileStream,
    model: "saarika:v2.5",
    language_code: "auto"
  });
  return res.transcript;
}
EOF

cat > src/services/sarvam.tts.js <<EOF
export async function speak(text, language) {
  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": process.env.SARVAM_API_KEY
    },
    body: JSON.stringify({
      text,
      language,
      voice: "default"
    })
  });

  return Buffer.from(await res.arrayBuffer());
}
EOF

cd ..

############################################
# FRONTEND (Standalone Vite + React)
############################################

echo "🎨 Creating frontend..."

mkdir -p $FRONTEND_DIR
cd $FRONTEND_DIR

npm create vite@latest . -- --template react-ts
npm install

cat > src/App.tsx <<EOF
import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");

  const record = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob);

      const res = await fetch("http://localhost:4000/stt", {
        method: "POST",
        body: fd
      });

      const data = await res.json();
      setText(data.transcript);
    };

    recorder.start();
    setTimeout(() => recorder.stop(), 4000);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sarvam Voice Assistant POC</h2>
      <button onClick={record}>🎙️ Speak</button>
      <p>{text}</p>
    </div>
  );
}
EOF

echo ""
echo "✅ Standalone POC created successfully"
echo ""
echo "Next steps:"
echo "1️⃣ export SARVAM_API_KEY=your_key_here"
echo "2️⃣ cd $ROOT_DIR/$BACKEND_DIR && npm install && npm run dev"
echo "3️⃣ cd $ROOT_DIR/$FRONTEND_DIR && npm run dev"
echo ""
echo "🎯 No dependency on existing apps/web or apps/api"
