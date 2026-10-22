import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';

import { useAuth } from './auth/AuthProvider';
import { apiFetch } from './lib/api';
import { DemoBanner } from './components/DemoBanner';
import { isDemoMode } from './lib/runtime';

const CalendarView = lazy(() => import('./components/views/CalendarView').then(({ CalendarView }) => ({ default: CalendarView })));
const LandingPageView = lazy(() => import('./components/views/LandingPageView').then(({ LandingPageView }) => ({ default: LandingPageView })));
const AuthView = lazy(() => import('./components/views/AuthView').then(({ AuthView }) => ({ default: AuthView })));
const CircleSetupView = lazy(() => import('./components/views/CircleSetupView').then(({ CircleSetupView }) => ({ default: CircleSetupView })));
const CareTeamView = lazy(() => import('./components/views/CareTeamView').then(({ CareTeamView }) => ({ default: CareTeamView })));
const CareNotesView = lazy(() => import('./components/views/CareNotesView').then(({ CareNotesView }) => ({ default: CareNotesView })));
const DocumentVaultView = lazy(() => import('./components/views/DocumentVaultView').then(({ DocumentVaultView }) => ({ default: DocumentVaultView })));
const SettingsView = lazy(() => import('./components/views/SettingsView').then(({ SettingsView }) => ({ default: SettingsView })));
const OverviewView = lazy(() => import('./components/views/OverviewView').then(({ OverviewView }) => ({ default: OverviewView })));
const TasksView = lazy(() => import('./components/views/TasksView').then(({ TasksView }) => ({ default: TasksView })));
const ServiceDirectoryView = lazy(() => import('./components/views/ServiceDirectoryView').then(({ ServiceDirectoryView }) => ({ default: ServiceDirectoryView })));
const ReportsView = lazy(() => import('./components/views/ReportsView').then(({ ReportsView }) => ({ default: ReportsView })));
const NewItemModal = lazy(() => import('./components/modals/NewItemModal').then(({ NewItemModal }) => ({ default: NewItemModal })));
const EmergencyCardModal = lazy(() => import('./components/modals/EmergencyCardModal').then(({ EmergencyCardModal }) => ({ default: EmergencyCardModal })));
const AuditLogModal = lazy(() => import('./components/modals/AuditLogModal').then(({ AuditLogModal }) => ({ default: AuditLogModal })));
const PermissionMatrixModal = lazy(() => import('./components/modals/PermissionMatrixModal').then(({ PermissionMatrixModal }) => ({ default: PermissionMatrixModal })));
const EscalationTestModal = lazy(() => import('./components/modals/EscalationTestModal').then(({ EscalationTestModal }) => ({ default: EscalationTestModal })));
const DocumentPreviewModal = lazy(() => import('./components/modals/DocumentPreviewModal').then(({ DocumentPreviewModal }) => ({ default: DocumentPreviewModal })));

import {
  ViewMode,
  Caregiver,
  PendingInvite,
  ScheduleEvent,
  CareNote,
  VaultDocument,
  Invoice,
  NotificationItem
} from './types';

type CircleSummary = { id: string; name: string; timezone: string };

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  
  // App state
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [notes, setNotes] = useState<CareNote[]>([]);
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modal states
  const [newModalType, setNewModalType] = useState<'event' | 'note' | 'doc' | 'invite' | null>(null);
  const [showEmergencyCard, setShowEmergencyCard] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(false);
  const [showEscalationTest, setShowEscalationTest] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [showSwitchCircleNotice, setShowSwitchCircleNotice] = useState(false);
  const [circleState, setCircleState] = useState<'loading' | 'ready' | 'needs-setup' | 'error'>('loading');
  const [circles, setCircles] = useState<CircleSummary[]>([]);
  const [circleReload, setCircleReload] = useState(0);

  useEffect(() => {
    if (!isDemoMode) return;
    void import('./data/mockData').then((data) => {
      setEvents(data.INITIAL_SCHEDULE_EVENTS);
      setCaregivers(data.INITIAL_CAREGIVERS);
      setPendingInvites(data.INITIAL_PENDING_INVITES);
      setNotes(data.INITIAL_CARE_NOTES);
      setDocuments(data.INITIAL_VAULT_DOCUMENTS);
      setInvoices(data.INITIAL_INVOICES);
      setNotifications(data.INITIAL_NOTIFICATIONS);
    });
  }, []);

  useEffect(() => {
    if (!user) { setCircleState('loading'); return; }
    let cancelled = false;
    void apiFetch<{ data: Array<{ care_circles: CircleSummary | null }> }>('/api/v1/circles')
      .then(({ data }) => {
        if (cancelled) return;
        const availableCircles = data.flatMap(({ care_circles }) => care_circles ? [care_circles] : []);
        setCircles(availableCircles);
        const storedCircleId = localStorage.getItem('hearthside.activeCircleId');
        const circleId = availableCircles.some(({ id }) => id === storedCircleId) ? storedCircleId : availableCircles[0]?.id;
        if (circleId) { localStorage.setItem('hearthside.activeCircleId', circleId); setCircleState('ready'); }
        else setCircleState('needs-setup');
      })
      .catch(() => { if (!cancelled) setCircleState('error'); });
    return () => { cancelled = true; };
  }, [user, circleReload]);

  // Handlers
  const handleAddEvent = (newEvent: Partial<ScheduleEvent>) => {
    if (!isDemoMode) { alert('Creating calendar events is not enabled until this screen is connected to the API.'); return; }
    const event: ScheduleEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title || 'Untitled Care Event',
      time: newEvent.time || '10:00 AM',
      day: newEvent.day || 'thu',
      dateStr: newEvent.dateStr || 'Thu Oct 24',
      category: newEvent.category || 'medical',
      assigneeName: newEvent.assigneeName || 'Sarah Vance',
      assigneeInitials: 'SV',
      completed: false,
      ...newEvent
    };
    setEvents([event, ...events]);
  };

  const handleAddNote = (newNote: Partial<CareNote>) => {
    if (!isDemoMode) { alert('Posting care notes is not enabled until this screen is connected to the API.'); return; }
    const note: CareNote = {
      id: `note-${Date.now()}`,
      authorId: 'sarah-vance',
      authorName: 'Sarah Vance',
      authorInitials: 'SV',
      authorRole: 'Primary Care Organizer',
      authorAvatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      timestamp: 'Just now',
      title: newNote.title || 'Care Update',
      content: newNote.content || '',
      category: newNote.category || 'vitals',
      reactions: { likes: 1, users: ['Sarah Vance'], hasLiked: true },
      comments: [],
      ...newNote
    };
    setNotes([note, ...notes]);
  };

  const handleAddDoc = (filename: string, category: string) => {
    if (!isDemoMode) { alert('Document uploads are not enabled in this release.'); return; }
    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      title: filename,
      filename: filename,
      fileSize: '1.8 MB',
      category: category as any,
      categoryLabel: category === 'clinical' ? 'Clinical Record' : 'Care Document',
      verifiedNotice: 'Uploaded just now by Sarah Vance • Cryptographically signed with SHA-256',
      downloadCount: 0
    };
    setDocuments([newDoc, ...documents]);
  };

  const handleInvite = (name: string, email: string, role: string) => {
    if (!isDemoMode) { alert('Invitations are not enabled until role management is implemented.'); return; }
    const invite: PendingInvite = {
      id: `invite-${Date.now()}`,
      name,
      initials: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MB',
      email,
      role,
      relation: 'Invited by Sarah Vance',
      sentDate: 'Today',
      expiresInDays: 7,
      statusNote: 'Invitation email dispatched'
    };
    setPendingInvites([invite, ...pendingInvites]);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const openPreviewOnlyWorkflow = (type: 'event' | 'note' | 'doc' | 'invite') => {
    if (isDemoMode) setNewModalType(type);
    else alert('This workflow is unavailable until its screen is connected to the authenticated API.');
  };

  // Dedicated full-width experience for Public Landing Page
  if (currentView === 'landing') {
    return (
      <div className="relative min-h-screen w-full bg-[#FCFDFE]">
        {isDemoMode && <DemoBanner />}
        <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading preview…</div>}><LandingPageView
          onEnterApp={(view) => setCurrentView(user ? (view || 'overview') : 'auth')}
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'signup');
            setCurrentView('auth');
          }}
        /></Suspense>
        
        {/* Floating Quick Action to jump directly to Active Care Circle */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setCurrentView(user ? 'overview' : 'auth')}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#081d2c] hover:bg-[#00685f] text-white text-xs font-bold shadow-2xl border border-white/20 transition-all transform hover:scale-105 cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isDemoMode ? 'Open Fictional Preview →' : 'Open Care Portal →'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Dedicated Sign Up / Log In View
  if (currentView === 'auth') {
    return (
      <>{isDemoMode && <DemoBanner />}<Suspense fallback={<div className="min-h-screen grid place-items-center">Loading sign-in…</div>}><AuthView initialMode={authMode} onSuccess={(view) => setCurrentView(view || 'overview')} onBackToLanding={() => setCurrentView('landing')} /></Suspense></>
    );
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-[#F6F9FF] text-sm text-[#475569]">Loading secure session…</div>;
  }

  if (!user) {
    return <><>{isDemoMode && <DemoBanner />}</><Suspense fallback={<div className="min-h-screen grid place-items-center">Loading sign-in…</div>}><AuthView initialMode="login" onSuccess={() => setCurrentView('overview')} onBackToLanding={() => setCurrentView('landing')} /></Suspense></>;
  }

  if (circleState === 'loading') {
    return <div className="min-h-screen grid place-items-center bg-[#F6F9FF] text-sm text-[#475569]">Loading your Care Circle…</div>;
  }

  if (circleState === 'needs-setup') {
    return <Suspense fallback={<div className="min-h-screen grid place-items-center">Loading setup…</div>}><CircleSetupView onComplete={() => { setCircleState('loading'); setCircleReload((value) => value + 1); }} /></Suspense>;
  }

  if (circleState === 'error') {
    return <div className="min-h-screen grid place-items-center bg-[#F6F9FF] p-6 text-center"><div><p className="font-semibold text-[#081d2c]">We could not load your Care Circle.</p><p className="mt-2 text-sm text-[#64748B]">Confirm that the API server is running and your Supabase environment variables are configured.</p><button onClick={() => { setCircleState('loading'); setCircleReload((value) => value + 1); }} className="mt-4 rounded-lg bg-[#00685f] px-4 py-2 text-sm font-semibold text-white">Try again</button></div></div>;
  }

  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[#F6F9FF] text-sm text-[#475569]">Loading view…</div>}>
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F9FF] text-[#081d2c] font-sans">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        onUpgradeClick={() => setCurrentView('settings')}
        onSwitchCircle={() => setShowSwitchCircleNotice(true)}
        onSignOut={() => { void signOut(); setCurrentView('landing'); }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {isDemoMode && <DemoBanner />}
        {/* Top Header */}
        <TopHeader
          currentView={currentView}
          notifications={notifications}
          onOpenNewModal={openPreviewOnlyWorkflow}
          onSearchSelect={(term) => {
            if (term.toLowerCase().includes('doc') || term.toLowerCase().includes('poa')) {
              setCurrentView('vault');
            } else if (term.toLowerCase().includes('med') || term.toLowerCase().includes('note')) {
              setCurrentView('care-notes');
            } else if (term.toLowerCase().includes('team') || term.toLowerCase().includes('nurse')) {
              setCurrentView('care-team');
            } else {
              setCurrentView('calendar');
            }
          }}
          onSwitchCircle={() => setShowSwitchCircleNotice(true)}
          onNotificationDismiss={handleDismissNotification}
          onNavigate={(view) => setCurrentView(view)}
        />

        {/* View Switcher Container */}
        <main id="main-content" className="flex-1 flex overflow-hidden" tabIndex={-1}>
          {currentView === 'calendar' && (
            <CalendarView
              events={events}
              onNewEventClick={() => openPreviewOnlyWorkflow('event')}
            />
          )}

          {currentView === 'care-team' && (
            <CareTeamView
              caregivers={caregivers}
              pendingInvites={pendingInvites}
              onInviteClick={() => openPreviewOnlyWorkflow('invite')}
              onAuditLogClick={() => setShowAuditLog(true)}
              onPermissionMatrixClick={() => setShowPermissionMatrix(true)}
              onTestEscalationClick={() => setShowEscalationTest(true)}
            />
          )}

          {currentView === 'care-notes' && (
            <CareNotesView
              notes={notes}
              onAddNote={handleAddNote}
              onPostUpdateClick={() => openPreviewOnlyWorkflow('note')}
            />
          )}

          {currentView === 'vault' && (
            <DocumentVaultView
              documents={documents}
              onUploadClick={() => alert(isDemoMode ? 'Document upload is simulated in this preview.' : 'Document upload is not enabled in this release.')}
              onPreviewDocument={(doc) => setPreviewDoc(doc)}
              onPrintEmergencyCard={() => setShowEmergencyCard(true)}
              onRequestRecordsClick={() => alert('Medical-record requests are not enabled in this release.')}
              onAuditLogClick={() => setShowAuditLog(true)}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              invoices={invoices}
              onAuditLogClick={() => setShowAuditLog(true)}
            />
          )}

          {currentView === 'overview' && (
            <OverviewView
              events={events}
              notes={notes}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'tasks' && <TasksView />}

          {currentView === 'directory' && <ServiceDirectoryView />}

          {currentView === 'reports' && <ReportsView />}
        </main>
      </div>

      {/* Modals */}
      {newModalType && (
        <NewItemModal
          initialType={newModalType}
          onClose={() => setNewModalType(null)}
          onAddEvent={handleAddEvent}
          onAddNote={handleAddNote}
          onAddDoc={handleAddDoc}
          onInvite={handleInvite}
        />
      )}

      {showEmergencyCard && (
        <EmergencyCardModal onClose={() => setShowEmergencyCard(false)} />
      )}

      {showAuditLog && (
        <AuditLogModal onClose={() => setShowAuditLog(false)} />
      )}

      {showPermissionMatrix && (
        <PermissionMatrixModal onClose={() => setShowPermissionMatrix(false)} />
      )}

      {showEscalationTest && (
        <EscalationTestModal onClose={() => setShowEscalationTest(false)} />
      )}

      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {showSwitchCircleNotice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-base font-display text-[#081d2c]">
              Switch Care Circle
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Choose a Care Circle. Access is checked by the server for every API request.
            </p>
            <div className="space-y-2">
              {circles.map((circle) => {
                const selected = localStorage.getItem('hearthside.activeCircleId') === circle.id;
                return <button key={circle.id} onClick={() => { localStorage.setItem('hearthside.activeCircleId', circle.id); setShowSwitchCircleNotice(false); }} className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between ${selected ? 'bg-[#E1F0FF] border-[#00685f] text-[#00685f]' : 'bg-white border-[#CBD5E1] text-[#081d2c]'}`}>
                  <span>{circle.name}</span><span>{selected ? 'Selected' : 'Select'}</span>
                </button>;
              })}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSwitchCircleNotice(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-lg"
              >
                Continue with Eleanor's Circle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Suspense>
  );
}
