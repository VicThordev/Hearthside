import React, { useState } from 'react';
import {
  Bell,
  PhoneCall,
  MessageSquare,
  Mail,
  Smartphone,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Check,
  CheckCircle2,
  Volume2,
  Moon,
  Sparkles,
  Sliders,
  Send,
  UserCheck
} from 'lucide-react';

export const MemberNotificationsSettings: React.FC = () => {
  const [testSent, setTestSent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Global Matrix State
  const [matrix, setMatrix] = useState({
    sosCall: true,
    sosSms: true,
    sosEmail: false,
    sosPush: true,

    briefingEmail: true,
    briefingSms: true,
    briefingPush: false,
    briefingCall: false,

    taskPush: true,
    taskSms: true,
    taskEmail: false,
    taskCall: false,

    vitalsPush: true,
    vitalsSms: false,
    vitalsEmail: true,
    vitalsCall: false,

    medPush: true,
    medSms: true,
    medEmail: false,
    medCall: false
  });

  // Quiet Hours
  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: '22:00',
    endTime: '07:00',
    bypassForSOS: true,
    bypassForFall: true
  });

  // Per Member notification rules
  const [members, setMembers] = useState([
    {
      id: 'sarah',
      name: 'Sarah Vance',
      role: 'Primary Admin / Eldest Daughter',
      avatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      phone: '(503) 890-4412',
      urgentSms: true,
      pushAlerts: true,
      morningDigest: true,
      errandPings: true,
      summaryFrequency: 'Immediate'
    },
    {
      id: 'david',
      name: 'David Vance',
      role: 'Logistics & Errand Lead',
      avatar: '/src/assets/images/david_vance_avatar_1792204257121.jpg',
      phone: '(503) 774-9821',
      urgentSms: true,
      pushAlerts: true,
      morningDigest: false,
      errandPings: true,
      summaryFrequency: 'Daily 6 PM'
    },
    {
      id: 'marcus',
      name: 'Marcus Vance',
      role: 'Remote Contributor (Seattle)',
      avatar: '/src/assets/images/marcus_vance_avatar_1792204257224.jpg',
      phone: '(206) 555-0182',
      urgentSms: true,
      pushAlerts: false,
      morningDigest: true,
      errandPings: false,
      summaryFrequency: 'Weekly Digest'
    },
    {
      id: 'beth',
      name: 'Nurse Beth RN',
      role: 'Visiting Nurse (Cascade Health)',
      avatar: '/src/assets/images/nurse_beth_avatar_1792204257850.jpg',
      phone: '(503) 220-8000 ext. 41',
      urgentSms: false,
      pushAlerts: true,
      morningDigest: false,
      errandPings: false,
      summaryFrequency: 'Shift Hours Only'
    }
  ]);

  const toggleMemberSetting = (id: string, field: 'urgentSms' | 'pushAlerts' | 'morningDigest' | 'errandPings') => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: !m[field] } : m))
    );
  };

  const handleTestAlert = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  const handleSaveAll = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
      {testSent && (
        <div className="p-4 rounded-xl bg-[#E1F0FF] border border-[#00685f]/30 text-[#081d2c] flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-[#00685f] shrink-0" />
            <div>
              <p className="text-xs font-bold">Simulated Notification Dispatched</p>
              <p className="text-[11px] text-[#475569]">
                "[HEARTHSIDE ALERT] Vitals logged: Eleanor BP 122/80 mmHg by Nurse Beth RN" sent to Sarah Vance & David Vance.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#00685f] bg-white px-2 py-1 rounded">200 OK</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">Notification matrix preferences saved and synced across all devices.</p>
        </div>
      )}

      {/* Emergency Broadcast Channel Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-50 via-red-50/50 to-amber-50/50 border border-rose-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-display text-rose-950">
                  Critical SOS & Fall Detection Routing
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 uppercase">
                  Emergency Level 1
                </span>
              </div>
              <p className="text-xs text-rose-800/80 mt-0.5">
                Immediate override: will ring family phones even if set to Silent or Do Not Disturb.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestAlert}
              className="px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-xs font-semibold text-rose-900 hover:bg-rose-100/50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5 text-rose-600" />
              <span>Send Test Notification</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#081d2c] block">Voice Call</span>
              <span className="text-[10px] text-[#64748B]">Automated IVR</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>

          <div className="p-3 rounded-xl bg-white border border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#081d2c] block">SMS Alert</span>
              <span className="text-[10px] text-[#64748B]">High-priority route</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>

          <div className="p-3 rounded-xl bg-white border border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#081d2c] block">Push Alert</span>
              <span className="text-[10px] text-[#64748B]">Sound: Siren Chime</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>

          <div className="p-3 rounded-xl bg-white border border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#081d2c] block">Escalation Timer</span>
              <span className="text-[10px] text-[#64748B]">3 mins between stages</span>
            </div>
            <Clock className="w-3.5 h-3.5 text-[#00685f]" />
          </div>
        </div>
      </div>

      {/* Global Event Notification Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div>
          <h2 className="text-base font-bold font-display text-[#081d2c]">
            Circle-Wide Event Matrix
          </h2>
          <p className="text-xs text-[#64748B]">
            Configure which channels dispatch for key day-to-day caregiving events
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] uppercase font-bold text-[#64748B]">
                <th className="py-3 px-3">Event Type</th>
                <th className="py-3 px-3 text-center">In-App Push</th>
                <th className="py-3 px-3 text-center">SMS Text</th>
                <th className="py-3 px-3 text-center">Automated Call</th>
                <th className="py-3 px-3 text-center">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-[#081d2c]">Emergency Alerts / Fall Triggers</div>
                  <div className="text-[11px] text-[#64748B]">Instant bedside alarm and EMT escalation</div>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.sosPush}
                    onChange={() => setMatrix({ ...matrix, sosPush: !matrix.sosPush })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.sosSms}
                    onChange={() => setMatrix({ ...matrix, sosSms: !matrix.sosSms })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.sosCall}
                    onChange={() => setMatrix({ ...matrix, sosCall: !matrix.sosCall })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.sosEmail}
                    onChange={() => setMatrix({ ...matrix, sosEmail: !matrix.sosEmail })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-[#081d2c]">Daily Morning Briefing (8:00 AM)</div>
                  <div className="text-[11px] text-[#64748B]">Sleep score, medication schedule, weather & driver assignments</div>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.briefingPush}
                    onChange={() => setMatrix({ ...matrix, briefingPush: !matrix.briefingPush })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.briefingSms}
                    onChange={() => setMatrix({ ...matrix, briefingSms: !matrix.briefingSms })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="text-slate-300 text-xs">—</span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.briefingEmail}
                    onChange={() => setMatrix({ ...matrix, briefingEmail: !matrix.briefingEmail })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-[#081d2c]">Task & Errand Handoffs</div>
                  <div className="text-[11px] text-[#64748B]">Driver confirmation, grocery restock completion, pharmacy receipts</div>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.taskPush}
                    onChange={() => setMatrix({ ...matrix, taskPush: !matrix.taskPush })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.taskSms}
                    onChange={() => setMatrix({ ...matrix, taskSms: !matrix.taskSms })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="text-slate-300 text-xs">—</span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.taskEmail}
                    onChange={() => setMatrix({ ...matrix, taskEmail: !matrix.taskEmail })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-[#081d2c]">Prescription & Dose Changes</div>
                  <div className="text-[11px] text-[#64748B]">Physician dosage adjustments and refill alerts</div>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.medPush}
                    onChange={() => setMatrix({ ...matrix, medPush: !matrix.medPush })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.medSms}
                    onChange={() => setMatrix({ ...matrix, medSms: !matrix.medSms })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="text-slate-300 text-xs">—</span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={matrix.medEmail}
                    onChange={() => setMatrix({ ...matrix, medEmail: !matrix.medEmail })}
                    className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Member Preferences */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#00685f]" />
          <div>
            <h2 className="text-base font-bold font-display text-[#081d2c]">
              Individual Caregiver Preferences
            </h2>
            <p className="text-xs text-[#64748B]">Customize alert routing based on geographic proximity and care duties</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map(member => (
            <div key={member.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#E1F0FF]"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-[#081d2c]">{member.name}</h3>
                    <p className="text-[10px] text-[#64748B]">{member.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#00685f] bg-[#E1F0FF] px-2 py-0.5 rounded">
                  {member.summaryFrequency}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <label className="flex items-center gap-2 text-[#475569] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={member.urgentSms}
                    onChange={() => toggleMemberSetting(member.id, 'urgentSms')}
                    className="w-3.5 h-3.5 rounded text-[#00685f]"
                  />
                  <span>Urgent SMS</span>
                </label>

                <label className="flex items-center gap-2 text-[#475569] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={member.pushAlerts}
                    onChange={() => toggleMemberSetting(member.id, 'pushAlerts')}
                    className="w-3.5 h-3.5 rounded text-[#00685f]"
                  />
                  <span>Push Alerts</span>
                </label>

                <label className="flex items-center gap-2 text-[#475569] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={member.morningDigest}
                    onChange={() => toggleMemberSetting(member.id, 'morningDigest')}
                    className="w-3.5 h-3.5 rounded text-[#00685f]"
                  />
                  <span>Morning Digest</span>
                </label>

                <label className="flex items-center gap-2 text-[#475569] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={member.errandPings}
                    onChange={() => toggleMemberSetting(member.id, 'errandPings')}
                    className="w-3.5 h-3.5 rounded text-[#00685f]"
                  />
                  <span>Errand Pings</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours & DND */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-base font-bold font-display text-[#081d2c]">
              Night Quiet Hours & Do Not Disturb
            </h2>
            <p className="text-xs text-[#64748B]">Mute non-urgent notifications during restful nighttime hours</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={quietHours.enabled}
              onChange={() => setQuietHours({ ...quietHours, enabled: !quietHours.enabled })}
              className="w-4 h-4 rounded text-[#00685f]"
              id="quiet-hours-toggle"
            />
            <label htmlFor="quiet-hours-toggle" className="text-xs font-semibold text-[#081d2c] cursor-pointer">
              Enable Night Quiet Hours
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B]">Active from:</span>
            <input
              type="time"
              value={quietHours.startTime}
              onChange={(e) => setQuietHours({ ...quietHours, startTime: e.target.value })}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-mono text-xs"
            />
            <span className="text-[#64748B]">until:</span>
            <input
              type="time"
              value={quietHours.endTime}
              onChange={(e) => setQuietHours({ ...quietHours, endTime: e.target.value })}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pl-1 text-xs text-[#475569]">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Emergency Override Guarantee:</strong> SOS fall alerts and Dr. Chen escalation calls bypass Quiet Hours unconditionally.
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
        <span className="text-xs text-[#64748B]">Changes apply immediately to push services</span>
        <button
          onClick={handleSaveAll}
          className="px-6 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Save Notification Preferences</span>
        </button>
      </div>
    </div>
  );
};
