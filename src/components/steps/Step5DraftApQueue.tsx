import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const Step5DraftApQueue: React.FC = () => {
  const { invoices, createPaymentProposalBatch, setCurrentStep, openQuestions } = useApp();

  const sittingDrafts = invoices.filter(
    (i) =>
      i.status === 'Draft AP in SAP' ||
      i.status === 'Matched' ||
      i.status === 'In Payment Proposal'
  );

  const weeklyDrafts = sittingDrafts.filter((i) => i.paymentType === 'Weekly Payment');
  const monthlyDrafts = sittingDrafts.filter(
    (i) => i.paymentType === 'Supplier Aging Payment (Monthly)'
  );

  const totalWeeklyRM = weeklyDrafts.reduce((sum, i) => sum + i.amountRM, 0);
  const totalMonthlyRM = monthlyDrafts.reduce((sum, i) => sum + i.amountRM, 0);

  const handleGenerateBatch = () => {
    createPaymentProposalBatch();
    setCurrentStep(6);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
                Stage 5 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Draft AP Sits in SAP — Staging for Payment Cycle
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Validated Draft A/P Invoices reside in the SAP ledger, staging until the scheduled treasury disbursement cycle triggers. Grouped by <strong>Weekly Friday Run</strong> or <strong>Monthly Supplier Aging Run</strong>.
            </p>
          </div>

          <button
            onClick={handleGenerateBatch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-[#101312] bg-[#49D892] hover:bg-[#3ec482] shadow-xs transition-all cursor-pointer"
          >
            <span>Assemble Payment Proposal Batch (Step 6)</span>
            <ArrowRight className="w-4 h-4 text-[#183426]" />
          </button>
        </div>
      </div>

      {/* Cycle Buckets Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weekly Payment Cycle Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 text-[#183426] border border-slate-200/60">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#101312]">Weekly Payment Staging Bucket</h3>
                <p className="text-xs text-slate-500">Subject to weekly Friday cut-off cycle</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#49D892]/20 text-[#183426]">
              {weeklyDrafts.length} Invoices
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Outflow Value:</span>
              <span className="text-lg font-mono font-extrabold text-[#101312]">
                RM {totalWeeklyRM.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <span className="text-slate-600 font-medium">Upcoming Friday Cut-Off:</span>
              <span className="font-extrabold text-[#183426]">Friday, 12:00 PM (In 2 Days)</span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              Includes short-term operational expenses, urgent transport haulage, and site requisitions.
            </div>
          </div>
        </div>

        {/* Monthly Aging Payment Cycle Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/60">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#101312]">Supplier Aging Payment Bucket</h3>
                <p className="text-xs text-slate-500">End-of-month scheduled bulk reconciliation</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800">
              {monthlyDrafts.length} Invoices
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Outflow Value:</span>
              <span className="text-lg font-mono font-extrabold text-[#101312]">
                RM {totalMonthlyRM.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <span className="text-slate-600 font-medium">Scheduled Month-End Run:</span>
              <span className="font-extrabold text-slate-800">30th of Month (Batch 09-B)</span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              High-value bulk materials, IT subscriptions, raw chemical resins on 30-day credit terms.
            </div>
          </div>
        </div>
      </div>

      {/* Draft AP Inventory Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#101312] uppercase tracking-wider">
            Staged Draft A/P Records Awaiting Next Cycle Run
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            ERP Sync Status: All Verified Against Open POs
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sittingDrafts.map((inv) => (
            <div
              key={inv.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                    {inv.id}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">{inv.supplierName}</span>
                  <span className="text-xs text-slate-400 shrink-0">({inv.supplierBpCode})</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 whitespace-nowrap shrink-0">
                    {inv.sapDraftApDocNum || 'AP-DRF-4020'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>Cycle: <strong>{inv.paymentType}</strong></span>
                  <span>Due: {inv.dueDate}</span>
                  <span>LOA: {inv.loaBand}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 font-mono whitespace-nowrap">
                    RM {inv.amountRM.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    Ready for Run
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
