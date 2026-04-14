import React from 'react';
import { Activity, PieChart, BarChart2, TrendingUp } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid } from './TutorialShared';

export default function TutorialAnalytics() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={Activity}
        color="bg-blue-50 border-blue-200 text-blue-800"
        label="Tab 7 · Analytics"
        title="Platform-Wide Insights"
        description="Analytics provides a high-level visual overview of all cases on the platform — status distribution, AI feature adoption rates, and utilization trends. It is read-only and updates in real time."
      />

      <SubSection title="Charts Available">
        <FeatureGrid features={[
          { icon: PieChart,  title: 'Case Status Distribution', desc: 'Donut chart showing the breakdown of Draft, In Review, Approved, Denied, and Pending Info cases across the entire platform.' },
          { icon: BarChart2, title: 'AI Feature Usage', desc: 'Bar chart showing how many cases used AI Recommendation, SOAP generation, and nurse approval workflows.' },
        ]} />
      </SubSection>

      <SubSection title="How to Use Analytics">
        <Steps steps={[
          'Navigate to "Analytics" in the sidebar.',
          { title: 'Read the status donut chart', desc: 'Each color slice represents a case status. Hover over a slice to see the exact count. The legend below the chart labels each segment.' },
          { title: 'Read the AI Usage bar chart', desc: 'Three bars show adoption of AI Recommendation, SOAP generation, and nurse approval. Compare them to understand AI utilization rates on your team.' },
          { title: 'Use for management reporting', desc: 'Screenshots or exports from this page can support internal QA reviews, contractor performance summaries, and HIS management reports.' },
        ]} />
      </SubSection>

      <Callout type="tip">
        For deeper BI analytics and custom reporting, use the <strong>BI Data Export</strong> tool in the Settings tab to export raw CSV data to Power BI, Tableau, or Excel.
      </Callout>
    </div>
  );
}