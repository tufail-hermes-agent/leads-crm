'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { LEAD_STATUSES, statusInfo, type LeadStatus } from '@/lib/lead-status';

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  locality: string | null;
  city: string | null;
  pincode: string | null;
  source: string | null;
  status: string;
  createdAt: Date;
};

export function LeadsTable({ leads, pipelineId }: { leads: Lead[]; pipelineId: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<string>('contacted');
  const [busy, setBusy] = useState(false);

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((s) => (s.size === leads.length ? new Set() : new Set(leads.map((l) => l.id))));
  }

  async function applyBulk(action: 'status' | 'delete') {
    const ids = Array.from(selected);
    if (!ids.length) return;
    setBusy(true);
    const res = await fetch('/api/leads/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids, status: action === 'status' ? bulkStatus : undefined })
    });
    setBusy(false);
    if (res.ok) {
      toast.success(`Updated ${ids.length} lead(s)`);
      setSelected(new Set());
      setBulkOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Bulk action failed');
    }
  }

  if (leads.length === 0) {
    return (
      <div className='rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center'>
        <p className='text-sm text-zinc-400'>No leads match these filters yet.</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {selected.size > 0 && (
        <div className='flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/40 px-4 py-2'>
          <p className='text-sm'>
            <span className='font-medium'>{selected.size}</span> selected
          </p>
          <div className='flex items-center gap-2'>
            <Button size='sm' variant='secondary' onClick={() => setBulkOpen(true)}>
              Change status
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => {
                if (confirm(`Delete ${selected.size} lead(s)?`)) applyBulk('delete');
              }}
            >
              Delete
            </Button>
            <Button size='sm' variant='ghost' onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className='overflow-x-auto rounded-lg border border-zinc-800'>
        <table className='w-full text-sm'>
          <thead className='bg-zinc-900/50 text-left text-xs uppercase tracking-wider text-zinc-400'>
            <tr>
              <th className='w-10 px-3 py-2.5'>
                <Checkbox
                  checked={selected.size === leads.length && leads.length > 0}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className='px-3 py-2.5'>Name</th>
              <th className='px-3 py-2.5'>Phone</th>
              <th className='px-3 py-2.5'>Locality</th>
              <th className='px-3 py-2.5'>Source</th>
              <th className='px-3 py-2.5'>Status</th>
              <th className='px-3 py-2.5 text-right'>Open</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-zinc-800'>
            {leads.map((l) => {
              const s = statusInfo(l.status);
              return (
                <tr key={l.id} className='hover:bg-zinc-900/30'>
                  <td className='px-3 py-2'>
                    <Checkbox checked={selected.has(l.id)} onCheckedChange={() => toggle(l.id)} />
                  </td>
                  <td className='px-3 py-2 font-medium'>{l.name}</td>
                  <td className='px-3 py-2 text-zinc-300'>
                    {l.phone ? (
                      <a href={`tel:${l.phone}`} className='hover:underline'>
                        {l.phone}
                      </a>
                    ) : (
                      <span className='text-zinc-600'>—</span>
                    )}
                  </td>
                  <td className='px-3 py-2 text-zinc-400'>{l.locality ?? '—'}</td>
                  <td className='px-3 py-2 text-zinc-500'>{l.source ?? '—'}</td>
                  <td className='px-3 py-2'>
                    <Badge variant='outline' className={s.color}>
                      {s.label}
                    </Badge>
                  </td>
                  <td className='px-3 py-2 text-right'>
                    <Link
                      href={`/dashboard/leads/${l.id}`}
                      className='inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-100'
                    >
                      Open <ExternalLink className='h-3 w-3' />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change status for {selected.size} lead(s)</DialogTitle>
            <DialogDescription>
              This will also log a status-change activity for each lead.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-2'>
            <Select value={bulkStatus} onValueChange={(v) => v && setBulkStatus(v)}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setBulkOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={() => applyBulk('status')} disabled={busy}>
              {busy ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
