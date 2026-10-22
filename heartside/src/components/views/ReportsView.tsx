import React from 'react';
import {
  BarChart3,
  Activity,
  Heart,
  Droplet,
  Download,
  Calendar,
  FileCheck2,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const bpLogs = [
    { date: 'Oct 24 (Today)', morning: '122/80', evening: 'Pending (6:30 PM)', status: 'Optimal', nurse: 'Nurse Beth RN' },
    { date: 'Oct 23', morning: '124/82', evening: '128/84', status: 'Controlled', nurse: 'Nurse Beth RN' },
    { date: 'Oct 22', morning: '126/82', evening: '130/84', status: 'Controlled', nurse: 'Sarah Vance' },
    { date: 'Oct 21', morning: '128/84', evening: '132/86', status: 'Pre-adjustment', nurse: 'Nurse Beth RN' },
    { date: 'Oct 20', morning: '134/88', evening: '136/90', status: 'Elevated (Pre-Rx)', nurse: 'Sarah Vance' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-[#F6F9FF]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00685f]">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Clinical Adherence & Biometric Trends</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
            Care Reports & Vitals History
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            30-day chronological biometrics and medication logs prepared for review with Dr. Christopher Chen, MD.
          </p>
        </div>

        <button
          onClick={() => alert('Generating 30-Day Clinical Summary PDF for Dr. Chen')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-lg shadow-sm transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary for Doctor (.PDF)</span>
        </button>
      </div>

      {/* Vitals Summary KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="text-xs text-[#64748B] flex items-center justify-between">
            <span>Average 7-Day BP</span>
            <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              Controlled
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-[#081d2c]">124 / 82</div>
          <div className="text-[11px] text-[#00685f] font-medium">-6 mmHg systolic since Lisinopril bump</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="text-xs text-[#64748B] flex items-center justify-between">
            <span>Medication Adherence</span>
            <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              98.2%
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-[#081d2c]">28 / 28</div>
          <div className="text-[11px] text-[#64748B]">All morning & night doses confirmed</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="text-xs text-[#64748B] flex items-center justify-between">
            <span>Daily Hydration Avg</span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Target Met
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-[#081d2c]">52 oz</div>
          <div className="text-[11px] text-[#64748B]">Goal: 48–64 oz/day</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="text-xs text-[#64748B] flex items-center justify-between">
            <span>Uninterrupted Sleep</span>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Steady
            </span>
          </div>
          <div className="text-2xl font-bold font-display text-[#081d2c]">7.4 hrs</div>
          <div className="text-[11px] text-[#64748B]">Zero nighttime wander events</div>
        </div>
      </div>

      {/* Blood Pressure Log Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00685f]" />
            <h3 className="text-base font-bold font-display text-[#081d2c]">
              Blood Pressure Log History (Lisinopril 20mg Titration)
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">Last updated: Today 11:32 AM</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Morning Reading (8:30 AM)</th>
                <th className="pb-2.5">Evening Reading (6:30 PM)</th>
                <th className="pb-2.5">Evaluation</th>
                <th className="pb-2.5 text-right">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {bpLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 font-semibold text-[#081d2c]">{log.date}</td>
                  <td className="py-3 font-mono font-bold text-[#00685f]">{log.morning}</td>
                  <td className="py-3 font-mono text-[#475569]">{log.evening}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-[#64748B]">{log.nurse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
