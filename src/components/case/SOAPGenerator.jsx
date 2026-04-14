import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import VoiceDictation from './VoiceDictation';

export default function SOAPGenerator({ clinicalNotes, onNotesChange, soapSummary, onSoapChange, nurseApproved, onNurseApprovedChange }) {
  const [loading, setLoading] = useState(false);

  const generateSOAP = async () => {
    if (!clinicalNotes?.trim()) return;
    setLoading(true);
    const prompt = `You are a clinical documentation specialist. Convert the following clinical notes into a structured SOAP note format.

Clinical Notes:
${clinicalNotes}

Format the output exactly as:
S (Subjective): [patient-reported symptoms, history]
O (Objective): [vital signs, exam findings, lab results]
A (Assessment): [clinical assessment, diagnoses]
P (Plan): [treatment plan, medications, follow-up]

Be concise and clinically accurate.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    onSoapChange(result);
    setLoading(false);
  };

  const handleVoiceTranscript = (text) => {
    onNotesChange((clinicalNotes || '') + ' ' + text);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-accent" />
        </div>
        MD Note Analyzer + AI SOAP Generator
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Clinical Notes</Label>
            <VoiceDictation onTranscript={handleVoiceTranscript} />
          </div>
          <Textarea
            value={clinicalNotes || ''}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Paste clinical notes here (e.g., HPI, A/P, ROS) or use voice dictation..."
            className="min-h-[160px] resize-none rounded-xl bg-muted/30 border-border/50 text-sm"
          />
        </div>

        <Button
          onClick={generateSOAP}
          disabled={loading || !clinicalNotes?.trim()}
          className="gap-2 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground w-full"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating SOAP Summary...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate AI SOAP Summary</>
          )}
        </Button>

        {soapSummary && (
          <div className="rounded-xl bg-accent/5 border border-accent/20 p-4">
            <Label className="text-xs font-medium text-accent uppercase tracking-wider mb-2 block">SOAP Summary</Label>
            <Textarea
              value={soapSummary}
              onChange={(e) => onSoapChange(e.target.value)}
              className="min-h-[180px] resize-none bg-transparent border-0 p-0 focus-visible:ring-0 text-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Checkbox
            id="nurseApproved"
            checked={nurseApproved}
            onCheckedChange={onNurseApprovedChange}
          />
          <Label htmlFor="nurseApproved" className="text-sm font-medium cursor-pointer flex items-center gap-2">
            {nurseApproved && <CheckCircle className="w-4 h-4 text-green-600" />}
            Nurse has reviewed and approved this summary
          </Label>
        </div>
      </div>
    </div>
  );
}