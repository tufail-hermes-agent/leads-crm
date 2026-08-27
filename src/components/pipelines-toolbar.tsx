'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
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

const COLORS = ['blue', 'orange', 'green', 'purple', 'pink', 'yellow'] as const;

export function PipelinesToolbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string>('blue');
  const [loading, setLoading] = useState(false);

  function reset() {
    setName('');
    setDescription('');
    setColor('blue');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch('/api/pipelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim() || undefined,
        color
      })
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Pipeline created');
      setOpen(false);
      reset();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Failed to create pipeline');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className='h-4 w-4' />
            New pipeline
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New pipeline</DialogTitle>
          <DialogDescription>
            Group leads by business, region, or any way you like.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. Bangalore Gyms'
              disabled={loading}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='desc'>Description (optional)</Label>
            <Textarea
              id='desc'
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='What is this pipeline for?'
              disabled={loading}
            />
          </div>
          <div className='space-y-2'>
            <Label>Color</Label>
            <Select value={color} onValueChange={(v) => v && setColor(v)}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLORS.map((c) => (
                  <SelectItem key={c} value={c}>
                    <span className='capitalize'>{c}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type='button' variant='ghost' onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' disabled={loading || !name.trim()}>
              {loading ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
