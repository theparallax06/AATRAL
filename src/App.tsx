import React, { useState } from 'react';
import { useApp } from './hooks/useApp';
import { Header } from './components/common/Header';
import { LandingPageView } from './components/home/LandingPageView';
import { ApprenticeView } from './components/apprentice/ApprenticeView';
import { CustomerView } from './components/customer/CustomerView';
import { WorkerView } from './components/worker/WorkerView';
import { AdminView } from './components/admin/AdminView';
import { InstitutionView } from './components/institution/InstitutionView';
import { AuthModal } from './components/auth/AuthModal';
import { IdentityVerificationModal } from './components/common/IdentityVerificationModal';
import { GrievanceModal } from './components/common/GrievanceModal';
import { HouseholdBooking, UserRole } from './types';
import {
  ShieldCheck,
  HeartHandshake,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
  Sparkles,
  Users,
  HardHat,
  Home,
  LayoutDashboard,
} from 'lucide-react';

import { useHistoryState } from './hooks/useHistoryState';

export default function App() {
  const { currentRole, currentUser, toastMessage, showToast, t } = useApp();
  const [isLandingView, setIsLandingView, goBack] = useHistoryState(currentUser ? false : true, 'app-isLandingView');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [showAuthModal, setShowAuthModal, closeAuthModal] = useHistoryState(false, 'app-showAuthModal');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole | undefined>(undefined);
  const [showVerificationModal, setShowVerificationModal, closeVerificationModal] = useHistoryState(false, 'app-showVerificationModal');
  const [verificationTargetRole, setVerificationTargetRole] = useState<UserRole>('worker');
  const [grievanceBooking, setGrievanceBooking] = useState<HouseholdBooking | undefined>(undefined);
  const [showGrievanceModal, setShowGrievanceModal, closeGrievanceModal] = useHistoryState(false, 'app-showGrievanceModal');

  // Ensure logged in user is directed to their dashboard
  React.useEffect(() => {
    if (currentUser) {
      setIsLandingView(false);
    }
  }, [currentUser]);

  const handleOpenGrievance = (booking?: HouseholdBooking) => {
    setGrievanceBooking(booking);
    setShowGrievanceModal(true);
  };

  const handleOpenAuthWithRole = (initialRole?: UserRole) => {
    setAuthInitialRole(initialRole || currentRole);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (role: UserRole) => {
    setShowAuthModal(false);
    setShowVerificationModal(false);
    setIsLandingView(false);
  };

  const handleVerificationComplete = () => {
    setShowVerificationModal(false);
    setIsLandingView(false);
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
    if (!currentUser?.verificationDetails || currentUser.verificationDetails.status !== 'verified') {
      setIsLandingView(true);
      showToast(`DigiLocker verification is required to access the ${currentRole.toUpperCase()} Dashboard.`, 'warning');
    }
  };

  const handleSelectCategoryFromLanding = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (!currentUser) {
      handleOpenAuthWithRole('customer');
    } else if (currentRole === 'customer') {
      setIsLandingView(false);
    } else {
      showToast(`You are currently signed in as a ${currentRole.toUpperCase()}. Sign out to use Customer booking.`, 'info');
    }
  };

  const handleFooterRoleClick = (role: UserRole) => {
    if (!currentUser) {
      handleOpenAuthWithRole(role);
    } else if (currentRole === role) {
      setIsLandingView(false);
    } else {
      showToast(`You are currently signed in as a ${currentRole.toUpperCase()}. Sign out to access the ${role.toUpperCase()} portal.`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#1C161A] flex flex-col font-sans selection:bg-[#35C6B0] selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        onOpenAuth={handleOpenAuthWithRole}
        isLandingView={isLandingView}
        onToggleLandingView={(showLanding) => setIsLandingView(showLanding)}
        onOpenVerification={() => setShowVerificationModal(true)}
        onSelectCategory={handleSelectCategoryFromLanding}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLandingView ? (
          <LandingPageView
            onOpenAuth={handleOpenAuthWithRole}
            onNavigateToDashboard={() => setIsLandingView(false)}
            onSelectCategory={handleSelectCategoryFromLanding}
          />
        ) : (
          <>
            {currentRole === 'customer' && (
              <CustomerView
                onOpenGrievance={handleOpenGrievance}
                initialCategoryId={selectedCategory}
              />
            )}

            {currentRole === 'worker' && <WorkerView />}

            {currentRole === 'admin' && <AdminView />}

            {currentRole === 'institution' && <InstitutionView />}

            {currentRole === 'apprentice' && <ApprenticeView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#041D27] text-slate-300 border-t border-[#062B3A]/40 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1 */}
            <div className="space-y-3">
              <div
                onClick={() => setIsLandingView(true)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#35C6B0] flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform">
                  CG
                </div>
                <span className="font-black text-lg text-white">{t('app_title', 'AATRAL')}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {t('footer_desc', 'National Digital Service Marketplace & Workforce Federation Platform. Empowering Labour Cooperatives under the Multi-State Cooperative Societies Act.')}
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('footer_coop_owned', '100% Cooperative Owned & Governed')}</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                {t('footer_ecosystem_roles', 'Four Connected Ecosystem Roles')}
              </h4>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>
                  <button
                    onClick={() => handleFooterRoleClick('customer')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    • {t('footer_role_customer', 'Household & Retail Customers')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterRoleClick('worker')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    • {t('footer_role_worker', 'Verified Member Technicians & Artisans')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterRoleClick('admin')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    • {t('footer_role_admin', 'Labour Cooperative Societies & Federations')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFooterRoleClick('institution')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    • {t('footer_role_institution', 'Government & Institutional Enterprise Clients')}
                  </button>
                </li>
                <li className="pt-1">
                  <button
                    onClick={() => setIsLandingView(true)}
                    className="text-[#E0A922] hover:underline cursor-pointer font-bold"
                  >
                    → {t('footer_view_landing', 'View Public Landing Page')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                {t('footer_fair_wage_structure', 'Cooperative Fair-Wage Structure')}
              </h4>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li className="flex justify-between">
                  <span>{t('footer_wage_direct', 'Direct Member Worker Wage:')}</span>
                  <span className="text-emerald-400 font-bold">88%</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('footer_wage_social', 'Worker Social Security & Insurance:')}</span>
                  <span className="text-purple-300 font-bold">7%</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('footer_wage_tech', 'Cooperative Tech & Hub Ops:')}</span>
                  <span className="text-blue-300 font-bold">5%</span>
                </li>
                <li className="pt-1 text-[10px] text-slate-500">
                  {t('footer_wage_zero_comm', 'Zero predatory aggregator commissions.')}
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
                {t('footer_govt_standards', 'Govt Standards & Trust')}
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {t('footer_govt_desc', 'Integrated with National Council for Vocational Training (NCVT), Skill India NSQF Levels, DigiLocker e-KYC, and District Cooperative Bank clearing engines.')}
              </p>
              <div className="pt-2 flex flex-col gap-1.5">
                <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t('footer_digilocker', 'DigiLocker Certified e-KYC Integration')}</span>
                </div>
                <button
                  onClick={() => handleOpenGrievance()}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 underline block cursor-pointer text-left"
                >
                  {t('footer_grievance', 'Grievance Ombudsman Desk →')}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>{t('footer_copyright', '© 2026 AATRAL Federation. Built for Smart India Hackathon (SIH).')}</p>
            <p>{t('footer_certified_network', 'Certified Multi-State Labour Cooperative Society Digital Network')}</p>
          </div>
        </div>
      </footer>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-500'
              : toastMessage.type === 'error'
              ? 'bg-red-900 text-white border-red-500'
              : 'bg-[#062B3A] text-white border-[#35C6B0]'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toastMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-purple-300 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          initialRole={authInitialRole}
          onClose={closeAuthModal}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* DigiLocker Identity Verification Modal */}
      {showVerificationModal && (
        <IdentityVerificationModal
          isOpen={showVerificationModal}
          targetRole={verificationTargetRole}
          onClose={handleVerificationClose}
          onVerificationComplete={handleVerificationComplete}
        />
      )}

      {/* Grievance Modal */}
      {showGrievanceModal && (
        <GrievanceModal
          booking={grievanceBooking}
          onClose={closeGrievanceModal}
        />
      )}
    </div>
  );
}
