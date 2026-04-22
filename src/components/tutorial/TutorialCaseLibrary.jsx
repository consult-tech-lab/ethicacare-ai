import React from 'react';
import { FileText, Search, Filter, Eye, Plus, ArrowRight } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialCaseLibrary() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={FileText}
        color="bg-accent/10 border-accent/20 text-accent"
        label="Section 6 · Case Library"
        title="Finding & Managing Existing Cases"
        description="The Case Library is your searchable archive of every case created on the platform. The page header shows a live total case count. Filter by status, search by patient name or MRN, and click any row to open the full case review."
      />

      <SubSection title="What You'll See">
        <FeatureGrid features={[
          { icon: Search,    title: 'Search Bar', desc: 'Search across patient names and MRNs in real time — results filter as you type, no Enter key needed.' },
          { icon: Filter,    title: 'All Statuses Dropdown', desc: 'Filter the list by: All Statuses, Draft, In Review, Approved, Denied, or Pending Info. Updates the list instantly.' },
          { icon: Eye,       title: 'Case Rows', desc: 'Each row shows: patient name, MRN, primary Dx, insurance, and a color-coded status badge. The right arrow (→) confirms the row is clickable.' },
          { icon: Plus,      title: 'New Case Button', desc: 'Teal "+ New Case" button (top right) to start a blank case review directly from the library.' },
          { icon: ArrowRight, title: 'Click to Open', desc: 'Click anywhere on a case row to open the full Case Review with all saved data, AI notes, uploads, and SOAP summaries intact.' },
        ]} />
      </SubSection>

      <SubSection title="Status Badge Colors">
        <div className="space-y-2">
          {[
            ['In Review',    'bg-amber-100 text-amber-700',  'Case has been submitted for review — awaiting payer decision.'],
            ['Approved',     'bg-green-100 text-green-700',  'Payer authorized — case is complete.'],
            ['Denied',       'bg-red-100 text-red-700',      'Payer denied — may require appeal or secondary review.'],
            ['Draft',        'bg-muted text-muted-foreground', 'Work in progress — not yet submitted to payer.'],
            ['Pending Info', 'bg-primary/10 text-primary',   'Additional clinical information requested before a decision can be made.'],
          ].map(([label, cls, desc], i) => (
            <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-2 border border-border/50">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls} flex-shrink-0 w-24 text-center`}>{label}</span>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="How to Use the Case Library">
        <Steps steps={[
          { title: 'Navigate to "Case Library" in the sidebar', desc: 'Click the File icon in the left sidebar. The page header shows the total case count.' },
          { title: 'Search for a patient', desc: 'Type in the search bar to filter by patient name or MRN. Results update instantly as you type.' },
          { title: 'Filter by status', desc: 'Use the "All Statuses" dropdown to show only cases in a specific stage (e.g. all "In Review" cases that need follow-up).' },
          { title: 'Click a case row to open it', desc: 'Any row click opens the full Case Review for that patient with all previously saved data intact.' },
          { title: 'Continue where you left off', desc: 'All entered data, AI recommendations, SOAP notes, nurse approval status, and uploaded files are preserved.' },
          { title: 'Start a new case', desc: 'Click the teal "+ New Case" button (top right) to open a fresh case form.' },
        ]} />
      </SubSection>

      <MockScreen label="Case Library">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs font-heading font-bold">Case Library</p>
              <p className="text-[10px] text-muted-foreground">4 total cases</p>
            </div>
            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-lg font-semibold">+ New Case</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-muted rounded-lg border border-border flex items-center px-2 gap-2">
              <Search className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Search by name or MRN...</span>
            </div>
            <div className="w-28 h-8 bg-muted rounded-lg border border-border flex items-center px-2">
              <span className="text-[10px] text-muted-foreground">All Statuses ▾</span>
            </div>
          </div>
          {[
            ['Jane Doe', '0012456 · N18.5 CKD Stage 5 · Horizon BCBS', 'In Review', 'bg-amber-100 text-amber-700'],
            ['Robert Martinez', '0034891 · I50.9 Heart Failure · Aetna PPO', 'Approved', 'bg-green-100 text-green-700'],
            ['Sarah Kim', '0098712 · K80.10 Cholelithiasis · UnitedHealthcare', 'Draft', 'bg-muted text-muted-foreground'],
            ['Michael Johnson', '0056234 · M17.11 Primary OA Right Knee · Cigna', 'Pending', 'bg-primary/10 text-primary'],
          ].map(([name, sub, status, cls], i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-xs font-semibold">{name}</p>
                <p className="text-[10px] text-muted-foreground">{sub}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{status}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </MockScreen>

      <Callout type="tip">
        Use the Status Filter with "Draft" to find cases you started but haven't completed yet. Drafts are never submitted to payers — they are safe work-in-progress saves.
      </Callout>
    </div>
  );
}