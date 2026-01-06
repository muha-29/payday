import { useRef, useState } from "react";
import { floatTo16BitPCM, downsampleBuffer } from "../../utils/audio";

type TranscriptMsg = {
    type: "partial_transcript" | "final_transcript";
    text: string;
};

export function VoiceAssistant() {
    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const [listening, setListening] = useState(false);
    const [partialText, setPartialText] = useState("");
    const [finalText, setFinalText] = useState("");

    /* ---------------- WS ---------------- */

    const initWebSocket = () => {
        const ws = new WebSocket("ws://localhost:4000/voice");
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
            console.log("WS connected");
        };

        ws.onmessage = (event) => {
            const data: TranscriptMsg = JSON.parse(event.data);

            if (data.type === "partial_transcript") {
                setPartialText(data.text);
            }

            if (data.type === "final_transcript") {
                setFinalText((prev) => prev + " " + data.text);
                setPartialText("");
            }
        };

        ws.onerror = (err) => {
            console.error("WS error", err);
        };

        ws.onclose = () => {
            console.log("WS closed");
        };

        wsRef.current = ws;
    };

    /* ---------------- AUDIO ---------------- */

    const startAudioStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const audioContext = new AudioContext({ sampleRate: 48000 });
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (event) => {
            const ws = wsRef.current;
            if (!ws || ws.readyState !== WebSocket.OPEN) return;

            const input = event.inputBuffer.getChannelData(0);

            const downsampled = downsampleBuffer(
                input,
                audioContext.sampleRate,
                16000
            );

            const pcm16 = floatTo16BitPCM(downsampled);
            ws.send(pcm16);
        };
    };

    /* ---------------- CONTROLS ---------------- */

    const startListening = async () => {
        if (listening) return;

        setFinalText("");
        setPartialText("");

        initWebSocket();
        await startAudioStream();

        setListening(true);
    };

    const stopListening = () => {
        processorRef.current?.disconnect();
        audioContextRef.current?.close();
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        wsRef.current?.close();

        processorRef.current = null;
        audioContextRef.current = null;
        mediaStreamRef.current = null;
        wsRef.current = null;

        setListening(false);
    };

    /* ---------------- UI ---------------- */

    return (
        <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 12 }}>
                <button onClick={startListening} disabled={listening}>
                    Start
                </button>
                <button onClick={stopListening} disabled={!listening}>
                    Stop
                </button>
            </div>

            <div>
                <strong>Live:</strong> {partialText}
            </div>

            <div style={{ marginTop: 8 }}>
                <strong>Final:</strong> {finalText}
            </div>
        </div>
    );
}