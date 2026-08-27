export const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20' },
  {
    value: 'contacted',
    label: 'Contacted',
    color: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
  },
  {
    value: 'interested',
    label: 'Interested',
    color: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
  },
  {
    value: 'trial',
    label: 'Trial',
    color: 'bg-violet-500/10 text-violet-300 border-violet-500/20'
  },
  { value: 'won', label: 'Won', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  { value: 'lost', label: 'Lost', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' }
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]['value'];

export function statusInfo(s: string) {
  return LEAD_STATUSES.find((x) => x.value === s) ?? LEAD_STATUSES[0];
}
