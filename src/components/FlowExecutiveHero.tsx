import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowUpRight,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  FileText,
  Shield,
  Zap,
  Flame,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

export const FlowExecutiveHero: React.FC = () => {
  const { invoices, setCurrentStep, setActiveTab } = useApp();

  const [dateFilter] = useState('23.09.2026');
  const [supplierFilter, setSupplierFilter] = useState('All Vendors');
  const [activeSideTab, setActiveSideTab] = useState<'timeline' | 'assistant'>('timeline');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string; time: string }>>([
    {
      role: 'ai',
      text: '3-way match verified 8 invoices. 1 exception detected on INV-1045 (Mega Steel, RM 14,800 quantity variance). Urgent turbine seal off-cycle approved.',
      time: '14:20',
    },
  ]);

  // Aggregate metrics
  const pendingInvoices = invoices.filter(
    (i) => i.status.includes('Approval') || i.status === 'In Payment Proposal'
  );
  const totalPendingRM = pendingInvoices.reduce((acc, curr) => acc + curr.amountRM, 0);

  const exceptionInvoices = invoices.filter((i) => i.status.includes('Mismatch'));

  // Timeline items
  const timelineEvents = [
    { time: '09:00', title: 'Batch Run Assembly', desc: 'Weekly AP proposal batch generated', status: 'done' },
    { time: '11:15', title: 'INV-1042 Match Pass', desc: 'Borneo Freight haulage (RM 42,800)', status: 'done' },
    { time: '14:00', title: 'Director LOA Sign-Off', desc: 'INV-1043 Apex Bulk Chemical (RM 145k)', status: 'active' },
    { time: '15:30', title: 'Maybank H2H Batch Cutoff', desc: 'Bank upload file transmission window', status: 'upcoming' },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { role: 'user' as const, text: userText, time: 'Just now' },
    ]);
    setChatInput('');

    setTimeout(() => {
      let reply = "Verified against SAP B1 OPCH table. ";
      if (userText.toLowerCase().includes('pending') || userText.toLowerCase().includes('total')) {
        reply += `Currently RM ${totalPendingRM.toLocaleString()} is pending approval across LOA Bands 1, 2, and 3.`;
      } else if (userText.toLowerCase().includes('exception') || userText.toLowerCase().includes('mega steel')) {
        reply += 'INV-1045 has a 20-unit quantity discrepancy against GRPO-8850. AP clerk action required in Step 3.';
      } else {
        reply += 'All 3-way match rules are active. Friday payment proposal release cutoff is scheduled for 15:30.';
      }
      setChatMessages((prev) => [...prev, { role: 'ai', text: reply, time: 'Just now' }]);
    }, 400);
  };

  return (
    <section className="w-full space-y-6">
      {/* 1. Header Section: Clean, flat, calm, enterprise FinTech aesthetic */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                Treasury Command Center
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                Cycle: Q3 FY26
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101312] tracking-tight">
              Executive Financial Overview & Priorities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Real-time monitoring of payment runs, Limits of Authority (LOA) sign-offs, and SAP Business One 10.0 postings.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{dateFilter}</span>
            </div>

            <div className="relative inline-flex items-center">
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="appearance-none inline-flex items-center px-3.5 py-2 pr-8 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 cursor-pointer focus:outline-hidden hover:bg-slate-100/70"
              >
                <option value="All Vendors">All Vendors ({invoices.length})</option>
                <option value="High Priority">Priority LOA Items</option>
                <option value="Exceptions">Exceptions (1)</option>
                <option value="Off-Cycle">Off-Cycle Expedited (1)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2. Primary KPI Cards: Clean, readable, properly padded, no overflow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* KPI 1 */}
          <div
            onClick={() => {
              setActiveTab('flow');
              setCurrentStep(6);
            }}
            className="p-5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-600 truncate">Proposals in Batch</span>
              <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                +3 today
              </span>
            </div>
            <div className="mt-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#101312] tracking-tight">
                {pendingInvoices.length}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                Scheduled weekly runs
              </p>
            </div>
          </div>

          {/* KPI 2 */}
          <div
            onClick={() => {
              setActiveTab('flow');
              setCurrentStep(7);
            }}
            className="p-5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-600 truncate">Requires LOA Action</span>
              <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Pending
              </span>
            </div>
            <div className="mt-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#101312] tracking-tight">
                RM {(totalPendingRM / 1000).toFixed(0)}k
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                Total committed approval
              </p>
            </div>
          </div>

          {/* KPI 3 */}
          <div
            onClick={() => {
              setActiveTab('flow');
              setCurrentStep(3);
            }}
            className="p-5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-600 truncate">3-Way Match Variance</span>
              <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
                Attention
              </span>
            </div>
            <div className="mt-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#101312] tracking-tight">
                {exceptionInvoices.length}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                Quantity discrepancy in Step 3
              </p>
            </div>
          </div>

          {/* KPI 4 */}
          <div
            onClick={() => {
              setActiveTab('flow');
              setCurrentStep(8);
            }}
            className="p-5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-600 truncate">Bank H2H Transmission</span>
              <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                Host-to-Host
              </span>
            </div>
            <div className="mt-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#101312] tracking-tight">
                1 Query
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                Beneficiary account check
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Balanced Dual Workstation (Items Requiring Action & Schedule / Assistant) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Priority Attention Items (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <h2 className="text-sm font-extrabold text-[#101312] uppercase tracking-wider">
                Items Requiring Action
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('flow');
                setCurrentStep(3);
              }}
              className="text-xs font-bold text-slate-500 hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All Queues</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Priority Item 1: High Value LOA */}
            <div
              onClick={() => {
                setActiveTab('flow');
                setCurrentStep(7);
              }}
              className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 whitespace-nowrap shrink-0">
                    LOA Band 3 Sign-Off
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">AP-DRF-3980</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#101312] truncate">
                  Apex Industrial Chemicals Sdn Bhd
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  RM 145,000 · Band 3 Director sign-off required before Friday cutoff
                </p>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                <span className="text-xs sm:text-sm font-mono font-extrabold text-[#101312] whitespace-nowrap">
                  RM 145,000
                </span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                  <span>Review & Approve</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </span>
              </div>
            </div>

            {/* Priority Item 2: Quantity Discrepancy */}
            <div
              onClick={() => {
                setActiveTab('flow');
                setCurrentStep(3);
              }}
              className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 whitespace-nowrap shrink-0">
                    Quantity Discrepancy
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">INV-1045 · PO-2026-9055</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#101312] truncate">
                  Mega Steel Fabricators Sdn Bhd
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  120 inv vs 100 GRPO units (+RM 14,800 variance quarantined)
                </p>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                <span className="text-xs sm:text-sm font-mono font-extrabold text-amber-900 whitespace-nowrap">
                  RM 89,200
                </span>
                <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                  <span>Open Step 3 Queue</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </span>
              </div>
            </div>

            {/* Priority Item 3: Off-Cycle Expedited */}
            <div
              onClick={() => {
                setActiveTab('flow');
                setCurrentStep(7);
              }}
              className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200 whitespace-nowrap shrink-0">
                    Off-Cycle Fast-Track
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">INV-1046 · Urgent</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#101312] truncate">
                  Kencana Offshore Spares Sdn Bhd
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  Emergency turbine seal dispatch · Kemaman Supply Base
                </p>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                <span className="text-xs sm:text-sm font-mono font-extrabold text-[#101312] whitespace-nowrap">
                  RM 68,000
                </span>
                <span className="text-[10px] text-slate-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                  <span>Sign Authority</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Tabbed Operations & Assistant (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            {/* Tab switch header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveSideTab('timeline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSideTab === 'timeline'
                      ? 'bg-white text-[#101312] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Execution Schedule
                </button>
                <button
                  onClick={() => setActiveSideTab('assistant')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSideTab === 'assistant'
                      ? 'bg-white text-[#101312] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Ledger Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </button>
              </div>

              <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
                Cutoff: 15:30 MYT
              </span>
            </div>

            {/* TAB 1: Timeline */}
            {activeSideTab === 'timeline' && (
              <div className="space-y-3">
                <div className="space-y-2.5">
                  {timelineEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
                    >
                      <div className="w-12 pt-0.5 text-center shrink-0">
                        <span className="font-mono font-extrabold text-slate-700">{evt.time}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-[#101312] truncate">{evt.title}</h4>
                          {evt.status === 'active' && (
                            <span className="text-[9px] font-extrabold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{evt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Gauge */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Friday H2H Transmission Window</span>
                    <span className="text-emerald-700 font-bold font-mono">65% Progress</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#183426] h-full rounded-full transition-all" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Clean Ledger Chat Assistant */}
            {activeSideTab === 'assistant' && (
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        msg.role === 'ai'
                          ? 'bg-slate-50 text-slate-800 border border-slate-100'
                          : 'bg-[#101312] text-white ml-6'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] opacity-60 mt-1 block text-right">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChat} className="mt-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about LOA, SAP B1 or batch cutoff..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#101312] pr-9"
                    />
                    <button
                      type="submit"
                      className="w-6 h-6 rounded-lg bg-[#101312] hover:bg-black text-[#49D892] absolute right-2 top-2 flex items-center justify-center transition-colors cursor-pointer"
                      title="Send query"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
