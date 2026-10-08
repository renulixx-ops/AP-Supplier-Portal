import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PERSONAS } from '../data/mockData';
import { Persona } from '../types';
import { TreasuryLogo } from './TreasuryLogo';
import {
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const LuxuryLoginPortal: React.FC = () => {
  const { login, setActiveTab, setIsQuestionsModalOpen } = useApp();

  const [selectedPersona, setSelectedPersona] = useState<Persona>('treasury_assistant');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mfaCode, setMfaCode] = useState('489210');

  const personaList = Object.values(PERSONAS);
  const currentPersona = PERSONAS[selectedPersona];

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      login(selectedPersona, password);
      setActiveTab('persona_view');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F1] text-[#101312] flex flex-col justify-between selection:bg-[#49D892] selection:text-[#101312]">
      {/* Top Header */}
      <header className="px-6 sm:px-12 py-5 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <TreasuryLogo
            size={38}
            variant="dark"
            showText={true}
            tagline="SAP Business One 10.0 Orchestration & Liquidity Engine"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQuestionsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Architecture Decisions</span>
            <span className="bg-[#101312] text-[#49D892] text-[10px] px-2 py-0.2 rounded-full font-bold">5 Qs</span>
          </button>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Clean Enterprise Role Selection */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-[#183426] mb-4">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enterprise Multi-Role Authentication</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#101312] leading-tight">
                Treasury Command & Operational Portals
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-xl font-medium leading-relaxed">
                Choose an authorized role to access tailored Limits of Authority (LOA) queues, automated 3-way matching rules, and SAP B1 10.0 postings.
              </p>
            </div>

            {/* Persona Role Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personaList.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPersona(p.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#101312] text-white shadow-xs border-[#101312]'
                        : 'bg-slate-50/70 hover:bg-slate-50 text-[#101312] border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl p-1 bg-white/10 rounded-xl">{p.avatar}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold truncate">{p.name}</h3>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#49D892]"></span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate ${isSelected ? 'text-[#49D892]' : 'text-slate-500'}`}>
                          {p.role}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-200/40 flex items-center justify-between text-[10px]">
                      <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>
                        {p.securityClearance.split('(')[0]}
                      </span>
                      <span className={`font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                        {p.id.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vendor lookup shortcut */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-medium">Looking for vendor invoice status?</span>
              <button
                onClick={() => {
                  login('treasury_assistant');
                  setActiveTab('supplier_check');
                }}
                className="text-[#183426] hover:text-black font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Direct Supplier Inquiry Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Sleek SSO Login Form Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(16,19,18,0.06)] relative">
              
              <div className="flex items-center gap-4 pb-6 border-b border-black/[0.04]">
                <div className="w-14 h-14 rounded-2xl bg-[#101312] text-white flex items-center justify-center text-3xl shadow-sm">
                  {currentPersona.avatar}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#101312] leading-tight">
                    {currentPersona.name}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{currentPersona.role}</p>
                  <p className="text-[11px] text-[#183426] font-mono mt-0.5">{currentPersona.email}</p>
                </div>
              </div>

              {/* Clearance Pill */}
              <div className="my-5 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#183426]" />
                  <span className="font-medium text-[11px]">{currentPersona.securityClearance}</span>
                </div>
                <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">
                  FIDO2 READY
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Corporate SSO Identity
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={currentPersona.email}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs text-slate-800 font-mono focus:outline-hidden"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-4 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Corporate Passphrase
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">demo1234</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#101312] rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-hidden font-mono tracking-wider transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 absolute right-4 top-3 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Hardware TOTP Code
                    </label>
                    <span className="text-[10px] text-emerald-700 font-mono">6-Digit Valid</span>
                  </div>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-emerald-800 font-mono tracking-widest text-center font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3.5 px-6 rounded-full bg-[#101312] hover:bg-black text-[#49D892] font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#49D892] border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Authority Token...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Authenticate as {currentPersona.name.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-4 border-t border-black/[0.04] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#49D892]"></span>
          <span>SAP Business One 10.0 DI-API Connected</span>
          <span className="text-slate-300">·</span>
          <span>Maybank2E & CIMB H2H Portals Active</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Security: FIDO2 WebAuthn / TLS 1.3
        </div>
      </footer>
    </div>
  );
};
