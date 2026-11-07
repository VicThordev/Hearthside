import { useState, type FormEvent } from 'react';
import { Check, Copy, Link2, Mail, UserMinus, UserPlus, X } from 'lucide-react';
import { canAssignRole, memberRoles, roleLabels, type MemberRole } from '../../../server/permissions';
import { api, type Invite, type Member } from '../api';
import { Avatar, Badge, Button, Card, confirmAction, ErrorNote, Field, formatRelative, inputClass, Loading, PageHeader, useAction, useLoad, usePortal } from '../ui';

const roleHelp: Record<MemberRole, string> = {
  owner: 'Full control, including adding or removing other owners.',
  organizer: 'Manages the team, schedule, tasks, notes, and documents.',
  collaborator: 'Family member: schedule, tasks, and notes; can view documents.',
  clinical: 'Nurse or aide: schedule, notes, and documents.',
  restricted_helper: 'Neighbor or driver: sees the schedule and ticks off tasks only.',
};

export default function TeamView() {
  const { info, members, can, reloadCircle } = usePortal();
  const { run } = useAction();
  const manage = can('member:manage');

  const changeRole = async (member: Member, role: MemberRole) => {
    if (role === member.role) return;
    if (await run(() => api.changeRole(member.id, role), `${member.display_name} is now ${roleLabels[role].toLowerCase()}.`)) reloadCircle();
  };
  const remove = async (member: Member) => {
    if (!confirmAction(`Remove ${member.display_name} from the Care Circle? They will lose access immediately.`)) return;
    if (await run(() => api.removeMember(member.id), `${member.display_name} was removed.`)) reloadCircle();
  };

  return <div className="space-y-6">
    <PageHeader title="Care team" description={`${members.length} member${members.length === 1 ? '' : 's'} in ${info.circle.name}.`} />
    {manage && <InvitePanel />}
    <Card className="p-0">
      <ul className="divide-y divide-[#F1F5F9]">{members.map((member) => {
        const isMe = member.id === info.me.id;
        const editable = manage && !isMe && canAssignRole(info.me.role, member.role, member.role);
        return <li key={member.id} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap">
          <Avatar name={member.display_name} />
          <div className="min-w-0 flex-1"><p className="truncate font-semibold">{member.display_name}{isMe && <span className="font-normal text-[#64748B]"> (you)</span>}</p><p className="truncate text-xs text-[#64748B]">{member.email}</p></div>
          {editable
            ? <select aria-label={`Role for ${member.display_name}`} value={member.role} onChange={(event) => void changeRole(member, event.target.value as MemberRole)} className="rounded-lg border border-[#CBD5E1] bg-white px-2 py-1.5 text-sm">
              {memberRoles.filter((role) => canAssignRole(info.me.role, member.role, role)).map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}
            </select>
            : <Badge tone={member.role === 'owner' ? 'teal' : 'slate'}>{roleLabels[member.role]}</Badge>}
          {editable && <button type="button" aria-label={`Remove ${member.display_name}`} title="Remove from circle" onClick={() => void remove(member)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700"><UserMinus className="h-4 w-4" /></button>}
        </li>;
      })}</ul>
    </Card>
    <Card>
      <h2 className="mb-3 font-semibold">What each role can do</h2>
      <dl className="grid gap-3 sm:grid-cols-2">{memberRoles.map((role) => <div key={role}><dt className="text-sm font-semibold">{roleLabels[role]}</dt><dd className="text-sm text-[#64748B]">{roleHelp[role]}</dd></div>)}</dl>
    </Card>
  </div>;
}

function InvitePanel() {
  const { info } = usePortal();
  const invites = useLoad(api.invites);
  const { busy, run } = useAction();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('collaborator');
  const [created, setCreated] = useState<Invite | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    let invite: Invite | undefined;
    if (await run(async () => { invite = await api.createInvite(email, role); })) {
      setCreated(invite ?? null); setCopied(false); setEmail(''); invites.reload();
    }
  };
  const copy = async () => {
    if (!created?.link) return;
    try { await navigator.clipboard.writeText(created.link); setCopied(true); } catch { setCopied(false); }
  };
  const revoke = async (invite: Invite) => {
    if (!confirmAction(`Cancel the invitation for ${invite.email}?`)) return;
    if (await run(() => api.revokeInvite(invite.id), 'Invitation cancelled.')) { if (created?.id === invite.id) setCreated(null); invites.reload(); }
  };
  const mailto = created?.link ? `mailto:${encodeURIComponent(created.email)}?subject=${encodeURIComponent(`Join ${info.circle.name} on Hearthside`)}&body=${encodeURIComponent(`${info.me.display_name} invited you to join ${info.circle.name} on Hearthside.\n\nOpen this link and sign in or create an account with ${created.email}:\n${created.link}\n\nThe link expires in 7 days.`)}` : '';

  return <Card>
    <h2 className="flex items-center gap-2 font-semibold"><UserPlus className="h-4 w-4 text-[#00685f]" />Invite someone</h2>
    <p className="mt-1 text-sm text-[#64748B]">They must sign in with the same email address you enter here. Links expire after 7 days.</p>
    <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_220px_auto] sm:items-end">
      <Field label="Email"><input required type="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className={inputClass} /></Field>
      <Field label="Role"><select value={role} onChange={(event) => setRole(event.target.value as MemberRole)} className={inputClass}>{memberRoles.filter((value) => canAssignRole(info.me.role, null, value)).map((value) => <option key={value} value={value}>{roleLabels[value]}</option>)}</select></Field>
      <Button type="submit" busy={busy} icon={<Link2 className="h-4 w-4" />}>Create invite link</Button>
    </form>

    {created?.link && <div className="mt-4 rounded-xl border border-[#CCE8E2] bg-[#F0FDF9] p-4">
      <p className="text-sm font-semibold text-[#00685f]">Invitation ready for {created.email}</p>
      <p className="mt-1 text-xs text-[#475569]">Send this link to them yourself. For security it is shown only once.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input readOnly value={created.link} onFocus={(event) => event.target.select()} aria-label="Invitation link" className="min-w-0 flex-1 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 font-mono text-xs" />
        <Button variant="secondary" onClick={() => void copy()} icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>{copied ? 'Copied' : 'Copy'}</Button>
        <a href={mailto} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-sm font-semibold hover:bg-[#F8FAFC]"><Mail className="h-4 w-4" />Email it</a>
      </div>
    </div>}

    <div className="mt-5">
      <h3 className="text-sm font-semibold text-[#475569]">Pending invitations</h3>
      {invites.loading ? <Loading /> : invites.error ? <ErrorNote message={invites.error} onRetry={invites.reload} /> : !invites.data?.length
        ? <p className="mt-1 text-sm text-[#64748B]">None.</p>
        : <ul className="mt-2 divide-y divide-[#F1F5F9]">{invites.data.map((invite) => <li key={invite.id} className="flex items-center justify-between gap-3 py-2">
          <span className="min-w-0 text-sm"><span className="block truncate font-medium">{invite.email}</span><span className="text-xs text-[#64748B]">{roleLabels[invite.role]} · expires {formatRelative(invite.expires_at)}</span></span>
          <Button variant="ghost" onClick={() => void revoke(invite)} icon={<X className="h-4 w-4" />}>Cancel</Button>
        </li>)}</ul>}
    </div>
  </Card>;
}
