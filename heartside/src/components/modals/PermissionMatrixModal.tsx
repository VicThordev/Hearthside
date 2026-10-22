import React from 'react';
import { X, Shield, Check, Minus } from 'lucide-react';

interface PermissionMatrixModalProps {
  onClose: () => void;
}

export const PermissionMatrixModal: React.FC<PermissionMatrixModalProps> = ({ onClose }) => {
  const permissions = [
    { name: 'View Daily Care Notes & Journal', org: true, family: true, helper: true, md: true },
    { name: 'Post Care Updates & Photos', org: true, family: true, helper: true, md: false },
    { name: 'Edit Medication Schedule & Dosages', org: true, family: false, helper: false, md: true },
    { name: 'Log Administered Medications', org: true, family: true, helper: true, md: true },
    { name: 'View Advance Directives & POA', org: true, family: true, helper: false, md: true },
    { name: 'Export Medical Summary & Records', org: true, family: false, helper: false, md: true },
    { name: 'Manage Team Members & Invites', org: true, family: false, helper: false, md: false },
    { name: 'Configure Billing & Subscription', org: true, family: false, helper: false, md: false },
    { name: 'Override 911 Emergency Escalation', org: true, family: true, helper: false, md: false },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00685f]" />
            <h2 className="font-bold text-sm text-[#081d2c]">
              Care Circle 24-Point Role & Permission Matrix
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="pb-3 pr-4">Permission Capability</th>
                <th className="pb-3 px-2 text-center text-[#00685f]">Primary Organizer</th>
                <th className="pb-3 px-2 text-center text-blue-700">Family Member</th>
                <th className="pb-3 px-2 text-center text-teal-700">Trusted Helper</th>
                <th className="pb-3 px-2 text-center text-purple-700">Physician / Clinical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC]">
                  <td className="py-2.5 pr-4 font-semibold text-[#081d2c]">{p.name}</td>
                  <td className="py-2.5 px-2 text-center">
                    {p.org ? <Check className="w-4 h-4 text-[#00685f] mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.family ? <Check className="w-4 h-4 text-blue-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.helper ? <Check className="w-4 h-4 text-teal-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.md ? <Check className="w-4 h-4 text-purple-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-lg shadow-2xs"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
