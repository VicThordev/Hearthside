import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, PhoneCall, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

interface EscalationTestModalProps {
  onClose: () => void;
}

export const EscalationTestModal: React.FC<EscalationTestModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(8);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (currentStep < 3) {
            setCurrentStep(s => s + 1);
            return 8;
          } else {
            setIsSimulating(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, isSimulating]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-red-50">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="font-bold text-sm">
                Emergency Escalation Relay Simulation
              </h2>
              <div className="text-[10px] text-red-700">Test Mode Active • No real 911 calls dispatched</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs uppercase font-bold text-[#64748B]">Simulated Trigger:</div>
            <div className="text-base font-bold text-[#081d2c]">
              "Eleanor Pendant SOS Button Activated (Bedside Sunroom)"
            </div>
          </div>

          {/* Stepper */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentStep === 1
                ? 'bg-[#E1F0FF] border-[#00685f] shadow-sm'
                : currentStep > 1
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#081d2c]">Tier 1: Sarah Vance (Daughter)</span>
                {currentStep === 1 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00685f] text-white">
                    Pinging ({secondsRemaining}s)
                  </span>
                ) : (
                  <span className="text-[10px] text-[#15803D] font-bold">Simulated No-Answer</span>
                )}
              </div>
              <div className="text-[11px] text-[#475569] mt-1">
                Dispatched voice phone call to (503) 555-0192 + high-priority SMS banner.
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentStep === 2
                ? 'bg-amber-50 border-amber-500 shadow-sm'
                : currentStep > 2
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#081d2c]">Tier 2: David Vance (Son)</span>
                {currentStep === 2 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                    Escalating ({secondsRemaining}s)
                  </span>
                ) : currentStep > 2 ? (
                  <span className="text-[10px] text-[#15803D] font-bold">Simulated No-Answer</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Standby</span>
                )}
              </div>
              <div className="text-[11px] text-[#475569] mt-1">
                Dispatched push notification and SMS to (503) 555-0144.
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentStep === 3
                ? 'bg-red-50 border-red-500 shadow-sm'
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-red-900">Tier 3: 911 Emergency Dispatch & Dr. Chen</span>
                {currentStep === 3 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                    Simulated Dispatch Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Fallback</span>
                )}
              </div>
              <div className="text-[11px] text-red-800/80 mt-1">
                Transmits GPS coordinates, Eleanor's POLST directives, current Lisinopril dosage, and emergency contacts to Washington County 911 PSAP.
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentStep(1);
              setSecondsRemaining(8);
              setIsSimulating(true);
            }}
            className="text-xs font-semibold text-[#00685f] hover:underline"
          >
            Restart Simulation
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-lg"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
