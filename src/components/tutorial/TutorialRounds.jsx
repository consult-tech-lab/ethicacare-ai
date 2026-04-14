import React from 'react';
import { Radio, LayoutGrid, List, Sparkles, CheckCircle2, Edit2, FileText, AlertTriangle, User } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialRounds() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={Radio}
        color="bg-orange-50 border-orange-200 text-orange-800"
        label="Tab 3 · AI Rounds — Featured"
        title="Ambient AI Rounds Integration"
        description="AI Rounds is an Ambient AI-powered feature that listens during live patient rounds — bedside or remote — and automatically filters and extracts utilization management-relevant insights in real time. It dramatically reduces documentation burden while ensuring no critical detail is missed."
      />

      <SubSection title="Core Concept: How Ambient AI Works">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-900 space-y-2">
          <p className="font-bold">The AI Rounds Workflow:</p>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
            <p><strong>Case Manager starts listening</strong> — clicks "Start" on a patient's Ambient AI Listener during rounds</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
            <p><strong>AI transcribes and filters</strong> — processes the conversation and extracts only UM-relevant signals (discharge plans, barriers, treatment duration, placement needs)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
            <p><strong>Structured note appears</strong> — labeled "Ambient AI Suggested Update," timestamped, with signal tags and a recommended action</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">4</span>
            <p><strong>Human validates</strong> — CM reviews, edits if needed, then Approves or dismisses. Only after approval can it be promoted to a Progress Note.</p>
          </div>
          <div className="mt-3 pt-3 border-t border-orange-200 font-bold text-center text-sm">
            AI suggests → Human reviews → Human decides → System records
          </div>
        </div>
      </SubSection>

      <SubSection title="Patient Status Categories">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Inpatient (True Admit)', color: 'bg-primary/10 text-primary border-primary/20', desc: 'Admitted patients requiring inpatient level of care and ongoing UM oversight.' },
            { label: 'Observation', color: 'bg-amber-100 text-amber-700 border-amber-200', desc: 'Patients on observation status — critical for payer authorization management.' },
            { label: 'Direct Admit', color: 'bg-purple-100 text-purple-700 border-purple-200', desc: 'Patients admitted directly without going through the ED.' },
            { label: 'Outpatient', color: 'bg-green-100 text-green-700 border-green-200', desc: 'Outpatient cases being tracked for authorization or discharge planning.' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 border bg-card">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-2 ${s.color}`}>{s.label}</span>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Card View vs Table View">
        <FeatureGrid features={[
          { icon: LayoutGrid, title: 'Card View', desc: 'Detailed per-patient cards. Best for focused bedside rounds. Shows full ambient capture controls, note list, and patient details prominently.' },
          { icon: List, title: 'Table / Worklist View', desc: 'Multi-patient overview. Best for post-rounds scanning. See AI note counts, pending review badges, and LOS across all patients at once.' },
        ]} />
      </SubSection>

      <SubSection title="Step-by-Step: Adding a Patient to Rounds">
        <Steps steps={[
          { title: 'Navigate to "AI Rounds" in the sidebar', desc: 'Click the Radio icon in the left sidebar to open the Rounds page.' },
          { title: 'Click "Add Patient"', desc: 'The orange button top-right opens the Add Patient modal.' },
          { title: 'Fill in patient details', desc: 'Enter: Patient Name (required), MRN (required), Room Number, Admission Status, Primary Dx, Insurance, Attending MD, Admission Date, LOS, and Priority level.' },
          { title: 'Set Priority', desc: 'Choose Routine (default), Urgent (amber border), or Critical (red border). This visually highlights the card in your rounds list.' },
          { title: 'Click "Add to Rounds"', desc: 'The patient card immediately appears in the grid. Patients persist across sessions.' },
        ]} />
      </SubSection>

      <SubSection title="Step-by-Step: Using Ambient AI Capture">
        <Steps steps={[
          { title: 'Find the patient card (Card View or Table View)', desc: 'Locate the patient you are currently rounding on.' },
          { title: 'Click "Start" on the Ambient AI Listener', desc: 'The orange pulsing microphone activates. A timer shows how long you have been recording.' },
          { title: 'Speak naturally during rounds', desc: 'Have your normal clinical discussion. The AI is listening in the background and will filter for UM-relevant content only. Irrelevant conversation is ignored.' },
          { title: 'Click "Stop" when done', desc: 'The AI processes the transcript. A spinner labeled "AI filtering rounds..." appears while it works.' },
          { title: 'Review the AI-generated note', desc: 'A new note card appears labeled "Ambient AI Suggested Update" with a timestamp, 2–3 sentence UM summary, colored signal tags, and a Recommended Action.' },
          { title: 'Read the signals carefully', desc: 'Signal tags (e.g. "Discharge today", "IV antibiotics 5 more days", "Waiting on placement") are pulled directly from the conversation.' },
          { title: 'Edit if needed', desc: 'Click the Edit button to modify the summary text. The AI is not always perfect — your clinical judgment overrides it.' },
          { title: 'Approve the note', desc: 'Click the green "Approve" button to validate the note. Unapproved notes are flagged as pending.' },
          { title: 'Promote to Progress Note', desc: 'Once approved, click "Promote to Progress Note." The note is formally recorded and attached to the patient record.' },
        ]} />
      </SubSection>

      <MockScreen label="AI Rounds — Card View Example">
        <div className="bg-card rounded-2xl border-2 border-amber-400 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"><User className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-xs font-bold">Margaret Holloway</p>
                <p className="text-[10px] text-muted-foreground">MRN-77001 · Room 4B-12</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Inpatient</span>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Ambient AI Suggested Update</span>
            </div>
            <p className="text-xs">Patient is awaiting SNF placement. Discharge expected within 48 hours pending bed availability. IV Lasix will continue until placement confirmed.</p>
            <div className="flex gap-1.5 flex-wrap">
              {['Waiting on placement', 'Discharge in 48h', 'IV Lasix continuing'].map((s, i) => (
                <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
              ))}
            </div>
            <p className="text-[10px] italic text-muted-foreground">AI suggests → Human reviews → Human decides → System records</p>
            <div className="flex gap-2">
              <button className="text-[10px] bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Approve</button>
              <button className="text-[10px] border border-border px-3 py-1 rounded-lg flex items-center gap-1"><Edit2 className="w-3 h-3" />Edit</button>
            </div>
          </div>
        </div>
      </MockScreen>

      <SubSection title="AI Signal Examples (What the AI Listens For)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            '"Discharge today"', '"Needs IV antibiotics for 5 more days"',
            '"Waiting on SNF placement"', '"Pending MRI results"',
            '"Barrier to discharge — family not ready"', '"Escalating to critical care"',
            '"Payer requiring peer-to-peer review"', '"Home health ordered on discharge"',
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {s}
            </div>
          ))}
        </div>
      </SubSection>

      <Callout type="warning">
        <strong>Important:</strong> The Ambient AI requires microphone access in your browser. If prompted, click "Allow." The AI only processes audio when you click "Start" — it does not listen passively in the background.
      </Callout>

      <Callout type="success">
        <strong>Human-in-the-Loop guarantee:</strong> No AI note can be submitted, saved as a progress note, or shared until a Case Manager explicitly Approves it. The AI is an assistant, not a decision-maker.
      </Callout>
    </div>
  );
}