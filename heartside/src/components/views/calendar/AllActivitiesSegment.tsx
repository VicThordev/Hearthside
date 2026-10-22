import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Pill,
  ShoppingBag,
  Heart,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  Search,
  Check,
  X,
  Share2,
  Printer,
  Sparkles,
  ShieldCheck,
  Phone,
  ArrowUpDown
} from 'lucide-react';
import { ScheduleEvent } from '../../../types';

interface AllActivitiesSegmentProps {
  onSelectEvent?: (eventId: string) => void;
  onNewEventClick?: () => void;
  selectedEventId?: string;
  viewMode?: 'week' | 'month' | 'agenda' | 'board';
  onViewModeChange?: (mode: 'week' | 'month' | 'agenda' | 'board') => void;
  selectedCaregiver?: string | null;
  onCaregiverChange?: (caregiver: string | null) => void;
}

export interface ActivityItem {
  id: string;
  title: string;
  domain: 'medical' | 'vitals' | 'transport' | 'errands' | 'social';
  domainLabel: string;
  domainColor: string;
  domainBg: string;
  domainBorder: string;
  date: string;
  dayOfWeek: string;
  time: string;
  assigneeName: string;
  assigneeRole: string;
  assigneeInitials: string;
  assigneeColor: string;
  location: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Pending Driver';
  isToday?: boolean;
  notes?: string;
  transportInfo?: string;
  isUrgent?: boolean;
}

export const AllActivitiesSegment: React.FC<AllActivitiesSegmentProps> = ({
  onSelectEvent,
  onNewEventClick,
  selectedEventId = 'event-thu-2',
  viewMode: controlledViewMode,
  onViewModeChange,
  selectedCaregiver: controlledCaregiver,
  onCaregiverChange
}) => {
  // Local state fallbacks if not controlled
  const [internalViewMode, setInternalViewMode] = useState<'week' | 'month' | 'agenda' | 'board'>('week');
  const [internalCaregiver, setInternalCaregiver] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const activeViewMode = controlledViewMode ?? internalViewMode;
  const setViewMode = (mode: 'week' | 'month' | 'agenda' | 'board') => {
    if (onViewModeChange) onViewModeChange(mode);
    setInternalViewMode(mode);
  };

  const activeCaregiver = controlledCaregiver !== undefined ? controlledCaregiver : internalCaregiver;
  const setCaregiver = (cg: string | null) => {
    if (onCaregiverChange) onCaregiverChange(cg);
    setInternalCaregiver(cg);
  };

  // Master all activities dataset
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'event-mon-1',
      title: 'Morning Vitals: BP, Pulse & Blood Glucose',
      domain: 'vitals',
      domainLabel: 'Medications & Vitals',
      domainColor: 'text-teal-700',
      domainBg: 'bg-teal-50',
      domainBorder: 'border-teal-200',
      date: 'Oct 21, 2024',
      dayOfWeek: 'MON',
      time: '8:30 AM – 9:00 AM',
      assigneeName: 'Nurse Beth, RN',
      assigneeRole: 'Providence Home Health',
      assigneeInitials: 'NB',
      assigneeColor: 'bg-teal-600',
      location: 'Eleanor\'s Home',
      status: 'Completed',
      notes: 'Blood pressure 128/78 mmHg, Glucose 106 mg/dL fasting.',
      isToday: false
    },
    {
      id: 'event-mon-2',
      title: 'Low-Sodium Meal Delivery & Pantry Prep',
      domain: 'errands',
      domainLabel: 'Groceries & Meals',
      domainColor: 'text-amber-700',
      domainBg: 'bg-amber-50',
      domainBorder: 'border-amber-200',
      date: 'Oct 21, 2024',
      dayOfWeek: 'MON',
      time: '1:00 PM – 2:00 PM',
      assigneeName: 'David Vance',
      assigneeRole: 'Family Helper',
      assigneeInitials: 'DV',
      assigneeColor: 'bg-slate-700',
      location: 'Eleanor\'s Home',
      status: 'Completed',
      notes: 'Delivered fresh organic produce and prepped 4 dinners.',
      isToday: false
    },
    {
      id: 'event-tue-1',
      title: 'Physical Therapy: Mobility & Balance Session',
      domain: 'medical',
      domainLabel: 'Therapy & Rehab',
      domainColor: 'text-blue-700',
      domainBg: 'bg-blue-50',
      domainBorder: 'border-blue-200',
      date: 'Oct 22, 2024',
      dayOfWeek: 'TUE',
      time: '10:00 AM – 11:00 AM',
      assigneeName: 'Michael Chang, DPT',
      assigneeRole: 'In-Home Physical Therapist',
      assigneeInitials: 'MC',
      assigneeColor: 'bg-blue-600',
      location: 'Living Room Rehab Area',
      status: 'Completed',
      notes: '15 min seated quad extensions, 10 min walker balance routine.',
      isToday: false
    },
    {
      id: 'event-wed-1',
      title: 'Morning Vitals & Compression Sock Assist',
      domain: 'vitals',
      domainLabel: 'Medications & Vitals',
      domainColor: 'text-teal-700',
      domainBg: 'bg-teal-50',
      domainBorder: 'border-teal-200',
      date: 'Oct 23, 2024',
      dayOfWeek: 'WED',
      time: '8:30 AM – 9:00 AM',
      assigneeName: 'Nurse Beth, RN',
      assigneeRole: 'Providence Home Health',
      assigneeInitials: 'NB',
      assigneeColor: 'bg-teal-600',
      location: 'Eleanor\'s Home',
      status: 'Completed',
      notes: 'BP 124/76 mmHg. Mild ankle edema noted, socks placed.',
      isToday: false
    },
    {
      id: 'event-wed-2',
      title: 'Walgreens Prescription Refill Pickup (Lisinopril)',
      domain: 'errands',
      domainLabel: 'Groceries & Errands',
      domainColor: 'text-amber-700',
      domainBg: 'bg-amber-50',
      domainBorder: 'border-amber-200',
      date: 'Oct 23, 2024',
      dayOfWeek: 'WED',
      time: '3:30 PM – 4:15 PM',
      assigneeName: 'Sarah Vance',
      assigneeRole: 'Family Organizer',
      assigneeInitials: 'SV',
      assigneeColor: 'bg-[#00685f]',
      location: 'Cedar Hills Walgreens Pharmacy #1042',
      status: 'Completed',
      notes: 'Rx #90422-A 90-day bottle collected and verified.',
      isToday: false
    },
    {
      id: 'event-thu-1',
      title: 'Morning Vitals & Medication Reminder Check',
      domain: 'vitals',
      domainLabel: 'Medications & Vitals',
      domainColor: 'text-teal-700',
      domainBg: 'bg-teal-50',
      domainBorder: 'border-teal-200',
      date: 'Oct 24, 2024',
      dayOfWeek: 'THU',
      time: '8:30 AM – 9:00 AM',
      assigneeName: 'Nurse Beth, RN',
      assigneeRole: 'Providence Home Health',
      assigneeInitials: 'NB',
      assigneeColor: 'bg-teal-600',
      location: 'Eleanor\'s Home',
      status: 'Completed',
      notes: 'BP 126/78 mmHg. Morning pills verified taken with oatmeal.',
      isToday: true
    },
    {
      id: 'event-thu-2',
      title: 'Dr. Christopher Chen Cardiology Follow-Up',
      domain: 'medical',
      domainLabel: 'Medical Appointment',
      domainColor: 'text-emerald-800',
      domainBg: 'bg-emerald-50',
      domainBorder: 'border-emerald-300',
      date: 'Oct 24, 2024',
      dayOfWeek: 'THU',
      time: '11:30 AM – 12:45 PM',
      assigneeName: 'Sarah Vance',
      assigneeRole: 'Driver & In-Clinic Companion',
      assigneeInitials: 'SV',
      assigneeColor: 'bg-[#00685f]',
      location: 'Providence Heart Clinic, St. Vincent Plaza',
      status: 'In Progress',
      notes: 'Bi-annual hypertension medication review, Lisinopril 20mg tolerability check.',
      transportInfo: 'Honda CR-V (Sarah driving) • Pickup 10:45 AM • Walker loaded',
      isToday: true,
      isUrgent: true
    },
    {
      id: 'event-thu-3',
      title: 'Weekly Family Video Call & Catch-Up',
      domain: 'social',
      domainLabel: 'Family & Social',
      domainColor: 'text-violet-700',
      domainBg: 'bg-violet-50',
      domainBorder: 'border-violet-200',
      date: 'Oct 24, 2024',
      dayOfWeek: 'THU',
      time: '4:00 PM – 4:45 PM',
      assigneeName: 'Marcus Vance',
      assigneeRole: 'Family Member (Zoom Host)',
      assigneeInitials: 'MV',
      assigneeColor: 'bg-violet-600',
      location: 'iPad in Living Room (Zoom ID: 882-901)',
      status: 'Scheduled',
      notes: 'Grandchildren joining to share school art projects.',
      isToday: true
    },
    {
      id: 'event-fri-1',
      title: 'Morning Vitals & Weight Log',
      domain: 'vitals',
      domainLabel: 'Medications & Vitals',
      domainColor: 'text-teal-700',
      domainBg: 'bg-teal-50',
      domainBorder: 'border-teal-200',
      date: 'Oct 25, 2024',
      dayOfWeek: 'FRI',
      time: '8:30 AM – 9:00 AM',
      assigneeName: 'Nurse Beth, RN',
      assigneeRole: 'Providence Home Health',
      assigneeInitials: 'NB',
      assigneeColor: 'bg-teal-600',
      location: 'Eleanor\'s Home',
      status: 'Scheduled',
      notes: 'Check for fluid retention post cardiology medication adjustment.',
      isToday: false
    },
    {
      id: 'event-fri-2',
      title: 'Housekeeping Assistance & Fresh Linens',
      domain: 'errands',
      domainLabel: 'Household Care',
      domainColor: 'text-amber-700',
      domainBg: 'bg-amber-50',
      domainBorder: 'border-amber-200',
      date: 'Oct 25, 2024',
      dayOfWeek: 'FRI',
      time: '2:00 PM – 3:30 PM',
      assigneeName: 'David Vance',
      assigneeRole: 'Family Helper',
      assigneeInitials: 'DV',
      assigneeColor: 'bg-slate-700',
      location: 'Eleanor\'s Home',
      status: 'Scheduled',
      notes: 'Vacuum living areas, sanitize bathroom handrails, wash bed linens.',
      isToday: false
    },
    {
      id: 'event-sat-1',
      title: 'Gentle Garden Stroll & Outdoor Sunshine',
      domain: 'social',
      domainLabel: 'Companion & Recreation',
      domainColor: 'text-violet-700',
      domainBg: 'bg-violet-50',
      domainBorder: 'border-violet-200',
      date: 'Oct 26, 2024',
      dayOfWeek: 'SAT',
      time: '10:30 AM – 11:30 AM',
      assigneeName: 'Sarah Vance',
      assigneeRole: 'Companion',
      assigneeInitials: 'SV',
      assigneeColor: 'bg-[#00685f]',
      location: 'Cedar Hills Community Rose Garden',
      status: 'Scheduled',
      notes: 'Wheelchair in trunk as backup; enjoy mild autumn morning.',
      isToday: false
    },
    {
      id: 'event-sun-1',
      title: 'Family Sunday Dinner & Pill Organizer Reset',
      domain: 'social',
      domainLabel: 'Family & Social',
      domainColor: 'text-violet-700',
      domainBg: 'bg-violet-50',
      domainBorder: 'border-violet-200',
      date: 'Oct 27, 2024',
      dayOfWeek: 'SUN',
      time: '12:30 PM – 3:00 PM',
      assigneeName: 'Sarah & David Vance',
      assigneeRole: 'Vance Family',
      assigneeInitials: 'SV',
      assigneeColor: 'bg-[#00685f]',
      location: 'Sarah\'s Home (Beaverton)',
      status: 'Scheduled',
      notes: 'Prepare weekly 7-day pill organizer dispenser for upcoming week.',
      transportInfo: 'David driving Eleanor at 12:00 PM • Return ride by Sarah at 3:15 PM',
      isToday: false
    },
    {
      id: 'event-next-thu',
      title: 'Quest Diagnostics Serum Potassium Blood Draw',
      domain: 'medical',
      domainLabel: 'Clinical Lab',
      domainColor: 'text-emerald-800',
      domainBg: 'bg-emerald-50',
      domainBorder: 'border-emerald-300',
      date: 'Oct 31, 2024',
      dayOfWeek: 'THU',
      time: '8:00 AM – 8:30 AM',
      assigneeName: 'David Vance',
      assigneeRole: 'Confirmed Driver',
      assigneeInitials: 'DV',
      assigneeColor: 'bg-slate-700',
      location: 'Quest Diagnostics Beaverton Outpatient Clinic',
      status: 'Scheduled',
      notes: '12-hour fasting required. Water only after 8:00 PM Wednesday.',
      transportInfo: 'Toyota RAV4 (David driving) • Pickup 7:25 AM',
      isToday: false
    }
  ]);

  // Form state for scheduling new activity
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState<'medical' | 'vitals' | 'transport' | 'errands' | 'social'>('medical');
  const [newDate, setNewDate] = useState('Today, Oct 24, 2024');
  const [newTime, setNewTime] = useState('2:00 PM – 3:00 PM');
  const [newAssignee, setNewAssignee] = useState('Sarah Vance');
  const [newLocation, setNewLocation] = useState('Eleanor\'s Home');
  const [newNotes, setNewNotes] = useState('');

  // Handle create activity
  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const domainConfig = {
      medical: { label: 'Medical Appointment', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-300' },
      vitals: { label: 'Medications & Vitals', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
      transport: { label: 'Transportation & Ride', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
      errands: { label: 'Groceries & Errands', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
      social: { label: 'Family & Social', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' }
    }[newDomain];

    const initials = newAssignee
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newActivityItem: ActivityItem = {
      id: `act-${Date.now()}`,
      title: newTitle.trim(),
      domain: newDomain,
      domainLabel: domainConfig.label,
      domainColor: domainConfig.color,
      domainBg: domainConfig.bg,
      domainBorder: domainConfig.border,
      date: newDate,
      dayOfWeek: 'THU',
      time: newTime,
      assigneeName: newAssignee,
      assigneeRole: 'Assigned Caregiver',
      assigneeInitials: initials || 'CG',
      assigneeColor: newAssignee.includes('Sarah') ? 'bg-[#00685f]' : newAssignee.includes('David') ? 'bg-slate-700' : 'bg-teal-600',
      location: newLocation || 'Eleanor\'s Residence',
      status: 'Scheduled',
      notes: newNotes,
      isToday: newDate.toLowerCase().includes('today') || newDate.includes('24')
    };

    setActivities(prev => [newActivityItem, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewNotes('');

    setCopiedNotification('Activity added to All Activities schedule!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Toggle activity completion
  const toggleActivityStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivities(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'Completed' ? 'Scheduled' : 'Completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Filtering activities
  const filteredActivities = activities.filter(act => {
    // Caregiver filter
    if (activeCaregiver) {
      if (activeCaregiver === 'SV' && !act.assigneeName.includes('Sarah')) return false;
      if (activeCaregiver === 'DV' && !act.assigneeName.includes('David')) return false;
      if (activeCaregiver === 'EV' && !act.location.includes('Eleanor') && !act.title.includes('Eleanor')) return false;
    }

    // Domain filter
    if (domainFilter !== 'all' && act.domain !== domainFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchAssignee = act.assigneeName.toLowerCase().includes(q);
      const matchLoc = act.location.toLowerCase().includes(q);
      const matchNotes = (act.notes || '').toLowerCase().includes(q);
      if (!matchTitle && !matchAssignee && !matchLoc && !matchNotes) return false;
    }

    return true;
  });

  // Calculate metrics
  const totalCount = activities.length;
  const todayCount = activities.filter(a => a.isToday).length;
  const completedCount = activities.filter(a => a.status === 'Completed').length;
  const activeTransportCount = activities.filter(a => a.transportInfo || a.domain === 'transport').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#081d2c] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border border-teal-500/30 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Segment Header Banner */}
      <div className="bg-gradient-to-r from-[#00685f] to-[#0a4d47] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>All Activities Unified Command</span>
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-white">
              All Care Activities & Master Schedule
            </h2>
            <p className="text-xs text-teal-100 leading-relaxed">
              Consolidated, real-time schedule for Eleanor Vance. Seamlessly coordinates clinical appointments, medication checks, transportation rides, grocery restocks, and family visits.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => {
                setCopiedNotification('Schedule exported to iCal & Google Calendar format');
                setTimeout(() => setCopiedNotification(null), 3000);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Sync Calendar</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#00685f] hover:bg-teal-50 transition-all shadow-sm flex items-center gap-2 cursor-pointer font-display"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Activity</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-teal-500/30">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-teal-200 font-medium">Total Scheduled</div>
            <div className="text-xl font-bold font-display mt-0.5 text-white">{totalCount} Activities</div>
            <div className="text-[10px] text-teal-300 mt-0.5">Across all 5 domains</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-teal-200 font-medium">Scheduled Today</div>
            <div className="text-xl font-bold font-display mt-0.5 text-white">{todayCount} Items</div>
            <div className="text-[10px] text-teal-300 mt-0.5">Thursday, Oct 24</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-teal-200 font-medium">Completed Log</div>
            <div className="text-xl font-bold font-display mt-0.5 text-white">{completedCount} Completed</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Verified by Care Circle</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-teal-200 font-medium">Rides & Transport</div>
            <div className="text-xl font-bold font-display mt-0.5 text-white">{activeTransportCount} Active</div>
            <div className="text-[10px] text-teal-300 mt-0.5">Drivers fully assigned</div>
          </div>
        </div>
      </div>

      {/* Safety & Collision Alert Banner */}
      <div className="p-3.5 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F766E]">Schedule Collision & Driver Protection Check Passed</div>
            <div className="text-[11px] text-[#115E59]">
              Zero time conflicts detected for today. Sarah Vance has a 45-minute buffer between Eleanor's cardiology appointment and afternoon check-in.
            </div>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#0F766E] bg-white px-2.5 py-1 rounded-full border border-[#99F6E4]">
          Live SafeTrack Active
        </span>
      </div>

      {/* Control Ribbon: Search, Domain Filter Tabs & View Modes */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>

            {[
              { id: 'all', label: 'All Activities', count: activities.length, color: 'bg-slate-900 text-white' },
              { id: 'medical', label: 'Medical Visits', count: activities.filter(a => a.domain === 'medical').length, color: 'bg-emerald-600 text-white' },
              { id: 'vitals', label: 'Vitals & Meds', count: activities.filter(a => a.domain === 'vitals').length, color: 'bg-teal-600 text-white' },
              { id: 'transport', label: 'Rides & Transit', count: activities.filter(a => a.domain === 'transport' || a.transportInfo).length, color: 'bg-blue-600 text-white' },
              { id: 'errands', label: 'Errands & Meals', count: activities.filter(a => a.domain === 'errands').length, color: 'bg-amber-600 text-white' },
              { id: 'social', label: 'Family & Social', count: activities.filter(a => a.domain === 'social').length, color: 'bg-violet-600 text-white' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDomainFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  domainFilter === tab.id
                    ? `${tab.color} shadow-xs ring-2 ring-slate-400/30`
                    : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  domainFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, caregiver, clinic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* View Mode Toggle Strip & Active Caregiver Tag */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#64748B]">Schedule Layout:</span>
            <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-xl border border-[#CBD5E1]">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeViewMode === 'week' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
              >
                7-Day Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeViewMode === 'month' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
              >
                Month Grid
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeViewMode === 'agenda' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
              >
                Chronological Agenda
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeViewMode === 'board' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
              >
                Status Board
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span>Showing <strong className="text-[#081d2c]">{filteredActivities.length}</strong> of {activities.length} activities</span>
            {activeCaregiver && (
              <span className="bg-[#CCFBF1] text-[#0F766E] font-semibold px-2 py-0.5 rounded-full text-[11px]">
                Caregiver: {activeCaregiver === 'SV' ? 'Sarah' : activeCaregiver === 'DV' ? 'David' : 'Eleanor'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* VIEW 1: 7-DAY WEEK GRID */}
      {activeViewMode === 'week' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-[#E2E8F0] text-center">
            {[
              { day: 'MON', date: '21', isToday: false },
              { day: 'TUE', date: '22', isToday: false },
              { day: 'WED', date: '23', isToday: false },
              { day: 'THU', date: '24', isToday: true, label: 'TODAY' },
              { day: 'FRI', date: '25', isToday: false },
              { day: 'SAT', date: '26', isToday: false },
              { day: 'SUN', date: '27', isToday: false },
            ].map((d) => (
              <div
                key={d.day}
                className={`py-3 px-2 border-r last:border-r-0 border-[#E2E8F0] ${
                  d.isToday ? 'bg-[#E1F0FF]/40' : 'bg-[#FAFCFF]'
                }`}
              >
                <div className="text-[11px] font-bold text-[#64748B] flex items-center justify-center gap-1">
                  {d.label && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#00685f] text-white rounded-full">
                      {d.label}
                    </span>
                  )}
                  <span>{d.day}</span>
                </div>
                <div className={`text-xl font-bold font-display mt-0.5 ${
                  d.isToday ? 'text-[#00685f]' : 'text-[#081d2c]'
                }`}>
                  {d.date}
                </div>
              </div>
            ))}
          </div>

          {/* Day Event Columns */}
          <div className="grid grid-cols-7 min-h-[460px] divide-x divide-[#E2E8F0] bg-white">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => {
              const dayActivities = filteredActivities.filter(a => a.dayOfWeek === day);
              const isTodayColumn = day === 'THU';

              return (
                <div
                  key={day}
                  className={`p-2 space-y-2.5 ${isTodayColumn ? 'bg-[#E1F0FF]/15' : ''}`}
                >
                  {dayActivities.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-300">
                      No activities
                    </div>
                  ) : (
                    dayActivities.map(act => {
                      const isSelected = selectedEventId === act.id;
                      const isCardiologySpecial = act.id === 'event-thu-2';

                      if (isCardiologySpecial) {
                        return (
                          <div
                            key={act.id}
                            onClick={() => onSelectEvent && onSelectEvent(act.id)}
                            className={`p-3 rounded-xl bg-[#00685f] text-white shadow-md cursor-pointer transition-all text-xs ring-2 ${
                              isSelected ? 'ring-teal-400 ring-offset-2' : 'ring-[#00685f]'
                            } transform hover:-translate-y-0.5`}
                          >
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold mb-1">
                              <Car className="w-3 h-3" />
                              <span>Ride Confirmed</span>
                            </div>
                            <div className="font-bold text-sm leading-tight text-white mt-0.5">
                              {act.title}
                            </div>
                            <div className="mt-2 text-[11px] text-teal-100 flex items-center gap-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{act.location}</span>
                            </div>
                            <div className="mt-1.5 pt-1.5 border-t border-teal-500/40 text-[11px] text-teal-100 flex items-center justify-between">
                              <span>Driver: {act.assigneeName}</span>
                              <span className="font-bold">→</span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={act.id}
                          onClick={() => onSelectEvent && onSelectEvent(act.id)}
                          className={`p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-[#00685f] ring-offset-1 border-[#00685f] bg-white shadow-sm'
                              : `${act.domainBg} ${act.domainBorder} hover:shadow-xs`
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-[#64748B]">
                            <span>{act.time.split('–')[0].trim()}</span>
                            {act.status === 'Completed' && (
                              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                <span>Done</span>
                              </span>
                            )}
                          </div>
                          <div className="font-semibold text-[#081d2c] leading-snug mt-1">
                            {act.title}
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-[11px]">
                            <span className="font-medium text-[#475569] truncate">
                              {act.assigneeName}
                            </span>
                            <button
                              onClick={(e) => toggleActivityStatus(act.id, e)}
                              className="text-[10px] text-slate-400 hover:text-emerald-600 p-0.5 cursor-pointer"
                              title="Toggle status"
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 ${act.status === 'Completed' ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MONTH GRID */}
      {activeViewMode === 'month' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div>
              <h3 className="font-bold text-base text-[#081d2c]">October 2024 Master Schedule</h3>
              <p className="text-xs text-[#64748B]">All activities mapped across calendar month</p>
            </div>
            <span className="text-xs font-semibold text-[#00685f] bg-[#E1F0FF] px-3 py-1 rounded-full border border-teal-200">
              {activities.length} Total Care Events
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="font-bold text-[11px] text-[#64748B] py-1">{d}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(dateNum => {
              const isTodayDate = dateNum === 24;
              const hasEvents = [21, 22, 23, 24, 25, 26, 27, 31].includes(dateNum);
              const eventCount = dateNum === 24 ? 3 : dateNum === 21 ? 2 : dateNum === 23 ? 2 : hasEvents ? 1 : 0;

              return (
                <div
                  key={dateNum}
                  onClick={() => {
                    if (dateNum === 24 && onSelectEvent) onSelectEvent('event-thu-2');
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isTodayDate
                      ? 'bg-[#00685f] text-white font-bold shadow-sm ring-2 ring-[#00685f] ring-offset-1'
                      : hasEvents
                      ? 'bg-[#F0FDFA] border-[#CCFBF1] text-[#081d2c] hover:border-teal-400'
                      : 'bg-white border-slate-100 text-[#64748B] hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{dateNum}</div>
                  {hasEvents && (
                    <div className="flex justify-center items-center gap-1 mt-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isTodayDate ? 'bg-white' : 'bg-[#00685f]'}`} />
                      {dateNum === 24 && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                      <span className={`text-[9px] font-mono font-bold ${isTodayDate ? 'text-teal-100' : 'text-teal-700'}`}>
                        {eventCount}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: CHRONOLOGICAL AGENDA */}
      {activeViewMode === 'agenda' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div>
              <h3 className="font-bold text-base text-[#081d2c]">Chronological Care Stream</h3>
              <p className="text-xs text-[#64748B]">All activities in chronological sequence</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold text-[#00685f] bg-[#E1F0FF] hover:bg-[#d0e7ff] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredActivities.map(act => (
              <div
                key={act.id}
                onClick={() => onSelectEvent && onSelectEvent(act.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 hover:shadow-xs ${
                  selectedEventId === act.id
                    ? 'border-[#00685f] bg-teal-50/40 ring-1 ring-[#00685f]'
                    : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${act.assigneeColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {act.assigneeInitials}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${act.domainBg} ${act.domainColor} border ${act.domainBorder}`}>
                        {act.domainLabel}
                      </span>
                      {act.isToday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          TODAY
                        </span>
                      )}
                      {act.isUrgent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Priority Focus
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-sm text-[#081d2c]">{act.title}</div>
                    <div className="text-xs text-[#64748B] flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.date} • {act.time}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{act.location}</span>
                      </span>
                    </div>
                    {act.notes && (
                      <div className="text-[11px] text-[#475569] bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {act.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-[#081d2c]">{act.assigneeName}</div>
                    <div className="text-[10px] text-[#64748B]">{act.assigneeRole}</div>
                  </div>
                  <button
                    onClick={(e) => toggleActivityStatus(act.id, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      act.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${act.status === 'Completed' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{act.status}</span>
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: STATUS BOARD (KANBAN) */}
      {activeViewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Column 1: Scheduled */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Scheduled</span>
              <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                {filteredActivities.filter(a => a.status === 'Scheduled').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredActivities.filter(a => a.status === 'Scheduled').map(act => (
                <div
                  key={act.id}
                  onClick={() => onSelectEvent && onSelectEvent(act.id)}
                  className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-1.5"
                >
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${act.domainBg} ${act.domainColor}`}>
                    {act.domainLabel}
                  </span>
                  <div className="font-bold text-xs text-[#081d2c] leading-tight">{act.title}</div>
                  <div className="text-[11px] text-[#64748B]">{act.date} • {act.time.split('–')[0]}</div>
                  <div className="text-[11px] font-medium text-teal-800 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>{act.assigneeName}</span>
                    <button
                      onClick={(e) => toggleActivityStatus(act.id, e)}
                      className="text-[10px] text-teal-600 hover:underline cursor-pointer"
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Active / Today */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <span className="font-bold text-xs text-emerald-900 uppercase tracking-wider">Today's Focus</span>
              <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                {filteredActivities.filter(a => a.isToday && a.status !== 'Completed').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredActivities.filter(a => a.isToday && a.status !== 'Completed').map(act => (
                <div
                  key={act.id}
                  onClick={() => onSelectEvent && onSelectEvent(act.id)}
                  className="p-3 bg-white border border-emerald-300 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-1.5 ring-1 ring-emerald-400/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      In-Flight
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">11:30 AM</span>
                  </div>
                  <div className="font-bold text-xs text-[#081d2c] leading-tight">{act.title}</div>
                  <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{act.location}</span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-900 pt-1 border-t border-emerald-100 flex items-center justify-between">
                    <span>Sarah Vance (Driver)</span>
                    <button
                      onClick={(e) => toggleActivityStatus(act.id, e)}
                      className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Transit & Rides */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200">
              <span className="font-bold text-xs text-blue-900 uppercase tracking-wider">Rides & Transit</span>
              <span className="text-[10px] font-mono font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">
                {filteredActivities.filter(a => a.transportInfo).length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredActivities.filter(a => a.transportInfo).map(act => (
                <div
                  key={act.id}
                  onClick={() => onSelectEvent && onSelectEvent(act.id)}
                  className="p-3 bg-white border border-blue-200 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-1.5"
                >
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
                    Vehicle Assigned
                  </span>
                  <div className="font-bold text-xs text-[#081d2c] leading-tight">{act.title}</div>
                  <div className="text-[11px] text-[#64748B] bg-blue-50 p-1.5 rounded-lg border border-blue-100">
                    {act.transportInfo}
                  </div>
                  <div className="text-[11px] font-medium text-blue-900 pt-1 flex items-center justify-between">
                    <span>{act.assigneeName}</span>
                    <span className="text-[10px] text-blue-700">Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Completed */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Completed</span>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {filteredActivities.filter(a => a.status === 'Completed').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredActivities.filter(a => a.status === 'Completed').map(act => (
                <div
                  key={act.id}
                  onClick={() => onSelectEvent && onSelectEvent(act.id)}
                  className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs opacity-85 hover:opacity-100 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      <span>Verified Done</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{act.date}</span>
                  </div>
                  <div className="font-bold text-xs text-[#081d2c] leading-tight line-through text-slate-500">
                    {act.title}
                  </div>
                  <div className="text-[10px] text-[#64748B]">{act.assigneeName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend & Preferences Footer */}
      <div className="flex items-center justify-between text-xs text-[#64748B] flex-wrap gap-2 pt-2 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00685f]" />
            <span>Clinical / Medical</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <span>Vitals & Therapy</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
            <span>Family & Social</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
            <span>Errands & Meals</span>
          </span>
        </div>

        <button
          onClick={() => {
            setCopiedNotification('Schedule preferences updated to Eleanor\'s standard timezone (PT)');
            setTimeout(() => setCopiedNotification(null), 3000);
          }}
          className="text-xs font-semibold text-[#00685f] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Customize Schedule Preferences</span>
        </button>
      </div>

      {/* MODAL: SCHEDULE NEW ACTIVITY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#081d2c]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00685f] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#081d2c]">Schedule Care Activity</h3>
                  <p className="text-[11px] text-[#64748B]">Add a visit, vital check, transport, or errand</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#081d2c] mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Miller Podiatry Check, Blood Pressure Log..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#081d2c] mb-1">Domain Category</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  >
                    <option value="medical">Medical Appointment</option>
                    <option value="vitals">Medication & Vitals</option>
                    <option value="transport">Transportation & Ride</option>
                    <option value="errands">Groceries & Household</option>
                    <option value="social">Family & Social</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#081d2c] mb-1">Assigned Caregiver</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  >
                    <option value="Sarah Vance">Sarah Vance (Family Organizer)</option>
                    <option value="David Vance">David Vance (Family Helper)</option>
                    <option value="Nurse Beth, RN">Nurse Beth, RN (Providence)</option>
                    <option value="Marcus Vance">Marcus Vance (Family)</option>
                    <option value="Michael Chang, DPT">Michael Chang (PT)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#081d2c] mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Today, Oct 24, 2024"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#081d2c] mb-1">Time Window</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 11:30 AM – 12:45 PM"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#081d2c] mb-1">Location / Venue</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Providence Heart Clinic or Eleanor's Home"
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                />
              </div>

              <div>
                <label className="block font-bold text-[#081d2c] mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Special instructions, transport needs, preparation..."
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#00685f] hover:bg-[#00524b] text-white transition-all shadow-xs cursor-pointer font-display"
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
