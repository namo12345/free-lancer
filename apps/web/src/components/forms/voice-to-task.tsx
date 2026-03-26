"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Web Speech API types (not in default TS DOM lib)
interface SpeechRecognitionEvent extends Event {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  start: () => void;
  stop: () => void;
}

interface GeneratedGig {
  title: string;
  description: string;
  category: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
}

export function VoiceToTask({ onGenerated }: { onGenerated: (gig: GeneratedGig) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [generatedGig, setGeneratedGig] = useState<GeneratedGig | null>(null);
  const [processing, setProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  function startListening() {
    const w = window as unknown as Record<string, unknown>;
    const SpeechRecognitionCtor = (w.SpeechRecognition || w.webkitSpeechRecognition) as { new(): SpeechRecognitionInstance } | undefined;

    if (!SpeechRecognitionCtor) {
      alert("Speech recognition not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN"; // Hindi-English mixed

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  async function generateGigFromTranscript() {
    if (!transcript.trim()) return;
    setProcessing(true);

    // In production: call AI service to parse transcript into structured gig
    // Mock response for now
    setTimeout(() => {
      const mockGig: GeneratedGig = {
        title: extractTitle(transcript),
        description: transcript,
        category: "Web Development",
        skills: extractSkills(transcript),
        budgetMin: 10000,
        budgetMax: 30000,
      };
      setGeneratedGig(mockGig);
      setProcessing(false);
    }, 1500);
  }

  function extractTitle(text: string): string {
    const words = text.split(" ").slice(0, 8).join(" ");
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  function extractSkills(text: string): string[] {
    const skillKeywords = ["react", "node", "python", "design", "mobile", "app", "website", "logo", "seo", "api", "database"];
    const lower = text.toLowerCase();
    return skillKeywords.filter((s) => lower.includes(s)).map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  }

  function handleUseGig() {
    if (generatedGig) onGenerated(generatedGig);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Voice to Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Describe your project using voice. We&apos;ll convert it into a professional gig posting.
          Supports English and Hindi.
        </p>

        <div className="flex gap-3">
          {!isListening ? (
            <Button onClick={startListening} variant="outline" className="gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              Start Recording
            </Button>
          ) : (
            <Button onClick={stopListening} variant="destructive" className="gap-2">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
              Stop Recording
            </Button>
          )}
        </div>

        {transcript && (
          <>
            <div>
              <label className="text-sm font-medium">Transcript</label>
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <Button onClick={generateGigFromTranscript} disabled={processing}>
              {processing ? "Generating..." : "Generate Gig Post"}
            </Button>
          </>
        )}

        {generatedGig && (
          <div className="p-4 border rounded-lg bg-green-50 space-y-2">
            <h4 className="font-semibold">{generatedGig.title}</h4>
            <p className="text-sm text-gray-600">{generatedGig.description}</p>
            <p className="text-xs text-gray-500">
              Category: {generatedGig.category} | Skills: {generatedGig.skills.join(", ")}
              | Budget: ₹{generatedGig.budgetMin.toLocaleString()} - ₹{generatedGig.budgetMax.toLocaleString()}
            </p>
            <Button onClick={handleUseGig} size="sm">Use This Gig Post</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
