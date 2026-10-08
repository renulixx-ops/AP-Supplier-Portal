import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  XCircle,
  FileText,
  Building,
} from 'lucide-react';

export const Step3ExceptionQueue: React.FC = () => {
  const { invoices, resolveException, querySupplier, rejectInvoice, setCurrentStep } = useApp();

  const [resolveModalId, setResolveModalId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('Supplier agreed to issue Credit Note for RM 14,800 to offset 20-unit delivery shortfall. Variance approved by AP Senior Lead.');
  const [filterType, setFilterType] = useState<'all' | 'unresolved' | 'queried'>('all');

  const exceptionInvoices = invoices.filter((i) =>
    i.status === 'Mismatch (Exception)' ||
    (i.status === 'Draft AP in SAP' && i.exceptionResolved) ||
    i.supplierQueried
  );

  const displayedInvoices = exceptionInvoices.filter((inv) => {
    if (filterType === 'unresolved') return !inv.exceptionResolved;
    if (filterType === 'queried') return inv.supplierQueried;
    return true;
  });

  const handleExecuteResolve = () => {
    if (resolveModalId) {
      resolveException(resolveModalId, resolutionNote);
      setResolveModalId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-900 tracking-wider uppercase">
                Stage 3 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                AP & Finance Exception Queue
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Centralized triage for 3-way match variances, quantity mismatches, and price discrepancies. Reviewers investigate discrepancies before allowing entry into SAP Business One.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-full font-bold cursor-pointer transition-all ${
                filterType === 'all' ? 'bg-white text-[#101312] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Exceptions ({exceptionInvoices.length})
            </button>
            <button
              onClick={() => setFilterType('unresolved')}
              className={`px-3.5 py-1.5 rounded-full font-bold cursor-pointer transition-all ${
                filterType === 'unresolved' ? 'bg-white text-amber-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Resolution
            </button>
            <button
              onClick={() => setFilterType('queried')}
              className={`px-3.5 py-1.5 rounded-full font-bold cursor-pointer transition-all ${
                filterType === 'queried' ? 'bg-white text-[#183426] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Supplier Queried
            </button>
          </div>
        </div>
      </div>

      {/* Exception List */}
      <div className="space-y-4">
        {displayedInvoices.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-12 text-center text-slate-500 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-[#183426] mx-auto mb-2" />
            <p className="text-base font-extrabold text-[#101312]">No Open Discrepancies in Queue</p>
            <p className="text-xs text-slate-500 mt-1">
              All incoming invoices have successfully cleared 3-way matching or have been resolved.
            </p>
          </div>
        ) : (
          displayedInvoices.map((inv) => (
            <div
              key={inv.id}
              className={`bg-white rounded-2xl sm:rounded-3xl border transition-all overflow-hidden p-6 sm:p-7 shadow-xs ${
                inv.exceptionResolved
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200/90 hover:border-amber-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {inv.id}
                    </span>
                    <span className="text-base font-extrabold text-[#101312]">
                      {inv.supplierName}
                    </span>
                    <span className="text-xs text-slate-400">({inv.supplierBpCode})</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        inv.exceptionResolved
                          ? 'bg-[#49D892]/20 text-[#183426]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {inv.exceptionResolved ? 'Resolved & Posted to SAP' : 'Unmatched Discrepancy'}
                    </span>
                    {inv.supplierQueried && !inv.exceptionResolved && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Supplier Clarification Dispatched
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 bg-amber-50/80 p-3.5 sm:p-4 rounded-xl border border-amber-200/80">
                    <strong>Discrepancy Details:</strong>{' '}
                    {inv.exceptionDetails || inv.matchResult.mismatchDetails || 'Quantity/rate mismatch'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Invoice Amount:</span>{' '}
                      <strong className="text-slate-900 font-extrabold">RM {inv.amountRM.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">PO Ref:</span>{' '}
                      <span className="font-mono text-slate-700">{inv.poNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Variance:</span>{' '}
                      <span className="text-amber-700 font-bold">
                        RM {inv.matchResult.varianceAmountRM.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Payment Type:</span>{' '}
                      <span>{inv.paymentType}</span>
                    </div>
                  </div>

                  {inv.exceptionResolutionNote && (
                    <div className="text-xs text-emerald-900 bg-emerald-50/80 p-3.5 sm:p-4 rounded-xl border border-emerald-200">
                      <strong>Audit Trail / Resolution Note:</strong> {inv.exceptionResolutionNote}
                    </div>
                  )}
                </div>

                {/* Reviewer Action Buttons */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0">
                  {!inv.exceptionResolved ? (
                    <>
                      <button
                        onClick={() => setResolveModalId(inv.id)}
                        className="px-5 py-2.5 text-xs font-bold text-[#101312] bg-[#49D892] hover:bg-[#3ec482] rounded-full shadow-xs transition-colors cursor-pointer"
                      >
                        Resolve & Post to Draft AP
                      </button>
                      <button
                        onClick={() => querySupplier(inv.id)}
                        disabled={inv.supplierQueried}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                          inv.supplierQueried
                            ? 'bg-slate-100 text-slate-400 border-slate-200'
                            : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {inv.supplierQueried ? 'Supplier Queried ✓' : 'Query Supplier (Email/Portal)'}
                      </button>
                      <button
                        onClick={() => rejectInvoice(inv.id, 'Exception rejected: Supplier failed to provide warehouse delivery order confirmation.')}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
                      >
                        Reject Invoice
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg"
                    >
                      <span>View in Draft AP (Step 4)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {resolveModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-teal-800 pb-3 border-b border-teal-100">
              <div className="p-2 bg-teal-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Resolve Discrepancy & Authorize Draft AP</h3>
                <p className="text-xs text-teal-700">Records audit justification for ERP posting</p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <p>
                Resolving this mismatch overrides the warehouse variance, updates the 3-way match status to <strong>Matched</strong>, and immediately creates a <strong>Draft A/P Invoice in SAP Business One</strong> for subsequent payment batching.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Resolution Justification Note *
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setResolveModalId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteResolve}
                className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg cursor-pointer"
              >
                Confirm & Create Draft AP in SAP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
