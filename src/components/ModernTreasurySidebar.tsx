import React from 'react';
import { useApp } from '../context/AppContext';
import { TreasuryLogo } from './TreasuryLogo';
import { PERSONAS } from '../data/mockData';
import { Persona } from '../types';
import {
  LayoutDashboard,
  Layers,
  Database,
  Search,
  Sliders,
  HelpCircle,
  RotateCcw,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building,
  UserCheck,
  Flame,
  CheckCircle2,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface ModernTreasurySidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export const ModernTreasurySidebar: React.FC<ModernTreasurySidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const {
    activeTab,
    setActiveTab,
    currentStep,
    setCurrentStep,
    activePersona,
    setActivePersona,
    logout,
    resetDemoData,
    setIsQuestionsModalOpen,
    invoices,
  } = useApp();

  const currentPersona = PERSONAS[activePersona];

  // Dynamic status badges
  const pendingApprovals = invoices.filter(
    (i) => i.status.includes('Approval') || i.status === 'In Payment Proposal'
  ).length;

  const exceptionCount = invoices.filter((i) => i.status.includes('Mismatch')).length;

  interface NavModuleItem {
    id: 'flow' | 'persona_view' | 'sap_zone' | 'supplier_check';
    label: string;
    badge?: string;
    badgeColor?: string;
    icon: React.ElementType;
    description: string;
  }

  const navModules: NavModuleItem[] = [
    {
      id: 'flow',
      label: 'Treasury Pipeline',
      badge: `${currentStep}/11`,
      icon: Layers,
      description: 'End-to-end 11-step payment lifecycle',
    },
    {
      id: 'persona_view',
      label: 'Executive Workbench',
      badge: pendingApprovals > 0 ? `${pendingApprovals} Pending` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: LayoutDashboard,
      description: 'Role-based queues & CFO financial metrics',
    },
    {
      id: 'sap_zone',
      label: 'SAP B1 Core Ledger',
      badge: 'Live DI-API',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      icon: Database,
      description: 'ERP draft A/P and payment vouchers',
    },
    {
      id: 'supplier_check',
      label: 'Supplier Self-Service',
      icon: Search,
      description: 'Real-time 4-milestone payment inquiry',
    },
  ];

  const handleNavClick = (tabId: 'flow' | 'persona_view' | 'sap_zone' | 'supplier_check') => {
    setActiveTab(tabId);
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#101312]/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Modern SaaS Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[#F5F7F6] border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 select-none ${
          isMobileOpen ? 'translate-x-0 w-80' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-[294px]'}`}
      >
        {/* Top: Brand Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('flow')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <TreasuryLogo
              size={36}
              variant="dark"
              showText={!isCollapsed}
              tagline="PETRONAS AP Engine"
            />
          </div>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? '' : 'rotate-180'
              }`}
            />
          </button>
        </div>

        {/* Middle: Navigation Modules */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {/* Main Workspace Section */}
          <div className="space-y-1.5">
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Core Operations
              </div>
            )}

            {navModules.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#101312] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-[#49D892]' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  />

                  {!isCollapsed && (
                    <div className="flex-1 text-left flex items-center justify-between gap-2.5 min-w-0">
                      <span className="truncate tracking-tight font-bold text-xs">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 leading-none inline-flex items-center justify-center ${
                            isActive
                              ? 'bg-white/10 text-white border-white/20'
                              : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Indicator Bar on collapsed */}
                  {isCollapsed && isActive && (
                    <div className="absolute right-0 top-2 bottom-2 w-1 rounded-l bg-[#49D892]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Treasury 11-Stage Fast Switcher (Only visible in full view) */}
          {!isCollapsed && activeTab === 'flow' && (
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <div className="px-3 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Pipeline Steps
                </span>
                <span className="text-[10px] font-bold text-[#183426] bg-[#183426]/10 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center justify-center">
                  Step {currentStep} of 11
                </span>
              </div>

              <div className="grid grid-cols-6 gap-1 px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((stepNum) => {
                  const isCurrent = currentStep === stepNum;
                  const isCompleted = stepNum < currentStep;

                  return (
                    <button
                      key={stepNum}
                      onClick={() => setCurrentStep(stepNum)}
                      title={`Jump to Step ${stepNum}`}
                      className={`h-7 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'bg-[#101312] text-[#49D892] ring-1 ring-[#49D892]/40 shadow-2xs'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                          : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      {stepNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Tools & Workshop Controls */}
          <div className="space-y-1 pt-2 border-t border-slate-200/60">
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Governance & Workshop
              </div>
            )}

            <button
              onClick={() => setIsQuestionsModalOpen(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors group cursor-pointer"
              title="Architecture Consensus Guide"
            >
              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
              {!isCollapsed && <span className="truncate">Consensus Guide (5 OQs)</span>}
            </button>

            <button
              onClick={() => {
                if (confirm('Reset demo invoices and state to workshop baseline?')) {
                  resetDemoData();
                }
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors group cursor-pointer"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
              {!isCollapsed && <span className="truncate">Reset Demo State</span>}
            </button>
          </div>
        </div>

        {/* Bottom: Persona Profile Card & Sign Out */}
        <div className="p-3 border-t border-slate-200/80 bg-white/60">
          <div
            className={`flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#101312] text-white flex items-center justify-center text-lg shrink-0">
              {currentPersona?.avatar}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#101312] truncate">
                    {currentPersona?.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#49D892]" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {currentPersona?.role}
                </p>
              </div>
            )}

            {!isCollapsed && (
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
