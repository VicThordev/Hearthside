import React, { useState } from 'react';
import {
  Pill,
  Activity,
  Droplet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  User,
  Heart,
  Plus,
  FileCheck2,
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';

interface MedicationsVitalsSegmentProps {
  onLogVitals?: () => void;
}

export const MedicationsVitalsSegment: React.FC<MedicationsVitalsSegmentProps> = ({
  onLogVitals
}) => {
  const [loggedToday, setLoggedToday] = useState(true);

  const scheduleItems = [
    {
      id: 'mv-1',
      time: '8:30 AM',
      frequency: 'Daily Morning Routine',
      title: 'Morning Medication & 12 oz Lemon Electrolyte Water',
      caregiver: 'Nurse Beth RN (Mon/Wed/Fri) • Sarah (Tue/Thu/Sat/Sun)',
      category: 'Medication Administration',
      status: 'Completed Today',
      medications: [
        { name: 'Lisinopril', dose: '20 mg', instructions: 'With full glass of water. New dosage adjustment.' },
        { name: 'Calcium Citrate + Vit D3', dose: '600 mg / 400 IU', instructions: 'Bone density support.' },
        { name: 'CoQ10 (Ubiquinol)', dose: '100 mg', instructions: 'Cardiovascular cellular health.' }
      ],
      notes: 'Ensure Eleanor is fully awake and sitting upright before swallowing morning tablets.'
    },
    {
      id: 'mv-2',
      time: '11:15 AM – 11:45 AM',
      frequency: 'Mon / Wed / Fri',
      title: 'In-Home Physical Therapy & Sunroom Mobility',
      caregiver: 'Nurse Beth RN (Cascade Health)',
      category: 'Physical Therapy & Exercise',
      status: 'Completed Today',
      medications: [],
      notes: '18 minutes of gentle seated calf flexes, ankle rolls, and light railing reaches in the south sunroom. Followed by 12 oz hydration.'
    },
    {
      id: 'mv-3',
      time: '6:30 PM Sharp',
      frequency: 'Mandatory Daily Protocol',
      title: 'Mandatory Seated Blood Pressure & Heart Rate Log',
      caregiver: 'Sarah Vance (Primary Organizer)',
      category: 'Critical Vital Check',
      status: 'Pending Today (Scheduled)',
      medications: [],
      notes: 'Record after 5 minutes of quiet resting before evening tea. If systolic >140 or diastolic >90 mmHg, message Sarah Vance and Nurse Beth immediately.'
    },
    {
      id: 'mv-4',
      time: '9:15 PM',
      frequency: 'Daily Bedtime Routine',
      title: 'Evening Hydration, Nightstand Lamp & Bedside Tablet Dimming',
      caregiver: 'David Vance / Sarah Vance',
      category: 'Rest & Sleep Prep',
      status: 'Upcoming Tonight',
      medications: [
        { name: 'Melatonin (Micro-dose)', dose: '1 mg', instructions: 'Optional if restless. Check with Sarah first.' }
      ],
      notes: 'Place fresh water carafe on master bedroom nightstand. Hearthside Bedside Frame switches to night dim mode at 9:30 PM.'
    },
    {
      id: 'mv-5',
      time: 'Sundays at 3:00 PM',
      frequency: 'Weekly Sunday Protocol',
      title: '7-Day Pill Organizer Refill & Safety Audit',
      caregiver: 'Sarah Vance',
      category: 'Weekly Medication Audit',
      status: 'Recurring Sunday',
      medications: [],
      notes: 'Audit 90-day Lisinopril supply, check expiration dates, and verify morning vs evening compartments for the coming week.'
    },
    {
      id: 'mv-6',
      time: 'Thursday Oct 31 • 8:00 AM',
      frequency: 'Scheduled Lab Test',
      title: 'Serum Potassium & Creatinine Blood Draw',
      caregiver: 'Quest Diagnostics Beaverton • Escort: David Vance',
      category: 'Clinical Lab Verification',
      status: 'Scheduled',
      medications: [],
      notes: '12-hour fasting panel ordered by Dr. Christopher Chen to confirm kidney tolerability of 20mg Lisinopril.'
    },
    {
      id: 'mv-7',
      time: 'Thursday Oct 24 • 8:30 AM',
      frequency: 'Morning Vitals',
      title: 'Post-Therapy Baseline BP & SpO2 Measurement',
      caregiver: 'Nurse Beth RN',
      category: 'Clinical Vitals',
      status: 'Completed: 122/80 mmHg',
      medications: [],
      notes: 'Recorded reading: 122/80 mmHg, pulse 71 bpm steady, oxygen saturation 98% on room air. Normal range.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-50/70 via-white to-blue-50/50 border border-teal-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0 shadow-xs">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-display text-[#081d2c]">
                  Medications & Daily Vitals Protocol
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#CCFBF1] text-[#0F766E] uppercase">
                  7 Active Routines
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Prescription handoff schedule, blood pressure tracking logs, and hydration targets for Eleanor Vance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Opening Vitals Entry Dialog: Log Seated Blood Pressure & Pulse for Eleanor')}
              className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Log Vitals Reading</span>
            </button>
          </div>
        </div>

        {/* Biometrics Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Latest Seated BP</span>
            <span className="font-bold text-lg font-display text-[#081d2c] mt-0.5 block">122/80</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Normal Seated Range
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Resting Heart Pulse</span>
            <span className="font-bold text-lg font-display text-[#081d2c] mt-0.5 block">71 bpm</span>
            <span className="text-[10px] text-[#00685f] font-semibold">Regular & Steady</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Daily Hydration Target</span>
            <span className="font-bold text-lg font-display text-[#081d2c] mt-0.5 block">48 / 64 oz</span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-[#00685f] h-full rounded-full w-3/4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Critical Dose Protocol</span>
            <span className="font-bold text-base font-display text-[#081d2c] mt-0.5 block">Lisinopril 20mg</span>
            <span className="text-[10px] text-purple-700 font-medium">Morning dose with water</span>
          </div>
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {scheduleItems.map((item, index) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E1F0FF] text-[#00685f]">
                  {item.category}
                </span>
                <span className="text-xs text-[#64748B] font-medium">{item.frequency}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-[#081d2c] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                  {item.time}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  item.status.includes('Completed')
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-base text-[#081d2c] font-display">
              {item.title}
            </h3>

            <p className="text-xs text-[#475569] leading-relaxed">
              {item.notes}
            </p>

            {/* Prescriptions List if any */}
            {item.medications.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 mt-2">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Medication Dispenser Instructions:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  {item.medications.map((med, mIdx) => (
                    <div key={mIdx} className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="font-bold text-[#081d2c]">{med.name}</div>
                      <div className="text-[11px] font-semibold text-[#00685f]">{med.dose}</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">{med.instructions}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#F1F5F9] text-xs text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>Supervised by:</strong> {item.caregiver}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Confirmed handoff: ${item.title}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-semibold text-[#081d2c] transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verify Handoff</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
