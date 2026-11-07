import { useRef, useState, type FormEvent } from 'react';
import { Download, ExternalLink, FileText, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { api, uploadDocument, type DocumentCategory, type StoredDocument } from '../api';
import { Badge, Button, confirmAction, EmptyState, ErrorNote, Field, formatBytes, formatDateTime, inputClass, Loading, Modal, PageHeader, useAction, useLoad, usePortal } from '../ui';

const categories: Record<DocumentCategory, string> = {
  insurance: 'Insurance & benefits', legal: 'Legal, POA & directives', clinical: 'Medical records', prescriptions: 'Prescriptions', home_safety: 'Home & safety',
};
const ACCEPTED = { 'application/pdf': 'PDF', 'image/jpeg': 'JPEG', 'image/png': 'PNG' } as const;
const MAX_BYTES = 25 * 1024 * 1024;

export default function DocumentsView() {
  const { can } = usePortal();
  const documents = useLoad(api.documents);
  const [filter, setFilter] = useState<DocumentCategory | 'all'>('all');
  const [uploading, setUploading] = useState(false);
  const { run } = useAction();
  const visible = (documents.data ?? []).filter((document) => filter === 'all' || document.category === filter);

  // The tab is opened before the request so pop-up blockers treat it as a direct result of the click.
  const open = async (document: StoredDocument) => {
    const tab = window.open('', '_blank');
    await run(async () => {
      try {
        const { url } = await api.documentUrl(document.id, false);
        if (tab) { tab.opener = null; tab.location.href = url; } else window.location.href = url;
      } catch (error) { tab?.close(); throw error; }
    });
  };
  const download = (document: StoredDocument) => run(async () => { window.location.href = (await api.documentUrl(document.id, true)).url; });
  const remove = async (document: StoredDocument) => {
    if (!confirmAction(`Permanently delete "${document.title}"? This removes the file for everyone in the Care Circle.`)) return;
    if (await run(() => api.deleteDocument(document.id), 'Document deleted.')) documents.reload();
  };

  return <div>
    <PageHeader title="Documents" description="Insurance cards, legal papers, medical records, and prescriptions in one private place."
      actions={can('document:write') && <Button icon={<Upload className="h-4 w-4" />} onClick={() => setUploading(true)}>Upload document</Button>} />

    <div className="mb-4 flex flex-wrap gap-1.5">
      {(['all', ...Object.keys(categories)] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value as DocumentCategory | 'all')} className={`rounded-full border px-3 py-1 text-xs font-semibold ${filter === value ? 'border-[#00685f] bg-[#E6F4F1] text-[#00685f]' : 'border-[#CBD5E1] bg-white text-[#475569]'}`}>{value === 'all' ? 'All' : categories[value as DocumentCategory]}</button>)}
    </div>

    {documents.loading ? <Loading /> : documents.error ? <ErrorNote message={documents.error} onRetry={documents.reload} /> : visible.length === 0
      ? <EmptyState icon={<FileText className="h-5 w-5" />} title="No documents yet">{can('document:write') ? 'Upload PDFs or photos (JPEG, PNG) up to 25 MB. Only members of this Care Circle can open them.' : 'Documents shared with the Care Circle will appear here.'}</EmptyState>
      : <ul className="divide-y divide-[#F1F5F9] rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">{visible.map((document) => <li key={document.id} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E6F4F1] text-[#00685f]">{document.content_type.startsWith('image/') ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{document.title}</p>
          <p className="truncate text-xs text-[#64748B]">{document.filename} · {formatBytes(document.size_bytes)} · {document.author?.display_name ?? 'Former member'} · {formatDateTime(document.created_at)}</p>
        </div>
        <Badge>{categories[document.category]}</Badge>
        <div className="flex gap-1">
          <button type="button" aria-label={`Open ${document.title}`} title="Open" onClick={() => void open(document)} className="rounded-lg p-2 text-[#475569] hover:bg-[#EEF4FB]"><ExternalLink className="h-4 w-4" /></button>
          <button type="button" aria-label={`Download ${document.title}`} title="Download" onClick={() => void download(document)} className="rounded-lg p-2 text-[#475569] hover:bg-[#EEF4FB]"><Download className="h-4 w-4" /></button>
          {can('document:write') && <button type="button" aria-label={`Delete ${document.title}`} title="Delete" onClick={() => void remove(document)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>}
        </div>
      </li>)}</ul>}

    <p className="mt-4 text-xs text-[#64748B]">Opening or downloading a document creates a link that expires after 60 seconds and is recorded in the Care Circle's activity log.</p>
    {uploading && <UploadForm onClose={() => setUploading(false)} onSaved={() => { setUploading(false); documents.reload(); }} />}
  </div>;
}

function UploadForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { busy, run } = useAction();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('clinical');
  const [problem, setProblem] = useState<string | null>(null);

  const choose = (selected: File | undefined) => {
    setProblem(null); setFile(null);
    if (!selected) return;
    if (!(selected.type in ACCEPTED)) { setProblem('Only PDF, JPEG, and PNG files can be uploaded.'); return; }
    if (selected.size > MAX_BYTES) { setProblem(`This file is ${formatBytes(selected.size)}. The limit is 25 MB.`); return; }
    if (selected.size === 0) { setProblem('This file is empty.'); return; }
    setFile(selected);
    if (!title) setTitle(selected.name.replace(/\.[^.]+$/, '').slice(0, 200));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) { setProblem('Choose a file to upload.'); return; }
    if (await run(() => uploadDocument(file, title.trim() || file.name, category), 'Document uploaded.')) onSaved();
  };

  return <Modal title="Upload document" onClose={busy ? () => {} : onClose}>
    <form onSubmit={submit} className="space-y-4">
      <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files[0]); }}
        className="rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FBFF] p-5 text-center">
        <Upload className="mx-auto h-6 w-6 text-[#00685f]" />
        <p className="mt-2 text-sm font-semibold">{file ? file.name : 'Drop a file here, or choose one'}</p>
        <p className="text-xs text-[#64748B]">{file ? formatBytes(file.size) : 'PDF, JPEG, or PNG · up to 25 MB'}</p>
        <input ref={input} type="file" accept="application/pdf,image/jpeg,image/png" className="sr-only" onChange={(event) => choose(event.target.files?.[0])} aria-label="Choose file" />
        <Button variant="secondary" className="mt-3" onClick={() => input.current?.click()} disabled={busy}>{file ? 'Choose a different file' : 'Choose file'}</Button>
      </div>
      {problem && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{problem}</p>}
      <Field label="Title"><input required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Medicare card (front)" className={inputClass} /></Field>
      <Field label="Category"><select value={category} onChange={(event) => setCategory(event.target.value as DocumentCategory)} className={inputClass}>{Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
      <div className="flex justify-end gap-2"><Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button><Button type="submit" busy={busy} disabled={!file}>{busy ? 'Uploading…' : 'Upload'}</Button></div>
    </form>
  </Modal>;
}
