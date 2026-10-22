import React, { useState } from 'react';
import {
  FileText,
  CreditCard,
  Lock,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
  Share2,
  Search,
  Filter,
  QrCode,
  Printer,
  Smartphone,
  ChevronRight,
  Layers,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';
import { VaultDocument } from '../../../types';

interface AllDocumentsSegmentProps {
  documents: VaultDocument[];
  onPreviewDocument: (doc: VaultDocument) => void;
  onUploadClick: () => void;
  onPrintEmergencyCard: () => void;
  onNavigateCategory: (category: 'clinical' | 'legal' | 'insurance') => void;
}

export const AllDocumentsSegment: React.FC<AllDocumentsSegmentProps> = ({
  documents,
  onPreviewDocument,
  onUploadClick,
  onPrintEmergencyCard,
  onNavigateCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const allDocumentsList: VaultDocument[] = [
    // 1. Insurance & Medicare Cards
    {
      id: 'doc-1',
      title: 'Medicare Part D & Supplemental Insurance Card 2024.pdf',
      filename: 'Medicare_Part_D_Supplemental_Card_2024.pdf',
      fileSize: '2.4 MB',
      category: 'insurance',
      categoryLabel: 'Insurance & Coverage',
      isPinned: true,
      isVerified: true,
      verifiedNotice: 'Card verified • Uploaded Oct 12, 2024 by Sarah Vance (Daughter)',
      policyHolder: 'Eleanor M. Vance',
      memberId: '1EG4-TE8-MA92',
      rxBinPcn: '004336 / MEDDPRX',
      validUntil: 'Dec 31, 2025. Accepted at Providence St. Vincent and Walgreens Pharmacy (Cedar Hills).',
      watermarkNote: 'Watermarked • Exp: 14 months',
      downloadCount: 14
    },
    // 2. Legal Directives
    {
      id: 'doc-2',
      title: 'Advance Health Care Directive & Durable POA.pdf',
      filename: 'Advance_Health_Care_Directive_Durable_POA.pdf',
      fileSize: '4.1 MB',
      category: 'legal',
      categoryLabel: 'Legal & Directives',
      isRestricted: true,
      badge: 'Notarized & Signed',
      verifiedNotice: 'Executed March 14, 2023 with Oregon Notary Seal • Restricted to Primary Organizers',
      primaryProxy: 'Sarah Vance',
      alternateProxy: 'Marcus Vance',
      hasDnr: true,
      hasPolst: true,
      highlights: 'Appoints Sarah Vance as primary healthcare proxy. Full DNR order and comfort measures attached.',
      watermarkNote: 'Requires 2FA verification to unlock raw document',
      downloadCount: 4
    },
    // 3. Clinical Summary
    {
      id: 'doc-3',
      title: 'Dr. Chen Cardiology Consultation Summary - Oct 2024.pdf',
      filename: 'Dr_Chen_Cardiology_Summary_Oct_2024.pdf',
      fileSize: '1.4 MB',
      category: 'clinical',
      categoryLabel: 'Cardiology • Dr. Chen, MD',
      isVerified: true,
      verifiedNotice: 'Providence Heart Clinic • Visit date: Oct 18, 2024 • Follow-up scheduled April 2025',
      physicianName: 'Dr. Christopher Chen, MD',
      highlights: 'Patient exhibits stable sinus rhythm. Mild hypertension controlled under updated Lisinopril 20mg. Recommend continuing daily 20-minute assisted walking and reduced sodium intake under 1,500mg/day. Echocardiogram: Normal EF (58%). 3 Exhibits attached (ECG Strip, Labs).',
      downloadCount: 8
    },
    // 4. Prescriptions
    {
      id: 'doc-4',
      title: 'Current Prescriptions & Allergy Sheet.pdf',
      filename: 'Current_Prescriptions_Allergy_Sheet_Oct2024.pdf',
      fileSize: '820 KB',
      category: 'prescriptions',
      categoryLabel: 'Active Prescription • EMT Fast-Scan',
      isVerified: true,
      isPinned: true,
      verifiedNotice: 'Synced with Cedar Hills Walgreens Pharmacy • Verified by Pharmacist J. Miller',
      allergies: [
        { name: 'Penicillin', severity: 'Severe - Anaphylaxis' },
        { name: 'Sulfa Drugs', severity: 'Hives/Rash' }
      ],
      activeMeds: [
        'Lisinopril (20mg daily)',
        'Atorvastatin (20mg night)',
        'Metformin (500mg breakfast)',
        'Vitamin D3 (2000 IU)'
      ],
      downloadCount: 22
    },
    // 5. Oregon POLST
    {
      id: 'doc-polst',
      title: 'Oregon POLST: Physician Orders for Life-Sustaining Treatment.pdf',
      filename: 'Oregon_POLST_Signed_Form_DrThorne.pdf',
      fileSize: '2.8 MB',
      category: 'legal',
      categoryLabel: 'State POLST Registry Form',
      badge: 'Bright Pink Original',
      isRestricted: true,
      isVerified: true,
      verifiedNotice: 'Oregon POLST Registry #OR-892110 • Signed by Dr. Aris Thorne, MD',
      primaryProxy: 'Sarah Vance',
      hasDnr: true,
      highlights: 'Section A: Do Not Resuscitate (DNR). Section B: Comfort-focused treatment only.',
      downloadCount: 11
    },
    // 6. Home Safety
    {
      id: 'doc-5',
      title: 'Home Safety Inspection & Grab-Bar Installation Manual.pdf',
      filename: 'Home_Safety_Inspection_GrabBar_Manual.pdf',
      fileSize: '5.8 MB',
      category: 'home-safety',
      categoryLabel: 'Home Safety & Mobility',
      isVerified: true,
      verifiedNotice: 'Inspected by Portland Senior Safety Solutions • Completed Aug 29, 2024',
      previewThumbnail: '/src/assets/images/home_safety_grab_bar_1792204248572.jpg',
      highlights: 'Includes warranty certificates, stud locator diagrams for master bathroom walk-in shower, ramp incline schematics, and 24-hr contractor hotline for maintenance.',
      nextInspection: 'Next inspection recommendation: August 2025',
      downloadCount: 6
    },
    // 7. Quest Panel
    {
      id: 'doc-quest',
      title: 'Quest Diagnostics Comprehensive Metabolic & Renal Panel.pdf',
      filename: 'Quest_Metabolic_Renal_Panel_Oct2024.pdf',
      fileSize: '890 KB',
      category: 'clinical',
      categoryLabel: 'Laboratory Bloodwork',
      isVerified: true,
      verifiedNotice: 'Quest Diagnostics Beaverton Center • Collected Oct 19, 2024',
      highlights: 'Serum Potassium 4.3 mEq/L, BUN 18, Creatinine 0.9, eGFR >60 mL/min. All within optimal therapeutic range.',
      downloadCount: 7
    },
    // 8. Financial POA
    {
      id: 'doc-financial-poa',
      title: 'General Durable Financial Power of Attorney & Banking Authority.pdf',
      filename: 'General_Financial_POA_Vance_Estate.pdf',
      fileSize: '5.2 MB',
      category: 'legal',
      categoryLabel: 'Durable Financial & Property Authority',
      badge: 'Recorded Washington County',
      isRestricted: true,
      isVerified: true,
      verifiedNotice: 'Drafted by Bradley & Cole Estate Counsel • Branch Authorization First Tech CU',
      primaryProxy: 'Sarah Vance',
      alternateProxy: 'Marcus Vance',
      downloadCount: 3
    }
  ];

  const filtered = allDocumentsList.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.highlights && d.highlights.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.physicianName && d.physicianName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.policyHolder && d.policyHolder.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'clinical' && (d.category === 'clinical' || d.category === 'prescriptions')) ||
      (filterType === 'legal' && d.category === 'legal') ||
      (filterType === 'insurance' && d.category === 'insurance') ||
      (filterType === 'home-safety' && d.category === 'home-safety');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Quick Access to the 3 Core Segments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hub 1: Medical & Clinical Records */}
        <div
          onClick={() => onNavigateCategory('clinical')}
          className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-[#CBD5E1] hover:border-[#00685f] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#00685f] text-white flex items-center justify-center shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-[#00685f] bg-[#CCFBF1] px-2 py-0.5 rounded-full">
                6 Records
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#081d2c] mt-3 group-hover:text-[#00685f] transition-colors">
              Medical & Clinical Records
            </h3>
            <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
              Dr. Chen cardiology reports, Quest labs, metabolic panels, allergy sheets, and hospital discharge notes.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-[#00685f]">
            <span>Open Clinical Hub</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hub 2: Legal, POA & Directives */}
        <div
          onClick={() => onNavigateCategory('legal')}
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-[#CBD5E1] hover:border-purple-600 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                5 Directives
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#081d2c] mt-3 group-hover:text-purple-700 transition-colors">
              Legal, POA & Directives
            </h3>
            <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
              Advance Health Care Directive, Oregon POLST DNR order, Financial POA, and HIPAA release authorizations.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-purple-700">
            <span>Open Legal Hub</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hub 3: Insurance & Medicare Cards */}
        <div
          onClick={() => onNavigateCategory('insurance')}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-[#CBD5E1] hover:border-blue-600 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                4 Cards Active
              </span>
            </div>
            <h3 className="font-bold text-sm text-[#081d2c] mt-3 group-hover:text-blue-700 transition-colors">
              Insurance & Medicare Cards
            </h3>
            <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
              Original Medicare Part A/B card, Part D SilverScript RXBIN/PCN, Mutual of Omaha Plan G, and Genworth LTC.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-blue-700">
            <span>Open Insurance Wallet</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#CBD5E1]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 18 vault documents, member IDs, doctors, or directives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685f] text-[#081d2c]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#081d2c] font-medium focus:outline-none focus:ring-1 focus:ring-[#00685f]"
          >
            <option value="all">All Documents ({allDocumentsList.length})</option>
            <option value="clinical">Clinical & Prescriptions</option>
            <option value="legal">Legal, POA & POLST</option>
            <option value="insurance">Insurance & Medicare Cards</option>
            <option value="home-safety">Home Safety & Mobility</option>
          </select>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 rounded text-xs font-medium ${viewMode === 'list' ? 'bg-white shadow-xs text-[#081d2c]' : 'text-[#64748B]'}`}
            >
              Detailed
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 rounded text-xs font-medium ${viewMode === 'grid' ? 'bg-white shadow-xs text-[#081d2c]' : 'text-[#64748B]'}`}
            >
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* Document Items List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {filtered.map((doc) => {
          const isInsurance = doc.category === 'insurance';
          const isLegal = doc.category === 'legal';
          const isClinical = doc.category === 'clinical' || doc.category === 'prescriptions';

          return (
            <div
              key={doc.id}
              className="p-5 md:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      isInsurance
                        ? 'bg-emerald-50 text-emerald-700'
                        : isLegal
                        ? 'bg-purple-100 text-purple-800'
                        : isClinical
                        ? 'bg-teal-50 text-[#00685f]'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {isInsurance ? (
                      <CreditCard className="w-5 h-5" />
                    ) : isLegal ? (
                      <Lock className="w-5 h-5" />
                    ) : isClinical ? (
                      <Stethoscope className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          isInsurance
                            ? 'text-emerald-800 bg-emerald-100'
                            : isLegal
                            ? 'text-purple-800 bg-purple-100'
                            : 'text-[#00685f] bg-[#E1F0FF]'
                        }`}
                      >
                        {doc.categoryLabel}
                      </span>
                      <span className="text-xs text-[#64748B]">PDF • {doc.fileSize}</span>
                      {doc.badge && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {doc.badge}
                        </span>
                      )}
                      {doc.isRestricted && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          Restricted 2FA
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
                    onClick={() => alert(`Downloading verified document: ${doc.filename}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#00685f] text-white text-xs font-semibold hover:bg-[#005049] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Special Metadata Blocks */}
              {doc.policyHolder && (
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B]">Policy Holder</span>
                    <div className="font-bold text-[#081d2c] text-sm mt-0.5">{doc.policyHolder}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B]">Member ID</span>
                    <div className="font-mono font-bold text-[#081d2c] text-sm mt-0.5">{doc.memberId}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B]">RXBIN / PCN</span>
                    <div className="font-mono font-bold text-[#081d2c] text-sm mt-0.5">{doc.rxBinPcn}</div>
                  </div>
                </div>
              )}

              {doc.primaryProxy && (
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-800">Designated Agent</span>
                    <div className="font-medium text-[#081d2c] mt-0.5">
                      Primary: <strong className="text-purple-950">{doc.primaryProxy}</strong>
                      {doc.alternateProxy && <span> • Alternate: <strong>{doc.alternateProxy}</strong></span>}
                    </div>
                  </div>
                  {doc.hasDnr && (
                    <span className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-700 font-bold text-[10px]">
                      DNR Order Active
                    </span>
                  )}
                </div>
              )}

              {doc.highlights && (
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] leading-relaxed">
                  {doc.highlights}
                </div>
              )}

              {doc.previewThumbnail && (
                <div className="rounded-xl overflow-hidden border border-[#CBD5E1] h-32 bg-slate-100">
                  <img
                    src={doc.previewThumbnail}
                    alt="Safety inspection schematic"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Bottom Card Footer */}
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                <span className="flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>{doc.watermarkNote || 'Preview document • fictional data'}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Generating direct share link for ${doc.title}`)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-[#00685f] hover:bg-[#E1F0FF] rounded-md transition-colors flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share Document</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
