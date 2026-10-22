import React, { useState } from 'react';
import {
  FileText,
  Pin,
  Heart,
  ThumbsUp,
  MessageSquare,
  Paperclip,
  Image as ImageIcon,
  UserCheck,
  Send,
  AlertCircle,
  Activity,
  Droplet,
  Coffee,
  Sun,
  Smile,
  CheckCircle2,
  Share2,
  Clock,
  Sparkles,
  Camera,
  Eye,
  Check,
  Calendar,
  Pill,
  ShoppingBag,
  AlertTriangle,
  Stethoscope,
  Utensils,
  Moon,
  ShieldCheck,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { CareNote } from '../../types';

interface CareNotesViewProps {
  notes: CareNote[];
  onAddNote: (newNote: Partial<CareNote>) => void;
  onPostUpdateClick?: () => void;
}

export const CareNotesView: React.FC<CareNotesViewProps> = ({
  notes,
  onAddNote
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'medical' | 'vitals' | 'errands' | 'critical'>('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [composerTitle, setComposerTitle] = useState('');
  const [composerCategory, setComposerCategory] = useState<'vitals' | 'errands' | 'medical' | 'social'>('vitals');
  const [quickReplies, setQuickReplies] = useState<{ [noteId: string]: string }>({});
  const [commentsState, setCommentsState] = useState<{ [noteId: string]: any[] }>({});
  const [hugSentToast, setHugSentToast] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(true);

  // Likes state
  const [likesState, setLikesState] = useState<{ [noteId: string]: number }>({
    'note-feed-1': 3,
    'note-feed-2': 4,
    'note-feed-3': 5,
    'note-med-1': 2,
    'note-vitals-1': 3,
    'note-errand-1': 4
  });

  const handleLike = (noteId: string) => {
    setLikesState(prev => ({
      ...prev,
      [noteId]: (prev[noteId] || 0) + 1
    }));
  };

  const handleSendHug = (hugType: string) => {
    setHugSentToast(`Sent "${hugType}" to Eleanor's bedside frame!`);
    setTimeout(() => setHugSentToast(null), 3500);
  };

  const handlePostComment = (noteId: string) => {
    const text = quickReplies[noteId]?.trim();
    if (!text) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      authorName: 'Sarah Vance',
      authorInitials: 'SV',
      timestamp: 'Just now',
      text
    };
    setCommentsState(prev => ({
      ...prev,
      [noteId]: [...(prev[noteId] || []), newComment]
    }));
    setQuickReplies(prev => ({ ...prev, [noteId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && !composerTitle.trim()) return;

    onAddNote({
      authorId: 'sarah-vance',
      authorName: 'Sarah Vance',
      authorInitials: 'SV',
      authorRole: 'Primary Care Organizer',
      authorAvatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      timestamp: 'Just now',
      title: composerTitle || 'Care Circle Update',
      content: composerText,
      category: composerCategory,
      reactions: { likes: 1, users: ['Sarah Vance'], hasLiked: true },
      comments: []
    });

    setComposerText('');
    setComposerTitle('');
    setComposerOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-[#F6F9FF]">
      {/* Toast alert for family hug */}
      {hugSentToast && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-[#00685f] text-white shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Heart className="w-5 h-5 fill-teal-200 text-teal-200" />
          <span className="text-xs font-semibold">{hugSentToast}</span>
        </div>
      )}

      {/* Top Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00685f]">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Coordination Feed • Live Sync • Eleanor's Residence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
            Care Notes & Daily Updates
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            A quiet, reassuring space for real-time medication hand-offs, mood observations, and daily joys shared across Eleanor's care circle.
          </p>
        </div>

        <button
          onClick={() => setComposerOpen(!composerOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-xl shadow-xs transition-colors self-start md:self-auto shrink-0 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Post Care Update</span>
        </button>
      </div>

      {/* Filter Tabs / Segments */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Notes', count: 18 },
          { id: 'medical', label: 'Medical Visits', count: 4 },
          { id: 'vitals', label: 'Daily Mood & Vitals', count: 9 },
          { id: 'errands', label: 'Errands & Meals', count: 5 },
          { id: 'critical', label: 'Important Announcements', count: 3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === tab.id
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-white border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Left Feed (8 cols) & Right Widgets (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Feed */}
        <div className="lg:col-span-8 space-y-6">

          {/* Quick Post Composer Box */}
          {composerOpen && (
            <div className="p-5 rounded-2xl bg-white border border-[#00685f]/30 shadow-md space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/src/assets/images/sarah_vance_avatar_1792204247520.jpg"
                    alt="Sarah Vance"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#081d2c]">Sarah Vance</div>
                    <div className="text-[11px] text-[#64748B]">Posting to Eleanor's Care Circle</div>
                  </div>
                </div>

                <select
                  value={composerCategory}
                  onChange={(e) => setComposerCategory(e.target.value as any)}
                  className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1 text-[#081d2c]"
                >
                  <option value="vitals">Daily Mood & Vitals</option>
                  <option value="medical">Medical Visits</option>
                  <option value="errands">Errands & Meals</option>
                  <option value="social">Social & Family</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Title / Summary (e.g. Afternoon Tea & Vitals)..."
                value={composerTitle}
                onChange={(e) => setComposerTitle(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#00685f]"
              />

              <textarea
                rows={3}
                placeholder="Share an update, meal log, mood note, or visit summary with the family..."
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#00685f] focus:ring-2 focus:ring-[#00685f]/20 placeholder:text-[#64748B]"
              />

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <button
                    type="button"
                    onClick={() => alert('Photo selected from Eleanor\'s residence library.')}
                    className="p-1.5 hover:text-[#081d2c] hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Attached Medical_Summary_Oct.pdf')}
                    className="p-1.5 hover:text-[#081d2c] hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach Doc</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setComposerOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#081d2c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatePost}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] transition-colors"
                  >
                    Post to Care Circle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SEGMENT 1: ALL OR IMPORTANT ANNOUNCEMENTS (Critical Pinned) */}
          {/* ======================================================== */}
          {(activeFilter === 'all' || activeFilter === 'critical') && (
            <div className="space-y-4">
              {/* Pinned Card (Matching Image 5 top pinned post) */}
              <div className="p-6 rounded-2xl bg-white border-2 border-red-200 shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Critical Rx Adjustment</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E1F0FF] text-[#00685f] flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      <span>Pinned Announcement</span>
                    </span>
                  </div>
                  <span className="text-xs text-[#64748B]">Today at 9:15 AM</span>
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#00685f] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      SV
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-display text-[#081d2c]">
                        Cardiologist Follow-up Notes & Prescription Adjustment
                      </h2>
                      <div className="text-xs text-[#64748B]">
                        Sarah Vance • Dr. Christopher Chen's Clinic (St. Jude Medical)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div className="text-xs font-bold text-[#081d2c] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00685f]" />
                    <span>Required Immediate Action Items:</span>
                  </div>
                  <ul className="text-xs text-[#081d2c] space-y-2.5 pl-1 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#00685f] shrink-0">•</span>
                      <div>
                        <strong>Lisinopril increased:</strong> Adjusted to 20mg once daily in the morning with water (previously 10mg). New refill bottle placed in morning pill organizer tray.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#00685f] shrink-0">•</span>
                      <div>
                        <strong>Mandatory BP Check:</strong> Record seated blood pressure every day at 6:30 PM before Eleanor's evening tea. If systolic is &gt;140, message Sarah instantly.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#00685f] shrink-0">•</span>
                      <div>
                        <strong>Lab Scheduled:</strong> Serum potassium lab draw scheduled for next Thursday at 8:00 AM (Quest Diagnostics). Transportation confirmed.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-xs text-[#081d2c] font-medium">
                    <Paperclip className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Chen_Clinic_Summary_Oct.pdf (1.4 MB)</span>
                  </div>

                  <button
                    onClick={() => setAcknowledged(!acknowledged)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      acknowledged
                        ? 'bg-[#00685f] text-white'
                        : 'bg-white border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{acknowledged ? 'Acknowledged by 3 of 4' : 'Acknowledge Note'}</span>
                  </button>
                </div>
              </div>

              {/* Second Critical Announcement: EMT Beacon Protocol */}
              {activeFilter === 'critical' && (
                <div className="p-6 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>EMT Emergency Protocol</span>
                    </span>
                    <span className="text-xs text-[#64748B]">Oct 19, 2024</span>
                  </div>
                  <h3 className="text-base font-bold text-[#081d2c]">
                    Providence St. Vincent EMT Rapid Entry & Keybox Update
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Gate access code <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-[#081d2c]">#4821</code> and front patio keybox PIN have been re-verified with Washington County EMS dispatch. In the event of a bedside fall alert, first responders have pre-authorized entry clearance.
                  </p>
                  <div className="text-[11px] text-[#64748B] flex items-center gap-2 pt-1 border-t border-[#F1F5F9]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified with Cascade Health Nursing Supervisor</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SEGMENT 2: MEDICAL VISITS */}
          {/* ======================================================== */}
          {(activeFilter === 'all' || activeFilter === 'medical') && (
            <div className="space-y-4">
              {activeFilter === 'medical' && (
                <div className="p-4 rounded-2xl bg-[#E1F0FF]/60 border border-[#CBD5E1] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="w-5 h-5 text-[#00685f]" />
                    <div>
                      <h3 className="text-xs font-bold text-[#081d2c]">Clinical Medical Visit Log</h3>
                      <p className="text-[11px] text-[#475569]">
                        Next visit: Dr. Christopher Chen on Oct 24 • Attending Cardiologist
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#00685f] bg-white px-2.5 py-1 rounded-lg border border-[#CBD5E1]">
                    EHR Synced
                  </span>
                </div>
              )}

              {/* Feed Card 1: Nurse Beth RN (Physical Therapy & Vitals) */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/images/nurse_beth_avatar_1792204257850.jpg"
                      alt="Nurse Beth RN"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#081d2c]">Nurse Beth RN</h3>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#E1F0FF] text-[#00685f]">
                          In-Home Nurse
                        </span>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Today at 11:30 AM • 45 min Physical Therapy & Vitals
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#081d2c]">
                    Morning Physical Therapy & Hydration Check-in
                  </h4>
                  <p className="text-xs text-[#081d2c] mt-1.5 leading-relaxed">
                    Eleanor was energetic and eager to head into the sunroom for physical therapy today! We completed 18 minutes of seated calf flexes and gentle balance reaches along the garden railing. Afterward, she drank a 12 oz lemon-infused electrolyte water with zero complaints. No shortness of breath or dizziness noted during standing transitions.
                  </p>
                </div>

                {/* Photo & Vitals side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-100 h-48">
                    <img
                      src="/src/assets/images/care_sunroom_activity_1792204248670.jpg"
                      alt="Garden sunroom stretches"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[11px] text-white font-medium flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Garden sunroom stretches (11:15 AM)</span>
                      </span>
                    </div>
                  </div>

                  {/* Logged Vitals Card */}
                  <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-[#0F766E]">
                        Logged Vitals
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" /> Normal Range
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-2.5 rounded-lg border border-[#CCFBF1]">
                        <div className="text-[10px] text-[#64748B]">Blood Pressure</div>
                        <div className="text-lg font-bold font-display text-[#081d2c]">122/80</div>
                        <div className="text-[10px] text-[#00685f]">mmHg • Seated</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-[#CCFBF1]">
                        <div className="text-[10px] text-[#64748B]">Heart Pulse</div>
                        <div className="text-lg font-bold font-display text-[#081d2c]">71</div>
                        <div className="text-[10px] text-[#00685f]">bpm • Steady</div>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-[#CCFBF1]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#64748B]">Hydration target: 48/64 oz</span>
                        <span className="font-bold text-[#00685f]">75% of Daily Goal</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-[#00685f] h-full rounded-full w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reactions & Comments bar */}
                <div className="pt-2 border-t border-[#F1F5F9] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike('note-feed-1')}
                        className="flex items-center gap-1 font-semibold text-[#00685f] hover:scale-105 transition-transform"
                      >
                        <Heart className="w-4 h-4 fill-[#00685f] text-[#00685f]" /> {likesState['note-feed-1']}
                      </button>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4 text-blue-600" /> 1
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-[11px]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{2 + (commentsState['note-feed-1']?.length || 0)} Comments</span>
                    </span>
                  </div>

                  {/* Threaded Comments */}
                  <div className="space-y-2 pt-1">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#081d2c]">
                        <span>David Vance</span>
                        <span className="text-[10px] text-slate-400 font-normal">11:48 AM</span>
                      </div>
                      <p className="text-[11px] text-[#475569]">
                        She looks wonderful in the sunroom! So glad the leg tightness subsided. Thanks Beth!
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#081d2c]">
                        <span>Sarah Vance</span>
                        <span className="text-[10px] text-slate-400 font-normal">12:02 PM</span>
                      </div>
                      <p className="text-[11px] text-[#475569]">
                        Praise God. I'll make sure she drinks another glass when I drop by with dinner tonight.
                      </p>
                    </div>

                    {(commentsState['note-feed-1'] || []).map((comm) => (
                      <div key={comm.id} className="p-3 rounded-xl bg-[#F8FAFC] text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#081d2c]">
                          <span>{comm.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{comm.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#475569]">{comm.text}</p>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add a quick reply to this check-in..."
                        value={quickReplies['note-feed-1'] || ''}
                        onChange={(e) => setQuickReplies({ ...quickReplies, 'note-feed-1': e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handlePostComment('note-feed-1')}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#00685f]"
                      />
                      <button
                        onClick={() => handlePostComment('note-feed-1')}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#00685f] text-white rounded-lg hover:bg-[#005049] cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Medical Card: Dr. Chen Pre-Visit Checklist */}
              {activeFilter === 'medical' && (
                <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        CC
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#081d2c]">Dr. Christopher Chen, MD</h4>
                        <div className="text-[11px] text-[#64748B]">Providence Heart Clinic • Attending Cardiology Note</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800">
                      Cardiology Consult
                    </span>
                  </div>

                  <p className="text-xs text-[#081d2c] leading-relaxed">
                    Pre-visit orders confirmed: 30-day BP log sheet to be reviewed at clinic. EKG lead check and serum potassium panel ordered to ensure tolerability of 20mg Lisinopril.
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9] text-xs">
                    <Paperclip className="w-3.5 h-3.5 text-[#00685f]" />
                    <span className="font-medium text-[#081d2c]">EKG_Baseline_Evaluation.pdf (890 KB)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SEGMENT 3: DAILY MOOD & VITALS */}
          {/* ======================================================== */}
          {(activeFilter === 'all' || activeFilter === 'vitals') && (
            <div className="space-y-4">
              {activeFilter === 'vitals' && (
                <div className="p-4 rounded-2xl bg-[#CCFBF1]/50 border border-[#99F6E4] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[#0F766E]" />
                    <div>
                      <h3 className="text-xs font-bold text-[#081d2c]">Today's Biometric & Mood Snapshot</h3>
                      <p className="text-[11px] text-[#0F766E]">
                        Mood: Cheerful & Alert • Seated BP: 122/80 mmHg • Rest: 7.5 hrs
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0F766E] text-white">
                    Optimal Range
                  </span>
                </div>
              )}

              {/* Feed Card 3: Marcus Vance (Video Call & Mood Recap) */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/images/marcus_vance_avatar_1792204257224.jpg"
                      alt="Marcus Vance"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#081d2c]">Marcus Vance</h3>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#EDE9FE] text-[#6D28D9]">
                          Bright & Alert
                        </span>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Son (Remote • Seattle) • 2 days ago • 35-min Video Call
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#081d2c]">
                    Sunday Afternoon Video Call Recap
                  </h4>
                  <p className="text-xs text-[#081d2c] mt-1.5 leading-relaxed">
                    Had the sweetest Sunday call with Mom on her iPad! Her voice was clear, lively, and in great humor. She spent 20 minutes reminiscing about old trips to Cape Cod and asked me to send framed prints of the grandchildren from our trip last August. Memory recall was sharp as a tack; she remembered everyone's upcoming birthdays without hesitation.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#E1F0FF]/50 border border-[#CBD5E1] text-xs flex items-start gap-2.5">
                  <Smile className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#00685f]">Cognitive & Mood Note</div>
                    <div className="text-[11px] text-[#081d2c] mt-0.5">
                      No signs of confusion or fatigue. Expressed excitement for Sarah's roast dinner this weekend.
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                  <button
                    onClick={() => handleLike('note-feed-3')}
                    className="flex items-center gap-1 font-semibold text-[#00685f] hover:scale-105 transition-transform"
                  >
                    <Heart className="w-4 h-4 fill-[#00685f] text-[#00685f]" /> {likesState['note-feed-3']}
                  </button>
                  <span className="text-[11px] text-slate-400">Viewed by all 4 family organizers</span>
                </div>
              </div>

              {/* Extra Vitals Card: Evening BP Reading */}
              {activeFilter === 'vitals' && (
                <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#00685f] text-white font-bold text-xs flex items-center justify-center">
                        SV
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#081d2c]">Sarah Vance</h4>
                        <div className="text-[11px] text-[#64748B]">Yesterday at 6:30 PM • Mandatory Evening BP Protocol</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Normal 124/82
                    </span>
                  </div>

                  <p className="text-xs text-[#081d2c] leading-relaxed">
                    Seated blood pressure measured before evening tea: <strong>124/82 mmHg</strong> (pulse 72 bpm). Eleanor tolerated her morning 20mg Lisinopril dose with no lightheadedness or postural dizziness when rising from the sofa.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* SEGMENT 4: ERRANDS & MEALS */}
          {/* ======================================================== */}
          {(activeFilter === 'all' || activeFilter === 'errands') && (
            <div className="space-y-4">
              {activeFilter === 'errands' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h3 className="text-xs font-bold text-emerald-950">Nutritional & Household Errand Log</h3>
                      <p className="text-[11px] text-emerald-800">
                        Pantry restocked • Peppermint tea in kitchen • Pharmacy pickup complete
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    Receipts Verified
                  </span>
                </div>
              )}

              {/* Feed Card 2: David Vance (Matching Image 5) */}
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/images/david_vance_avatar_1792204257121.jpg"
                      alt="David Vance"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#081d2c]">David Vance</h3>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                          Receipt Logged ($48.32)
                        </span>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Son / Local Caregiver • Yesterday at 4:45 PM • Grocery & Pharmacy Trip
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#081d2c]">
                    Safeway Grocery Run & Pharmacy Pickup Complete
                  </h4>
                  <p className="text-xs text-[#081d2c] mt-1.5 leading-relaxed">
                    Finished the weekly run to Safeway on 4th Avenue and picked up Eleanor's adjusted medication at the pharmacy counter. Mom specifically asked for decaf organic peppermint tea, which I placed in the top pantry cabinet right next to her favorite mug.
                  </p>
                </div>

                {/* Restocked checklist box */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Inventory Restocked & Placed in Kitchen
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Lisinopril 20mg 90-day bottle',
                      'Traditional Medicinals Peppermint Tea',
                      'Organic whole milk & Greek yogurt',
                      'Ensure Plus Vanilla (pack of 6)'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#081d2c]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00685f]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                  <button
                    onClick={() => handleLike('note-feed-2')}
                    className="flex items-center gap-1 font-semibold text-[#00685f] hover:scale-105 transition-transform"
                  >
                    <Heart className="w-4 h-4 fill-[#00685f] text-[#00685f]" /> {likesState['note-feed-2']}
                  </button>
                  <span className="text-[11px] text-[#15803D] font-medium">Receipt saved to Household Ledger</span>
                </div>
              </div>

              {/* Extra Errand Card: Sarah Vance Dinner Log */}
              {activeFilter === 'errands' && (
                <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#00685f] text-white font-bold text-xs flex items-center justify-center">
                        SV
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#081d2c]">Sarah Vance</h4>
                        <div className="text-[11px] text-[#64748B]">Oct 22 at 7:15 PM • Home-Cooked Dinner Log</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 flex items-center gap-1">
                      <Utensils className="w-3 h-3" />
                      Dinner Logged
                    </span>
                  </div>

                  <p className="text-xs text-[#081d2c] leading-relaxed">
                    Prepared wild-caught baked salmon with steamed asparagus and mashed sweet potatoes. Eleanor ate nearly her entire plate and thoroughly enjoyed her peppermint tea afterward. Bedtime vitamins taken with full 8 oz water.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar: Family Hug, Mood & Energy, Active Observers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Send a Family Hug Widget (Image 5 right top) */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#00685f] fill-[#00685f]" />
                <h3 className="font-bold text-sm text-[#081d2c]">Send a Family Hug</h3>
              </div>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Tap a warm sentiment to pop up on Eleanor's Hearthside bedside tablet right now.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleSendHug('Thinking of You 🌸')}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF4FD] hover:border-[#00685f] transition-all text-left group cursor-pointer"
              >
                <div className="text-xl">🌸</div>
                <div className="font-bold text-xs text-[#081d2c] mt-1">Thinking...</div>
                <div className="text-[10px] text-[#64748B] group-hover:text-[#00685f]">Tap to send</div>
              </button>

              <button
                onClick={() => handleSendHug('Big Hug 🤗')}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF4FD] hover:border-[#00685f] transition-all text-left group cursor-pointer"
              >
                <div className="text-xl">🤗</div>
                <div className="font-bold text-xs text-[#081d2c] mt-1">Big Hug</div>
                <div className="text-[10px] text-[#64748B] group-hover:text-[#00685f]">Tap to send</div>
              </button>

              <button
                onClick={() => handleSendHug('Sunny Day ☀️')}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF4FD] hover:border-[#00685f] transition-all text-left group cursor-pointer"
              >
                <div className="text-xl">☀️</div>
                <div className="font-bold text-xs text-[#081d2c] mt-1">Sunny ...</div>
                <div className="text-[10px] text-[#64748B] group-hover:text-[#00685f]">Tap to send</div>
              </button>

              <button
                onClick={() => handleSendHug('Tea Time 🫖')}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF4FD] hover:border-[#00685f] transition-all text-left group cursor-pointer"
              >
                <div className="text-xl">🫖</div>
                <div className="font-bold text-xs text-[#081d2c] mt-1">Tea Time</div>
                <div className="text-[10px] text-[#64748B] group-hover:text-[#00685f]">Tap to send</div>
              </button>
            </div>
          </div>

          {/* Mood & Energy Past 4 Days Evaluation */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00685f]" />
                <h3 className="font-bold text-sm text-[#081d2c]">Mood & Energy</h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                Optimal
              </span>
            </div>
            <div className="text-xs text-[#64748B]">Past 4 Days Evaluation</div>

            {/* Wave curve visualization */}
            <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1]">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="text-[#64748B]">Energy Index</span>
                <span className="font-bold text-[#0F766E]">Consistently Cheerful</span>
              </div>
              <svg className="w-full h-14" viewBox="0 0 200 60">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,45 Q50,20 100,30 T200,15 L200,60 L0,60 Z"
                  fill="url(#grad)"
                />
                <path
                  d="M0,45 Q50,20 100,30 T200,15"
                  fill="none"
                  stroke="#00685f"
                  strokeWidth="2.5"
                />
                <circle cx="200" cy="15" r="4" fill="#00685f" />
              </svg>
              <div className="flex justify-between text-[10px] text-[#64748B] pt-1">
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span className="font-bold text-[#00685f]">Today</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00685f]" /> Alertness & Engagement
                </span>
                <span className="font-bold text-[#081d2c]">High (9/10)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Appetite & Hydration
                </span>
                <span className="font-bold text-[#081d2c]">Steady (8/10)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span className="text-[#64748B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" /> Rest Quality
                </span>
                <span className="font-bold text-[#081d2c]">7.5 hrs uninterrupted</span>
              </div>
            </div>
          </div>

          {/* Active Observers Widget */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#081d2c]">Active Observers</h3>
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            </div>
            <div className="text-xs text-[#64748B]">Read Eleanor's feed today</div>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#00685f] text-white text-[10px] font-bold flex items-center justify-center">
                    SV
                  </span>
                  <div>
                    <div className="font-bold text-[#081d2c]">Sarah Vance</div>
                    <div className="text-[10px] text-[#00685f]">Active now • At residence</div>
                  </div>
                </div>
                <Eye className="w-3.5 h-3.5 text-[#00685f]" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center">
                    BN
                  </span>
                  <div>
                    <div className="font-bold text-[#081d2c]">Nurse Beth RN</div>
                    <div className="text-[10px] text-[#64748B]">Viewed 15 min ago</div>
                  </div>
                </div>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#17324D] text-white text-[10px] font-bold flex items-center justify-center">
                    DV
                  </span>
                  <div>
                    <div className="font-bold text-[#081d2c]">David Vance</div>
                    <div className="text-[10px] text-[#64748B]">Viewed 42 min ago</div>
                  </div>
                </div>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-600 text-white text-[10px] font-bold flex items-center justify-center">
                    MV
                  </span>
                  <div>
                    <div className="font-bold text-[#081d2c]">Marcus Vance</div>
                    <div className="text-[10px] text-[#64748B]">Viewed 2h ago • Seattle</div>
                  </div>
                </div>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Doctor Chen's office synced</span>
                <span className="font-semibold text-[#00685f]">Automated EHR Feed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
