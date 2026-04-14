import React from 'react';
import { Shield, Bell, Lock, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Section = ({ icon: Icon, title, description, children }) => (
  <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
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
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your UM platform preferences</p>
      </div>

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
        EthicaCareAI Case Manager · © 2026 by Joanna L.
      </p>
    </div>
  );
}