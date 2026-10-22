import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Printer,
  Share2,
  Users,
  Search,
  Filter,
  Check,
  Copy,
  ExternalLink,
  Plus,
  Key,
  ShieldAlert,
  Award
} from 'lucide-react';
import { VaultDocument } from '../../../types';

interface LegalPoaDirectivesSegmentProps {
  onPreviewDocument: (doc: VaultDocument) => void;
  onUploadClick: () => void;
}

export const LegalPoaDirectivesSegment: React.FC<LegalPoaDirectivesSegmentProps> = ({
  onPreviewDocument,
  onUploadClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showFridgeNotice, setShowFridgeNotice] = useState(false);

  const legalDocuments: VaultDocument[] = [
    {
      id: 'leg-1',
      title: 'Advance Health Care Directive & Durable Medical Power of Attorney.pdf',
      filename: 'Advance_Health_Care_Directive_Durable_POA_Oregon.pdf',
      fileSize: '4.1 MB',
      category: 'legal',
      categoryLabel: 'Statutory Health Care Directive',
      badge: 'Notarized & Signed',
      isRestricted: true,
      isVerified: true,
      verifiedNotice: 'Executed March 14, 2023 with Oregon Notary Seal #OR-981240 • Registered with Providence Health System',
      primaryProxy: 'Sarah Vance (Daughter) — Full Medical Authority',
      alternateProxy: 'Marcus Vance (Son) — Alternate Successor',
      hasDnr: true,
      hasPolst: true,
      highlights: 'Appoints Sarah Vance as primary healthcare representative. Authorizes proxy to consult with clinicians, review full medical files, and make treatment decisions in the event of incapacity. Alternate proxy Marcus Vance succeeds if Sarah is unable or unavailable.',
      watermarkNote: 'Requires 2FA verification to unlock raw document',
      downloadCount: 6
    },
    {
      id: 'leg-2',
      title: 'Oregon POLST: Physician Orders for Life-Sustaining Treatment.pdf',
      filename: 'Oregon_POLST_Signed_Form_DrThorne.pdf',
      fileSize: '2.8 MB',
      category: 'legal',
      categoryLabel: 'State POLST Registry Form',
      badge: 'Bright Pink Original',
      isRestricted: true,
      isVerified: true,
      verifiedNotice: 'Oregon POLST Registry #OR-892110 • Signed by Dr. Aris Thorne, MD on Oct 11, 2023 • Reconfirmed annually',
      primaryProxy: 'Sarah Vance (Healthcare Representative)',
      alternateProxy: 'Marcus Vance',
      hasDnr: true,
      highlights: 'Section A: Do Not Resuscitate (DNR/No CPR). Section B: Comfort-focused treatment (relieve pain and suffering, oral hydration encouraged, do not transfer to ICU unless comfort cannot be achieved). Section C: Artificially administered nutrition not desired.',
      watermarkNote: 'Original physical bright pink sheet stored on refrigerator and inside Emergency Pocket Packet',
      downloadCount: 11
    },
    {
      id: 'leg-3',
      title: 'General Durable Financial Power of Attorney & Banking Authority.pdf',
      filename: 'General_Financial_POA_Vance_Estate.pdf',
      fileSize: '5.2 MB',
      category: 'legal',
      categoryLabel: 'Durable Financial & Property Authority',
      badge: 'Notarized by Vance Estate Law LLC',
      isRestricted: true,
      isVerified: true,
      verifiedNotice: 'Drafted by Bradley & Cole Estate Counsel • Recorded Washington County, OR • Branch Authorization with First Tech CU & First National Trust',
      primaryProxy: 'Sarah Vance (Attorney-in-Fact)',
      alternateProxy: 'Marcus Vance (Co-Attorney-in-Fact)',
      highlights: 'Empowers Attorney-in-Fact to manage checking/savings accounts, pay health insurance premiums, authorize home safety modifications, sign Medicare claims, and handle housing/assisted living contracts.',
      watermarkNote: 'Restricted access: Primary Organizers only',
      downloadCount: 3
    },
    {
      id: 'leg-4',
      title: 'HIPAA Omnibus Disclosure Authorization & Information Release.pdf',
      filename: 'HIPAA_Omnibus_Authorization_Care_Circle.pdf',
      fileSize: '1.2 MB',
      category: 'legal',
      categoryLabel: 'HIPAA Information Release',
      badge: 'All Providers Cleared',
      isRestricted: false,
      isVerified: true,
      verifiedNotice: 'Universal HIPAA release covering Providence, OHSU, Kaiser Northwest, Quest Diagnostics & Cedar Hills Pharmacy',
      primaryProxy: 'Sarah Vance, Marcus Vance, David Vance',
      highlights: 'Allows healthcare providers to disclose all protected health records, lab reports, billing statements, and prescription details directly to Eleanor Vance\'s care circle team without delay.',
      downloadCount: 19
    },
    {
      id: 'leg-5',
      title: 'Memorial Preferences, Living Will Directives & Legacy Wishes.pdf',
      filename: 'Memorial_Directives_Legacy_Wishes_Portland.pdf',
      fileSize: '1.8 MB',
      category: 'legal',
      categoryLabel: 'Personal Directives & Living Will',
      badge: 'Personal Directive',
      isRestricted: true,
      isVerified: true,
      verifiedNotice: 'Personal guidance document signed by Eleanor Vance in presence of family • Updated Nov 2023',
      primaryProxy: 'Sarah Vance & Marcus Vance',
      highlights: 'Specifies preferences for end-of-life comfort care, non-denominational family gathering at Forest Park Memorial Grove, and distribution of heirloom photo albums to grandchildren.',
      downloadCount: 4
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDocs = legalDocuments.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.primaryProxy && doc.primaryProxy.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.highlights && doc.highlights.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.verifiedNotice && doc.verifiedNotice.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'notarized' && doc.badge?.toLowerCase().includes('notarized')) ||
      (selectedStatus === 'polst' && doc.categoryLabel.toLowerCase().includes('polst')) ||
      (selectedStatus === 'financial' && doc.categoryLabel.toLowerCase().includes('financial')) ||
      (selectedStatus === 'hipaa' && doc.title.toLowerCase().includes('hipaa'));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Segment Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/40 to-white border border-[#CBD5E1] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Legal & Fiduciary Directives
                </span>
                <span className="text-xs text-[#15803D] font-semibold flex items-center gap-1 bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 5 Validated Directives on File
                </span>
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 2FA Protected
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
                Legal, POA & Advance Directives
              </h2>
              <p className="text-xs md:text-sm text-[#475569] mt-1 max-w-2xl leading-relaxed">
                Legally executed documents specifying Eleanor Vance’s healthcare representative appointments, financial authority, DNR/POLST resuscitation preferences, and universal HIPAA authorizations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setShowFridgeNotice(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-800 bg-purple-100 hover:bg-purple-200 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print POLST Fridge Notice</span>
            </button>
            <button
              onClick={onUploadClick}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Legal Document</span>
            </button>
          </div>
        </div>

        {/* Legal Safeguard / Proxy Hierarchy Matrix */}
        <div className="mt-5 pt-4 border-t border-[#CBD5E1]/70 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-white/90 border border-purple-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-purple-700">Primary Healthcare Agent</span>
              <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.2 rounded-md">Active</span>
            </div>
            <div className="font-bold text-sm text-[#081d2c] mt-1">Sarah Vance (Daughter)</div>
            <p className="text-[11px] text-[#475569] mt-0.5">
              Phone: (503) 555-0192 • Full healthcare decisions, doctor consultations & POLST execution
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Successor Agent</span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.2 rounded-md">Alternate</span>
            </div>
            <div className="font-bold text-sm text-[#081d2c] mt-1">Marcus Vance (Son)</div>
            <p className="text-[11px] text-[#475569] mt-0.5">
              Phone: (503) 555-0144 • Steps in if primary representative is unreachable or incapacitated
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-800">POLST / DNR Order</span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.2 rounded-md border border-rose-200">
                Do Not Resuscitate
              </span>
            </div>
            <div className="font-bold text-sm text-[#081d2c] mt-1">Comfort Care Measures Only</div>
            <p className="text-[11px] text-[#475569] mt-0.5">
              Signed by Dr. Thorne • Registered Oregon POLST Registry #OR-892110
            </p>
          </div>
        </div>
      </div>

      {/* POLST Fridge Notice Modal */}
      {showFridgeNotice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-purple-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                  POLST
                </div>
                <h3 className="font-bold text-base text-[#081d2c]">Oregon Emergency POLST Protocol</h3>
              </div>
              <button onClick={() => setShowFridgeNotice(false)} className="text-slate-400 hover:text-slate-600 text-sm">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 text-xs space-y-2 text-pink-950">
              <div className="font-bold uppercase tracking-wider text-[11px] text-pink-800">
                Instructions for Paramedics & First Responders (EMT)
              </div>
              <p className="leading-relaxed">
                Eleanor Vance’s physical, signed <strong>Bright Pink POLST form</strong> is secured on the outside of her kitchen refrigerator and inside the Emergency Pocket Packet in her bedside drawer.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong>Resuscitation (CPR):</strong> Do Not Attempt Resuscitation (DNR / No Code).</li>
                <li><strong>Medical Interventions:</strong> Comfort Measures Only (pain relief, oxygen, position of comfort). Do not intubate.</li>
                <li><strong>Attending Physician:</strong> Dr. Aris Thorne, MD (503-216-5400).</li>
                <li><strong>Healthcare Agent:</strong> Sarah Vance (503-555-0192).</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowFridgeNotice(false)}
                className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#081d2c]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowFridgeNotice(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#CBD5E1]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search legal documents, proxies, notary seals, or powers (e.g. Sarah Vance, POLST, Financial POA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-700 text-[#081d2c]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#081d2c] font-medium focus:outline-none focus:ring-1 focus:ring-purple-700"
          >
            <option value="all">All Legal Records</option>
            <option value="notarized">Notarized & Sealed</option>
            <option value="polst">POLST / DNR Forms</option>
            <option value="financial">Financial Powers of Attorney</option>
            <option value="hipaa">HIPAA Authorizations</option>
          </select>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Verify Notary Seal</span>
          </button>
        </div>
      </div>

      {/* Notary Verification Dialog */}
      {showVerifyModal && (
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex items-start justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-purple-900">Oregon State Notary Commission Verification Check</span>
              <p className="text-purple-950 mt-0.5">
                Commission #981240 registered with Oregon Secretary of State Corporation Division. Commission expires Nov 18, 2027. Both signature affidavits and physical embossed stamps match state registry records.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowVerifyModal(false)}
            className="text-xs font-bold text-purple-700 hover:text-purple-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Legal Documents List */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#081d2c]">No legal documents matched your search</h3>
            <p className="text-xs text-[#64748B] mt-1">Try resetting the category filter or searching for another keyword.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 md:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 shadow-2xs">
                    <Lock className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                        {doc.categoryLabel}
                      </span>
                      {doc.badge && (
                        <span className="text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                          {doc.badge}
                        </span>
                      )}
                      <span className="text-xs text-[#64748B]">PDF • {doc.fileSize}</span>
                      {doc.isRestricted && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Restricted Access
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-[#081d2c] mt-1 leading-snug">
                      {doc.title}
                    </h3>
                    {doc.verifiedNotice && (
                      <div className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
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
                    <Eye className="w-3.5 h-3.5 text-purple-700" />
                    <span>View Encrypted Copy</span>
                  </button>
                  <button
                    onClick={() => alert(`Downloading verified legal record: ${doc.filename}`)}
                    className="px-3 py-1.5 rounded-lg bg-purple-700 text-white text-xs font-semibold hover:bg-purple-800 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Proxy Designation Box */}
              {doc.primaryProxy && (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#64748B]">Designated Representatives</span>
                    <div className="text-xs text-[#081d2c] font-medium mt-0.5">
                      Primary: <strong className="text-purple-900">{doc.primaryProxy}</strong>
                      {doc.alternateProxy && (
                        <span> • Alternate: <strong>{doc.alternateProxy}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.hasDnr && (
                      <span className="px-2.5 py-1 rounded-md bg-white border border-rose-200 text-rose-700 font-bold text-[11px]">
                        Full DNR on File
                      </span>
                    )}
                    {doc.hasPolst && (
                      <span className="px-2.5 py-1 rounded-md bg-white border border-pink-200 text-pink-700 font-bold text-[11px]">
                        POLST Attached
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Highlights & Scope of Authority */}
              {doc.highlights && (
                <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                  <div className="font-bold text-purple-900 text-[11px] uppercase tracking-wider">
                    Scope of Authority & Legal Directives
                  </div>
                  <p className="text-[#334155] leading-relaxed">
                    {doc.highlights}
                  </p>
                </div>
              )}

              {/* Bottom Footer Actions */}
              <div className="pt-2 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                    <span>{doc.watermarkNote || 'Encrypted PDF with Digital Watermark'}</span>
                  </span>
                  <span>•</span>
                  <span>Downloaded {doc.downloadCount || 3} times</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(doc.id, `Legal Document: ${doc.title}\nPrimary Agent: ${doc.primaryProxy || 'None'}\nRegistry: ${doc.verifiedNotice || 'On File'}`)}
                    className="px-2.5 py-1 text-[11px] font-medium text-[#475569] hover:text-[#081d2c] flex items-center gap-1 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    {copiedId === doc.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Metadata Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Details</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => alert(`Permissions for ${doc.title}: Granted to Sarah Vance (Full), Marcus Vance (Co-agent), Legal Counsel.`)}
                    className="px-2.5 py-1 text-[11px] font-medium text-purple-700 hover:bg-purple-50 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Manage Access Keys</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
