import React, { useState } from 'react';
import {
  X,
  Calendar,
  FileText,
  Upload,
  UserPlus,
  CheckCircle2,
  Clock,
  MapPin,
  Car
} from 'lucide-react';
import { ScheduleEvent, CareNote } from '../../types';

interface NewItemModalProps {
  initialType: 'event' | 'note' | 'doc' | 'invite';
  onClose: () => void;
  onAddEvent?: (event: Partial<ScheduleEvent>) => void;
  onAddNote?: (note: Partial<CareNote>) => void;
  onAddDoc?: (filename: string, category: string) => void;
  onInvite?: (name: string, email: string, role: string) => void;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  initialType,
  onClose,
  onAddEvent,
  onAddNote,
  onAddDoc,
  onInvite
}) => {
  const [activeTab, setActiveTab] = useState<'event' | 'note' | 'doc' | 'invite'>(initialType);

  // Form states
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('11:00 AM');
  const [eventDay, setEventDay] = useState<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'>('thu');
  const [eventCategory, setEventCategory] = useState<'medical' | 'vitals' | 'transport' | 'errands'>('medical');
  const [eventAssignee, setEventAssignee] = useState('Sarah Vance');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<'vitals' | 'errands' | 'medical' | 'social'>('vitals');

  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('clinical');

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Family Member');

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    onAddEvent?.({
      id: `evt-${Date.now()}`,
      title: eventTitle.trim(),
      time: eventTime,
      day: eventDay,
      dateStr: `Thu Oct 24`,
      category: eventCategory,
      assigneeName: eventAssignee,
      assigneeInitials: eventAssignee.slice(0, 2).toUpperCase(),
      completed: false
    });
    onClose();
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() && !noteContent.trim()) return;
    onAddNote?.({
      id: `note-${Date.now()}`,
      authorName: 'Sarah Vance',
      authorInitials: 'SV',
      authorRole: 'Primary Care Organizer',
      authorAvatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      timestamp: 'Just now',
      title: noteTitle.trim() || 'Care Circle Note',
      content: noteContent.trim(),
      category: noteCategory,
      reactions: { likes: 1, users: ['Sarah Vance'], hasLiked: true },
      comments: []
    });
    onClose();
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    onAddDoc?.(docName.trim(), docCategory);
    onClose();
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    onInvite?.(inviteName.trim(), inviteEmail.trim(), inviteRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base font-display text-[#081d2c]">
              New Care Circle Item
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-4 p-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs">
          <button
            onClick={() => setActiveTab('event')}
            className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
              activeTab === 'event' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Event</span>
          </button>

          <button
            onClick={() => setActiveTab('note')}
            className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
              activeTab === 'note' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>

          <button
            onClick={() => setActiveTab('doc')}
            className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
              activeTab === 'doc' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Doc</span>
          </button>

          <button
            onClick={() => setActiveTab('invite')}
            className={`py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors ${
              activeTab === 'invite' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite</span>
          </button>
        </div>

        {/* Tab content forms */}
        <div className="p-5">
          {/* Form: Event */}
          {activeTab === 'event' && (
            <form onSubmit={handleEventSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Event / Appointment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Physical Therapy Session or Dr. Appointment"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#00685f]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#081d2c] block mb-1">Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#00685f]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#081d2c] block mb-1">Day of Week</label>
                  <select
                    value={eventDay}
                    onChange={(e) => setEventDay(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:border-[#00685f]"
                  >
                    <option value="mon">Monday (Oct 21)</option>
                    <option value="tue">Tuesday (Oct 22)</option>
                    <option value="wed">Wednesday (Oct 23)</option>
                    <option value="thu">Thursday (Oct 24 - Today)</option>
                    <option value="fri">Friday (Oct 25)</option>
                    <option value="sat">Saturday (Oct 26)</option>
                    <option value="sun">Sunday (Oct 27)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#081d2c] block mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:border-[#00685f]"
                  >
                    <option value="medical">Medical Appointment</option>
                    <option value="vitals">Medication & Vitals</option>
                    <option value="transport">Transportation & Ride</option>
                    <option value="errands">Groceries & Errand</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#081d2c] block mb-1">Assigned Caregiver</label>
                  <select
                    value={eventAssignee}
                    onChange={(e) => setEventAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:border-[#00685f]"
                  >
                    <option value="Sarah Vance">Sarah Vance</option>
                    <option value="David Vance">David Vance</option>
                    <option value="Marcus Vance">Marcus Vance</option>
                    <option value="Nurse Beth">Nurse Beth RN</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-[#00685f] hover:bg-[#005049]"
                >
                  Add to Care Schedule
                </button>
              </div>
            </form>
          )}

          {/* Form: Note */}
          {activeTab === 'note' && (
            <form onSubmit={handleNoteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Update Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon visit recap or meal log"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#00685f]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Details & Observations</label>
                <textarea
                  rows={4}
                  placeholder="Share details about Eleanor's mood, physical transitions, meals, or medications..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#00685f]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white"
                >
                  <option value="vitals">Daily Mood & Vitals</option>
                  <option value="errands">Errands & Meals</option>
                  <option value="medical">Medical Encounter</option>
                  <option value="social">Family Social Call</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-[#00685f] hover:bg-[#005049]"
                >
                  Post Care Note
                </button>
              </div>
            </form>
          )}

          {/* Form: Doc */}
          {activeTab === 'doc' && (
            <form onSubmit={handleDocSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. 2024 Lab Results - Serum Potassium.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#00685f]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Vault Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white"
                >
                  <option value="clinical">Medical & Clinical Records</option>
                  <option value="legal">Legal, POA & Directives</option>
                  <option value="insurance">Insurance & Medicare Cards</option>
                  <option value="home-safety">Home Safety & Mobility</option>
                </select>
              </div>

              <div className="p-6 border-2 border-dashed border-[#CBD5E1] rounded-xl text-center bg-[#F8FAFC]">
                <Upload className="w-8 h-8 text-[#00685f] mx-auto mb-2" />
                <div className="font-semibold text-xs text-[#081d2c]">Drag and drop PDF, PNG, or JPG</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Encrypted with AES-256 before storage</div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-[#00685f] hover:bg-[#005049]"
                >
                  Upload Encrypted Document
                </button>
              </div>
            </form>
          )}

          {/* Form: Invite */}
          {activeTab === 'invite' && (
            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Arthur Evans or Cousin Lisa"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#00685f]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@family.org"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#00685f]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#081d2c] block mb-1">Access Tier & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg bg-white"
                >
                  <option value="Family Member">Family Member (Standard Access)</option>
                  <option value="Trusted Helper">Trusted Helper (Assigned Tasks Only)</option>
                  <option value="Physician / Read-Only">Physician / Read-Only (HIPAA Medical Vault)</option>
                  <option value="Primary Organizer">Primary Organizer (Full Administrative Control)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-[#00685f] hover:bg-[#005049]"
                >
                  Send Secure Invite Link
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
