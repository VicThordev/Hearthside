import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type PropsWithChildren, type ReactNode } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import type { Capability } from '../../server/permissions';
import type { CircleInfo, Member } from './api';

// ---- Portal context: who is signed in, in which circle, and what they may do ----

export type PortalContextValue = {
  info: CircleInfo;
  members: Member[];
  can: (capability: Capability) => boolean;
  notify: (message: string, tone?: 'success' | 'error') => void;
  reloadCircle: () => void;
};
export const PortalContext = createContext<PortalContextValue | null>(null);
export function usePortal() {
  const value = useContext(PortalContext);
  if (!value) throw new Error('usePortal must be used inside the live portal.');
  return value;
}

// ---- Data loading ----

export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';

export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true }));
    load().then(
      (data) => { if (!cancelled) setState({ data, loading: false }); },
      (error) => { if (!cancelled) setState({ error: errorMessage(error), loading: false }); },
    );
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { ...state, reload };
}

// Runs a mutation, reports failures through the portal toast, and exposes a busy flag.
export function useAction() {
  const { notify } = usePortal();
  const [busy, setBusy] = useState(false);
  const run = useCallback(async (action: () => Promise<unknown>, success?: string) => {
    setBusy(true);
    try {
      await action();
      if (success) notify(success);
      return true;
    } catch (error) {
      notify(errorMessage(error), 'error');
      return false;
    } finally { setBusy(false); }
  }, [notify]);
  return { busy, run };
}

// ---- Formatting ----

export const formatDateTime = (value: string) => new Date(value).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
export const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
export const formatTime = (value: string) => new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
export function formatRelative(value: string) {
  const seconds = Math.round((Date.parse(value) - Date.now()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['day', 86400], ['hour', 3600], ['minute', 60]];
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, size] of units) if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  return 'just now';
}
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
export const initials = (name: string) => name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join('') || '?';
// Converts a datetime-local value (browser time) to an ISO timestamp.
export const localInputToIso = (value: string) => new Date(value).toISOString();

// ---- Building blocks ----

export const inputClass = 'mt-1.5 w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#081d2c] outline-hidden transition focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/15 disabled:bg-slate-50';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; busy?: boolean; icon?: ReactNode };
const buttonStyles = {
  primary: 'bg-[#00685f] text-white hover:bg-[#00524b] shadow-sm',
  secondary: 'bg-white text-[#081d2c] border border-[#CBD5E1] hover:bg-[#F8FAFC]',
  danger: 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50',
  ghost: 'text-[#475569] hover:bg-[#EEF4FB]',
};
export function Button({ variant = 'primary', busy, icon, children, className = '', disabled, ...props }: ButtonProps) {
  return <button type="button" {...props} disabled={disabled || busy} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${className}`}>
    {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : icon}{children}
  </button>;
}

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs ${className}`}>{children}</section>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div><h1 className="font-display text-2xl font-bold text-[#081d2c]">{title}</h1>{description && <p className="mt-1 text-sm text-[#64748B]">{description}</p>}</div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>;
}

export function EmptyState({ icon, title, children }: PropsWithChildren<{ icon: ReactNode; title: string }>) {
  return <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white/60 px-6 py-10 text-center">
    <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-[#E6F4F1] text-[#00685f]">{icon}</div>
    <p className="font-semibold text-[#081d2c]">{title}</p>
    {children && <div className="mt-1 max-w-sm text-sm text-[#64748B]">{children}</div>}
  </div>;
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="flex items-center gap-2 py-8 text-sm text-[#64748B]"><LoaderCircle className="h-4 w-4 animate-spin" />{label}</div>;
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
    <span>{message}</span>{onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
  </div>;
}

export function Badge({ children, tone = 'slate' }: PropsWithChildren<{ tone?: 'slate' | 'teal' | 'amber' | 'rose' | 'blue' }>) {
  const tones = { slate: 'bg-slate-100 text-slate-700', teal: 'bg-[#E6F4F1] text-[#00685f]', amber: 'bg-amber-100 text-amber-900', rose: 'bg-rose-100 text-rose-800', blue: 'bg-blue-50 text-blue-800' };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

export function Avatar({ name }: { name: string }) {
  return <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E1F0FF] text-xs font-bold text-[#00685f]">{initials(name)}</span>;
}

export function Field({ label, children, hint }: PropsWithChildren<{ label: string; hint?: string }>) {
  return <label className="block text-sm font-semibold text-[#081d2c]">{label}{children}{hint && <span className="mt-1 block text-xs font-normal text-[#64748B]">{hint}</span>}</label>;
}

export function Modal({ title, onClose, children }: PropsWithChildren<{ title: string; onClose: () => void }>) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); opener?.focus(); };
  }, [onClose]);
  return <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-bold text-[#081d2c]">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
      </div>
      {children}
    </div>
  </div>;
}

export function confirmAction(message: string) {
  return window.confirm(message);
}
