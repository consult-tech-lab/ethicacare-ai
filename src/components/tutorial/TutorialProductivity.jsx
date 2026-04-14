import React from 'react';
import { BarChart2, User, Shield, Calendar, Filter } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialProductivity() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={BarChart2}
        color="bg-chart-3/10 border-chart-3/20 text-chart-3"
        label="Tab 6 · Productivity"
        title="Performance Tracking & Metrics"
        description="The Productivity tab tracks completed case activity, reviewer performance, approval/denial rates, average LOS, and turnaround times. It adapts its view based on your role — regular users see personal metrics, admins see the full team."
      />

      <SubSection title="Two Views Based on Your Role">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <User className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-foreground">My Performance (All Users)</p>
            </div>
            <p className="text-xs text-muted-foreground">View your own completed cases, filtered by Day, Week, or Month. See your personal stats: cases completed, approval rate, avg LOS, avg turnaround.</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-3.5 border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-accent" />
              <p className="text-xs font-bold text-foreground">Team Overview (Admin Only)</p>
            </div>
            <p className="text-xs text-muted-foreground">See all reviewers' performance side by side. Reviewer leaderboard with click-to-filter, cross-team case table, and full export capabilities.</p>
          </div>
        </div>
      </SubSection>

      <SubSection title="Stat Cards Explained">
        <div className="space-y-2">
          {[
            ['Cases Completed', 'Total number of completed reviews in the selected period'],
            ['Approved', 'Count of cases with Approved outcome'],
            ['Denied', 'Count of cases with Denied outcome'],
            ['Avg LOS', 'Average length of stay in days across all cases in period'],
            ['Avg Turnaround', 'Average hours from case open to completion'],
          ].map(([title, desc], i) => (
            <div key={i} className="flex gap-2 text-xs bg-muted/30 rounded-lg px-3 py-2">
              <span className="font-semibold text-foreground w-36 flex-shrink-0">{title}</span>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Filters Available">
        <FeatureGrid features={[
          { icon: Calendar, title: 'Period Filter', desc: 'Day (today), Week (this week), Month (this month). All data is auto-filtered by the selected window.' },
          { icon: Filter,   title: 'Dx Category', desc: 'Filter by diagnosis category: Cardiac, Pulmonary, Renal, Oncology, Surgical, etc.' },
          { icon: Filter,   title: 'Medical Service', desc: 'Filter by service line: Cardiology, Nephrology, Neurology, General Surgery, etc.' },
          { icon: Filter,   title: 'Outcome', desc: 'Filter to see only Approved, Denied, or Pending cases.' },
          { icon: Filter,   title: 'LOS Range', desc: 'Filter by short (1–3 days), medium (4–7 days), or long (8+ days) stays.' },
        ]} />
      </SubSection>

      <SubSection title="How to Use Productivity">
        <Steps steps={[
          'Navigate to "Productivity" in the sidebar.',
          { title: 'Select your time period', desc: 'Click "Day," "Week," or "Month" to change the date window for all stats.' },
          { title: 'Read your stat cards', desc: 'The five summary cards update automatically based on your selected period and filters.' },
          { title: 'Apply filters (optional)', desc: 'Use the Dx Category, Service, Outcome, and LOS dropdowns to drill into specific subsets of your cases.' },
          { title: 'Review the case table', desc: 'Scroll down to see a row-by-row breakdown of every case activity in the selected period.' },
          { title: 'Admin: Switch to Team Overview', desc: 'If you are an admin, click the "Team Overview" tab to see the full reviewer leaderboard and cross-team table.' },
          { title: 'Admin: Filter by reviewer', desc: 'Click any reviewer card in the leaderboard to filter the table to just that person\'s cases.' },
        ]} />
      </SubSection>

      <Callout type="info">
        Productivity data comes from the <strong>Case Activity</strong> entity — records are logged each time a case is completed. If you don't see your data, check that cases have been saved with a completed status.
      </Callout>
    </div>
  );
}