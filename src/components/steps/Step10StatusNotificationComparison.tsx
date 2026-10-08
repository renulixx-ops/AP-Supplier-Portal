import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MailX,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Send,
  Zap,
  PhoneCall,
  Search,
} from 'lucide-react';

export const Step10StatusNotificationComparison: React.FC = () => {
  const { setCurrentStep } = useApp();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
                Stage 10 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Status Notification: Current Manual Paradigm vs Future Automated State
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Compare how Treasury communicates payment progress today versus how real-time event webhooks and self-service portals eliminate repetitive follow-ups.
            </p>
          </div>

          <button
            onClick={() => setCurrentStep(11)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-[#101312] bg-[#49D892] hover:bg-[#3ec482] shadow-xs cursor-pointer transition-all"
          >
            <span>Test Supplier Self-Service Lookup (Step 11)</span>
            <ArrowRight className="w-4 h-4 text-[#183426]" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State (Old Way) - Marked as Being Replaced */}
        <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-7 relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-200/80 text-slate-700">
                <MailX className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                  Current State (Being Replaced)
                </span>
                <h3 className="text-base font-extrabold text-[#101312] mt-1">
                  Manual Email Chains & Excel Logging
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Crossed-out pain points */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 line-through text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-600">
                <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                <span>Manual Excel Master Sheet Updates</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Treasury Assistants maintain offline spreadsheets, copying PV numbers and status rows by hand.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 line-through text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-600">
                <Send className="w-4 h-4 text-slate-400" />
                <span>Ad-Hoc Emails to Approvers</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Manual emails sent back and forth to COO and Directors requesting approval reminders.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 line-through text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-600">
                <PhoneCall className="w-4 h-4 text-slate-400" />
                <span>Supplier Chasing Phone Calls & Queries</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Suppliers constantly call Treasury asking: "Has my invoice been approved yet? When is payment?"
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Estimated Time Spent Today:</span>
              <span className="font-extrabold text-slate-900">12–15 hours / week in manual chasing</span>
            </div>
          </div>
        </div>

        {/* Future State (Proposed Web Portal) */}
        <div className="bg-[#183426]/5 border border-[#49D892]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-7 relative shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#49D892]/20 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#101312] text-[#49D892] shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#183426] bg-[#49D892]/20 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                  Future State (Target Architecture)
                </span>
                <h3 className="text-base font-extrabold text-[#101312] mt-1">
                  Automated Event-Driven Transparency
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-extrabold text-[#101312]">
                <CheckCircle2 className="w-4 h-4 text-[#183426]" />
                <span>Automatic SAP Ledger Synchronization</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                When an invoice is approved, bank-cleared, or posted as a PV, the portal updates instantly via webhooks.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-extrabold text-[#101312]">
                <Search className="w-4 h-4 text-[#183426]" />
                <span>Supplier Self-Service Portal (Step 11)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Vendors look up their invoice status 24/7 without calling Treasury (showing Paid, To be paid, or Not yet due).
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-extrabold text-[#101312]">
                <Zap className="w-4 h-4 text-[#183426]" />
                <span>Instant In-App Approver Queues</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                COO and Director see consolidated batch listings in one screen with one-click sign-off.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#49D892]/20 flex items-center justify-between text-xs text-[#183426] font-medium">
              <span>Treasury Efficiency Gain:</span>
              <span className="font-extrabold text-[#101312]">85% reduction in status inquiry overhead</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
