/*
 * 
 * There is a good amount of code here from the Gemini Repo
 * 
 */

import nlp from 'compromise';
import numbers from 'compromise-numbers';
import { useState, useRef, useCallback } from "react";

const WS_BASE = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained";

const MultimodalLiveResponseType = {
  TEXT: "TEXT",
  AUDIO: "AUDIO",
  SETUP_COMPLETE: "SETUP COMPLETE",
  INTERRUPTED: "INTERRUPTED",
  TURN_COMPLETE: "TURN COMPLETE",
  TOOL_CALL: "TOOL_CALL",
  ERROR: "ERROR",
  INPUT_TRANSCRIPTION: "INPUT_TRANSCRIPTION",
  OUTPUT_TRANSCRIPTION: "OUTPUT_TRANSCRIPTION",
};




function parseResponseMessages(data) {
  const responses = [];
  const serverContent = data?.serverContent;
  const parts = serverContent?.modelTurn?.parts;

  try {
    // Setup complete (exclusive — no other fields expected)
    if (data?.setupComplete) {
      console.log("🏁 SETUP COMPLETE response", data);
      responses.push({ type: MultimodalLiveResponseType.SETUP_COMPLETE, data: "", endOfTurn: false });
      return responses;
    }

    // Tool call (exclusive)
    if (data?.toolCall) {
      console.log("🎯 🛠️ TOOL CALL response", data?.toolCall);
      responses.push({ type: MultimodalLiveResponseType.TOOL_CALL, data: data.toolCall, endOfTurn: false });
      return responses;
    }

    // Audio data from model turn parts
    if (parts?.length) {
      for (const part of parts) {
        if (part.inlineData) {
          responses.push({ type: MultimodalLiveResponseType.AUDIO, data: part.inlineData.data, endOfTurn: false });
        } else if (part.text) {
          console.log("💬 TEXT response", part.text);
          responses.push({ type: MultimodalLiveResponseType.TEXT, data: part.text, endOfTurn: false });
        }
      }
    }

    // Transcriptions — checked independently, NOT in else-if with audio
    if (serverContent?.inputTranscription) {
      responses.push({
        type: MultimodalLiveResponseType.INPUT_TRANSCRIPTION,
        data: {
          text: serverContent.inputTranscription.text || "",
          finished: serverContent.inputTranscription.finished || false,
        },
        endOfTurn: false,
      });
    }

    if (serverContent?.outputTranscription) {
      responses.push({
        type: MultimodalLiveResponseType.OUTPUT_TRANSCRIPTION,
        data: {
          text: serverContent.outputTranscription.text || "",
          finished: serverContent.outputTranscription.finished || false,
        },
        endOfTurn: false,
      });
    }

    // Interrupted
    if (serverContent?.interrupted) {
      console.log("🗣️ INTERRUPTED response");
      responses.push({ type: MultimodalLiveResponseType.INTERRUPTED, data: "", endOfTurn: false });
    }

    // Turn complete
    if (serverContent?.turnComplete) {
      console.log("🏁 TURN COMPLETE response");
      responses.push({ type: MultimodalLiveResponseType.TURN_COMPLETE, data: "", endOfTurn: true });
    }
  } catch (err) {
    console.log("⚠️ Error parsing response data: ", err, data);
  }

  return responses;
}

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
    source.connect(processor);
    source.start();
  }, []);

  // ── Mic capture: stream PCM 16-bit LE @ 16 kHz to WebSocket ───────────────
  const startMic = useCallback(async () => {
  try {
    const ctx = audioContextRef.current;
    console.log("AudioContext:", ctx);
    
    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Got mic stream");
    
    const source = ctx.createMediaStreamSource(streamRef.current);
    console.log("Created source");
    
    await ctx.audioWorklet.addModule("/audio-processor.js");
    console.log("Loaded worklet");
    
    const processor = new AudioWorkletNode(ctx, "pcm-processor");
    console.log("Created processor node");
    
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
    console.log("Mic fully connected");
    
  } catch (e) {
    console.error("startMic failed at:", e.message, e);
  }
}, []);
  // ── Connect ────────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setStatus("connecting");

    const { token } = await fetch('http://localhost:8080/api/token').then(r => r.json());


    const ws = new WebSocket(`${WS_BASE}?access_token=${token}`);
    wsRef.current = ws;
    audioContextRef.current = new AudioContext({ sampleRate: 16000 });

    ws.onopen = () => {
      ws.send(JSON.stringify({
        setup: {
        model: "gemini-3.1-flash-live-preview",
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

  const segmentation = new Intl.Segmenter('en', {granularity: 'word'});

  const segments = segmentation.segment(msg);

  const parsed_input = [...segments]
    .filter(s =>s.isWordLike)
    .map(s => s.segment.toLowerCase());
  
  let fsa_integer = 0; let done = false; let val; let num; let timer_total = 0;
  for(let i = 0; i <= parsed_input.length; i++){
  while(fsa_integer != -1){
      switch(fsa_integer){
        case 0:
          if(parsed_input[i] == "restart"){
            fsa_integer = 1; break;
          } else if(parsed_input[i] == "continue"){
            fsa_integer = 3; break;
          } else if(parsed_input[i] == "repeat"){
            fsa_integer = 5; break;
          } else if(parsed_input[i] == "stop"){
            fsa_integer = 7; break;
          } else if(parsed_input[i] == "go"){
            fsa_integer = 9; break;
          } else if(parsed_input[i] == "start"){
            fsa_integer = 18; break;
          } else if(parsed_input[i] == "begin"){
            fsa_integer = 25; break;
          } else{
            fsa_integer = -1; break;
          }
        case 1:
          if(parsed_input[i] == "the"){
            fsa_integer = 2; break;
          } else if( parsed_input == "recipe"){
            done = true; fsa_integer = -1; break; // restart recipe
          } else if( parsed_input[i] == "timer"){
            done = true; fsa_integer = -1; break; // restart timer
          } else {
            fsa_integer = -1; break;
          }
        case 2:
           if( parsed_input == "recipe"){
            done = true; fsa_integer = -1; break; //restart recipe
           } else if( parsed_input[i] == "timer"){
            done = true; fsa_integer = -1; break; // restart timer
           } else {
            fsa_integer = -1; break;
           }
        case 3:
          if(parsed_input[i] == "the"){
            fsa_integer = 2; break;
          } else if( parsed_input == "recipe"){
            done = true; fsa_integer = -1; break; // continue recipe
          } else if( parsed_input[i] == "timer"){
            done = true; fsa_integer = -1; break; // continue timer
          } else {
            fsa_integer = -1; break;
          }
        case 4:
           if( parsed_input[i] == "recipe"){
            done = true; fsa_integer = -1; break; //continue recipe
           } else if( parsed_input[i] == "timer"){
            done = true; fsa_integer = -1; break; // continue timer
           } else {
            fsa_integer = -1; break;
           }
        case 5:
          if(parsed_input[i] == "yourself"){
            done = true; fsa_integer = -1; break; //repeat step
          } else if(parsed_input[i] == "the"){
            fsa_integer = 6; break;
          } else {
            fsa_integer = -1; break;
          }
        case 6:
          if(parsed_input[i] == "step"){
            done = true; fsa_integer = -1; break; //repeat step
          } else {
            fsa_integer = -1; break;
          }
        case 7:
          if(parsed_input[i] == "the"){
            fsa_integer = 2; break;
          } else if( parsed_input == "recipe"){
            done = true; fsa_integer = -1; break; // stop recipe
          } else if( parsed_input[i] == "timer"){
            done = true; fsa_integer = -1; break; // stop timer
          } else {
            fsa_integer = -1; break;
          }
        case 8:
          if( parsed_input == "recipe"){
            done = true; fsa_integer = -1; break; // stop recipe
          } else if( parsed_input[i] == "timer"){
            done = true; fsa_integer = -1; break; // stop timer
          } else {
            fsa_integer = -1; break;
          }
        case 9:
          if(parsed_input[i] == "on"){
            done = true; fsa_integer = -1; break; // continue recipe
          } else if(parsed_input[i] == "back"){
            fsa_integer = 10; break;
          } else if(parsed_input[i] == "onto" || parsed_input[i] == "to"){
            fsa_integer = 11; break;
          } else {
            fsa_integer = -1; break;
          }
        case 10:
          if(parsed_input[i] == "to"){
            fsa_integer == 11; break;
          } else {
            done = true; fsa_integer = -1; break; // go to previous step
          }
        case 11:
          if(parsed_input[i] == "next"){
            fsa_integer = 12; break;
          } else if(parsed_input[i] == "previous"){
            fsa_integer = 13; break;
          } else if(parsed_input[i] == "beginning"){
            fsa_integer = 14; break;
          } else if(parsed_input[i] == "the"){
            fsa_integer = 17; break;
          } else if(parsed_input[i] == "step"){
            fsa_integer = 34; break;
          } else {
            fsa_integer = -1; break;
          }
        case 12:
          if(parsed_input[i] == "step"){
            done = true; fsa_integer = -1; break; // go to next step
          } else {
            fsa_integer = -1; break;
          }
        case 13:
          if(parsed_input[i] == "step"){
            done = true; fsa_integer = -1; break; // go to previous step
          } else {
            fsa_integer = -1; break;
          }
        case 14:
          if(parsed_input == "of"){
            fsa_integer = 15; break;
          } else {
            fsa_integer = -1; break;
          }
        case 15:
          if(parsed_input[i] == "the"){
            fsa_integer = 16; break;
          } else {
            fsa_integer = -1; break;
          }
        case 16:
          if(parsed_input == "recipe"){
            done = true; fsa_integer = -1; break; // restart recipe
          } else {
            fsa_integer = -1; break;
          }
        case 17:
          val = nlp(parsed_input[i]).numbers.get()[0];
          if(parsed_input[i] == "next"){
            fsa_integer = 12; break;
          } else if(parsed_input[i] == "previous"){
            fsa_integer = 13; break;
          } else if(parsed_input[i] == "beginning"){
            fsa_integer = 14; break;
          } else if( val != undefined){
            fsa_integer = 33; break;
          } else {
            fsa_integer = -1; break;
          }
        case 18:
          let input = parsed_input[i].numbers.get()[0];
          if(parsed_input[i] == "the" || parsed_input[i] == "a"){
            fsa_integer = 19; break;
          } else if(parsed_input[i] == "timer"){
            fsa_integer = 20; break; 
          } else if(input != undefined){
            fsa_integer = 22; break;
          } else {
            fsa_integer = -1; break;
          }
        case 19:
          if(parsed_input[i] == "recipe"){
            num = parsed_input[i].numbers.get()[0];
            done = true; fsa_integer = -1; break; // start the recipe
          } else if(parsed_input[i] == "timer"){
            fsa_integer = 20; break;
          } else if(num != undefined){
            done = true; timer_total = timer_total * num; fsa_integer = 28; break;
          } else{
            fsa_integer = -1; break;
          }
        case 20:
          if(parsed_input[i] == "for"){
            fsa_integer = 21; break;
          } else {
            done = true; fsa_integer = -1; break; // find a way to start timer with json
          }
        case 21:
          num = parsed_input[i].numbers.get()[0];
          if(parsed_input[i] == "an" || parsed_input[i] == "a"){ 
            fsa_integer = 22; break;
          } else if(num != undefined){
            done = true; timer_total = timer_total * num; fsa_integer = 22; break;
          } else if(parsed_input[i] == "half"){
             done = true; timer_total = timer_total * 0.5;fsa_integer = 27; break;
          } else{
            fsa_integer = -1; break;
          }
        case 22:
          if(parsed_input[i] == "second" || parsed_input[i] == "seconds"){
            done = true; timer_total = timer_total * 1; fsa_integer = -1; break;
          } else if(parsed_input[i] == "minute" || parsed_input[i] == "minutes"){
            done = true; timer_total = timer_total * 60; fsa_integer = 23; break;
          } else if(parsed_input[i] == "hour" || parsed_input[i] == "hours"){
            done = true; timer_total = timer_total * 21600; fsa_integer = 23; break;
          } else {
            done = false; fsa_integer = -1; break;
          }
        case 23:
          if(parsed_input[i] == "and"){
            fsa_integer = 24; break;
          } else {
            done = true; fsa_integer = -1; break; // set n time
          }
        case 24:
          if(parsed_input[i] == "a" || parsed_input[i] == "an"){
            fsa_integer = 25; break;
          } else {
            done = false; fsa_integer = -1; break;
          }
        case 25:
          if(parsed_input[i] == "half"){
             done = true; timer_total = timer_total * 0.5;fsa_integer = -1; break; // set n time
          } else{
            done = true; fsa_integer = -1; break; // set n time
          }
        case 26:
          if(parsed_input[i] == "hour"){
             done = true; timer_total = timer_total * 21600;fsa_integer = -1; break; // set n time

          } else if(parsed_input[i] == "minute"){
             done = true; timer_total = timer_total * 60;fsa_integer = -1; break; // set n time
          } else {
            done = false; fsa_integer = -1; break; 
          }
        case 27:
          if(parsed_input[i] == "a" || parsed_input[i] == "an"){
            fsa_integer = 26; break;
          } else {
            done = false; fsa_integer = -1; break;
          }
        case 28:
          if(parsed_input[i] == "second" || parsed_input[i] == "seconds"){
            timer_total = timer_total * 1; fsa_integer = -1; break;
          } else if(parsed_input[i] == "minute" || parsed_input[i] == "minutes"){
            timer_total = timer_total * 60; fsa_integer = 30; break;
          } else if(parsed_input[i] == "hour" || parsed_input[i] == "hours"){
            timer_total = timer_total * 21600; fsa_integer = 30; break;
          } else {
            done = false; fsa_integer = -1; break;
          }
        case 29:
          if(parsed_input[i] == "timer"){
            done = true; fsa_integer = -1; break; //set n time
          } else {
             done = false; fsa_integer = -1; break;
          }
        case 30:
          if(parsed_input[i] == "and"){
            fsa_integer = 31; break;
          } else {
            fsa_integer = 29; break; 
          }
        case 31:
          if(parsed_input[i] == "a" || parsed_input[i] == "an"){
            fsa_integer = 32; break;
          } else {
            done = false; fsa_integer = -1; break;
          }
        case 32:
          if(parsed_input[i] == "half"){
              timer_total = timer_total * 0.5;fsa_integer = 29; break; // set n time
          } else{
            fsa_integer = 29; break; 
          }
        case 33:
          if(parsed_input[i] == "step"){
            done = true; fsa_integer = -1; break; // go to n step
          } else {
            done = false; fsa_integer = -1; break;
          }
        case 34:
           val = nlp(parsed_input[i]).numbers.get()[0];
           if(val != undefined){
            done = true; fsa_integer = -1; break; // go to n step
           } else {
            done = false; fsa_integer = -1; break;
           }
    }     
    if(done == true){
      break;
    };
  };
    

  const responses = parseResponseMessages(msg);

  for (const response of responses) {
    switch (response.type) {
      case MultimodalLiveResponseType.SETUP_COMPLETE:
        setStatus("active");
        await startMic();
        break;
      case MultimodalLiveResponseType.AUDIO:
        await playAudioChunk(response.data);
        break;
      case MultimodalLiveResponseType.INPUT_TRANSCRIPTION:
        setTranscript((t) => ({ ...t, user: response.data.text }));
        break;
      case MultimodalLiveResponseType.OUTPUT_TRANSCRIPTION:
        setTranscript((t) => ({ ...t, model: response.data.text }));
        break;
      case MultimodalLiveResponseType.TURN_COMPLETE:
        console.log("✅ Turn complete");
        break;
      case MultimodalLiveResponseType.INTERRUPTED:
        console.log("⚡ Interrupted");
        break;
    };
  };
};

    ws.onerror = () => setStatus("error");
    ws.onclose = (e) => {
      console.log("WS Closed:", e.code, e.reason);
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



