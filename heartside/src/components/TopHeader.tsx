import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  ChevronRight,
  Users2,
  Calendar,
  FileText,
  Upload,
  UserPlus,
  Car,
  CheckCircle2,
  X,
  AlertTriangle,
  Pill,
  Clock,
  Sparkles
} from 'lucide-react';
import { NotificationItem, ViewMode } from '../types';

interface TopHeaderProps {
  currentView: ViewMode;
  notifications: NotificationItem[];
  onOpenNewModal: (type: 'event' | 'note' | 'doc' | 'invite') => void;
  onSearchSelect?: (term: string) => void;
  onSwitchCircle?: () => void;
  onNotificationDismiss?: (id: string) => void;
  onNavigate?: (view: ViewMode) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  notifications,
  onOpenNewModal,
  onSearchSelect,
  onSwitchCircle,
  onNotificationDismiss,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSelect?.(searchQuery.trim());
      setShowSearchModal(true);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between gap-4 z-10 shrink-0">
      {/* Left: Breadcrumbs & Switch Circle */}
      <div className="flex items-center gap-2 text-xs md:text-sm text-[#64748B] min-w-0">
        <span className="hover:text-[#081d2c] transition-colors font-medium cursor-pointer" onClick={() => onNavigate?.('overview')}>
          Hearthside
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-[#081d2c] truncate">
          Eleanor Vance Care Circle
        </span>
        <button
          onClick={onSwitchCircle}
          className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#00685f] bg-[#E1F0FF]/70 hover:bg-[#D6EBFF] rounded-lg transition-colors border border-[#CBD5E1]/40 shrink-0"
        >
          <Users2 className="w-3.5 h-3.5 text-[#00685f]" />
          <span className="hidden sm:inline">Switch Circle</span>
        </button>

        <button
          onClick={() => onNavigate?.('landing')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#475569] hover:text-[#00685f] bg-slate-100 hover:bg-teal-50 rounded-lg transition-colors border border-slate-200 shrink-0"
          title="View Public Landing Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00685f]" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>
      </div>

      {/* Center & Right: Search, Actions, Notifications, User */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search care records, meds, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchModal(true)}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#081d2c] placeholder:text-[#64748B] focus:outline-none focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* + New dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] active:bg-[#003833] rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>

          {showNewMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1.5 z-40 animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onOpenNewModal('event');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#081d2c] hover:bg-[#F1F5F9] rounded-lg transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-[#E1F0FF] text-[#00685f] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Event or Appointment</div>
                  <div className="text-[11px] text-[#64748B]">Clinic visit, PT, ride</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onOpenNewModal('note');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#081d2c] hover:bg-[#F1F5F9] rounded-lg transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-[#CCFBF1] text-[#0f766e] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Daily Care Update</div>
                  <div className="text-[11px] text-[#64748B]">Mood, meal, or vitals</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onOpenNewModal('doc');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#081d2c] hover:bg-[#F1F5F9] rounded-lg transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Upload Health Record</div>
                  <div className="text-[11px] text-[#64748B]">POA, insurance, labs</div>
                </div>
              </button>

              <div className="border-t border-[#E2E8F0] my-1" />

              <button
                onClick={() => {
                  setShowNewMenu(false);
                  onOpenNewModal('invite');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#081d2c] hover:bg-[#F1F5F9] rounded-lg transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Invite Caregiver / Family</div>
                  <div className="text-[11px] text-[#64748B]">Assign permissions</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#64748B] hover:text-[#081d2c] hover:bg-[#F1F5F9] rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-3 z-40">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#081d2c]">Care Alerts & Notifications</span>
                <span className="text-[11px] text-[#00685f] font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-[#E2E8F0] max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="py-2.5 text-xs group flex items-start gap-2.5">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-[#E1F0FF] text-[#00685f] flex items-center justify-center shrink-0">
                      {item.type === 'medication' ? <Pill className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#081d2c] flex items-center justify-between">
                        <span className="truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">{item.message}</p>
                    </div>
                    {onNotificationDismiss && (
                      <button
                        onClick={() => onNotificationDismiss(item.id)}
                        className="text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar button */}
        <button
          onClick={() => onNavigate?.('settings')}
          title="Account profile"
          className="relative rounded-full ring-2 ring-[#00685f]/30 hover:ring-[#00685f] transition-all p-0.5"
        >
          <img
            src="/src/assets/images/sarah_vance_avatar_1792204247520.jpg"
            alt="Sarah Vance"
            className="w-8 h-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>

      {/* Search results modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#00685f]" />
              <input
                type="text"
                autoFocus
                placeholder="Search medications, doctor notes, care events, vault records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm text-[#081d2c] focus:outline-none"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Quick Results Matching "{searchQuery || 'Recent'}"
              </div>

              <div
                onClick={() => {
                  setShowSearchModal(false);
                  onNavigate?.('care-notes');
                }}
                className="p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#081d2c]">Lisinopril 20mg Adjustment</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-medium">Critical Rx</span>
                </div>
                <div className="text-xs text-[#64748B] mt-1">Adjusted to 20mg daily with breakfast. Refill in top pantry cabinet.</div>
              </div>

              <div
                onClick={() => {
                  setShowSearchModal(false);
                  onNavigate?.('calendar');
                }}
                className="p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#081d2c]">Dr. Chen Cardiology Follow-Up</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E1F0FF] text-[#00685f] font-medium">Today 11:30 AM</span>
                </div>
                <div className="text-xs text-[#64748B] mt-1">St. Vincent Medical Plaza • Driver: Sarah Vance (Confirmed)</div>
              </div>

              <div
                onClick={() => {
                  setShowSearchModal(false);
                  onNavigate?.('vault');
                }}
                className="p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#081d2c]">Current Prescriptions & Allergy Sheet.pdf</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-medium">Walgreens Synced</span>
                </div>
                <div className="text-xs text-[#64748B] mt-1">Penicillin severe allergy warning • Updated 2 days ago</div>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-right">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-[#081d2c] hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
