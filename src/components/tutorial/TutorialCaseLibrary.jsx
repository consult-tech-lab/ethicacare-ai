import React from 'react';
import { FileText, Search, Filter, Eye, Plus } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialCaseLibrary() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={FileText}
        color="bg-accent/10 border-accent/20 text-accent"
        label="Tab 4 · Case Library"
        title="Finding & Managing Existing Cases"
        description="The Case Library is your searchable archive of every case that has been created on the platform. Filter by status, search by patient name or MRN, and jump into any case to continue reviewing."
      />

      <SubSection title="What You'll See">
        <FeatureGrid features={[
          { icon: Search, title: 'Search Bar', desc: 'Search across patient names and MRNs in real time.' },
          { icon: Filter, title: 'Status Filter', desc: 'Filter the list by Draft, In Review, Approved, Denied, or Pending Info.' },
          { icon: Eye, title: 'Case Rows', desc: 'Each row shows: patient name, MRN, primary Dx, review type, status badge, and creation date.' },
          { icon: Plus, title: 'New Case Shortcut', desc: 'A quick button to start a new case directly from the library view.' },
        ]} />
      </SubSection>

      <SubSection title="How to Use the Case Library">
        <Steps steps={[
          { title: 'Navigate to "Case Library" in the sidebar', desc: 'Click the File icon to open the full case list.' },
          { title: 'Search for a patient', desc: 'Type in the search bar to filter by patient name or MRN. Results update instantly.' },
          { title: 'Filter by status', desc: 'Use the status dropdown to show only cases in a specific workflow stage (e.g. all "In Review" cases).' },
          { title: 'Click a case row to open it', desc: 'Any row click opens the full Case Review for that patient with all saved data intact.' },
          { title: 'Continue where you left off', desc: 'All previously entered data, AI recommendations, SOAP notes, and uploaded files are preserved.' },
        ]} />
      </SubSection>

      <MockScreen label="Case Library">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 h-8 bg-muted rounded-lg border border-border" />
            <div className="w-28 h-8 bg-muted rounded-lg border border-border" />
          </div>
          {['Margaret Holloway', 'Thomas Nguyen', 'Sandra Mitchell'].map((name, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <p className="text-xs font-semibold">{name}</p>
                <p className="text-[10px] text-muted-foreground">{['I50.9 – CHF', 'J44.1 – COPD', 'A41.9 – Sepsis'][i]}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${['bg-green-100 text-green-700', 'bg-amber-100 text-amber-700', 'bg-red-100 text-red-700'][i]}`}>
                {['Approved', 'In Review', 'Denied'][i]}
              </span>
            </div>
          ))}
        </div>
      </MockScreen>

      <Callout type="tip">
        Use the Status Filter with "Draft" to find cases you started but haven't completed yet. Drafts are never submitted to payers.
      </Callout>
    </div>
  );
}