import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Laptop,
  Tv,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ExternalLink,
  Search,
  KeyRound,
  FileCheck2
} from 'lucide-react';
import { AUDIT_LOG_EVENTS } from '../../../data/mockData';

export const SecurityAccessLogsSettings: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'clinical' | 'auth' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [require2FA, setRequire2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('4hours');
  const [revokedToast, setRevokedToast] = useState(false);

  // Active Sessions
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'iPhone 15 Pro',
      user: 'Sarah Vance',
      location: 'Portland, OR (73.164.22.10)',
      time: 'Current Session (Active now)',
      isCurrent: true,
      icon: Smartphone
    },
    {
      id: 'sess-2',
      device: 'Google Pixel 8',
      user: 'David Vance',
      location: 'Beaverton, OR (67.183.110.45)',
      time: 'Active 2 hours ago',
      isCurrent: false,
      icon: Smartphone
    },
    {
      id: 'sess-3',
      device: 'MacBook Pro M3 Max',
      user: 'Marcus Vance',
      location: 'Seattle, WA (198.143.44.12)',
      time: 'Yesterday at 6:40 PM',
      isCurrent: false,
      icon: Laptop
    },
    {
      id: 'sess-4',
      device: 'Hearthside Bedside 10.1″ Frame',
      user: 'Eleanor Vance (Bedside Display)',
      location: 'Home WiFi (192.168.1.144)',
      time: 'Continuous TLS Connection',
      isCurrent: false,
      icon: Tv
    }
  ]);

  const handleRevokeOthers = () => {
    setSessions(prev => prev.filter(s => s.isCurrent || s.id === 'sess-4'));
    setRevokedToast(true);
    setTimeout(() => setRevokedToast(false), 3500);
  };

  const filteredLogs = AUDIT_LOG_EVENTS.filter(event => {
    const matchesSearch =
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.target.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'clinical') {
      return event.action.includes('Vitals') || event.action.includes('Med') || event.action.includes('Lab');
    }
    if (filterType === 'auth') {
      return event.action.includes('Key') || event.action.includes('Checksum') || event.user.includes('System');
    }
    if (filterType === 'admin') {
      return event.action.includes('Exported') || event.action.includes('Pinned');
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {revokedToast && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs font-semibold">
            All secondary sessions revoked. Affected devices will require re-authentication with 2FA.
          </p>
        </div>
      )}

      {/* Security & HIPAA Compliance Overview */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E1F0FF] text-[#00685f] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-display text-[#081d2c]">
                  HIPAA-Conscious Architecture & Encryption
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Grade A+ Security
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Eleanor Vance's care records are shielded by AES-256 at rest, TLS 1.3 in transit, and role-based ACLs.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert('Generating formal HIPAA Business Associate Agreement & Compliance Certificate...')}
            className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#081d2c] hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <FileCheck2 className="w-4 h-4 text-[#00685f]" />
            <span>HIPAA BAA Certificate</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Encryption Standard</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">AES-256-GCM</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Zero Ad Monetization</span>
            <span className="font-bold text-emerald-700 mt-0.5 block">Guaranteed Zero Sale</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Immutable Access Trail</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">SHA-256 Verified</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Last Security Audit</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">Oct 18, 2024</span>
          </div>
        </div>
      </div>

      {/* Security Policies: 2FA & Session Timeout */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#00685f]" />
          <div>
            <h2 className="text-base font-bold font-display text-[#081d2c]">
              Circle Authentication Policies
            </h2>
            <p className="text-xs text-[#64748B]">Enforce multi-factor verification across all invited family members and helpers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#081d2c] block">Enforce Two-Factor Authentication (2FA)</span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Requires SMS code or Authenticator App for all sign-ins
              </span>
            </div>
            <input
              type="checkbox"
              checked={require2FA}
              onChange={() => setRequire2FA(!require2FA)}
              className="w-4 h-4 rounded text-[#00685f]"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#081d2c] block">Auto-Lock Inactive Sessions</span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Automatically disconnect inactive web and mobile clients
              </span>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-medium"
            >
              <option value="30mins">30 Minutes</option>
              <option value="1hour">1 Hour</option>
              <option value="4hours">4 Hours (Default)</option>
              <option value="24hours">24 Hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Sessions & Connected Devices */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold font-display text-[#081d2c]">
              Active Devices & Connected Sessions
            </h2>
            <p className="text-xs text-[#64748B]">Currently authenticated sessions with access to Eleanor's circle</p>
          </div>

          <button
            onClick={handleRevokeOthers}
            className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100/60 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Revoke All Other Sessions</span>
          </button>
        </div>

        <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden">
          {sessions.map(session => {
            const Icon = session.icon;
            return (
              <div key={session.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#475569] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#081d2c]">{session.device}</span>
                      <span className="text-[10px] text-[#64748B]">({session.user})</span>
                      {session.isCurrent && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          This Device
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] flex items-center gap-2 mt-0.5">
                      <span>{session.location}</span>
                      <span>•</span>
                      <span>{session.time}</span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && session.id !== 'sess-4' && (
                  <button
                    onClick={() => setSessions(prev => prev.filter(s => s.id !== session.id))}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* HIPAA Access & Security Audit Log Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold font-display text-[#081d2c]">
              Security & Access Audit Trail
            </h2>
            <p className="text-xs text-[#64748B]">Tamper-evident log of all clinical views, document exports, and login events</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const csvData = AUDIT_LOG_EVENTS.map(e => `${e.time},${e.user},${e.action},${e.target},${e.ip}`).join('\n');
                const blob = new Blob([`Timestamp,User,Action,Target,IP\n${csvData}`], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Eleanor_Vance_HIPAA_Audit_${Date.now()}.csv`;
                a.click();
              }}
              className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#081d2c] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by user or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {(['all', 'clinical', 'auth', 'admin'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  filterType === tab
                    ? 'bg-[#00685f] text-white'
                    : 'text-[#64748B] hover:bg-slate-100'
                }`}
              >
                {tab === 'all' ? 'All Events' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] uppercase font-bold text-[#64748B]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Caregiver / Entity</th>
                <th className="py-2.5 px-3">Action Recorded</th>
                <th className="py-2.5 px-3">Target Resource</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredLogs.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono text-[11px] text-[#64748B]">{item.time}</td>
                  <td className="py-3 px-3 font-semibold text-[#081d2c]">{item.user}</td>
                  <td className="py-3 px-3 text-[#334155]">{item.action}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-[#00685f] bg-[#E1F0FF] px-2 py-0.5 rounded">
                      {item.target}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400">{item.ip}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
