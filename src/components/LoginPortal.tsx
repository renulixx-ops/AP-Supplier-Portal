import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PERSONAS } from '../data/mockData';
import { Persona } from '../types';
import {
  Building2,
  ShieldCheck,
  Lock,
  UserCheck,
  KeyRound,
  Eye,
  EyeOff,
  ChevronRight,
  Database,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const { login, setActiveTab, setIsQuestionsModalOpen } = useApp();

  const [selectedPersona, setSelectedPersona] = useState<Persona>('treasury_assistant');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mfaCode, setMfaCode] = useState('489210');
  const [authError, setAuthError] = useState<string | null>(null);

  const personaList = Object.values(PERSONAS);
  const currentPersona = PERSONAS[selectedPersona];

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      login(selectedPersona, password);
      setActiveTab('persona_view');
    }, 600);
  };

  const handleQuickSelect = (pId: Persona) => {
    setSelectedPersona(pId);
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a192f] to-slate-900 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white font-sans">
      {/* Top Branding Strip */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                PETRONAS / Enterprise Supplier AP Portal
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                PROD-SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Enterprise Treasury Gateway • SAP Business One 10.0 Orchestration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>DI-API: Active (PETRO_SBO_MY)</span>
          </div>

          <button
            onClick={() => setIsQuestionsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors text-xs font-semibold cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Workshop Architecture</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              5 Qs
            </span>
          </button>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Quick Persona Switcher Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Multi-Persona Role Authentication</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Select Your Executive or Treasury Persona
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Experience role-tailored dashboards, Limit of Authority (LOA) queues, bank batch releases, or read-only CFO insights.
              </p>
            </div>

            {/* Persona Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {personaList.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleQuickSelect(p.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500/80 shadow-lg shadow-teal-950/60 ring-1 ring-teal-500/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1 bg-slate-800/80 rounded-lg border border-slate-700">
                            {p.avatar}
                          </span>
                          <div>
                            <h3 className="text-xs font-bold text-white">{p.name}</h3>
                            <p className="text-[11px] text-teal-400 font-medium line-clamp-1">
                              {p.role}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 ring-4 ring-teal-500/20"></span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-mono">{p.securityClearance.split('(')[0]}</span>
                      <span className="text-xs font-bold text-slate-300">
                        {p.id.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Public supplier lookup link bypass */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Are you an external vendor looking for invoice status?</span>
              </div>
              <button
                onClick={() => {
                  login('treasury_assistant');
                  setActiveTab('supplier_check');
                }}
                className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Vendor Self-Service Lookup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Premium SSO Login Box */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Active Selected Persona Header */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
                  {currentPersona.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{currentPersona.name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-400 border border-teal-800">
                      Active Target
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{currentPersona.role}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{currentPersona.email}</p>
                </div>
              </div>

              {/* Security Badge Pill */}
              <div className="mt-4 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{currentPersona.securityClearance}</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold text-[10px]">MFA READY</span>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                {/* User ID / Identity Display */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Corporate SSO Identity
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={currentPersona.email}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-hidden"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-3" />
                  </div>
                </div>

                {/* Password / Pin */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Corporate Single Sign-On PIN / Password
                    </label>
                    <span className="text-[10px] text-teal-400 font-mono">Demo: demo1234</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500 font-mono tracking-wider"
                      placeholder="Enter passphrase"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-200 absolute right-3 top-2.5 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Simulated MFA Token */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      FIDO2 / Hardware Token TOTP (Auto-filled)
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">Verified 6-digit</span>
                  </div>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-emerald-400 font-mono tracking-widest text-center font-bold"
                  />
                </div>

                {authError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                    {authError}
                  </div>
                )}

                {/* Login Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Authority & DI-API Token...</span>
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

              {/* Security Guarantee */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
                <span>Protected by Enterprise TLS 1.3 • Role-Based Access Control (RBAC)</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Status Strip */}
      <footer className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            SAP Business One 10.0 DI-API Connected
          </span>
          <span className="text-slate-600">|</span>
          <span>Maybank2E & CIMB BizChannel H2H: Active</span>
        </div>
        <div className="text-slate-400 font-mono text-[10px]">
          Session Token: AUTH-PETRO-2026-99X • Malaysian Ringgit (RM)
        </div>
      </footer>
    </div>
  );
};
