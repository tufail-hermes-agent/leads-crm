'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AddLeadDialog } from '@/components/add-lead-dialog';
import { LEAD_STATUSES } from '@/lib/lead-status';

export function LeadFilters({
  pipelineId,
  localities,
  statusCounts
}: {
  pipelineId: string;
  localities: string[];
  statusCounts: { status: string; _count: number }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(sp);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update('q', q || null);
        }}
        className='flex items-center gap-2'
      >
        <div className='relative'>
          <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500' />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search name, phone, address…'
            className='w-64 pl-8'
          />
        </div>
        <Button type='submit' variant='secondary'>
          Search
        </Button>
      </form>

      <Select value={sp.get('status') ?? 'all'} onValueChange={(v) => update('status', v)}>
        <SelectTrigger className='w-44'>
          <SelectValue placeholder='All statuses' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All statuses</SelectItem>
          {LEAD_STATUSES.map((s) => {
            const c = statusCounts.find((x) => x.status === s.value)?._count ?? 0;
            return (
              <SelectItem key={s.value} value={s.value}>
                {s.label} ({c})
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {localities.length > 0 && (
        <Select value={sp.get('locality') ?? 'all'} onValueChange={(v) => update('locality', v)}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='All localities' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All localities</SelectItem>
            {localities.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className='ml-auto flex items-center gap-2'>
        <AddLeadDialog pipelineId={pipelineId} />
      </div>
    </div>
  );
}
