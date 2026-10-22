import React, { useState } from 'react';
import {
  Users,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  UserPlus,
  FileCheck,
  Send,
  Sparkles,
  Award,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { Caregiver, PendingInvite } from '../../types';

interface CareTeamViewProps {
  caregivers: Caregiver[];
  pendingInvites: PendingInvite[];
  onInviteClick: () => void;
  onAuditLogClick: () => void;
  onPermissionMatrixClick: () => void;
  onTestEscalationClick: () => void;
}

export const CareTeamView: React.FC<CareTeamViewProps> = ({
  caregivers,
  pendingInvites,
  onInviteClick,
  onAuditLogClick,
  onPermissionMatrixClick,
  onTestEscalationClick
}) => {
  const [filterType, setFilterType] = useState<'all' | 'family' | 'pros'>('all');

  const filteredCaregivers = caregivers.filter(c => {
    if (filterType === 'all') return true;
    if (filterType === 'family') return c.relationship.includes('Daughter') || c.relationship.includes('Son');
    if (filterType === 'pros') return c.role.includes('Nurse') || c.tier === 'Restricted Helper' || c.tier === 'Clinical';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-[#F6F9FF]">
      {/* Top Header Ribbon */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00685f]">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Access & Circle Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
            Care Team & Family Circle
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Manage members, permissions, pending invitations, and emergency contacts for Eleanor Vance's Care Circle.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onAuditLogClick}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#081d2c] bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5 text-[#00685f]" />
            <span>Access Audit Log</span>
          </button>

          <button
            onClick={() => alert('Directory exported as CSV / PDF')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#081d2c] bg-white border border-[#CBD5E1] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Export Directory</span>
          </button>

          <button
            onClick={onInviteClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-lg shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite New Member</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Capacity */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#E1F0FF] text-[#00685f] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E]">
              Plus Plan
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-[#081d2c]">
              4 <span className="text-sm font-normal text-[#64748B]">/ 8</span>
            </div>
            <div className="text-xs text-[#64748B] flex items-center justify-between mt-1">
              <span>Active Team Capacity</span>
              <span className="font-semibold text-[#00685f]">50% used</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Pending */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
              Action Needed
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-[#081d2c]">2</div>
            <div className="text-xs text-[#64748B] mt-0.5">Pending Approvals</div>
            <div className="text-[11px] text-[#B45309] font-medium mt-1">
              Next invite expires in 4 days • Review below ↓
            </div>
          </div>
        </div>

        {/* Metric 3: External Aide */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
              Verified Aide
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-[#081d2c]">1</div>
            <div className="text-xs text-[#64748B] mt-0.5">External Aide</div>
            <div className="text-[11px] text-[#64748B] mt-1">
              Nurse Beth RN (Mon/Wed/Fri) • Clinical log access restricted
            </div>
          </div>
        </div>

        {/* Metric 4: Designated Contacts */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Priority Tier
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-[#081d2c]">2</div>
            <div className="text-xs text-[#64748B] mt-0.5">Designated Contacts</div>
            <div className="text-[11px] text-[#64748B] mt-1">
              Tier 1: Sarah V. • Tier 2: David V. • Escalation tree active
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Members List, Right Escalation & Permission Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Members & Pending Invites (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Members Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-display text-[#081d2c]">Active Members</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#E1F0FF] text-[#00685f] text-xs font-semibold">
                  4 People
                </span>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-white border border-[#CBD5E1] rounded-lg">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    filterType === 'all' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('family')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    filterType === 'family' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
                  }`}
                >
                  Family
                </button>
                <button
                  onClick={() => setFilterType('pros')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    filterType === 'pros' ? 'bg-[#00685f] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#081d2c]'
                  }`}
                >
                  Professionals
                </button>
              </div>
            </div>

            {/* Member Cards */}
            <div className="space-y-3">
              {filteredCaregivers.map((member) => (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-2xs shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-[#081d2c]">{member.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#00685f] text-white">
                            {member.role}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E1F0FF] text-[#00685f]">
                            {member.relationship}
                          </span>
                        </div>

                        {/* Contacts */}
                        <div className="flex items-center gap-3.5 text-xs text-[#64748B] mt-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{member.email}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{member.phone}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{member.location}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right badge & menu */}
                    <div className="flex items-center gap-2 shrink-0">
                      {member.isAccountOwner && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Account Owner</span>
                        </span>
                      )}
                      <button
                        onClick={() => alert(`Managing role for ${member.name}`)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#D6EBFF] rounded-lg transition-colors"
                      >
                        {member.isAccountOwner ? 'Edit Role' : 'Manage Access'}
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tasks & Permissions Summary strip */}
                  <div className="pt-3 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#64748B] gap-2">
                    <div className="flex items-center gap-1.5 font-medium text-[#00685f]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00685f]" />
                      <span>{member.assignedTasksNote || `${member.assignedTasksCount} Assigned Weekly Tasks`}</span>
                    </div>
                    <div className="text-[11px] text-[#475569]">
                      {member.permissionsNote}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invitations Section */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-[#081d2c]">
                    Pending Invitations
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                    2 Pending
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Invited people must accept their secure link before gaining access.
                </p>
              </div>

              <button
                onClick={onInviteClick}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00685f] hover:underline"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send New Invite</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    <th className="pb-2.5">Recipient & Contact</th>
                    <th className="pb-2.5">Invited Role</th>
                    <th className="pb-2.5">Sent Date</th>
                    <th className="pb-2.5 text-right">Status & Timer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {pendingInvites.map((invite) => (
                    <tr key={invite.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E1F0FF] text-[#00685f] font-bold flex items-center justify-center shrink-0">
                            {invite.initials}
                          </div>
                          <div>
                            <div className="font-bold text-[#081d2c]">{invite.name}</div>
                            <div className="text-[11px] text-[#64748B]">{invite.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#E1F0FF] text-[#00685f] font-medium text-[11px]">
                          {invite.role}
                        </span>
                        <div className="text-[10px] text-[#64748B] mt-0.5">{invite.relation}</div>
                      </td>
                      <td className="py-3 pr-4 text-[#475569]">
                        {invite.sentDate}
                      </td>
                      <td className="py-3 text-right">
                        <div className="font-semibold text-amber-700">
                          Expires in {invite.expiresInDays} days
                        </div>
                        <div className="text-[10px] text-[#64748B]">
                          {invite.statusNote}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Escalation Sequence & Role Guides (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Escalation Sequence Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#081d2c]">Escalation Sequence</h3>
              </div>
              <button
                onClick={() => alert('Editing escalation flow order')}
                className="text-xs font-semibold text-[#00685f] hover:underline"
              >
                Edit Flow
              </button>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              Order of automatic alerts triggered when Eleanor uses the SOS Pendant or missed-med alert fires:
            </p>

            {/* Sequence steps */}
            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E2E8F0]">
              {/* Step 1 */}
              <div className="relative flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#00685f] text-white text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-2xs">
                  1
                </span>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#081d2c]">Sarah Vance</span>
                    <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.2 rounded-full">
                      Immediate
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    Voice Call • SMS Alert
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#17324D] text-white text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-2xs">
                  2
                </span>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#081d2c]">David Vance</span>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full">
                      If no reply (3 min)
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    SMS Alert & Push
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-2xs">
                  3
                </span>
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-red-900">911 Dispatch & Dr. Chen</span>
                    <span className="text-[10px] font-semibold text-red-700 bg-white px-1.5 py-0.2 rounded-full">
                      Fallback (8 min)
                    </span>
                  </div>
                  <div className="text-[11px] text-red-800/80 mt-0.5 leading-snug">
                    Automatic emergency service dispatch with electronic medical summary beacon.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="text-[#64748B] text-[11px]">Last verified test: Oct 15</span>
              <button
                onClick={onTestEscalationClick}
                className="font-semibold text-[#00685f] hover:underline"
              >
                Test Escalation
              </button>
            </div>
          </div>

          {/* Roles & Permission Tiers Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00685f]" />
              <h3 className="font-bold text-sm text-[#081d2c]">Roles & Permission Tiers</h3>
            </div>
            <p className="text-xs text-[#64748B]">
              Understand what each tier can see and edit across Eleanor's records.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#081d2c] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00685f]" /> Primary Organizer
                  </span>
                  <span className="text-[10px] font-semibold text-[#00685f]">Full Admin</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Full authority over finances, medical records, invites, and emergency overrides.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#081d2c] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Family Member
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700">Standard</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Can create tasks, update shared calendar, post care notes, and receive group alerts.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#081d2c] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" /> Trusted Helper
                  </span>
                  <span className="text-[10px] font-semibold text-teal-700">Assigned Only</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Sees only tasks specifically assigned to them (medication checklists, errand logs).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#081d2c] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> Physician / Clinical
                  </span>
                  <span className="text-[10px] font-semibold text-purple-700">HIPAA Vault</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Read-only or chart update access to medical vault and vitals timeline. No personal chats.
                </p>
              </div>
            </div>

            <button
              onClick={onPermissionMatrixClick}
              className="w-full py-2 px-3 text-xs font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#D6EBFF] rounded-xl transition-colors text-center"
            >
              Compare Full 24-Point Matrix
            </button>
          </div>

          {/* Eleanor Vance Protected Card */}
          <div className="p-4 rounded-2xl bg-[#E1F0FF]/60 border border-[#CBD5E1] flex items-center gap-3">
            <img
              src="/src/assets/images/eleanor_vance_portrait_1792204247616.jpg"
              alt="Eleanor Vance"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-2xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#081d2c]">Eleanor Vance</span>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#DCFCE7] text-[#15803D]">
                  Protected
                </span>
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                Care Recipient • Simplified Voice & Tablet UI Mode Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
