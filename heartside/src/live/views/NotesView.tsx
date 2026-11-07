import { useState, type FormEvent } from 'react';
import { NotebookPen, Trash2 } from 'lucide-react';
import { api, type CareNote, type NoteCategory } from '../api';
import { Avatar, Badge, Button, Card, confirmAction, EmptyState, ErrorNote, Field, formatDateTime, inputClass, Loading, PageHeader, useAction, useLoad, usePortal } from '../ui';

const noteCategories: Record<NoteCategory, string> = { medical: 'Medical', vitals: 'Medication & vitals', errands: 'Errands', social: 'Mood & social', critical: 'Critical' };

export default function NotesView() {
  const { info, can } = usePortal();
  const notes = useLoad(api.notes);
  const { run } = useAction();
  const [filter, setFilter] = useState<NoteCategory | 'all'>('all');
  const visible = (notes.data ?? []).filter((note) => filter === 'all' || note.category === filter);

  const remove = async (note: CareNote) => {
    if (!confirmAction(`Delete "${note.title}"?`)) return;
    if (await run(() => api.deleteNote(note.id), 'Note deleted.')) notes.reload();
  };

  return <div>
    <PageHeader title="Care notes" description="Updates from visits, calls, and appointments, shared with the care team." />
    {can('note:write') && <NoteComposer onSaved={notes.reload} />}

    <div className="mb-4 mt-6 flex flex-wrap gap-1.5">
      {(['all', ...Object.keys(noteCategories)] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value as NoteCategory | 'all')} className={`rounded-full border px-3 py-1 text-xs font-semibold ${filter === value ? 'border-[#00685f] bg-[#E6F4F1] text-[#00685f]' : 'border-[#CBD5E1] bg-white text-[#475569]'}`}>{value === 'all' ? 'All' : noteCategories[value as NoteCategory]}</button>)}
    </div>

    {notes.loading ? <Loading /> : notes.error ? <ErrorNote message={notes.error} onRetry={notes.reload} /> : visible.length === 0
      ? <EmptyState icon={<NotebookPen className="h-5 w-5" />} title="No notes yet">Notes you and the care team post will appear here.</EmptyState>
      : <ul className="space-y-3">{visible.map((note) => <li key={note.id} className={`rounded-2xl border bg-white p-4 shadow-xs ${note.is_critical ? 'border-rose-200' : 'border-[#E2E8F0]'}`}>
        <div className="flex items-start gap-3">
          <Avatar name={note.author?.display_name ?? '?'} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{note.title}</p><Badge tone={note.is_critical ? 'rose' : 'teal'}>{noteCategories[note.category]}</Badge>{note.is_critical && note.category !== 'critical' && <Badge tone="rose">Critical</Badge>}</div>
            <p className="text-xs text-[#64748B]">{note.author?.display_name ?? 'Former member'} · {formatDateTime(note.created_at)}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-[#334155]">{note.content}</p>
          </div>
          {can('note:write') && (note.created_by_member_id === info.me.id || can('circle:manage')) && <button type="button" aria-label={`Delete ${note.title}`} onClick={() => void remove(note)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>}
        </div>
      </li>)}</ul>}
  </div>;
}

function NoteComposer({ onSaved }: { onSaved: () => void }) {
  const { busy, run } = useAction();
  const empty = { title: '', content: '', category: 'medical' as NoteCategory, isCritical: false };
  const [form, setForm] = useState(empty);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await run(() => api.createNote(form), 'Note shared with the care team.')) { setForm(empty); onSaved(); }
  };
  return <Card>
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
        <Field label="Title"><input required maxLength={200} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. After today's physio visit" className={inputClass} /></Field>
        <Field label="Category"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as NoteCategory })} className={inputClass}>{Object.entries(noteCategories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
      </div>
      <Field label="Update"><textarea required rows={4} maxLength={10000} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="What happened, what changed, and anything the team should watch for." className={inputClass} /></Field>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-[#334155]"><input type="checkbox" checked={form.isCritical} onChange={(event) => setForm({ ...form, isCritical: event.target.checked })} className="h-4 w-4 accent-[#00685f]" />Mark as critical</label>
        <Button type="submit" busy={busy}>Post note</Button>
      </div>
    </form>
  </Card>;
}
