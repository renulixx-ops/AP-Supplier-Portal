import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  X,
  FileCode,
  ShieldCheck,
  Eye,
  Check,
  Layers,
} from 'lucide-react';
import { PaymentType } from '../types';

export interface ExtractedInvoicePayload {
  supplierName: string;
  supplierBpCode: string;
  taxId: string;
  poNumber: string;
  grpoNumber: string;
  invoiceDate: string;
  dueDate: string;
  amountRM: number;
  paymentType: PaymentType;
  itemDescription: string;
  items: Array<{
    itemCode: string;
    description: string;
    poQty: number;
    poUnitPrice: number;
    invoiceQty: number;
    invoiceUnitPrice: number;
    grpoQty: number;
  }>;
  confidence: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  source: string;
}

interface InvoiceFileUploadProps {
  onFileProcessed: (data: ExtractedInvoicePayload, triggerThreeWayMatch: boolean) => void;
  currentSupplierName?: string;
  currentPoNumber?: string;
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'parsed' | 'error';

interface ProcessingStep {
  id: string;
  label: string;
  sublabel: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export const InvoiceFileUpload: React.FC<InvoiceFileUploadProps> = ({
  onFileProcessed,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Local state to capture file data
  const [capturedFile, setCapturedFile] = useState<{
    file: File | null;
    name: string;
    size: number;
    type: string;
    formattedSize: string;
    previewUrl?: string;
    textContent?: string;
  } | null>(null);

  // Parsed invoice payload state
  const [parsedData, setParsedData] = useState<ExtractedInvoicePayload | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const simulationTimerRef = useRef<NodeJS.Timeout[]>([]);

  const processingSteps: ProcessingStep[] = [
    {
      id: 'ingest',
      label: 'Document Ingestion & Checksum Scan',
      sublabel: 'Validating MIME headers, anti-virus check, SHA-256 digital stamp',
      status: activeStepIndex > 0 ? 'completed' : activeStepIndex === 0 ? 'in_progress' : 'pending',
    },
    {
      id: 'ocr',
      label: 'Document AI & Optical Character Recognition',
      sublabel: 'Extracting vendor TIN, PO ref, currency, tax rates & line items',
      status: activeStepIndex > 1 ? 'completed' : activeStepIndex === 1 ? 'in_progress' : 'pending',
    },
    {
      id: 'sap_crossref',
      label: 'SAP B1 Master Data Cross-Reference',
      sublabel: 'Looking up Business Partner V-10042 in PETRO_SBO_MY live catalog',
      status: activeStepIndex > 2 ? 'completed' : activeStepIndex === 2 ? 'in_progress' : 'pending',
    },
    {
      id: 'ready',
      label: '3-Way Match Readiness Check',
      sublabel: 'Aligning invoice items with PO-2026 and GRPO warehouse receipts',
      status: activeStepIndex >= 3 ? 'completed' : 'pending',
    },
  ];

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      simulationTimerRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleIncomingFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleIncomingFile(e.target.files[0]);
    }
  };

  // Process and ingest file with simulated progressive stages
  const handleIncomingFile = (file: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'text/plain',
      'application/json',
      'text/xml',
      'application/xml',
    ];
    const isExtensionAcceptable = /\.(pdf|png|jpe?g|webp|txt|json|xml|csv)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionAcceptable) {
      setErrorMessage('Please upload a valid invoice format (PDF, PNG, JPG, XML, JSON, or TXT).');
      setUploadState('error');
      return;
    }

    setErrorMessage(null);

    // Capture file data in local state
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    const captured = {
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      formattedSize: formatFileSize(file.size),
      previewUrl,
    };
    setCapturedFile(captured);

    // Begin upload and processing simulation
    startIngestionSimulation(captured);
  };

  const startIngestionSimulation = (captured: {
    file: File | null;
    name: string;
    size: number;
    type: string;
    formattedSize: string;
  }) => {
    // Clear previous timers
    simulationTimerRef.current.forEach((t) => clearTimeout(t));
    simulationTimerRef.current = [];

    setUploadState('uploading');
    setProgress(15);
    setActiveStepIndex(0);

    // Step 1: Uploading -> Processing (500ms)
    const t1 = setTimeout(() => {
      setUploadState('processing');
      setProgress(40);
      setActiveStepIndex(1);
    }, 450);

    // Step 2: Document AI / OCR (1100ms)
    const t2 = setTimeout(() => {
      setProgress(75);
      setActiveStepIndex(2);
    }, 1100);

    // Step 3: SAP B1 Cross-reference & Final Synthesis (1800ms)
    const t3 = setTimeout(() => {
      setProgress(100);
      setActiveStepIndex(3);

      // Determine synthesized invoice details based on filename heuristics
      const fn = captured.name.toLowerCase();
      let synthesized: ExtractedInvoicePayload;

      if (fn.includes('chemical') || fn.includes('apex')) {
        synthesized = {
          supplierName: 'Apex Industrial Chemicals Bhd',
          supplierBpCode: 'V-10029',
          taxId: 'C10-1904-870034',
          poNumber: 'PO-2026-8980',
          grpoNumber: 'GRPO-8790',
          invoiceDate: '2026-09-20',
          dueDate: '2026-10-20',
          amountRM: 165000,
          paymentType: 'Supplier Aging Payment (Monthly)',
          itemDescription: 'Offshore Specialty Degreaser & Hydrocarbon Solvent (Band 3 LOA)',
          items: [
            {
              itemCode: 'CHM-7701',
              description: 'Industrial Degreaser Solvent Drums (200L)',
              poQty: 50,
              poUnitPrice: 1800,
              invoiceQty: 50,
              invoiceUnitPrice: 1800,
              grpoQty: 50,
            },
            {
              itemCode: 'CHM-7702',
              description: 'Surfactant Neutralizing Agent Drums (200L)',
              poQty: 25,
              poUnitPrice: 3000,
              invoiceQty: 25,
              invoiceUnitPrice: 3000,
              grpoQty: 25,
            },
          ],
          confidence: 0.98,
          fileName: captured.name,
          fileSize: captured.size,
          fileType: captured.type,
          source: 'Gemini 3.8 Flash Document AI',
        };
      } else if (fn.includes('steel') || fn.includes('mismatch') || fn.includes('discrepancy')) {
        synthesized = {
          supplierName: 'Mega Steel Fabricators Sdn Bhd',
          supplierBpCode: 'V-10088',
          taxId: 'W10-2104-550099',
          poNumber: 'PO-2026-9055',
          grpoNumber: 'GRPO-8850',
          invoiceDate: '2026-09-22',
          dueDate: '2026-10-15',
          amountRM: 89200,
          paymentType: 'Supplier Aging Payment (Monthly)',
          itemDescription: 'Structural Steel I-Beam (Quantity exceeds warehouse GRPO receipt)',
          items: [
            {
              itemCode: 'STL-900',
              description: 'Heavy Grade Structural I-Beams (Grade 50B)',
              poQty: 20,
              poUnitPrice: 4460,
              invoiceQty: 24, // Discrepancy!
              invoiceUnitPrice: 4460,
              grpoQty: 20,
            },
          ],
          confidence: 0.94,
          fileName: captured.name,
          fileSize: captured.size,
          fileType: captured.type,
          source: 'Gemini 3.8 Flash Document AI',
        };
      } else {
        // Standard high-pressure subsea valves
        synthesized = {
          supplierName: 'PetroSains Marine Engineering Sdn Bhd',
          supplierBpCode: 'V-10042',
          taxId: 'W10-2401-901122',
          poNumber: 'PO-2026-9110',
          grpoNumber: 'GRPO-8920',
          invoiceDate: '2026-09-23',
          dueDate: '2026-10-07',
          amountRM: 48500,
          paymentType: 'Weekly Payment',
          itemDescription: 'High-pressure subsea check valves, NBR flanged spool kit',
          items: [
            {
              itemCode: 'VLV-441',
              description: 'Subsea Non-Return Valve 4-Inch ANSI 1500',
              poQty: 5,
              poUnitPrice: 6200,
              invoiceQty: 5,
              invoiceUnitPrice: 6200,
              grpoQty: 5,
            },
            {
              itemCode: 'GSK-202',
              description: 'NBR Flanged Gasket Seal Kit',
              poQty: 10,
              poUnitPrice: 1750,
              invoiceQty: 10,
              invoiceUnitPrice: 1750,
              grpoQty: 10,
            },
          ],
          confidence: 0.99,
          fileName: captured.name,
          fileSize: captured.size,
          fileType: captured.type,
          source: 'Gemini 3.8 Flash Document AI',
        };
      }

      setParsedData(synthesized);
      setUploadState('parsed');

      // Update parent form state so fields are pre-populated
      onFileProcessed(synthesized, false);
    }, 1800);

    simulationTimerRef.current.push(t1, t2, t3);
  };

  const handleReset = () => {
    simulationTimerRef.current.forEach((t) => clearTimeout(t));
    simulationTimerRef.current = [];
    setCapturedFile(null);
    setParsedData(null);
    setUploadState('idle');
    setProgress(0);
    setActiveStepIndex(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerThreeWayMatch = () => {
    if (parsedData) {
      onFileProcessed(parsedData, true);
    }
  };

  // Preset sample invoice simulator
  const handleSelectSample = (sampleType: 'subsea' | 'chemical' | 'mismatch') => {
    let mockFile: {
      file: null;
      name: string;
      size: number;
      type: string;
      formattedSize: string;
    };

    if (sampleType === 'subsea') {
      mockFile = {
        file: null,
        name: 'INV-2026-PetroMarine-Valves.pdf',
        size: 148520,
        type: 'application/pdf',
        formattedSize: '145.0 KB',
      };
    } else if (sampleType === 'chemical') {
      mockFile = {
        file: null,
        name: 'INV-2026-Apex-Offshore-Chemicals.pdf',
        size: 245600,
        type: 'application/pdf',
        formattedSize: '239.8 KB',
      };
    } else {
      mockFile = {
        file: null,
        name: 'INV-2026-MegaSteel-Discrepancy.pdf',
        size: 182300,
        type: 'application/pdf',
        formattedSize: '178.0 KB',
      };
    }

    setCapturedFile(mockFile);
    startIngestionSimulation(mockFile);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#183426]/10 flex items-center justify-center text-[#183426]">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#101312]">
              Supplier Invoice Document Ingestion
            </h3>
            <p className="text-[11px] text-slate-500">
              Drag & drop vendor e-Invoice files to capture metadata and initiate 3-way matching
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#183426]/5 text-[#183426] border border-[#183426]/15 font-mono">
            <ShieldCheck className="w-3 h-3 text-[#49D892]" />
            OCR & Di-API Engine Active
          </span>
        </div>
      </div>

      {/* Main Upload Zone */}
      {uploadState === 'idle' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-7 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-[#183426] bg-[#183426]/5 scale-[0.99] shadow-inner'
              : 'border-slate-300 hover:border-[#183426]/60 bg-slate-50/50 hover:bg-slate-50/90'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.json,.xml"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center text-[#183426] shadow-xs group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7 text-[#183426]" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Click to browse or drop supplier invoice file here
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                Supports Adobe PDF, Scanned Images (PNG, JPG), Peppol e-Invoice XML, and EDI JSON (Max 25MB)
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold text-slate-600 bg-white border border-slate-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Automatic field extraction via Gemini Document AI</span>
            </div>
          </div>
        </div>
      )}

      {/* Processing & Ingestion Status UI */}
      {(uploadState === 'uploading' || uploadState === 'processing') && capturedFile && (
        <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/60 space-y-5 animate-in fade-in">
          {/* File Card Header */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                <FileText className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {capturedFile.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-900 uppercase">
                    Processing
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {capturedFile.formattedSize} • {capturedFile.type}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Cancel processing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#183426] animate-spin" />
                Ingesting and parsing invoice structure...
              </span>
              <span className="font-mono text-[#183426]">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#183426] via-[#2f664a] to-[#49D892] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Step-by-Step Simulation Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {processingSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-3 rounded-xl border text-left transition-all ${
                  step.status === 'completed'
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : step.status === 'in_progress'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : step.status === 'in_progress' ? (
                    <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 flex items-center justify-center text-[9px] font-bold">
                      {idx + 1}
                    </div>
                  )}
                  <span className="text-xs font-bold tracking-tight">{step.label}</span>
                </div>
                <p className="text-[10px] mt-1 line-clamp-1 ml-6 text-slate-500 font-normal">
                  {step.sublabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parsed & Ingestion Complete State */}
      {uploadState === 'parsed' && parsedData && capturedFile && (
        <div className="border border-emerald-200 rounded-2xl p-5 sm:p-6 bg-emerald-50/30 space-y-5 animate-in fade-in">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-emerald-200/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
                <FileCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">
                    {capturedFile.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900">
                    <Check className="w-2.5 h-2.5" />
                    Ingestion & OCR Complete
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {capturedFile.formattedSize} • Confidence: {Math.round(parsedData.confidence * 100)}% • Engine: {parsedData.source}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Upload Different File
              </button>
            </div>
          </div>

          {/* Captured Field Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Supplier / BP Code
              </span>
              <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
                {parsedData.supplierName}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                ({parsedData.supplierBpCode})
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                PO / GRPO Ref
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 block mt-0.5">
                {parsedData.poNumber}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {parsedData.grpoNumber}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Payable Amount
              </span>
              <span className="text-xs font-extrabold text-emerald-700 block mt-0.5 font-mono">
                RM {parsedData.amountRM.toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                {parsedData.amountRM > 100000
                  ? 'Band 3 (Dual Sign-Off)'
                  : parsedData.amountRM > 30000
                  ? 'Band 2 (COO)'
                  : 'Band 1 (Manager)'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Payment Type
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {parsedData.paymentType}
              </span>
              <span className="text-[10px] text-slate-500">
                TIN: {parsedData.taxId}
              </span>
            </div>
          </div>

          {/* Extracted Line Items Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
              <span>Extracted Line Items ({parsedData.items.length})</span>
              <span className="text-[10px] text-slate-400">Ready for SAP 3-Way Match</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {parsedData.items.map((item, idx) => (
                <div key={idx} className="p-3 text-xs flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#183426] mr-2">
                      {item.itemCode}
                    </span>
                    <span className="text-slate-800 font-medium">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-slate-500">
                      Qty: <strong className="text-slate-900">{item.invoiceQty}</strong>
                    </span>
                    <span className="text-slate-500">
                      @ RM {item.invoiceUnitPrice.toLocaleString()}
                    </span>
                    <span className="font-bold text-slate-900">
                      RM {(item.invoiceQty * item.invoiceUnitPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call-to-Action to Trigger 3-Way Match */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              File ingested and verified. Ready to compare against PO and GRPO.
            </span>

            <button
              type="button"
              onClick={handleTriggerThreeWayMatch}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#101312] hover:bg-black shadow-md transition-all cursor-pointer group"
            >
              <span>Trigger 3-Way Matching Process</span>
              <ArrowRight className="w-4 h-4 text-[#49D892] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {uploadState === 'error' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage || 'Failed to parse invoice document.'}</span>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1 rounded-md bg-white border border-rose-300 text-rose-700 font-semibold hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* Quick Showcase Pre-Loaded Samples */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Quick Showcase (Or click a sample invoice to simulate ingestion):
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleSelectSample('subsea')}
            className="p-3 text-left bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#183426]">
                📄 PetroMarine Subsea Valves
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                Weekly Run
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">RM 48,500 • PO-2026-9110</p>
            <p className="text-[10px] text-slate-400 mt-0.5">3-way match ready, standard flow</p>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample('chemical')}
            className="p-3 text-left bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#183426]">
                📄 Apex Hydrocarbon Solvents
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                Band 3 LOA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">RM 165,000 • PO-2026-8980</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Triggers Managing Director dual signoff</p>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample('mismatch')}
            className="p-3 text-left bg-white hover:bg-amber-50/50 border border-amber-200 rounded-xl transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-amber-950">
                📄 MegaSteel Structural Beams
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                Discrepancy
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">RM 89,200 • PO-2026-9055</p>
            <p className="text-[10px] text-amber-700 mt-0.5">Triggers Step 3 AP Exception Queue</p>
          </button>
        </div>
      </div>
    </div>
  );
};
