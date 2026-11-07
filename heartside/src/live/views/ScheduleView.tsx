import { useState, type FormEvent } from 'react';
import { Calendar, MapPin, Plus, Trash2, User } from 'lucide-react';
import { api, type CareEvent, type EventCategory } from '../api';
import { Badge, Button, confirmAction, EmptyState, ErrorNote, Field, formatDate, formatTime, inputClass, Loading, localInputToIso, Modal, PageHeader, useAction, useLoad, usePortal } from '../ui';

export const eventCategories: Record<EventCategory, { label: string; tone: 'teal' | 'blue' | 'amber' | 'slate' | 'rose' }> = {
  medical: { label: 'Medical', tone: 'rose' },
  vitals: { label: 'Medication & vitals', tone: 'teal' },
  transport: { label: 'Transport', tone: 'blue' },
  errands: { label: 'Errands', tone: 'amber' },
  social: { label: 'Social & visits', tone: 'slate' },
};

function groupByDay(events: CareEvent[]) {
  const groups = new Map<string, CareEvent[]>();
  for (const event of events) {
    const key = new Date(event.starts_at).toDateString();
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }
  return [...groups.values()];
}

export default function ScheduleView() {
  const { can } = usePortal();
  const events = useLoad(api.events);
  const [showPast, setShowPast] = useState(false);
  const [adding, setAdding] = useState(false);
  const { run } = useAction();

  const now = Date.now();
  const visible = (events.data ?? []).filter((event) => showPast ? Date.parse(event.ends_at ?? event.starts_at) < now : Date.parse(event.ends_at ?? event.starts_at) >= now);
  const ordered = showPast ? [...visible].reverse() : visible;

  const remove = async (event: CareEvent) => {
    if (!confirmAction(`Delete "${event.title}"?`)) return;
    if (await run(() => api.deleteEvent(event.id), 'Event deleted.')) events.reload();
  };

  return <div>
    <PageHeader title="Schedule" description="Appointments, medication times, rides, errands, and visits."
      actions={<>
        <div className="flex rounded-xl border border-[#CBD5E1] bg-white p-0.5 text-sm">
          {[false, true].map((past) => <button key={String(past)} type="button" onClick={() => setShowPast(past)} className={`rounded-lg px-3 py-1.5 font-semibold ${showPast === past ? 'bg-[#E6F4F1] text-[#00685f]' : 'text-[#64748B]'}`}>{past ? 'Past' : 'Upcoming'}</button>)}
        </div>
        {can('event:write') && <Button icon={<Plus className="h-4 w-4" />} onClick={() => setAdding(true)}>Add event</Button>}
      </>} />

    {events.loading ? <Loading /> : events.error ? <ErrorNote message={events.error} onRetry={events.reload} /> : ordered.length === 0
      ? <EmptyState icon={<Calendar className="h-5 w-5" />} title={showPast ? 'No past events' : 'Nothing scheduled yet'}>{!showPast && can('event:write') ? 'Add the next appointment, ride, or visit so everyone knows who is covering it.' : undefined}</EmptyState>
      : <div className="space-y-6">{groupByDay(ordered).map((day) => <section key={day[0]!.id}>
        <h2 className="mb-2 text-sm font-bold text-[#475569]">{formatDate(day[0]!.starts_at)}</h2>
        <ul className="space-y-2">{day.map((event) => <li key={event.id} className="flex gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <div className="w-20 shrink-0 text-sm font-bold text-[#00685f]">{formatTime(event.starts_at)}{event.ends_at && <span className="block text-xs font-medium text-[#64748B]">to {formatTime(event.ends_at)}</span>}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{event.title}</p><Badge tone={eventCategories[event.category].tone}>{eventCategories[event.category].label}</Badge></div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748B]">
              {event.assignee_name && <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{event.assignee_name}</span>}
              {event.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.location}</span>}
            </div>
            {event.description && <p className="mt-2 whitespace-pre-wrap text-sm text-[#475569]">{event.description}</p>}
          </div>
          {can('event:write') && <button type="button" aria-label={`Delete ${event.title}`} onClick={() => void remove(event)} className="self-start rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>}
        </li>)}</ul>
      </section>)}</div>}

    {adding && <EventForm onClose={() => setAdding(false)} onSaved={() => { setAdding(false); events.reload(); }} />}
  </div>;
}

function EventForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { members } = usePortal();
  const { busy, run } = useAction();
  const [form, setForm] = useState({ title: '', category: 'medical' as EventCategory, startsAt: '', endsAt: '', assigneeName: '', location: '', description: '' });
  const set = (field: keyof typeof form) => (event: { target: { value: string } }) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await run(() => api.createEvent({
      title: form.title, category: form.category, startsAt: localInputToIso(form.startsAt),
      endsAt: form.endsAt ? localInputToIso(form.endsAt) : undefined,
      assigneeName: form.assigneeName || undefined, location: form.location || undefined, description: form.description || undefined,
    }), 'Event added.');
    if (saved) onSaved();
  };

  return <Modal title="Add event" onClose={onClose}>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Title"><input required maxLength={200} value={form.title} onChange={set('title')} placeholder="e.g. Cardiology follow-up" className={inputClass} /></Field>
      <Field label="Type"><select value={form.category} onChange={set('category')} className={inputClass}>{Object.entries(eventCategories).map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}</select></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Starts"><input required type="datetime-local" value={form.startsAt} onChange={set('startsAt')} className={inputClass} /></Field>
        <Field label="Ends (optional)"><input type="datetime-local" min={form.startsAt} value={form.endsAt} onChange={set('endsAt')} className={inputClass} /></Field>
      </div>
      <Field label="Who is covering it?">
        <select value={form.assigneeName} onChange={set('assigneeName')} className={inputClass}>
          <option value="">Not assigned</option>
          {members.map((member) => <option key={member.id} value={member.display_name}>{member.display_name}</option>)}
        </select>
      </Field>
      <Field label="Location (optional)"><input maxLength={500} value={form.location} onChange={set('location')} className={inputClass} /></Field>
      <Field label="Details (optional)"><textarea rows={3} maxLength={5000} value={form.description} onChange={set('description')} className={inputClass} /></Field>
      <div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" busy={busy}>Save event</Button></div>
    </form>
  </Modal>;
}
