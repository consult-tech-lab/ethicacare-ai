import React, { useState, useEffect } from 'react';
import { Shield, Bell, Lock, Download, Mail, MessageSquare } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import BIExportTool from '@/components/tools/BIExportTool';
import SecureEmailTool from '@/components/tools/SecureEmailTool';
import FeedbackTool from '@/components/tools/FeedbackTool';

const Section = ({ icon: Icon, title, description, children, accent }) => (
  <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
    <div className="flex items-start gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent || 'bg-primary/10'}`}>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h3 className="font-heading font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings & Tools</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform preferences, data export, secure messaging, and feedback</p>
      </div>

      {/* BI Export */}
      <Section
        icon={Download}
        title="BI Data Export"
        description="Export platform data as CSV for Power BI, Excel, Tableau, and other BI tools"
      >
        <BIExportTool />
      </Section>

      {/* Secure Email */}
      <Section
        icon={Mail}
        title="Secure Internal Messaging"
        description="Send encrypted platform messages to HIS Management, Compliance, or Audit teams"
      >
        <SecureEmailTool currentUser={currentUser} />
      </Section>

      {/* Feedback */}
      <Section
        icon={MessageSquare}
        title="Feedback, Bug Reports & Issues"
        description="Report bugs, technical errors, or platform issues directly to the support team"
      >
        <FeedbackTool currentUser={currentUser} />
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications" description="Manage how you receive alerts">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">AI recommendation alerts</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Case status changes</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Payer response notifications</Label>
            <Switch defaultChecked />
          </div>
        </div>
      </Section>

      {/* Privacy */}
      <Section icon={Lock} title="Privacy & Compliance" description="HIPAA and data handling settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Auto-delete voice recordings after processing</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Encrypt all uploaded documents</Label>
            <Switch defaultChecked />
          </div>
        </div>
      </Section>

      <p className="text-xs text-muted-foreground text-center pt-4">
        EthicaCare AI · HIS Auditor & Contractor Platform · © 2026
      </p>
    </div>
  );
}