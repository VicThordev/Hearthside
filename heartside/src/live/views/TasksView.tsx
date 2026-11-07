import { useState, type FormEvent } from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { api, type Task, type TaskPriority } from '../api';
import { Badge, Button, confirmAction, EmptyState, ErrorNote, Field, formatDateTime, inputClass, Loading, localInputToIso, Modal, PageHeader, useAction, useLoad, usePortal } from '../ui';

const priorities: Record<TaskPriority, { label: string; tone: 'slate' | 'teal' | 'amber' | 'rose' }> = {
  low: { label: 'Low', tone: 'slate' }, normal: { label: 'Normal', tone: 'teal' }, high: { label: 'High', tone: 'amber' }, urgent: { label: 'Urgent', tone: 'rose' },
};
type Filter = 'open' | 'mine' | 'completed';

export default function TasksView() {
  const { info, can } = usePortal();
  const tasks = useLoad(api.tasks);
  const [filter, setFilter] = useState<Filter>('open');
  const [adding, setAdding] = useState(false);
  const { run } = useAction();

  const isDone = (task: Task) => task.status === 'completed' || task.status === 'cancelled';
  const visible = (tasks.data ?? []).filter((task) => filter === 'completed' ? isDone(task) : !isDone(task) && (filter === 'open' || task.assigned_member_id === info.me.id));

  const toggle = async (task: Task) => {
    if (await run(() => api.updateTask(task.id, { status: isDone(task) ? 'open' : 'completed' }), isDone(task) ? 'Task reopened.' : 'Task completed.')) tasks.reload();
  };
  const remove = async (task: Task) => {
    if (!confirmAction(`Delete "${task.title}"?`)) return;
    if (await run(() => api.deleteTask(task.id), 'Task deleted.')) tasks.reload();
  };

  return <div>
    <PageHeader title="Tasks" description="Errands, follow-ups, and anything someone needs to take care of."
      actions={can('task:write') && <Button icon={<Plus className="h-4 w-4" />} onClick={() => setAdding(true)}>Add task</Button>} />
    <div className="mb-4 flex w-fit rounded-xl border border-[#CBD5E1] bg-white p-0.5 text-sm">
      {([['open', 'Open'], ['mine', 'Assigned to me'], ['completed', 'Done']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg px-3 py-1.5 font-semibold ${filter === value ? 'bg-[#E6F4F1] text-[#00685f]' : 'text-[#64748B]'}`}>{label}</button>)}
    </div>

    {tasks.loading ? <Loading /> : tasks.error ? <ErrorNote message={tasks.error} onRetry={tasks.reload} /> : visible.length === 0
      ? <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title={filter === 'completed' ? 'No completed tasks yet' : 'No open tasks'}>{filter !== 'completed' && can('task:write') ? 'Add a task and assign it to someone in the Care Circle.' : undefined}</EmptyState>
      : <ul className="space-y-2">{visible.map((task) => {
        const overdue = !isDone(task) && task.due_at && Date.parse(task.due_at) < Date.now();
        return <li key={task.id} className="flex items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xs">
          <button type="button" onClick={() => void toggle(task)} aria-label={isDone(task) ? `Reopen ${task.title}` : `Mark ${task.title} done`} className="mt-0.5 text-[#00685f]">
            {isDone(task) ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><p className={`font-semibold ${isDone(task) ? 'text-[#64748B] line-through' : ''}`}>{task.title}</p><Badge tone={priorities[task.priority].tone}>{priorities[task.priority].label}</Badge>{overdue && <Badge tone="rose">Overdue</Badge>}</div>
            {task.description && <p className="mt-1 whitespace-pre-wrap text-sm text-[#475569]">{task.description}</p>}
            <p className="mt-1 text-xs text-[#64748B]">{task.assignee ? `Assigned to ${task.assignee.display_name}` : 'Unassigned'}{task.due_at ? ` · Due ${formatDateTime(task.due_at)}` : ''}</p>
          </div>
          {can('task:write') && <button type="button" aria-label={`Delete ${task.title}`} onClick={() => void remove(task)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>}
        </li>;
      })}</ul>}

    {adding && <TaskForm onClose={() => setAdding(false)} onSaved={() => { setAdding(false); tasks.reload(); }} />}
  </div>;
}

function TaskForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { members } = usePortal();
  const { busy, run } = useAction();
  const [form, setForm] = useState({ title: '', description: '', priority: 'normal' as TaskPriority, dueAt: '', assignedMemberId: '' });
  const set = (field: keyof typeof form) => (event: { target: { value: string } }) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await run(() => api.createTask({
      title: form.title, description: form.description || undefined, priority: form.priority,
      dueAt: form.dueAt ? localInputToIso(form.dueAt) : undefined, assignedMemberId: form.assignedMemberId || undefined,
    }), 'Task added.')) onSaved();
  };
  return <Modal title="Add task" onClose={onClose}>
    <form onSubmit={submit} className="space-y-4">
      <Field label="Task"><input required maxLength={200} value={form.title} onChange={set('title')} placeholder="e.g. Pick up prescription refill" className={inputClass} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Assign to"><select value={form.assignedMemberId} onChange={set('assignedMemberId')} className={inputClass}><option value="">Unassigned</option>{members.map((member) => <option key={member.id} value={member.id}>{member.display_name}</option>)}</select></Field>
        <Field label="Priority"><select value={form.priority} onChange={set('priority')} className={inputClass}>{Object.entries(priorities).map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}</select></Field>
      </div>
      <Field label="Due (optional)"><input type="datetime-local" value={form.dueAt} onChange={set('dueAt')} className={inputClass} /></Field>
      <Field label="Details (optional)"><textarea rows={3} maxLength={5000} value={form.description} onChange={set('description')} className={inputClass} /></Field>
      <div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" busy={busy}>Save task</Button></div>
    </form>
  </Modal>;
}
