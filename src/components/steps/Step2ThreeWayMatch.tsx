import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Step2ThreeWayMatch: React.FC = () => {
  const { invoices, pushToDraftAP, rejectInvoice, setCurrentStep, selectedInvoiceForDetail } = useApp();

  // Pick the most recent relevant invoice or let user select
  const candidateInvoices = invoices.filter(
    (i) =>
      i.status === 'Submitted' ||
      i.status === 'Matched' ||
      i.status === 'Mismatch (Exception)' ||
      i.status === 'Rejected'
  );

  const [selectedId, setSelectedId] = useState<string>(
    selectedInvoiceForDetail?.id || candidateInvoices[0]?.id || invoices[0]?.id || 'INV-1045'
  );

  useEffect(() => {
    if (selectedInvoiceForDetail && invoices.some((i) => i.id === selectedInvoiceForDetail.id)) {
      setSelectedId(selectedInvoiceForDetail.id);
    }
  }, [selectedInvoiceForDetail, invoices]);

  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Tax Identification Number (TIN) failed Malaysian LHDN schema check; invalid supplier identity.');

  const currentInvoice = invoices.find((i) => i.id === selectedId) || invoices[0];

  const handlePushToDraftAp = () => {
    if (currentInvoice) {
      pushToDraftAP(currentInvoice.id);
      setCurrentStep(4);
    }
  };

  const handleConfirmReject = () => {
    if (currentInvoice) {
      rejectInvoice(currentInvoice.id, rejectReason);
      setRejectionModalOpen(false);
    }
  };

  if (!currentInvoice) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        No invoices available to match. Please submit one in Step 1.
      </div>
    );
  }

  const isMatched = currentInvoice.matchResult.status === 'Matched';
  const isMismatch = currentInvoice.matchResult.status === 'Mismatch';
  const isFailedValidity = currentInvoice.matchResult.status === 'Failed Validity' || currentInvoice.status === 'Rejected';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
                Stage 2 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Automated 3-Way Match & Integrity Validation Engine
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time programmatic comparison between <strong>Supplier Invoice</strong>, <strong>SAP Purchase Order (PO)</strong>, and <strong>SAP Goods Receipt PO (GRPO)</strong>.
            </p>
          </div>

          {/* Invoice Picker */}
          <div className="flex items-center gap-2.5">
            <label className="text-xs font-bold text-slate-700">Target Invoice:</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="text-xs font-bold px-4 py-2 rounded-full border border-slate-200 bg-white text-[#101312] shadow-2xs focus:outline-hidden cursor-pointer"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} - {inv.supplierName.slice(0, 20)}... (RM {inv.amountRM.toLocaleString()}) [{inv.matchResult.status}]
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Engine Visualizer Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Match Header Status */}
        <div
          className={`px-6 py-5 flex flex-wrap items-center justify-between gap-4 border-b ${
            isMatched
              ? 'bg-[#183426]/5 border-[#183426]/10'
              : isMismatch
              ? 'bg-amber-500/10 border-amber-500/20'
              : 'bg-rose-500/10 border-rose-500/20'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                isMatched ? 'bg-[#183426]' : isMismatch ? 'bg-amber-600' : 'bg-rose-600'
              }`}
            >
              {isMatched ? (
                <CheckCircle2 className="w-6 h-6 text-[#49D892]" />
              ) : isMismatch ? (
                <AlertTriangle className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#101312]">
                  {currentInvoice.id}: {currentInvoice.supplierName}
                </span>
                <span
                  className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap shrink-0 leading-none inline-flex items-center ${
                    isMatched
                      ? 'bg-[#49D892]/20 text-[#183426]'
                      : isMismatch
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {isMatched
                    ? '3-Way Match 100% OK'
                    : isMismatch
                    ? 'Discrepancy / Mismatch'
                    : 'Failed Validity (Rejected)'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Amount: <strong>RM {currentInvoice.amountRM.toLocaleString()}</strong> · Payment Cycle:{' '}
                {currentInvoice.paymentType} · LOA: {currentInvoice.loaBand}
              </p>
            </div>
          </div>

          {/* Quick Validity Rejection action button */}
          {!isFailedValidity && currentInvoice.status !== 'Rejected' && (
            <button
              onClick={() => setRejectionModalOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer shadow-2xs"
            >
              Trigger Gateway Rejection (e-Invoice Check)
            </button>
          )}
        </div>

        {/* 3 Columns Comparison: Invoice vs SAP PO vs SAP GRPO */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* 1. Supplier Invoice */}
            <div className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/70">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#183426]" />
                  <span className="text-xs font-bold text-slate-800">1. Supplier e-Invoice</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{currentInvoice.id}</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Amount:</span>
                  <span className="font-bold text-slate-900">
                    RM {currentInvoice.amountRM.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax ID / TIN:</span>
                  <span className={`font-mono ${isFailedValidity ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                    {currentInvoice.taxId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoiced Line Qty:</span>
                  <span className="font-semibold text-slate-800">
                    {currentInvoice.items[0]?.invoiceQty || 10} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit Rate:</span>
                  <span className="text-slate-800">
                    RM {(currentInvoice.items[0]?.invoiceUnitPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. SAP Purchase Order */}
            <div className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/70">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#183426]" />
                  <span className="text-xs font-bold text-slate-800">2. SAP Purchase Order (PO)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{currentInvoice.poNumber}</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorized PO Total:</span>
                  <span className="font-bold text-slate-900">
                    RM{' '}
                    {(
                      (currentInvoice.items[0]?.poQty || 10) *
                      (currentInvoice.items[0]?.poUnitPrice || 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PO Status:</span>
                  <span className="text-emerald-700 font-semibold">Open & Approved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved PO Qty:</span>
                  <span className="font-semibold text-slate-800">
                    {currentInvoice.items[0]?.poQty || 10} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PO Unit Price:</span>
                  <span className="text-slate-800">
                    RM {(currentInvoice.items[0]?.poUnitPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. SAP Goods Receipt PO (GRPO) */}
            <div className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/70">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#183426]" />
                  <span className="text-xs font-bold text-slate-800">3. SAP Goods Receipt (GRPO)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{currentInvoice.grpoNumber}</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Warehouse Receipt:</span>
                  <span
                    className={`font-bold ${
                      isMismatch ? 'text-amber-700' : isFailedValidity ? 'text-slate-400' : 'text-emerald-700'
                    }`}
                  >
                    {isFailedValidity
                      ? 'No Goods Receipt Found'
                      : `${currentInvoice.items[0]?.grpoQty || 10} units received`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Status:</span>
                  <span className="text-slate-800">
                    {isFailedValidity ? 'N/A' : 'Inspected & Accepted'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Receiving Variance:</span>
                  <span
                    className={`font-semibold ${
                      currentInvoice.matchResult.varianceAmountRM > 0
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {currentInvoice.matchResult.varianceAmountRM > 0
                      ? `+RM ${currentInvoice.matchResult.varianceAmountRM.toLocaleString()} (Exceeds GRPO)`
                      : 'RM 0.00 (Zero Variance)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Warehouse Ticket:</span>
                  <span className="text-slate-600 font-mono">WH-KUL-2609</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Analysis Box */}
          <div className="rounded-2xl p-5 bg-slate-50/70 border border-slate-200/80">
            <h4 className="text-xs font-bold text-[#101312] mb-3 uppercase tracking-wider">
              Automated Match Matrix Results
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200/70">
                {currentInvoice.matchResult.poMatched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="font-semibold text-slate-800">PO Reference Valid</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200/70">
                {currentInvoice.matchResult.grpoMatched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span className="font-semibold text-slate-800">GRPO Receipt Match</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200/70">
                {currentInvoice.matchResult.priceMatched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span className="font-semibold text-slate-800">Unit Price Match</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200/70">
                {currentInvoice.matchResult.qtyMatched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span className="font-semibold text-slate-800">Quantity Match</span>
              </div>
            </div>

            {/* Diagnostic Message */}
            {isMismatch && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <strong>Discrepancy Detected:</strong>{' '}
                {currentInvoice.matchResult.mismatchDetails ||
                  currentInvoice.exceptionDetails ||
                  'Invoiced quantity does not match warehouse Goods Receipt (GRPO). Automatically routed to AP Exception Queue.'}
              </div>
            )}

            {isFailedValidity && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs">
                <strong>Rejection Path Active:</strong>{' '}
                {currentInvoice.rejectionReason ||
                  currentInvoice.matchResult.validityDetails ||
                  'The invoice failed basic legal/tax validity checks. Returned to Supplier/AP.'}
                <div className="text-[11px] text-red-700 mt-1 font-mono">
                  Journey terminated. No SAP Draft AP will be created.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-slate-50/70 px-6 py-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            ← Back to Step 1 (Submission)
          </button>

          <div className="flex items-center gap-3">
            {isMismatch && (
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xs cursor-pointer transition-all"
              >
                <span>Proceed to Step 3: AP Exception Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {isMatched && (
              <button
                onClick={handlePushToDraftAp}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#101312] hover:bg-black shadow-xs cursor-pointer transition-all"
              >
                <span>Push to SAP Draft AP (Step 4)</span>
                <ArrowRight className="w-4 h-4 text-[#49D892]" />
              </button>
            )}

            {isFailedValidity && (
              <span className="text-xs font-bold text-red-700 px-4 py-2 rounded-full bg-red-50 border border-red-200">
                Invoice Journey Ended (Rejected)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-red-300">
            <div className="flex items-center gap-3 text-red-800 pb-3 border-b border-red-100">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Simulate Basic Validity Rejection Path</h3>
                <p className="text-xs text-red-700">Fails gateway check — ends invoice journey</p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <p>
                Per process specification, if an incoming invoice fails basic validity (e.g. invalid tax registration, duplicate invoice number, or unapproved BP master), it triggers the <strong>Rejection Path</strong>: status changes to "Rejected — returned to Supplier/AP" with mandatory reason, preventing any SAP document creation.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Rejection Reason (Visible to Supplier) *
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Confirm Rejection & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
