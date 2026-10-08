import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenQuestionBanner } from '../OpenQuestionsModal';
import {
  Building,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

export const Step8BankPortal: React.FC = () => {
  const {
    invoices,
    openQuestions,
    setOpenQuestions,
    simulateBankTransmission,
    setCurrentStep,
    setActivePersona,
  } = useApp();

  const [selectedBank, setSelectedBank] = useState<'Maybank2E' | 'CIMB BizChannel'>('Maybank2E');
  const [declineReasonModalId, setDeclineReasonModalId] = useState<string | null>(null);
  const [customDeclineReason, setCustomDeclineReason] = useState(
    'Bank account name does not match registered corporate name (missing "Sdn Bhd" suffix). Returned to Syafiqah for correction.'
  );

  // Invoices that reached bank portal processing
  const bankQueue = invoices.filter(
    (i) =>
      i.status === 'Bank Processing' ||
      i.status === 'Bank Approved' ||
      i.status === 'Bank Declined' ||
      (i.directorApproved && i.status !== 'Posted PV' && i.status !== 'Paid' && i.status !== 'Rejected') ||
      (openQuestions.approvalPath === 'single_manager' && i.managerApproved && i.status !== 'Posted PV' && i.status !== 'Paid')
  );

  const pendingBatch = bankQueue.filter((i) => i.status !== 'Bank Approved' && i.status !== 'Bank Declined');

  const handleExecuteDecline = () => {
    if (declineReasonModalId) {
      simulateBankTransmission(declineReasonModalId, 'Declined', customDeclineReason);
      setDeclineReasonModalId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
                Stage 8 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Corporate Bank Host-to-Host Transmission (Maybank2E / CIMB)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Simulates batch export and upload to corporate banking gateway. Treasury Assistant uploads approved batch file and monitors clearing or rejection status.
            </p>
          </div>

          <button
            onClick={() => setCurrentStep(9)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-[#101312] bg-[#49D892] hover:bg-[#3ec482] shadow-xs cursor-pointer transition-all"
          >
            <span>Proceed to Step 9: Post PV in SAP</span>
            <ArrowRight className="w-4 h-4 text-[#183426]" />
          </button>
        </div>
      </div>

      {/* Open Question 3: Bank Portal Step Exists? */}
      <OpenQuestionBanner
        stepTitle="Step 8 Bank Portal"
        question="Does the Bank Portal step still exist in the future state? The source diagram doesn't show it."
        note="If disabled, approved listings bypass this manual upload step and trigger SAP Payment Vouchers directly."
        actionButton={
          <button
            onClick={() =>
              setOpenQuestions((prev) => ({
                ...prev,
                bankPortalEnabled: !prev.bankPortalEnabled,
              }))
            }
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              openQuestions.bankPortalEnabled
                ? 'bg-teal-700 text-white'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            {openQuestions.bankPortalEnabled ? (
              <>
                <ToggleRight className="w-4 h-4" />
                <span>Bank Step Enabled</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>Bank Step Bypassed</span>
              </>
            )}
          </button>
        }
      />

      {/* Open Question 4: Bank Decline Handling Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs">
        <span className="p-1 rounded bg-amber-200 text-amber-900 mt-0.5 shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </span>
        <div>
          <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider">
            Assumption Callout • Bank Decline Workflow
          </span>
          <p className="font-medium text-slate-800 mt-0.5">
            <strong>Assumed Rule:</strong> When the bank declines an item (e.g. Tenaga Perkasa INV-1044), it returns directly to the <strong>Treasury Assistant queue (Syafiqah)</strong> for beneficiary correction, rather than aborting the entire payment run.
          </p>
          <p className="text-slate-600 text-[11px] mt-0.5">
            Note: Pending formal confirmation whether editing bank details requires full executive re-approval.
          </p>
        </div>
      </div>

      {/* Corporate Bank Upload Simulator Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-[#183426]" />
            <div>
              <h3 className="text-xs font-bold text-[#101312] uppercase tracking-wider">
                Corporate Banking Transmission Console
              </h3>
              <p className="text-[11px] text-slate-500">
                Batch File Format: IBG / RENTAS / Direct Credit (TXT / ISO 20022)
              </p>
            </div>
          </div>

          {/* Select Bank */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Banking Gateway:</span>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value as any)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200/80 font-bold bg-white text-slate-800 shadow-xs outline-none"
            >
              <option value="Maybank2E">Maybank2E Corporate (MBB-EPAY)</option>
              <option value="CIMB BizChannel">CIMB BizChannel (CIMB-HOST)</option>
            </select>
          </div>
        </div>

        {/* Bank Queue Items */}
        <div className="p-6">
          <div className="space-y-4">
            {bankQueue.map((inv) => {
              const isApproved = inv.bankStatus === 'Approved' || inv.status === 'Bank Approved';
              const isDeclined = inv.bankStatus === 'Declined' || inv.status === 'Bank Declined';

              return (
                <div
                  key={inv.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isApproved
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : isDeclined
                      ? 'bg-red-50/40 border-red-300'
                      : 'bg-white border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                          {inv.id}
                        </span>
                        <span className="text-sm font-extrabold text-[#101312]">{inv.supplierName}</span>
                        <span className="text-xs text-slate-400 font-mono">({inv.supplierBpCode})</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : isDeclined
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isApproved
                            ? 'Bank Cleared / Approved'
                            : isDeclined
                            ? 'Bank Declined'
                            : 'Staged for Transmission'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 pt-0.5">
                        <div>
                          <span className="text-slate-400">Amount:</span>{' '}
                          <strong className="text-slate-900 font-mono">RM {inv.amountRM.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Payment Type:</span> {inv.paymentType}
                        </div>
                        <div>
                          <span className="text-slate-400">SAP Draft Doc:</span>{' '}
                          <span className="font-mono text-[#183426] font-bold">{inv.sapDraftApDocNum}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Batch Ref:</span>{' '}
                          <span className="font-mono text-slate-700">
                            {inv.bankBatchRef || `${selectedBank.slice(0, 3)}-B2609`}
                          </span>
                        </div>
                      </div>

                      {/* Bank Decline Diagnostics */}
                      {isDeclined && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-900 mt-2">
                          <div className="font-bold flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-red-700" />
                            <span>Bank Gateway Return Reason:</span>
                          </div>
                          <p className="mt-1">{inv.bankDeclineReason}</p>
                          <div className="mt-2 text-[11px] text-red-800 font-semibold flex items-center gap-2">
                            <span>Status: Returned to Syafiqah's Treasury Queue</span>
                            <button
                              onClick={() => setActivePersona('treasury_assistant')}
                              className="underline text-red-950 hover:text-black cursor-pointer"
                            >
                              Switch to Syafiqah Persona
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Simulation Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      {!isApproved && !isDeclined ? (
                        <>
                          <button
                            onClick={() => simulateBankTransmission(inv.id, 'Approved')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#101312] hover:bg-black shadow-xs cursor-pointer transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#49D892]" />
                            <span>Simulate Bank Approved</span>
                          </button>
                          <button
                            onClick={() => {
                              setDeclineReasonModalId(inv.id);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Simulate Bank Declined</span>
                          </button>
                        </>
                      ) : isApproved ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Ready for SAP PV Posting (Step 9)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-700 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
                          Correction in Progress by Treasury
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bank Decline Reason Modal */}
      {declineReasonModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-red-200">
            <div className="flex items-center gap-3 text-red-800 pb-4 border-b border-red-100">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <XCircle className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#101312]">Simulate Bank Portal Decline</h3>
                <p className="text-xs text-red-700 mt-0.5">Tests exception loop back to Treasury Assistant</p>
              </div>
            </div>

            <div className="py-5 space-y-3.5 text-xs text-slate-600">
              <p className="leading-relaxed">
                When corporate banking hosts reject a disbursement file (due to beneficiary account mismatch, inactive account, or currency limits), the item returns to <strong>Syafiqah (Treasury Assistant)</strong> for correction.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Bank Gateway Error Description *
                </label>
                <textarea
                  rows={3}
                  value={customDeclineReason}
                  onChange={(e) => setCustomDeclineReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeclineReasonModalId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDecline}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-full cursor-pointer shadow-xs transition-all"
              >
                Trigger Bank Decline & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
