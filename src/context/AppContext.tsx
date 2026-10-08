import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Invoice,
  AuditLogItem,
  Persona,
  OpenQuestionsConfig,
  ChatMessage,
  PaymentType,
} from '../types';
import {
  INITIAL_INVOICES,
  INITIAL_AUDIT_LOGS,
  PERSONAS,
  getLoaBand,
} from '../data/mockData';

interface AppContextType {
  activePersona: Persona;
  setActivePersona: (persona: Persona) => void;
  isAuthenticated: boolean;
  login: (persona: Persona, password?: string) => boolean;
  logout: () => void;
  activeTab: 'flow' | 'persona_view' | 'sap_zone' | 'supplier_check';
  setActiveTab: (tab: 'flow' | 'persona_view' | 'sap_zone' | 'supplier_check') => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  invoices: Invoice[];
  auditLogs: AuditLogItem[];
  openQuestions: OpenQuestionsConfig;
  setOpenQuestions: React.Dispatch<React.SetStateAction<OpenQuestionsConfig>>;
  isQuestionsModalOpen: boolean;
  setIsQuestionsModalOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  isChatLoading: boolean;
  
  // Actions
  addNewInvoice: (newInv: Omit<Invoice, 'id' | 'loaBand' | 'matchResult' | 'submittedAt'> & { id?: string }, candidateType?: string) => Invoice;
  resolveException: (invoiceId: string, note: string) => void;
  querySupplier: (invoiceId: string) => void;
  rejectInvoice: (invoiceId: string, reason: string) => void;
  sendViaManualCheck: (invoiceId: string, notes: string) => void;
  requestOffCyclePayment: (invoiceId: string, reason: string) => void;
  pushToDraftAP: (invoiceId: string) => void;
  createPaymentProposalBatch: () => void;
  approveInvoice: (invoiceId: string, comment?: string) => void;
  rejectApproval: (invoiceId: string, reason: string) => void;
  simulateBankTransmission: (invoiceId: string, outcome: 'Approved' | 'Declined', customReason?: string) => void;
  postPaymentVoucherInSAP: (invoiceId: string) => void;
  markInvoicePaid: (invoiceId: string) => void;
  resetDemoData: () => void;
  selectedInvoiceForDetail: Invoice | null;
  setSelectedInvoiceForDetail: (inv: Invoice | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_OPEN_QUESTIONS: OpenQuestionsConfig = {
  showLoaBands: true,
  approvalPath: 'two_layer',
  bankPortalEnabled: true,
  fridayCutoffInterpretation: 'submission_deadline',
};

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'c-init',
    sender: 'assistant',
    text: 'Hello, I am your SAP Business One Treasury Assistant. I can look up live status, pending approvals, Friday cut-off items, and LOA exposure directly from our active in-memory ledger. Ask me any question!',
    timestamp: 'Just now',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersona, setActivePersona] = useState<Persona>(() => {
    const saved = sessionStorage.getItem('ap_portal_active_persona');
    return (saved as Persona) || 'treasury_assistant';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('ap_portal_authenticated');
    // Default to true for convenient initial presentation, but can logout to enter full premium gate
    return saved !== null ? saved === 'true' : true;
  });
  const [activeTab, setActiveTab] = useState<'flow' | 'persona_view' | 'sap_zone' | 'supplier_check'>('flow');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = sessionStorage.getItem('ap_portal_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = sessionStorage.getItem('ap_portal_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [openQuestions, setOpenQuestions] = useState<OpenQuestionsConfig>(() => {
    const saved = sessionStorage.getItem('ap_portal_oq');
    return saved ? JSON.parse(saved) : INITIAL_OPEN_QUESTIONS;
  });
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<Invoice | null>(null);

  // Sync to session storage for smooth testing
  useEffect(() => {
    sessionStorage.setItem('ap_portal_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    sessionStorage.setItem('ap_portal_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    sessionStorage.setItem('ap_portal_oq', JSON.stringify(openQuestions));
  }, [openQuestions]);

  const addAuditLog = (
    action: string,
    details: string,
    category: AuditLogItem['category'],
    invoiceId?: string
  ) => {
    const persona = PERSONAS[activePersona];
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: `Today ${timeStr}`,
      personaName: persona ? persona.name : 'System User',
      personaRole: persona ? persona.role : 'User',
      action,
      invoiceId,
      details,
      category,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNewInvoice = (
    invData: Omit<Invoice, 'id' | 'loaBand' | 'matchResult' | 'submittedAt'> & { id?: string },
    candidateType?: string
  ): Invoice => {
    const nextNum = 1040 + invoices.length + 1;
    const invId = invData.id?.trim() || `INV-${nextNum}`;
    const loa = getLoaBand(invData.amountRM);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    let matchStatus: 'Matched' | 'Mismatch' | 'Failed Validity' = 'Matched';
    let mismatchDetails = '';
    let validityDetails = '';
    let initialStatus: Invoice['status'] = 'Matched';

    if (candidateType === 'invalid_reject' || invData.taxId.includes('INVALID')) {
      matchStatus = 'Failed Validity';
      validityDetails = 'Supplier Tax ID / TIN failed Malaysian Inland Revenue Board (LHDN) schema verification.';
      initialStatus = 'Rejected';
    } else if (candidateType === 'mismatch') {
      matchStatus = 'Mismatch';
      mismatchDetails = `Quantity variance detected: Invoiced quantity exceeds GRPO receiving quantity by ${Math.round(invData.amountRM * 0.15)} RM.`;
      initialStatus = 'Mismatch (Exception)';
    }

    const created: Invoice = {
      ...invData,
      id: invId,
      loaBand: loa,
      status: initialStatus,
      submittedAt: `${dateStr} ${timeStr}`,
      items: invData.items || [
        {
          itemCode: 'GEN-SUP-01',
          description: 'Standard Contract Supplies & Consumables',
          poQty: 10,
          poUnitPrice: invData.amountRM / 10,
          invoiceQty: candidateType === 'mismatch' ? 12 : 10,
          invoiceUnitPrice: invData.amountRM / 10,
          grpoQty: 10,
        },
      ],
      matchResult: {
        status: matchStatus,
        poMatched: matchStatus !== 'Failed Validity',
        grpoMatched: matchStatus === 'Matched',
        priceMatched: true,
        qtyMatched: matchStatus !== 'Mismatch',
        varianceAmountRM: matchStatus === 'Mismatch' ? Math.round(invData.amountRM * 0.15) : 0,
        mismatchDetails,
        validityDetails,
      },
    };

    if (initialStatus === 'Rejected') {
      created.rejectionReason = validityDetails;
      created.rejectedAt = `${dateStr} ${timeStr}`;
    }

    setInvoices((prev) => [created, ...prev]);
    setSelectedInvoiceForDetail(created);
    addAuditLog(
      'Invoice Submitted',
      `Submitted ${invId} (${invData.supplierName}, RM ${invData.amountRM.toLocaleString()}). 3-Way match outcome: ${matchStatus}.`,
      'MATCH',
      invId
    );

    return created;
  };

  const resolveException = (invoiceId: string, note: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Draft AP in SAP',
            exceptionResolved: true,
            exceptionResolutionNote: note || 'Resolved by AP Reviewer: Supplier acknowledged credit note adjustment.',
            matchResult: {
              ...inv.matchResult,
              status: 'Matched',
              grpoMatched: true,
              qtyMatched: true,
            },
            sapDraftApDocNum: inv.sapDraftApDocNum || `AP-DRF-${Date.now().toString().slice(-4)}`,
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Exception Resolved',
      `AP Reviewer resolved variance on ${invoiceId}. Posted to SAP Draft AP. Note: ${note}`,
      'SAP',
      invoiceId
    );
  };

  const querySupplier = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, supplierQueried: true } : inv
      )
    );
    addAuditLog(
      'Supplier Queried',
      `System notification & email query dispatched to supplier for ${invoiceId} requesting delivery order clarification.`,
      'MATCH',
      invoiceId
    );
  };

  const rejectInvoice = (invoiceId: string, reason: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Rejected',
            rejectionReason: reason || 'Validity criteria failed: Incomplete tax data / unapproved supplier BP code.',
            rejectedAt: timeStr,
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Invoice Rejected',
      `Invoice ${invoiceId} returned to Supplier/AP. Reason: ${reason}`,
      'MATCH',
      invoiceId
    );
  };

  const sendViaManualCheck = (invoiceId: string, notes: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const pvNum = `PV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Posted PV',
            isManualCheckBypass: true,
            manualCheckNotes: notes || 'Weekly Payment manual check bypass executed per site cash emergency protocol.',
            sapDraftApDocNum: `AP-MAN-${inv.id.replace('INV-', '')}`,
            sapPvDocNum: pvNum,
            sapPostedDate: dateStr,
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Manual Check Path Triggered',
      `⚡ BYPASS: ${invoiceId} skipped listing, approval & bank portal directly to SAP Posted PV (${pvNum}). Reason: ${notes}`,
      'MANUAL_CHECK',
      invoiceId
    );
  };

  const requestOffCyclePayment = (invoiceId: string, reason: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            isOffCycleUrgent: true,
            offCycleReason: reason,
            status: 'Pending First Approval (COO)',
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Off-Cycle Request Flagged',
      `🚨 Off-cycle urgent payment requested for ${invoiceId}: "${reason}". Bypasses Friday cycle wait; routes immediately to 2-layer approval.`,
      'OFF_CYCLE',
      invoiceId
    );
  };

  const pushToDraftAP = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Draft AP in SAP',
            sapDraftApDocNum: inv.sapDraftApDocNum || `AP-DRF-${Date.now().toString().slice(-4)}`,
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Draft AP Pushed to SAP',
      `Draft AP document created in SAP B1 for ${invoiceId}. Ready for payment proposal cycle.`,
      'SAP',
      invoiceId
    );
  };

  const createPaymentProposalBatch = () => {
    let count = 0;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.status === 'Draft AP in SAP' || inv.status === 'Matched') {
          count++;
          return {
            ...inv,
            status: 'In Payment Proposal',
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Payment Proposal Batch Generated',
      `Assembled ${count} matched invoices into upcoming payment proposal run.`,
      'PROPOSAL'
    );
  };

  const approveInvoice = (invoiceId: string, comment?: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          if (openQuestions.approvalPath === 'single_manager') {
            // Path A: Single manager approval
            const nextStatus: Invoice['status'] = openQuestions.bankPortalEnabled ? 'Bank Processing' : 'Draft AP in SAP';
            return {
              ...inv,
              managerApproved: true,
              managerApprovedAt: timeStr,
              status: nextStatus,
            };
          } else {
            // Path B: Two-layer COO -> Director
            if (activePersona === 'coo' || !inv.cooApproved) {
              return {
                ...inv,
                cooApproved: true,
                cooApprovedAt: timeStr,
                cooComments: comment || 'Approved by COO. Verified budget allocation.',
                status: 'Pending Final Approval (Director)',
              };
            } else {
              // Director approving
              const nextStatus: Invoice['status'] = openQuestions.bankPortalEnabled ? 'Bank Processing' : 'Draft AP in SAP';
              return {
                ...inv,
                directorApproved: true,
                directorApprovedAt: timeStr,
                directorComments: comment || 'Signed off by Managing Director. Released for disbursement.',
                status: nextStatus,
              };
            }
          }
        }
        return inv;
      })
    );

    const stepName = openQuestions.approvalPath === 'single_manager'
      ? 'Manager'
      : activePersona === 'director' ? 'Director (Final)' : 'COO (First-Layer)';

    addAuditLog(
      `Approval Signed (${stepName})`,
      `${stepName} approved payment for ${invoiceId}. Note: ${comment || 'No remarks provided.'}`,
      'APPROVAL',
      invoiceId
    );
  };

  const rejectApproval = (invoiceId: string, reason: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Rejected',
            rejectionReason: `Rejected during executive sign-off: ${reason}`,
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Approval Rejected',
      `Payment proposal rejected for ${invoiceId}: ${reason}`,
      'APPROVAL',
      invoiceId
    );
  };

  const simulateBankTransmission = (
    invoiceId: string,
    outcome: 'Approved' | 'Declined',
    customReason?: string
  ) => {
    const batchRef = `MBB-EPAY-${Date.now().toString().slice(-6)}`;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          if (outcome === 'Approved') {
            return {
              ...inv,
              status: 'Bank Approved',
              bankStatus: 'Approved',
              bankBatchRef: batchRef,
            };
          } else {
            return {
              ...inv,
              status: 'Bank Declined',
              bankStatus: 'Declined',
              bankDeclineReason:
                customReason ||
                'Beneficiary bank account number failed checksum validation. Returned to Treasury Assistant (Syafiqah) for correction.',
              bankBatchRef: batchRef,
            };
          }
        }
        return inv;
      })
    );

    if (outcome === 'Approved') {
      addAuditLog(
        'Bank Portal Clearance',
        `Batch ${batchRef} cleared bank gateway for ${invoiceId}. Ready for SAP Payment Voucher posting.`,
        'BANK',
        invoiceId
      );
    } else {
      addAuditLog(
        'Bank Portal Rejection',
        `⚠️ Bank declined payment for ${invoiceId} (Batch: ${batchRef}). Returned to Syafiqah's queue for re-verification.`,
        'BANK',
        invoiceId
      );
    }
  };

  const postPaymentVoucherInSAP = (invoiceId: string) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const pvNumber = `PV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Posted PV',
            sapPvDocNum: pvNumber,
            sapPostedDate: dateStr,
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Payment Voucher Posted in SAP',
      `Official SAP Payment Voucher generated: ${pvNumber} for ${invoiceId}. Accounting ledger and vendor balance updated.`,
      'SAP',
      invoiceId
    );
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Paid',
          };
        }
        return inv;
      })
    );
    addAuditLog(
      'Payment Dispatched to Supplier',
      `Funds transferred for ${invoiceId}. Remittance advice issued to supplier.`,
      'BANK',
      invoiceId
    );
  };

  const resetDemoData = () => {
    setInvoices(INITIAL_INVOICES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setOpenQuestions(INITIAL_OPEN_QUESTIONS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setCurrentStep(1);
    addAuditLog('Demo State Reset', 'Restored all seed data and scenario flags to workshop baseline.', 'SAP');
  };

  // Real SAP B1 & Treasury AI Copilot grounded in the live in-memory ledger
  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            invoices,
            auditLogs,
            activePersona,
            openQuestions,
            selectedInvoiceForDetail,
            currentStep,
            activeTab,
          },
          history: chatMessages.slice(-8).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || 'Query processed against SAP Business One ledger.';
        const matchedInvoices = (reply.match(/INV-\d{4}/gi) || []).map((id: string) => id.toUpperCase());
        const uniqueRefs = Array.from(new Set(matchedInvoices)) as string[];

        const botMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: reply,
          timestamp: 'Just now',
          referencedInvoices: uniqueRefs.length > 0 ? uniqueRefs : undefined,
          source: data.source || 'Gemini 3.8 Flash (Live Grounded)',
        };
        setChatMessages((prev) => [...prev, botMsg]);
        setIsChatLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Chat API fetch failed, using direct ledger engine fallback:', err);
    }

    // Dynamic ledger fallback computed live from actual state
    const q = text.toLowerCase().trim();
    let reply = '';
    const referenced: string[] = [];

    const matchInv = q.match(/inv-\d{4}/i);
    if (matchInv) {
      const invId = matchInv[0].toUpperCase();
      const found = invoices.find((i) => i.id === invId);
      if (found) {
        referenced.push(found.id);
        reply = `**Invoice ${found.id} Record (${found.supplierName}):**\n• Status: ${found.status}\n• Amount: RM ${found.amountRM.toLocaleString()}\n• Payment Type: ${found.paymentType} (${found.loaBand})\n• 3-Way Match: ${found.matchResult?.status || 'Verified'}\n• SAP Draft AP: ${found.sapDraftApDocNum || 'None'}\n• SAP Payment Voucher: ${found.sapPvDocNum || 'Not yet posted'}`;
        if (found.isOffCycleUrgent) reply += `\n• 🚨 Off-Cycle Reason: ${found.offCycleReason}`;
        if (found.isManualCheckBypass) reply += `\n• ⚡ Manual Check Note: ${found.manualCheckNotes}`;
        if (found.bankDeclineReason) reply += `\n• ⚠️ Bank Decline: ${found.bankDeclineReason}`;
        if (found.rejectionReason) reply += `\n• ❌ Rejection: ${found.rejectionReason}`;
      } else {
        reply = `I searched the live SAP Business One database and found no active record matching "${invId}".`;
      }
    } else if (q.includes('director') || (q.includes('pending') && q.includes('approval'))) {
      const pending = invoices.filter((i) => i.status === 'Pending Final Approval (Director)');
      const totalRM = pending.reduce((sum, i) => sum + i.amountRM, 0);
      referenced.push(...pending.map((i) => i.id));
      reply = `There are currently ${pending.length} payment proposal(s) awaiting Director sign-off, totaling RM ${totalRM.toLocaleString()}:\n` +
        pending.map((i) => `• ${i.id} - ${i.supplierName} (RM ${i.amountRM.toLocaleString()} - ${i.loaBand})`).join('\n');
    } else if (q.includes('total') || q.includes('cashflow') || q.includes('summary')) {
      const totalLedger = invoices.reduce((s, i) => s + i.amountRM, 0);
      const pendingApproval = invoices.filter((i) => i.status.includes('Approval') || i.status === 'In Payment Proposal');
      const paid = invoices.filter((i) => i.status === 'Paid');
      reply = `**Corporate Treasury Cashflow Snapshot:**\n• Total Invoices: ${invoices.length} records (RM ${totalLedger.toLocaleString()})\n• Pending Approval/Proposal: RM ${pendingApproval.reduce((s, i) => s + i.amountRM, 0).toLocaleString()}\n• Dispatched / Settled: RM ${paid.reduce((s, i) => s + i.amountRM, 0).toLocaleString()}\n• Unresolved Exceptions: ${invoices.filter((i) => i.status.includes('Mismatch')).length}`;
    } else {
      reply = `SAP Business One Gateway is active with ${invoices.length} live invoices loaded. Ask about specific invoices, vendor aging, LOA limits, or Friday weekly cut-off schedules.`;
    }

    const botMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: reply,
      timestamp: 'Just now',
      referencedInvoices: referenced.length > 0 ? referenced : undefined,
    };
    setChatMessages((prev) => [...prev, botMsg]);
    setIsChatLoading(false);
  };

  const login = (personaKey: Persona, password?: string): boolean => {
    setActivePersona(personaKey);
    setIsAuthenticated(true);
    sessionStorage.setItem('ap_portal_active_persona', personaKey);
    sessionStorage.setItem('ap_portal_authenticated', 'true');
    const p = PERSONAS[personaKey];
    addAuditLog(
      'User Authentication Success',
      `Authorized SSO login for ${p?.name || personaKey} (${p?.role || 'User'}). Security clearance verified.`,
      'APPROVAL'
    );
    return true;
  };

  const logout = () => {
    const p = PERSONAS[activePersona];
    addAuditLog(
      'User Logout',
      `Session terminated for ${p?.name || activePersona}. Cached credentials cleared.`,
      'APPROVAL'
    );
    setIsAuthenticated(false);
    sessionStorage.setItem('ap_portal_authenticated', 'false');
  };

  const handleSetActivePersona = (pKey: Persona) => {
    setActivePersona(pKey);
    sessionStorage.setItem('ap_portal_active_persona', pKey);
  };

  return (
    <AppContext.Provider
      value={{
        activePersona,
        setActivePersona: handleSetActivePersona,
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        currentStep,
        setCurrentStep,
        invoices,
        auditLogs,
        openQuestions,
        setOpenQuestions,
        isQuestionsModalOpen,
        setIsQuestionsModalOpen,
        isChatOpen,
        setIsChatOpen,
        isChatLoading,
        chatMessages,
        sendChatMessage,
        addNewInvoice,
        resolveException,
        querySupplier,
        rejectInvoice,
        sendViaManualCheck,
        requestOffCyclePayment,
        pushToDraftAP,
        createPaymentProposalBatch,
        approveInvoice,
        rejectApproval,
        simulateBankTransmission,
        postPaymentVoucherInSAP,
        markInvoicePaid,
        resetDemoData,
        selectedInvoiceForDetail,
        setSelectedInvoiceForDetail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
