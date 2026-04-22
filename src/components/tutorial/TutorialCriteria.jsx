import React from 'react';
import { BookMarked, Search, Plus, Eye, Star, SlidersHorizontal } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialCriteria() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={BookMarked}
        color="bg-purple-50 border-purple-200 text-purple-800"
        label="Section 7 · Criteria Database"
        title="Clinical Criteria Reference Library"
        description="The Criteria Database is a searchable library of clinical authorization criteria from InterQual, MCG, CMS, Milliman, and other evidence-based sources. It powers the AI Criteria Matcher inside every Case Review and is also available for manual lookup."
      />

      <SubSection title="Source Filter Pills">
        <div className="space-y-2">
          {[
            ['All Sources', 'bg-primary text-primary-foreground border-primary', 'Default — shows all criteria sets from every publisher.'],
            ['InterQual', 'bg-amber-100 text-amber-700 border-amber-200', 'Evidence-based admission, continued stay, and discharge criteria. Level I–III evidence ratings.'],
            ['MCG', 'bg-purple-100 text-purple-700 border-purple-200', 'Milliman Care Guidelines — surgical, behavioral health, and post-acute criteria.'],
            ['CMS', 'bg-green-100 text-green-700 border-green-200', 'CMS Mandates — SNF admission rules, Home Health coverage, and Medicare Part A requirements.'],
          ].map(([label, cls, desc], i) => (
            <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-2 border border-border/50">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls} flex-shrink-0`}>{label}</span>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Key Features">
        <FeatureGrid features={[
          { icon: Search,          title: 'Full-Text Search', desc: 'Search by diagnosis name, ICD-10 code (e.g. "I50"), CPT code, or keyword. Results filter in real time as you type.' },
          { icon: SlidersHorizontal, title: 'Category Dropdown', desc: 'Filter by clinical category: Inpatient Admission, Surgical Procedure, Diagnostic Imaging, Behavioral Health, Skilled Nursing, Home Health, DME, Pharmacy, Rehabilitation.' },
          { icon: Eye,             title: 'Detail Side Panel', desc: 'Click any criteria card to open a full detail panel: Admission Criteria, Continued Stay Criteria, Discharge Criteria, LOS range, evidence level, ICD-10 and CPT codes.' },
          { icon: Plus,            title: 'Add Criteria Set', desc: 'Click "Add Criteria Set" (top right) to add a new custom criteria set. Fill in title, source, category, criteria text, codes, and LOS range.' },
          { icon: Star,            title: 'Evidence Level Dot', desc: 'Green dot = Level I (strongest evidence). Yellow dot = Level II. The dot appears on every criteria card.' },
        ]} />
      </SubSection>

      <SubSection title="Criteria Card Information">
        <div className="space-y-2 text-xs text-muted-foreground">
          {[
            ['Source Badge', 'Color-coded pill: amber = InterQual, purple = MCG, green = CMS, blue = Milliman'],
            ['Category', 'e.g. Inpatient Admission, Surgical Procedure, Behavioral Health, Skilled Nursing'],
            ['Evidence Level', 'Level I, Level II, Level III, Expert Consensus, or CMS Mandate'],
            ['LOS Range', '"LOS 2–6d" — typical minimum to maximum length of stay for this criteria set'],
            ['ICD-10 Count', '"8 ICD-10" — number of mapped diagnosis codes (viewable in the detail panel)'],
            ['Summary', 'Plain-language description of when this criteria set applies'],
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
          { title: 'Navigate to "Criteria" in the sidebar', desc: 'Click the bookmark icon in the left sidebar. The page shows the total count (e.g. "15 criteria sets · InterQual & MCG").' },
          { title: 'Use source filter pills to narrow by publisher', desc: 'Click "InterQual", "MCG", or "CMS" at the top. The count in parentheses (e.g. "InterQual (7)") shows how many sets exist per source.' },
          { title: 'Type in the search bar', desc: 'Search by ICD-10 code (e.g. "I50"), condition name (e.g. "heart failure"), CPT code, or keyword. Results filter instantly.' },
          { title: 'Apply category filter (optional)', desc: 'Use the "All Categories" dropdown to narrow by clinical area: Inpatient Admission, Surgical Procedure, Behavioral Health, etc.' },
          { title: 'Click any criteria card', desc: 'Opens the detail side panel on the right with the full Admission Criteria, Continued Stay Criteria, Discharge Criteria, LOS statistics, ICD-10 codes, CPT codes, and evidence level.' },
          { title: 'Cross-reference with your case', desc: 'Compare the patient\'s clinical presentation against the listed admission and continued stay criteria to support your authorization decision.' },
          { title: 'Add a new criteria set (all users)', desc: 'Click "Add Criteria Set," fill in the form including title, source, category, criteria text, ICD-10/CPT codes, and typical LOS range.' },
        ]} />
      </SubSection>

      <MockScreen label="Criteria Database — Search Results">
        <div className="space-y-2">
          <div className="flex gap-1.5 flex-wrap mb-2">
            {['All Sources', 'InterQual (7)', 'MCG (2)', 'CMS (3)'].map((s, i) => (
              <span key={i} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${i === 0 ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>{s}</span>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 h-8 bg-muted rounded-lg border border-border flex items-center px-2 gap-2">
              <Search className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Search by title, ICD-10, CPT, keyword...</span>
            </div>
            <div className="w-32 h-8 bg-muted rounded-lg border border-border flex items-center px-2">
              <span className="text-[10px] text-muted-foreground">All Categories ▾</span>
            </div>
          </div>
          {[
            ['InterQual', 'Inpatient Admission', 'Acute Myocardial Infarction – Inpatient Admission', 'LOS 2–7d', '8 ICD-10'],
            ['MCG', 'Surgical Procedure', 'Total Knee Arthroplasty (TKA) – Inpatient vs. Outpatient', 'LOS 1–4d', '6 ICD-10'],
          ].map(([source, cat, title, los, codes], i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${source === 'InterQual' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>{source}</span>
                <span className="text-[9px] text-muted-foreground">{cat}</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-green-600 flex items-center gap-1">● Level I</span>
                <span className="text-[9px] text-muted-foreground">{los}</span>
                <span className="text-[9px] text-muted-foreground">{codes}</span>
              </div>
            </div>
          ))}
        </div>
      </MockScreen>

      <Callout type="info">
        The Criteria Database is automatically queried by the AI Criteria Matcher inside Case Review. When you enter a Primary Dx and Procedure Code, the AI finds and ranks the most relevant criteria sets for you — so you don't need to search manually for every case.
      </Callout>
    </div>
  );
}