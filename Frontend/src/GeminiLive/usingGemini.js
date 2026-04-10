// src/hooks/useGeminiLive.js
import { useState, useRef, useCallback } from "react";

const WS_BASE = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";

export function useGeminiLive() {
  const [status, setStatus] = useState("idle"); // idle | connecting | active | error
  const [transcript, setTranscript] = useState({ user: "", model: "" });

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);

  // ── Playback: decode & play PCM audio from Gemini ──────────────────────────
  const playAudioChunk = useCallback(async (base64PCM) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const raw = atob(base64PCM);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    // Gemini outputs: PCM 16-bit LE, mono, 24 kHz
    const samples = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) float32[i] = samples[i] / 32768;

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  }, []);

  // ── Mic capture: stream PCM 16-bit LE @ 16 kHz to WebSocket ───────────────
  const startMic = useCallback(async () => {
  try {
    const ctx = audioContextRef.current;
    console.log("1️⃣ AudioContext:", ctx);
    
    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("2️⃣ Got mic stream");
    
    const source = ctx.createMediaStreamSource(streamRef.current);
    console.log("3️⃣ Created source");
    
    await ctx.audioWorklet.addModule("/audio-processor.js");
    console.log("4️⃣ Loaded worklet");
    
    const processor = new AudioWorkletNode(ctx, "pcm-processor");
    console.log("5️⃣ Created processor node");
    
    processorRef.current = processor;
    processor.port.onmessage = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(e.data.buffer)));
        wsRef.current.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: base64 }],
          },
        }));
      }
    };

    //source.connect(processor);
    processor.connect(ctx.destination);
    console.log("6️⃣ Mic fully connected");
    
  } catch (e) {
    console.error("❌ startMic failed at:", e.message, e);
  }
}, []);
  // ── Connect ────────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setStatus("connecting");

    // 1. Fetch ephemeral token from your backend
    //const { token } = await fetch("/api/token").then((r) => r.json());
    // If running in Docker/production
    const { token } = await fetch('http://localhost:8080/api/token').then(r => r.json());

    // 2. Open WebSocket (token used as access_token query param)
    const ws = new WebSocket(`${WS_BASE}?access_token=${token}`);
    wsRef.current = ws;
    audioContextRef.current = new AudioContext({ sampleRate: 16000 });

    ws.onopen = () => {
      // 3. Send session setup as first message
      ws.send(JSON.stringify({
        setup: {
        model: "gemini-3.1-flash-live-preview",
        generationConfig: { responseModalities: ["AUDIO"] }
        }
      }));
    };

ws.onmessage = async (event) => {
  let msg;
  
  // Handle both binary blobs and text
  if (event.data instanceof Blob) {
    const text = await event.data.text();
    try {
      msg = JSON.parse(text);
      console.log("📨 Blob parsed as JSON:", JSON.stringify(msg));
    } catch (e) {
      console.log("📦 Binary blob (not JSON):", text);
      return;
    }
  } else {
    try {
      msg = JSON.parse(event.data);
      console.log("📨 Message:", JSON.stringify(msg));
    } catch (e) {
      console.log("Non-JSON message:", event.data);
      return;
    }
  }

  if (msg.setupComplete) {
    setStatus("active");
    await startMic();
  }

  const parts = msg.serverContent?.modelTurn?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith("audio/pcm")) {
      await playAudioChunk(part.inlineData.data);
    }
  }

  if (msg.serverContent?.inputTranscription?.text) {
    setTranscript((t) => ({ ...t, user: msg.serverContent.inputTranscription.text }));
  }
  if (msg.serverContent?.outputTranscription?.text) {
    setTranscript((t) => ({ ...t, model: msg.serverContent.outputTranscription.text }));
  }
};

    ws.onerror = () => setStatus("error");
    ws.onclose = (e) => {
      console.log("🔴 WS Closed:", e.code, e.reason);
      setStatus("idle");
    };
  }, [startMic, playAudioChunk]);

  // ── Disconnect ─────────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    processorRef.current?.disconnect();
    wsRef.current?.close();
    audioContextRef.current?.close();
    setStatus("idle");
  }, []);

  return { status, transcript, connect, disconnect };
}