import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  GitCompare,
  AlertCircle,
  FileCheck2,
  Clock,
  Layers,
  CheckSquare,
  Building,
  Receipt,
  MailCheck,
  Search,
  Zap,
  Flame,
  XCircle,
} from 'lucide-react';

export const STEPS = [
  { num: 1, title: 'Supplier Submit', sub: 'e-Invoice Entry', icon: FileText },
  { num: 2, title: '3-Way Match', sub: 'Inv ↔ PO ↔ GRPO', icon: GitCompare },
  { num: 3, title: 'Exception Queue', sub: 'AP Variance Review', icon: AlertCircle },
  { num: 4, title: 'Draft AP to SAP', sub: 'ERP Record Created', icon: FileCheck2 },
  { num: 5, title: 'Draft AP Sits', sub: 'Awaiting Cycle', icon: Clock },
  { num: 6, title: 'Payment Proposal', sub: 'LOA Band Listing', icon: Layers },
  { num: 7, title: 'Approval', sub: 'Path A or B', icon: CheckSquare },
  { num: 8, title: 'Bank Portal', sub: 'Maybank / CIMB File', icon: Building },
  { num: 9, title: 'Post PV in SAP', sub: 'Official Payment Voucher', icon: Receipt },
  { num: 10, title: 'Status Notice', sub: 'Old vs New Paradigm', icon: MailCheck },
  { num: 11, title: 'Supplier Check', sub: 'Self-Service Tracking', icon: Search },
];

export const LuxuryFlowStepper: React.FC = () => {
  const { currentStep, setCurrentStep, openQuestions, invoices } = useApp();

  // Counts for live badges
  const pendingMatchCount = invoices.filter((i) => i.status === 'Submitted').length;
  const exceptionCount = invoices.filter((i) => i.status === 'Mismatch (Exception)').length;
  const draftApCount = invoices.filter((i) => i.status === 'Draft AP in SAP').length;
  const proposalCount = invoices.filter((i) => i.status === 'In Payment Proposal').length;
  const pendingApprovalCount = invoices.filter(
    (i) =>
      i.status === 'Pending First Approval (COO)' ||
      i.status === 'Pending Final Approval (Director)' ||
      i.status === 'Pending Manager Approval'
  ).length;
  const bankDeclinedCount = invoices.filter((i) => i.status === 'Bank Declined').length;
  const postedCount = invoices.filter((i) => i.status === 'Posted PV' || i.status === 'Paid').length;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/90 shadow-xs mb-6">
      {/* Subtle Kicker Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#101312]">Interactive Execution Pipeline</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 font-medium">11-Step SAP B1 Enterprise Lifecycle</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-semibold border border-amber-200 whitespace-nowrap shrink-0 leading-none">
            <Zap className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Manual Check Bypass</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-900 font-semibold border border-rose-200 whitespace-nowrap shrink-0 leading-none">
            <Flame className="w-3 h-3 text-rose-600 shrink-0" />
            <span>Off-Cycle Expedited</span>
          </span>
        </div>
      </div>

      {/* Horizontal Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isCurrent = currentStep === s.num;
          const isPast = currentStep > s.num;
          const isBankStep = s.num === 8;
          const isBankBypassed = isBankStep && !openQuestions.bankPortalEnabled;

          let badgeCount: number | null = null;
          if (s.num === 2 && pendingMatchCount > 0) badgeCount = pendingMatchCount;
          if (s.num === 3 && exceptionCount > 0) badgeCount = exceptionCount;
          if (s.num === 5 && draftApCount > 0) badgeCount = draftApCount;
          if (s.num === 6 && proposalCount > 0) badgeCount = proposalCount;
          if (s.num === 7 && pendingApprovalCount > 0) badgeCount = pendingApprovalCount;
          if (s.num === 8 && bankDeclinedCount > 0) badgeCount = bankDeclinedCount;
          if (s.num === 9 && postedCount > 0) badgeCount = postedCount;

          return (
            <React.Fragment key={s.num}>
              <button
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#101312] text-white shadow-xs'
                    : isBankBypassed
                    ? 'bg-slate-50 text-slate-400 opacity-50 line-through'
                    : 'hover:bg-slate-100/70 text-slate-700 bg-slate-50 border border-slate-200/60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-white/10 text-[#49D892]'
                      : isPast
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-white text-slate-500 border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="leading-tight min-w-0">
                  <div className="text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                    <span>
                      {s.num}. {s.title}
                    </span>
                    {badgeCount !== null && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 whitespace-nowrap inline-flex items-center justify-center leading-none min-w-[18px] ${
                          isCurrent
                            ? 'bg-[#49D892] text-[#101312]'
                            : s.num === 3 || (s.num === 8 && bankDeclinedCount > 0)
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] truncate max-w-[130px] mt-0.5 ${
                      isCurrent ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {isBankBypassed ? 'Disabled' : s.sub}
                  </div>
                </div>
              </button>

              {idx < STEPS.length - 1 && (
                <div className="w-1.5 h-0.5 bg-slate-200 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
