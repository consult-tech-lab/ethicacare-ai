import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Download, Monitor,
  LayoutDashboard, Plus, Radio, FileText, BookMarked,
  BarChart2, RotateCcw, FlaskConical, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SLIDES = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    color: 'bg-primary/10 text-primary',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    caption: 'EthicaCare Dashboard — Command Center',
    navigation: [
      { area: 'HURO Banner (top)', action: 'Click "HURO Training Portal" link to open the HURO consulting site in a new tab.' },
      { area: 'Workflow Path Cards', action: 'Click "Open →" on Legacy Workflow to go to Criteria, or Modern Workflow to go to AI Rounds.' },
      { area: 'Stats Row', action: 'Read-only counters showing Total Cases, In Review, Approved, and AI-Assisted cases.' },
      { area: 'Recent Cases list', action: 'Click any row to open that patient\'s case review. Click "View all →" to open the full Case Library.' },
      { area: 'Sidebar', action: 'Use the left sidebar to navigate to any module. Click the collapse arrow at the bottom to save screen space.' },
    ],
  },
  {
    id: 'new-case',
    icon: Plus,
    label: 'New Case Review',
    color: 'bg-green-100 text-green-700',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    caption: 'New Case Review — Utilization & Secondary Review',
    navigation: [
      { area: 'Patient Info panel (top)', action: 'Fill in patient name, MRN, insurance, admission date, primary diagnosis, and procedure code.' },
      { area: 'Review Type selector', action: 'Choose "Utilization Review" for initial/continued stay, or "Secondary Review" for appeals and peer-to-peer.' },
      { area: 'Clinical Notes tab', action: 'Paste or type raw MD notes. Click "Generate SOAP Note" to produce an AI-structured summary.' },
      { area: 'AI Recommendation tab', action: 'After entering notes, click "Get AI Recommendation" to receive a utilization decision rationale.' },
      { area: 'Criteria Matcher tab', action: 'Search InterQual/MCG criteria matched to the patient\'s diagnosis automatically.' },
      { area: 'Status bar (top right)', action: 'Change status from Draft → In Review → Approved/Denied. Nurse must toggle "Nurse Approved" before final submission.' },
      { area: 'Save / Submit buttons', action: 'Auto-saves as Draft. Click "Submit for eFax" to send the completed review to the payer.' },
    ],
  },
  {
    id: 'rounds',
    icon: Radio,
    label: 'AI Rounds',
    color: 'bg-orange-100 text-orange-600',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80',
    caption: 'Ambient AI Rounds — Real-Time Patient Documentation',
    navigation: [
      { area: 'Status pills (All / Inpatient / Observation…)', action: 'Click a pill to filter the board to that admission status. "Research" shows AI-model test patients.' },
      { area: 'Filters button', action: 'Click to expand advanced filters: Last Name, MRN, Room, and Payer dropdowns.' },
      { area: 'View toggle (grid / list icons)', action: 'Switch between Card View (bedside-friendly) and Table/Worklist View.' },
      { area: 'Add Patient button', action: 'Opens a modal to add a new patient to rounds. Fill required fields (Name, MRN) then click "Add to Rounds".' },
      { area: 'Patient card — Mic button', action: 'Click to start ambient recording. AI listens and generates a structured clinical note after you stop.' },
      { area: 'Patient card — Quick Note field', action: 'Type a brief free-text note directly on the card and click Save to store it.' },
      { area: 'Drag handle (≡)', action: 'Drag any card or row to reorder patients in your preferred priority sequence.' },
      { area: 'Approve / Promote buttons', action: 'Approve an AI note to accept it, then Promote it to elevate it into the official Progress Notes record.' },
    ],
  },
  {
    id: 'recall',
    icon: RotateCcw,
    label: 'Rounds Recall',
    color: 'bg-teal-100 text-teal-700',
    image: 'https://images.unsplash.com/photo-1666214280577-5aa2b7ad3e9c?w=1200&q=80',
    caption: 'Rounds Recall — Post-Rounds Review & Note Sync',
    navigation: [
      { area: 'Filter bar', action: 'Search by name, MRN, room, or filter by status/payer to narrow the patient list.' },
      { area: 'Patient accordion rows', action: 'Click a patient row to expand their Ambient AI notes and Quick Note for review.' },
      { area: 'Note text area', action: 'Edit the recalled note inline. Changes save automatically when you click "Save".' },
      { area: 'Copy button (📋)', action: 'Copies the note text to clipboard — paste it directly into New Case → Clinical Notes.' },
      { area: 'Status badges', action: 'Shows Pending / Approved / Promoted status for each ambient AI capture.' },
    ],
  },
  {
    id: 'case-library',
    icon: FileText,
    label: 'Case Library',
    color: 'bg-accent/10 text-accent',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    caption: 'Case Library — Searchable Archive of All Patient Cases',
    navigation: [
      { area: 'Search bar', action: 'Type a patient name or MRN to instantly filter the case list.' },
      { area: 'Status filter dropdown', action: 'Filter by Draft, In Review, Approved, Denied, or Pending Info.' },
      { area: 'Case row', action: 'Click any row to open the full case review for editing or viewing.' },
      { area: 'New Case button (top right)', action: 'Shortcut to create a fresh case without going back to the sidebar.' },
    ],
  },
  {
    id: 'criteria',
    icon: BookMarked,
    label: 'Criteria',
    color: 'bg-purple-100 text-purple-700',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    caption: 'Criteria Database — InterQual & MCG Clinical Guidelines',
    navigation: [
      { area: 'Search bar', action: 'Full-text search across all criteria titles, keywords, ICD-10 codes, and summaries.' },
      { area: 'Source filter (InterQual / MCG)', action: 'Toggle between InterQual and MCG criteria sets.' },
      { area: 'Category filter', action: 'Narrow by clinical category: Inpatient Admission, Surgical, Imaging, Behavioral Health, etc.' },
      { area: 'Criteria card', action: 'Click a card to open the Detail panel on the right showing full admission, continued-stay, and discharge criteria.' },
      { area: 'Detail panel — LOS stats', action: 'Shows typical, minimum, and maximum length of stay benchmarks for the selected criteria set.' },
      { area: 'Add Criteria button (admin)', action: 'Opens a form to enter a new criteria set with codes, evidence level, and clinical guidelines.' },
    ],
  },
  {
    id: 'productivity',
    icon: BarChart2,
    label: 'Productivity',
    color: 'bg-chart-3/10 text-chart-3',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    caption: 'Productivity — Case Completion Metrics & Performance',
    navigation: [
      { area: 'Completed Cases table (top)', action: 'Lists all Approved and Denied cases with patient, MRN, insurance, diagnosis, outcome, and date.' },
      { area: 'My Performance tab', action: 'Personal dashboard: your case counts, approval rate, and filtered activity table.' },
      { area: 'Team Overview tab (admin only)', action: 'Admin-level leaderboard and team-wide metrics. Only visible to users with Admin role.' },
      { area: 'Period selector', action: 'Filter metrics by This Week, This Month, Last 30 Days, or All Time.' },
      { area: 'Diagnosis / Service filters', action: 'Narrow performance data by diagnosis category or medical service line.' },
    ],
  },
  {
    id: 'research',
    icon: FlaskConical,
    label: 'Research (Admin)',
    color: 'bg-slate-100 text-slate-600',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=80',
    caption: 'Research Module — Admin-Only AI Model Testing',
    navigation: [
      { area: 'Access gate', action: 'This page is only visible in the sidebar for Admin-role users.' },
      { area: 'Patient pool (left panel)', action: 'Drag-and-drop list of research patients. Filter by name, MRN, payer, status. Click a patient to open their work panel.' },
      { area: 'Manual Notes field', action: 'Enter free-text clinical observations for the selected research patient.' },
      { area: 'AI Summarization field', action: 'Click "Generate AI Summary" to run the patient\'s notes through the AI model and view structured output.' },
      { area: 'Upload Clinical PDF', action: 'Upload supporting PDF documents for the selected patient (stored securely).' },
      { area: 'Secure Email Export', action: 'Send research findings via encrypted internal email to HIS Management or Compliance.' },
      { area: 'BI Export button', action: 'Download a CSV of the research dataset for Power BI, Tableau, or Excel analysis.' },
    ],
  },
];

export default function TutorialWalkthrough() {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const Icon = slide.icon;

  const downloadSlides = () => {
    const content = SLIDES.map((s, i) => {
      const lines = [`=== SLIDE ${i + 1}: ${s.label.toUpperCase()} ===`, `Caption: ${s.caption}`, '', 'NAVIGATION GUIDE:'];
      s.navigation.forEach((n, j) => lines.push(`  ${j + 1}. [${n.area}] — ${n.action}`));
      return lines.join('\n');
    }).join('\n\n' + '─'.repeat(60) + '\n\n');

    const header = [
      'ETHICACARE 2.0 — PLATFORM WALKTHROUGH GUIDE',
      'H.U.R.O. (Hospital Utilization Review Optimization)',
      'Generated: ' + new Date().toLocaleDateString(),
      '',
      'ABOUT:',
      'HURO is a third-party healthcare consulting vendor.',
      'EthicaCare 2.0 is HURO\'s proprietary AI-powered utilization management platform.',
      '',
      '═'.repeat(60),
      '',
    ].join('\n');

    const blob = new Blob([header + content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EthicaCare-Walkthrough-Guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCurrentSlide = () => {
    const lines = [
      `ETHICACARE 2.0 — ${slide.label.toUpperCase()} GUIDE`,
      `H.U.R.O. Platform Walkthrough`,
      '',
      `Caption: ${slide.caption}`,
      '',
      'NAVIGATION GUIDE:',
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
          <p className="text-xs text-muted-foreground">Step through each screen with navigation instructions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs" onClick={downloadCurrentSlide}>
            <Download className="w-3.5 h-3.5" /> This Slide
          </Button>
          <Button size="sm" className="rounded-xl gap-1.5 text-xs bg-primary hover:bg-primary/90" onClick={downloadSlides}>
            <Download className="w-3.5 h-3.5" /> All Slides
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
                'flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-[10px] font-semibold transition-all',
                current === i
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              )}
            >
              <SIcon className="w-4 h-4" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Slide */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden bg-muted">
          <img
            src={slide.image}
            alt={slide.caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', slide.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-heading font-bold text-sm">{slide.label}</p>
                <p className="text-white/70 text-[11px]">{slide.caption}</p>
              </div>
            </div>
            <span className="text-white/60 text-[11px] font-semibold">
              {current + 1} / {SLIDES.length}
            </span>
          </div>
        </div>

        {/* Navigation Guide */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-semibold text-sm">Navigation Guide</h3>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{slide.navigation.length} areas</span>
          </div>
          <div className="space-y-2.5">
            {slide.navigation.map((n, i) => (
              <div key={i} className="flex gap-3 bg-muted/30 rounded-xl p-3 border border-border/50">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-primary" />
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
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 text-xs"
            disabled={current === 0}
            onClick={() => setCurrent(c => c - 1)}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </Button>
          <span className="text-[11px] text-muted-foreground font-medium">
            Slide {current + 1} of {SLIDES.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 text-xs"
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