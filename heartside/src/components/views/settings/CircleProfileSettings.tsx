import React, { useState } from 'react';
import {
  User,
  Heart,
  MapPin,
  Calendar,
  AlertTriangle,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle2,
  Wifi,
  Tv,
  Eye,
  EyeOff,
  Key,
  Clock,
  Sparkles,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const CircleProfileSettings: React.FC = () => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showKeypadCode, setShowKeypadCode] = useState(false);
  const [showAlarmCode, setShowAlarmCode] = useState(false);

  // Form state
  const [profile, setProfile] = useState({
    recipientName: 'Eleanor Vance',
    preferredName: 'Mom / Grandma El',
    dob: '1946-04-14',
    bloodType: 'O+',
    primaryLanguage: 'English',
    address: '1420 SW Westwood Dr, Portland, OR 97239',
    apartmentSuite: 'Main Residence',
    gateCode: '#4821',
    keypadCode: '7291',
    alarmCode: '4409',
    alarmSystem: 'Vivint Smart Home Monitoring',
    fallRisk: 'Moderate Risk (Post-2023 hip fracture)',
    mobilityNotes: 'Quad-cane for indoor walking; folding walker required for outdoor walks & clinic visits',
    primaryAllergy: 'Penicillin (Severe rash, swelling)',
    secondaryAllergy: 'Sulfa antibiotics (Mild nausea)',
    primaryPhysician: 'Dr. Christopher Chen, MD',
    physicianClinic: 'Providence St. Vincent Heart Clinic',
    physicianPhone: '(503) 216-1234',
    preferredHospital: 'Providence St. Vincent Medical Center (Portland, OR)',
    pharmacyName: 'Cedar Hills Walgreens Pharmacy #04412',
    pharmacyPhone: '(503) 646-2423',
    circleName: "Eleanor Vance's Circle",
    circleId: 'EV-77291',
    circleBio: 'Coordinating daily care, physical therapy, medical transportation, and family updates for Eleanor in Portland.',
    timezone: 'America/Los_Angeles (Pacific Time)'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Circle Profile Successfully Updated</p>
              <p className="text-[11px] text-emerald-700">All changes have been synchronized to Eleanor's Bedside Smart Frame and all 4 circle members.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSavedSuccess(false)}
            className="text-xs text-emerald-800 font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Recipient Profile & Identity Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/src/assets/images/eleanor_vance_portrait_1792204247616.jpg"
                alt="Eleanor Vance"
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#E1F0FF] shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display text-[#081d2c]">Care Recipient Profile</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E1F0FF] text-[#00685f]">
                  Primary Protected Identity
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Central medical identity and living status for Eleanor Vance (Age 78)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Photo updated to latest portrait.')}
              className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#081d2c] hover:bg-slate-50 transition-colors"
            >
              Update Portrait
            </button>
          </div>
        </div>

        {/* 2-Column Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              value={profile.recipientName}
              onChange={(e) => setProfile({ ...profile, recipientName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Preferred Name / Salutation
            </label>
            <input
              type="text"
              value={profile.preferredName}
              onChange={(e) => setProfile({ ...profile, preferredName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Date of Birth (DOB)
            </label>
            <input
              type="date"
              value={profile.dob}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Blood Type
            </label>
            <select
              value={profile.bloodType}
              onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#081d2c] bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
            >
              <option value="O+">O Positive (O+)</option>
              <option value="O-">O Negative (O-)</option>
              <option value="A+">A Positive (A+)</option>
              <option value="A-">A Negative (A-)</option>
              <option value="B+">B Positive (B+)</option>
              <option value="AB+">AB Positive (AB+)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Primary Language
            </label>
            <input
              type="text"
              value={profile.primaryLanguage}
              onChange={(e) => setProfile({ ...profile, primaryLanguage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Primary Timezone
            </label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#081d2c] bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
            >
              <option value="America/Los_Angeles (Pacific Time)">Pacific Time (US & Canada)</option>
              <option value="America/Denver (Mountain Time)">Mountain Time (US & Canada)</option>
              <option value="America/Chicago (Central Time)">Central Time (US & Canada)</option>
              <option value="America/New_York (Eastern Time)">Eastern Time (US & Canada)</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
              Primary Residence Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-medium text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
              />
            </div>
          </div>
        </div>

        {/* Clinical Baseline & Safety Flags */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-[#081d2c] uppercase tracking-wider">
              Clinical Alert Flags & Allergy Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                Primary Drug Allergy (High Risk)
              </label>
              <input
                type="text"
                value={profile.primaryAllergy}
                onChange={(e) => setProfile({ ...profile, primaryAllergy: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-red-200 bg-red-50/50 text-xs font-semibold text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                Secondary Allergies & Sensitivities
              </label>
              <input
                type="text"
                value={profile.secondaryAllergy}
                onChange={(e) => setProfile({ ...profile, secondaryAllergy: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-medium text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                Fall Risk & Balance Assessment
              </label>
              <input
                type="text"
                value={profile.fallRisk}
                onChange={(e) => setProfile({ ...profile, fallRisk: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-medium text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                Mobility & Assistive Devices
              </label>
              <input
                type="text"
                value={profile.mobilityNotes}
                onChange={(e) => setProfile({ ...profile, mobilityNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-xs font-medium text-[#081d2c] focus:outline-none focus:ring-2 focus:ring-[#00685f]/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Access & Entry Protocol */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-5">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-[#00685f]" />
          <div>
            <h2 className="text-base font-bold font-display text-[#081d2c]">
              Home Access & Emergency Entry Codes
            </h2>
            <p className="text-xs text-[#64748B]">
              Restricted to verified family members, EMT emergency services, and licensed visiting nurses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">Front Door Keypad</span>
              <button
                type="button"
                onClick={() => setShowKeypadCode(!showKeypadCode)}
                className="text-[#64748B] hover:text-[#081d2c]"
              >
                {showKeypadCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="font-mono text-base font-bold text-[#081d2c]">
              {showKeypadCode ? profile.keypadCode : '••••'}
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">Schlage Smart Lock • Auto-locks in 3 mins</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">Gate / Lockbox Code</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <div className="font-mono text-base font-bold text-[#081d2c]">
              {profile.gateCode}
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">Master Lockbox on South Patio Rail</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase">Security Alarm PIN</span>
              <button
                type="button"
                onClick={() => setShowAlarmCode(!showAlarmCode)}
                className="text-[#64748B] hover:text-[#081d2c]"
              >
                {showAlarmCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="font-mono text-base font-bold text-[#081d2c]">
              {showAlarmCode ? profile.alarmCode : '••••'}
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">{profile.alarmSystem}</p>
          </div>
        </div>
      </div>

      {/* Bedside Smart Frame Device Link */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-[#F0FDFA] border border-[#CCFBF1] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00685f] text-white flex items-center justify-center shadow-xs">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#081d2c]">Hearthside Smart Frame 10.1″</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Online
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Master Bedroom Bedside Display • IP: 192.168.1.144 (VanceFamily_5G)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Dispatched ping! Eleanor\'s bedside frame flashed a warm heart and chime.')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#00685f]/30 text-xs font-semibold text-[#00685f] hover:bg-[#F0FDFA] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Send Test Hug to Frame</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Display frame refreshed with latest schedule & photos.')}
              className="p-2 rounded-xl bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c] transition-colors"
              title="Sync Frame Now"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white/80 border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block">Night Sleep Mode</span>
            <span className="font-semibold text-[#081d2c]">9:30 PM – 7:00 AM</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block">Photo Rotate Interval</span>
            <span className="font-semibold text-[#081d2c]">Every 30 Seconds</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block">Chime Volume</span>
            <span className="font-semibold text-[#081d2c]">Gentle (45 dB)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block">Firmware Version</span>
            <span className="font-semibold text-[#081d2c]">v2.14.8 (Up to date)</span>
          </div>
        </div>
      </div>

      {/* Primary Medical Contacts & Pharmacy Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#00685f]" />
          <div>
            <h2 className="text-base font-bold font-display text-[#081d2c]">
              Medical Team of Record & Preferred Hospital
            </h2>
            <p className="text-xs text-[#64748B]">Emergency dispatch destinations and primary physician routing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00685f]">
              Primary Physician
            </span>
            <p className="font-bold text-sm text-[#081d2c]">{profile.primaryPhysician}</p>
            <p className="text-xs text-[#64748B]">{profile.physicianClinic}</p>
            <div className="flex items-center gap-2 text-xs text-[#475569] pt-1">
              <Phone className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{profile.physicianPhone}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
              Preferred Emergency Hospital
            </span>
            <p className="font-bold text-sm text-[#081d2c]">{profile.preferredHospital}</p>
            <p className="text-xs text-[#64748B]">9155 SW Barnes Rd, Portland, OR 97225</p>
            <div className="flex items-center gap-2 text-xs text-[#475569] pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Direct EMT Route: 14 mins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
        <div className="text-xs text-[#64748B]">
          Last modified: Today at 4:18 PM by Sarah Vance
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </div>
    </form>
  );
};
