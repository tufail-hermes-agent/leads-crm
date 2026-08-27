'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SAMPLE = `Name,Phone,Email,Address,Locality,City,Pincode,Source,Notes
Sample Gym,+91 99999 99999,contact@samplegym.in,MG Road,Tilakwadi,Belagavi,590006,Google Maps,Has a website
Another Gym,+91 88888 88888,,Station Road,Camp,Belagavi,590010,Justdial,`;

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return { headers: [], rows: [] };
  const headers = splitCSVLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map((l) => {
    const cells = splitCSVLine(l);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (cells[i] ?? '').trim()));
    return obj;
  });
  return { headers, rows };
}

function splitCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function mapRow(row: Record<string, string>, pipelineId: string) {
  const get = (k: string) => row[k] || row[k.toLowerCase()] || row[k.toUpperCase()] || '';
  return {
    pipelineId,
    name: get('Name') || get('name') || get('Gym Name') || get('Business') || '(no name)',
    phone: get('Phone') || get('Mobile No') || get('Mobile') || get('phone') || null,
    email: get('Email') || get('email') || null,
    address: get('Address') || get('address') || null,
    locality: get('Locality') || get('locality') || null,
    city: get('City') || get('city') || null,
    pincode: get('Pincode') || get('Pin') || get('pincode') || null,
    source: get('Source') || get('source') || 'CSV import',
    notes: get('Notes') || get('notes') || null
  };
}

export function ImportClient({ pipelines }: { pipelines: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pipelineId, setPipelineId] = useState(pipelines[0]?.id ?? '');
  const [csv, setCsv] = useState(SAMPLE);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{
    headers: string[];
    rows: Record<string, string>[];
  } | null>(null);

  function onChangeText(v: string) {
    setCsv(v);
    const p = parseCSV(v);
    setPreview(p);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const txt = await f.text();
    onChangeText(txt);
  }

  async function doImport() {
    if (!pipelineId) {
      toast.error('Choose a pipeline');
      return;
    }
    const p = parseCSV(csv);
    if (!p.rows.length) {
      toast.error('No rows found');
      return;
    }
    setBusy(true);
    const leads = p.rows.map((r) => mapRow(r, pipelineId));
    const res = await fetch('/api/leads/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'import', leads })
    });
    setBusy(false);
    if (res.ok) {
      const data = await res.json();
      toast.success(`Imported ${data.count} lead(s)`);
      router.push(`/dashboard`);
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error || 'Import failed');
    }
  }

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Paste CSV</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='space-y-1.5'>
            <Label>Target pipeline</Label>
            <Select value={pipelineId} onValueChange={(v) => v && setPipelineId(v)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Choose pipeline' />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1.5'>
            <Label>CSV data</Label>
            <Textarea
              rows={14}
              value={csv}
              onChange={(e) => onChangeText(e.target.value)}
              className='font-mono text-xs'
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-sm hover:bg-zinc-800'>
              <FileText className='h-4 w-4' /> Choose file
              <input type='file' accept='.csv,text/csv' className='hidden' onChange={onFile} />
            </label>
            <Button onClick={doImport} disabled={busy || !pipelineId}>
              {busy ? <Loader2 className='h-4 w-4 animate-spin' /> : <Upload className='h-4 w-4' />}
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {preview && preview.rows.length ? (
            <div className='space-y-2'>
              <p className='text-xs text-zinc-500'>
                <Badge variant='outline' className='mr-2'>
                  {preview.rows.length} row(s)
                </Badge>
                {preview.headers.length} column(s)
              </p>
              <div className='max-h-96 overflow-auto rounded border border-zinc-800'>
                <table className='w-full text-xs'>
                  <thead className='sticky top-0 bg-zinc-900/80 text-left text-zinc-400'>
                    <tr>
                      {preview.headers.map((h) => (
                        <th key={h} className='px-2 py-1.5 font-medium'>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-zinc-800'>
                    {preview.rows.slice(0, 20).map((r, i) => (
                      <tr key={i}>
                        {preview.headers.map((h) => (
                          <td key={h} className='px-2 py-1.5 text-zinc-300'>
                            {r[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className='text-sm text-zinc-500'>Paste CSV data or load a file to preview.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
