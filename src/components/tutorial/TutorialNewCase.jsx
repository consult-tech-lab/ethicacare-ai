import React from 'react';
import { Plus, User, Brain, FileText, Mic, Upload, Send, CheckCircle2, Tag } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialNewCase() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={Plus}
        color="bg-green-50 border-green-200 text-green-800"
        label="Section 4 · New Case Review"
        title="Creating & Reviewing a Case"
        description="The Case Review screen is where UM nurses and auditors enter patient data, run AI analysis, generate SOAP notes, match clinical criteria, and finalize authorization decisions. Access it by clicking 'New Case' in the sidebar or by clicking any case in the Case Library."
      />

      <SubSection title="Two Review Types (Tabs at the Top of Each Case)">
        <div className="space-y-3">
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
            <p className="text-xs font-bold text-foreground mb-1">Utilization Review <span className="text-primary">(default)</span></p>
            <p className="text-xs text-muted-foreground">Used for initial admission reviews, continued stay justification, and standard authorization workflows. Includes the full AI toolset — AI Criteria Matcher, SOAP Generator, AI Recommendation, and Ambient Listener.</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
            <p className="text-xs font-bold text-foreground mb-1">Secondary Review</p>
            <p className="text-xs text-muted-foreground">Used for appeal workflows, peer-to-peer reviews, or when a case needs a second clinical opinion. The same AI tools are available as in Utilization Review.</p>
          </div>
        </div>
      </SubSection>

      <SubSection title="Sections Within Each Case">
        <FeatureGrid features={[
          { icon: User,         title: 'Patient Information', desc: 'Enter patient name, MRN, insurance, admission date, primary Dx (ICD-10 format), and procedure code. Fields auto-populate the Patient Snapshot card.' },
          { icon: Tag,          title: 'Patient Snapshot & Dx Codes', desc: 'Read-only summary panel showing formatted ICD-10 and CPT codes — auto-updates as you type.' },
          { icon: Brain,        title: 'AI Criteria Matcher', desc: 'Automatically searches your Criteria Database and surfaces the most relevant InterQual/MCG criteria for the entered Dx. Expands to show LOS, evidence level, and ICD-10 count.' },
          { icon: Mic,          title: 'Ambient AI Listener', desc: 'Click "Start Ambient" to record a clinical conversation. The AI transcribes and structures the output. Click "Stop" when done.' },
          { icon: Upload,       title: 'Upload Documents', desc: 'Drag and drop or click to upload PDFs, DOCs, or images. Stored securely with the case.' },
          { icon: Brain,        title: 'AI Assist Recommendation', desc: 'Click "Generate" for a full AI-powered utilization recommendation based on patient data, matched criteria, and notes.' },
          { icon: FileText,     title: 'MD Note Analyzer + SOAP Generator', desc: 'Paste or type raw MD notes, then click "Generate AI SOAP Summary" to produce a Subjective / Objective / Assessment / Plan note.' },
          { icon: CheckCircle2, title: 'Nurse Approved Toggle', desc: 'A nurse must toggle this ON before the case can be submitted to the payer. This is the HIPAA-compliance gate.' },
          { icon: Send,         title: 'Send to Payer via eFax', desc: 'After nurse approval, this button appears. Click to submit the completed review to the payer via secure eFax.' },
        ]} />
      </SubSection>

      <SubSection title="Step-by-Step: Creating a New Case">
        <Steps steps={[
          { title: 'Click "New Case" in the sidebar', desc: 'Opens a blank case form. You can also click "New Case Review" on the Dashboard or "+ New Case" in the Case Library.' },
          { title: 'Select the Review Type tab', desc: 'Choose "Utilization Review" (default) or "Secondary Review" using the tabs at the top of the form.' },
          { title: 'Fill in Patient Information', desc: 'Enter all fields: Patient Name, MRN, Insurance, Admission Date, Primary Dx (e.g. "I50.9 – Heart Failure"), and Procedure Code. The Patient Snapshot updates as you type.' },
          { title: 'Check the AI Criteria Matcher', desc: 'The matcher automatically queries your criteria database. Click any result card to expand full criteria details. Click "View full database" to go to the Criteria page.' },
          { title: 'Record with Ambient AI (optional)', desc: 'Click "Start Ambient" to capture a clinical conversation in real time. Click "Stop" when done — the AI generates a structured note.' },
          { title: 'Upload supporting documents (optional)', desc: 'Drag and drop files or click the upload area. PDFs, images, and Word docs are supported.' },
          { title: 'Add clinical notes', desc: 'Type or paste raw MD clinical notes in the "Clinical Notes" field. Click the microphone icon for voice dictation instead.' },
          { title: 'Generate AI SOAP Summary', desc: 'Click "Generate AI SOAP Summary" to convert clinical notes into a clean S/O/A/P format. Review and edit the output.' },
          { title: 'Generate AI Recommendation', desc: 'Click "Generate" in the AI Assist Recommendation section for a full utilization analysis.' },
          { title: 'Nurse review and approval', desc: 'The reviewing nurse toggles the "Nurse Approved" switch ON to confirm they have reviewed the AI-generated content.' },
          { title: 'Set Case Status & Save', desc: 'Use the status dropdown (top right: Draft → In Review → Approved / Denied / Pending Info) and click Save.' },
          { title: 'Submit to payer (if approved)', desc: 'Once nurse-approved, click "Send to Payer via eFax" to submit.' },
        ]} />
      </SubSection>

      <MockScreen label="New Case Review — Patient Info Panel">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="h-7 bg-primary/20 rounded-lg border border-primary/30 flex-1 flex items-center px-2">
              <span className="text-[10px] text-primary font-medium">Utilization Review</span>
            </div>
            <div className="h-7 bg-muted rounded-lg border border-border flex-1 flex items-center px-2">
              <span className="text-[10px] text-muted-foreground">Secondary Review</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Patient Name', 'MRN', 'Insurance', 'Admission Date', 'Primary Dx (ICD-10)', 'Procedure Code'].map((f, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">{f}</p>
                <div className="h-7 bg-muted rounded-lg border border-border" />
              </div>
            ))}
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 flex items-center justify-between">
            <span className="text-[10px] text-primary font-semibold">AI Criteria Matcher — 1 relevant set found</span>
            <span className="text-[10px] bg-primary text-primary-foreground rounded px-1.5 py-0.5 font-bold">1</span>
          </div>
        </div>
      </MockScreen>

      <Callout type="warning">
        <strong>Required:</strong> Nurse approval is mandatory before any case can be submitted to the payer. The AI never decides — it only suggests. The nurse is always the final authority.
      </Callout>

      <Callout type="tip">
        Cases are saved when you click the Save button. You can return to any case later from the Case Library — all data, AI notes, SOAP summaries, and uploaded files are preserved.
      </Callout>
    </div>
  );
}