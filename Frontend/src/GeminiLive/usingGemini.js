import nlp from 'compromise';
import { useState, useRef, useCallback } from "react";

const WS_BASE = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";

export function useGeminiLive(recipe) {
    const steps = recipe?.steps ?? [];

    const [status,     setStatus]     = useState("idle");
    const [transcript, setTranscript] = useState({ user: "", model: "" });
    const [stepIndex,  setStepIndex]  = useState(0);
    const [timer,      setTimer]      = useState(0);

    const stepIndexRef    = useRef(0);
    const stepsRef        = useRef(steps);
    stepsRef.current      = steps;

    const wsRef           = useRef(null);
    const audioContextRef = useRef(null);
    const recognitionRef  = useRef(null);

    const speak = useCallback((text) => {
        setTranscript(t => ({ ...t, model: text }));
        window.speechSynthesis.cancel();
        recognitionRef.current?.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Pick a better voice
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name === "Microsoft Liam Online (Natural) - English (Canada)");
        if (preferred) utterance.voice = preferred;
        utterance.rate = 0.95;

        utterance.onend = () => {
            try { recognitionRef.current?.start(); } catch (e) { /* idk */ }
        };
        window.speechSynthesis.speak(utterance);
    }, []);

    const goTo = useCallback((index) => {
        const total = stepsRef.current.length;
        const clamped = Math.max(0, Math.min(index, total - 1));
        stepIndexRef.current = clamped;
        setStepIndex(clamped);
        const instruction = stepsRef.current[clamped]?.instruction ?? "No steps found.";
        speak(`Step ${clamped + 1}: ${instruction}`);
    }, [speak]);

    const startMic = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => console.log("Recognition started");
        recognition.onerror = (e) => console.error("Recognition error:", e.error);
        recognition.onend = () => {
            try { recognitionRef.current?.start(); } catch (e) { /* ignore */ }
        };

        recognition.onresult = (event) => {
            const userText = event.results[event.results.length - 1][0].transcript.trim();
            setTranscript(t => ({ ...t, user: userText }));

            const words = [...new Intl.Segmenter("en", { granularity: "word" }).segment(userText)]
                .filter(s => s.isWordLike)
                .map(s => s.segment.toLowerCase());

            const phrase = words.join(" ");

            if (phrase === "start the recipe" || phrase === "start recipe") {
                goTo(0);
            } else if (phrase === "next step") {
                goTo(stepIndexRef.current + 1);
            } else if (phrase === "previous step") {
                goTo(stepIndexRef.current - 1);
            } else if (phrase === "restart the recipe" || phrase === "restart recipe") {
                goTo(0);
            } else if (phrase === "repeat yourself" || phrase === "repeat the step") {
                goTo(stepIndexRef.current);
            } else {
                const match = phrase.match(/go to (?:step )?(\w+)/);
                if (match) {
                    const num = nlp(match[1]).numbers().get()[0];
                    if (num !== undefined) goTo(num - 1);
                }
            }
        };

        recognition.start();
    }, [goTo]);

    const connect = useCallback(async () => {
        setStatus("connecting");
        const { token } = await fetch("http://localhost:8080/api/token").then(r => r.json());
        const ws = new WebSocket(`${WS_BASE}?access_token=${token}`);
        wsRef.current = ws;
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });

        ws.onopen = () => {
            ws.send(JSON.stringify({
                setup: {
                    model: "gemini-2.0-flash-live-preview",
                    generationConfig: { responseModalities: ["AUDIO"] },
                    outputAudioTranscription: {},
                }
            }));
        };

        ws.onmessage = async (event) => {
            const raw = event.data instanceof Blob ? await event.data.text() : event.data;
            let msg;
            try { msg = JSON.parse(raw); } catch { return; }

            if (msg?.setupComplete) {
                setStatus("active");
                startMic();
                return;
            }
        };

        ws.onerror = () => setStatus("error");
        ws.onclose = (e) => { console.log("WS closed:", e.code, e.reason); setStatus("idle"); };
    }, [startMic]);

    const disconnect = useCallback(() => {
        recognitionRef.current?.stop();
        recognitionRef.current = null;
        window.speechSynthesis.cancel();
        wsRef.current?.close();
        audioContextRef.current?.close();
        audioContextRef.current = null;
        setStatus("idle");
    }, []);

    const goToStep = useCallback((index) => {
        const clamped = Math.max(0, Math.min(index, stepsRef.current.length - 1));
        stepIndexRef.current = clamped;
        setStepIndex(clamped);
    }, []);

    return { status, transcript, stepIndex, timer, connect, disconnect, goToStep };
}