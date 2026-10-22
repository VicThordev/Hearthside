import React, { useState } from 'react';
import {
  Download,
  FileText,
  Database,
  Calendar,
  AlertTriangle,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Archive,
  Image as ImageIcon,
  Heart,
  X,
  FileCode,
  Lock
} from 'lucide-react';

export const DataExportDeletionSettings: React.FC = () => {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState('david-vance');
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [retentionPeriod, setRetentionPeriod] = useState('7years');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const handleDownload = (type: string, filename: string) => {
    setDownloadingType(type);
    setTimeout(() => {
      setDownloadingType(null);
      setDownloadSuccess(`Generated ${filename}`);
      // Simulate file download
      const fakeContent = `Hearthside Care Hub Export for Eleanor Vance\nGenerated on: ${new Date().toISOString()}\nExport Type: ${type}\nChecksum: sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`;
      const blob = new Blob([fakeContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();

      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Export Package Generated Successfully</p>
              <p className="text-[11px] text-emerald-700">{downloadSuccess} has been downloaded to your machine.</p>
            </div>
          </div>
          <button
            onClick={() => setDownloadSuccess(null)}
            className="text-xs text-emerald-800 font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Export Bundles Grid */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-6">
        <div>
          <h2 className="text-base font-bold font-display text-[#081d2c]">
            Download Health Records & Care History
          </h2>
          <p className="text-xs text-[#64748B]">
            Export Eleanor Vance's complete records in open, portable, and EHR-compliant formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Complete PDF Medical Binder */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between hover:border-[#00685f]/30 transition-all space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E1F0FF] text-[#00685f] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#081d2c]">
                Complete Medical Care Binder (PDF)
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Print-ready comprehensive binder with Table of Contents, emergency directives, current prescriptions, physician logs, and 12-month care notes.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#475569] pt-1">
                <span className="font-semibold">Estimated size:</span>
                <span className="font-mono">18.4 MB</span>
                <span>•</span>
                <span className="font-semibold">Format:</span>
                <span className="font-mono">PDF/A-1b (Archival)</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('pdf-binder', 'Eleanor_Vance_Complete_Medical_Binder.pdf')}
              disabled={downloadingType === 'pdf-binder'}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
            >
              {downloadingType === 'pdf-binder' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Compiling PDF Binder...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Medical Binder</span>
                </>
              )}
            </button>
          </div>

          {/* FHIR / JSON Ingestion Data */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between hover:border-[#00685f]/30 transition-all space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#081d2c]">
                Raw Records (FHIR / Structured JSON)
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Interoperable HL7 FHIR Release 4 JSON data bundle. Directly ingestible into Epic, Cerner, MyChart, or personal electronic health record systems.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#475569] pt-1">
                <span className="font-semibold">Format:</span>
                <span className="font-mono">JSON (HL7 FHIR v4)</span>
                <span>•</span>
                <span className="font-semibold">Encrypted:</span>
                <span className="text-emerald-700 font-semibold">Yes</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('fhir-json', 'Eleanor_Vance_FHIR_Records_Export.json')}
              disabled={downloadingType === 'fhir-json'}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#081d2c] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
            >
              {downloadingType === 'fhir-json' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                  <span>Packaging FHIR JSON...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 text-purple-700" />
                  <span>Export FHIR JSON Data</span>
                </>
              )}
            </button>
          </div>

          {/* Biometrics & Medication CSV */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between hover:border-[#00685f]/30 transition-all space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#081d2c]">
                Vitals & Medication Ledger (CSV)
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Spreadsheet containing blood pressure logs, heart rate, pulse oximetry, fluid intake, and exact medication administration timestamps.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#475569] pt-1">
                <span className="font-semibold">Records:</span>
                <span>240 data points</span>
                <span>•</span>
                <span className="font-semibold">Format:</span>
                <span className="font-mono">CSV / Excel</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('vitals-csv', 'Eleanor_Vance_Vitals_BP_History.csv')}
              disabled={downloadingType === 'vitals-csv'}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#081d2c] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
            >
              {downloadingType === 'vitals-csv' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                  <span>Extracting CSV...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-blue-700" />
                  <span>Download Vitals CSV</span>
                </>
              )}
            </button>
          </div>

          {/* Bedside Photos & Family Media ZIP */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between hover:border-[#00685f]/30 transition-all space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#081d2c]">
                Care Notes Photos & Frame Media (ZIP)
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Archival collection of all physical therapy pictures, family memories, and photos transmitted to Eleanor's Bedside Smart Frame.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#475569] pt-1">
                <span className="font-semibold">Photos:</span>
                <span>48 high-res images</span>
                <span>•</span>
                <span className="font-semibold">Size:</span>
                <span className="font-mono">42.1 MB</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('media-zip', 'Eleanor_Vance_Family_Care_Photos.zip')}
              disabled={downloadingType === 'media-zip'}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#081d2c] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
            >
              {downloadingType === 'media-zip' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                  <span>Compressing Photos...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 text-rose-700" />
                  <span>Download Photo Archive (ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Automated Backup & Retention Policy */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00685f]" />
          <div>
            <h2 className="text-base font-bold font-display text-[#081d2c]">
              Retention Policy & Cloud Backups
            </h2>
            <p className="text-xs text-[#64748B]">Automated preservation in compliance with medical record regulations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#081d2c] block">Automated Weekly Encrypted Backup</span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Backup and retention controls are not configured in this preview
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoBackupEnabled}
              onChange={() => setAutoBackupEnabled(!autoBackupEnabled)}
              className="w-4 h-4 rounded text-[#00685f]"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#081d2c] block">Data Retention Schedule</span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Regulatory holding period for clinical journals & logs
              </span>
            </div>
            <select
              value={retentionPeriod}
              onChange={(e) => setRetentionPeriod(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-medium"
            >
              <option value="1year">1 Year</option>
              <option value="3years">3 Years</option>
              <option value="7years">7 Years (Medical Record Standard)</option>
              <option value="indefinite">Indefinite (Until manually deleted)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone: Ownership Transfer & Deletion */}
      <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200 shadow-2xs space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-red-900">Danger Zone & Administrative Actions</h3>
            <span className="text-[11px] text-red-700 font-medium">
              Irreversible changes to Eleanor Vance's circle governance and stored records
            </span>
          </div>
        </div>

        <p className="text-xs text-red-800/80 leading-relaxed">
          Ownership transfer, deactivation, and device synchronization are not available in this preview.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setShowTransferModal(true)}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#081d2c] bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <ArrowRight className="w-4 h-4 text-[#00685f]" />
            <span>Transfer Circle Ownership</span>
          </button>

          <button
            onClick={() => setShowDeactivateModal(true)}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Deactivate Care Circle</span>
          </button>
        </div>
      </div>

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#081d2c]">Transfer Circle Ownership</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Select an authorized family member to become the Primary Organizer of Eleanor Vance's Circle. They will assume billing and invitation privileges.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#475569]">Select Successor:</label>
              <select
                value={transferTarget}
                onChange={(e) => setTransferTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs bg-white"
              >
                <option value="david-vance">David Vance (Logistics Lead / Son)</option>
                <option value="marcus-vance">Marcus Vance (Remote Contributor / Son)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs">
              Sarah Vance will remain in the circle as an active Family Collaborator.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Ownership transfer initiation email sent to successor for confirmation.');
                  setShowTransferModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#00685f] hover:bg-[#00514a]"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-red-200">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-red-950">Deactivate Care Circle?</h3>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              This action will unlink Eleanor's Bedside Smart Frame, cancel the Family Plus subscription renewal, and archive all family journal notes. You will have a 30-day grace period to restore data before permanent deletion.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748B]">
                Type <strong className="text-red-700">DEACTIVATE ELEANOR VANCE</strong> to confirm:
              </label>
              <input
                type="text"
                value={confirmationPhrase}
                onChange={(e) => setConfirmationPhrase(e.target.value)}
                placeholder="DEACTIVATE ELEANOR VANCE"
                className="w-full px-3 py-2 rounded-xl border border-red-300 text-xs focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={confirmationPhrase !== 'DEACTIVATE ELEANOR VANCE'}
                onClick={() => {
                  alert('Care circle scheduled for deactivation. 30-day grace period active.');
                  setShowDeactivateModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 cursor-pointer"
              >
                Permanently Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
