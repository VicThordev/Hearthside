import React from 'react';
import {
  Calendar,
  Clock,
  Heart,
  AlertCircle,
  CheckCircle2,
  Users,
  MapPin,
  ChevronRight,
  Droplet,
  Activity,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Pill,
  Sparkles
} from 'lucide-react';
import { ScheduleEvent, CareNote, ViewMode } from '../../types';

interface OverviewViewProps {
  events: ScheduleEvent[];
  notes: CareNote[];
  onNavigate: (view: ViewMode) => void;
  onSelectEvent?: (event: ScheduleEvent) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  events,
  notes,
  onNavigate
}) => {
  const todayEvents = events.filter(e => e.day === 'thu');
  const criticalNote = notes.find(n => n.isCritical);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-[#F6F9FF]">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#00685f] to-[#008378] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-teal-300" />
            <span>Circle Health Status: Good • Live Sync Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight">
            Good afternoon, Sarah
          </h1>
          <p className="text-xs md:text-sm text-teal-100 max-w-xl leading-relaxed">
            Eleanor is resting comfortably in the garden sunroom after morning physical therapy with Nurse Beth. Her blood pressure is stable at 122/80.
          </p>
        </div>

        <div className="flex items-center gap-4 z-10 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-teal-200">Portland, OR</div>
            <div className="text-xl font-bold font-display">64°F • Mild</div>
          </div>
          <img
            src="/src/assets/images/eleanor_vance_portrait_1792204247616.jpg"
            alt="Eleanor Vance"
            className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Critical Rx Alert Card if present */}
      {criticalNote && (
        <div
          onClick={() => onNavigate('care-notes')}
          className="p-4 rounded-2xl bg-white border-2 border-red-200 shadow-sm hover:border-red-300 transition-all cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#081d2c]">{criticalNote.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-800">
                  Critical Rx Action
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">
                Lisinopril increased to 20mg morning. Mandatory seated BP check at 6:30 PM before evening tea.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </div>
      )}

      {/* 3 Overview Quick Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Schedule Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00685f]" />
                <h3 className="font-bold text-sm text-[#081d2c]">Today's Schedule</h3>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-semibold text-[#00685f] hover:underline"
              >
                View Hub
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {todayEvents.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => onNavigate('calendar')}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    evt.id === 'event-thu-2'
                      ? 'bg-[#00685f] text-white border-[#00685f]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#081d2c] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{evt.time}</span>
                    <span className={evt.id === 'event-thu-2' ? 'text-teal-200 text-[10px]' : 'text-slate-400 text-[10px]'}>
                      {evt.assigneeName}
                    </span>
                  </div>
                  <div className="font-bold mt-0.5 truncate">{evt.title}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('calendar')}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#D6EBFF] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Calendar & Appointments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Latest Vitals Snapshot */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#00685f]" />
                <h3 className="font-bold text-sm text-[#081d2c]">Vitals Snapshot</h3>
              </div>
              <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                Normal
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1]">
                <div className="text-[10px] text-[#64748B]">Blood Pressure</div>
                <div className="text-xl font-bold font-display text-[#081d2c] mt-0.5">122/80</div>
                <div className="text-[10px] text-[#00685f] mt-0.5">Seated • Steady</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1]">
                <div className="text-[10px] text-[#64748B]">Heart Rate</div>
                <div className="text-xl font-bold font-display text-[#081d2c] mt-0.5">71 bpm</div>
                <div className="text-[10px] text-[#00685f] mt-0.5">Regular rhythm</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mt-2.5 text-xs">
              <div className="flex justify-between text-[11px] text-[#64748B]">
                <span>Today's Hydration</span>
                <span className="font-bold text-[#00685f]">48 / 64 oz (75%)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00685f] h-full rounded-full w-3/4" />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('reports')}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#D6EBFF] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View 30-Day Trends</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Emergency & Vault Access */}
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00685f]" />
                <h3 className="font-bold text-sm text-[#081d2c]">Care Safeguards</h3>
              </div>
              <span className="text-[10px] font-semibold text-[#00685f] bg-[#E1F0FF] px-2 py-0.5 rounded-full">
                Preview only
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B]">Primary Emergency Contact</div>
                <div className="font-bold text-[#081d2c] text-sm mt-0.5">Sarah Vance (503-555-0192)</div>
                <div className="text-[10px] text-[#15803D] mt-0.5">Daughter • 5 miles away</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B]">Preferred Hospital</div>
                <div className="font-bold text-[#081d2c] text-sm mt-0.5">Providence St. Vincent</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">ER Summary Packet on file</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('vault')}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#D6EBFF] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Document Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
