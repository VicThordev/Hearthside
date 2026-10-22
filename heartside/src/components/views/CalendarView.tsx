import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Car,
  FileText,
  Share2,
  Edit2,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Download,
  Plus,
  Lightbulb,
  Check,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { ScheduleEvent } from '../../types';
import { AllActivitiesSegment } from './calendar/AllActivitiesSegment';
import { MedicalAppointmentsSegment } from './calendar/MedicalAppointmentsSegment';
import { MedicationsVitalsSegment } from './calendar/MedicationsVitalsSegment';
import { TransportationRidesSegment } from './calendar/TransportationRidesSegment';
import { GroceriesErrandsSegment } from './calendar/GroceriesErrandsSegment';

interface CalendarViewProps {
  events: ScheduleEvent[];
  onSelectEvent?: (event: ScheduleEvent) => void;
  onNewEventClick: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onNewEventClick
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'medical' | 'vitals' | 'transport' | 'errands'>('all');
  const [selectedCaregiver, setSelectedCaregiver] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'agenda' | 'board'>('week');
  const [selectedEventId, setSelectedEventId] = useState<string>('event-thu-2');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState('Google & Outlook Synced 4m ago');
  const [checklistState, setChecklistState] = useState<{ [id: string]: boolean }>({
    c1: true,
    c2: false,
    c3: false
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[5];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice('Google & Outlook Synced just now');
    }, 900);
  };

  const handleExportIcs = () => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Hearthside//Eleanor Vance Care Circle//EN\nBEGIN:VEVENT\nSUMMARY:Dr. Chen Cardiology Follow-Up\nLOCATION:St. Vincent Medical Plaza, Suite 410, Portland, OR\nDTSTART:20241024T183000Z\nDTEND:20241024T194500Z\nDESCRIPTION:Bi-annual hypertension medication review and EKG scan.\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Eleanor_Vance_Care_Schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredEvents = events.filter(e => {
    if (activeTab === 'all') return true;
    if (activeTab === 'medical') return e.category === 'medical';
    if (activeTab === 'vitals') return e.category === 'vitals';
    if (activeTab === 'transport') return e.category === 'transport' || e.isRideConfirmed;
    if (activeTab === 'errands') return e.category === 'errands';
    return true;
  });

  const readyChecklistCount = Object.values(checklistState).filter(Boolean).length;

  const isMatch = (category: string, initials?: string) => {
    const matchesCategory = activeTab === 'all' || activeTab === category;
    const matchesCaregiver = !selectedCaregiver || selectedCaregiver === initials;
    return matchesCategory && matchesCaregiver;
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-[#F6F9FF]">
      {/* Main Calendar View Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00685f]">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span>Hearthside Coordination Hub • Live Sync Enabled</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
              Care Schedule & Task Hub
            </h1>
            <div className="flex items-center gap-2 text-xs md:text-sm text-[#64748B] mt-1 font-medium">
              <span className="font-semibold text-[#00685f]">Eleanor Vance</span>
              <span>•</span>
              <span>Week of Oct 21 – Oct 27, 2024</span>
              <span className="px-2 py-0.5 rounded-md bg-[#E1F0FF] text-[#00685f] text-xs font-semibold">
                Portland (PDT)
              </span>
            </div>
          </div>

          {/* Sync & Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSync}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#081d2c] bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00685f] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncNotice}</span>
            </button>

            <button
              onClick={handleExportIcs}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#081d2c] bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export .ics</span>
            </button>

            <button
              onClick={onNewEventClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Event / Task</span>
            </button>
          </div>
        </div>

        {/* Openly Created Navigation & Activity Category Toolbar Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 shrink-0">
          {/* Row 1: View Modes & Caregiver Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* View Mode Segmented Controls */}
            <div className="inline-flex p-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl self-start">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'week' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Week View</span>
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'month' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
              >
                <span>Month</span>
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'agenda' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
              >
                <span>Agenda</span>
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'board' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
              >
                <span>Task Board</span>
              </button>
            </div>

            {/* Caregiver Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Caregiver Filters:
              </span>
              <button
                onClick={() => setSelectedCaregiver(selectedCaregiver === 'EV' ? null : 'EV')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCaregiver === 'EV'
                    ? 'bg-[#CCFBF1] text-[#0F766E] border-[#0D9488] ring-2 ring-[#0D9488]/30'
                    : 'bg-white text-[#081d2c] border-[#CBD5E1] hover:border-slate-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#15803D] text-white flex items-center justify-center text-[10px] font-bold">
                  EV
                </span>
                <span>Eleanor (Recipient)</span>
              </button>
              <button
                onClick={() => setSelectedCaregiver(selectedCaregiver === 'SV' ? null : 'SV')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCaregiver === 'SV'
                    ? 'bg-[#CCFBF1] text-[#0F766E] border-[#0D9488] ring-2 ring-[#0D9488]/30'
                    : 'bg-white text-[#081d2c] border-[#CBD5E1] hover:border-slate-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#00685f] text-white flex items-center justify-center text-[10px] font-bold">
                  SV
                </span>
                <span>Sarah (Organizer)</span>
              </button>
              <button
                onClick={() => setSelectedCaregiver(selectedCaregiver === 'DV' ? null : 'DV')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCaregiver === 'DV'
                    ? 'bg-[#CCFBF1] text-[#0F766E] border-[#0D9488] ring-2 ring-[#0D9488]/30'
                    : 'bg-white text-[#081d2c] border-[#CBD5E1] hover:border-slate-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#17324D] text-white flex items-center justify-center text-[10px] font-bold">
                  DV
                </span>
                <span>David (Helper)</span>
              </button>
              {selectedCaregiver && (
                <button
                  onClick={() => setSelectedCaregiver(null)}
                  className="text-[11px] text-[#64748B] hover:text-[#081d2c] underline ml-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Clean Divider */}
          <div className="border-t border-[#F1F5F9]" />

          {/* Row 2: Activity Category Filters (Circled area - Fully visible, generous spacing & height) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 shrink-0 no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-2xs ${
                activeTab === 'all'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <span>All Activities</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
              }`}>
                24
              </span>
            </button>

            <button
              onClick={() => setActiveTab('medical')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-2xs ${
                activeTab === 'medical'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span>Medical Appointments</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'medical' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-800'
              }`}>
                5
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vitals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-2xs ${
                activeTab === 'vitals'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
              <span>Medications & Vitals</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'vitals' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
              }`}>
                7
              </span>
            </button>

            <button
              onClick={() => setActiveTab('transport')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-2xs ${
                activeTab === 'transport'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <span>Transportation & Rides</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'transport' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
              }`}>
                4
              </span>
            </button>

            <button
              onClick={() => setActiveTab('errands')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-2xs ${
                activeTab === 'errands'
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span>Groceries & Errands</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'errands' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                5
              </span>
            </button>
          </div>
        </div>

        {/* All Activities Segment */}
        {activeTab === 'all' && (
          <AllActivitiesSegment
            onSelectEvent={(eventId) => setSelectedEventId(eventId)}
            onNewEventClick={onNewEventClick}
            selectedEventId={selectedEventId}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCaregiver={selectedCaregiver}
            onCaregiverChange={setSelectedCaregiver}
          />
        )}

        {/* Medical Appointments Segment */}
        {activeTab === 'medical' && (
          <MedicalAppointmentsSegment
            onSelectEvent={(eventId) => setSelectedEventId(eventId)}
            onNewAppointment={onNewEventClick}
          />
        )}

        {/* Medications & Vitals Segment */}
        {activeTab === 'vitals' && (
          <MedicationsVitalsSegment />
        )}

        {/* Transportation & Rides Segment */}
        {activeTab === 'transport' && (
          <TransportationRidesSegment
            onScheduleRide={onNewEventClick}
          />
        )}

        {/* Groceries & Errands Segment */}
        {activeTab === 'errands' && (
          <GroceriesErrandsSegment
            onAddErrand={onNewEventClick}
          />
        )}
      </div>

      {/* Right Event Detail Sidebar (Image 1 right panel) */}
      {(activeTab === 'all' || activeTab === 'medical') && (
        <div className="w-full xl:w-[420px] bg-white border-t xl:border-t-0 xl:border-l border-[#E2E8F0] p-6 overflow-y-auto space-y-6 shrink-0">
        {/* Top actions & badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E1F0FF] text-[#00685f] border border-[#CBD5E1]/50">
            <CheckCircle className="w-3.5 h-3.5 text-[#00685f]" />
            <span>Medical Appointment</span>
          </span>
          <div className="flex items-center gap-1 text-[#64748B]">
            <button className="p-1.5 hover:text-[#081d2c] hover:bg-slate-100 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:text-[#081d2c] hover:bg-slate-100 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h2 className="text-2xl font-bold font-display text-[#081d2c] tracking-tight">
            {selectedEvent.title}
          </h2>
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
            {selectedEvent.description || 'Bi-annual hypertension medication review and EKG scan.'}
          </p>
        </div>

        {/* Time Card */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E1F0FF] text-[#00685f] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#081d2c]">
              Today, Oct 24 • 11:30 AM – 12:45 PM
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">
              Pacific Daylight Time (45 min duration)
            </div>
          </div>
        </div>

        {/* Location & Map Card */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#081d2c]">St. Vincent Medical Plaza</div>
              <div className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                Suite 410, West Pavilion, 9155 SW Barnes Rd, Portland, OR
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#00685f] hover:underline"
              >
                <span>Open in Maps / Get Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Map Snapshot */}
          <div className="relative rounded-xl overflow-hidden border border-[#CBD5E1] h-32 bg-slate-100">
            <img
              src="/src/assets/images/portland_care_route_map_1792204249066.jpg"
              alt="Route to St. Vincent Plaza"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081d2c]/80 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[11px] font-medium text-white flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-teal-300" />
                <span>14 mins away from Eleanor's Residence</span>
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Logistics & Transport */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Assigned Logistics & Transport
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#00685f] text-white font-bold text-xs flex items-center justify-center shrink-0">
                SV
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#081d2c] truncate">Sarah Vance</div>
                <div className="text-[11px] text-[#64748B] truncate">Primary Driver & In-Clinic Companion</div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] shrink-0">
              Confirmed
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#17324D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                DV
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#081d2c] truncate">David Vance</div>
                <div className="text-[11px] text-[#64748B] truncate">Backup Driver / On Standby</div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 shrink-0">
              Standby
            </span>
          </div>
        </div>

        {/* Preparation Checklist */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            <span>Preparation Checklist</span>
            <span className="text-[#00685f] font-mono">{readyChecklistCount} of 3 Ready</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'c1', text: 'Bring Medicare Card & Supplemental ID' },
              { id: 'c2', text: 'Review & hand over 30-day BP log sheet' },
              { id: 'c3', text: 'Discuss morning dizziness with 20mg Lisinopril dosage' },
            ].map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checklistState[item.id]}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="mt-0.5 w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f] border-slate-300"
                />
                <span className={`text-xs ${checklistState[item.id] ? 'line-through text-[#64748B]' : 'text-[#081d2c] font-medium'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Attached Clinical Documents */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Attached Clinical Documents
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#E1F0FF] text-[#00685f] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#081d2c] truncate">
                  Recent_Cardiology_Rep...
                </div>
                <div className="text-[10px] text-[#64748B]">
                  1.4 MB • Uploaded by Nurse Beth
                </div>
              </div>
            </div>
            <button
              onClick={() => alert('Downloading Recent_Cardiology_Report_2024.pdf')}
              className="p-1.5 text-[#00685f] hover:bg-teal-50 rounded-lg transition-colors shrink-0"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => setIsCompleted(!isCompleted)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                : 'bg-[#00685f] hover:bg-[#005049] text-white shadow-sm'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => alert('Reschedule modal opened')}
              className="py-2 px-3 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#081d2c] hover:bg-slate-50 transition-colors"
            >
              Reschedule
            </button>
            <button
              onClick={() => alert('Care Circle notified via SMS & push')}
              className="py-2 px-3 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#081d2c] hover:bg-slate-50 transition-colors"
            >
              Notify Circle
            </button>
          </div>
        </div>

        {/* Care Circle Tip for Today */}
        <div className="p-3.5 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F766E]">
            <Lightbulb className="w-4 h-4 text-[#0D9488]" />
            <span>Care Circle Tip for Today</span>
          </div>
          <p className="text-[11px] text-[#0F766E]/90 leading-relaxed">
            Eleanor noted feeling fatigued after midday transit. Remember to pack her hydration tumbler and allow a 15-minute rest period upon returning home.
          </p>
        </div>
      </div>
      )}
    </div>
  );
};
