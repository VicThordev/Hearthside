import { useState, type FormEvent } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';

type ResetPasswordViewProps = { onComplete: () => void };

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-hidden focus:border-[#00685f]';

export function ResetPasswordView({ onComplete }: ResetPasswordViewProps) {
  const { user, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(null);
    if (password !== confirmation) { setError('The two passwords do not match.'); return; }
    setSaving(true);
    try {
      await updatePassword(password);
      onComplete();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update your password.'); }
    finally { setSaving(false); }
  };

  return <main className="min-h-screen grid place-items-center bg-[#F0F6FA] px-4">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-xl space-y-5">
      <div className="w-12 h-12 rounded-2xl grid place-items-center bg-[#00685f] text-white"><Heart className="w-6 h-6 fill-current" /></div>
      <div><h1 className="text-2xl font-bold text-slate-900">Choose a new password</h1><p className="mt-1 text-sm text-slate-600">{user?.email ?? 'This reset link is no longer valid. Request a new one from the sign-in page.'}</p></div>
      <label className="block text-sm font-semibold text-slate-800">New password
        <input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
      </label>
      <label className="block text-sm font-semibold text-slate-800">Confirm new password
        <input required type="password" minLength={8} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={inputClass} />
      </label>
      {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      <button disabled={saving || !user} className="w-full rounded-xl bg-[#00685f] px-4 py-3 font-semibold text-white disabled:opacity-60">
        {saving ? 'Saving…' : 'Save new password'}
      </button>
    </form>
  </main>;
}
