import { useRef } from "react";
const domain = 'https://payday-api.onrender.com/api';

export type VoiceResult = {
  transcript: string; // native language
  english: string;    // translated English
  language: string;
};

export function useVoice(
  onFinalResult: (result: VoiceResult) => void
) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const start = async () => {
    try {
      console.log("🎤 Starting Sarvam voice capture");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        console.log("🛑 Mic stopped, sending to Sarvam STT");

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        const fd = new FormData();
        fd.append("audio", blob);

        try {
          const res = await fetch(`${domain}/stt`, {
            method: "POST",
            body: fd,
          });

          if (!res.ok) {
            throw new Error("STT request failed");
          }

          const json = await res.json();
          const data = json.data;

          if (!data?.transcript) {
            console.warn("⚠️ Empty STT result");
            return;
          }

          const result: VoiceResult = {
            transcript: data.transcript,
            english: data.english || data.transcript,
            language: data.language || "unknown",
          };

          console.log("🎙️ Voice result:", result);

          onFinalResult(result);
        } catch (err) {
          console.error("❌ Sarvam STT failed", err);
        } finally {
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.start();

      // ⏱️ Fixed capture window (POC-safe)
      setTimeout(() => recorder.stop(), 4000);
    } catch (err) {
      console.error("❌ Mic error", err);
    }
  };

  return { start };
}