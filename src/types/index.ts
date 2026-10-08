export type PaymentType = 'Weekly Payment' | 'Supplier Aging Payment (Monthly)';

export type LoaBand = 'Band 1 (RM 1 - 30,000)' | 'Band 2 (RM 31,000 - 100,000)' | 'Band 3 (Above RM 100,000)';

export type InvoiceStatus =
  | 'Submitted'
  | 'Matched'
  | 'Mismatch (Exception)'
  | 'Rejected'
  | 'Draft AP in SAP'
  | 'In Payment Proposal'
  | 'Pending First Approval (COO)'
  | 'Pending Final Approval (Director)'
  | 'Pending Manager Approval'
  | 'Approved'
  | 'Bank Processing'
  | 'Bank Approved'
  | 'Bank Declined'
  | 'Posted PV'
  | 'Paid';

export type Persona =
  | 'admin'
  | 'treasury_chief'
  | 'treasury_assistant'
  | 'coo'
  | 'director'
  | 'cfo';

export interface PersonaInfo {
  id: Persona;
  name: string;
  role: string;
  department: string;
  avatar: string;
  description: string;
  badgeColor: string;
  email: string;
  securityClearance: string;
  mfaEnabled: boolean;
}

export interface LineItem {
  itemCode: string;
  description: string;
  poQty: number;
  poUnitPrice: number;
  invoiceQty: number;
  invoiceUnitPrice: number;
  grpoQty: number;
}

export interface ThreeWayMatchResult {
  status: 'Matched' | 'Mismatch' | 'Failed Validity';
  poMatched: boolean;
  grpoMatched: boolean;
  priceMatched: boolean;
  qtyMatched: boolean;
  varianceAmountRM: number;
  mismatchDetails?: string;
  validityDetails?: string;
}

export interface Invoice {
  id: string; // e.g. "INV-1042"
  supplierName: string;
  supplierBpCode: string; // e.g. "V10042"
  poNumber: string; // e.g. "PO-2026-9021"
  grpoNumber: string; // e.g. "GRPO-8821"
  taxId: string; // SST / TIN
  invoiceDate: string;
  dueDate: string;
  amountRM: number;
  paymentType: PaymentType;
  loaBand: LoaBand;
  status: InvoiceStatus;
  
  // Specific path flags
  isManualCheckBypass?: boolean;
  manualCheckNotes?: string;
  isOffCycleUrgent?: boolean;
  offCycleReason?: string;
  
  // Exception handling
  exceptionDetails?: string;
  exceptionResolved?: boolean;
  exceptionResolutionNote?: string;
  supplierQueried?: boolean;
  
  // Rejection
  rejectionReason?: string;
  rejectedAt?: string;

  // SAP Reference
  sapDraftApDocNum?: string;
  sapPvDocNum?: string;
  sapPostedDate?: string;

  // Approval Tracking
  managerApproved?: boolean;
  managerApprovedAt?: string;
  cooApproved?: boolean;
  cooApprovedAt?: string;
  cooComments?: string;
  directorApproved?: boolean;
  directorApprovedAt?: string;
  directorComments?: string;

  // Bank Portal
  bankStatus?: 'Pending' | 'Approved' | 'Declined';
  bankDeclineReason?: string;
  bankBatchRef?: string;
  
  // Line items for 3-way match
  items: LineItem[];
  matchResult: ThreeWayMatchResult;
  
  // Timestamps
  submittedAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  personaName: string;
  personaRole: string;
  action: string;
  invoiceId?: string;
  details: string;
  category: 'MATCH' | 'SAP' | 'PROPOSAL' | 'APPROVAL' | 'BANK' | 'MANUAL_CHECK' | 'OFF_CYCLE';
}

export interface OpenQuestionsConfig {
  showLoaBands: boolean; // Step 6
  approvalPath: 'single_manager' | 'two_layer'; // Step 7: Path A vs Path B
  bankPortalEnabled: boolean; // Step 8
  fridayCutoffInterpretation: 'submission_deadline' | 'payment_run_deadline'; // Step 6
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  referencedInvoices?: string[];
  source?: string;
}
