import { useRef, useState } from "react";

export type VoiceResult = {
  transcript: string;
  english: string;
  language: string;
};

export function useVoice(
  onFinalResult: (result: VoiceResult) => void
) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [recording, setRecording] = useState(false);
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    chunksRef.current = [];
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      setRecording(false);
      setReady(true);
      stream.getTracks().forEach(t => t.stop());
    };

    recorder.start();
    setRecording(true);
    setReady(false);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const cancelRecording = () => {
    chunksRef.current = [];
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setReady(false);
  };

  const sendRecording = async () => {
    if (!ready || processing) return;

    setProcessing(true);

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const fd = new FormData();
    fd.append("audio", blob);

    try {
      const res = await fetch(
        import.meta.env.VITE_BACKE_END + "stt",
        {
          method: "POST",
          body: fd,
          // credentials: "include"
        }
      );

      const json = await res.json();
      onFinalResult(json.data);
    } catch (err) {
      console.error("STT failed", err);
    } finally {
      setProcessing(false);
      setReady(false);
      chunksRef.current = [];
    }
  };

  return {
    recording,
    ready,
    processing,
    startRecording,
    stopRecording,
    sendRecording,
    cancelRecording,
  };
}