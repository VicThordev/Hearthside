import { useState, type FormEvent } from 'react';
import { History, KeyRound, LogOut, UserRound, Users } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { api, type AuditEvent } from '../api';
import { Button, Card, confirmAction, ErrorNote, Field, formatDateTime, inputClass, Loading, PageHeader, useAction, useLoad, usePortal } from '../ui';

const timezones = (() => { try { return Intl.supportedValuesOf('timeZone'); } catch { return []; } })();

export default function SettingsView({ onLeftCircle, onSignOut }: { onLeftCircle: () => void; onSignOut: () => void }) {
  const { can } = usePortal();
  return <div className="space-y-6">
    <PageHeader title="Settings" description="Your profile, sign-in, and Care Circle details." />
    <ProfileCard />
    <PasswordCard />
    {can('circle:manage') && <CircleCard />}
    {can('audit:read') && <ActivityCard />}
    <LeaveCard onLeft={onLeftCircle} onSignOut={onSignOut} />
  </div>;
}

function ProfileCard() {
  const { info, reloadCircle } = usePortal();
  const { busy, run } = useAction();
  const [name, setName] = useState(info.me.display_name);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await run(() => api.updateMyProfile(name), 'Profile updated.')) reloadCircle();
  };
  return <Card>
    <h2 className="flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-[#00685f]" />Your profile</h2>
    <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
      <Field label="Name shown to the care team" hint={`Signed in as ${info.me.email}`}><input required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></Field>
      <Button type="submit" busy={busy} disabled={name.trim() === info.me.display_name}>Save</Button>
    </form>
  </Card>;
}

function PasswordCard() {
  const { updatePassword } = useAuth();
  const { busy, run } = useAction();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setProblem(null);
    if (password !== confirmation) { setProblem('The two passwords do not match.'); return; }
    if (await run(() => updatePassword(password), 'Password changed.')) { setPassword(''); setConfirmation(''); }
  };
  return <Card>
    <h2 className="flex items-center gap-2 font-semibold"><KeyRound className="h-4 w-4 text-[#00685f]" />Change password</h2>
    <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <Field label="New password"><input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} /></Field>
      <Field label="Confirm"><input required type="password" minLength={8} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={inputClass} /></Field>
      <Button type="submit" busy={busy}>Update</Button>
    </form>
    {problem && <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{problem}</p>}
  </Card>;
}

function CircleCard() {
  const { info, reloadCircle } = usePortal();
  const { busy, run } = useAction();
  const [form, setForm] = useState({ name: info.circle.name, recipientName: info.recipient?.display_name ?? '', timezone: info.circle.timezone });
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await run(() => api.updateCircle({ name: form.name, recipientName: form.recipientName || undefined, timezone: form.timezone }), 'Care Circle updated.')) reloadCircle();
  };
  return <Card>
    <h2 className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4 text-[#00685f]" />Care Circle</h2>
    <form onSubmit={submit} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Circle name"><input required maxLength={160} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} /></Field>
        <Field label="Person receiving care"><input required maxLength={160} value={form.recipientName} onChange={(event) => setForm({ ...form, recipientName: event.target.value })} className={inputClass} /></Field>
      </div>
      <Field label="Time zone"><select value={form.timezone} onChange={(event) => setForm({ ...form, timezone: event.target.value })} className={inputClass}>
        {(timezones.includes(form.timezone) ? timezones : [form.timezone, ...timezones]).map((zone) => <option key={zone} value={zone}>{zone.replace(/_/g, ' ')}</option>)}
      </select></Field>
      <div className="flex justify-end"><Button type="submit" busy={busy}>Save changes</Button></div>
    </form>
  </Card>;
}

const actionLabels: Record<string, string> = {
  insert: 'added', update: 'changed', delete: 'deleted', download_url_issued: 'opened', role_changed: 'changed the role of',
  member_removed: 'removed', member_left: 'left', invite_created: 'invited someone as', invite_revoked: 'cancelled an invitation', invite_accepted: 'joined the circle as',
};
const resourceLabels: Record<string, string> = {
  care_events: 'an event', care_notes: 'a care note', documents: 'a document', document: 'a document', tasks: 'a task',
  circle_members: 'a member', circle_invites: '', care_circles: 'the Care Circle details',
};
function describe(event: AuditEvent) {
  const who = event.actor_name ?? 'Someone';
  const role = typeof event.metadata?.role === 'string' ? event.metadata.role.replace('_', ' ') : '';
  if (event.action === 'invite_created' || event.action === 'invite_accepted') return `${who} ${actionLabels[event.action]} ${role}`;
  if (event.action === 'member_left') return `${who} left the Care Circle`;
  return `${who} ${actionLabels[event.action] ?? event.action} ${resourceLabels[event.resource_type] ?? event.resource_type}`.trim();
}

function ActivityCard() {
  const activity = useLoad(api.audit);
  return <Card>
    <h2 className="flex items-center gap-2 font-semibold"><History className="h-4 w-4 text-[#00685f]" />Activity log</h2>
    <p className="mt-1 text-sm text-[#64748B]">The latest 200 changes and document views in this Care Circle. Entries cannot be edited or deleted.</p>
    {activity.loading ? <Loading /> : activity.error ? <ErrorNote message={activity.error} onRetry={activity.reload} /> : !activity.data?.length
      ? <p className="mt-3 text-sm text-[#64748B]">No activity yet.</p>
      : <ul className="mt-3 max-h-96 divide-y divide-[#F1F5F9] overflow-y-auto">{activity.data.map((event) => <li key={event.id} className="flex flex-wrap justify-between gap-x-4 py-2 text-sm">
        <span>{describe(event)}</span><span className="text-xs text-[#64748B]">{formatDateTime(event.created_at)}</span>
      </li>)}</ul>}
  </Card>;
}

function LeaveCard({ onLeft, onSignOut }: { onLeft: () => void; onSignOut: () => void }) {
  const { info } = usePortal();
  const { busy, run } = useAction();
  const leave = async () => {
    if (!confirmAction(`Leave ${info.circle.name}? You will lose access until someone invites you again.`)) return;
    if (await run(() => api.leaveCircle(), `You left ${info.circle.name}.`)) onLeft();
  };
  return <Card>
    <h2 className="font-semibold">Account</h2>
    <div className="mt-3 flex flex-wrap gap-2">
      <Button variant="secondary" icon={<LogOut className="h-4 w-4" />} onClick={onSignOut}>Sign out</Button>
      <Button variant="danger" busy={busy} onClick={() => void leave()}>Leave this Care Circle</Button>
    </div>
  </Card>;
}
