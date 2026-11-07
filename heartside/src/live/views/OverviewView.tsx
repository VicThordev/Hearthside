import { AlertTriangle, Calendar, CheckCircle2, FileText, NotebookPen } from 'lucide-react';
import { api, type CareNote, type StoredDocument } from '../api';
import type { LiveView } from '../LivePortal';
import { Badge, Card, ErrorNote, formatDateTime, formatRelative, Loading, useLoad, usePortal } from '../ui';

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
}

export default function OverviewView({ onNavigate }: { onNavigate: (view: LiveView) => void }) {
  const { info, can } = usePortal();
  const events = useLoad(api.events);
  const tasks = useLoad(api.tasks);
  const notes = useLoad<CareNote[]>(() => can('note:read') ? api.notes() : Promise.resolve([]));
  const documents = useLoad<StoredDocument[]>(() => can('document:read') ? api.documents() : Promise.resolve([]));

  const now = Date.now();
  const upcoming = (events.data ?? []).filter((event) => Date.parse(event.ends_at ?? event.starts_at) >= now).slice(0, 5);
  const openTasks = (tasks.data ?? []).filter((task) => task.status === 'open' || task.status === 'in_progress');
  const myTasks = openTasks.filter((task) => task.assigned_member_id === info.me.id);
  const overdue = openTasks.filter((task) => task.due_at && Date.parse(task.due_at) < now);
  const criticalNotes = (notes.data ?? []).filter((note) => note.is_critical && now - Date.parse(note.created_at) < 7 * 86400_000);
  const firstName = info.me.display_name.split(/[\s@]/)[0];

  return <div className="space-y-6">
    <div className="rounded-2xl bg-gradient-to-br from-[#00685f] to-[#0b7f74] p-6 text-white shadow-sm">
      <p className="text-sm text-white/80">{info.circle.name}</p>
      <h1 className="mt-1 font-display text-2xl font-bold">{greeting()}, {firstName}</h1>
      <p className="mt-2 text-sm text-white/85">{info.recipient ? `Here is what's happening in ${info.recipient.display_name}'s care.` : "Here is what's happening in your Care Circle."}</p>
    </div>

    {criticalNotes.length > 0 && <button type="button" onClick={() => onNavigate('notes')} className="flex w-full items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-left text-sm text-rose-900">
      <AlertTriangle className="h-5 w-5 shrink-0" /><span><strong>{criticalNotes.length} critical update{criticalNotes.length > 1 ? 's' : ''}</strong> this week. Latest: {criticalNotes[0]!.title}</span>
    </button>}

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'Upcoming', value: upcoming.length, icon: Calendar, view: 'schedule' as const },
        { label: 'Open tasks', value: openTasks.length, icon: CheckCircle2, view: 'tasks' as const },
        { label: 'Overdue', value: overdue.length, icon: AlertTriangle, view: 'tasks' as const },
        ...(can('document:read') ? [{ label: 'Documents', value: documents.data?.length ?? 0, icon: FileText, view: 'documents' as const }] : []),
      ].map(({ label, value, icon: Icon, view }) => <button key={label} type="button" onClick={() => onNavigate(view)} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-left shadow-xs hover:border-[#00685f]/40">
        <Icon className="h-4 w-4 text-[#00685f]" /><p className="mt-2 text-2xl font-bold">{value}</p><p className="text-xs text-[#64748B]">{label}</p>
      </button>)}
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Coming up</h2><button type="button" className="text-sm font-semibold text-[#00685f]" onClick={() => onNavigate('schedule')}>Open schedule</button></div>
        {events.loading ? <Loading /> : events.error ? <ErrorNote message={events.error} onRetry={events.reload} /> : upcoming.length === 0
          ? <p className="text-sm text-[#64748B]">Nothing scheduled. Add appointments, visits, and rides in the schedule.</p>
          : <ul className="divide-y divide-[#F1F5F9]">{upcoming.map((event) => <li key={event.id} className="py-2.5"><p className="text-sm font-semibold">{event.title}</p><p className="text-xs text-[#64748B]">{formatDateTime(event.starts_at)}{event.assignee_name ? ` · ${event.assignee_name}` : ''}</p></li>)}</ul>}
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{myTasks.length ? 'Your tasks' : 'Open tasks'}</h2><button type="button" className="text-sm font-semibold text-[#00685f]" onClick={() => onNavigate('tasks')}>All tasks</button></div>
        {tasks.loading ? <Loading /> : tasks.error ? <ErrorNote message={tasks.error} onRetry={tasks.reload} /> : (myTasks.length ? myTasks : openTasks).length === 0
          ? <p className="text-sm text-[#64748B]">No open tasks.</p>
          : <ul className="divide-y divide-[#F1F5F9]">{(myTasks.length ? myTasks : openTasks).slice(0, 5).map((task) => <li key={task.id} className="flex items-center justify-between gap-3 py-2.5">
            <span className="min-w-0"><span className="block truncate text-sm font-semibold">{task.title}</span><span className="text-xs text-[#64748B]">{task.due_at ? `Due ${formatRelative(task.due_at)}` : 'No due date'}{task.assignee ? ` · ${task.assignee.display_name}` : ''}</span></span>
            {task.due_at && Date.parse(task.due_at) < now && <Badge tone="rose">Overdue</Badge>}
          </li>)}</ul>}
      </Card>

      {can('note:read') && <Card className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold"><NotebookPen className="h-4 w-4 text-[#00685f]" />Recent care notes</h2><button type="button" className="text-sm font-semibold text-[#00685f]" onClick={() => onNavigate('notes')}>All notes</button></div>
        {notes.loading ? <Loading /> : notes.error ? <ErrorNote message={notes.error} onRetry={notes.reload} /> : !notes.data?.length
          ? <p className="text-sm text-[#64748B]">No notes yet. Share updates after visits, calls, or appointments.</p>
          : <ul className="space-y-3">{notes.data.slice(0, 3).map((note) => <li key={note.id} className="rounded-xl bg-[#F8FBFF] p-3">
            <p className="text-sm font-semibold">{note.title} {note.is_critical && <Badge tone="rose">Critical</Badge>}</p>
            <p className="mt-0.5 line-clamp-2 text-sm text-[#475569]">{note.content}</p>
            <p className="mt-1 text-xs text-[#64748B]">{note.author?.display_name ?? 'Former member'} · {formatRelative(note.created_at)}</p>
          </li>)}</ul>}
      </Card>}
    </div>
  </div>;
}
