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

export const FlowStepper: React.FC = () => {
  const { currentStep, setCurrentStep, openQuestions, invoices } = useApp();

  // Counts for live badges
  const pendingMatchCount = invoices.filter((i) => i.status === 'Submitted').length;
  const exceptionCount = invoices.filter((i) => i.status === 'Mismatch (Exception)').length;
  const draftApCount = invoices.filter((i) => i.status === 'Draft AP in SAP').length;
  const proposalCount = invoices.filter((i) => i.status === 'In Payment Proposal').length;
  const pendingApprovalCount = invoices.filter((i) =>
    i.status === 'Pending First Approval (COO)' ||
    i.status === 'Pending Final Approval (Director)' ||
    i.status === 'Pending Manager Approval'
  ).length;
  const bankDeclinedCount = invoices.filter((i) => i.status === 'Bank Declined').length;
  const postedCount = invoices.filter((i) => i.status === 'Posted PV' || i.status === 'Paid').length;

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 shadow-xs">
      <div className="max-w-7xl mx-auto">
        {/* Exception Path Indicators Bar */}
        <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">End-to-End Payment Flow:</span>
            <span className="text-slate-400">Click any stage to inspect or progress demo invoices</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              <Zap className="w-3 h-3 text-amber-600" />
              <span>Manual Check Path: Bypasses Steps 2–8 → Posted PV</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200 font-medium">
              <Flame className="w-3 h-3 text-red-600" />
              <span>Off-Cycle Urgent: Bypasses wait → Immediate Approval</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              <XCircle className="w-3 h-3 text-slate-500" />
              <span>Rejection: Terminated at Step 2</span>
            </span>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
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
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-600 text-white shadow-xs font-semibold'
                      : isBankBypassed
                      ? 'bg-slate-100 text-slate-400 opacity-60 line-through'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 ${
                      isCurrent
                        ? 'bg-white/25 text-white font-bold'
                        : isPast
                        ? 'bg-teal-100 text-teal-800 font-medium'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[11px] font-bold flex items-center gap-1">
                      <span>
                        {s.num}. {s.title}
                      </span>
                      {badgeCount !== null && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                            isCurrent
                              ? 'bg-white text-teal-900'
                              : s.num === 3 || (s.num === 8 && bankDeclinedCount > 0)
                              ? 'bg-amber-500 text-white'
                              : 'bg-teal-600 text-white'
                          }`}
                        >
                          {badgeCount}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[9px] truncate max-w-[90px] ${
                        isCurrent ? 'text-teal-100' : 'text-slate-400'
                      }`}
                    >
                      {isBankBypassed ? '(Bypassed in Settings)' : s.sub}
                    </div>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="w-2 h-0.5 bg-slate-200 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
