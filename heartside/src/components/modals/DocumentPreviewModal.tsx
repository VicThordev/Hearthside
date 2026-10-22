import React from 'react';
import { X, Lock, Download, Share2, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { VaultDocument } from '../../types';

interface DocumentPreviewModalProps {
  document: VaultDocument | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#00685f]" />
            <div>
              <h2 className="font-bold text-sm text-[#081d2c]">{document.title}</h2>
              <div className="text-[11px] text-[#64748B]">AES-256 Decrypted View • Authorized: Sarah Vance</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[460px] overflow-y-auto">
          <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-xs space-y-1">
            <span className="font-bold text-[#0F766E] uppercase text-[10px]">Document Attestation</span>
            <p className="text-[#081d2c] leading-relaxed">
              {document.verifiedNotice || 'Verified clinical document on file in Eleanor Vance Care Circle.'}
            </p>
          </div>

          {document.highlights && (
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-2">
              <span className="font-bold text-[#081d2c]">Physician Clinical Highlights:</span>
              <p className="text-[#475569] leading-relaxed">{document.highlights}</p>
            </div>
          )}

          {document.primaryProxy && (
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs space-y-1">
              <span className="font-bold text-purple-900">Healthcare Proxy Designees:</span>
              <div className="text-purple-950">
                Primary: <strong>{document.primaryProxy}</strong> • Alternate: <strong>{document.alternateProxy}</strong>
              </div>
            </div>
          )}

          {document.previewThumbnail && (
            <div className="rounded-xl overflow-hidden border border-[#CBD5E1] h-48 bg-slate-100">
              <img
                src={document.previewThumbnail}
                alt="Document preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-2 font-mono text-[#475569]">
            <div>File: {document.filename}</div>
            <div>Size: {document.fileSize}</div>
            <div>Encryption: AES-GCM-256 (Key verified via biometric session)</div>
            <div>Checksum: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
          </div>
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-xs text-[#15803D] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Watermark Stamp Applied
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#081d2c]"
            >
              Close
            </button>
            <button
              onClick={() => alert(`Downloading decrypted copy of ${document.filename}`)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Decrypted PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
