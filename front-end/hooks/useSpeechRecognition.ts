"use client";

import { useEffect, useRef, useState } from "react";

interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionEvent = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      }
    };
  }
}

type SpeechRecognition = ISpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Não precisa mais do parâmetro onResult
export const useSpeechRecognition = () => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState<string>(""); // 1. Estado para guardar o texto

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.language = "pt-PT";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result); // 2. Atualiza o estado com o texto reconhecido
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      console.error("Speech recognition not initialized.");
    }
  };

  // 3. Retorna o texto reconhecido e a função de iniciar
  return { transcript, startListening };
};