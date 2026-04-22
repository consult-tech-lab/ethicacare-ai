import React from 'react';
import { Radio, LayoutGrid, List, Sparkles, CheckCircle2, Edit2, User, Filter, Plus, GripVertical } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialRounds() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={Radio}
        color="bg-orange-50 border-orange-200 text-orange-800"
        label="Section 5 · AI Rounds — Featured"
        title="Ambient AI Rounds Integration"
        description="AI Rounds is an Ambient AI-powered live patient board. During rounds, the AI listens to clinical conversations and automatically extracts utilization management-relevant insights in real time. Patients are organized by admission status with color-coded LOS urgency indicators."
      />

      <SubSection title="Core Concept: How Ambient AI Works">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-900 space-y-2">
          <p className="font-bold">The 4-Step AI Rounds Workflow:</p>
          {[
            ['Case Manager clicks "Start"', 'on the Ambient AI Listener on a patient card during active rounds'],
            ['AI transcribes & filters', 'the conversation in real time, extracting only UM-relevant signals (discharge plans, barriers, treatment duration, placement needs)'],
            ['Structured note appears', 'labeled as an AI suggestion with a timestamp, 2–3 sentence UM summary, signal tags, and a recommended action'],
            ['Human validates', 'the CM reviews, edits if needed, then Approves. Only after approval can it be promoted to an official Progress Note'],
          ].map(([title, desc], i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-200 text-orange-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p><strong>{title}</strong> — {desc}</p>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-orange-200 font-bold text-center text-sm">
            AI suggests → Human reviews → Human decides → System records
          </div>
        </div>
      </SubSection>

      <SubSection title="Status Filter Pills">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'All', color: 'bg-primary text-primary-foreground border-primary', desc: 'Default view — shows every patient on the board regardless of admission type.' },
            { label: 'Inpatient', color: 'bg-primary/10 text-primary border-primary/20', desc: 'True admit patients requiring inpatient level of care and ongoing UM oversight.' },
            { label: 'Observation', color: 'bg-amber-100 text-amber-700 border-amber-200', desc: 'Patients on observation status — critical for payer authorization management.' },
            { label: 'Direct Admit', color: 'bg-purple-100 text-purple-700 border-purple-200', desc: 'Patients admitted directly without going through the ED.' },
            { label: 'Outpatient', color: 'bg-green-100 text-green-700 border-green-200', desc: 'Outpatient cases being tracked for authorization or discharge planning.' },
            { label: 'Research', color: 'bg-slate-100 text-slate-600 border-slate-300', desc: 'Research patients — AI model testing pool. Also visible in the Research module.' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 border border-border bg-card">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-2 ${s.color}`}>{s.label}</span>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="LOS Color Coding on Patient Cards">
        <div className="space-y-2">
          {[
            ['Green LOS (0–3 days)', 'bg-green-100 text-green-700', 'Short stay — routine monitoring, low urgency escalation.'],
            ['Amber LOS (4–7 days)', 'bg-amber-100 text-amber-700', 'Mid-range stay — review discharge barriers and authorization status.'],
            ['Red LOS (8+ days)', 'bg-red-100 text-red-700', 'Extended stay — escalation review required, barriers likely present.'],
          ].map(([label, cls, desc], i) => (
            <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-2 border border-border/50">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls} flex-shrink-0`}>{label.split(' ')[0]} LOS</span>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Card View vs Table View">
        <FeatureGrid features={[
          { icon: LayoutGrid, title: 'Card View (Grid icon)', desc: 'Per-patient cards showing admission badge, Dx, insurance, LOS, quick-note field, and the Ambient AI Listener Start button. Best for bedside rounds.' },
          { icon: List,       title: 'Table / Worklist View (List icon)', desc: 'Multi-row table view for post-rounds scanning. Shows all patients in a compact format with expandable note sections.' },
          { icon: Filter,     title: 'Filters Panel', desc: 'Click the "Filters" button (top right) to expand advanced filters: Last Name, MRN, Room Location, and Payer dropdown. Click "Clear all" to reset.' },
          { icon: GripVertical, title: 'Drag to Reorder', desc: 'Every patient card has a drag handle (⋮⋮ grip icon). Click and drag to reorder patients in your preferred sequence.' },
        ]} />
      </SubSection>

      <SubSection title="Step-by-Step: Adding a Patient to Rounds">
        <Steps steps={[
          { title: 'Navigate to "AI Rounds" in the sidebar', desc: 'Click the Radio icon (()) in the left sidebar to open the Rounds board.' },
          { title: 'Click the teal "Add Patient" button', desc: 'Located in the top-right area of the page. Opens the Add Patient modal.' },
          { title: 'Fill in patient details', desc: 'Required fields: Patient Name and MRN. Optional: Room Number, Admission Status, Priority (Routine / Urgent / Critical), Primary Dx, Insurance, Attending MD, Admission Date, and LOS.' },
          { title: 'Set Priority', desc: 'Routine = no border, Urgent = amber border, Critical = red border. This visually highlights the card in the grid.' },
          { title: 'Click "Add to Rounds"', desc: 'The patient card immediately appears in the grid. Patients persist across sessions.' },
        ]} />
      </SubSection>

      <SubSection title="Step-by-Step: Using Ambient AI Capture">
        <Steps steps={[
          { title: 'Locate the patient card', desc: 'Find the patient you are rounding on in Card View or Table View.' },
          { title: 'Click "Start" on the Ambient AI Listener', desc: 'The teal "Start" button activates the microphone. Allow browser microphone access if prompted (first use only).' },
          { title: 'Speak naturally during rounds', desc: 'Have your normal clinical discussion. The AI listens in the background and filters for UM-relevant content only.' },
          { title: 'Click "Stop" when done', desc: 'The AI processes the transcript and generates a structured note.' },
          { title: 'Review the AI-generated note', desc: 'A note card appears with a timestamp, 2–3 sentence UM summary, and colored signal tags (e.g., "Waiting on placement", "Discharge in 48h").' },
          { title: 'Edit if needed', desc: 'Click Edit to modify the summary text. Your clinical judgment always overrides the AI.' },
          { title: 'Click "Approve"', desc: 'The green Approve button validates the note. Unapproved notes remain flagged as pending.' },
          { title: 'Promote to Progress Note', desc: 'Once approved, click "Promote to Progress Note." The note is formally recorded and attached to the patient record and visible in Rounds Recall.' },
        ]} />
      </SubSection>

      <SubSection title="Quick Notes on Patient Cards">
        <Steps steps={[
          { title: 'Find the "Add quick note" field on any card', desc: 'A small text input field appears at the bottom of each patient card.' },
          { title: 'Type a brief observation', desc: 'Enter any quick clinical note — discharge barrier, family update, pending test, etc.' },
          { title: 'Save the note', desc: 'Click the save icon (✓) to store it. The note will appear in Rounds Recall for post-rounds review.' },
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
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>I50.9 – Acute Heart Failure</span>
            <span>·</span>
            <span>Medicare</span>
            <span>·</span>
            <span className="text-amber-600 font-bold">LOS: 4d</span>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Ambient AI Suggested Update</span>
            </div>
            <p className="text-xs">Patient awaiting SNF placement. Discharge expected within 48 hours pending bed availability. IV Lasix continuing until placement confirmed.</p>
            <div className="flex gap-1.5 flex-wrap">
              {['Waiting on placement', 'Discharge in 48h', 'IV Lasix continuing'].map((s, i) => (
                <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
              ))}
            </div>
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
            '"Discharge today"',
            '"Needs IV antibiotics for 5 more days"',
            '"Waiting on SNF placement"',
            '"Pending MRI results"',
            '"Barrier to discharge — family not ready"',
            '"Escalating to critical care"',
            '"Payer requiring peer-to-peer review"',
            '"Home health ordered on discharge"',
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {s}
            </div>
          ))}
        </div>
      </SubSection>

      <Callout type="warning">
        <strong>Microphone required:</strong> The Ambient AI needs browser microphone access. If prompted, click "Allow." The AI only listens when you click "Start" — it does not passively record in the background.
      </Callout>

      <Callout type="success">
        <strong>Human-in-the-Loop guarantee:</strong> No AI note can be saved as a progress note or shared until a Case Manager explicitly Approves it. The AI is an assistant, not a decision-maker.
      </Callout>
    </div>
  );
}