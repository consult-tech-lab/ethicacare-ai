import React from 'react';
import { Plus, User, Brain, FileText, Mic, Upload, Send, CheckCircle2 } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialNewCase() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={Plus}
        color="bg-green-50 border-green-200 text-green-800"
        label="Tab 2 · New Case Review"
        title="Creating & Reviewing a Case"
        description="The Case Review tab is where UM nurses and auditors enter patient data, run AI analysis, generate SOAP notes, match clinical criteria, and finalize authorization decisions."
      />

      <SubSection title="Two Review Types (Tabs inside Case Review)">
        <div className="space-y-3">
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
            <p className="text-xs font-bold text-foreground mb-1">Utilization Review</p>
            <p className="text-xs text-muted-foreground">The primary review type. Used for initial admission reviews, continued stay justification, and standard authorization workflows. Includes full AI toolset.</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
            <p className="text-xs font-bold text-foreground mb-1">Secondary Review</p>
            <p className="text-xs text-muted-foreground">Used for appeal workflows, peer-to-peer reviews, or when a case needs a second clinical opinion. Same AI tools are available.</p>
          </div>
        </div>
      </SubSection>

      <SubSection title="Sections Within Each Case">
        <FeatureGrid features={[
          { icon: User,         title: 'Patient Information', desc: 'Enter patient name, MRN, insurance, admission date, primary Dx, and procedure codes.' },
          { icon: Brain,        title: 'AI Criteria Matcher', desc: 'Automatically matches the patient Dx/CPT codes to your Clinical Criteria Database.' },
          { icon: Mic,          title: 'Ambient AI / Voice', desc: 'Use voice dictation to narrate clinical notes hands-free.' },
          { icon: Upload,       title: 'Document Upload', desc: 'Attach clinical notes, labs, imaging reports, or any supporting documents.' },
          { icon: Brain,        title: 'AI Recommendation', desc: 'Generate a full AI-powered utilization recommendation based on all entered data.' },
          { icon: FileText,     title: 'SOAP Generator', desc: 'Convert raw MD notes into a structured SOAP format with one click.' },
          { icon: CheckCircle2, title: 'Nurse Approval', desc: 'Nurse must check the approval box before the case can be submitted to the payer.' },
          { icon: Send,         title: 'Submit to Payer', desc: 'Once nurse-approved, send the case for payer review via eFax.' },
        ]} />
      </SubSection>

      <SubSection title="Step-by-Step: Creating a New Case">
        <Steps steps={[
          { title: 'Click "New Case" in the sidebar', desc: 'This opens a blank case form. You can also click the "New Case Review" button on the Dashboard.' },
          { title: 'Select the Review Type tab', desc: 'Choose "Utilization Review" (default) or "Secondary Review" at the top of the form.' },
          { title: 'Fill in Patient Information', desc: 'Enter all fields: Patient Name, MRN, Insurance, Admission Date, Primary Dx (use ICD-10 format e.g. "I50.9 – CHF"), and Procedure Code.' },
          { title: 'Run AI Criteria Matcher', desc: 'The criteria matcher automatically queries your database. Click any result card to view full criteria details in the side panel.' },
          { title: 'Add Clinical Notes (text or voice)', desc: 'Type notes in the MD Note Analyzer field, or click the microphone icon for voice dictation.' },
          { title: 'Upload supporting documents', desc: 'Drag and drop files or click to browse. PDFs, images, and Word docs are supported.' },
          { title: 'Generate AI Recommendation', desc: 'Click "Generate AI Recommendation" to get a structured utilization analysis. Review and edit the output.' },
          { title: 'Generate SOAP Summary', desc: 'Click "Generate AI SOAP Summary" to convert your clinical notes into a clean Subjective/Objective/Assessment/Plan format.' },
          { title: 'Nurse review and approval', desc: 'The reviewing nurse checks the approval checkbox confirming they have reviewed the AI-generated content.' },
          { title: 'Set Case Status & Save', desc: 'Use the status dropdown (Draft, In Review, Approved, Denied, Pending Info) and click Save.' },
          { title: 'Submit to payer (if approved)', desc: 'Once nurse-approved, the "Send to Payer via eFax" button appears. Click to submit.' },
        ]} />
      </SubSection>

      <MockScreen label="New Case Review — Patient Info Panel">
        <div className="grid grid-cols-3 gap-2">
          {['Patient Name', 'MRN', 'Insurance', 'Admission Date', 'Primary Dx', 'Procedure Code'].map((f, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">{f}</p>
              <div className="h-7 bg-muted rounded-lg border border-border" />
            </div>
          ))}
        </div>
      </MockScreen>

      <Callout type="warning">
        <strong>Required:</strong> Nurse approval is mandatory before any case can be submitted to the payer. The AI never decides — it only suggests. The nurse is always the final authority.
      </Callout>

      <Callout type="tip">
        Cases are auto-saved each time you click the Save button. You can return to any case later from the Case Library.
      </Callout>
    </div>
  );
}