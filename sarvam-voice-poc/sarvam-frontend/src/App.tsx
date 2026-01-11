import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState<"idle" | "recording">("idle");
  const [transcript, setTranscript] = useState("");
  const [english, setEnglish] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recordAndSend = async () => {
    setError(null);
    setTranscript("");
    setEnglish("");
    setLanguage("");
    setStatus("recording");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: "audio/webm" });

          /* ---------- 1️⃣ STT ---------- */
          const fd = new FormData();
          fd.append("audio", blob);

          const sttRes = await fetch("http://localhost:4000/stt", {
            method: "POST",
            body: fd,
          });

          if (!sttRes.ok) {
            throw new Error("STT failed");
          }

          const { transcript, english, language } = await sttRes.json();

          setTranscript(transcript || "(no transcript)");
          setEnglish(english || "");
          setLanguage(language || "");

          /* ---------- 2️⃣ TTS (BEST-EFFORT) ---------- */
          try {
            const ttsRes = await fetch("http://localhost:5000/tts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: english || transcript,
                language: "en-IN",
              }),
            });

            if (!ttsRes.ok) {
              console.warn("[TTS] Request failed");
              return;
            }

            const arrayBuffer = await ttsRes.arrayBuffer();

            // Skip empty audio
            if (!arrayBuffer || arrayBuffer.byteLength < 1000) {
              console.warn("[TTS] Audio too small to play");
              return;
            }

            const audioContext =
              new (window.AudioContext || (window as any).webkitAudioContext)();

            if (audioContext.state === "suspended") {
              await audioContext.resume();
            }

            const audioBuffer = await audioContext
              .decodeAudioData(arrayBuffer)
              .catch((err) => {
                console.warn("[TTS] Decode failed, skipping audio", err);
                return null;
              });

            if (!audioBuffer) return;

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();

            source.onended = () => {
              audioContext.close().catch(() => { });
            };
          } catch (ttsErr) {
            console.warn("[TTS] Playback skipped", ttsErr);
          }

          setStatus("idle");
        } catch (err: any) {
          console.error("[Voice Flow Error]", err);
          setError(err.message || "Voice processing failed");
          setStatus("idle");
        }
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 4000);
    } catch (err: any) {
      setError(err.message || "Error occurred");
      setStatus("idle");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#020617",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ marginBottom: 12 }}>
          🎙️ Sarvam Voice Assistant
        </h2>

        <button
          onClick={recordAndSend}
          disabled={status === "recording"}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 8,
            border: "none",
            background: status === "recording" ? "#334155" : "#2563eb",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {status === "recording" ? "Listening..." : "Speak"}
        </button>

        {/* ---------- ORIGINAL TRANSCRIPT ---------- */}
        <div style={{ marginTop: 16 }}>
          <strong>Transcript ({language || "original"})</strong>
          <div
            style={{
              marginTop: 8,
              padding: 10,
              minHeight: 50,
              background: "#020617",
              border: "1px solid #1e293b",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {transcript || "—"}
          </div>
        </div>

        {/* ---------- ENGLISH TRANSLATION ---------- */}
        <div style={{ marginTop: 16 }}>
          <strong>English</strong>
          <div
            style={{
              marginTop: 8,
              padding: 10,
              minHeight: 50,
              background: "#020617",
              border: "1px solid #1e293b",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {english || "—"}
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, color: "#f87171" }}>
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}