import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type ComponentType } from 'react';
import { Calendar, CheckCircle2, ChevronDown, FileText, Heart, LayoutDashboard, LogOut, Menu, NotebookPen, Settings, Users, X } from 'lucide-react';
import { roleCan, roleLabels, type Capability } from '../../server/permissions';
import { api } from './api';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Button, ErrorNote, Loading, PortalContext, useLoad, type PortalContextValue } from './ui';

const OverviewView = lazy(() => import('./views/OverviewView'));
const ScheduleView = lazy(() => import('./views/ScheduleView'));
const TasksView = lazy(() => import('./views/TasksView'));
const NotesView = lazy(() => import('./views/NotesView'));
const DocumentsView = lazy(() => import('./views/DocumentsView'));
const TeamView = lazy(() => import('./views/TeamView'));
const SettingsView = lazy(() => import('./views/SettingsView'));

export type LiveView = 'overview' | 'schedule' | 'tasks' | 'notes' | 'documents' | 'team' | 'settings';
type CircleSummary = { id: string; name: string };
type LivePortalProps = {
  circles: CircleSummary[];
  activeCircleId: string;
  onSelectCircle: (circleId: string) => void;
  onCirclesChanged: () => void;
  onLeftCircle: () => void;
  onSignOut: () => void;
  notice?: string | null;
  onDismissNotice?: () => void;
};

const NAV: { view: LiveView; label: string; icon: ComponentType<{ className?: string }>; needs?: Capability }[] = [
  { view: 'overview', label: 'Overview', icon: LayoutDashboard },
  { view: 'schedule', label: 'Schedule', icon: Calendar, needs: 'event:read' },
  { view: 'tasks', label: 'Tasks', icon: CheckCircle2, needs: 'task:read' },
  { view: 'notes', label: 'Care notes', icon: NotebookPen, needs: 'note:read' },
  { view: 'documents', label: 'Documents', icon: FileText, needs: 'document:read' },
  { view: 'team', label: 'Care team', icon: Users, needs: 'member:read' },
  { view: 'settings', label: 'Settings', icon: Settings },
];

const VIEW_KEY = 'hearthside.liveView';
function savedView(): LiveView {
  try { const value = sessionStorage.getItem(VIEW_KEY); return NAV.some((item) => item.view === value) ? value as LiveView : 'overview'; } catch { return 'overview'; }
}

export function LivePortal({ circles, activeCircleId, onSelectCircle, onCirclesChanged, onLeftCircle, onSignOut, notice, onDismissNotice }: LivePortalProps) {
  const [view, setView] = useState<LiveView>(savedView);
  const [navOpen, setNavOpen] = useState(false);
  const [circleMenuOpen, setCircleMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null);
  const info = useLoad(api.circle, [activeCircleId]);
  const members = useLoad(api.members, [activeCircleId]);

  useEffect(() => { try { sessionStorage.setItem(VIEW_KEY, view); } catch { /* storage unavailable */ } }, [view]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), toast.tone === 'error' ? 7000 : 3500); return () => clearTimeout(timer); }, [toast]);

  const notify = useCallback((message: string, tone: 'success' | 'error' = 'success') => setToast({ message, tone }), []);
  const reloadCircle = useCallback(() => { info.reload(); members.reload(); onCirclesChanged(); }, [info.reload, members.reload, onCirclesChanged]);

  const context = useMemo<PortalContextValue | null>(() => info.data && members.data ? {
    info: info.data,
    members: members.data,
    can: (capability) => roleCan(info.data!.me.role, capability),
    notify,
    reloadCircle,
  } : null, [info.data, members.data, notify, reloadCircle]);

  if (!context) {
    const error = info.error ?? members.error;
    return <div className="grid min-h-screen place-items-center bg-[#F6F9FF] p-6">
      {error ? <div className="w-full max-w-md space-y-3"><ErrorNote message={error} onRetry={() => { info.reload(); members.reload(); }} /><Button variant="secondary" onClick={onSignOut}>Sign out</Button></div> : <Loading label="Loading your Care Circle…" />}
    </div>;
  }

  const { info: { circle, recipient, me } } = context;
  const nav = NAV.filter((item) => !item.needs || context.can(item.needs));
  const current = nav.some((item) => item.view === view) ? view : 'overview';
  const go = (next: LiveView) => { setView(next); setNavOpen(false); };

  const sidebar = <nav aria-label="Portal" className="flex h-full flex-col">
    <div className="flex items-center gap-2.5 px-5 py-5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#00685f] text-white"><Heart className="h-5 w-5 fill-current" /></span>
      <span className="font-display text-lg font-extrabold text-[#081d2c]">Hearthside</span>
    </div>
    <div className="relative px-3 pb-3">
      <button type="button" onClick={() => setCircleMenuOpen((open) => !open)} aria-expanded={circleMenuOpen} className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FBFF] px-3 py-2.5 text-left hover:border-[#00685f]/40">
        <span className="min-w-0"><span className="block truncate text-sm font-bold text-[#081d2c]">{circle.name}</span><span className="block truncate text-xs text-[#64748B]">{recipient ? `Caring for ${recipient.display_name}` : 'Care Circle'}</span></span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" />
      </button>
      {circleMenuOpen && <div className="absolute inset-x-3 top-full z-20 mt-1 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg">
        <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">Your Care Circles</p>
        {circles.map((item) => <button key={item.id} type="button" onClick={() => { setCircleMenuOpen(false); setNavOpen(false); onSelectCircle(item.id); }} className={`block w-full truncate rounded-lg px-2.5 py-2 text-left text-sm ${item.id === activeCircleId ? 'bg-[#E6F4F1] font-semibold text-[#00685f]' : 'text-[#081d2c] hover:bg-slate-50'}`}>{item.name}</button>)}
      </div>}
    </div>
    <ul className="flex-1 space-y-0.5 px-3">
      {nav.map(({ view: item, label, icon: Icon }) => <li key={item}>
        <button type="button" onClick={() => go(item)} aria-current={current === item ? 'page' : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${current === item ? 'bg-[#00685f] text-white' : 'text-[#334155] hover:bg-[#EEF4FB]'}`}>
          <Icon className="h-4 w-4" />{label}
        </button>
      </li>)}
    </ul>
    <div className="border-t border-[#E2E8F0] p-3">
      <div className="px-2 pb-2"><p className="truncate text-sm font-semibold text-[#081d2c]">{me.display_name}</p><p className="truncate text-xs text-[#64748B]">{roleLabels[me.role]} · {me.email}</p></div>
      <Button variant="ghost" className="w-full justify-start" icon={<LogOut className="h-4 w-4" />} onClick={onSignOut}>Sign out</Button>
    </div>
  </nav>;

  return <PortalContext.Provider value={context}>
    <div className="flex h-dvh w-full overflow-hidden bg-[#F6F9FF] text-[#081d2c]">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className="hidden w-64 shrink-0 border-r border-[#E2E8F0] bg-white lg:block">{sidebar}</aside>
      {navOpen && <div className="fixed inset-0 z-40 lg:hidden">
        <div className="absolute inset-0 bg-slate-900/40" onClick={() => setNavOpen(false)} />
        <aside className="relative h-full w-72 max-w-[85vw] bg-white shadow-xl">
          <button type="button" aria-label="Close menu" onClick={() => setNavOpen(false)} className="absolute right-3 top-5 rounded-full p-1.5 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
          {sidebar}
        </aside>
      </div>}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[#E2E8F0] bg-white px-4 py-3 lg:hidden">
          <button type="button" aria-label="Open menu" onClick={() => setNavOpen(true)} className="rounded-lg p-1.5 text-[#334155] hover:bg-slate-100"><Menu className="h-5 w-5" /></button>
          <span className="truncate font-display font-bold">{circle.name}</span>
        </header>
        {notice && <div role="status" className="flex items-start justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950">
          <span>{notice}</span>{onDismissNotice && <button type="button" aria-label="Dismiss" onClick={onDismissNotice}><X className="h-4 w-4" /></button>}
        </div>}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
            <ErrorBoundary key={current}><Suspense fallback={<Loading />}>
              {current === 'overview' && <OverviewView onNavigate={go} />}
              {current === 'schedule' && <ScheduleView />}
              {current === 'tasks' && <TasksView />}
              {current === 'notes' && <NotesView />}
              {current === 'documents' && <DocumentsView />}
              {current === 'team' && <TeamView />}
              {current === 'settings' && <SettingsView onLeftCircle={onLeftCircle} onSignOut={onSignOut} />}
            </Suspense></ErrorBoundary>
          </div>
        </main>
      </div>
      {toast && <div role={toast.tone === 'error' ? 'alert' : 'status'} className={`fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${toast.tone === 'error' ? 'bg-rose-700 text-white' : 'bg-[#081d2c] text-white'}`}>{toast.message}</div>}
    </div>
  </PortalContext.Provider>;
}
