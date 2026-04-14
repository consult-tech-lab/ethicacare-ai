import React from 'react';
import { Settings, Download, Mail, MessageSquare, Bell, Lock, FileSpreadsheet, Bug, Send, Star } from 'lucide-react';
import { SectionHeader, Steps, Callout, SubSection, FeatureGrid, MockScreen } from './TutorialShared';

export default function TutorialSettings() {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={Settings}
        color="bg-slate-100 border-slate-200 text-slate-700"
        label="Tab 8 · Settings & Tools — Featured"
        title="Configuration, Export, Messaging & Feedback"
        description="The Settings tab is your control center for platform configuration and essential auditor/contractor tools: BI data export, secure internal messaging, bug reporting, notification preferences, and HIPAA compliance controls."
      />

      {/* BI Export */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Download className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm">BI Data Export</h3>
            <p className="text-xs text-muted-foreground">Export platform data to CSV for external BI tools</p>
          </div>
        </div>
        <SubSection title="What Can Be Exported">
          <FeatureGrid features={[
            { icon: FileSpreadsheet, title: 'Patient Cases',        desc: 'All case reviews with status, AI output, soap summaries, nurse approvals.' },
            { icon: FileSpreadsheet, title: 'Case Activity',        desc: 'Reviewer productivity records, LOS, turnaround times, and outcomes.' },
            { icon: FileSpreadsheet, title: 'Rounds & AI Notes',    desc: 'All patient rounds data including captured ambient notes and progress notes.' },
            { icon: FileSpreadsheet, title: 'Clinical Criteria',    desc: 'Full criteria database with ICD-10/CPT codes, evidence levels, and criteria text.' },
          ]} />
        </SubSection>
        <SubSection title="How to Export">
          <Steps steps={[
            'Scroll to the "BI Data Export" section in Settings.',
            { title: 'Click "Export CSV" next to the desired dataset', desc: 'A CSV file downloads immediately to your device.' },
            { title: 'Open in your BI tool', desc: 'Import the CSV into Power BI, Tableau, Excel, or any data analysis tool. All fields are exported as flat columns.' },
            { title: 'Repeat as needed', desc: 'Exports are always current — run them any time to get the latest data.' },
          ]} />
        </SubSection>
        <Callout type="tip">
          For Power BI dashboards, use the Case Activity export for performance metrics and the Patient Cases export for outcome analysis.
        </Callout>
      </div>

      {/* Secure Email */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm">Secure Internal Messaging</h3>
            <p className="text-xs text-muted-foreground">Send encrypted messages to HIS teams from within the platform</p>
          </div>
        </div>
        <SubSection title="Available Recipients">
          <div className="space-y-2">
            {[
              ['Compliance Team', 'For HIPAA questions, compliance incidents, or audit findings'],
              ['HIS Management', 'For escalations, contractor reports, or management communications'],
              ['Technical Support', 'For platform access issues, login problems, or system questions'],
              ['Audit Coordination', 'For audit scheduling, documentation requests, or findings'],
            ].map(([r, d], i) => (
              <div key={i} className="flex gap-2 text-xs bg-muted/30 rounded-lg px-3 py-2">
                <span className="font-semibold text-foreground w-40 flex-shrink-0">{r}</span>
                <span className="text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="Message Types">
          <div className="flex flex-wrap gap-1.5">
            {['Case Documentation', 'Audit Finding', 'Payer Communication', 'Escalation', 'Compliance Notice', 'Contractor Report'].map(t => (
              <span key={t} className="text-[10px] bg-muted px-2.5 py-1 rounded-full font-medium text-muted-foreground">{t}</span>
            ))}
          </div>
        </SubSection>
        <SubSection title="How to Send a Secure Message">
          <Steps steps={[
            'Scroll to "Secure Internal Messaging" in Settings.',
            { title: 'Select a recipient', desc: 'Choose from Compliance Team, HIS Management, Technical Support, or Audit Coordination.' },
            { title: 'Choose a message type', desc: 'Select the category that best describes your message (e.g. Audit Finding, Escalation).' },
            { title: 'Enter a subject line', desc: 'Be specific — e.g. "Authorization Review – Patient MRN-77001 – April 14 2026."' },
            { title: 'Add a Case Reference (optional)', desc: 'Paste in an MRN or case ID to link the message to a specific patient.' },
            { title: 'Write your message body', desc: 'Include all relevant details. The platform automatically appends your name, email, role, and timestamp.' },
            { title: 'Click "Send Secure Message"', desc: 'The message is sent via the platform\'s encrypted email system. A confirmation banner appears.' },
          ]} />
        </SubSection>
        <Callout type="info">
          All secure messages are automatically stamped with your name, email, role, and the current date/time for a full audit trail.
        </Callout>
      </div>

      {/* Feedback */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm">Feedback, Bug Reports & Issues</h3>
            <p className="text-xs text-muted-foreground">Report problems or request improvements directly to the support team</p>
          </div>
        </div>
        <SubSection title="Feedback Categories">
          <FeatureGrid features={[
            { icon: Bug,          title: 'Bug / Error',      desc: 'Something is broken, crashing, or not working as expected.' },
            { icon: Settings,     title: 'Technical Issue',  desc: 'Slow performance, display problems, or unexpected behavior.' },
            { icon: Star,         title: 'Feature Request',  desc: 'Suggest a new capability or improvement to an existing feature.' },
            { icon: MessageSquare,title: 'Question / Help',  desc: 'Need clarification on how something works.' },
          ]} />
        </SubSection>
        <SubSection title="How to Submit Feedback">
          <Steps steps={[
            'Scroll to "Feedback, Bug Reports & Issues" in Settings.',
            { title: 'Select a category', desc: 'Click one of the pill buttons: Bug, Technical Issue, Feature Request, Question, or Other.' },
            { title: 'Set severity', desc: 'Choose Low, Medium, High, or Critical. Use Critical only for issues that completely block work.' },
            { title: 'Identify the page or feature', desc: 'Enter which section of the platform the issue is in (e.g. "AI Rounds," "Case Review").' },
            { title: 'Write a clear title', desc: 'Keep it to one sentence summarizing the issue.' },
            { title: 'Write a detailed description', desc: 'Explain what happened, what you expected to happen, and what actually occurred.' },
            { title: 'Add steps to reproduce (bugs only)', desc: 'If reporting a bug or technical issue, a "Steps to Reproduce" field appears. Number each step clearly.' },
            { title: 'Click "Submit Feedback"', desc: 'Your report is sent directly to the support team with your identity and timestamp auto-attached.' },
          ]} />
        </SubSection>
        <Callout type="success">
          Your name and email are automatically included in every feedback submission so the support team can follow up with you directly.
        </Callout>
      </div>

      {/* Notifications & Privacy */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm">Notifications & Privacy</h3>
            <p className="text-xs text-muted-foreground">Manage alerts and HIPAA-compliant data handling preferences</p>
          </div>
        </div>
        <SubSection title="Notification Toggles">
          <div className="space-y-2">
            {[
              ['AI recommendation alerts', 'Notify when an AI recommendation is generated'],
              ['Case status changes', 'Notify when a case moves from one status to another'],
              ['Payer response notifications', 'Notify when a payer responds to a submitted case'],
            ].map(([t, d], i) => (
              <div key={i} className="flex gap-2 text-xs bg-muted/30 rounded-lg px-3 py-2">
                <span className="font-semibold text-foreground w-52 flex-shrink-0">{t}</span>
                <span className="text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title="Privacy & Compliance Toggles">
          <div className="space-y-2">
            {[
              ['Auto-delete voice recordings', 'Voice recordings used for dictation are deleted immediately after processing — never stored'],
              ['Encrypt uploaded documents', 'All files uploaded to the platform are stored with encryption at rest'],
            ].map(([t, d], i) => (
              <div key={i} className="flex gap-2 text-xs bg-muted/30 rounded-lg px-3 py-2">
                <span className="font-semibold text-foreground w-52 flex-shrink-0">{t}</span>
                <span className="text-muted-foreground">{d}</span>
              </div>
            ))}
          </div>
        </SubSection>
        <Callout type="warning">
          Both Privacy toggles are enabled by default and <strong>should remain on</strong> to maintain HIPAA compliance. Only disable them if explicitly directed by your HIS administrator.
        </Callout>
      </div>
    </div>
  );
}