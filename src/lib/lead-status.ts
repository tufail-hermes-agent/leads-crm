export const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  {
    value: 'contacted',
    label: 'Contacted',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    value: 'interested',
    label: 'Interested',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    value: 'trial',
    label: 'Trial',
    color: 'bg-violet-50 text-violet-700 border-violet-200'
  },
  { value: 'won', label: 'Won', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'lost', label: 'Lost', color: 'bg-rose-50 text-rose-700 border-rose-200' }
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]['value'];

export function statusInfo(s: string) {
  return LEAD_STATUSES.find((x) => x.value === s) ?? LEAD_STATUSES[0];
}
