import React, { useState, useRef, useEffect } from 'react';
import { Radio, Square, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

export default function AmbientCapture({ patient, onNoteCaptured }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const recognitionRef = useRef(null);
  const fullTranscriptRef = useRef('');
  const intervalRef = useRef(null);

  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fullTranscriptRef.current += e.results[i][0].transcript + ' ';
      }
    };
    recognitionRef.current.onend = () => {
      if (isRecording) recognitionRef.current?.start();
    };
    return () => { recognitionRef.current?.stop(); clearInterval(intervalRef.current); };
  }, []);

  const startRecording = () => {
    fullTranscriptRef.current = '';
    recognitionRef.current?.start();
    setIsRecording(true);
    setDuration(0);
    intervalRef.current = setInterval(() => setDuration(d => d + 1), 1000);
  };

  const stopAndProcess = async () => {
    recognitionRef.current?.stop();
    clearInterval(intervalRef.current);
    setIsRecording(false);
    const transcript = fullTranscriptRef.current.trim();
    fullTranscriptRef.current = '';
    setDuration(0);
    if (!transcript) return;
    setIsProcessing(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Utilization Management AI assistant listening during clinical rounds.

Patient: ${patient.patient_name} | MRN: ${patient.mrn} | Status: ${patient.admission_status} | Dx: ${patient.primary_dx || 'N/A'}

TRANSCRIPT FROM ROUNDS:
"${transcript}"

Extract ONLY utilization management-relevant information. Ignore general chit-chat, irrelevant clinical details, or non-UM conversation.

Relevant signals include:
- Discharge plans or timelines (e.g. "discharge today", "home tomorrow")
- Pending tests or results blocking discharge
- IV antibiotic duration or treatment length
- Placement needs (SNF, rehab, home health)
- Barriers to discharge
- Payer/authorization issues
- Change in level of care
- Social work or case management needs

Respond in this JSON format:
{
  "has_um_content": true/false,
  "summary": "2-3 sentence UM-focused summary",
  "signals": ["signal 1", "signal 2"],
  "priority": "routine|urgent|critical",
  "recommended_action": "Brief recommended next step for the case manager"
}

If no UM-relevant content was found, set has_um_content to false and leave other fields empty.`,
      response_json_schema: {
        type: "object",
        properties: {
          has_um_content: { type: "boolean" },
          summary: { type: "string" },
          signals: { type: "array", items: { type: "string" } },
          priority: { type: "string" },
          recommended_action: { type: "string" }
        }
      }
    });

    setIsProcessing(false);
    if (result?.has_um_content) {
      onNoteCaptured({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        raw_transcript: transcript,
        summary: result.summary,
        signals: result.signals || [],
        priority: result.priority || 'routine',
        recommended_action: result.recommended_action,
        status: 'pending', // pending | approved | promoted
        type: 'ambient_ai'
      });
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (!isSupported) {
    return (
      <div className="text-xs text-muted-foreground italic">Voice capture not supported in this browser.</div>
    );
  }

  return (
    <div className={cn(
      'rounded-xl border-2 p-3 transition-all',
      isRecording ? 'border-primary bg-primary/5' : 'border-dashed border-border'
    )}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
            isRecording ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-medium truncate">
            {isProcessing ? 'AI filtering rounds...' : isRecording ? `Listening · ${formatTime(duration)}` : 'Ambient AI Listener'}
          </span>
          {isRecording && (
            <div className="flex gap-0.5 items-center ml-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-0.5 bg-primary rounded-full animate-pulse"
                  style={{ height: `${Math.random() * 12 + 4}px`, animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
        </div>
        <Button
          size="sm"
          variant={isRecording ? 'destructive' : 'default'}
          className="rounded-lg h-7 text-xs px-3 flex-shrink-0"
          disabled={isProcessing}
          onClick={isRecording ? stopAndProcess : startRecording}
        >
          {isRecording ? <><Square className="w-3 h-3 mr-1" />Stop</> : <><Radio className="w-3 h-3 mr-1" />Start</>}
        </Button>
      </div>
    </div>
  );
}