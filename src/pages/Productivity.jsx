import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import MyProductivity from '@/components/productivity/MyProductivity';
import AdminProductivity from '@/components/productivity/AdminProductivity';

export default function Productivity() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isAdmin = user?.role === 'admin';

  const { data: cases = [] } = useQuery({
    queryKey: ['cases'],
    queryFn: () => base44.entities.PatientCase.list('-created_date', 200),
  });

  const completedCases = cases.filter(c => c.status === 'approved' || c.status === 'denied');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Productivity</h1>
        <p className="text-sm text-muted-foreground mt-1">Track completed case reviews and performance metrics</p>
      </div>

      {/* Completed Cases Section */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <h2 className="font-heading font-semibold text-sm">Completed Cases</h2>
            <span className="text-[10px] bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-full">{completedCases.length}</span>
          </div>
        </div>
        {completedCases.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No completed (approved or denied) cases yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">MRN</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Insurance</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Dx</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outcome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {completedCases.map(c => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground text-xs">{c.patient_name || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{c.mrn || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{c.insurance || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[180px] truncate">{c.primary_dx || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${c.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {c.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {c.status === 'approved' ? 'Approved' : 'Denied'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {c.updated_date ? format(parseISO(c.updated_date), 'MMM d, yyyy') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin ? (
        <Tabs defaultValue="my">
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="my" className="rounded-lg text-sm">My Performance</TabsTrigger>
            <TabsTrigger value="admin" className="rounded-lg text-sm flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              Team Overview
              <span className="ml-1 text-[10px] bg-primary/20 text-primary rounded px-1.5 py-0.5 font-semibold">Admin</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my" className="mt-6">
            <MyProductivity userEmail={user?.email} />
          </TabsContent>
          <TabsContent value="admin" className="mt-6">
            <AdminProductivity />
          </TabsContent>
        </Tabs>
      ) : (
        <MyProductivity userEmail={user?.email} />
      )}
    </div>
  );
}