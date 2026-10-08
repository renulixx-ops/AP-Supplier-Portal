import React from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Building,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const OpenQuestionsModal: React.FC = () => {
  const { isQuestionsModalOpen, setIsQuestionsModalOpen, openQuestions, setOpenQuestions } = useApp();

  if (!isQuestionsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101312]/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="bg-[#101312] px-7 py-5 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#183426] rounded-2xl flex items-center justify-center text-[#49D892]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Treasury Consensus Matrix & Architecture Decider
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                5 Architectural Consensus Questions for Treasury, Finance & IT Stakeholders
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuestionsModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 space-y-6 max-h-[78vh] overflow-y-auto text-sm">
          <p className="text-xs text-slate-700 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 leading-relaxed font-medium">
            <strong className="text-amber-900 font-extrabold">Executive Workshop Note:</strong> Toggle these settings live during the workshop. The demo app updates its rules, approval queues, and visual layouts immediately in real-time.
          </p>

          {/* Question 1: LOA Bands */}
          <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50 hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Question 1 • Step 6 (Proposal)
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Limit of Authority</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Do the 3 Limit of Authority (LOA) bands still apply, or is this replaced by a single Manager view?
                </h3>
                <p className="text-xs text-slate-600">
                  Current practice uses 3 bands: Band 1 (RM 1–30,000), Band 2 (RM 31,000–100,000), and Band 3 (Above RM 100,000). The portal can either preserve this tiered categorization or present a unified payment listing.
                </p>
              </div>
              <button
                onClick={() =>
                  setOpenQuestions((prev) => ({
                    ...prev,
                    showLoaBands: !prev.showLoaBands,
                  }))
                }
                className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  openQuestions.showLoaBands
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {openQuestions.showLoaBands ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span>3 LOA Bands Active</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span>Single Flat View</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-3 text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 flex items-center justify-between">
              <span>Active demo mode:</span>
              <strong className={openQuestions.showLoaBands ? 'text-teal-700' : 'text-slate-800'}>
                {openQuestions.showLoaBands
                  ? 'Categorized by Band 1 (≤30k), Band 2 (31k-100k), Band 3 (>100k)'
                  : 'Single Flat Consolidated Table'}
              </strong>
            </div>
          </div>

          {/* Question 2: Approval Path */}
          <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50 hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Question 2 • Step 7 (Approval)
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Approval Hierarchy</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Does a single Manager approval replace today's two-layer COO → Director sign-off?
                </h3>
                <p className="text-xs text-slate-600">
                  The future-state concept proposes simplifying to a single manager sign-off. However, Treasury governance may still require the formal two-tier sign-off (COO first, followed by Managing Director).
                </p>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row">
                <button
                  onClick={() =>
                    setOpenQuestions((prev) => ({
                      ...prev,
                      approvalPath: 'single_manager',
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                    openQuestions.approvalPath === 'single_manager'
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Path A: Single Manager
                </button>
                <button
                  onClick={() =>
                    setOpenQuestions((prev) => ({
                      ...prev,
                      approvalPath: 'two_layer',
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                    openQuestions.approvalPath === 'two_layer'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Path B: COO → Director (2-Layer)
                </button>
              </div>
            </div>
            <div className="mt-3 text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 flex items-center justify-between">
              <span>Active approval routing:</span>
              <strong className={openQuestions.approvalPath === 'two_layer' ? 'text-indigo-700' : 'text-teal-700'}>
                {openQuestions.approvalPath === 'two_layer'
                  ? 'Path B: COO Queue (1st Layer) → Director Queue (Final Sign-off)'
                  : 'Path A: Streamlined Single Manager Sign-off'}
              </strong>
            </div>
          </div>

          {/* Question 3: Bank Portal Step */}
          <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50 hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Question 3 • Step 8 (Bank Portal)
                  </span>
                  <span className="text-xs font-semibold text-slate-500">External Bank Touchpoint</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Does the Bank Portal step still exist in the future state?
                </h3>
                <p className="text-xs text-slate-600">
                  The initial high-level sketch did not show the external Bank Portal step. Is payment execution directly integrated with host-to-host banking APIs, or does Treasury Assistant still upload batch files (Maybank2E / CIMB BizChannel)?
                </p>
              </div>
              <button
                onClick={() =>
                  setOpenQuestions((prev) => ({
                    ...prev,
                    bankPortalEnabled: !prev.bankPortalEnabled,
                  }))
                }
                className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  openQuestions.bankPortalEnabled
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {openQuestions.bankPortalEnabled ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span>Bank Step Included</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span>Bank Step Bypassed</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-3 text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 flex items-center justify-between">
              <span>Future State Model:</span>
              <strong>
                {openQuestions.bankPortalEnabled
                  ? 'Step 8 active: Manual/Batch upload to corporate bank portal retained'
                  : 'Bypassed: Direct ERP Payment Engine creates PV immediately upon approval'}
              </strong>
            </div>
          </div>

          {/* Question 4: Bank Decline Handling */}
          <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50 hover:border-slate-300 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Question 4 • Exception Handling
                </span>
                <span className="text-xs font-semibold text-slate-500">Bank Decline Loop</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                How should Bank Declines be handled in the workflow?
              </h3>
              <p className="text-xs text-slate-600">
                <strong>Current Assumption:</strong> When the bank portal declines an item (e.g. Tenaga Perkasa INV-1044 due to name mismatch), it returns to Treasury Assistant (Syafiqah) to correct beneficiary details without restarting full executive approval from scratch.
              </p>
              <div className="bg-amber-100/70 border border-amber-300 text-amber-900 text-xs p-2.5 rounded-lg mt-2 font-medium">
                ⚠️ Workshop Validation Needed: If bank details are altered by Treasury, does it require re-approval by COO/Director, or just Treasury Chief sign-off?
              </div>
            </div>
          </div>

          {/* Question 5: Friday Cut-off */}
          <div className="border border-slate-200 rounded-xl p-4.5 bg-slate-50 hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Question 5 • Step 6 (Proposal)
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Weekly Cycle Timing</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Is the Friday cut-off a submission deadline or a payment-run release deadline?
                </h3>
                <p className="text-xs text-slate-600">
                  Does "Friday Cut-off" mean all supplier invoices must be entered before Friday 12:00 PM, or is it the scheduled time when Treasury triggers the bank disbursement run?
                </p>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row">
                <button
                  onClick={() =>
                    setOpenQuestions((prev) => ({
                      ...prev,
                      fridayCutoffInterpretation: 'submission_deadline',
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                    openQuestions.fridayCutoffInterpretation === 'submission_deadline'
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Submission Deadline
                </button>
                <button
                  onClick={() =>
                    setOpenQuestions((prev) => ({
                      ...prev,
                      fridayCutoffInterpretation: 'payment_run_deadline',
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                    openQuestions.fridayCutoffInterpretation === 'payment_run_deadline'
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Payment Run Release
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Changes apply instantly across all live screens and persona dashboards.
          </span>
          <button
            onClick={() => setIsQuestionsModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Apply & Return to Workshop Demo
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline reusable Open Question banner for screens
export const OpenQuestionBanner: React.FC<{
  stepTitle: string;
  question: string;
  note?: string;
  actionButton?: React.ReactNode;
}> = ({ stepTitle, question, note, actionButton }) => {
  const { setIsQuestionsModalOpen } = useApp();

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
      <div className="flex items-start gap-2.5">
        <span className="p-1 rounded bg-amber-200 text-amber-900 mt-0.5 shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider">
              Workshop Open Question • {stepTitle}
            </span>
          </div>
          <p className="font-semibold text-slate-900 mt-0.5">{question}</p>
          {note && <p className="text-slate-600 text-[11px] mt-0.5">{note}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {actionButton}
        <button
          onClick={() => setIsQuestionsModalOpen(true)}
          className="px-2.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-md font-medium text-[11px] transition-colors cursor-pointer"
        >
          Discuss All (5)
        </button>
      </div>
    </div>
  );
};
