import React from 'react';
import { BookMarked, Search, Plus, Eye, Star } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialCriteria() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={BookMarked}
        color="bg-purple-50 border-purple-200 text-purple-800"
        label="Tab 5 · Criteria Database"
        title="Clinical Criteria Reference Library"
        description="The Criteria Database is a searchable library of clinical authorization criteria from InterQual, CMS, MCG, Hayes, AHA, and other evidence-based sources. It powers the AI Criteria Matcher inside every Case Review."
      />

      <SubSection title="Key Features">
        <FeatureGrid features={[
          { icon: Search, title: 'Full-Text Search', desc: 'Search by diagnosis name, ICD-10 code, CPT code, or keyword.' },
          { icon: Star,   title: 'Source Filter Pills', desc: 'Filter by source: InterQual, CMS, MCG, Hayes, AHA, ACC, Other.' },
          { icon: Eye,    title: 'Detail Side Panel', desc: 'Click any card to open a full criteria detail panel: admission criteria, continued stay, discharge criteria, LOS range, evidence level.' },
          { icon: Plus,   title: 'Add Criteria Set', desc: 'Admins can add new custom criteria sets with all fields including ICD-10/CPT codes and clinical notes.' },
        ]} />
      </SubSection>

      <SubSection title="Criteria Card Information">
        <div className="space-y-2 text-xs text-muted-foreground">
          {[
            ['Source Badge', 'Color-coded: amber = InterQual, green = CMS, purple = MCG'],
            ['Category', 'e.g. Inpatient Admission, Surgical Procedure, Behavioral Health'],
            ['Evidence Level', 'Level I–III, Expert Consensus, or CMS Mandate'],
            ['Typical LOS', 'Minimum to maximum length of stay range'],
            ['ICD-10 Count', 'Number of mapped diagnosis codes'],
          ].map(([k, v], i) => (
            <div key={i} className="flex gap-2 bg-muted/30 rounded-lg px-3 py-2">
              <span className="font-semibold text-foreground w-28 flex-shrink-0">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="How to Search and Use Criteria">
        <Steps steps={[
          { title: 'Navigate to "Criteria DB" in the sidebar', desc: 'Click the bookmark icon to open the full criteria library.' },
          { title: 'Use source filter pills to narrow by publisher', desc: 'Click "InterQual", "CMS", "MCG" etc. at the top. The count in parentheses shows how many sets exist per source.' },
          { title: 'Type in the search bar', desc: 'Search by ICD-10 code (e.g. "I50"), condition name (e.g. "heart failure"), or CPT code. Results filter instantly.' },
          { title: 'Click any criteria card', desc: 'Opens the detail panel on the right with the full admission criteria, continued stay criteria, discharge criteria, and code lists.' },
          { title: 'Cross-reference with your case', desc: 'Compare the patient\'s clinical presentation against the listed admission and continued stay criteria to support your authorization decision.' },
          { title: 'Add a new criteria set (admin)', desc: 'Click "Add Criteria Set," fill in the form including title, source, category, criteria text, ICD-10/CPT codes, and typical LOS range.' },
        ]} />
      </SubSection>

      <Callout type="info">
        The Criteria Database is also queried automatically by the AI Criteria Matcher inside Case Review. When you enter a Primary Dx and Procedure Code, the AI finds and ranks the most relevant criteria sets for you.
      </Callout>
    </div>
  );
}