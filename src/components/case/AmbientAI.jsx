import React, { useState, useRef, useEffect } from 'react';
import { Radio, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AmbientAI({ onCapture }) {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);
  const recognitionRef = useRef(null);
  const fullTranscriptRef = useRef('');

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            fullTranscriptRef.current += event.results[i][0].transcript + ' ';
          }
        }
      };
      recognitionRef.current.onend = () => {
        if (isActive) recognitionRef.current?.start();
      };
    }
    return () => {
      recognitionRef.current?.stop();
      clearInterval(intervalRef.current);
    };
  }, []);

  const toggleAmbient = () => {
    if (isActive) {
      recognitionRef.current?.stop();
      clearInterval(intervalRef.current);
      setIsActive(false);
      if (fullTranscriptRef.current.trim()) {
        onCapture?.(fullTranscriptRef.current.trim());
      }
      fullTranscriptRef.current = '';
      setDuration(0);
    } else {
      fullTranscriptRef.current = '';
      recognitionRef.current?.start();
      setIsActive(true);
      setDuration(0);
      intervalRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  if (!isSupported) return null;

  return (
    <div className={cn(
      "rounded-2xl border-2 p-4 transition-all",
      isActive
        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
        : "border-dashed border-border"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <p className="font-heading font-semibold text-sm">Ambient AI Listener</p>
            <p className="text-xs text-muted-foreground">
              {isActive ? `Recording · ${formatTime(duration)}` : 'Capture clinical conversations in real-time'}
            </p>
          </div>
        </div>
        <Button
          onClick={toggleAmbient}
          variant={isActive ? "destructive" : "default"}
          size="sm"
          className="gap-2 rounded-xl"
        >
          {isActive ? (
            <><Square className="w-3 h-3" /> Stop</>
          ) : (
            <><Radio className="w-3 h-3" /> Start Ambient</>
          )}
        </Button>
      </div>
      {isActive && (
        <div className="mt-3 flex gap-1 items-center justify-center">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 20 + 8}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}