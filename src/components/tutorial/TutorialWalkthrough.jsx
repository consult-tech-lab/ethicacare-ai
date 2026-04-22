import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Download, Monitor,
  LayoutDashboard, Plus, Radio, FileText, BookMarked,
  BarChart2, RotateCcw, FlaskConical, Info, ZoomIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Real App Screenshots ───────────────────────────────────────────────────
// These are base64-free hosted references captured directly from EthicaCare
const SCREENSHOTS = {
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1&q=1', // placeholder — overridden below
};

// We embed the screenshots via a simple iframe-snapshot approach:
// Each slide uses a ScreenCapture component that renders a scaled iframe
// preview of the actual route, giving users a live thumbnail.

const SLIDES = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    route: '/',
    color: 'bg-primary/10 text-primary',
    caption: 'EthicaCare Dashboard — Command Center',
    description: 'The main landing page showing the HURO platform banner, workflow path shortcuts, live statistics, and recent patient cases.',
    navigation: [
      { area: 'HURO Banner (top of page)', action: 'Displays the H.U.R.O. LMS Platform identity. Click "HURO Training Portal" (top-right of banner) to open the HURO consulting site in a new tab.' },
      { area: 'Legacy Workflow Path card', action: 'Click "Open →" to navigate directly to the Criteria page (InterQual / MCG rule-based reviews).' },
      { area: 'AI / Modern Workflow Path card', action: 'Click "Open →" to navigate directly to AI Rounds (ambient documentation).' },
      { area: 'Stat cards (Total Cases / In Review / Approved / AI Assisted)', action: 'Read-only live counters that auto-refresh with the latest case data. No action needed.' },
      { area: 'Recent Cases list', action: 'Click any patient row to open that case for editing. Click "View all →" (top-right of section) to go to the full Case Library.' },
      { area: 'Sidebar — Navigation links', action: 'Click any sidebar item (Dashboard, New Case, AI Rounds, etc.) to switch modules. Click "Collapse" at the bottom to hide labels and gain screen space.' },
      { area: 'Top bar — Search field', action: 'Type a patient name, MRN, or diagnosis code to search across all cases.' },
    ],
  },
  {
    id: 'new-case',
    icon: Plus,
    label: 'New Case Review',
    route: '/case/new',
    color: 'bg-green-100 text-green-700',
    caption: 'New Case Review — Utilization & Secondary Review Workflow',
    description: 'The full case review workspace: patient demographics, AI criteria matching, ambient AI listener, SOAP note generation, and payer submission.',
    navigation: [
      { area: 'Patient Information panel (top)', action: 'Fill in Patient Name, MRN, Insurance, Admission Date, Primary DX (ICD-10 code + description), and Procedure Code. All fields auto-save.' },
      { area: 'Utilization Review / Secondary Review tabs', action: 'Click "Utilization Review" for initial admissions and continued-stay reviews. Click "Secondary Review" for appeals and peer-to-peer reviews.' },
      { area: 'Patient Snapshot card', action: 'Read-only confirmation of entered demographics. Updates automatically as you type in the Patient Information fields above.' },
      { area: 'Dx / Procedure Codes card', action: 'Displays formatted ICD-10 and CPT codes from your entries. Used by the AI Criteria Matcher.' },
      { area: 'AI Criteria Matcher', action: 'Automatically searches InterQual & MCG for criteria matching the patient\'s diagnosis. Click any result to expand it. Click "View full database" to browse all criteria.' },
      { area: 'Ambient AI Listener', action: 'Click "Start Ambient" to begin recording a clinical conversation. The AI transcribes and structures the output. Click "Stop" when done.' },
      { area: 'Upload Documents area', action: 'Drag and drop PDFs, DOCs, or images, or click the box to browse files. Uploaded documents are stored securely with the case.' },
      { area: 'AI Assist Recommendation', action: 'Click "Generate" to receive an AI-powered utilization recommendation based on the patient\'s data, notes, and matched criteria.' },
      { area: 'MD Note Analyzer + AI SOAP Generator', action: 'Paste or type raw MD clinical notes in the "Clinical Notes" field, then click "Generate AI SOAP Summary" to produce a structured Subjective / Objective / Assessment / Plan note.' },
      { area: 'Voice Dictation button', action: 'Click the microphone icon next to "Clinical Notes" to dictate notes by voice instead of typing.' },
      { area: 'Nurse Approved toggle', action: 'A nurse must toggle this to ON before the case can be submitted. This is a HIPAA-compliance gate.' },
      { area: 'Status selector (top-right)', action: 'Change the case status: Draft → In Review → Approved or Denied. The status is reflected in the Case Library and Dashboard.' },
      { area: 'Save button', action: 'Saves current progress as Draft at any time. The case is auto-saved periodically.' },
      { area: 'Send to Payer via eFax button', action: 'After nurse approval, click to submit the completed review to the payer via secure eFax.' },
    ],
  },
  {
    id: 'rounds',
    icon: Radio,
    label: 'AI Rounds',
    route: '/rounds',
    color: 'bg-orange-100 text-orange-600',
    caption: 'Ambient AI Rounds — Live Patient Board with Real-Time Documentation',
    description: 'The AI Rounds board shows all active patients organized by admission status. Ambient AI captures clinical conversations during rounds and generates structured notes for review.',
    navigation: [
      { area: 'Status pills (All / Inpatient / Observation / Direct Admit / Outpatient / Research)', action: 'Click any pill to filter the board to that admission type. "Research" shows AI model testing patients only.' },
      { area: 'Filters button (top-right)', action: 'Click to expand advanced filter fields: Last Name search, MRN search, Room Location, and Payer dropdown. Click "Clear all" to reset.' },
      { area: 'Grid / List view toggle icons', action: 'Click the grid icon for Card View (bedside-friendly). Click the list icon for Table/Worklist View (full-row data with expandable notes).' },
      { area: 'Add Patient button (teal, top-right)', action: 'Opens the Add Patient modal. Fill in Patient Name (required), MRN (required), Room, Admission Status, Priority, Primary Dx, Insurance, LOS, Attending MD, and Admission Date. Click "Add to Rounds".' },
      { area: 'Patient card — drag handle (≡ top-left of card)', action: 'Click and drag any card to reorder patients in your preferred sequence. Reordering persists for your current session.' },
      { area: 'Patient card — Admission Status badge (top-right)', action: 'Color-coded: Inpatient (teal), Observation (amber), Direct Admit (purple), Outpatient (green), Research (gray). Read-only on the card.' },
      { area: 'Patient card — LOS days', action: 'Color-coded by urgency: green (0–3d), amber (4–7d), red (8d+). Indicates escalation needs at a glance.' },
      { area: 'Patient card — Add quick note field', action: 'Click the note field on any card to type a brief observation. Click the save/check icon to store it. This note appears in Rounds Recall.' },
      { area: 'Patient card — Ambient AI Listener / Start button', action: 'Click "Start" to begin ambient microphone capture for that patient. Browser will prompt for microphone permission on first use. Click "Stop" to end capture — the AI then generates a structured note.' },
      { area: 'Ambient AI note — Approve button', action: 'After the AI generates a note, review the content and click "Approve" (green) to accept it as clinically accurate.' },
      { area: 'Ambient AI note — Promote to Progress Note button', action: 'After approving, click "Promote to Progress Note" to elevate the note into the patient\'s official Progress Notes record.' },
      { area: 'Patient count (top-right of pill row)', action: 'Shows how many patients match the current filter. Updates live as you change filters.' },
    ],
  },
  {
    id: 'recall',
    icon: RotateCcw,
    label: 'Rounds Recall',
    route: '/rounds-recall',
    color: 'bg-teal-100 text-teal-700',
    caption: 'Rounds Recall — Post-Rounds Review & Note Synchronization',
    description: 'After completing rounds, use Rounds Recall to review, edit, and copy all ambient AI captures and quick notes. Paste them directly into New Case reviews.',
    navigation: [
      { area: 'Status pills (All / Inpatient / Observation / Direct Admit / Outpatient / Research)', action: 'Filter the recall list to a specific admission type to focus your post-rounds documentation.' },
      { area: 'Filters button', action: 'Opens dropdowns for Name, MRN, Room, and Payer — same as AI Rounds — to narrow the patient list.' },
      { area: 'Patient accordion rows', action: 'Click any patient row to expand it and reveal their Quick Note and Ambient AI Captures. Click again to collapse.' },
      { area: 'Quick Note text area (expanded row)', action: 'The note you typed during rounds appears here. Click inside the field to edit it inline. Changes save when you click the save icon.' },
      { area: 'Copy button (📋) next to note', action: 'Copies the full note text to your clipboard. Navigate to New Case → Clinical Notes and paste (Ctrl+V / Cmd+V) to transfer the note.' },
      { area: 'Ambient AI captures list', action: 'Shows all AI-generated notes for this patient with their approval status (Pending / Approved / Promoted as a Progress Note).' },
      { area: '"0 patients with notes" empty state', action: 'This screen only shows patients who have at least one quick note or ambient capture. Complete rounds with notes first, then return here to review.' },
    ],
  },
  {
    id: 'case-library',
    icon: FileText,
    label: 'Case Library',
    route: '/cases',
    color: 'bg-accent/10 text-accent',
    caption: 'Case Library — Searchable Archive of All Patient Cases',
    description: 'A complete archive of every patient case in the system. Search, filter by status, and click any row to resume editing a case.',
    navigation: [
      { area: 'Page header — "4 total cases" count', action: 'Shows the total number of cases in the system (updates live). Not a clickable control.' },
      { area: 'Search bar ("Search by name or MRN…")', action: 'Type any part of a patient name or MRN. The list filters instantly as you type — no need to press Enter.' },
      { area: 'All Statuses dropdown filter', action: 'Click to open the dropdown and select: All Statuses, Draft, In Review, Approved, Denied, or Pending Info. The list updates immediately.' },
      { area: 'New Case button (top-right, teal)', action: 'Click to create a new blank case review — same as clicking "New Case" in the sidebar.' },
      { area: 'Case row (patient name, MRN, Dx, Insurance)', action: 'Click anywhere on a row to open the full case review for that patient. The right arrow (→) confirms it is clickable.' },
      { area: 'Status badge (In Review / Approved / Draft / Pending)', action: 'Color-coded read-only indicator showing where each case is in the review workflow. Change the status inside the case review.' },
    ],
  },
  {
    id: 'criteria',
    icon: BookMarked,
    label: 'Criteria',
    route: '/criteria',
    color: 'bg-purple-100 text-purple-700',
    caption: 'Criteria Database — InterQual & MCG Clinical Guidelines',
    description: 'A searchable library of clinical criteria sets from InterQual and MCG. Use it to look up admission, continued-stay, and discharge criteria for any diagnosis.',
    navigation: [
      { area: 'Source filter pills (All Sources / InterQual / MCG)', action: 'Click "InterQual" to show only InterQual criteria. Click "MCG" for MCG-only. Click "All Sources" to reset.' },
      { area: 'Search bar ("Search by title, ICD-10, CPT, keyword…")', action: 'Type a diagnosis name, ICD-10 code, CPT code, or keyword. Results filter in real time across all criteria fields.' },
      { area: 'All Categories dropdown', action: 'Click to filter by clinical category: Inpatient Admission, Surgical Procedure, Diagnostic Imaging, Behavioral Health, Skilled Nursing, Home Health, etc.' },
      { area: 'Results count ("15 results")', action: 'Shows how many criteria sets match your current search/filter. Updates live.' },
      { area: 'Criteria card (title, source badge, category, summary)', action: 'Click any card to open the Detail Panel on the right side of the screen showing the full criteria set.' },
      { area: 'Criteria card — LOS indicator (e.g., "LOS 2–6d")', action: 'Shows the typical length-of-stay range for this criteria set. Green dot = Level I evidence, Yellow = Level II.' },
      { area: 'Criteria card — ICD-10 count badge (e.g., "8 ICD-10")', action: 'Shows how many ICD-10 codes are mapped to this criteria. Visible in the Detail Panel.' },
      { area: 'Detail Panel (right side, after clicking a card)', action: 'Displays the full criteria: Admission Criteria, Continued Stay Criteria, Discharge Criteria, LOS statistics, ICD-10 codes, CPT codes, evidence level, and last-updated date.' },
      { area: 'Add Criteria Set button (admin only)', action: 'Opens a form to enter a new clinical criteria record with all fields. Only visible to Admin-role users.' },
    ],
  },
  {
    id: 'research',
    icon: FlaskConical,
    label: 'Research',
    route: '/research',
    color: 'bg-slate-100 text-slate-600',
    caption: 'Research Module — Admin-Only AI Model Testing Pool',
    description: 'An admin-restricted workspace for managing research patients, running AI summarization tests, uploading clinical PDFs, and exporting findings.',
    navigation: [
      { area: 'ADMIN ONLY badge (page header)', action: 'This page is only visible in the sidebar for users with Admin role. Regular users cannot access this page.' },
      { area: 'Research Patient Pool section', action: 'Shows all patients tagged with "Research" admission status. Each card shows name, MRN, room, diagnosis, insurance, LOS, and discharge barriers.' },
      { area: 'Filters button (top-right)', action: 'Opens filter fields to search the research pool by name, MRN, room, or payer.' },
      { area: 'Card / List view toggle', action: 'Switch between compact card view and detailed list/table view of research patients.' },
      { area: 'Patient card — drag handle (⋮⋮)', action: 'Drag to reorder patients in the research pool by priority.' },
      { area: 'Patient card — discharge barriers (orange text)', action: 'Highlights the key clinical or social barriers preventing discharge. Read-only summary from the patient record.' },
      { area: 'Work panel (bottom half — appears after clicking a patient)', action: 'Click any patient card to open their research workspace below the pool.' },
      { area: 'Manual Notes field (work panel)', action: 'Type free-text clinical observations, research notes, or study annotations for the selected patient.' },
      { area: 'AI Summarization field (work panel)', action: 'Click "Generate AI Summary" to run the patient\'s data and notes through the AI model. Output appears in the field for review.' },
      { area: 'Upload Clinical PDF button (work panel)', action: 'Click to upload a supporting clinical document (PDF) for this research patient. Stored securely.' },
      { area: 'Secure Email Export button', action: 'Opens the secure email tool to send research findings to HIS Management, Compliance, or Audit teams via encrypted internal messaging.' },
      { area: 'BI Export button', action: 'Downloads a CSV of the research patient dataset for use in Power BI, Tableau, or Excel.' },
    ],
  },
];

// ── Live App Preview Component ───────────────────────────────────────────────
function AppPreview({ route, label }) {
  const [zoomed, setZoomed] = useState(false);
  const appOrigin = window.location.origin;

  return (
    <div className="relative">
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border-2 border-border bg-muted transition-all cursor-pointer group',
          zoomed ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'h-56 sm:h-72'
        )}
        onClick={() => setZoomed(!zoomed)}
      >
        {zoomed && (
          <div className="absolute inset-0 bg-black/50 z-10" onClick={() => setZoomed(false)} />
        )}
        <iframe
          src={appOrigin + route}
          title={label + ' preview'}
          className={cn(
            'border-0 origin-top-left pointer-events-none',
            zoomed
              ? 'w-full h-full'
              : 'w-[1280px] h-[800px]'
          )}
          style={zoomed ? {} : { transform: 'scale(0.42)', width: '1280px', height: '800px', transformOrigin: 'top left' }}
          sandbox="allow-same-origin allow-scripts"
        />
        {/* Overlay label */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          <span className="text-white text-[11px] font-semibold">{label}</span>
          <span className="text-white/70 text-[10px] flex items-center gap-1">
            <ZoomIn className="w-3 h-3" /> {zoomed ? 'Click to close' : 'Click to expand'}
          </span>
        </div>
      </div>
      {zoomed && (
        <button
          onClick={() => setZoomed(false)}
          className="fixed top-6 right-6 z-[60] bg-white rounded-full p-2 shadow-xl text-foreground hover:bg-muted"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function TutorialWalkthrough() {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const Icon = slide.icon;

  const downloadSlides = () => {
    const content = SLIDES.map((s, i) => {
      const lines = [
        `${'═'.repeat(60)}`,
        `SLIDE ${i + 1}: ${s.label.toUpperCase()}`,
        `Route: ${s.route}`,
        `Caption: ${s.caption}`,
        '',
        s.description,
        '',
        'NAVIGATION GUIDE:',
        ...s.navigation.map((n, j) => `  ${j + 1}. [${n.area}]\n     → ${n.action}`),
      ];
      return lines.join('\n');
    }).join('\n\n');

    const header = [
      'ETHICACARE 2.0 — COMPLETE PLATFORM WALKTHROUGH GUIDE',
      'H.U.R.O. (Hospital Utilization Review Optimization)',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'ABOUT ETHICACARE:',
      'EthicaCare 2.0 is the proprietary AI-powered utilization management platform',
      'developed by H.U.R.O. (Hospital Utilization Review Optimization).',
      'HURO is a third-party healthcare consulting vendor that trains clinical teams',
      'in UM best practices, bridging legacy InterQual/MCG criteria with modern AI workflows.',
      '',
    ].join('\n');

    const blob = new Blob([header + content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EthicaCare-Complete-Walkthrough-Guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCurrentSlide = () => {
    const lines = [
      `ETHICACARE 2.0 — ${slide.label.toUpperCase()} NAVIGATION GUIDE`,
      `Route: ${slide.route}`,
      `Caption: ${slide.caption}`,
      '',
      slide.description,
      '',
      'NAVIGATION STEPS:',
      ...slide.navigation.map((n, i) => `  ${i + 1}. [${n.area}]\n     → ${n.action}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EthicaCare-${slide.id}-guide.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-bold text-lg">Feature Walkthrough</h2>
          <p className="text-xs text-muted-foreground">Live app previews with step-by-step navigation instructions for each screen</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs" onClick={downloadCurrentSlide}>
            <Download className="w-3.5 h-3.5" /> This Slide
          </Button>
          <Button size="sm" className="rounded-xl gap-1.5 text-xs bg-primary hover:bg-primary/90" onClick={downloadSlides}>
            <Download className="w-3.5 h-3.5" /> All Slides (.txt)
          </Button>
        </div>
      </div>

      {/* Slide Thumbnails */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {SLIDES.map((s, i) => {
          const SIcon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-[10px] font-semibold transition-all min-w-[64px]',
                current === i
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              )}
            >
              <SIcon className="w-4 h-4" />
              <span className="text-center leading-tight">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Slide Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Live App Preview */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', slide.color)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm">{slide.label}</p>
              <p className="text-[11px] text-muted-foreground">{slide.caption}</p>
            </div>
            <span className="ml-auto text-[10px] text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded-full">
              {current + 1} / {SLIDES.length}
            </span>
          </div>

          {/* Live iframe preview */}
          <AppPreview route={slide.route} label={slide.label} />

          <p className="text-[10px] text-muted-foreground mt-2 italic">{slide.description}</p>
        </div>

        {/* Navigation Guide */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-semibold text-sm">Step-by-Step Navigation</h3>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
              {slide.navigation.length} steps
            </span>
          </div>
          <div className="space-y-2.5">
            {slide.navigation.map((n, i) => (
              <div key={i} className="flex gap-3 bg-muted/30 rounded-xl p-3 border border-border/50">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-primary flex-shrink-0" />
                    {n.area}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          <Button
            variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs"
            disabled={current === 0}
            onClick={() => setCurrent(c => c - 1)}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </Button>
          <span className="text-[11px] text-muted-foreground font-medium">
            Slide {current + 1} of {SLIDES.length}
          </span>
          <Button
            variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs"
            disabled={current === SLIDES.length - 1}
            onClick={() => setCurrent(c => c + 1)}
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}