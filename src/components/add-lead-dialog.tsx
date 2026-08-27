'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Loader2, Phone, MapPin, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LEAD_STATUSES } from '@/lib/lead-status';

export function AddLeadDialog({ pipelineId }: { pipelineId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    locality: '',
    city: 'Belagavi',
    pincode: '',
    source: '',
    status: 'new',
    notes: ''
  });

  function up<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pipelineId,
        name: form.name.trim(),
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
        locality: form.locality || null,
        city: form.city || null,
        pincode: form.pincode || null,
        source: form.source || null,
        status: form.status,
        notes: form.notes || null
      })
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Lead added');
      setOpen(false);
      setForm({
        ...form,
        name: '',
        phone: '',
        email: '',
        address: '',
        locality: '',
        pincode: '',
        source: '',
        notes: ''
      });
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Failed');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className='h-4 w-4' />
            Add lead
          </Button>
        }
      />
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Add lead</DialogTitle>
          <DialogDescription>Fill in any fields you have. Only name is required.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className='grid grid-cols-2 gap-3'>
          <div className='col-span-2 space-y-1.5'>
            <Label htmlFor='l-name'>Name *</Label>
            <Input
              id='l-name'
              required
              value={form.name}
              onChange={(e) => up('name', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='l-phone'>Phone</Label>
            <Input
              id='l-phone'
              value={form.phone}
              onChange={(e) => up('phone', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='l-email'>Email</Label>
            <Input
              id='l-email'
              type='email'
              value={form.email}
              onChange={(e) => up('email', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='col-span-2 space-y-1.5'>
            <Label htmlFor='l-addr'>Address</Label>
            <Input
              id='l-addr'
              value={form.address}
              onChange={(e) => up('address', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='l-loc'>Locality</Label>
            <Input
              id='l-loc'
              value={form.locality}
              onChange={(e) => up('locality', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='l-city'>City</Label>
            <Input
              id='l-city'
              value={form.city}
              onChange={(e) => up('city', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='l-pin'>Pincode</Label>
            <Input
              id='l-pin'
              value={form.pincode}
              onChange={(e) => up('pincode', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='l-src'>Source</Label>
            <Input
              id='l-src'
              value={form.source}
              onChange={(e) => up('source', e.target.value)}
              placeholder='Justdial, Google Maps…'
              disabled={loading}
            />
          </div>
          <div className='col-span-2 space-y-1.5'>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => v && up('status', v)}>
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
          <div className='col-span-2 space-y-1.5'>
            <Label htmlFor='l-notes'>Notes</Label>
            <Textarea
              id='l-notes'
              rows={2}
              value={form.notes}
              onChange={(e) => up('notes', e.target.value)}
              disabled={loading}
            />
          </div>
          <DialogFooter className='col-span-2'>
            <Button type='button' variant='ghost' onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' disabled={loading || !form.name.trim()}>
              {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Add lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
