import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Plus,
  Eye,
  Smartphone,
  Printer,
  Sparkles,
  Search,
  RotateCw,
  Phone,
  FileCheck2,
  Layers,
  AlertCircle
} from 'lucide-react';
import { VaultDocument } from '../../../types';

interface InsuranceMedicareCardsSegmentProps {
  onPreviewDocument: (doc: VaultDocument) => void;
  onUploadClick: () => void;
}

export const InsuranceMedicareCardsSegment: React.FC<InsuranceMedicareCardsSegmentProps> = ({
  onPreviewDocument,
  onUploadClick
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<{ [cardId: string]: boolean }>({});
  const [shareCardNotice, setShareCardNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'benefits' | 'claims'>('cards');

  const toggleFlip = (cardId: string) => {
    setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const cards = [
    {
      id: 'medicare-red-white-blue',
      name: 'Original Medicare (Parts A & B)',
      issuer: 'Centers for Medicare & Medicaid Services',
      type: 'Primary Federal Health Insurance',
      cardStyle: 'from-blue-900 via-indigo-900 to-slate-900 text-white border-blue-400/40',
      beneficiary: 'ELEANOR M VANCE',
      medicareNumber: '1EG4-TE8-MA92',
      entitledTo: [
        { part: 'HOSPITAL (PART A)', effective: '08-01-2015' },
        { part: 'MEDICAL (PART B)', effective: '08-01-2015' }
      ],
      backDetails: {
        issuerContact: '1-800-MEDICARE (1-800-633-4227)',
        tty: '1-877-486-2048',
        claimsAddress: 'Noridian Healthcare Solutions, PO Box 6700, Fargo, ND 58108',
        notes: 'Carry this card with you to all hospital visits and specialist consults. Do not laminate the official paper card.'
      },
      fileDoc: {
        id: 'doc-medicare-orig',
        title: 'Original Medicare Card Scan (Front & Back).pdf',
        filename: 'Medicare_Card_Original_CMS_Eleanor_Vance.pdf',
        fileSize: '1.8 MB',
        category: 'insurance' as const,
        categoryLabel: 'Federal Medicare Card',
        isVerified: true,
        verifiedNotice: 'Verified active with CMS Portal on Oct 1, 2024'
      }
    },
    {
      id: 'medicare-part-d',
      name: 'SilverScript Choice Medicare Part D',
      issuer: 'Aetna / CVS Health Company',
      type: 'Prescription Drug Plan',
      cardStyle: 'from-teal-800 via-emerald-900 to-slate-900 text-white border-teal-400/40',
      beneficiary: 'ELEANOR M VANCE',
      memberId: 'MED-88201948-01',
      rxBin: '004336',
      rxPcn: 'MEDDPRX',
      rxGroup: 'RX2109',
      issuerPhone: '1-866-235-5660',
      copays: 'Tier 1 Preferred Generic: $0 • Tier 2 Generic: $8 • Tier 3 Brand: $35',
      backDetails: {
        issuerContact: 'Pharmacist Helpline: 1-800-364-6331',
        claimsAddress: 'SilverScript Claims Processing, PO Box 52066, Phoenix, AZ 85072',
        preferredPharmacy: 'Cedar Hills Walgreens & Beaverton Outpatient Pharmacy'
      },
      fileDoc: {
        id: 'doc-part-d',
        title: 'Medicare Part D Prescription Card 2024.pdf',
        filename: 'SilverScript_Part_D_Prescription_Card_2024.pdf',
        fileSize: '2.4 MB',
        category: 'insurance' as const,
        categoryLabel: 'Prescription Drug Coverage',
        isVerified: true,
        verifiedNotice: 'Active with Cedar Hills Walgreens Pharmacy #1042'
      }
    },
    {
      id: 'medigap-plan-g',
      name: 'Mutual of Omaha Medigap Plan G',
      issuer: 'Mutual of Omaha Insurance Company',
      type: 'Medicare Supplement Insurance',
      cardStyle: 'from-amber-900 via-stone-900 to-slate-900 text-white border-amber-400/40',
      beneficiary: 'ELEANOR M VANCE',
      memberId: 'MO-PLANG-550921',
      groupNumber: 'GRP-99021',
      planType: 'Plan G Standard Comprehensive',
      issuerPhone: '1-800-775-6000',
      coverageSummary: 'Covers 100% Medicare Part A deductible & copays, 100% Part B coinsurance & Part B excess charges.',
      backDetails: {
        issuerContact: 'Policyholder Customer Service: 1-800-775-6000',
        claimsOffice: 'Mutual of Omaha Medicare Supplement, PO Box 30372, Omaha, NE 68103',
        notes: 'Covers the Medicare Part A hospital deductible ($1,632) and all 20% Part B coinsurance.'
      },
      fileDoc: {
        id: 'doc-medigap',
        title: 'Mutual of Omaha Medigap Plan G Policy & ID Card.pdf',
        filename: 'Mutual_Of_Omaha_Plan_G_Card_2024.pdf',
        fileSize: '2.1 MB',
        category: 'insurance' as const,
        categoryLabel: 'Supplemental Medigap Insurance',
        isVerified: true,
        verifiedNotice: 'Annual premium auto-pay active through Dec 2025'
      }
    },
    {
      id: 'genworth-ltc',
      name: 'Genworth Long-Term Care Insurance',
      issuer: 'Genworth Life Insurance Company',
      type: 'Comprehensive Home & Community Care',
      cardStyle: 'from-cyan-900 via-sky-950 to-slate-900 text-white border-cyan-400/40',
      beneficiary: 'ELEANOR M VANCE',
      policyNumber: 'LTC-GEN-4910294',
      dailyBenefit: '$220.00 / Day ($6,600 / Month)',
      eliminationPeriod: '30 Days (Satisfied & Waived)',
      claimsRep: 'Katherine O\'Connell (Senior Care Case Mgr)',
      issuerPhone: '1-800-444-9372',
      backDetails: {
        issuerContact: 'LTC Claims Care Team: 1-800-444-9372',
        claimsAddress: 'Genworth LTC Claims, PO Box 40007, Lynchburg, VA 24506',
        directDeposit: 'Direct monthly reimbursement to Vance Care Account'
      },
      fileDoc: {
        id: 'doc-ltc',
        title: 'Genworth Long-Term Care Policy Schedule & Aide Eligibility.pdf',
        filename: 'Genworth_LTC_Policy_Schedule_2024.pdf',
        fileSize: '3.4 MB',
        category: 'insurance' as const,
        categoryLabel: 'Long-Term Care Benefit',
        isVerified: true,
        verifiedNotice: 'Elena Ramos CNA certified hours eligible for monthly benefit draw'
      }
    }
  ];

  const handleShare = (cardName: string) => {
    setShareCardNotice(cardName);
    setTimeout(() => setShareCardNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border border-[#CBD5E1] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00685f] text-white flex items-center justify-center shrink-0 shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00685f] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full">
                  Verified Insurance Wallet
                </span>
                <span className="text-xs text-[#15803D] font-semibold flex items-center gap-1 bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 4 Active Policies in Force
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  No Coverage Gap
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
                Insurance & Medicare Cards
              </h2>
              <p className="text-xs md:text-sm text-[#475569] mt-1 max-w-2xl leading-relaxed">
                High-resolution front/back scans, digital member credentials, RXBIN/PCN numbers, and cost-sharing benefit schedules for Eleanor Vance’s primary Medicare, Part D drug plan, Medigap Plan G, and Long-Term Care policy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => alert('Exporting all 4 insurance cards to Apple Wallet / Google Wallet pass format')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#081d2c] bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Smartphone className="w-4 h-4 text-[#00685f]" />
              <span>Save to Phone Wallet</span>
            </button>
            <button
              onClick={onUploadClick}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Card Scan</span>
            </button>
          </div>
        </div>

        {/* Insurance Coverage Summary Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#CBD5E1]/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Medicare Part B Ded.</span>
            <div className="text-sm font-bold text-[#081d2c] mt-0.5">$240.00 / yr</div>
            <span className="text-[10px] text-[#15803D] font-medium">100% Met for 2024</span>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Medigap Plan G</span>
            <div className="text-sm font-bold text-[#081d2c] mt-0.5">100% Coinsurance</div>
            <span className="text-[10px] text-[#15803D] font-medium">$0 Copay at Dr. Chen & PCP</span>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">Prescription Tier 1</span>
            <div className="text-sm font-bold text-[#081d2c] mt-0.5">$0.00 Copay</div>
            <span className="text-[10px] text-[#15803D] font-medium">Lisinopril & Atorvastatin</span>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-[#64748B]">LTC Daily Benefit</span>
            <div className="text-sm font-bold text-[#081d2c] mt-0.5">$220.00 / day</div>
            <span className="text-[10px] text-[#15803D] font-medium">Reimbursing Elena CNA hours</span>
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {shareCardNotice && (
        <div className="p-3.5 rounded-xl bg-[#00685f] text-white text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Digital Card Credentials sent securely to pharmacy/clinic portal for <strong>{shareCardNotice}</strong></span>
          </div>
          <button
            onClick={() => setShareCardNotice(null)}
            className="text-white/80 hover:text-white font-bold text-xs ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#CBD5E1] pb-2">
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'cards'
              ? 'bg-[#00685f] text-white shadow-xs'
              : 'text-[#475569] hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Interactive Digital Cards ({cards.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'benefits'
              ? 'bg-[#00685f] text-white shadow-xs'
              : 'text-[#475569] hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Copay & Cost-Sharing Schedule</span>
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'claims'
              ? 'bg-[#00685f] text-white shadow-xs'
              : 'text-[#475569] hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>LTC Claims & Reimbursement Tracker</span>
        </button>
      </div>

      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const isFlipped = !!flippedCards[card.id];

            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-[#CBD5E1] shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Physical Card Container with Flip Toggle */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-[#081d2c]">{card.name}</span>
                    <button
                      onClick={() => toggleFlip(card.id)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#D6EBFF] transition-colors flex items-center gap-1"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>{isFlipped ? 'View Front Side' : 'Flip to Back Side'}</span>
                    </button>
                  </div>

                  {/* Realistic Rendered Card Visual */}
                  <div
                    className={`rounded-2xl p-5 bg-gradient-to-br ${card.cardStyle} border shadow-lg relative min-h-[200px] flex flex-col justify-between transition-all`}
                  >
                    {!isFlipped ? (
                      /* FRONT SIDE */
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                              {card.issuer}
                            </div>
                            <div className="text-sm font-bold text-white tracking-wide mt-0.5">
                              {card.type}
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold text-white tracking-wider border border-white/20">
                            VALID 2024-2025
                          </span>
                        </div>

                        {card.medicareNumber && (
                          <div className="my-2 bg-black/20 p-2.5 rounded-xl border border-white/10">
                            <span className="text-[9px] uppercase font-bold text-slate-300 tracking-wider">
                              Medicare Beneficiary ID
                            </span>
                            <div className="text-lg font-mono font-extrabold text-white tracking-wider mt-0.5 flex items-center justify-between">
                              <span>{card.medicareNumber}</span>
                              <button
                                onClick={() => handleCopy(`${card.id}-mbi`, card.medicareNumber!)}
                                className="text-xs text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
                                title="Copy Medicare Number"
                              >
                                {copiedKey === `${card.id}-mbi` ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {card.memberId && (
                          <div className="my-2 bg-black/20 p-2.5 rounded-xl border border-white/10">
                            <span className="text-[9px] uppercase font-bold text-slate-300 tracking-wider">
                              Member ID
                            </span>
                            <div className="text-base font-mono font-extrabold text-white tracking-wider mt-0.5 flex items-center justify-between">
                              <span>{card.memberId}</span>
                              <button
                                onClick={() => handleCopy(`${card.id}-mem`, card.memberId!)}
                                className="text-xs text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
                                title="Copy Member ID"
                              >
                                {copiedKey === `${card.id}-mem` ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {card.rxBin && (
                          <div className="grid grid-cols-3 gap-2 text-[10px] bg-black/20 p-2 rounded-lg border border-white/10 font-mono">
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase">RXBIN</span>
                              <span className="text-white font-bold">{card.rxBin}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase">RXPCN</span>
                              <span className="text-white font-bold">{card.rxPcn}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase">RXGRP</span>
                              <span className="text-white font-bold">{card.rxGroup}</span>
                            </div>
                          </div>
                        )}

                        {card.policyNumber && (
                          <div className="my-2 bg-black/20 p-2.5 rounded-xl border border-white/10">
                            <span className="text-[9px] uppercase font-bold text-slate-300 tracking-wider">
                              LTC Policy #
                            </span>
                            <div className="text-base font-mono font-extrabold text-white tracking-wider mt-0.5 flex items-center justify-between">
                              <span>{card.policyNumber}</span>
                              <button
                                onClick={() => handleCopy(`${card.id}-ltc`, card.policyNumber!)}
                                className="text-xs text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
                              >
                                {copiedKey === `${card.id}-ltc` ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-end justify-between pt-2 border-t border-white/10">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-300 block">
                              Beneficiary / Insured Name
                            </span>
                            <span className="font-bold text-white text-xs tracking-wider">
                              {card.beneficiary}
                            </span>
                          </div>

                          {card.entitledTo && (
                            <div className="text-right text-[9px] text-slate-300 font-mono">
                              <div>PART A: 08-01-2015</div>
                              <div>PART B: 08-01-2015</div>
                            </div>
                          )}

                          {card.dailyBenefit && (
                            <div className="text-right text-[10px] text-emerald-300 font-bold">
                              {card.dailyBenefit}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      /* BACK SIDE */
                      <div className="space-y-2 text-xs flex flex-col justify-between h-full">
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex items-center justify-between">
                            <span>Cardholder & Provider Helpline</span>
                            <span className="text-white/60 text-[9px]">Magnetic Strip Active</span>
                          </div>
                          <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-teal-400" />
                            <span>{card.backDetails.issuerContact}</span>
                          </div>
                        </div>

                        <div className="bg-black/25 p-2 rounded-lg text-[10px] text-slate-200 space-y-1">
                          <span className="font-bold text-white block">Medical Claims Submission Address:</span>
                          <p className="font-mono">{card.backDetails.claimsAddress}</p>
                        </div>

                        {card.backDetails.preferredPharmacy && (
                          <div className="text-[10px] text-teal-200">
                            <strong>Pharmacy Network:</strong> {card.backDetails.preferredPharmacy}
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/10 text-[9px] text-slate-300 flex items-center justify-between">
                          <span>Verified with Social Security & CMS Registry</span>
                          <span className="font-mono">REV-2024.10</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Meta & Fast Actions */}
                <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#15803D] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{card.fileDoc.verifiedNotice}</span>
                    </span>
                    <span className="text-[11px] text-[#64748B]">{card.fileDoc.fileSize}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => onPreviewDocument(card.fileDoc as any)}
                      className="py-1.5 px-2 rounded-lg border border-[#CBD5E1] text-[#081d2c] text-xs font-semibold hover:bg-white transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00685f]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloading high-resolution front & back PDF scans for ${card.name}`)}
                      className="py-1.5 px-2 rounded-lg border border-[#CBD5E1] text-[#081d2c] text-xs font-semibold hover:bg-white transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Scan</span>
                    </button>
                    <button
                      onClick={() => handleShare(card.name)}
                      className="py-1.5 px-2 rounded-lg bg-[#00685f] text-white text-xs font-semibold hover:bg-[#005049] transition-colors flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Send Card</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Copay & Cost Sharing Schedule */}
      {activeTab === 'benefits' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base text-[#081d2c]">2024 Eleanor Vance Out-of-Pocket Cost Schedule</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Comprehensive breakdown combining Original Medicare Part A & B with Mutual of Omaha Plan G Medigap and SilverScript Part D.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[#64748B] font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Service Category</th>
                  <th className="py-2.5 px-3">Primary Medicare Share</th>
                  <th className="py-2.5 px-3">Medigap Plan G Coverage</th>
                  <th className="py-2.5 px-3">Eleanor Out-of-Pocket</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#081d2c]">
                <tr>
                  <td className="py-3 px-3 font-semibold">Primary Care Physician (Dr. Thorne)</td>
                  <td className="py-3 px-3">80% approved amount after deductible</td>
                  <td className="py-3 px-3">Covers remaining 20% coinsurance</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">$0.00 Copay</td>
                  <td className="py-3 px-3"><span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Covered 100%</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Cardiology Specialist (Dr. Chen)</td>
                  <td className="py-3 px-3">80% approved amount</td>
                  <td className="py-3 px-3">Covers remaining 20% coinsurance</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">$0.00 Copay</td>
                  <td className="py-3 px-3"><span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Covered 100%</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Part B Annual Deductible</td>
                  <td className="py-3 px-3">$240.00 standard annual</td>
                  <td className="py-3 px-3">Excluded under standard Plan G</td>
                  <td className="py-3 px-3 font-bold text-[#081d2c]">$240 / yr (Paid Jan 2024)</td>
                  <td className="py-3 px-3"><span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">Met for Year</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Hospital Inpatient (Days 1–60)</td>
                  <td className="py-3 px-3">All covered except $1,632 deductible</td>
                  <td className="py-3 px-3">Covers 100% ($1,632) Part A deductible</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">$0.00 Total</td>
                  <td className="py-3 px-3"><span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Protected</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Diagnostic Labs & Fasting Panels</td>
                  <td className="py-3 px-3">100% covered through Quest Diagnostics</td>
                  <td className="py-3 px-3">N/A (Primary pays in full)</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">$0.00</td>
                  <td className="py-3 px-3"><span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Free Preventive</span></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold">Prescriptions (Tier 1 Generics)</td>
                  <td className="py-3 px-3">Covered via SilverScript Part D</td>
                  <td className="py-3 px-3">N/A</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">$0.00 at Walgreens</td>
                  <td className="py-3 px-3"><span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">Preferred Tier</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: LTC Claims & Reimbursement Tracker */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-[#081d2c]">Genworth Long-Term Care Monthly Claims</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Elena Ramos (CNA Certified Caregiver) weekly hours invoiced and submitted for $220/day benefit reimbursement.
              </p>
            </div>
            <button
              onClick={() => alert('Generating new monthly LTC Care Log claim packet for Genworth Claims Office')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Monthly Aide Claim</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">October 2024 Submitted</span>
              <div className="text-lg font-bold text-[#081d2c] mt-1">$2,640.00</div>
              <span className="text-[11px] text-amber-700 font-semibold">Under Carrier Adjudication</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">September 2024 Reimbursed</span>
              <div className="text-lg font-bold text-emerald-700 mt-1">$2,860.00</div>
              <span className="text-[11px] text-emerald-700 font-semibold">Direct Deposited Oct 08, 2024</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Remaining Lifetime Pool</span>
              <div className="text-lg font-bold text-[#00685f] mt-1">$194,500.00</div>
              <span className="text-[11px] text-[#64748B]">3+ Years Protection Remaining</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
