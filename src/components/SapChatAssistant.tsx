import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Database,
  ArrowUpRight,
} from 'lucide-react';

export const SapChatAssistant: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendChatMessage,
    isChatLoading,
    invoices,
    setSelectedInvoiceForDetail,
    selectedInvoiceForDetail,
    activePersona,
    setCurrentStep,
    setActiveTab,
  } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatLoading) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (qText: string) => {
    if (isChatLoading) return;
    sendChatMessage(qText);
  };

  const handleInvoiceClick = (invId: string) => {
    const target = invoices.find((i) => i.id.toUpperCase() === invId.toUpperCase());
    if (target) {
      setSelectedInvoiceForDetail(target);
      setActiveTab('flow');
      if (target.status === 'Submitted' || target.status === 'Matched') {
        setCurrentStep(2);
      } else if (target.status === 'Mismatch (Exception)') {
        setCurrentStep(3);
      } else if (target.status === 'Draft AP in SAP') {
        setCurrentStep(4);
      } else if (target.status === 'In Payment Proposal') {
        setCurrentStep(6);
      } else if (target.status.includes('Approval')) {
        setCurrentStep(7);
      } else if (target.status.includes('Bank')) {
        setCurrentStep(8);
      } else if (target.status === 'Posted PV' || target.status === 'Paid') {
        setCurrentStep(9);
      }
    }
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#101312] hover:bg-black text-white px-5 py-3.5 rounded-full shadow-xl flex items-center gap-3 border border-white/20 transition-all cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-full bg-[#183426] flex items-center justify-center text-[#49D892] group-hover:scale-110 transition-transform">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-extrabold tracking-tight">Ask Gemini SAP Assistant</span>
        <span className="w-2 h-2 rounded-full bg-[#49D892] animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 font-sans">
      {/* Header */}
      <div className="bg-[#101312] text-white px-5 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#183426] flex items-center justify-center text-[#49D892]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold tracking-tight">Treasury AI Copilot</h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#183426] text-[#49D892] border border-[#49D892]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#49D892] animate-pulse"></span>
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Live SAP B1 Grounding · Zero Hallucination
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsChatOpen(false)}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contextual Active Inspector Pill if an invoice is selected */}
      {selectedInvoiceForDetail && (
        <div className="bg-[#183426]/10 px-4 py-2 border-b border-[#183426]/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 truncate text-[#183426]">
            <span className="font-extrabold uppercase text-[9px] tracking-wider bg-[#183426] text-[#49D892] px-1.5 py-0.5 rounded-md">
              Inspecting
            </span>
            <span className="font-bold truncate">
              {selectedInvoiceForDetail.id} ({selectedInvoiceForDetail.supplierName})
            </span>
          </div>
          <button
            onClick={() => handleQuickPrompt(`Provide full SAP B1 audit trail and approval status for inspected invoice ${selectedInvoiceForDetail.id}`)}
            className="text-[10px] font-bold text-[#183426] hover:underline shrink-0 ml-2 cursor-pointer"
          >
            Ask about this &rarr;
          </button>
        </div>
      )}

      {/* Suggested Quick Queries */}
      <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 overflow-x-auto whitespace-nowrap text-[11px] gap-1.5 flex items-center">
        <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider shrink-0">Try:</span>
        <button
          onClick={() => handleQuickPrompt("Which invoices are currently pending Director approval and what are their amounts?")}
          className="px-3 py-1 bg-white hover:bg-[#183426]/5 hover:text-[#183426] text-slate-700 rounded-full border border-slate-200/80 font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          Pending Director Sign-off
        </button>
        <button
          onClick={() => handleQuickPrompt("What is our total weekly payment commitment due this Friday?")}
          className="px-3 py-1 bg-white hover:bg-[#183426]/5 hover:text-[#183426] text-slate-700 rounded-full border border-slate-200/80 font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          Friday Batch Total
        </button>
        <button
          onClick={() => handleQuickPrompt("Which invoices failed 3-way matching and why?")}
          className="px-3 py-1 bg-white hover:bg-[#183426]/5 hover:text-[#183426] text-slate-700 rounded-full border border-slate-200/80 font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          3-Way Variances
        </button>
        <button
          onClick={() => handleQuickPrompt("What are the SAP GL accounting entries when posting an approved Payment Voucher?")}
          className="px-3 py-1 bg-white hover:bg-[#183426]/5 hover:text-[#183426] text-slate-700 rounded-full border border-slate-200/80 font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          GL Accounting Postings
        </button>
        <button
          onClick={() => handleQuickPrompt("What is the status and bank decline reason for INV-1044?")}
          className="px-3 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-full border border-slate-200/80 font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          INV-1044 Decline
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/40">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-[#101312] text-white'
                  : 'bg-[#183426] text-[#49D892]'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-line shadow-2xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#101312] text-white rounded-tr-xs font-medium'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs'
              }`}
            >
              {msg.text}

              {msg.referencedInvoices && msg.referencedInvoices.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400">Jump to SAP Document:</span>
                  {msg.referencedInvoices.map((refId) => (
                    <button
                      key={refId}
                      type="button"
                      onClick={() => handleInvoiceClick(refId)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#183426]/10 hover:bg-[#183426]/20 text-[#183426] transition-colors cursor-pointer"
                    >
                      <span>{refId}</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-50">
                {msg.source ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                    <Sparkles className="w-2.5 h-2.5" />
                    {msg.source}
                  </span>
                ) : (
                  <span></span>
                )}
                <span className="font-medium">{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}

        {isChatLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-[#183426] text-[#49D892]">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 border border-slate-100 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#183426] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#49D892] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#183426] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] font-semibold text-slate-600 ml-1">
                  Connecting to Gemini API & analyzing live SAP ledger...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Gemini about live invoices, LOA, GL accounts, or cutoff..."
          className="flex-1 px-4 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-full focus:outline-hidden focus:bg-white text-slate-800 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isChatLoading}
          className="px-4 py-2.5 bg-[#101312] hover:bg-black disabled:opacity-40 text-white rounded-full transition-all cursor-pointer shadow-xs flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5 text-[#49D892]" />
        </button>
      </form>
    </div>
  );
};
