import React from 'react';
import { LayoutDashboard, TrendingUp, FileText, Plus, Eye, Clock } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialDashboard() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={LayoutDashboard}
        color="bg-primary/5 border-primary/20 text-primary"
        label="Tab 1 · Dashboard"
        title="Your Command Center"
        description="The Dashboard is the first screen you see after logging in. It gives you an at-a-glance overview of all active cases, platform statistics, and quick-access shortcuts to the most common workflows."
      />

      <SubSection title="What You'll See">
        <FeatureGrid features={[
          { icon: TrendingUp, title: 'Stats Cards', desc: 'Total Cases, Approved, Denied, and Pending Info counts — updated in real time.' },
          { icon: FileText,   title: 'Recent Cases', desc: 'List of the most recently created or updated patient cases with status badges.' },
          { icon: Plus,       title: 'New Case Button', desc: 'One-click shortcut to start a brand new case review from the header.' },
          { icon: Eye,        title: 'Case Quick View', desc: 'Click any case in the list to jump directly into the full case review screen.' },
        ]} />
      </SubSection>

      <SubSection title="How to Use the Dashboard">
        <Steps steps={[
          { title: 'Read your summary stats', desc: 'The four cards at the top show your total, approved, denied, and pending cases. These update live as your team submits work.' },
          { title: 'Scan recent activity', desc: 'Below the stats, the Recent Cases list shows the last 10–20 cases. Each row shows the patient name, primary diagnosis, status badge, and the date.' },
          { title: 'Click any case to open it', desc: 'Clicking a row navigates directly to that Case Review — all prior data and AI notes are preserved.' },
          { title: 'Start a new case', desc: 'Click the orange "New Case Review" button (top right) to open a blank case form.' },
          { title: 'Use the sidebar to navigate', desc: 'The left sidebar is always visible. Click any icon or label to navigate to another section of the platform.' },
        ]} />
      </SubSection>

      <MockScreen label="Dashboard Overview">
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {['Total Cases', 'Approved', 'Denied', 'Pending'].map((label, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-lg font-bold text-foreground">{[24, 14, 4, 6][i]}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl border border-border p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Cases</p>
            {['Margaret Holloway — I50.9 CHF', 'Thomas Nguyen — J44.1 COPD', 'Sandra Mitchell — A41.9 Sepsis'].map((c, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <span className="text-xs text-foreground">{c}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${['bg-green-100 text-green-700','bg-amber-100 text-amber-700','bg-red-100 text-red-700'][i]}`}>
                  {['Approved','In Review','Denied'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </MockScreen>

      <Callout type="tip">
        <strong>Pro tip:</strong> The Dashboard is read-only — it reflects what's in the database. To take action, navigate to the specific tab (Case Review, Rounds, etc.).
      </Callout>
    </div>
  );
}