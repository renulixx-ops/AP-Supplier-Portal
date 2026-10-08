import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PERSONAS } from '../data/mockData';
import { Persona } from '../types';
import { TreasuryLogo } from './TreasuryLogo';
import {
  ChevronDown,
  HelpCircle,
  RotateCcw,
  Sparkles,
  LogOut,
  Bell,
  MessageSquare,
  Search,
} from 'lucide-react';

export const LuxuryHeader: React.FC = () => {
  const {
    activePersona,
    setActivePersona,
    logout,
    activeTab,
    setActiveTab,
    setIsQuestionsModalOpen,
    resetDemoData,
    setIsChatOpen,
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const currentPersona = PERSONAS[activePersona];

  const handleSelectPersona = (pKey: Persona) => {
    setActivePersona(pKey);
    setIsPersonaMenuOpen(false);
    setActiveTab('persona_view');
  };

  const navItems = [
    { id: 'flow', label: 'Treasury Pipeline' },
    { id: 'persona_view', label: 'Executive Workbench' },
    { id: 'sap_zone', label: 'SAP B1 Core' },
    { id: 'supplier_check', label: 'Supplier Status' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#EBEEEC]/90 backdrop-blur-xl border-b border-black/[0.04]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Treasury Minimalist Financial Brand Logo */}
          <div
            onClick={() => setActiveTab('flow')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <TreasuryLogo size={36} variant="dark" showText={true} />
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#183426]/10 text-[#183426]">
              PETRONAS AP
            </span>
          </div>

          {/* Floating Pill Navigation - Directly matching the reference screenshot */}
          <nav className="hidden md:flex items-center bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-white/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#101312] text-white shadow-sm'
                      : 'text-slate-600 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Persona Profile Badge */}
          <div className="flex items-center gap-2.5">
            {/* Currency Country Indicator */}
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-white shadow-xs text-xs font-bold text-slate-700" title="Malaysian Ringgit (MYR / RM)">
              🇲🇾
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsQuestionsModalOpen(true)}
              className="relative p-2 rounded-full bg-white/80 hover:bg-white border border-white shadow-xs text-slate-600 hover:text-black transition-colors cursor-pointer"
              title="Architecture Decisions & Open Questions"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#49D892] ring-2 ring-white"></span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-white shadow-xs transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#101312] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  {currentPersona.avatar}
                </div>
                <div className="hidden lg:block text-left pr-1">
                  <div className="text-xs font-bold text-[#101312] leading-tight">
                    {currentPersona.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[110px]">
                    @{currentPersona.id}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Switcher Menu */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role Workbench
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Change perspective to inspect specific Limit of Authority queues.
                    </p>
                  </div>

                  <div className="py-2 space-y-1 max-h-80 overflow-y-auto">
                    {Object.values(PERSONAS).map((p) => {
                      const isSelected = activePersona === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPersona(p.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#183426]/10 text-[#183426] font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="text-2xl">{p.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">{p.name}</span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-[#49D892]"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{p.role}</p>
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
                      className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo</span>
                    </button>

                    <button
                      onClick={() => logout()}
                      className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-full bg-white/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-white shadow-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex overflow-x-auto border-t border-black/[0.04] px-4 py-2 bg-white/40 gap-2 text-xs scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all ${
              activeTab === item.id
                ? 'bg-[#101312] text-white'
                : 'text-slate-600 bg-white/80'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
