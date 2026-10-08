import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpenQuestionBanner } from '../OpenQuestionsModal';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building,
  Flame,
  Clock,
  Layers,
} from 'lucide-react';

export const Step7Approval: React.FC = () => {
  const {
    invoices,
    openQuestions,
    setOpenQuestions,
    approveInvoice,
    rejectApproval,
    activePersona,
    setActivePersona,
    setCurrentStep,
  } = useApp();

  const [commentModalInvId, setCommentModalInvId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [modalActionType, setModalActionType] = useState<'approve' | 'reject'>('approve');

  // Filter queues depending on path
  const isTwoLayer = openQuestions.approvalPath === 'two_layer';

  // For Path B:
  // COO Queue: Needs COO approval
  const cooQueue = invoices.filter(
    (i) =>
      i.status === 'Pending First Approval (COO)' ||
      (i.status === 'In Payment Proposal' && !i.cooApproved)
  );

  // Director Queue: COO has approved, awaiting Director sign-off
  const directorQueue = invoices.filter(
    (i) =>
      i.status === 'Pending Final Approval (Director)' ||
      (i.cooApproved && !i.directorApproved && i.status !== 'Rejected' && i.status !== 'Paid')
  );

  // For Path A: Single manager queue
  const singleManagerQueue = invoices.filter(
    (i) =>
      i.status === 'In Payment Proposal' ||
      i.status.includes('Approval') ||
      (!i.managerApproved && !['Draft AP in SAP', 'Posted PV', 'Paid', 'Rejected'].includes(i.status))
  );

  const handleOpenActionModal = (invId: string, type: 'approve' | 'reject') => {
    setCommentModalInvId(invId);
    setModalActionType(type);
    if (type === 'approve') {
      setCommentText(
        activePersona === 'director'
          ? 'Approved for final disbursement. Verified against quarterly budget.'
          : 'Approved first-layer LOA. Line-item charges verified.'
      );
    } else {
      setCommentText('Requesting additional commercial clarification on delivery charges.');
    }
  };

  const handleConfirmAction = () => {
    if (commentModalInvId) {
      if (modalActionType === 'approve') {
        approveInvoice(commentModalInvId, commentText);
      } else {
        rejectApproval(commentModalInvId, commentText);
      }
      setCommentModalInvId(null);
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
                Stage 7 of 11
              </span>
              <h2 className="text-lg font-extrabold text-[#101312] tracking-tight">
                Payment Proposal Approval & Governance Sign-Off
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Electronic authorization of payment listings. Test how proposals flow under a <strong>Single Manager model (Path A)</strong> versus the <strong>Two-Layer COO → Director model (Path B)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(openQuestions.bankPortalEnabled ? 8 : 9)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-[#101312] bg-[#49D892] hover:bg-[#3ec482] shadow-xs cursor-pointer transition-all"
            >
              <span>Proceed to {openQuestions.bankPortalEnabled ? 'Step 8 (Bank Portal)' : 'Step 9 (Post PV)'}</span>
              <ArrowRight className="w-4 h-4 text-[#183426]" />
            </button>
          </div>
        </div>
      </div>

      {/* Open Question 2 Banner */}
      <OpenQuestionBanner
        stepTitle="Step 7 Approval Governance"
        question="Does a single Manager approval replace today's two-layer COO → Directors sign-off, or does the two-layer rule still apply underneath it?"
        note="Switch paths below to test the routing workflow live in front of the Treasury and Executive stakeholders."
        actionButton={
          <div className="flex items-center gap-1 bg-amber-200/80 p-1 rounded-lg">
            <button
              onClick={() =>
                setOpenQuestions((prev) => ({
                  ...prev,
                  approvalPath: 'single_manager',
                }))
              }
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                !isTwoLayer
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-amber-300'
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
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                isTwoLayer
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-amber-950 hover:bg-amber-300'
              }`}
            >
              Path B: COO → Director (2-Layer)
            </button>
          </div>
        }
      />

      {/* Persona Context Reminder */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-teal-600" />
          <span>
            Currently reviewing as: <strong>{activePersona.replace('_', ' ').toUpperCase()}</strong>
          </span>
          {isTwoLayer && (
            <span className="text-slate-500">
              (COO handles Layer 1, Director handles Layer 2 sign-off)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Quick Persona Switch:</span>
          <button
            onClick={() => setActivePersona('coo')}
            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
              activePersona === 'coo' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-700'
            }`}
          >
            COO View
          </button>
          <button
            onClick={() => setActivePersona('director')}
            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
              activePersona === 'director' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
            }`}
          >
            Director View
          </button>
        </div>
      </div>

      {/* Approval View: Either Path A or Path B */}
      {isTwoLayer ? (
        /* Path B: Two-Layer Routing */
        <div className="space-y-6">
          {/* Layer 1: COO Approval Queue */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-900 tracking-wider">
                  LAYER 1 OF 2
                </span>
                <h3 className="text-sm font-extrabold text-[#101312]">
                  COO Approval Queue (First-Layer Review)
                </h3>
              </div>
              <span className="text-xs font-semibold text-indigo-900">
                {cooQueue.length} listings pending COO action
              </span>
            </div>

            <ApprovalList
              invoices={cooQueue}
              targetLayer="coo"
              onAction={handleOpenActionModal}
            />
          </div>

          {/* Layer 2: Director Final Approval Queue */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 tracking-wider">
                  LAYER 2 OF 2 (FINAL SIGN-OFF)
                </span>
                <h3 className="text-sm font-extrabold text-[#101312]">
                  Managing Director Approval Queue (Second-Layer Release)
                </h3>
              </div>
              <span className="text-xs font-semibold text-purple-900">
                {directorQueue.length} listings COO-approved & awaiting Director
              </span>
            </div>

            <ApprovalList
              invoices={directorQueue}
              targetLayer="director"
              onAction={handleOpenActionModal}
            />
          </div>
        </div>
      ) : (
        /* Path A: Single Manager Streamlined Approval */
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#49D892]/20 text-[#183426] tracking-wider">
                SINGLE MANAGER VIEW (PATH A)
              </span>
              <h3 className="text-sm font-extrabold text-[#101312]">
                Unified Payment Proposal Authorization
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#183426]">
              {singleManagerQueue.length} proposals ready for one-click release
            </span>
          </div>

          <ApprovalList
            invoices={singleManagerQueue}
            targetLayer="manager"
            onAction={handleOpenActionModal}
          />
        </div>
      )}

      {/* Action / Comment Modal */}
      {commentModalInvId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div
              className={`flex items-center gap-3 pb-4 border-b ${
                modalActionType === 'approve'
                  ? 'text-emerald-800 border-emerald-100'
                  : 'text-red-800 border-red-100'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  modalActionType === 'approve' ? 'bg-emerald-100' : 'bg-red-100'
                }`}
              >
                {modalActionType === 'approve' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-700" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#101312]">
                  {modalActionType === 'approve' ? 'Confirm Approval & Sign-Off' : 'Reject Proposal'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Invoice Reference: {commentModalInvId}</p>
              </div>
            </div>

            <div className="py-5 space-y-3.5 text-xs text-slate-600">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Executive Remarks / Decision Audit Trail
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#183426] outline-none"
                  placeholder="Enter notes or audit justification..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCommentModalInvId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2.5 text-xs font-bold text-white rounded-full cursor-pointer shadow-xs transition-all ${
                  modalActionType === 'approve'
                    ? 'bg-[#101312] hover:bg-black'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {modalActionType === 'approve' ? 'Authorize Payment' : 'Reject & Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable list component for approval items
const ApprovalList: React.FC<{
  invoices: any[];
  targetLayer: 'coo' | 'director' | 'manager';
  onAction: (id: string, type: 'approve' | 'reject') => void;
}> = ({ invoices, targetLayer, onAction }) => {
  if (invoices.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 bg-white">
        No payment proposals pending action in this queue.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 bg-white">
      {invoices.map((inv) => (
        <div
          key={inv.id}
          className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/70 transition-colors"
        >
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                {inv.id}
              </span>
              <span className="text-sm font-extrabold text-[#101312]">{inv.supplierName}</span>
              <span className="text-xs text-slate-400 font-mono">({inv.supplierBpCode})</span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap shrink-0 leading-none inline-flex items-center">
                {inv.loaBand}
              </span>
              {inv.isOffCycleUrgent && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 inline-flex items-center gap-1 whitespace-nowrap shrink-0 leading-none">
                  <Flame className="w-3 h-3 text-red-600 shrink-0" />
                  Urgent Off-Cycle
                </span>
              )}
            </div>

            {inv.offCycleReason && (
              <p className="text-xs text-red-800 bg-red-50 p-3 rounded-xl border border-red-200">
                <strong>Off-Cycle Emergency Justification:</strong> {inv.offCycleReason}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 pt-1">
              <div>
                <span className="text-slate-400">Payment Type:</span>{' '}
                <span className="font-medium text-slate-800">{inv.paymentType}</span>
              </div>
              <div>
                <span className="text-slate-400">PO Ref:</span>{' '}
                <span className="font-mono text-slate-800">{inv.poNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Due Date:</span>{' '}
                <span className="text-slate-800">{inv.dueDate}</span>
              </div>
              <div>
                <span className="text-slate-400">SAP Draft Doc:</span>{' '}
                <span className="font-mono text-[#183426] font-bold">{inv.sapDraftApDocNum || 'Draft AP'}</span>
              </div>
            </div>

            {inv.cooComments && (
              <div className="text-[11px] text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                <strong>Layer 1 Note (COO):</strong> {inv.cooComments}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="text-right sm:mr-2">
              <span className="text-lg font-mono font-extrabold text-[#101312]">
                RM {inv.amountRM.toLocaleString()}
              </span>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Net Outflow</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onAction(inv.id, 'approve')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#101312] hover:bg-black rounded-full shadow-xs transition-all cursor-pointer"
              >
                Approve & Sign
              </button>
              <button
                onClick={() => onAction(inv.id, 'reject')}
                className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-full cursor-pointer transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
