import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Share2,
  FileText,
  Upload,
  Eye,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Printer,
  Smartphone,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Search,
  Filter,
  Layers,
  FileCheck2,
  CreditCard
} from 'lucide-react';
import { VaultDocument } from '../../types';
import { AllDocumentsSegment } from './vault/AllDocumentsSegment';
import { MedicalClinicalRecordsSegment } from './vault/MedicalClinicalRecordsSegment';
import { LegalPoaDirectivesSegment } from './vault/LegalPoaDirectivesSegment';
import { InsuranceMedicareCardsSegment } from './vault/InsuranceMedicareCardsSegment';

interface DocumentVaultViewProps {
  documents: VaultDocument[];
  onUploadClick: () => void;
  onPreviewDocument: (doc: VaultDocument) => void;
  onPrintEmergencyCard: () => void;
  onRequestRecordsClick: () => void;
  onAuditLogClick: () => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  onUploadClick,
  onPreviewDocument,
  onPrintEmergencyCard,
  onRequestRecordsClick,
  onAuditLogClick
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'clinical' | 'legal' | 'insurance'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocs = documents.filter(d => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'clinical') return d.category === 'clinical' || d.category === 'prescriptions';
    if (activeCategory === 'legal') return d.category === 'legal';
    if (activeCategory === 'insurance') return d.category === 'insurance';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-[#F6F9FF]">
      {/* Top Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00685f]">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Preview only • Fictional documents • Not for real records</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
            Document Vault & Health Records
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Preview of a future document-vault experience. Uploads, sharing, exports, and audit verification are not enabled for real records.
          </p>
        </div>

        {/* Top actions & storage meter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs">
            <div className="flex items-center justify-between gap-3 text-[11px] text-[#64748B]">
              <span>Vault Storage</span>
              <span className="font-mono font-bold text-[#00685f]">3.2 GB / 10 GB</span>
            </div>
            <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#00685f] h-full rounded-full w-1/3" />
            </div>
          </div>

          <button
            onClick={() => alert('Document export is not available in this preview.')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#081d2c] bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Export unavailable</span>
          </button>

          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-lg shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Preview upload</span>
          </button>
        </div>
      </div>

      {/* Circle Access Protocol Active Banner */}
      <div className="p-4 rounded-2xl bg-[#E1F0FF]/60 border border-[#CBD5E1] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00685f] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#081d2c]">
              Circle Access Protocol Active
            </div>
            <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
              This preview displays fictional records. It does not provide a verified access-control or audit system for real documents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAuditLogClick}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-semibold text-[#00685f] hover:bg-slate-50 transition-colors"
          >
            Audit Trail (24 Events)
          </button>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" /> Preview data only
          </span>
        </div>
      </div>

      {/* Filter Tabs & View Mode */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Documents', count: 18 },
            { id: 'clinical', label: 'Medical & Clinical Records', count: 6 },
            { id: 'legal', label: 'Legal, POA & Directives', count: 5 },
            { id: 'insurance', label: 'Insurance & Medicare Cards', count: 4 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === tab.id
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'bg-white border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <span>View mode:</span>
          <div className="inline-flex p-0.5 bg-white border border-[#CBD5E1] rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#E1F0FF] text-[#00685f]' : 'text-slate-400'}`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#E1F0FF] text-[#00685f]' : 'text-slate-400'}`}
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Documents (8 cols) & Right Emergency Utilities (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Documents / Segment Area */}
        <div className="lg:col-span-8 space-y-4">
          {activeCategory === 'all' && (
            <AllDocumentsSegment
              documents={documents}
              onPreviewDocument={onPreviewDocument}
              onUploadClick={onUploadClick}
              onPrintEmergencyCard={onPrintEmergencyCard}
              onNavigateCategory={(cat) => setActiveCategory(cat)}
            />
          )}

          {activeCategory === 'clinical' && (
            <MedicalClinicalRecordsSegment
              onPreviewDocument={onPreviewDocument}
              onUploadClick={onUploadClick}
              onRequestRecordsClick={onRequestRecordsClick}
            />
          )}

          {activeCategory === 'legal' && (
            <LegalPoaDirectivesSegment
              onPreviewDocument={onPreviewDocument}
              onUploadClick={onUploadClick}
            />
          )}

          {activeCategory === 'insurance' && (
            <InsuranceMedicareCardsSegment
              onPreviewDocument={onPreviewDocument}
              onUploadClick={onUploadClick}
            />
          )}
        </div>

        {/* Right Sidebar: Emergency Care Packet, Authorized Access Circle */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fast-Action Utility: Printable Emergency Care Packet */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Fast-Action Utility
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                Ready to Print
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#081d2c]">
                Printable Emergency Care Packet
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                A compact, double-sided laminated tri-fold summarizing Eleanor's critical profile, blood group, authorized proxies, daily regimen, and clinician contacts for first responders or sudden ER triage.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Blood Type:</span>
                <span className="font-bold text-[#081d2c]">O Positive (O+)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Primary ER Contact:</span>
                <span className="font-bold text-[#081d2c]">Sarah Vance (503-555-0192)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Preferred Hospital:</span>
                <span className="font-bold text-[#081d2c]">Providence St. Vincent</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Attending PCP:</span>
                <span className="font-bold text-[#081d2c]">Dr. Aris Thorne, MD</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={onPrintEmergencyCard}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print 1-Click Emergency Pocket Card</span>
              </button>

              <button
                onClick={() => alert('Emergency Pass pushed to Apple Wallet & Google Wallet')}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-[#081d2c] border border-[#CBD5E1] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-[#64748B]" />
                <span>Save Apple Wallet / Android Pass</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center gap-1">
              <span>Last compiled Oct 24, 2024 at 14:10</span>
            </div>
          </div>

          {/* Authorized Access Circle */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#081d2c]">Authorized Access Circle</h3>
              <button
                onClick={() => alert('Manage Roles')}
                className="text-xs font-semibold text-[#00685f] hover:underline"
              >
                Manage Roles
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Only circle members granted explicit document clearance can open encrypted medical files.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#00685f] text-white text-[10px] font-bold flex items-center justify-center">
                    SV
                  </span>
                  <div>
                    <div className="font-bold text-[#081d2c]">Sarah Vance</div>
                    <div className="text-[10px] text-[#64748B]">Primary Organizer • Full Access</div>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-[#00685f]" />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-600 text-white text-[10px] font-bold flex items-center justify-center">
                    MV
                  </span>
                  <div>
                    <div className="font-bold text-[#081d2c]">Marcus Vance</div>
                    <div className="text-[10px] text-[#64748B]">Family Co-Care • Full Access</div>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-[#00685f]" />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    ER
                  </span>
                  <div>
                    <div className="font-bold text-[#081d2c]">Elena Ramos, CNA</div>
                    <div className="text-[10px] text-[#64748B]">Care Aide • Clinical/Prescriptions Only</div>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-[#64748B]" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#DCFCE7]/50 border border-[#86EFAC]/50 text-[11px] text-[#15803D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Zero third-party telemetry, ad brokers, or automated cloud data mining.</span>
            </div>
          </div>

          {/* Need to Request Records Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-[#081d2c] flex items-center gap-1.5">
              <span>Need to request records?</span>
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Medical-record request delivery is not available in this preview.
            </p>
            <button
              onClick={onRequestRecordsClick}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#D6EBFF] transition-colors"
            >
              Create Records Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
