import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Download,
  AlertTriangle,
  ExternalLink,
  Shield,
  Bell,
  UserCheck,
  FileText,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Check,
  X,
  Lock,
  PhoneCall,
  Clock
} from 'lucide-react';
import { Invoice } from '../../types';
import { CircleProfileSettings } from './settings/CircleProfileSettings';
import { MemberNotificationsSettings } from './settings/MemberNotificationsSettings';
import { SecurityAccessLogsSettings } from './settings/SecurityAccessLogsSettings';
import { DataExportDeletionSettings } from './settings/DataExportDeletionSettings';

interface SettingsViewProps {
  invoices: Invoice[];
  onAuditLogClick?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  invoices,
  onAuditLogClick
}) => {
  const [activeTab, setActiveTab] = useState<'billing' | 'profile' | 'notifications' | 'security' | 'export'>('billing');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  const tabTitles = {
    billing: { title: 'Account & Billing Settings', subtitle: 'Subscription & Circle Controls' },
    profile: { title: 'Circle Profile & Recipient Identity', subtitle: 'Care Recipient & Home Details' },
    notifications: { title: 'Member Notifications & Alert Matrix', subtitle: 'Emergency & Caregiver Routing' },
    security: { title: 'Security & Access Logs', subtitle: 'HIPAA Audits & Access Safeguards' },
    export: { title: 'Data Export & Archival Records', subtitle: 'Health Records Archive & Portability' },
  };

  // Matrix checkboxes state
  const [matrixState, setMatrixState] = useState({
    sosCall: true,
    sosSms: true,
    sosEmail: false,
    briefingEmail: true,
    briefingSms: true,
    briefingPush: false,
    taskPush: true,
    taskSms: true,
    taskEmail: false
  });

  const toggleMatrix = (key: keyof typeof matrixState) => {
    setMatrixState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-[#F6F9FF]">
      {/* Top Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            <span>Settings</span>
            <span>/</span>
            <span className="text-[#00685f]">{tabTitles[activeTab].subtitle}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
            {tabTitles[activeTab].title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E1F0FF] text-[#00685f]">
            Circle ID: #EV-77291
          </span>
          <button
            onClick={() => alert('Opening Tax Invoices for HSA / FSA reconciliation')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#081d2c] bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Tax Invoices</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E2E8F0] pb-2 no-scrollbar">
        {[
          { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
          { id: 'profile', label: 'Circle Profile', icon: UserCheck },
          { id: 'notifications', label: 'Member Notifications', icon: Bell },
          { id: 'security', label: 'Security & Access Logs', icon: Shield },
          { id: 'export', label: 'Data Export & Deletion', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#081d2c] hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Billing Tab Content */}
      {activeTab === 'billing' && (
        <>
          {/* Top 2-Column Split: Active Plan vs Payment Method */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Plan Card (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CCFBF1] text-[#0F766E] uppercase tracking-wider">
                Current Active Plan
              </span>
              <span className="text-xs text-[#15803D] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-renews
              </span>
            </div>
            <span className="text-xs text-[#64748B]">Billing cycle: Monthly</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display text-[#081d2c]">
              Family Plus Plan
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Coordinated care giving peace of mind for the Vance Family Circle.
            </p>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-display text-[#00685f]">$14.99</span>
            <span className="text-xs text-[#64748B]">/ month</span>
            <span className="text-xs text-[#64748B] ml-3">Next charge: <strong>November 24, 2024</strong></span>
          </div>

          {/* Stat meters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Circle Members</span>
                <span className="font-bold text-[#081d2c]">4 / 8</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00685f] h-full rounded-full w-1/2" />
              </div>
              <div className="text-[10px] text-[#64748B] mt-1.5">4 seat invites open</div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Document Storage</span>
                <span className="font-bold text-[#081d2c]">3.2 / 10 GB</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00685f] h-full rounded-full w-1/3" />
              </div>
              <div className="text-[10px] text-[#64748B] mt-1.5">Preview storage estimate</div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Voice & SMS Relays</span>
                <span className="font-bold text-[#081d2c]">48 / 150</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#00685f] h-full rounded-full w-1/3" />
              </div>
              <div className="text-[10px] text-[#64748B] mt-1.5">Resets in 18 days</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert('Upgrading to Family Complete')}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] transition-colors shadow-2xs"
            >
              Upgrade to Family Complete
            </button>
            <button
              onClick={() => setBillingPeriod('annually')}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#081d2c] border border-[#CBD5E1] hover:bg-slate-50 transition-colors"
            >
              Switch to Annual (Save 20%)
            </button>
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#00685f] hover:underline flex items-center gap-1 ml-auto"
            >
              <span>Manage in Stripe Customer Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Payment Method Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#081d2c]">Payment Method</h3>
              <span className="text-[11px] font-semibold text-[#00685f] bg-[#E1F0FF] px-2 py-0.5 rounded-full">
                Default
              </span>
            </div>

            {/* Credit Card Visual */}
            <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider opacity-80">VISA DEBIT</span>
                <span className="text-sm">📶</span>
              </div>
              <div className="font-mono text-base tracking-widest my-4">
                •••• •••• •••• 4242
              </div>
              <div className="flex items-center justify-between text-xs opacity-80">
                <span>SARAH VANCE</span>
                <span>EXPIRES 08/27</span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-[#64748B]">
              <div className="flex justify-between">
                <span>Issuer:</span>
                <span className="font-semibold text-[#081d2c]">Chase Bank NA</span>
              </div>
              <div className="flex justify-between">
                <span>Postal Code:</span>
                <span className="font-semibold text-[#081d2c]">97201 (Portland, OR)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Update Payment Details modal')}
            className="w-full py-2 px-3 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#081d2c] hover:bg-slate-50 transition-colors text-center"
          >
            Update Details
          </button>
        </div>
      </div>

      {/* Subscription Tiers Comparison */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#00685f] uppercase tracking-wider">
              Scale Your Care Pod
            </div>
            <h2 className="text-xl font-bold font-display text-[#081d2c]">
              Care Circle Subscription Tiers
            </h2>
            <p className="text-xs text-[#64748B]">
              Adjust support according to clinical complexity and caregiver team size.
            </p>
          </div>

          {/* Billing frequency toggle */}
          <div className="p-1 bg-white border border-[#CBD5E1] rounded-xl inline-flex self-start sm:self-auto">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                billingPeriod === 'monthly' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annually')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                billingPeriod === 'annually' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
              }`}
            >
              <span>Billed Annually</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#DCFCE7] text-[#15803D]">
                20% off
              </span>
            </button>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Family Plus (Current) */}
          <div className="p-6 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#081d2c]">Family Plus</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E1F0FF] text-[#00685f]">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Perfect for immediate family coordinating routine elder support.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display text-[#081d2c]">
                  {billingPeriod === 'monthly' ? '$14.99' : '$11.99'}
                </span>
                <span className="text-xs text-[#64748B]">/ mo</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#081d2c] pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Up to <strong>8 circle members</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span><strong>10 GB</strong> medical document vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>150 automated SMS alerts/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Shared medication & errand board</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Automated physician call relays</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Multi-circle family management</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#64748B] cursor-default text-center"
            >
              Your Current Plan
            </button>
          </div>

          {/* Tier 2: Family Complete (Recommended) */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#00685f] shadow-md flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#081d2c]">Family Complete</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#00685f] text-white">
                  Popular
                </span>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00685f]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommended for Eleanor</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Comprehensive oversight with high-priority medical reminders.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display text-[#081d2c]">
                  {billingPeriod === 'monthly' ? '$24.99' : '$19.99'}
                </span>
                <span className="text-xs text-[#64748B]">/ mo</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#081d2c] pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Up to <strong>15 circle members</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span><strong>25 GB</strong> medical document vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Unlimited automated SMS & voice calls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Medication reminder alerts + check-off logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>24/7 Priority clinical nurse help desk</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Custom HIPAA business associate pact</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => alert('Upgraded to Family Complete Plan!')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#00685f] hover:bg-[#005049] text-white shadow-sm transition-colors text-center flex items-center justify-center gap-2"
            >
              <span>Upgrade to Complete</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tier 3: Care Coordination Pro */}
          <div className="p-6 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#081d2c]">Care Coordination Pro</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                  Aides & Pro
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                For professional caregivers, legal advocates, and multi-home circles.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display text-[#081d2c]">
                  {billingPeriod === 'monthly' ? '$49.99' : '$39.99'}
                </span>
                <span className="text-xs text-[#64748B]">/ mo</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#081d2c] pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Up to <strong>30 members</strong> & agency staff</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span><strong>100 GB</strong> vault with OCR search</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Multi-circle management (Up to 3 elders)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Complete legal audit logs & timestamped sign-offs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>Dedicated care account manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00685f] shrink-0" />
                  <span>HIPAA compliance packet & data export</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => alert('Contacting Care Advisor')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-50 transition-colors text-center"
            >
              Contact Care Advisor
            </button>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table (Image 9) */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold font-display text-[#081d2c]">
              Recent Invoices
            </h3>
            <p className="text-xs text-[#64748B]">
              Download statement receipts for family tax deduction and HSA/FSA records.
            </p>
          </div>

          <button
            onClick={() => alert('Exporting all invoices as ZIP')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#081d2c] bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Export All Invoices (.ZIP)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="pb-2.5">Invoice ID</th>
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Plan Description</th>
                <th className="pb-2.5">Amount</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 font-mono font-bold text-[#081d2c]">{inv.invoiceNumber}</td>
                  <td className="py-3 text-[#475569]">{inv.date}</td>
                  <td className="py-3 text-[#081d2c]">{inv.planName}</td>
                  <td className="py-3 font-mono font-bold text-[#081d2c]">{inv.amount}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                      ● Paid
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => alert(`Downloading PDF for ${inv.invoiceNumber}`)}
                      className="inline-flex items-center gap-1 text-[#00685f] hover:underline font-semibold"
                    >
                      <FileText className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Urgent Care & Notification Matrix (Image 9) */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-bold font-display text-[#081d2c]">
            Urgent Care & Notification Matrix
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure how life-critical announcements and daily routine check-ins reach your care circle members.
          </p>
        </div>

        <div className="space-y-3">
          {/* Row 1: SOS Alert */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#081d2c]">
                  Emergency Alert & Fall Triggers
                </div>
                <div className="text-[11px] text-[#64748B]">
                  When Eleanor presses the pendant or vitals drop below preset safety bounds.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matrixState.sosCall}
                  onChange={() => toggleMatrix('sosCall')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>Immediate Automated Call</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matrixState.sosSms}
                  onChange={() => toggleMatrix('sosSms')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>Critical SMS</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#64748B]">
                <input
                  type="checkbox"
                  checked={matrixState.sosEmail}
                  onChange={() => toggleMatrix('sosEmail')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>Email Alert</span>
              </label>
            </div>
          </div>

          {/* Row 2: Morning Briefing */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E1F0FF] text-[#00685f] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#081d2c]">
                  Daily Morning Briefing (08:00 AM)
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Daily summary of scheduled visits, physical therapy, and morning medications.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matrixState.briefingEmail}
                  onChange={() => toggleMatrix('briefingEmail')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>Daily Digest Email</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matrixState.briefingSms}
                  onChange={() => toggleMatrix('briefingSms')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>Morning SMS</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#64748B]">
                <input
                  type="checkbox"
                  checked={matrixState.briefingPush}
                  onChange={() => toggleMatrix('briefingPush')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>App Push</span>
              </label>
            </div>
          </div>

          {/* Row 3: Task & Errand Assignments */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#081d2c]">
                  Task & Errand Assignments
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Direct notifications when grocery runs, prescription pickups, or rides are claimed.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matrixState.taskPush}
                  onChange={() => toggleMatrix('taskPush')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>Mobile Push</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={matrixState.taskSms}
                  onChange={() => toggleMatrix('taskSms')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>SMS Ping</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#64748B]">
                <input
                  type="checkbox"
                  checked={matrixState.taskEmail}
                  onChange={() => toggleMatrix('taskEmail')}
                  className="w-4 h-4 rounded text-[#00685f]"
                />
                <span>Email Digest</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Split: Complete Archive Export & Danger Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complete Archive Export */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E1F0FF] text-[#00685f] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#081d2c]">
                Complete Archive Export
              </h3>
              <span className="text-[11px] text-[#00685f] font-semibold">
                Preview-only data package
              </span>
            </div>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            Download every logged appointment, doctor encounter note, medication logs, and scanned medical directives for Eleanor Vance in open, portable formats.
          </p>

          <ul className="text-xs text-[#475569] space-y-1 pl-1">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#00685f]" />
              <span>JSON format for records ingestion</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Consolidated PDF binder with table of contents</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={() => alert('Generating complete archive package... (Estimated size: 42 MB)')}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#081d2c] border border-[#CBD5E1] hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Generate Archive Package</span>
            </button>
            <div className="text-[11px] text-slate-400 mt-2">
              Last backup: Oct 12, 2024
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200 shadow-2xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-red-900">Danger Zone</h3>
              <span className="text-[11px] text-red-700 font-semibold">
                Irreversible administrative actions
              </span>
            </div>
          </div>

          <p className="text-xs text-red-800/80 leading-relaxed">
            Transferring circle ownership delegates all billing liability and record management privileges to another authorized family member.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => alert('Transfer Circle Ownership modal')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#081d2c] bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Transfer Circle Ownership</span>
            </button>

            <button
              onClick={() => alert('Are you sure you want to deactivate this care circle?')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Deactivate Circle</span>
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Circle Profile Tab */}
      {activeTab === 'profile' && <CircleProfileSettings />}

      {/* Member Notifications Tab */}
      {activeTab === 'notifications' && <MemberNotificationsSettings />}

      {/* Security & Access Logs Tab */}
      {activeTab === 'security' && <SecurityAccessLogsSettings />}

      {/* Data Export & Deletion Tab */}
      {activeTab === 'export' && <DataExportDeletionSettings />}
    </div>
  );
};
