import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';
import {
  Database,
  FileText,
  Receipt,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  ArrowUpRight,
  Printer,
  Copy,
  Layers,
  Building,
} from 'lucide-react';

export const SapBusinessOneZone: React.FC = () => {
  const { invoices, setIsChatOpen, postPaymentVoucherInSAP } = useApp();

  const [selectedModule, setSelectedModule] = useState<'draft_ap' | 'payment_vouchers' | 'financials'>('draft_ap');
  const [selectedDoc, setSelectedDoc] = useState<Invoice | null>(invoices[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lists
  const draftApList = invoices.filter(
    (i) =>
      i.status === 'Draft AP in SAP' ||
      i.status === 'In Payment Proposal' ||
      i.status.includes('Approval') ||
      i.status.includes('Bank') ||
      i.status === 'Posted PV' ||
      i.status === 'Paid'
  );

  const pvList = invoices.filter(
    (i) =>
      i.status === 'Posted PV' ||
      i.status === 'Paid' ||
      i.status === 'Bank Approved' ||
      i.isManualCheckBypass
  );

  const filteredDrafts = draftApList.filter(
    (d) =>
      d.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.sapDraftApDocNum && d.sapDraftApDocNum.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPVs = pvList.filter(
    (p) =>
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sapPvDocNum && p.sapPvDocNum.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-[#10243e] text-slate-100 rounded-3xl shadow-xl border border-blue-900/60 overflow-hidden font-sans">
      {/* Top SAP Classic Titlebar */}
      <div className="bg-[#1b365d] px-6 py-3.5 flex items-center justify-between border-b border-blue-800 text-xs select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <span className="font-extrabold text-white tracking-wide">
            SAP Business One 10.0 (Enterprise Gateway)
          </span>
          <span className="text-blue-400/60">|</span>
          <span className="text-blue-200 font-mono text-[11px]">Database: PETRO_SBO_MY</span>
        </div>

        <div className="flex items-center gap-3.5 text-xs text-blue-200">
          <span className="font-medium text-slate-300">User: <strong className="text-white">manager</strong></span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            DI-API Connected
          </span>
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/80 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer shadow-xs text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-200" />
            <span>Launch SAP Assistant</span>
          </button>
        </div>
      </div>

      {/* Classic Menu Toolbar */}
      <div className="bg-[#24436f] px-3 py-1 border-b border-blue-900 flex items-center justify-between text-[11px] text-slate-200">
        <div className="flex items-center gap-4">
          <span className="hover:text-white cursor-pointer">File</span>
          <span className="hover:text-white cursor-pointer">Edit</span>
          <span className="hover:text-white cursor-pointer">View</span>
          <span className="hover:text-white cursor-pointer font-bold text-amber-300">Modules</span>
          <span className="hover:text-white cursor-pointer">Purchasing</span>
          <span className="hover:text-white cursor-pointer">Banking</span>
          <span className="hover:text-white cursor-pointer">Tools</span>
          <span className="hover:text-white cursor-pointer">Help</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-300 font-mono text-[10px]">Session ID: SBO-202609-88</span>
        </div>
      </div>

      {/* Main Workspace: Left Module Tree + Right Table Grid & Document Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-[580px]">
        {/* Left Module Tree */}
        <div className="bg-[#142845] border-r border-blue-900 p-3 text-xs select-none">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 px-2 py-1 mb-2">
            SAP Main Modules
          </div>

          <div className="space-y-1">
            {/* Purchasing - A/P */}
            <div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 text-blue-200 hover:text-white font-semibold rounded cursor-pointer">
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Purchasing - A/P</span>
              </div>
              <div className="pl-6 space-y-0.5 mt-0.5">
                <button
                  onClick={() => setSelectedModule('draft_ap')}
                  className={`w-full text-left px-2 py-1 rounded flex items-center justify-between text-[11px] transition-colors cursor-pointer ${
                    selectedModule === 'draft_ap'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-blue-900/50'
                  }`}
                >
                  <span>Draft A/P Invoices</span>
                  <span className="bg-blue-900 px-1.5 py-0.2 rounded text-[10px] text-blue-200">
                    {draftApList.length}
                  </span>
                </button>
                <div className="text-slate-400 px-2 py-1 text-[11px] opacity-70">
                  Purchase Orders (PO)
                </div>
                <div className="text-slate-400 px-2 py-1 text-[11px] opacity-70">
                  Goods Receipt PO (GRPO)
                </div>
                <div className="text-slate-400 px-2 py-1 text-[11px] opacity-70">
                  A/P Credit Memos
                </div>
              </div>
            </div>

            {/* Banking */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 px-2 py-1.5 text-blue-200 hover:text-white font-semibold rounded cursor-pointer">
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Banking</span>
              </div>
              <div className="pl-6 space-y-0.5 mt-0.5">
                <button
                  onClick={() => setSelectedModule('payment_vouchers')}
                  className={`w-full text-left px-2 py-1 rounded flex items-center justify-between text-[11px] transition-colors cursor-pointer ${
                    selectedModule === 'payment_vouchers'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-blue-900/50'
                  }`}
                >
                  <span>Outgoing Payments (PV)</span>
                  <span className="bg-blue-900 px-1.5 py-0.2 rounded text-[10px] text-blue-200">
                    {pvList.length}
                  </span>
                </button>
                <div className="text-slate-400 px-2 py-1 text-[11px] opacity-70">
                  Payment Wizard Runs
                </div>
                <div className="text-slate-400 px-2 py-1 text-[11px] opacity-70">
                  Bank Statements Recon
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 px-2 py-1.5 text-blue-200 hover:text-white font-semibold rounded cursor-pointer">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Financials & GL</span>
              </div>
              <div className="pl-6 space-y-0.5 mt-0.5">
                <button
                  onClick={() => setSelectedModule('financials')}
                  className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                    selectedModule === 'financials'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-blue-900/50'
                  }`}
                >
                  Chart of Accounts & Ledgers
                </button>
              </div>
            </div>

            {/* Business Partners */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 px-2 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Business Partners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-3 bg-[#0d1d32] p-4 flex flex-col justify-between">
          <div>
            {/* Action & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-blue-900 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {selectedModule === 'draft_ap'
                    ? 'Purchasing - A/P > Draft A/P Invoices'
                    : selectedModule === 'payment_vouchers'
                    ? 'Banking > Outgoing Payments (Payment Vouchers)'
                    : 'Financials > General Ledger Postings'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Filter records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1 text-xs bg-slate-900 border border-blue-800 rounded-md text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Table Representation */}
            {selectedModule === 'draft_ap' && (
              <div className="overflow-x-auto rounded-lg border border-blue-900">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-[#1b365d] text-blue-200 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 whitespace-nowrap">SAP Doc#</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Portal Ref</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">BP Code</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Vendor Name</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Doc Total (RM)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Due Date</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-950 font-mono text-[11px]">
                    {filteredDrafts.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => setSelectedDoc(inv)}
                        className={`cursor-pointer transition-colors ${
                          selectedDoc?.id === inv.id
                            ? 'bg-blue-900/60 text-white'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <td className="py-2 px-3 font-bold text-amber-300 whitespace-nowrap">
                          {inv.sapDraftApDocNum || 'AP-DRF-4029'}
                        </td>
                        <td className="py-2 px-3 text-teal-300 font-bold whitespace-nowrap">{inv.id}</td>
                        <td className="py-2 px-3 whitespace-nowrap">{inv.supplierBpCode}</td>
                        <td className="py-2 px-3 font-sans font-medium text-white max-w-[200px] truncate">
                          {inv.supplierName}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                          {inv.amountRM.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">{inv.dueDate}</td>
                        <td className="py-2 px-3 font-sans whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 whitespace-nowrap">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoc(inv);
                            }}
                            className="text-[10px] text-blue-300 hover:text-white underline cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedModule === 'payment_vouchers' && (
              <div className="overflow-x-auto rounded-lg border border-blue-900">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-[#1b365d] text-blue-200 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 whitespace-nowrap">PV Doc#</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Invoice Ref</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Vendor Name</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">Payment RM</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Posting Date</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">PV Status</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Ledger Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-950 font-mono text-[11px]">
                    {filteredPVs.map((inv) => {
                      const isPosted = !!inv.sapPvDocNum || inv.status === 'Posted PV' || inv.status === 'Paid';

                      return (
                        <tr
                          key={inv.id}
                          onClick={() => setSelectedDoc(inv)}
                          className={`cursor-pointer transition-colors ${
                            selectedDoc?.id === inv.id
                              ? 'bg-blue-900/60 text-white'
                              : 'hover:bg-slate-800/60 text-slate-300'
                          }`}
                        >
                          <td className="py-2 px-3 font-bold text-amber-300 whitespace-nowrap">
                            {inv.sapPvDocNum || 'Draft PV'}
                          </td>
                          <td className="py-2 px-3 text-teal-300 whitespace-nowrap">{inv.id}</td>
                          <td className="py-2 px-3 font-sans font-medium text-white max-w-[200px] truncate">
                            {inv.supplierName}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                            {inv.amountRM.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">{inv.sapPostedDate || 'Staged'}</td>
                          <td className="py-2 px-3 font-sans whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                                isPosted
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border-amber-800'
                              }`}
                            >
                              {isPosted ? 'Posted & Reconciled' : 'Staged for Outflow'}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-sans whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDoc(inv);
                              }}
                              className="text-[10px] text-blue-300 hover:text-white underline cursor-pointer"
                            >
                              View GL Posting
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {selectedModule === 'financials' && (
              <div className="p-4 bg-slate-900/60 rounded-xl border border-blue-900 text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-blue-900 pb-2">
                  <span className="font-bold text-white">Corporate General Ledger Chart of Accounts</span>
                  <span className="text-slate-400 font-mono text-[11px]">PETRO_COA_2026</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="font-bold text-emerald-400">2100-00 AP Trade Creditors</span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Current balance debited upon Payment Voucher issuance to reduce supplier liability.
                    </p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="font-bold text-blue-400">1110-10 Maybank Corporate Operating</span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Credited when corporate banking host executes automated disbursement batch.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Document Drill-Down Drawer */}
          {selectedDoc && (
            <div className="mt-4 bg-[#142845] border border-blue-800 rounded-xl p-4 text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-900">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">
                    SAP Document Drill-Down: {selectedDoc.id} ({selectedDoc.supplierName})
                  </span>
                </div>
                <span className="text-[10px] text-blue-300 font-mono">
                  BP Master Code: {selectedDoc.supplierBpCode}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-300 mb-3">
                <div>
                  <span className="text-slate-400 block">SAP Draft Doc#:</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {selectedDoc.sapDraftApDocNum || 'AP-DRF-4011'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Official SAP PV#:</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {selectedDoc.sapPvDocNum || 'Not yet posted'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">PO & GRPO:</span>
                  <span className="font-mono text-slate-200">
                    {selectedDoc.poNumber} / {selectedDoc.grpoNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tax ID / TIN:</span>
                  <span className="font-mono text-slate-200">{selectedDoc.taxId}</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded border border-blue-950 font-mono text-[10px] text-slate-300 flex items-center justify-between">
                <span>
                  Journal Impact: DR 2100-00 (AP Creditors) RM {selectedDoc.amountRM.toLocaleString()} | CR 1110-10 (Bank Account) RM {selectedDoc.amountRM.toLocaleString()}
                </span>
                <span className="text-emerald-400 font-bold">Balancing: RM 0.00</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
