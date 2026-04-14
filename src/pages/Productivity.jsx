import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import MyProductivity from '@/components/productivity/MyProductivity';
import AdminProductivity from '@/components/productivity/AdminProductivity';

export default function Productivity() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Productivity</h1>
        <p className="text-sm text-muted-foreground mt-1">Track completed case reviews and performance metrics</p>
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