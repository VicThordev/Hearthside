import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Users,
  FileText,
  ShieldCheck,
  Building2,
  BarChart3,
  Settings,
  LayoutDashboard,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Heart,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  LogOut,
  UserCheck
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onUpgradeClick?: () => void;
  onSwitchCircle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onUpgradeClick,
  onSwitchCircle
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCircleMenu, setShowCircleMenu] = useState(false);

  const navItems = [
    { id: 'landing' as ViewMode, label: 'Landing Page & Tour', icon: Sparkles },
    { id: 'overview' as ViewMode, label: 'Overview', icon: LayoutDashboard },
    { id: 'calendar' as ViewMode, label: 'Calendar & Appointments', icon: Calendar },
    { id: 'tasks' as ViewMode, label: 'Tasks & Errands', icon: CheckCircle2 },
    { id: 'care-team' as ViewMode, label: 'Care Team & Invites', icon: Users },
    { id: 'care-notes' as ViewMode, label: 'Care Notes & Updates', icon: FileText },
    { id: 'vault' as ViewMode, label: 'Document Vault', icon: ShieldCheck },
    { id: 'directory' as ViewMode, label: 'Service Directory', icon: Building2 },
    { id: 'reports' as ViewMode, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as ViewMode, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative bg-[#ffffff] border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-200 shrink-0 select-none z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Brand */}
      <div className="p-4 border-b border-[#E2E8F0]/80">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2.5 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity"
            onClick={() => onViewChange('landing')}
            title="Go to Hearthside Landing Page"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00685f] flex items-center justify-center text-white shadow-sm shrink-0">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-lg text-[#081d2c] leading-tight tracking-tight">
                  Hearthside
                </span>
                <span className="text-[11px] text-[#64748B] tracking-tight">
                  Better Care, Together
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 text-[#64748B] hover:text-[#081d2c] hover:bg-[#F1F5F9] rounded-lg transition-colors"
          >
            {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Circle Selector */}
        {!collapsed && (
          <div className="mt-4 relative">
            <button
              onClick={() => setShowCircleMenu(!showCircleMenu)}
              className="w-full text-left p-2.5 rounded-xl bg-[#F6F9FF] hover:bg-[#EEF4FD] border border-[#D6EBFF] transition-colors flex items-center justify-between group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-sm font-semibold text-[#081d2c] truncate">
                    Eleanor Vance's Circle
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#64748B]">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-medium bg-[#DCFCE7] text-[#15803D] rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" /> Active
                  </span>
                  <span>• Portland, OR</span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#64748B] group-hover:text-[#081d2c] shrink-0 transition-transform" />
            </button>

            {showCircleMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-2 z-30">
                <div className="text-[11px] font-semibold text-[#64748B] px-2 py-1 uppercase tracking-wider">
                  Care Circles
                </div>
                <div className="p-2 rounded-lg bg-[#E1F0FF] text-[#00685f] font-medium text-xs flex items-center justify-between">
                  <span>Eleanor Vance (Current)</span>
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <button
                  onClick={() => {
                    setShowCircleMenu(false);
                    onSwitchCircle?.();
                  }}
                  className="w-full mt-1 p-2 rounded-lg text-left text-xs text-[#64748B] hover:bg-[#F8FAFC] flex items-center justify-between"
                >
                  <span>Arthur Vance (Archived)</span>
                  <span className="text-[10px] text-slate-400">View</span>
                </button>
                <div className="border-t border-[#E2E8F0] my-1" />
                <button
                  onClick={() => {
                    setShowCircleMenu(false);
                    onSwitchCircle?.();
                  }}
                  className="w-full p-2 text-left text-xs font-semibold text-[#00685f] hover:bg-[#F0FDFA] rounded-lg"
                >
                  + Create New Care Circle
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="p-3 flex-1 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-[#00685f] text-white shadow-sm shadow-[#00685f]/20 font-semibold'
                  : 'text-[#475569] hover:text-[#081d2c] hover:bg-[#F1F5F9]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : 'text-[#64748B]'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Area: Plan Card & User Profile */}
      <div className="p-3 border-t border-[#E2E8F0]/80 space-y-3">
        {!collapsed && (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold tracking-wider text-[10px] text-[#00685f] uppercase">
                Family Plus Plan
              </span>
              <span className="font-mono text-[11px] text-[#64748B] font-semibold">
                8/8 Members
              </span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#00685f] h-full rounded-full w-full" />
            </div>
            <div className="flex items-center justify-between mt-2.5 pt-1 text-xs">
              <span className="text-[#64748B] text-[11px]">Full Team Capacity</span>
              <button
                onClick={() => {
                  onViewChange('settings');
                  onUpgradeClick?.();
                }}
                className="text-[11px] font-semibold text-[#00685f] hover:underline"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#F1F5F9] transition-colors text-left ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src="/src/assets/images/sarah_vance_avatar_1792204247520.jpg"
              alt="Sarah Vance"
              className="w-9 h-9 rounded-full object-cover border-2 border-[#00685f]/30 shrink-0"
              referrerPolicy="no-referrer"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[#081d2c] truncate">
                  Sarah Vance
                </div>
                <div className="text-xs text-[#64748B] truncate">
                  Primary Organizer
                </div>
              </div>
            )}
            {!collapsed && <MoreVertical className="w-4 h-4 text-[#64748B] shrink-0" />}
          </button>

          {showUserMenu && !collapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-2 z-30">
              <div className="px-3 py-2 border-b border-[#E2E8F0]">
                <div className="text-xs font-semibold text-[#081d2c]">Sarah Vance</div>
                <div className="text-[11px] text-[#64748B]">sarah.vance@hearthcare.org</div>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E1F0FF] text-[#00685f] text-[10px] font-semibold">
                  Account Owner
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onViewChange('landing');
                }}
                className="w-full mt-1 text-left px-3 py-2 text-xs text-[#00685f] hover:bg-teal-50 rounded-lg flex items-center justify-between font-medium"
              >
                <span>View Landing Page & Tour</span>
                <Sparkles className="w-3.5 h-3.5 text-[#00685f]" />
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onViewChange('settings');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#475569] hover:bg-[#F8FAFC] rounded-lg flex items-center justify-between"
              >
                <span>Subscription & Billing</span>
                <Settings className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onViewChange('care-team');
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#475569] hover:bg-[#F8FAFC] rounded-lg flex items-center justify-between"
              >
                <span>Care Circle Permissions</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
              <div className="border-t border-[#E2E8F0] my-1" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onViewChange('auth');
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-between cursor-pointer"
              >
                <span>Sign Out / Switch Account</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
