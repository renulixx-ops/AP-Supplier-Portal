import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PERSONAS } from '../data/mockData';
import { Persona } from '../types';
import { TreasuryLogo } from './TreasuryLogo';
import {
  ChevronDown,
  HelpCircle,
  RotateCcw,
  LogOut,
  Bell,
  Search,
  Menu,
  Database,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface ModernTreasuryTopNavProps {
  onToggleMobileMenu?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const ModernTreasuryTopNav: React.FC<ModernTreasuryTopNavProps> = ({
  onToggleMobileMenu,
  searchQuery = '',
  onSearchChange,
}) => {
  const {
    activePersona,
    setActivePersona,
    logout,
    activeTab,
    setActiveTab,
    setIsQuestionsModalOpen,
    resetDemoData,
    invoices,
    currentStep,
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const currentPersona = PERSONAS[activePersona];

  // Dynamic calculations for status indicator
  const pendingApprovals = invoices.filter(
    (i) => i.status.includes('Approval') || i.status === 'In Payment Proposal'
  );
  const totalPendingRM = pendingApprovals.reduce((s, i) => s + i.amountRM, 0);

  const handleSelectPersona = (pKey: Persona) => {
    setActivePersona(pKey);
    setIsPersonaMenuOpen(false);
    setActiveTab('persona_view');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F5F7F6]/90 backdrop-blur-xl border-b border-slate-200/80 h-18 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Breadcrumb / Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-black cursor-pointer shadow-2xs"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand indicator for mobile */}
        <div className="md:hidden">
          <TreasuryLogo size={28} showText={true} />
        </div>

        {/* Desktop Context Breadcrumb */}
        <div className="hidden md:flex items-center gap-2.5 text-xs text-slate-500 font-medium min-w-0">
          <span className="font-extrabold text-[#101312] tracking-tight shrink-0">TREASURY OS</span>
          <span className="shrink-0">/</span>
          <span className="capitalize font-semibold text-slate-700 truncate max-w-[200px] xl:max-w-none">
            {activeTab === 'flow'
              ? `Pipeline (Stage ${currentStep} of 11)`
              : activeTab === 'persona_view'
              ? `${currentPersona.name} · Workbench`
              : activeTab === 'sap_zone'
              ? 'SAP Business One Core Ledger'
              : 'Supplier Self-Service Portal'}
          </span>
          <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 whitespace-nowrap shrink-0 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            DI-API Connected
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar (Modern SaaS style) */}
      <div className="flex-1 max-w-md hidden sm:block mx-4 min-w-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search invoice ID, supplier, PO number, or GL account..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-full focus:outline-hidden focus:border-[#101312] text-slate-800 placeholder-slate-400 shadow-2xs transition-colors truncate"
          />
        </div>
      </div>

      {/* Right Controls: Currency Badge, Notifications, Workshop OQ, Persona Menu */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Malaysian Ringgit Currency Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-700 whitespace-nowrap shrink-0"
          title="Consolidated Base Currency: Malaysian Ringgit (MYR)"
        >
          <span className="text-xs shrink-0">🇲🇾</span>
          <span className="font-mono text-[11px] font-extrabold text-slate-800 shrink-0">MYR</span>
        </div>

        {/* Quick Cash Metric */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs whitespace-nowrap shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Pending:</span>
          <span className="text-xs font-extrabold font-mono text-[#101312] whitespace-nowrap shrink-0">
            RM {totalPendingRM.toLocaleString()}
          </span>
        </div>

        {/* Consensus Decisions Notification Bell */}
        <button
          onClick={() => setIsQuestionsModalOpen(true)}
          className="relative p-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-black shadow-2xs transition-colors cursor-pointer shrink-0"
          title="Architecture Decisions & Open Questions"
        >
          <Bell className="w-4 h-4 shrink-0" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#49D892] ring-2 ring-white" />
        </button>

        {/* Persona Switcher Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all cursor-pointer max-w-[210px]"
          >
            <div className="w-7 h-7 rounded-full bg-[#101312] text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
              {currentPersona.avatar}
            </div>
            <div className="hidden md:block text-left pr-1 min-w-0 flex-1">
              <div className="text-xs font-extrabold text-[#101312] leading-tight truncate">
                {currentPersona.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium truncate">
                {currentPersona.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Persona Menu */}
          {isPersonaMenuOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-3xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Switch Role Perspective
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect queues and approval rights mapped to specific Limits of Authority (LOA).
                </p>
              </div>

              <div className="py-2 space-y-1 max-h-80 overflow-y-auto">
                {Object.values(PERSONAS).map((p) => {
                  const isSelected = p.id === activePersona;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPersona(p.id)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#101312] text-white shadow-xs'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{p.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{p.name}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#49D892]" />
                          )}
                        </div>
                        <p
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {p.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                <button
                  onClick={() => {
                    if (confirm('Reset demo invoices and state?')) resetDemoData();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-black flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>

                <button
                  onClick={() => logout()}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
