import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PERSONAS } from '../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  ShieldCheck,
  Server,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  AlertTriangle,
  ArrowRight,
  Receipt,
  Search,
  Filter,
  Trash2,
  Download,
  Building,
  Calendar,
  Flame,
  UserCheck,
  XCircle,
  HelpCircle,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  LogOut,
  KeyRound,
  Lock,
} from 'lucide-react';

export const PersonaDashboards: React.FC = () => {
  const { activePersona, invoices, auditLogs, setCurrentStep, setActiveTab, openQuestions, logout } = useApp();
  const persona = PERSONAS[activePersona];

  return (
    <div className="space-y-6">
      {/* Persona Header Identity Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#101312] text-white flex items-center justify-center text-3xl shadow-sm border border-black/10">
            {persona.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#101312] tracking-tight">{persona.name}</h2>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#183426]/10 text-[#183426] whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                {persona.id.toUpperCase().replace('_', ' ')}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#49D892]/20 text-[#183426] flex items-center gap-1.5 whitespace-nowrap shrink-0 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#49D892] shrink-0"></span>
                Authenticated
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{persona.role}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
              <span className="font-mono text-[11px] text-slate-600">{persona.email}</span>
              <span>·</span>
              <span className="text-slate-600 font-medium">{persona.securityClearance}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-xs text-slate-600 max-w-sm bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
            <strong className="text-[#101312]">Authority Scope:</strong> {persona.description}
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-colors cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Role / Sign Out</span>
          </button>
        </div>
      </div>

      {/* Render matching persona view */}
      {activePersona === 'admin' && <AdminDashboard />}
      {activePersona === 'treasury_chief' && <TreasuryChiefDashboard />}
      {activePersona === 'treasury_assistant' && <TreasuryAssistantDashboard />}
      {activePersona === 'coo' && <CooDashboard />}
      {activePersona === 'director' && <DirectorDashboard />}
      {activePersona === 'cfo' && <CfoDashboard />}
    </div>
  );
};

// 1. ADMIN DASHBOARD
const AdminDashboard: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(
    (log) => filterCategory === 'ALL' || log.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* System Health & Connection Statuses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* SAP B1 DI-API */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">SAP B1 Service Layer / DI-API</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#49D892] animate-pulse"></span>
          </div>
          <div className="text-base font-extrabold text-[#101312] mt-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#183426]" />
            <span>Connected & Healthy</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            Host: PRD-SAP-SQL01 · Latency: 18ms
          </div>
        </div>

        {/* Corporate Banking Gateway */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Bank Portal Gateway (Host-to-Host)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#49D892]"></span>
          </div>
          <div className="text-base font-extrabold text-[#101312] mt-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#183426]" />
            <span>Maybank2E & CIMB Active</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            Batch Protocol: ISO 20022 XML / SFTP
          </div>
        </div>

        {/* Email Gateway */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Notification Engine & LHDN Hub</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#49D892]"></span>
          </div>
          <div className="text-base font-extrabold text-[#101312] mt-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#183426]" />
            <span>Operational (100% Rate)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            Delivery: Immediate Dispatch Engine
          </div>
        </div>
      </div>

      {/* Global Session Audit Log Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b border-black/[0.04] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#101312]">
              Workshop Session Audit Trail
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Captures automated matching verdicts, LOA approvals, exception overrides, and SAP Business One postings
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-4 py-2 rounded-full border border-slate-200 bg-white font-bold text-[#101312] shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="MATCH">3-Way Match</option>
              <option value="SAP">SAP Postings</option>
              <option value="APPROVAL">Approvals</option>
              <option value="BANK">Banking</option>
              <option value="MANUAL_CHECK">Manual Check Bypass</option>
              <option value="OFF_CYCLE">Off-Cycle Requests</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 border-b border-black/[0.04]">
              <tr>
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5">Actor (Persona)</th>
                <th className="py-3 px-5">Action</th>
                <th className="py-3 px-5">Ref</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Transaction Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-5 font-sans font-bold text-[#101312]">
                    {log.personaName}
                    <span className="block text-[10px] font-normal text-slate-400 font-mono">
                      {log.personaRole}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-sans font-semibold text-slate-900">{log.action}</td>
                  <td className="py-3 px-5 text-[#183426] font-bold">{log.invoiceId || '—'}</td>
                  <td className="py-3 px-5 font-sans">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-sans text-slate-600 max-w-md break-words">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. TREASURY CHIEF (MAZRAH) DASHBOARD
const TreasuryChiefDashboard: React.FC = () => {
  const { invoices, setCurrentStep } = useApp();

  const weeklyInvoices = invoices.filter((i) => i.paymentType === 'Weekly Payment');

  const band1 = invoices.filter((i) => i.loaBand.includes('Band 1'));
  const band2 = invoices.filter((i) => i.loaBand.includes('Band 2'));
  const band3 = invoices.filter((i) => i.loaBand.includes('Band 3'));

  const totalCommittedRM = invoices
    .filter((i) => !['Paid', 'Rejected'].includes(i.status))
    .reduce((s, i) => s + i.amountRM, 0);

  return (
    <div className="space-y-6">
      {/* High-Level Cashflow Outflow Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">Total Unsettled Commitment</span>
          <div className="text-2xl font-extrabold text-[#101312] mt-2 tracking-tight">
            RM {totalCommittedRM.toLocaleString()}
          </div>
          <span className="text-xs text-[#183426] font-bold mt-2">Active liquidity pipelines</span>
        </div>

        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">LOA Band 1 (≤ RM 30k)</span>
          <div className="text-2xl font-extrabold text-[#183426] mt-2 tracking-tight">
            RM {band1.reduce((s, i) => s + i.amountRM, 0).toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 mt-2">{band1.length} Transactions</span>
        </div>

        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">LOA Band 2 (RM 31k–100k)</span>
          <div className="text-2xl font-extrabold text-[#101312] mt-2 tracking-tight">
            RM {band2.reduce((s, i) => s + i.amountRM, 0).toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 mt-2">{band2.length} Transactions</span>
        </div>

        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">LOA Band 3 (&gt; RM 100k)</span>
          <div className="text-2xl font-extrabold text-[#183426] mt-2 tracking-tight">
            RM {band3.reduce((s, i) => s + i.amountRM, 0).toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 mt-2">{band3.length} Transactions</span>
        </div>
      </div>

      {/* Friday Cut-Off Oversight */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-black/[0.04] mb-5 gap-3">
          <div>
            <h3 className="text-base font-extrabold text-[#101312]">
              Friday Cut-Off Weekly Run Oversight
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring batches prepared by Treasury Assistants prior to executive sign-off
            </p>
          </div>
          <button
            onClick={() => setCurrentStep(6)}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#101312] hover:bg-black rounded-full shadow-sm cursor-pointer self-start sm:self-auto transition-all"
          >
            Open Payment Proposal (Step 6) →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {weeklyInvoices.map((inv) => (
            <div key={inv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-[#101312] flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-slate-400 shrink-0">{inv.id}</span>
                  <span className="text-sm font-extrabold truncate">{inv.supplierName}</span>
                  {inv.isOffCycleUrgent && (
                    <span className="text-[10px] bg-rose-500/10 text-rose-800 font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                      Off-Cycle
                    </span>
                  )}
                </div>
                <div className="text-slate-500 text-xs mt-1 truncate">
                  LOA: {inv.loaBand} · Due: {inv.dueDate} · Status: <span className="font-semibold text-slate-700">{inv.status}</span>
                </div>
              </div>
              <div className="text-left sm:text-right font-extrabold text-sm text-[#101312] shrink-0 whitespace-nowrap">
                RM {inv.amountRM.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. TREASURY ASSISTANT (SYAFIQAH) DASHBOARD
const TreasuryAssistantDashboard: React.FC = () => {
  const { invoices, setCurrentStep } = useApp();

  const bankDeclined = invoices.filter((i) => i.status === 'Bank Declined');
  const matchedPendingProposal = invoices.filter((i) => i.status === 'Draft AP in SAP');

  return (
    <div className="space-y-6">
      {/* Urgent Attention Alert: Bank Declined Items */}
      {bankDeclined.length > 0 && (
        <div className="bg-rose-50/80 border border-rose-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-rose-950">
                  Action Required: {bankDeclined.length} Bank Declined Item Returned
                </h3>
                <p className="text-xs text-rose-700 mt-1">
                  Corporate banking gateway rejected disbursement file. Needs beneficiary details correction.
                </p>
                <div className="mt-4 space-y-2">
                  {bankDeclined.map((item) => (
                    <div key={item.id} className="bg-white/90 p-4 rounded-2xl border border-rose-100 text-xs shadow-2xs">
                      <div className="flex justify-between font-bold text-[#101312]">
                        <span>{item.id}: {item.supplierName}</span>
                        <span>RM {item.amountRM.toLocaleString()}</span>
                      </div>
                      <p className="text-rose-800 mt-1.5 font-medium">
                        <strong>Decline Reason:</strong> {item.bankDeclineReason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(8)}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-rose-700 hover:bg-rose-800 rounded-full shadow-sm cursor-pointer shrink-0 transition-all"
            >
              Open Bank Portal (Step 8)
            </button>
          </div>
        </div>
      )}

      {/* Daily Operations Workbench */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">Incoming 3-Way Match Check</span>
          <div className="text-3xl font-extrabold text-[#101312] mt-3">
            {invoices.filter((i) => i.status === 'Submitted').length}
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            className="text-xs text-[#183426] font-bold hover:underline mt-3 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Review 3-Way Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">Draft AP Ready for Batching</span>
          <div className="text-3xl font-extrabold text-[#101312] mt-3">
            {matchedPendingProposal.length}
          </div>
          <button
            onClick={() => setCurrentStep(6)}
            className="text-xs text-[#183426] font-bold hover:underline mt-3 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Prepare Proposal Run</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">Exception Queue (Variances)</span>
          <div className="text-3xl font-extrabold text-amber-700 mt-3">
            {invoices.filter((i) => i.status.includes('Mismatch')).length}
          </div>
          <button
            onClick={() => setCurrentStep(3)}
            className="text-xs text-[#183426] font-bold hover:underline mt-3 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Resolve Discrepancies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. COO DASHBOARD
const CooDashboard: React.FC = () => {
  const { invoices, setCurrentStep, approveInvoice } = useApp();

  const pendingCoo = invoices.filter(
    (i) => i.status === 'Pending First Approval (COO)' || (i.status === 'In Payment Proposal' && !i.cooApproved)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-black/[0.04] mb-5 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#183426]/10 text-[#183426] uppercase">
                First-Layer Approval
              </span>
              <h3 className="text-base font-extrabold text-[#101312]">
                COO Executive Sign-Off Queue
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review operational payment proposals before they advance to the Managing Director
            </p>
          </div>
          <button
            onClick={() => setCurrentStep(7)}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#101312] hover:bg-black rounded-full shadow-sm cursor-pointer self-start sm:self-auto transition-all"
          >
            Open Approval Screen (Step 7) →
          </button>
        </div>

        {pendingCoo.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            All proposals have been signed off. Your queue is clear.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingCoo.map((inv) => (
              <div key={inv.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-[#101312] text-sm flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-slate-400 shrink-0">{inv.id}</span>
                    <span className="truncate">{inv.supplierName}</span>
                    {inv.isOffCycleUrgent && (
                      <span className="text-[10px] bg-rose-500/10 text-rose-800 font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                        Urgent Off-Cycle
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 truncate">
                    LOA: {inv.loaBand} · Cycle: {inv.paymentType} · Due: {inv.dueDate}
                  </div>
                  {inv.offCycleReason && (
                    <p className="text-xs text-rose-800 bg-rose-50/80 p-2.5 rounded-xl mt-2 break-words">
                      Reason: {inv.offCycleReason}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="text-base font-extrabold text-[#101312] whitespace-nowrap shrink-0">
                    RM {inv.amountRM.toLocaleString()}
                  </span>
                  <button
                    onClick={() => approveInvoice(inv.id, 'Approved by COO via executive workbench')}
                    className="px-4 py-2 text-xs font-extrabold text-[#101312] bg-[#49D892] hover:bg-[#3ec482] rounded-full shadow-xs cursor-pointer transition-all whitespace-nowrap shrink-0"
                  >
                    Approve (COO)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 5. DIRECTOR DASHBOARD
const DirectorDashboard: React.FC = () => {
  const { invoices, setCurrentStep, approveInvoice } = useApp();

  const pendingDirector = invoices.filter(
    (i) => i.status === 'Pending Final Approval (Director)' || (i.cooApproved && !i.directorApproved && i.status !== 'Rejected' && i.status !== 'Paid')
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-black/[0.04] mb-5 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#183426]/10 text-[#183426] uppercase">
                Final Sign-Off (Layer 2)
              </span>
              <h3 className="text-base font-extrabold text-[#101312]">
                Managing Director Final Authorization Queue
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              These listings have been cleared by the COO and require final board authorization for disbursement.
            </p>
          </div>
          <button
            onClick={() => setCurrentStep(7)}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#101312] hover:bg-black rounded-full shadow-sm cursor-pointer self-start sm:self-auto transition-all"
          >
            Open Approval Screen (Step 7) →
          </button>
        </div>

        {pendingDirector.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No listings awaiting Director sign-off at this time.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingDirector.map((inv) => (
              <div key={inv.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-[#101312] text-sm flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-slate-400 shrink-0">{inv.id}</span>
                    <span className="truncate">{inv.supplierName}</span>
                    <span className="text-[10px] bg-[#49D892]/20 text-[#183426] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                      COO Approved ✓
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 truncate">
                    LOA: {inv.loaBand} · Cycle: {inv.paymentType} · Due: {inv.dueDate}
                  </div>
                  {inv.cooComments && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl mt-2 break-words">
                      COO Remarks: {inv.cooComments}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="text-base font-extrabold text-[#101312] whitespace-nowrap shrink-0">
                    RM {inv.amountRM.toLocaleString()}
                  </span>
                  <button
                    onClick={() => approveInvoice(inv.id, 'Final sign-off by Managing Director')}
                    className="px-4 py-2 text-xs font-extrabold text-white bg-[#101312] hover:bg-black rounded-full shadow-xs cursor-pointer transition-all whitespace-nowrap shrink-0"
                  >
                    Authorize Release
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 6. CFO DASHBOARD (READ-ONLY)
const CfoDashboard: React.FC = () => {
  const { invoices } = useApp();

  const pendingApproval = invoices.filter(
    (i) => i.status.includes('Approval') || i.status === 'In Payment Proposal'
  );
  const totalPendingRM = pendingApproval.reduce((s, i) => s + i.amountRM, 0);

  const paidInvoices = invoices.filter((i) => i.status === 'Paid');
  const totalPaidRM = paidInvoices.reduce((s, i) => s + i.amountRM, 0);

  const openExceptions = invoices.filter((i) => i.status.includes('Mismatch'));

  // Calculate live pending RM by LOA band for charts
  const pendingBand1 = pendingApproval
    .filter((i) => i.loaBand.includes('Band 1'))
    .reduce((s, i) => s + i.amountRM, 0);
  const pendingBand2 = pendingApproval
    .filter((i) => i.loaBand.includes('Band 2'))
    .reduce((s, i) => s + i.amountRM, 0);
  const pendingBand3 = pendingApproval
    .filter((i) => i.loaBand.includes('Band 3'))
    .reduce((s, i) => s + i.amountRM, 0);

  const pendingByBandData = [
    {
      name: 'Band 1 (≤RM 30k)',
      shortName: 'Band 1',
      amount: pendingBand1,
      count: pendingApproval.filter((i) => i.loaBand.includes('Band 1')).length,
      fill: '#3b82f6',
    },
    {
      name: 'Band 2 (RM 31k-100k)',
      shortName: 'Band 2',
      amount: pendingBand2,
      count: pendingApproval.filter((i) => i.loaBand.includes('Band 2')).length,
      fill: '#f59e0b',
    },
    {
      name: 'Band 3 (>RM 100k)',
      shortName: 'Band 3',
      amount: pendingBand3,
      count: pendingApproval.filter((i) => i.loaBand.includes('Band 3')).length,
      fill: '#ec4899',
    },
  ];

  // 30-Day Trend Data for Average Time-to-Approval (Cycle Days) across 5-day intervals
  const approvalTrend30Days = [
    { day: 'Day -30 (Aug 24)', avgDays: 6.4, sampleSize: 14, benchmarkTarget: 2.0 },
    { day: 'Day -25 (Aug 29)', avgDays: 5.8, sampleSize: 18, benchmarkTarget: 2.0 },
    { day: 'Day -20 (Sep 03)', avgDays: 4.5, sampleSize: 22, benchmarkTarget: 2.0 },
    { day: 'Day -15 (Sep 08)', avgDays: 3.1, sampleSize: 19, benchmarkTarget: 2.0 },
    { day: 'Day -10 (Sep 13)', avgDays: 2.3, sampleSize: 25, benchmarkTarget: 2.0 },
    { day: 'Day -5 (Sep 18)', avgDays: 1.8, sampleSize: 21, benchmarkTarget: 2.0 },
    { day: 'Today (Sep 23)', avgDays: 1.4, sampleSize: 16, benchmarkTarget: 2.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Read-Only Notice */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-700 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-[#183426]/10 text-[#183426] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <span className="font-extrabold text-[#101312]">CFO Executive Read-Only View:</span> Strategic liquidity and turnaround oversight. No operational payment release actions can be triggered from this view.
        </div>
      </div>

      {/* 4 Core KPIs in FlowFunds Luxury Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total RM Pending Approval */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">Total RM Pending Approval</span>
          <div className="text-3xl font-extrabold text-[#101312] mt-3 tracking-tight">
            RM {totalPendingRM.toLocaleString()}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-2">
            {pendingApproval.length} proposals awaiting sign-off
          </div>
        </div>

        {/* KPI 2: Total RM Paid This Week */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">Total RM Paid This Week</span>
          <div className="text-3xl font-extrabold text-[#183426] mt-3 tracking-tight">
            RM {totalPaidRM.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-2">
            {paidInvoices.length} supplier payments settled
          </div>
        </div>

        {/* KPI 3: Open Exceptions */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">Exceptions Open (Variances)</span>
          <div className="text-3xl font-extrabold text-[#101312] mt-3 tracking-tight">
            {openExceptions.length}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            3-way match variances under review
          </div>
        </div>

        {/* KPI 4: Average Time to Approval */}
        <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-semibold">Average Time-to-Approval</span>
          <div className="text-3xl font-extrabold text-[#183426] mt-3 tracking-tight">
            1.4 Days
          </div>
          <div className="text-xs text-[#183426] font-bold mt-2 flex items-center gap-1">
            <span>↓ 78% faster</span>
            <span className="text-slate-400 font-normal">(from 6.8 days)</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section: Executive Visualizations via Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bar Chart of Total RM Pending Approval by LOA Band */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-extrabold text-[#101312] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#183426]" />
                <span>Total RM Pending Approval by Authority Band</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time liquidity committed awaiting Treasury & Executive sign-off
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#101312] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              RM {totalPendingRM.toLocaleString()} Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pendingByBandData}
                margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickFormatter={(val: number) => `RM ${(val / 1000).toFixed(0)}k`}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    `RM ${Number(value || 0).toLocaleString()}`,
                    'Pending Amount',
                  ]}
                  labelFormatter={(label) => `Authority Tier: ${label}`}
                  contentStyle={{
                    backgroundColor: '#101312',
                    borderColor: '#183426',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <Bar
                  dataKey="amount"
                  radius={[8, 8, 0, 0]}
                  name="Pending (RM)"
                >
                  <Cell fill="#183426" />
                  <Cell fill="#49D892" />
                  <Cell fill="#101312" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Legend & Count Badges */}
          <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#183426]"></span>
              <span className="text-slate-600 truncate">Band 1:</span>
              <span className="font-bold text-[#101312] font-mono">
                {pendingByBandData[0].count} inv
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#49D892]"></span>
              <span className="text-slate-600 truncate">Band 2:</span>
              <span className="font-bold text-[#101312] font-mono">
                {pendingByBandData[1].count} inv
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#101312]"></span>
              <span className="text-slate-600 truncate">Band 3:</span>
              <span className="font-bold text-[#101312] font-mono">
                {pendingByBandData[2].count} inv
              </span>
            </div>
          </div>
        </div>

        {/* Chart 2: Recharts Trend Line Chart of Average Time-to-Approval over last 30 days */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-extrabold text-[#101312] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#183426]" />
                <span>Average Time-to-Approval (30-Day Trend)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Daily turnaround duration (in days) tracking toward executive SLA
              </p>
            </div>
            <span className="text-xs font-bold text-[#183426] bg-[#49D892]/20 px-3 py-1 rounded-full">
              1.4 Days Current
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={approvalTrend30Days}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  unit=" d"
                  domain={[0, 8]}
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                  formatter={(val: unknown) => [
                    val != null ? `${Number(val).toFixed(1)} Days` : 'N/A',
                    '',
                  ]}
                  contentStyle={{
                    backgroundColor: '#101312',
                    borderColor: '#183426',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={30}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '0px' }}
                />
                <ReferenceLine
                  y={2.0}
                  label={{ value: 'Target SLA (2.0d)', fill: '#b45309', fontSize: 10, position: 'top' }}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="avgDays"
                  name="Avg Approval Time (Days)"
                  stroke="#183426"
                  strokeWidth={3.5}
                  dot={{ r: 4.5, fill: '#49D892', stroke: '#101312', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#49D892', stroke: '#101312', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmarkTarget"
                  name="Corporate Target SLA (2.0 d)"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>30-Day Window: 6.4 Days (Aug 24) → 1.4 Days (Today)</span>
            <span className="text-[#183426] font-bold">Fast-track achieved via Automated Portal</span>
          </div>
        </div>
      </div>

      {/* Strategic Cash Exposure Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Treasury Cashflow Exposure by Limit of Authority (LOA) Band
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-700">Band 1: Routine (≤ RM 30,000)</div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              RM{' '}
              {invoices
                .filter((i) => i.loaBand.includes('Band 1'))
                .reduce((s, i) => s + i.amountRM, 0)
                .toLocaleString()}
            </div>
            <div className="text-slate-500 mt-1">Operational supplies & fast-track items</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-700">Band 2: Mid-Tier (RM 31,000–100,000)</div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              RM{' '}
              {invoices
                .filter((i) => i.loaBand.includes('Band 2'))
                .reduce((s, i) => s + i.amountRM, 0)
                .toLocaleString()}
            </div>
            <div className="text-slate-500 mt-1">Freight logistics & engineering services</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-700">Band 3: Capital (&gt; RM 100,000)</div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              RM{' '}
              {invoices
                .filter((i) => i.loaBand.includes('Band 3'))
                .reduce((s, i) => s + i.amountRM, 0)
                .toLocaleString()}
            </div>
            <div className="text-slate-500 mt-1">Bulk industrial chemicals & hardware contracts</div>
          </div>
        </div>
      </div>
    </div>
  );
};
