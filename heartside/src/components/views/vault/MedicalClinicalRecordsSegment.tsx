import React, { useState } from 'react';
import {
  Stethoscope,
  FileText,
  FileCheck2,
  Activity,
  Download,
  Share2,
  Eye,
  Search,
  Filter,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Check,
  Copy,
  Printer,
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { VaultDocument } from '../../../types';

interface MedicalClinicalRecordsSegmentProps {
  onPreviewDocument: (doc: VaultDocument) => void;
  onUploadClick: () => void;
  onRequestRecordsClick: () => void;
}

export const MedicalClinicalRecordsSegment: React.FC<MedicalClinicalRecordsSegmentProps> = ({
  onPreviewDocument,
  onUploadClick,
  onRequestRecordsClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedRecordType, setSelectedRecordType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedDocNotice, setSharedDocNotice] = useState<string | null>(null);

  const clinicalRecords: VaultDocument[] = [
    {
      id: 'clin-1',
      title: 'Dr. Christopher Chen Cardiology Consultation Summary - Oct 2024.pdf',
      filename: 'Dr_Chen_Cardiology_Summary_Oct_2024.pdf',
      fileSize: '1.4 MB',
      category: 'clinical',
      categoryLabel: 'Cardiology • Dr. Chen, MD',
      isVerified: true,
      verifiedNotice: 'Providence Heart Clinic • Visit date: Oct 18, 2024 • Follow-up scheduled April 2025',
      physicianName: 'Dr. Christopher Chen, MD (Cardiologist)',
      highlights: 'Patient exhibits stable sinus rhythm. Mild hypertension controlled under updated Lisinopril 20mg. Echocardiogram: Normal Left Ventricular Ejection Fraction (58%). 3 Exhibits attached (ECG Strip, Electrolyte Labs).',
      downloadCount: 12
    },
    {
      id: 'clin-2',
      title: 'Quest Diagnostics Comprehensive Metabolic & Renal Panel - Oct 2024.pdf',
      filename: 'Quest_Metabolic_Renal_Panel_Oct2024.pdf',
      fileSize: '890 KB',
      category: 'clinical',
      categoryLabel: 'Laboratory Results • Fasting Blood Chemistry',
      isVerified: true,
      verifiedNotice: 'Quest Diagnostics Beaverton Center • Collected Oct 19, 2024 • Verified by Lab Director Dr. V. Patel',
      physicianName: 'Ordered by Dr. Christopher Chen, MD',
      highlights: 'Serum Potassium: 4.3 mEq/L (Normal: 3.5–5.0). BUN: 18 mg/dL. Serum Creatinine: 0.9 mg/dL. eGFR: >60 mL/min/1.73m² (Normal renal clearance). Fasting Glucose: 104 mg/dL. No electrolyte abnormality found.',
      downloadCount: 7
    },
    {
      id: 'clin-3',
      title: 'Current Prescriptions, Dosing Schedules & Known Allergies.pdf',
      filename: 'Current_Prescriptions_Allergy_Sheet_Oct2024.pdf',
      fileSize: '820 KB',
      category: 'prescriptions',
      categoryLabel: 'Active Pharmacy Regimen • EMT Fast-Scan',
      isVerified: true,
      isPinned: true,
      verifiedNotice: 'Synced with Cedar Hills Walgreens Pharmacy #1042 • Verified by Pharmacist J. Miller on Oct 22, 2024',
      physicianName: 'Reviewed by Dr. Aris Thorne, MD (PCP)',
      allergies: [
        { name: 'Penicillin', severity: 'Severe - Anaphylaxis' },
        { name: 'Sulfa Drugs', severity: 'Moderate - Hives/Skin Rash' }
      ],
      activeMeds: [
        'Lisinopril 20mg (1x daily morning, blood pressure)',
        'Atorvastatin 20mg (1x nightly bedtime, cholesterol)',
        'Metformin 500mg (1x morning with breakfast, blood sugar)',
        'Vitamin D3 2000 IU (1x daily morning, bone health)'
      ],
      downloadCount: 28
    },
    {
      id: 'clin-4',
      title: 'Providence St. Vincent Inpatient Observation & Discharge Summary.pdf',
      filename: 'Providence_Discharge_Summary_Nov2023.pdf',
      fileSize: '3.6 MB',
      category: 'clinical',
      categoryLabel: 'Hospital Discharge • Inpatient Observation',
      isVerified: true,
      verifiedNotice: 'Providence St. Vincent Medical Center • Discharged Nov 14, 2023 • Attending: Dr. Aris Thorne, MD',
      physicianName: 'Dr. Aris Thorne, MD & Hospitalist Team',
      highlights: 'Admitted for brief orthostatic presyncope after mild dehydration. Cardiac telemetry negative for arrhythmia. Neurological CT Head without acute infarct. Discharged home in stable condition with ambulatory hydration orders.',
      downloadCount: 5
    },
    {
      id: 'clin-5',
      title: 'Diagnostic Imaging: Bilateral Weight-Bearing Knee & Hip Series.pdf',
      filename: 'Bilateral_Knee_Hip_XRay_Report_Aug2024.pdf',
      fileSize: '4.8 MB',
      category: 'clinical',
      categoryLabel: 'Diagnostic Radiology • X-Ray Imaging',
      isVerified: true,
      verifiedNotice: 'Beaverton Outpatient Imaging Center • Radiologist: Dr. Gregory Shaw, MD • Aug 14, 2024',
      physicianName: 'Dr. Sarah Miller, DPM & Dr. Thorne, MD',
      highlights: 'Mild-to-moderate medial compartment joint space narrowing bilateral knees. No fracture, acute subluxation, or destructive lesion. DEXA Scan T-Score -1.8 indicative of stable osteopenia. Physical therapy approved for balance training.',
      downloadCount: 9
    },
    {
      id: 'clin-6',
      title: 'Dr. Sarah Miller Senior Podiatry & Neuropathy Sensory Exam.pdf',
      filename: 'Podiatry_Preventive_Exam_Aug2024.pdf',
      fileSize: '1.1 MB',
      category: 'clinical',
      categoryLabel: 'Podiatric Medicine • Senior Diabetic Foot Check',
      isVerified: true,
      verifiedNotice: 'Providence Beaverton Podiatry Pavilion • Examined Aug 22, 2024 • Routine 6-Month Review',
      physicianName: 'Dr. Sarah Miller, DPM',
      highlights: 'Dorsalis pedis and posterior tibial pulses 2+ bilaterally. Protective sensation intact across all 10 monofilament points. Nail debridement completed. Custom silicone toe separator and supportive walking shoes recommended.',
      downloadCount: 4
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (title: string) => {
    setSharedDocNotice(title);
    setTimeout(() => setSharedDocNotice(null), 4000);
  };

  const filteredRecords = clinicalRecords.filter(rec => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.physicianName && rec.physicianName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.highlights && rec.highlights.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.verifiedNotice && rec.verifiedNotice.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProvider =
      selectedProvider === 'all' ||
      (selectedProvider === 'chen' && rec.physicianName?.toLowerCase().includes('chen')) ||
      (selectedProvider === 'thorne' && (rec.physicianName?.toLowerCase().includes('thorne') || rec.verifiedNotice?.toLowerCase().includes('thorne'))) ||
      (selectedProvider === 'quest' && rec.title.toLowerCase().includes('quest')) ||
      (selectedProvider === 'miller' && rec.physicianName?.toLowerCase().includes('miller'));

    const matchesType =
      selectedRecordType === 'all' ||
      (selectedRecordType === 'consult' && (rec.title.toLowerCase().includes('consultation') || rec.title.toLowerCase().includes('summary'))) ||
      (selectedRecordType === 'labs' && (rec.title.toLowerCase().includes('metabolic') || rec.title.toLowerCase().includes('panel'))) ||
      (selectedRecordType === 'prescriptions' && rec.category === 'prescriptions') ||
      (selectedRecordType === 'imaging' && rec.title.toLowerCase().includes('imaging'));

    return matchesSearch && matchesProvider && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Segment Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50/50 to-white border border-[#CBD5E1] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00685f] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00685f] bg-[#E1F0FF] px-2.5 py-0.5 rounded-full">
                  Clinical Records Repository
                </span>
                <span className="text-xs text-[#15803D] font-semibold flex items-center gap-1 bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 6 Verified Medical Documents
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
                Medical & Clinical Records
              </h2>
              <p className="text-xs md:text-sm text-[#475569] mt-1 max-w-2xl leading-relaxed">
                Official physician encounter notes, diagnostic imaging reports, blood chemistry labs, and clinical care summaries for Eleanor Vance. All documents are digitally timestamped with doctor attestation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={onRequestRecordsClick}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#00685f] bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Request Hospital Records</span>
            </button>
            <button
              onClick={onUploadClick}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Clinical Record</span>
            </button>
          </div>
        </div>

        {/* Quick Clinical Vital Indicators Strip */}
        <div className="mt-5 pt-4 border-t border-[#CBD5E1]/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Cardiology EF</span>
            <div className="text-sm font-bold text-[#081d2c] mt-0.5">58% Normal</div>
            <span className="text-[10px] text-[#15803D] font-medium">Stable sinus rhythm</span>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Kidney eGFR</span>
            <div className="text-sm font-bold text-[#081d2c] mt-0.5">&gt;60 mL/min</div>
            <span className="text-[10px] text-[#15803D] font-medium">Normal renal clearance</span>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Serum Potassium</span>
            <div className="text-sm font-bold text-[#081d2c] mt-0.5">4.3 mEq/L</div>
            <span className="text-[10px] text-[#15803D] font-medium">Optimal target: 3.5–5.0</span>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Fasting Glucose</span>
            <div className="text-sm font-bold text-[#081d2c] mt-0.5">104 mg/dL</div>
            <span className="text-[10px] text-[#64748B] font-medium">Pre-meal managed</span>
          </div>
        </div>
      </div>

      {/* Share Toast Notification */}
      {sharedDocNotice && (
        <div className="p-3.5 rounded-xl bg-[#00685f] text-white text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Secure 24-Hour Physician Access Link generated for <strong>{sharedDocNotice}</strong></span>
          </div>
          <button
            onClick={() => setSharedDocNotice(null)}
            className="text-white/80 hover:text-white font-bold text-xs ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#CBD5E1]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clinical notes, doctors, lab results, diagnoses (e.g. Lisinopril, Chen, Potassium)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685f] text-[#081d2c]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Filter className="w-3.5 h-3.5" />
            <span>Doctor:</span>
          </div>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#081d2c] font-medium focus:outline-none focus:ring-1 focus:ring-[#00685f]"
          >
            <option value="all">All Providers</option>
            <option value="chen">Dr. Christopher Chen (Cardiology)</option>
            <option value="thorne">Dr. Aris Thorne (Primary Care / Hospital)</option>
            <option value="quest">Quest Diagnostics (Labs)</option>
            <option value="miller">Dr. Sarah Miller (Podiatry)</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B] ml-2">
            <span>Type:</span>
          </div>
          <select
            value={selectedRecordType}
            onChange={(e) => setSelectedRecordType(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#081d2c] font-medium focus:outline-none focus:ring-1 focus:ring-[#00685f]"
          >
            <option value="all">All Record Types</option>
            <option value="consult">Physician Summaries</option>
            <option value="labs">Lab Panels & Bloodwork</option>
            <option value="prescriptions">Prescriptions & Allergies</option>
            <option value="imaging">X-Rays & Diagnostics</option>
          </select>
        </div>
      </div>

      {/* Record Cards List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#081d2c]">No clinical records matched your filter</h3>
            <p className="text-xs text-[#64748B] mt-1">Try clearing your search query or provider filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedProvider('all'); setSelectedRecordType('all'); }}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-[#00685f] bg-[#E1F0FF] rounded-lg hover:bg-[#D6EBFF]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRecords.map((doc) => (
            <div
              key={doc.id}
              className="p-5 md:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    doc.category === 'prescriptions'
                      ? 'bg-emerald-50 text-emerald-700'
                      : doc.title.toLowerCase().includes('cardiology')
                      ? 'bg-rose-50 text-rose-600'
                      : doc.title.toLowerCase().includes('imaging')
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-teal-50 text-[#00685f]'
                  }`}>
                    {doc.category === 'prescriptions' ? (
                      <FileCheck2 className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-[#00685f] bg-[#E1F0FF] px-2 py-0.5 rounded-md">
                        {doc.categoryLabel}
                      </span>
                      <span className="text-xs text-[#64748B]">PDF • {doc.fileSize}</span>
                      {doc.isPinned && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          Pinned Critical
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-[#081d2c] mt-1 leading-snug">
                      {doc.title}
                    </h3>
                    {doc.verifiedNotice && (
                      <div className="text-xs text-[#15803D] flex items-center gap-1 mt-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{doc.verifiedNotice}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start">
                  <button
                    onClick={() => onPreviewDocument(doc)}
                    className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-[#081d2c] text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => alert(`Downloading verified clinical PDF: ${doc.filename}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#00685f] text-white text-xs font-semibold hover:bg-[#005049] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Highlights & Findings Box */}
              {doc.highlights && (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#00685f] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Physician Attestation & Clinical Takeaways
                    </span>
                    {doc.physicianName && (
                      <span className="font-semibold text-[#475569]">{doc.physicianName}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    {doc.highlights}
                  </p>
                </div>
              )}

              {/* Special Allergy & Meds Display for Prescription Sheets */}
              {doc.allergies && doc.activeMeds && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-red-200 space-y-2">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-red-800">
                      Confirmed Medical Allergies
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {doc.allergies.map(a => (
                        <span key={a.name} className="px-2 py-0.5 rounded-md bg-white text-red-700 font-bold text-xs border border-red-200">
                          {a.name} ({a.severity})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] space-y-1.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#0F766E]">
                      Current Active Prescriptions (Synced)
                    </span>
                    <ul className="space-y-1 text-[11px] text-[#081d2c]">
                      {doc.activeMeds.map((med, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#0F766E]" />
                          <span>{med}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Bottom Footer Actions */}
              <div className="pt-2 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>AES-256 Encrypted</span>
                  </span>
                  <span>•</span>
                  <span>Downloaded {doc.downloadCount || 4} times</span>
                  <span>•</span>
                  <span className="text-[#081d2c] font-medium">{doc.filename}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(doc.id, `Document ID: ${doc.id}\nFile: ${doc.filename}\nAttestation: ${doc.verifiedNotice || 'Verified'}`)}
                    className="px-2.5 py-1 text-[11px] font-medium text-[#475569] hover:text-[#081d2c] flex items-center gap-1 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    {copiedId === doc.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Details Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Metadata</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleShare(doc.title)}
                    className="px-2.5 py-1 text-[11px] font-medium text-[#00685f] hover:bg-[#E1F0FF] rounded-md transition-colors flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share with Doctor</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fast Record Request Card at bottom */}
      <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#14532D]">Need to request records from an outside clinic or hospital?</h4>
            <p className="text-xs text-[#166534] mt-0.5">
              Send a pre-filled, signed HIPAA release authorization directly to OHSU, Providence, or Kaiser Permanente records departments.
            </p>
          </div>
        </div>

        <button
          onClick={onRequestRecordsClick}
          className="px-4 py-2 text-xs font-bold text-white bg-[#15803D] hover:bg-[#166534] rounded-xl shrink-0 transition-colors shadow-2xs"
        >
          Create Records Request Form
        </button>
      </div>
    </div>
  );
};
