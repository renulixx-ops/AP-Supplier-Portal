import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  Layers,
  Building,
} from 'lucide-react';

export const Step4DraftApInSap: React.FC = () => {
  const { invoices, setCurrentStep, setActiveTab } = useApp();

  const draftApInvoices = invoices.filter(
    (i) =>
      i.status === 'Draft AP in SAP' ||
      i.status === 'In Payment Proposal' ||
      i.status.includes('Approval') ||
      i.status.includes('Bank') ||
      i.status === 'Posted PV' ||
      i.status === 'Paid'
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
                Stage 4 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Automated Draft A/P Invoice Ingestion in SAP Business One
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Upon successful 3-way match validation (or AP exception resolution), the portal automatically invokes the <strong>SAP Business One Service Layer / DI-API</strong> to create a <strong>Draft A/P Invoice</strong> document. Zero manual re-keying required.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('sap_zone')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#101312] hover:bg-black transition-all cursor-pointer shadow-sm"
          >
            <Database className="w-4 h-4 text-[#49D892]" />
            <span>Open in Full SAP B1 Client</span>
          </button>
        </div>
      </div>

      {/* SAP Business One Ingestion Viewport */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        {/* SAP Classic Top Bar */}
        <div className="bg-[#1b365d] px-4 py-2 text-white flex flex-wrap items-center justify-between border-b border-blue-900 text-xs gap-2">
          <div className="flex items-center gap-2 font-mono min-w-0">
            <span className="font-bold text-blue-200 shrink-0">SAP Business One 10.0 FP 2208</span>
            <span className="text-blue-400 shrink-0">|</span>
            <span className="text-slate-200 truncate">Company: PETRO-LOGISTICS MALAYSIA SDN BHD</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-blue-200 shrink-0">
            <span className="shrink-0">Server: PRD-SAP-SQL01</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              DI-API Connected
            </span>
          </div>
        </div>

        {/* SAP Document Grid */}
        <div className="p-4 bg-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-xs flex-wrap gap-2">
            <span className="font-bold text-slate-200 truncate">
              Purchasing - A/P &gt; A/P Invoice (Drafts Repository)
            </span>
            <span className="text-slate-400 text-[11px] whitespace-nowrap shrink-0">
              Showing {draftApInvoices.length} synced draft records
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-left text-xs text-slate-300 min-w-[760px]">
              <thead className="bg-[#24436f] text-slate-100 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">SAP Draft Doc#</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Vendor / BP Code</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Vendor Name</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Portal Ref</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Amount (RM)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Due Date</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Payment Cycle</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">SAP Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 bg-slate-800/50 font-mono text-[11px]">
                {draftApInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-700/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-amber-300 whitespace-nowrap">
                      {inv.sapDraftApDocNum || 'AP-DRF-4029'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{inv.supplierBpCode}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white max-w-[220px] truncate">
                      {inv.supplierName}
                    </td>
                    <td className="py-2.5 px-3 text-teal-400 font-bold whitespace-nowrap">{inv.id}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                      {inv.amountRM.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300 whitespace-nowrap">{inv.paymentType}</td>
                    <td className="py-2.5 px-3 font-sans whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        Draft AP Ingested
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 px-6 py-4 flex items-center justify-between shadow-xs">
        <button
          onClick={() => setCurrentStep(3)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          ← Back to Exception Queue (Step 3)
        </button>

        <button
          onClick={() => setCurrentStep(5)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#101312] hover:bg-black shadow-xs transition-all cursor-pointer"
        >
          <span>Next: Step 5 (Draft AP Sits in SAP)</span>
          <ArrowRight className="w-4 h-4 text-[#49D892]" />
        </button>
      </div>
    </div>
  );
};
