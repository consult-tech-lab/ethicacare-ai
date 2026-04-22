import React from 'react';
import { LayoutDashboard, TrendingUp, FileText, Plus, Eye, ExternalLink, BookOpen, Radio } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialDashboard() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={LayoutDashboard}
        color="bg-primary/5 border-primary/20 text-primary"
        label="Section 3 · Dashboard"
        title="Your Command Center"
        description="The Dashboard is the first screen after logging in. It features the HURO Training Portal banner at the top, workflow path shortcuts, live statistics, and your most recent patient cases."
      />

      <SubSection title="What You'll See">
        <FeatureGrid features={[
          { icon: ExternalLink, title: 'HURO Training Banner', desc: 'The dark header banner identifies the H.U.R.O. LMS Platform. Click "HURO Training Portal" (top-right of the banner) to open the HURO consulting site in a new tab.' },
          { icon: BookOpen,     title: 'Legacy Workflow Path', desc: 'Card with an "Open →" link that navigates directly to the Criteria database — for InterQual / MCG rule-based review teams.' },
          { icon: Radio,        title: 'AI / Modern Workflow Path', desc: 'Card with an "Open →" link that navigates directly to AI Rounds — for ambient documentation and NLP-based SOAP workflows.' },
          { icon: TrendingUp,   title: 'Stats Cards', desc: 'Four live counters: Total Cases, In Review, Approved, and AI Assisted — updated automatically as your team works.' },
          { icon: FileText,     title: 'Recent Cases', desc: 'List of the most recently updated patient cases with name, MRN, primary Dx, and color-coded status badge.' },
          { icon: Plus,         title: 'New Case Review Button', desc: 'Teal button (top-right of the stats area) that opens a blank case review form.' },
        ]} />
      </SubSection>

      <SubSection title="How to Use the Dashboard">
        <Steps steps={[
          { title: 'Read the HURO banner', desc: 'The dark banner at the top confirms you are in the EthicaCare 2.0 platform. Click "HURO Training Portal" to access training materials in a separate tab.' },
          { title: 'Choose your workflow path', desc: 'Click "Open →" on the Legacy Workflow Path card to go to Criteria, or "Open →" on the AI / Modern Workflow Path card to go to AI Rounds.' },
          { title: 'Check your summary stats', desc: 'The four cards below the workflow paths show Total Cases, In Review, Approved, and AI Assisted counts — all live.' },
          { title: 'Scan recent cases', desc: 'The Recent Cases list shows your latest patient cases. Each row shows name, MRN, diagnosis, and status badge (In Review, Approved, Draft, Pending Info).' },
          { title: 'Click any case to open it', desc: 'Clicking a row navigates directly into that full Case Review — all saved data and AI notes are preserved.' },
          { title: 'Start a new case', desc: 'Click the teal "New Case Review" button (top right of the stats area) to open a blank case form.' },
          { title: 'Navigate with the sidebar', desc: 'The dark left sidebar is always visible. Click any label to switch modules. Use the "Collapse" button at the bottom to hide labels and gain screen space.' },
        ]} />
      </SubSection>

      <MockScreen label="Dashboard — EthicaCare 2.0">
        <div className="space-y-3">
          {/* HURO Banner mock */}
          <div className="bg-sidebar text-sidebar-foreground rounded-xl p-3 text-xs">
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">LMS PLATFORM · Hospital Utilization Review Optimization</p>
            <p className="font-heading font-bold text-sm mt-0.5">H.U.R.O. Training & Consulting Portal</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {['Legacy Team — InterQual/MCG', 'Modern Team — AI/NLP', 'HIPAA Compliant'].map((t, i) => (
                <span key={i} className="text-[9px] bg-sidebar-accent text-sidebar-foreground/70 px-2 py-0.5 rounded-full border border-sidebar-border">{t}</span>
              ))}
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[['Total Cases', '4'], ['In Review', '1'], ['Approved', '1'], ['AI Assisted', '0']].map(([label, val], i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-lg font-bold text-foreground">{val}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          {/* Recent Cases */}
          <div className="bg-card rounded-xl border border-border p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Cases</p>
            {[
              ['Jane Doe', 'N18.5 CKD Stage 5', 'In Review', 'bg-amber-100 text-amber-700'],
              ['Robert Martinez', 'I50.9 Heart Failure', 'Approved', 'bg-green-100 text-green-700'],
              ['Sarah Kim', 'K80.10 Cholelithiasis', 'Draft', 'bg-muted text-muted-foreground'],
            ].map(([name, dx, status, cls], i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-xs font-semibold text-foreground">{name}</p>
                  <p className="text-[10px] text-muted-foreground">{dx}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </MockScreen>

      <Callout type="tip">
        The Dashboard is read-only — it reflects live database counts. To take action, navigate to the specific section (New Case, AI Rounds, etc.) using the sidebar.
      </Callout>
    </div>
  );
}