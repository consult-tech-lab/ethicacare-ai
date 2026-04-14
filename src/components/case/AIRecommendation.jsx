import React, { useState } from 'react';
import { Brain, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

export default function AIRecommendation({ caseData, value, onChange }) {
  const [loading, setLoading] = useState(false);

  const generateRecommendation = async () => {
    setLoading(true);
    const prompt = `You are a utilization management nurse AI assistant. Based on the following patient case data, provide a clinical recommendation including:
- Recommended Length of Stay (LOS)
- Applicable InterQual or Milliman guidelines
- Discharge planning notes
- Medical necessity justification

Patient: ${caseData.patient_name || 'Unknown'}
MRN: ${caseData.mrn || 'N/A'}
Insurance: ${caseData.insurance || 'N/A'}
Admission Date: ${caseData.admission_date || 'N/A'}
Primary Dx: ${caseData.primary_dx || 'N/A'}
Procedure: ${caseData.procedure_code || 'N/A'}
Clinical Notes: ${caseData.clinical_notes || 'None provided'}

Provide a structured, professional recommendation.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    onChange(result);
    setLoading(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          AI Assist Recommendation
        </h3>
        <Button
          onClick={generateRecommendation}
          disabled={loading}
          size="sm"
          className="gap-2 rounded-xl bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate</>
          )}
        </Button>
      </div>
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="AI will recommend LOS, guidelines, or discharge planning notes here..."
        className="min-h-[140px] resize-none rounded-xl bg-muted/30 border-border/50 text-sm"
      />
    </div>
  );
}