import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Building2,
  FileText,
  ShieldCheck,
  Receipt,
  HelpCircle,
} from 'lucide-react';

export const Step11SupplierStatusCheck: React.FC = () => {
  const { invoices } = useApp();
  const [query, setQuery] = useState('INV-1049');
  const [searchedId, setSearchedId] = useState('INV-1049');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(query.trim().toUpperCase());
  };

  const invoice = invoices.find((i) => i.id.toUpperCase() === searchedId);

  // Determine one of 4 specific statuses requested:
  // 1. Paid
  // 2. To be paid
  // 3. Not yet due
  // 4. No such invoice found
  let outcomeType: 'PAID' | 'TO_BE_PAID' | 'NOT_YET_DUE' | 'NOT_FOUND' = 'NOT_FOUND';

  if (invoice) {
    if (invoice.status === 'Paid') {
      outcomeType = 'PAID';
    } else if (
      invoice.status === 'Posted PV' ||
      invoice.status === 'Bank Approved' ||
      invoice.status === 'Bank Processing' ||
      invoice.status.includes('Approval') ||
      invoice.status === 'In Payment Proposal'
    ) {
      outcomeType = 'TO_BE_PAID';
    } else {
      // Draft AP in SAP or Matched or Submitted
      outcomeType = 'NOT_YET_DUE';
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
                Stage 11 of 11 · Vendor Self-Service
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Supplier Self-Service Invoice Status Tracking Portal
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Public self-service lookup portal for registered vendors. Inquiring vendors get instant visibility into their invoice status across 4 distinct payment milestones without calling Treasury.
            </p>
          </div>

          {/* Preset Buttons for Workshop */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Live Tests:
            </span>
            <button
              onClick={() => {
                setQuery('INV-1049');
                setSearchedId('INV-1049');
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#183426] font-bold border border-emerald-200/80 cursor-pointer shadow-2xs"
            >
              1. Paid (INV-1049)
            </button>
            <button
              onClick={() => {
                setQuery('INV-1042');
                setSearchedId('INV-1042');
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200/80 cursor-pointer shadow-2xs"
            >
              2. To be Paid (INV-1042)
            </button>
            <button
              onClick={() => {
                setQuery('INV-1050');
                setSearchedId('INV-1050');
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-amber-900 font-bold border border-amber-200/80 cursor-pointer shadow-2xs"
            >
              3. Not Yet Due (INV-1050)
            </button>
            <button
              onClick={() => {
                setQuery('INV-9999');
                setSearchedId('INV-9999');
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 text-rose-900 font-bold border border-rose-200/80 cursor-pointer shadow-2xs"
            >
              4. Not Found (INV-9999)
            </button>
          </div>
        </div>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden max-w-3xl mx-auto">
        <div className="bg-[#101312] text-white p-7 sm:p-8 text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-3.5 text-[#49D892]">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white">Petro-Logistics Malaysia Vendor Portal</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Check payment disbursement status, official Payment Voucher numbers, and estimated settlement dates.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Invoice Number (e.g. INV-1042)"
                className="w-full px-4 py-2.5 text-xs text-white bg-white/10 border border-white/20 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#49D892] placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#49D892] hover:bg-[#3ec482] text-[#101312] font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>
        </div>

        {/* Search Result Display */}
        <div className="p-6 sm:p-8">
          {/* Outcome 1: PAID */}
          {outcomeType === 'PAID' && invoice && (
            <div className="bg-[#183426]/5 border border-[#49D892]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#49D892]/20 text-[#183426] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#183426] bg-[#49D892]/20 px-3.5 py-1 rounded-full">
                  Status: Paid
                </span>
                <h4 className="text-lg font-extrabold text-[#101312] mt-2.5">
                  Payment Dispatched & Settled
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Funds for invoice <strong>{invoice.id}</strong> ({invoice.supplierName}) have been transferred via corporate electronic banking.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/90 text-xs text-left grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto shadow-2xs">
                <div>
                  <span className="text-slate-400 block">Amount Settled:</span>
                  <span className="font-extrabold text-[#183426] text-sm font-mono">
                    RM {invoice.amountRM.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">SAP PV Doc Number:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {invoice.sapPvDocNum || 'PV-2026-0812'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Settlement Date:</span>
                  <span className="font-semibold text-slate-800">
                    {invoice.sapPostedDate || '15-Sep-2026'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Bank Batch Ref:</span>
                  <span className="font-mono text-slate-700">
                    {invoice.bankBatchRef || 'MBB-PAY-9811'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Outcome 2: TO BE PAID */}
          {outcomeType === 'TO_BE_PAID' && invoice && (
            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 bg-blue-100 px-3.5 py-1 rounded-full">
                  Status: To be paid
                </span>
                <h4 className="text-lg font-extrabold text-[#101312] mt-2.5">
                  Scheduled in Active Payment Run
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Invoice <strong>{invoice.id}</strong> has completed 3-way matching and is scheduled for disbursement in the upcoming payment cycle.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-blue-200/80 text-xs text-left grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto shadow-2xs">
                <div>
                  <span className="text-slate-400 block">Approved Amount:</span>
                  <span className="font-extrabold text-blue-700 text-sm font-mono">
                    RM {invoice.amountRM.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Payment Cycle:</span>
                  <span className="font-semibold text-slate-800">{invoice.paymentType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Estimated Release:</span>
                  <span className="font-bold text-[#183426]">Friday (Upcoming Run)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Stage:</span>
                  <span className="text-slate-800 font-medium">{invoice.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* Outcome 3: NOT YET DUE */}
          {outcomeType === 'NOT_YET_DUE' && invoice && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full">
                  Status: Not yet due
                </span>
                <h4 className="text-lg font-extrabold text-[#101312] mt-2.5">
                  Invoice Logged in SAP — Awaiting Payment Term Maturity
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  Invoice <strong>{invoice.id}</strong> is verified and sits staged as a Draft AP in SAP Business One. It has not yet reached its contracted credit due date.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-amber-200/80 text-xs text-left grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto shadow-2xs">
                <div>
                  <span className="text-slate-400 block">Invoice Total:</span>
                  <span className="font-extrabold text-slate-900 font-mono">
                    RM {invoice.amountRM.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contract Due Date:</span>
                  <span className="font-bold text-amber-900">{invoice.dueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">SAP Draft Doc:</span>
                  <span className="font-mono text-slate-800">{invoice.sapDraftApDocNum || 'AP-DRF-4024'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">PO Reference:</span>
                  <span className="font-mono text-slate-700">{invoice.poNumber}</span>
                </div>
              </div>
            </div>
          )}

          {/* Outcome 4: NO SUCH INVOICE FOUND */}
          {outcomeType === 'NOT_FOUND' && (
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 bg-slate-200 px-3.5 py-1 rounded-full">
                  Status: No such invoice found
                </span>
                <h4 className="text-lg font-extrabold text-[#101312] mt-2.5">
                  No Invoice Record Registered for "{searchedId}"
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                  The invoice number entered does not match any ingested tax record in our financial system.
                </p>
              </div>

              {/* Mock Order Stage Detail */}
              <div className="bg-white rounded-xl p-4 border border-slate-200/90 text-xs text-left max-w-xl mx-auto space-y-2 shadow-2xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#183426]" />
                  <span>Procurement Order Stage Trace:</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Purchase Order <strong>PO-2026-8821</strong> was generated by Procurement, but no valid supplier invoice or Goods Receipt has been officially matched in the system yet.
                </p>
                <div className="text-[11px] text-[#183426] bg-[#49D892]/10 p-2.5 rounded-xl border border-[#49D892]/20">
                  <strong>Recommended Action:</strong> Please submit your structured invoice via Step 1 of the AP Portal or verify your invoice reference with your company's billing team.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
