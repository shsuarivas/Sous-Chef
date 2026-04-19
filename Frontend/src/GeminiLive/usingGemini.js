import nlp from 'compromise';
import numbers from 'compromise-numbers';
import { useState, useRef, useCallback } from "react";
//import modularRecipe from 'recipe.json'; 
//React says file is missing, possibly due to path error? idk. commented out until added. Aiden mightve tried to use the recipe.json file from the Backend/ directory.

const WS_BASE = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";

function runFSA(parsed_input){
  let fsa_integer = 0; let done = false; let num_step = 0; let num; let timer_total = 0; let key = 0;
  for(let i = 0; i <= parsed_input.length; i++){
    while(fsa_integer != -1){
      switch(fsa_integer){
        case 0:
          if(parsed_input[i] == "restart"){ fsa_integer = 1; break; }
          else if(parsed_input[i] == "continue"){ fsa_integer = 3; break; }
          else if(parsed_input[i] == "repeat"){ fsa_integer = 5; break; }
          else if(parsed_input[i] == "stop"){ fsa_integer = 7; break; }
          else if(parsed_input[i] == "go"){ fsa_integer = 9; break; }
          else if(parsed_input[i] == "start"){ fsa_integer = 18; break; }
          else if(parsed_input[i] == "begin"){ fsa_integer = 25; break; }
          else if(parsed_input[i] == "pause"){ fsa_integer = 35; break; }
          else{ fsa_integer = -1; break; }
        case 1:
          if(parsed_input[i] == "the"){ fsa_integer = 2; break; }
          else if(parsed_input[i] == "recipe"){ done = true; fsa_integer = -1; key = 3; break; }
          else if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 104; break; }
          else{ fsa_integer = -1; break; }
        case 2:
          if(parsed_input[i] == "recipe"){ done = true; fsa_integer = -1; key = 3; break; }
          else if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 104; break; }
          else{ fsa_integer = -1; break; }
        case 3:
          if(parsed_input[i] == "the"){ fsa_integer = 4; break; }
          else if(parsed_input[i] == "recipe"){ done = true; fsa_integer = -1; key = 2; break; }
          else if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 102; break; }
          else{ fsa_integer = -1; break; }
        case 4:
          if(parsed_input[i] == "recipe"){ done = true; fsa_integer = -1; key = 2; break; }
          else if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 102; break; }
          else{ fsa_integer = -1; break; }
        case 5:
          if(parsed_input[i] == "yourself"){ done = true; fsa_integer = -1; key = 3; break; }
          else if(parsed_input[i] == "the"){ fsa_integer = 6; break; }
          else{ fsa_integer = -1; break; }
        case 6:
          if(parsed_input[i] == "step"){ done = true; fsa_integer = -1; key = 3; break; }
          else{ fsa_integer = -1; break; }
        case 7:
          if(parsed_input[i] == "the"){ fsa_integer = 8; break; }
          else if(parsed_input[i] == "recipe"){ done = true; fsa_integer = -1; key = 4; break; }
          else if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 103; break; }
          else{ fsa_integer = -1; break; }
        case 8:
          if(parsed_input[i] == "recipe"){ done = true; fsa_integer = -1; key = 4; break; }
          else if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 103; break; }
          else{ fsa_integer = -1; break; }
        case 9:
          if(parsed_input[i] == "on"){ done = true; fsa_integer = -1; key = 2; break; }
          else if(parsed_input[i] == "back"){ fsa_integer = 10; break; }
          else if(parsed_input[i] == "onto" || parsed_input[i] == "to"){ fsa_integer = 11; break; }
          else{ fsa_integer = -1; break; }
        case 10:
          if(parsed_input[i] == "to"){ fsa_integer = 11; break; }
          else{ done = true; fsa_integer = -1; key = 5; break; }
        case 11:
          if(parsed_input[i] == "next"){ fsa_integer = 12; break; }
          else if(parsed_input[i] == "previous"){ fsa_integer = 13; break; }
          else if(parsed_input[i] == "beginning"){ fsa_integer = 14; break; }
          else if(parsed_input[i] == "the"){ fsa_integer = 17; break; }
          else if(parsed_input[i] == "step"){ fsa_integer = 34; break; }
          else{ fsa_integer = -1; break; }
        case 12:
          if(parsed_input[i] == "step"){ done = true; fsa_integer = -1; key = 2; break; }
          else{ fsa_integer = -1; break; }
        case 13:
          if(parsed_input[i] == "step"){ done = true; fsa_integer = -1; key = 5; break; }
          else{ fsa_integer = -1; break; }
        case 14:
          if(parsed_input[i] == "of"){ fsa_integer = 15; break; }
          else{ fsa_integer = -1; break; }
        case 15:
          if(parsed_input[i] == "the"){ fsa_integer = 16; break; }
          else{ fsa_integer = -1; break; }
        case 16:
          if(parsed_input[i] == "recipe"){ done = true; fsa_integer = -1; key = 3; break; }
          else{ fsa_integer = -1; break; }
        case 17:
          num_step = nlp(parsed_input[i]).numbers.get()[0];
          if(parsed_input[i] == "next"){ fsa_integer = 12; break; }
          else if(parsed_input[i] == "previous"){ fsa_integer = 13; break; }
          else if(parsed_input[i] == "beginning"){ fsa_integer = 14; break; }
          else if(num_step != undefined){ fsa_integer = 33; break; }
          else{ fsa_integer = -1; break; }
        case 18:
          num = nlp(parsed_input[i]).numbers.get()[0]; // ✅ fixed - was calling .numbers on a string
          if(parsed_input[i] == "the" || parsed_input[i] == "a"){ fsa_integer = 19; break; }
          else if(parsed_input[i] == "timer"){ fsa_integer = 20; break; }
          else if(num != undefined){ timer_total = num; fsa_integer = 22; break; }
          else{ fsa_integer = -1; break; }
        case 19:
          if(parsed_input[i] == "recipe"){ done = true; fsa_integer = -1; key = 3; break; }
          else if(parsed_input[i] == "timer"){ fsa_integer = 20; break; }
          else{ fsa_integer = -1; break; }
        case 20:
          if(parsed_input[i] == "for"){ fsa_integer = 21; break; }
          else{ done = true; fsa_integer = -1; key = 101; break; }
        case 21:
          num = nlp(parsed_input[i]).numbers.get()[0];
          if(parsed_input[i] == "an" || parsed_input[i] == "a"){ fsa_integer = 22; break; }
          else if(num != undefined){ timer_total = num; fsa_integer = 22; break; }
          else if(parsed_input[i] == "half"){ timer_total = 0.5; fsa_integer = 27; break; }
          else{ fsa_integer = -1; break; }
        case 22:
          if(parsed_input[i] == "second" || parsed_input[i] == "seconds"){
            done = true; timer_total = timer_total * 1; fsa_integer = -1; key = 101; break;
          } else if(parsed_input[i] == "minute" || parsed_input[i] == "minutes"){
            done = true; timer_total = timer_total * 60; fsa_integer = 23; key = 101; break;
          } else if(parsed_input[i] == "hour" || parsed_input[i] == "hours"){
            done = true; timer_total = timer_total * 3600; fsa_integer = 23; key = 101; break; // ✅ fixed 3600, not 21600
          } else{ done = false; fsa_integer = -1; break; }
        case 23:
          if(parsed_input[i] == "and"){ fsa_integer = 24; break; }
          else{ done = true; fsa_integer = -1; key = 101; break; }
        case 24:
          if(parsed_input[i] == "a" || parsed_input[i] == "an"){ fsa_integer = 25; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 25:
          if(parsed_input[i] == "half"){ timer_total += 0.5 * 60; fsa_integer = -1; done = true; key = 101; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 26:
          if(parsed_input[i] == "hour"){ timer_total += 3600; fsa_integer = -1; done = true; key = 101; break; }
          else if(parsed_input[i] == "minute"){ timer_total += 60; fsa_integer = -1; done = true; key = 101; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 27:
          if(parsed_input[i] == "a" || parsed_input[i] == "an"){ fsa_integer = 26; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 28:
          if(parsed_input[i] == "second" || parsed_input[i] == "seconds"){ timer_total *= 1; fsa_integer = -1; done = true; key = 101; break; }
          else if(parsed_input[i] == "minute" || parsed_input[i] == "minutes"){ timer_total *= 60; fsa_integer = 30; break; }
          else if(parsed_input[i] == "hour" || parsed_input[i] == "hours"){ timer_total *= 3600; fsa_integer = 30; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 29:
          if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 101; break; }
          else{ done = true; fsa_integer = -1; key = 101; break; }
        case 30:
          if(parsed_input[i] == "and"){ fsa_integer = 31; break; }
          else{ fsa_integer = 29; break; }
        case 31:
          if(parsed_input[i] == "a" || parsed_input[i] == "an"){ fsa_integer = 32; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 32:
          if(parsed_input[i] == "half"){ timer_total += 0.5 * 60; fsa_integer = 29; break; }
          else{ fsa_integer = 29; break; }
        case 33:
          if(parsed_input[i] == "step"){ done = true; fsa_integer = -1; key = 4; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 34:
          num_step = nlp(parsed_input[i]).numbers.get()[0];
          if(num_step != undefined){ done = true; fsa_integer = -1; key = 4; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 35:
          if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 103; break; }
          else if(parsed_input[i] == "the"){ fsa_integer = 36; break; }
          else{ done = false; fsa_integer = -1; break; }
        case 36:
          if(parsed_input[i] == "timer"){ done = true; fsa_integer = -1; key = 103; break; }
          else{ done = false; fsa_integer = -1; break; }
      }
      if(done) break;
    }
    if(done) break;
  }
  return { done, timer_total, num_step, key };
}

function handleCommand(fsaResult, recipe, currentStep) {
  if (!fsaResult.done) return null;
  const { key, num_step, timer_total } = fsaResult;

  if (key == 2)   return { action: "NEXT_STEP",      stepIndex: currentStep + 1 };
  if (key == 5)   return { action: "PREV_STEP",      stepIndex: currentStep - 1 };
  if (key == 4)   return { action: "GO_TO_STEP",     stepIndex: num_step };
  if (key == 3)   return { action: "RESTART",         stepIndex: 0 };
  if (key == 101) return { action: "START_TIMER",    seconds: timer_total };
  if (key == 102) return { action: "CONTINUE_TIMER", seconds: timer_total };
  if (key == 103) return { action: "STOP_TIMER",     seconds: timer_total };
  if (key == 104) return { action: "RESTART_TIMER",  seconds: timer_total };

  return null;
}

export function useGeminiLive(recipe) { 
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState({ user: "", model: "" });
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);

  const speakStep = useCallback((instruction) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(instruction);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const startMic = useCallback(async () => {
    try {
      const ctx = audioContextRef.current;
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = ctx.createMediaStreamSource(streamRef.current);
      await ctx.audioWorklet.addModule("/audio-processor.js");
      const processor = new AudioWorkletNode(ctx, "pcm-processor");
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
      source.connect(processor);
      processor.connect(ctx.destination);
    } catch (e) {
      console.error("startMic failed:", e.message, e);
    }
  }, []);

  const connect = useCallback(async () => {
    setStatus("connecting");

    const { token } = await fetch('http://localhost:8080/api/token').then(r => r.json());
    const ws = new WebSocket(`${WS_BASE}?access_token=${token}`);
    wsRef.current = ws;
    audioContextRef.current = new AudioContext({ sampleRate: 16000 });

    ws.onopen = () => {
      ws.send(JSON.stringify({
        setup: {
          model: "gemini-2.0-flash-live-preview",
          generationConfig: { responseModalities: ["AUDIO"] }
        }
      }));
    };

    ws.onmessage = async (event) => {
      let msg;
      if (event.data instanceof Blob) {
        const text = await event.data.text();
        try { msg = JSON.parse(text); } catch { return; }
      } else {
        try { msg = JSON.parse(event.data); } catch { return; }
      }

      if (msg?.setupComplete) {
        setStatus("active");
        await startMic();
        return;
      }

      const transcription = msg?.serverContent?.inputTranscription;
      if (transcription?.finished) {
        const userText = transcription.text;
        setTranscript((t) => ({ ...t, user: userText }));

        const segmentation = new Intl.Segmenter('en', { granularity: 'word' });
        const parsed_input = [...segmentation.segment(userText)]
          .filter(s => s.isWordLike)
          .map(s => s.segment.toLowerCase());

        const fsaResult = runFSA(parsed_input);
        const command = handleCommand(fsaResult, recipe, currentStep);

        if (command) {
          console.log("Recipe command:", command);
          switch (command.action) {
            case "NEXT_STEP":
              setCurrentStep(command.stepIndex);
              speakStep(modularRecipe.steps[command.stepIndex].instruction);
              break;
            case "PREV_STEP":
              setCurrentStep(command.stepIndex);
              speakStep(modularRecipe.steps[command.stepIndex].instruction);
              break;
            case "GO_TO_STEP":
              setCurrentStep(command.stepIndex);
              speakStep(modularRecipe.steps[command.stepIndex].instruction);
              break;
            case "RESTART":
              setCurrentStep(0);
              speakStep(modularRecipe.steps[0].instruction);
              break;
            case "START_TIMER":
              setTimer(command.seconds);
              speakStep(`Timer started for ${command.seconds} seconds`);
              break;
            case "RESTART_TIMER":
              setTimer(command.seconds);
              speakStep("Timer restarted");
              break;
            case "CONTINUE_TIMER":
              speakStep("Timer continued");
              break;
            case "STOP_TIMER":
              setTimer(0);
              speakStep("Timer stopped");
              break;
          }
        }
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = (e) => {
      console.log("WS Closed:", e.code, e.reason);
      setStatus("idle");
    };
  }, [startMic, speakStep, recipe, currentStep]);

  const disconnect = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    processorRef.current?.disconnect();
    wsRef.current?.close();
    audioContextRef.current?.close();
    setStatus("idle");
  }, []);

  return { status, transcript, currentStep, timer, connect, disconnect };
}
