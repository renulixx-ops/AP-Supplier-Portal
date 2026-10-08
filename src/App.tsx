/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ModernTreasurySidebar } from './components/ModernTreasurySidebar';
import { ModernTreasuryTopNav } from './components/ModernTreasuryTopNav';
import { LuxuryFlowStepper } from './components/LuxuryFlowStepper';
import { FlowExecutiveHero } from './components/FlowExecutiveHero';
import { OpenQuestionsModal } from './components/OpenQuestionsModal';
import { PersonaDashboards } from './components/PersonaDashboards';
import { SapBusinessOneZone } from './components/SapBusinessOneZone';
import { SapChatAssistant } from './components/SapChatAssistant';
import { LuxuryLoginPortal } from './components/LuxuryLoginPortal';

// Steps
import { Step1SupplierSubmit } from './components/steps/Step1SupplierSubmit';
import { Step2ThreeWayMatch } from './components/steps/Step2ThreeWayMatch';
import { Step3ExceptionQueue } from './components/steps/Step3ExceptionQueue';
import { Step4DraftApInSap } from './components/steps/Step4DraftApInSap';
import { Step5DraftApQueue } from './components/steps/Step5DraftApQueue';
import { Step6PaymentProposal } from './components/steps/Step6PaymentProposal';
import { Step7Approval } from './components/steps/Step7Approval';
import { Step8BankPortal } from './components/steps/Step8BankPortal';
import { Step9PostPaymentVoucher } from './components/steps/Step9PostPaymentVoucher';
import { Step10StatusNotificationComparison } from './components/steps/Step10StatusNotificationComparison';
import { Step11SupplierStatusCheck } from './components/steps/Step11SupplierStatusCheck';

const MainContent: React.FC = () => {
  const { activeTab, currentStep, isAuthenticated } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  if (!isAuthenticated) {
    return <LuxuryLoginPortal />;
  }

  return (
    <div className="min-h-screen bg-[#F0F2F1] flex text-[#101312] selection:bg-[#49D892] selection:text-[#101312]">
      {/* Modern SaaS Treasury Sidebar Navigation */}
      <ModernTreasurySidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar with search, currency indicator, breadcrumbs, notifications */}
        <ModernTreasuryTopNav
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Dynamic Page Canvas */}
        <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {activeTab === 'flow' && (
            <div className="space-y-6">
              {/* Executive Hero: Today's Priorities, Financial Metrics & 3D Glass Art */}
              <FlowExecutiveHero />

              {/* 11-Stage Interactive Pipeline */}
              <LuxuryFlowStepper />

              {/* Active Flow Step Workspace */}
              <div className="transition-opacity duration-200">
                {currentStep === 1 && <Step1SupplierSubmit />}
                {currentStep === 2 && <Step2ThreeWayMatch />}
                {currentStep === 3 && <Step3ExceptionQueue />}
                {currentStep === 4 && <Step4DraftApInSap />}
                {currentStep === 5 && <Step5DraftApQueue />}
                {currentStep === 6 && <Step6PaymentProposal />}
                {currentStep === 7 && <Step7Approval />}
                {currentStep === 8 && <Step8BankPortal />}
                {currentStep === 9 && <Step9PostPaymentVoucher />}
                {currentStep === 10 && <Step10StatusNotificationComparison />}
                {currentStep === 11 && <Step11SupplierStatusCheck />}
              </div>
            </div>
          )}

          {activeTab === 'persona_view' && <PersonaDashboards />}

          {activeTab === 'sap_zone' && <SapBusinessOneZone />}

          {activeTab === 'supplier_check' && <Step11SupplierStatusCheck />}
        </main>

        {/* Ultra-Clean Modern SaaS Footer */}
        <footer className="border-t border-slate-200/80 bg-white/70 py-4 px-6 sm:px-8 text-xs text-slate-500">
          <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#101312]">TREASURY OS</span>
              <span>·</span>
              <span>Autonomous Liquidity & SAP Business One 10.0 Orchestration</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Base: MYR (RM) · DI-API Real-Time Gateway · PETRONAS Downstream AP
            </div>
          </div>
        </footer>
      </div>

      {/* Global Open Questions & Architecture Decisions Modal */}
      <OpenQuestionsModal />

      {/* Grounded Truth-Only SAP Chat Assistant */}
      <SapChatAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
