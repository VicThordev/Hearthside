import React from 'react';
import { X, Clock, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { AUDIT_LOG_EVENTS } from '../../data/mockData';

interface AuditLogModalProps {
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00685f]" />
            <div>
              <h2 className="font-bold text-sm text-[#081d2c]">
                Circle Security Audit Trail (24 Events)
              </h2>
              <div className="text-[11px] text-[#64748B]">
                HIPAA-Compliant Tamper-Evident SHA-256 Access Log
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[420px] overflow-y-auto divide-y divide-[#E2E8F0]">
          {AUDIT_LOG_EVENTS.map(ev => (
            <div key={ev.id} className="py-3 text-xs flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-bold text-[#081d2c] flex items-center gap-2">
                  <span>{ev.user}</span>
                  <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-md bg-[#E1F0FF] text-[#00685f]">
                    {ev.action}
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Target: <strong>{ev.target}</strong>
                </div>
              </div>

              <div className="text-right text-[11px] text-[#64748B] shrink-0 font-mono">
                <div>{ev.time}</div>
                <div className="text-[10px] text-slate-400">IP: {ev.ip}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-xs text-[#15803D] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> All signatures cryptographically verified
          </span>
          <button
            onClick={() => alert('Exporting raw JSON / CSV audit logs')}
            className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#081d2c] hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
