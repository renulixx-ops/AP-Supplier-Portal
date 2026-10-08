import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  CheckCircle2,
  Database,
  ArrowRight,
  Zap,
  Building,
  DollarSign,
  FileCheck2,
} from 'lucide-react';

export const Step9PostPaymentVoucher: React.FC = () => {
  const { invoices, postPaymentVoucherInSAP, markInvoicePaid, setCurrentStep, setActiveTab } = useApp();

  // Invoices ready for PV or already posted
  const pvInvoices = invoices.filter(
    (i) =>
      i.status === 'Bank Approved' ||
      i.status === 'Posted PV' ||
      i.status === 'Paid' ||
      i.isManualCheckBypass ||
      (i.directorApproved && i.status !== 'Rejected') ||
      (i.managerApproved && i.status !== 'Rejected')
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
                Stage 9 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Draft Payment Voucher (PV) → Finance Verification & Posting in SAP
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Inside SAP Business One, the Draft Payment Voucher is reconciled against banking clearance. Finance verifies the General Ledger (GL) debit/credit allocations and posts the final legal Payment Voucher.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('sap_zone')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer shadow-2xs"
            >
              <Database className="w-4 h-4 text-[#183426]" />
              <span>Inspect in SAP B1</span>
            </button>
            <button
              onClick={() => setCurrentStep(10)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-[#101312] bg-[#49D892] hover:bg-[#3ec482] shadow-xs cursor-pointer transition-all"
            >
              <span>Next: Step 10 (Comparison)</span>
              <ArrowRight className="w-4 h-4 text-[#183426]" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Vouchers Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-[#1b365d]" />
            <h3 className="text-xs font-bold text-[#101312] uppercase tracking-wider">
              SAP Business One Payment Vouchers Ledger (Banking &gt; Outgoing Payments)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            GL Master: [2100-00 Accounts Payable] ↔ [1110-10 Maybank Current]
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {pvInvoices.map((inv) => {
            const isPosted = !!inv.sapPvDocNum || inv.status === 'Posted PV' || inv.status === 'Paid';
            const isPaid = inv.status === 'Paid';

            return (
              <div
                key={inv.id}
                className={`p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors ${
                  isPaid
                    ? 'bg-emerald-50/20'
                    : isPosted
                    ? 'bg-blue-50/20'
                    : 'bg-white hover:bg-slate-50/70'
                }`}
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {inv.id}
                    </span>
                    <span className="text-sm font-extrabold text-[#101312]">{inv.supplierName}</span>
                    <span className="text-xs text-slate-400 font-mono">({inv.supplierBpCode})</span>

                    {inv.isManualCheckBypass && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        <Zap className="w-3 h-3 text-amber-600" />
                        Manual Check — Bypassed listing & bank portal
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPosted
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isPaid
                        ? 'Dispatched / Paid'
                        : isPosted
                        ? `Posted PV (${inv.sapPvDocNum})`
                        : 'Draft PV Staged'}
                    </span>
                  </div>

                  {inv.manualCheckNotes && (
                    <p className="text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                      <strong>Manual Check Audit Note:</strong> {inv.manualCheckNotes}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 pt-0.5">
                    <div>
                      <span className="text-slate-400">Net Amount:</span>{' '}
                      <strong className="text-slate-900 font-mono">RM {inv.amountRM.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Draft AP Ref:</span>{' '}
                      <span className="font-mono text-slate-700">{inv.sapDraftApDocNum || 'AP-DRF-4011'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Official SAP PV #:</span>{' '}
                      <span className="font-mono font-bold text-indigo-700">
                        {inv.sapPvDocNum || 'Pending Final Post'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Posting Date:</span>{' '}
                      <span className="text-slate-800">{inv.sapPostedDate || 'Staged for Release'}</span>
                    </div>
                  </div>

                  {/* GL Account Posting Visualizer */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] font-mono grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-emerald-700 font-bold">DR:</span> 2100-00 AP Trade Creditors (RM {inv.amountRM.toLocaleString()})
                    </div>
                    <div>
                      <span className="text-blue-700 font-bold">CR:</span> 1110-10 Maybank Corporate Operating (RM {inv.amountRM.toLocaleString()})
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 self-end lg:self-center">
                  {!isPosted ? (
                    <button
                      onClick={() => postPaymentVoucherInSAP(inv.id)}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-[#101312] hover:bg-black rounded-full shadow-xs transition-all cursor-pointer"
                    >
                      Post Payment Voucher in SAP
                    </button>
                  ) : !isPaid ? (
                    <button
                      onClick={() => markInvoicePaid(inv.id)}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-xs transition-all cursor-pointer"
                    >
                      Mark Funds Dispatched (Paid)
                    </button>
                  ) : (
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Funds Fully Settled</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
