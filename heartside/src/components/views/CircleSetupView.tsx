import { useState, type FormEvent } from 'react';
import { Heart, LoaderCircle } from 'lucide-react';
import { apiFetch } from '../../lib/api';

type CircleSetupViewProps = { onComplete: (circleId: string) => void };

export function CircleSetupView({ onComplete }: CircleSetupViewProps) {
  const [circleName, setCircleName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(null); setSaving(true);
    try {
      const response = await apiFetch<{ data: { id: string } }>('/api/v1/circles', {
        method: 'POST', body: JSON.stringify({ name: circleName, recipientName, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
      });
      localStorage.setItem('hearthside.activeCircleId', response.data.id);
      onComplete(response.data.id);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create your care circle.'); }
    finally { setSaving(false); }
  };

  return <main className="min-h-screen grid place-items-center bg-[#F0F6FA] px-4">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-xl space-y-5">
      <div className="w-12 h-12 rounded-2xl grid place-items-center bg-[#00685f] text-white"><Heart className="w-6 h-6 fill-current" /></div>
      <div><h1 className="text-2xl font-bold text-slate-900">Create your first Care Circle</h1><p className="mt-1 text-sm text-slate-600">You can invite family and caregivers after setup.</p></div>
      <label className="block text-sm font-semibold text-slate-800">Care Circle name
        <input required maxLength={160} value={circleName} onChange={(event) => setCircleName(event.target.value)} placeholder="e.g. The Vance Family" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#00685f]" />
      </label>
      <label className="block text-sm font-semibold text-slate-800">Person receiving care
        <input required maxLength={160} value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="e.g. Eleanor Vance" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-[#00685f]" />
      </label>
      {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      <button disabled={saving} className="w-full rounded-xl bg-[#00685f] px-4 py-3 font-semibold text-white disabled:opacity-60">
        {saving ? <span className="inline-flex items-center gap-2"><LoaderCircle className="w-4 h-4 animate-spin" />Creating…</span> : 'Create Care Circle'}
      </button>
    </form>
  </main>;
}
