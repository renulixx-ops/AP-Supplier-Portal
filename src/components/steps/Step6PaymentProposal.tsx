import React from 'react';
import { useApp } from '../../context/AppContext';
import { OpenQuestionBanner } from '../OpenQuestionsModal';
import {
  Layers,
  ArrowRight,
  Clock,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  Calendar,
  Flame,
  Shield,
} from 'lucide-react';

export const Step6PaymentProposal: React.FC = () => {
  const { invoices, openQuestions, setOpenQuestions, setCurrentStep } = useApp();

  // Invoices eligible for payment proposal
  const proposalInvoices = invoices.filter(
    (i) =>
      i.status === 'In Payment Proposal' ||
      i.status.includes('Approval') ||
      i.status === 'Draft AP in SAP' ||
      i.isOffCycleUrgent
  );

  const totalProposalRM = proposalInvoices.reduce((sum, i) => sum + i.amountRM, 0);

  // Split by LOA Bands if toggle is active
  const band1 = proposalInvoices.filter((i) => i.loaBand.includes('Band 1'));
  const band2 = proposalInvoices.filter((i) => i.loaBand.includes('Band 2'));
  const band3 = proposalInvoices.filter((i) => i.loaBand.includes('Band 3'));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#183426]/10 text-[#183426] tracking-wider uppercase">
                Stage 6 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Treasury Payment Proposal Generation
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Consolidates matched supplier invoices, regular weekly payments, and approved off-cycle requisitions into an executable payment listing batch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep(7)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-[#101312] bg-[#49D892] hover:bg-[#3ec482] shadow-xs cursor-pointer transition-all"
            >
              <span>Submit Listing for Approval (Step 7)</span>
              <ArrowRight className="w-4 h-4 text-[#183426]" />
            </button>
          </div>
        </div>
      </div>

      {/* Open Question 1 Callout: LOA Bands */}
      <OpenQuestionBanner
        stepTitle="Step 6 Limit of Authority"
        question="Do the 3 Limit of Authority bands (RM1–30k / RM31k–100k / Above RM100k) still apply, or is this replaced by a single Manager view?"
        note="Click toggle to test whether the proposal should group by LOA tiers or display a flat consolidated listing."
        actionButton={
          <button
            onClick={() =>
              setOpenQuestions((prev) => ({
                ...prev,
                showLoaBands: !prev.showLoaBands,
              }))
            }
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              openQuestions.showLoaBands
                ? 'bg-teal-700 text-white'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
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
                <span>Single Flat Listing</span>
              </>
            )}
          </button>
        }
      />

      {/* Open Question 5 Callout: Friday Cut-Off */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <span className="p-1 rounded bg-blue-200 text-blue-900 mt-0.5 shrink-0">
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider">
                Workshop Open Question • Friday Cut-off Definition
              </span>
            </div>
            <p className="font-semibold text-slate-900 mt-0.5">
              Unconfirmed whether this is a submission deadline or a payment-run deadline.
            </p>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Current workshop selection: <strong>{openQuestions.fridayCutoffInterpretation.replace('_', ' ').toUpperCase()}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-blue-200 self-end sm:self-center">
          <button
            onClick={() =>
              setOpenQuestions((prev) => ({
                ...prev,
                fridayCutoffInterpretation: 'submission_deadline',
              }))
            }
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              openQuestions.fridayCutoffInterpretation === 'submission_deadline'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submission Cut-Off
          </button>
          <button
            onClick={() =>
              setOpenQuestions((prev) => ({
                ...prev,
                fridayCutoffInterpretation: 'payment_run_deadline',
              }))
            }
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
              openQuestions.fridayCutoffInterpretation === 'payment_run_deadline'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Payment Run Deadline
          </button>
        </div>
      </div>

      {/* Friday Cut-off Countdown Indicator */}
      <div className="bg-[#101312] text-white rounded-2xl sm:rounded-3xl p-6 flex flex-wrap items-center justify-between gap-5 border border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#49D892]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Payment Cycle Run:</div>
            <div className="text-sm font-extrabold text-white flex items-center gap-2 mt-0.5">
              <span>Friday Cycle #38 (25-Sep-2026)</span>
              <span className="bg-[#49D892] text-[#101312] font-black text-[10px] px-2.5 py-0.5 rounded-full">
                2d 05h 14m Remaining
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 text-xs">
          <div>
            <span className="text-slate-400">Total Run Value:</span>
            <div className="text-lg font-mono font-extrabold text-[#49D892]">
              RM {totalProposalRM.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Proposed Invoices:</span>
            <div className="text-lg font-extrabold text-white">{proposalInvoices.length} Items</div>
          </div>
        </div>
      </div>

      {/* Proposal Listings: Either Grouped by 3 LOA Bands or Flat Consolidated */}
      {openQuestions.showLoaBands ? (
        <div className="space-y-6">
          {/* Band 1 */}
          <LoaBandTable
            bandName="LOA Band 1 (RM 1 - 30,000)"
            bandLimit="Authorized by Treasury Assistant / Manager Level"
            invoices={band1}
            badgeColor="bg-blue-100 text-blue-900 border-blue-200"
          />

          {/* Band 2 */}
          <LoaBandTable
            bandName="LOA Band 2 (RM 31,000 - 100,000)"
            bandLimit="Requires First-Layer Executive Review (COO)"
            invoices={band2}
            badgeColor="bg-indigo-100 text-indigo-900 border-indigo-200"
          />

          {/* Band 3 */}
          <LoaBandTable
            bandName="LOA Band 3 (Above RM 100,000)"
            bandLimit="Requires Dual Executive Sign-off (COO + Managing Director)"
            invoices={band3}
            badgeColor="bg-purple-100 text-purple-900 border-purple-200"
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#101312] uppercase tracking-wider">
              Consolidated Payment Proposal (Single Flat Listing Mode)
            </h3>
            <span className="text-xs text-slate-500">
              Total Outflow: <strong>RM {totalProposalRM.toLocaleString()}</strong>
            </span>
          </div>

          <ProposalTableItems invoices={proposalInvoices} />
        </div>
      )}
    </div>
  );
};

// Sub-table for each LOA band
const LoaBandTable: React.FC<{
  bandName: string;
  bandLimit: string;
  invoices: any[];
  badgeColor: string;
}> = ({ bandName, bandLimit, invoices, badgeColor }) => {
  const bandTotal = invoices.reduce((sum, i) => sum + i.amountRM, 0);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeColor}`}>
            {bandName}
          </span>
          <span className="text-xs text-slate-500 font-medium">{bandLimit}</span>
        </div>
        <div className="text-xs font-semibold text-slate-700">
          Subtotal ({invoices.length} items):{' '}
          <strong className="text-slate-900 font-mono">RM {bandTotal.toLocaleString()}</strong>
        </div>
      </div>

      <ProposalTableItems invoices={invoices} />
    </div>
  );
};

// Reusable rows
const ProposalTableItems: React.FC<{ invoices: any[] }> = ({ invoices }) => {
  if (invoices.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        No payment requests staged in this classification.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs min-w-[700px]">
        <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] border-b border-slate-200/80">
          <tr>
            <th className="py-3.5 px-5 whitespace-nowrap">Invoice ID</th>
            <th className="py-3.5 px-5 whitespace-nowrap">Supplier / Vendor</th>
            <th className="py-3.5 px-5 whitespace-nowrap">Payment Cycle</th>
            <th className="py-3.5 px-5 whitespace-nowrap">Due Date / Cut-off</th>
            <th className="py-3.5 px-5 text-right whitespace-nowrap">Amount (RM)</th>
            <th className="py-3.5 px-5 whitespace-nowrap">Proposal Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.map((inv) => (
            <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3.5 px-5 font-mono font-bold text-slate-800 whitespace-nowrap">
                {inv.id}
                {inv.isOffCycleUrgent && (
                  <span className="ml-1.5 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold whitespace-nowrap shrink-0">
                    <Flame className="w-3 h-3 text-red-600 shrink-0" />
                    Off-Cycle
                  </span>
                )}
              </td>
              <td className="py-3.5 px-5">
                <div className="font-bold text-slate-900 max-w-[220px] truncate">{inv.supplierName}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 whitespace-nowrap">{inv.supplierBpCode}</div>
              </td>
              <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">{inv.paymentType}</td>
              <td className="py-3.5 px-5 whitespace-nowrap">
                <div className="text-slate-800 font-medium">{inv.dueDate}</div>
                {inv.paymentType === 'Weekly Payment' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#183426] bg-[#49D892]/20 px-2 py-0.5 rounded-full mt-0.5 whitespace-nowrap shrink-0">
                    <Clock className="w-2.5 h-2.5 shrink-0" />
                    Friday Run
                  </span>
                )}
              </td>
              <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                RM {inv.amountRM.toLocaleString()}
              </td>
              <td className="py-3.5 px-5 whitespace-nowrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap shrink-0">
                  {inv.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
