import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import PatientSnapshot from '@/components/case/PatientSnapshot';
import DiagnosisCodes from '@/components/case/DiagnosisCodes';
import AIRecommendation from '@/components/case/AIRecommendation';
import SOAPGenerator from '@/components/case/SOAPGenerator';
import FileUpload from '@/components/case/FileUpload';
import AmbientAI from '@/components/case/AmbientAI';

const emptyCase = {
  patient_name: '',
  mrn: '',
  insurance: '',
  admission_date: '',
  primary_dx: '',
  procedure_code: '',
  clinical_notes: '',
  soap_summary: '',
  ai_recommendation: '',
  review_type: 'utilization_review',
  status: 'draft',
  nurse_approved: false,
  uploaded_files: [],
  voice_transcription: '',
};

export default function CaseReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState(emptyCase);
  const [activeTab, setActiveTab] = useState('utilization_review');

  const { data: existingCase, isLoading } = useQuery({
    queryKey: ['case', id],
    queryFn: () => base44.entities.PatientCase.filter({ id }),
    enabled: !isNew,
  });

  useEffect(() => {
    if (existingCase?.[0]) {
      setFormData(existingCase[0]);
      setActiveTab(existingCase[0].review_type || 'utilization_review');
    }
  }, [existingCase]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isNew) {
        return base44.entities.PatientCase.create(data);
      }
      return base44.entities.PatientCase.update(id, data);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case saved successfully');
      if (isNew && result?.id) navigate(`/case/${result.id}`, { replace: true });
    },
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveMutation.mutate({ ...formData, review_type: activeTab });
  };

  const handleAmbientCapture = (text) => {
    updateField('clinical_notes', (formData.clinical_notes || '') + '\n\n[Ambient AI Capture]\n' + text);
    toast.success('Ambient recording captured and added to clinical notes');
  };

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-heading font-bold">
              {isNew ? 'New Case Review' : `Case: ${formData.patient_name || 'Untitled'}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isNew ? 'Enter patient details and run AI analysis' : `MRN: ${formData.mrn}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
            <SelectTrigger className="w-[140px] rounded-xl h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
              <SelectItem value="pending_info">Pending Info</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="gap-2 rounded-xl bg-primary hover:bg-primary/90"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="utilization_review" className="rounded-lg text-sm">Utilization Review</TabsTrigger>
          <TabsTrigger value="secondary_review" className="rounded-lg text-sm">Secondary Review</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization_review" className="mt-6 space-y-6">
          {/* Patient Info Input */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-chart-3" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient Name</Label>
                <Input value={formData.patient_name} onChange={e => updateField('patient_name', e.target.value)} placeholder="Jane Doe" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">MRN</Label>
                <Input value={formData.mrn} onChange={e => updateField('mrn', e.target.value)} placeholder="0012456" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Insurance</Label>
                <Input value={formData.insurance} onChange={e => updateField('insurance', e.target.value)} placeholder="Horizon BCBS" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admission Date</Label>
                <Input type="date" value={formData.admission_date} onChange={e => updateField('admission_date', e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Primary Dx</Label>
                <Input value={formData.primary_dx} onChange={e => updateField('primary_dx', e.target.value)} placeholder="N18.5 (CKD Stage 5)" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Procedure Code</Label>
                <Input value={formData.procedure_code} onChange={e => updateField('procedure_code', e.target.value)} placeholder="36558 (Central Line)" className="rounded-xl" />
              </div>
            </div>
          </div>

          {/* Snapshot + Dx Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientSnapshot data={formData} />
            <DiagnosisCodes primaryDx={formData.primary_dx} procedureCode={formData.procedure_code} />
          </div>

          {/* Ambient AI */}
          <AmbientAI onCapture={handleAmbientCapture} />

          {/* File Upload */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-chart-3" />
              Upload Documents
            </h3>
            <FileUpload
              files={(formData.uploaded_files || []).map((url, i) => ({ name: `Document ${i + 1}`, url }))}
              onFilesChange={(files) => updateField('uploaded_files', files.map(f => f.url))}
            />
          </div>

          {/* AI Recommendation */}
          <AIRecommendation
            caseData={formData}
            value={formData.ai_recommendation}
            onChange={(v) => updateField('ai_recommendation', v)}
          />

          {/* SOAP Generator */}
          <SOAPGenerator
            clinicalNotes={formData.clinical_notes}
            onNotesChange={(v) => updateField('clinical_notes', v)}
            soapSummary={formData.soap_summary}
            onSoapChange={(v) => updateField('soap_summary', v)}
            nurseApproved={formData.nurse_approved}
            onNurseApprovedChange={(v) => updateField('nurse_approved', v)}
          />

          {/* Submit */}
          {formData.nurse_approved && (
            <div className="flex justify-end">
              <Button
                onClick={() => { updateField('status', 'in_review'); handleSave(); }}
                className="gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                <Send className="w-4 h-4" /> Send to Payer via eFax
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="secondary_review" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientSnapshot data={formData} />
            <DiagnosisCodes primaryDx={formData.primary_dx} procedureCode={formData.procedure_code} />
          </div>
          <AIRecommendation
            caseData={formData}
            value={formData.ai_recommendation}
            onChange={(v) => updateField('ai_recommendation', v)}
          />
          <SOAPGenerator
            clinicalNotes={formData.clinical_notes}
            onNotesChange={(v) => updateField('clinical_notes', v)}
            soapSummary={formData.soap_summary}
            onSoapChange={(v) => updateField('soap_summary', v)}
            nurseApproved={formData.nurse_approved}
            onNurseApprovedChange={(v) => updateField('nurse_approved', v)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}