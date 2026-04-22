import React from 'react';
import { BarChart2, User, Shield, Calendar, Filter, CheckCircle, XCircle } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialProductivity() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={BarChart2}
        color="bg-chart-3/10 border-chart-3/20 text-chart-3"
        label="Section 8 · Productivity"
        title="Performance Tracking & Metrics"
        description="The Productivity page has two sections: a Completed Cases table at the top showing all approved and denied cases, and a performance metrics section below. The metrics section shows your personal stats, and — if you are an admin — a Team Overview tab with the full reviewer leaderboard."
      />

      <SubSection title="Completed Cases Table (Top of Page)">
        <div className="space-y-2 text-xs text-muted-foreground">
          <p className="text-foreground text-xs leading-relaxed">The top section of the Productivity page shows a table of all completed (Approved or Denied) cases across the platform. Columns include:</p>
          {[
            ['Patient', 'Full patient name'],
            ['MRN', 'Medical Record Number in monospace font'],
            ['Insurance', 'Payer name'],
            ['Primary Dx', 'Truncated diagnosis code and description'],
            ['Outcome', 'Green "Approved" badge or red "Denied" badge'],
            ['Date', 'Date the case was last updated (completion date)'],
          ].map(([col, desc], i) => (
            <div key={i} className="flex gap-2 bg-muted/30 rounded-lg px-3 py-2">
              <span className="font-semibold text-foreground w-24 flex-shrink-0">{col}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Two Performance Views Based on Your Role">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <User className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-foreground">My Performance <span className="text-muted-foreground font-normal">(All Users)</span></p>
            </div>
            <p className="text-xs text-muted-foreground">View your own completed cases filtered by period. See personal stats: cases completed, approval rate, average LOS, and average turnaround time.</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-accent" />
              <p className="text-xs font-bold text-foreground">Team Overview <span className="text-primary text-[10px] font-bold bg-primary/10 px-1.5 rounded ml-1">Admin</span></p>
            </div>
            <p className="text-xs text-muted-foreground">See all reviewers' performance side by side. Includes a reviewer leaderboard, cross-team case table, and full export capabilities.</p>
          </div>
        </div>
      </SubSection>

      <SubSection title="Stat Cards Explained">
        <div className="space-y-2">
          {[
            ['Cases Completed', 'Total number of approved or denied reviews in the selected period'],
            ['Approved',        'Count of cases with Approved outcome'],
            ['Denied',          'Count of cases with Denied outcome'],
            ['Avg LOS',         'Average length of stay in days across all cases in the period'],
            ['Avg Turnaround',  'Average hours from case creation to completion'],
          ].map(([title, desc], i) => (
            <div key={i} className="flex gap-2 text-xs bg-muted/30 rounded-lg px-3 py-2">
              <span className="font-semibold text-foreground w-36 flex-shrink-0">{title}</span>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Filters Available (My Performance)">
        <FeatureGrid features={[
          { icon: Calendar, title: 'Period Filter', desc: 'Day (today), Week (this week), Month (this month). All data auto-filters by the selected window.' },
          { icon: Filter,   title: 'Dx Category', desc: 'Filter by diagnosis category: Cardiac, Pulmonary, Renal, Oncology, Surgical, Behavioral Health, etc.' },
          { icon: Filter,   title: 'Medical Service', desc: 'Filter by service line: Cardiology, Nephrology, Neurology, General Surgery, Gastroenterology, etc.' },
          { icon: Filter,   title: 'Outcome Filter', desc: 'Show only Approved or Denied cases for focused analysis.' },
          { icon: Filter,   title: 'LOS Range', desc: 'Filter by short (1–3 days), medium (4–7 days), or long (8+ days) stays.' },
        ]} />
      </SubSection>

      <SubSection title="How to Use Productivity">
        <Steps steps={[
          { title: 'Navigate to "Productivity" in the sidebar', desc: 'Click the bar chart icon in the left sidebar.' },
          { title: 'Review the Completed Cases table', desc: 'The top section shows all approved and denied cases across the platform with outcome badges and dates.' },
          { title: 'Select your time period', desc: 'Click "Day," "Week," or "Month" tabs to change the date window for your personal stat cards.' },
          { title: 'Read your stat cards', desc: 'The summary cards update automatically based on your selected period and filters.' },
          { title: 'Apply filters (optional)', desc: 'Use the Dx Category, Service, Outcome, and LOS dropdowns to drill into specific subsets.' },
          { title: 'Review your case table', desc: 'Scroll down to see a row-by-row breakdown of every case activity in the selected period.' },
          { title: 'Admin: Switch to Team Overview', desc: 'If you are an admin, click the "Team Overview" tab (with the shield icon) to see the full reviewer leaderboard and cross-team table.' },
          { title: 'Admin: Filter by reviewer', desc: 'Click any reviewer row in the leaderboard to filter the table to just that person\'s cases.' },
        ]} />
      </SubSection>

      <MockScreen label="Productivity — Completed Cases">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            <p className="text-xs font-semibold">Completed Cases</p>
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">2</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {['Patient', 'MRN', 'Insurance', 'Outcome', 'Date'].map(h => (
                    <th key={h} className="text-left py-1.5 px-2 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="px-2 py-2 font-medium">Robert Martinez</td>
                  <td className="px-2 py-2 text-muted-foreground font-mono">0034891</td>
                  <td className="px-2 py-2 text-muted-foreground">Aetna PPO</td>
                  <td className="px-2 py-2"><span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-md w-fit"><CheckCircle className="w-3 h-3" />Approved</span></td>
                  <td className="px-2 py-2 text-muted-foreground">Apr 20, 2026</td>
                </tr>
                <tr>
                  <td className="px-2 py-2 font-medium">Michael Johnson</td>
                  <td className="px-2 py-2 text-muted-foreground font-mono">0056234</td>
                  <td className="px-2 py-2 text-muted-foreground">Cigna</td>
                  <td className="px-2 py-2"><span className="flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-md w-fit"><XCircle className="w-3 h-3" />Denied</span></td>
                  <td className="px-2 py-2 text-muted-foreground">Apr 18, 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </MockScreen>

      <Callout type="info">
        Productivity data comes from the <strong>Case Activity</strong> entity — records are logged each time a case is completed (Approved or Denied). If you don't see your data, confirm cases have been saved with a final status.
      </Callout>
    </div>
  );
}