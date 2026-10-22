import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { CalendarView } from './components/views/CalendarView';
import { CareTeamView } from './components/views/CareTeamView';
import { CareNotesView } from './components/views/CareNotesView';
import { DocumentVaultView } from './components/views/DocumentVaultView';
import { SettingsView } from './components/views/SettingsView';
import { OverviewView } from './components/views/OverviewView';
import { TasksView } from './components/views/TasksView';
import { ServiceDirectoryView } from './components/views/ServiceDirectoryView';
import { ReportsView } from './components/views/ReportsView';
import { LandingPageView } from './components/views/LandingPageView';
import { AuthView } from './components/views/AuthView';

// Modals
import { NewItemModal } from './components/modals/NewItemModal';
import { EmergencyCardModal } from './components/modals/EmergencyCardModal';
import { AuditLogModal } from './components/modals/AuditLogModal';
import { PermissionMatrixModal } from './components/modals/PermissionMatrixModal';
import { EscalationTestModal } from './components/modals/EscalationTestModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';

// Initial Data
import {
  INITIAL_CAREGIVERS,
  INITIAL_PENDING_INVITES,
  INITIAL_SCHEDULE_EVENTS,
  INITIAL_CARE_NOTES,
  INITIAL_VAULT_DOCUMENTS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

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

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  
  // App state
  const [events, setEvents] = useState<ScheduleEvent[]>(INITIAL_SCHEDULE_EVENTS);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(INITIAL_CAREGIVERS);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(INITIAL_PENDING_INVITES);
  const [notes, setNotes] = useState<CareNote[]>(INITIAL_CARE_NOTES);
  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_VAULT_DOCUMENTS);
  const [invoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modal states
  const [newModalType, setNewModalType] = useState<'event' | 'note' | 'doc' | 'invite' | null>(null);
  const [showEmergencyCard, setShowEmergencyCard] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(false);
  const [showEscalationTest, setShowEscalationTest] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [showSwitchCircleNotice, setShowSwitchCircleNotice] = useState(false);

  // Handlers
  const handleAddEvent = (newEvent: Partial<ScheduleEvent>) => {
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

  // Dedicated full-width experience for Public Landing Page
  if (currentView === 'landing') {
    return (
      <div className="relative min-h-screen w-full bg-[#FCFDFE]">
        <LandingPageView
          onEnterApp={(view) => setCurrentView(view || 'overview')}
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'signup');
            setCurrentView('auth');
          }}
        />
        
        {/* Floating Quick Action to jump directly to Active Care Circle */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setCurrentView('overview')}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#081d2c] hover:bg-[#00685f] text-white text-xs font-bold shadow-2xl border border-white/20 transition-all transform hover:scale-105 cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Launch Eleanor Vance Care Portal →</span>
          </button>
        </div>
      </div>
    );
  }

  // Dedicated Sign Up / Log In View
  if (currentView === 'auth') {
    return (
      <AuthView
        initialMode={authMode}
        onSuccess={(view) => setCurrentView(view || 'overview')}
        onBackToLanding={() => setCurrentView('landing')}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F9FF] text-[#081d2c] font-sans">
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        onUpgradeClick={() => setCurrentView('settings')}
        onSwitchCircle={() => setShowSwitchCircleNotice(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader
          currentView={currentView}
          notifications={notifications}
          onOpenNewModal={(type) => setNewModalType(type)}
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
        <main className="flex-1 flex overflow-hidden">
          {currentView === 'calendar' && (
            <CalendarView
              events={events}
              onNewEventClick={() => setNewModalType('event')}
            />
          )}

          {currentView === 'care-team' && (
            <CareTeamView
              caregivers={caregivers}
              pendingInvites={pendingInvites}
              onInviteClick={() => setNewModalType('invite')}
              onAuditLogClick={() => setShowAuditLog(true)}
              onPermissionMatrixClick={() => setShowPermissionMatrix(true)}
              onTestEscalationClick={() => setShowEscalationTest(true)}
            />
          )}

          {currentView === 'care-notes' && (
            <CareNotesView
              notes={notes}
              onAddNote={handleAddNote}
              onPostUpdateClick={() => setNewModalType('note')}
            />
          )}

          {currentView === 'vault' && (
            <DocumentVaultView
              documents={documents}
              onUploadClick={() => setNewModalType('doc')}
              onPreviewDocument={(doc) => setPreviewDoc(doc)}
              onPrintEmergencyCard={() => setShowEmergencyCard(true)}
              onRequestRecordsClick={() => alert('Generating medical records authorization request for Dr. Chen Clinic')}
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
              You are currently viewing <strong>Eleanor Vance's Care Circle</strong> (Active). All HIPAA health records and live emergency beacons are scoped to this circle.
            </p>
            <div className="p-3 rounded-xl bg-[#E1F0FF] border border-[#CBD5E1] text-xs font-semibold text-[#00685f] flex items-center justify-between">
              <span>● Eleanor Vance (Portland, OR)</span>
              <span>Selected</span>
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
  );
}
