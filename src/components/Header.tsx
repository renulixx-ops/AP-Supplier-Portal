import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PERSONAS } from '../data/mockData';
import { Persona } from '../types';
import {
  Building2,
  ChevronDown,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Layers,
  Database,
  Search,
  MessageSquare,
  Sparkles,
  LogOut,
  UserCheck,
  Lock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePersona,
    setActivePersona,
    logout,
    activeTab,
    setActiveTab,
    setIsQuestionsModalOpen,
    resetDemoData,
    openQuestions,
    setIsChatOpen,
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const currentPersona = PERSONAS[activePersona];

  const handleSelectPersona = (pKey: Persona) => {
    setActivePersona(pKey);
    setIsPersonaMenuOpen(false);
    setActiveTab('persona_view');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Workshop Context & App Branding */}
      <div className="bg-slate-950 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3 h-3 text-teal-400" />
            ENTERPRISE PLATFORM
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Treasury Future-State & SAP Business One 10.0 Orchestration
          </span>
          <span className="text-slate-400 font-mono text-[10px] hidden md:inline">
            [DB: PETRO_SBO_MY]
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-medium">DI-API Live</span>
          </div>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setIsQuestionsModalOpen(true)}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition-colors cursor-pointer text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Architecture Decisions</span>
            <span className="ml-1 bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              5 Qs
            </span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Supplier / AP Portal
                </h1>
                <span className="text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                  Treasury Co-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-500">
                End-to-end payment workflow orchestration for SAP B1
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('flow')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'flow'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Interactive Flow (11 Stages)</span>
            </button>
            <button
              onClick={() => setActiveTab('persona_view')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'persona_view'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Role Workbench</span>
            </button>
            <button
              onClick={() => setActiveTab('sap_zone')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'sap_zone'
                  ? 'bg-[#1b365d] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4 text-blue-400" />
              <span>SAP Business One</span>
            </button>
            <button
              onClick={() => setActiveTab('supplier_check')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'supplier_check'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-teal-600" />
              <span>Supplier Lookup</span>
            </button>
          </nav>

          {/* Right Controls: Persona Switcher & Utility */}
          <div className="flex items-center gap-2.5">
            {/* SAP Chat Assistant shortcut */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
              title="Open SAP Chat Assistant"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">SAP Chat</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-base border border-slate-300">
                  {currentPersona.avatar}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {currentPersona.name}
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                      {currentPersona.id.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {currentPersona.role}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Active Persona (Workshop Role)
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select a role to see their customized dashboard & permitted actions.
                    </p>
                  </div>
                  <div className="p-1 space-y-1 max-h-96 overflow-y-auto">
                    {Object.values(PERSONAS).map((p) => {
                      const isSelected = activePersona === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPersona(p.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-3 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-teal-50 border border-teal-200'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <span className="text-xl p-1 bg-slate-100 rounded-md border border-slate-200">
                            {p.avatar}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                {p.name}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-semibold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-slate-600">
                              {p.role}
                            </p>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {p.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dedicated Sign Out / Switch Session Option in Dropdown */}
                  <div className="p-2 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setIsPersonaMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer border border-rose-200"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out ({currentPersona.name.split(' ')[0]})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Logout Header Action */}
            <button
              onClick={() => logout()}
              title="Sign Out to Login Screen"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                if (confirm('Reset all demo invoices, audit logs, and open questions to initial seed state?')) {
                  resetDemoData();
                }
              }}
              title="Reset Demo Data"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <div className="md:hidden flex overflow-x-auto border-t border-slate-100 px-2 py-1 bg-slate-50 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('flow')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'flow' ? 'bg-teal-600 text-white' : 'text-slate-600'
          }`}
        >
          11-Stage Flow
        </button>
        <button
          onClick={() => setActiveTab('persona_view')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'persona_view' ? 'bg-teal-600 text-white' : 'text-slate-600'
          }`}
        >
          Role Workbench
        </button>
        <button
          onClick={() => setActiveTab('sap_zone')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'sap_zone' ? 'bg-[#1b365d] text-white' : 'text-slate-600'
          }`}
        >
          SAP B1 Client
        </button>
        <button
          onClick={() => setActiveTab('supplier_check')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'supplier_check' ? 'bg-teal-600 text-white' : 'text-slate-600'
          }`}
        >
          Supplier Portal
        </button>
      </div>
    </header>
  );
};
