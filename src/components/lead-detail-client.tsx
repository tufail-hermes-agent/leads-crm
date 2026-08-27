'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Trash2, Save, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LEAD_STATUSES, statusInfo } from '@/lib/lead-status';

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
  sourceUrl: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

type Activity = { id: string; type: string; content: string; createdAt: string };

export function LeadDetailClient({
  lead: initial,
  pipelineName,
  pipelineColor,
  activities: initialActivities
}: {
  lead: Lead;
  pipelineName: string;
  pipelineColor: string;
  activities: Activity[];
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initial);
  const [activities, setActivities] = useState(initialActivities);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState('');

  async function save(updates: Partial<Lead>) {
    setSaving(true);
    const res = await fetch(`/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setLead((l) => ({ ...l, ...updated }));
      // refresh activity log
      const aRes = await fetch(`/api/leads/${lead.id}`);
      if (aRes.ok) {
        const aData = await aRes.json();
        setActivities(
          aData.activities.map(
            (a: { id: string; type: string; content: string; createdAt: string }) => a
          )
        );
      }
      toast.success('Saved');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Save failed');
    }
  }

  async function addActivity() {
    if (!newNote.trim()) return;
    const content = newNote.trim();
    setNewNote('');
    const res = await fetch(`/api/leads/${lead.id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'note', content })
    });
    if (res.ok) {
      const a = await res.json();
      setActivities((arr) => [
        { id: a.id, type: a.type, content: a.content, createdAt: a.createdAt },
        ...arr
      ]);
      toast.success('Note added');
    } else {
      toast.error('Failed to add note');
    }
  }

  async function del() {
    if (!confirm(`Delete lead "${lead.name}"?`)) return;
    const res = await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      router.back();
    } else {
      toast.error('Delete failed');
    }
  }

  const s = statusInfo(lead.status);

  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      <div className='space-y-6 lg:col-span-2'>
        <div className='rounded-2xl border border-border bg-card p-6 shadow-sm'>
          <div className='flex items-start justify-between'>
            <div>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <Building2 className='h-3 w-3' />
                {pipelineName}
              </div>
              <h1 className='mt-1 text-2xl font-semibold tracking-tight text-foreground'>
                {lead.name}
              </h1>
              <div className='mt-2 flex items-center gap-2'>
                <Badge variant='outline' className={s.color}>
                  {s.label}
                </Badge>
                {lead.source && (
                  <span className='text-xs text-muted-foreground'>via {lead.source}</span>
                )}
              </div>
            </div>
            <Button variant='destructive' size='sm' onClick={del}>
              <Trash2 className='h-4 w-4' />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Details</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-2 gap-3'>
            <div className='col-span-2 space-y-1.5'>
              <Label>Status</Label>
              <Select value={lead.status} onValueChange={(v) => v && save({ status: v })}>
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
            <div className='space-y-1.5'>
              <Label>Phone</Label>
              <Input
                value={lead.phone ?? ''}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                onBlur={() => save({ phone: lead.phone })}
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Email</Label>
              <Input
                value={lead.email ?? ''}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                onBlur={() => save({ email: lead.email })}
              />
            </div>
            <div className='col-span-2 space-y-1.5'>
              <Label>Address</Label>
              <Input
                value={lead.address ?? ''}
                onChange={(e) => setLead({ ...lead, address: e.target.value })}
                onBlur={() => save({ address: lead.address })}
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Locality</Label>
              <Input
                value={lead.locality ?? ''}
                onChange={(e) => setLead({ ...lead, locality: e.target.value })}
                onBlur={() => save({ locality: lead.locality })}
              />
            </div>
            <div className='space-y-1.5'>
              <Label>City</Label>
              <Input
                value={lead.city ?? ''}
                onChange={(e) => setLead({ ...lead, city: e.target.value })}
                onBlur={() => save({ city: lead.city })}
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Pincode</Label>
              <Input
                value={lead.pincode ?? ''}
                onChange={(e) => setLead({ ...lead, pincode: e.target.value })}
                onBlur={() => save({ pincode: lead.pincode })}
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Source</Label>
              <Input
                value={lead.source ?? ''}
                onChange={(e) => setLead({ ...lead, source: e.target.value })}
                onBlur={() => save({ source: lead.source })}
              />
            </div>
            <div className='col-span-2 space-y-1.5'>
              <Label>Notes</Label>
              <Textarea
                rows={4}
                value={lead.notes ?? ''}
                onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                onBlur={() => save({ notes: lead.notes })}
              />
            </div>
            {saving && (
              <div className='col-span-2 flex items-center gap-2 text-xs text-muted-foreground'>
                <Loader2 className='h-3 w-3 animate-spin' /> Saving…
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 text-sm'>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className='flex items-center gap-2 text-foreground hover:text-primary'
              >
                <Phone className='h-4 w-4' /> {lead.phone}
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className='flex items-center gap-2 text-foreground hover:text-primary'
              >
                <Mail className='h-4 w-4' /> {lead.email}
              </a>
            )}
            {lead.address && (
              <p className='flex items-start gap-2 text-muted-foreground'>
                <MapPin className='mt-0.5 h-4 w-4 shrink-0' />
                <span>
                  {lead.address}
                  {lead.locality && `, ${lead.locality}`}
                  {lead.city && `, ${lead.city}`}
                  {lead.pincode && ` - ${lead.pincode}`}
                </span>
              </p>
            )}
            <p className='text-xs text-muted-foreground'>
              Created {new Date(lead.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Activity</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-start gap-2'>
              <Textarea
                rows={2}
                placeholder='Add a note…'
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
            <Button onClick={addActivity} disabled={!newNote.trim()} size='sm' className='w-full'>
              Add note
            </Button>
            <ul className='space-y-3 border-t border-border pt-3'>
              {activities.length === 0 && (
                <p className='text-xs text-muted-foreground'>No activity yet.</p>
              )}
              {activities.map((a) => (
                <li key={a.id} className='text-xs'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <span className='capitalize'>{a.type.replace('_', ' ')}</span>
                    <span>·</span>
                    <span>{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                  <p className='mt-0.5 text-foreground'>{a.content}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
