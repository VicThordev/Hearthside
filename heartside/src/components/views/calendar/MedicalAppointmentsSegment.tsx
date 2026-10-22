import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Car,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  User,
  Plus,
  Phone,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ScheduleEvent } from '../../../types';

interface MedicalAppointmentsSegmentProps {
  onSelectEvent?: (eventId: string) => void;
  onNewAppointment?: () => void;
}

export const MedicalAppointmentsSegment: React.FC<MedicalAppointmentsSegmentProps> = ({
  onSelectEvent,
  onNewAppointment
}) => {
  const [checklist, setChecklist] = useState<{ [id: string]: boolean }>({
    c1: true,
    c2: false,
    c3: false,
    c4: false
  });

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const appointments = [
    {
      id: 'event-thu-2',
      title: 'Dr. Christopher Chen Cardiology Follow-Up',
      specialty: 'Attending Cardiologist',
      clinic: 'Providence Heart Clinic - West Pavilion',
      address: 'Suite 410, 9155 SW Barnes Rd, Portland, OR 97225',
      date: 'Today, Oct 24, 2024',
      time: '11:30 AM – 12:45 PM (45 min duration)',
      status: 'Confirmed',
      priority: 'Urgent Priority',
      driver: 'Sarah Vance (Confirmed)',
      phone: '(503) 216-2188',
      description: 'Bi-annual hypertension review, Lisinopril 20mg tolerability evaluation, and baseline EKG check.',
      attachedDoc: 'Chen_Cardiology_Summary_Oct.pdf',
      attachedDocSize: '1.4 MB',
      isToday: true
    },
    {
      id: 'app-2',
      title: 'Quest Diagnostics Serum Potassium & Kidney Panel',
      specialty: 'Clinical Laboratory Draw',
      clinic: 'Quest Diagnostics Beaverton Outpatient Center',
      address: '11795 SW 4th St, Beaverton, OR 97005',
      date: 'Thursday, Oct 31, 2024',
      time: '8:00 AM – 8:30 AM',
      status: 'Scheduled',
      priority: 'Lab Requirement',
      driver: 'David Vance (Confirmed)',
      phone: '(503) 641-7100',
      description: 'Fasting 12-hour blood draw ordered by Dr. Chen to monitor serum potassium response to Lisinopril 20mg.',
      attachedDoc: 'Quest_Requisition_Order_9042.pdf',
      attachedDocSize: '620 KB',
      isToday: false
    },
    {
      id: 'app-3',
      title: 'Dr. Sarah Miller Senior Podiatry Examination',
      specialty: 'Podiatric Medicine & Foot Health',
      clinic: 'Providence Beaverton Outpatient Health Center',
      address: '12350 SW Barnes Rd, Suite 210, Portland, OR 97225',
      date: 'Tuesday, Nov 12, 2024',
      time: '2:00 PM – 2:45 PM',
      status: 'Confirmed',
      priority: 'Routine Preventive',
      driver: 'David Vance (Standby)',
      phone: '(503) 216-5400',
      description: 'Senior circulation check, neuropathy sensory response evaluation, and diabetic foot preventive care.',
      attachedDoc: 'Podiatry_Annual_Directives.pdf',
      attachedDocSize: '840 KB',
      isToday: false
    },
    {
      id: 'app-4',
      title: 'Walgreens Senior Immunization Clinic (Flu & RSV)',
      specialty: 'Preventive Vaccines',
      clinic: 'Cedar Hills Walgreens Pharmacy Clinic #1042',
      address: '14600 SW Farmington Rd, Beaverton, OR 97007',
      date: 'Tuesday, Nov 19, 2024',
      time: '10:15 AM – 10:45 AM',
      status: 'Booked',
      priority: 'Seasonal Preventive',
      driver: 'Sarah Vance',
      phone: '(503) 644-8452',
      description: 'Annual high-dose Fluzone senior vaccine and Arexvy RSV booster. Pharmacist J. Miller on record.',
      isToday: false
    },
    {
      id: 'app-5',
      title: 'Cascade Health In-Home Nursing Recertification',
      specialty: 'Home Health Nursing Triage',
      clinic: "Eleanor's Residence • Living Room",
      address: '1420 SW Westwood Dr, Portland, OR 97239',
      date: 'Wednesday, Nov 27, 2024',
      time: '9:00 AM – 10:00 AM',
      status: 'Confirmed',
      priority: 'Quarterly Audit',
      driver: 'In-Home Visit (Nurse Beth RN)',
      phone: '(503) 555-0199',
      description: 'Medicare-mandated 60-day home health plan recertification, mobility assessment, and medication reconciliation.',
      isToday: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50/70 via-white to-teal-50/50 border border-red-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-display text-[#081d2c]">
                  Clinical Appointments & Physician Schedule
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                  5 Scheduled
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Centralized medical appointments, in-clinic logistics, physician orders, and transportation confirmations for Eleanor Vance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewAppointment}
              className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Doctor Visit</span>
            </button>
          </div>
        </div>

        {/* Clinical High-Level Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Next Clinic Visit</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">Today at 11:30 AM</span>
            <span className="text-[10px] text-[#00685f] font-medium">Dr. Christopher Chen</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Primary Facility</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">St. Vincent Plaza</span>
            <span className="text-[10px] text-[#64748B]">West Pavilion Suite 410</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Required Document</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">30-Day BP Log Sheet</span>
            <span className="text-[10px] text-emerald-700 font-medium">Ready in Vault</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Emergency Hospital</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">Providence St. Vincent</span>
            <span className="text-[10px] text-[#00685f] font-medium">14 min direct EMT route</span>
          </div>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        {appointments.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectEvent?.(item.id)}
            className={`p-6 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
              item.isToday
                ? 'border-[#00685f] ring-2 ring-[#00685f]/20'
                : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.isToday ? 'bg-red-100 text-red-800' : 'bg-[#E1F0FF] text-[#00685f]'
                  }`}>
                    {item.priority}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium">{item.specialty}</span>
                </div>
                <h3 className="font-bold text-base text-[#081d2c] font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-[#475569]">{item.clinic}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <div className="text-[11px] text-[#64748B] font-semibold mt-1">
                  {item.time}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#334155] leading-relaxed pt-3 border-t border-[#F1F5F9] mt-3">
              {item.description}
            </p>

            {/* Logistics & Drivers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
              <div className="flex items-start gap-2 text-[#475569]">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{item.address}</span>
              </div>
              <div className="flex items-center gap-2 text-[#475569]">
                <Car className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
                <span><strong>Transport:</strong> {item.driver}</span>
              </div>
            </div>

            {/* Document attachment & action footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F1F5F9] mt-3">
              {item.attachedDoc ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#081d2c] font-medium">
                  <FileText className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>{item.attachedDoc} ({item.attachedDocSize})</span>
                </div>
              ) : (
                <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>Clinic switchboard: {item.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${item.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#081d2c] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3 h-3 text-[#64748B]" />
                  <span>Call Clinic</span>
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Opening GPS navigation route to ${item.clinic}`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#E1F0FF] text-xs font-semibold text-[#00685f] hover:bg-[#d0e7ff] transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
