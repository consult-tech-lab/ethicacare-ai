import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Users, ArrowRight, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground' },
  in_review: { label: 'In Review', color: 'bg-chart-3/10 text-chart-3' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  denied: { label: 'Denied', color: 'bg-destructive/10 text-destructive' },
  pending_info: { label: 'Pending', color: 'bg-primary/10 text-primary' },
};

export default function CaseLibrary() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => base44.entities.PatientCase.list('-created_date', 100),
  });

  const filtered = cases.filter(c => {
    const matchesSearch = !search || 
      c.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.mrn?.includes(search);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Case Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{cases.length} total cases</p>
        </div>
        <Link to="/case/new">
          <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" /> New Case
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or MRN..."
            className="pl-10 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] rounded-xl">
            <Filter className="w-3 h-3 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
            <SelectItem value="pending_info">Pending Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No cases found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(c => (
              <Link
                key={c.id}
                to={`/case/${c.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{c.patient_name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">MRN: {c.mrn} · {c.primary_dx || 'No Dx'} · {c.insurance || 'No insurance'}</p>
                </div>
                <Badge className={`${statusConfig[c.status]?.color || statusConfig.draft.color} border-0 text-[11px]`}>
                  {statusConfig[c.status]?.label || 'Draft'}
                </Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}