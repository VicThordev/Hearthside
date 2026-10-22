import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  Heart,
  Phone,
  AlertCircle,
  MapPin,
  QrCode,
  Download
} from 'lucide-react';

interface EmergencyCardModalProps {
  onClose: () => void;
}

export const EmergencyCardModal: React.FC<EmergencyCardModalProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00685f]" />
            <h2 className="font-bold text-sm text-[#081d2c]">
              1-Click Printable Emergency Care Packet
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 space-y-4 print:p-0">
          <div className="p-5 rounded-2xl border-2 border-[#00685f] bg-[#F6F9FF] space-y-4">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/eleanor_vance_portrait_1792204247616.jpg"
                  alt="Eleanor Vance"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-2xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xl font-bold font-display text-[#081d2c]">Eleanor M. Vance</h3>
                  <div className="text-xs text-[#64748B]">DOB: 04/18/1946 • Portland, Oregon</div>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                  Blood Type: O+
                </span>
                <div className="text-[10px] text-[#64748B] mt-1">DNR on file • POLST Signed</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#64748B] text-[10px] uppercase">Primary Proxy / Emergency Contact</span>
                <div className="font-bold text-sm text-[#081d2c]">Sarah Vance (Daughter)</div>
                <div className="text-[#00685f] font-semibold">(503) 555-0192</div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#64748B] text-[10px] uppercase">Secondary Proxy / Backup</span>
                <div className="font-bold text-sm text-[#081d2c]">David Vance (Son)</div>
                <div className="text-[#475569] font-semibold">(503) 555-0144</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs">
              <strong className="text-red-900 block mb-1">CRITICAL DRUG ALLERGIES:</strong>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white text-red-800 font-bold border border-red-200">
                  PENICILLIN (Anaphylaxis)
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-red-800 font-medium border border-red-200">
                  SULFA DRUGS (Severe Rash)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-[#E2E8F0]">
              <div className="col-span-2 space-y-1">
                <strong className="text-[#081d2c] block">Current Medication Regimen:</strong>
                <ul className="text-[11px] text-[#475569] space-y-0.5">
                  <li>• Lisinopril 20mg (Once daily morning with water)</li>
                  <li>• Atorvastatin 20mg (Nightly)</li>
                  <li>• Metformin 500mg (Morning with breakfast)</li>
                  <li>• Vitamin D3 2000 IU (Daily)</li>
                </ul>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-l border-slate-100 pl-2">
                <QrCode className="w-14 h-14 text-[#081d2c]" />
                <span className="text-[9px] font-bold text-[#64748B] mt-1">EMT SCAN CODE</span>
              </div>
            </div>

            <div className="text-[11px] text-[#64748B] flex items-center justify-between border-t border-[#CBD5E1] pt-2">
              <span>Preferred Facility: <strong>Providence St. Vincent Medical Center</strong></span>
              <span>Attending PCP: <strong>Dr. Christopher Chen, MD</strong></span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            Formatted for standard credit-card laminated folding size.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#081d2c]"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Emergency Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
