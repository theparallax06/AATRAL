import React, { useState } from 'react';
import {
  MapPin,
  Bell,
  ChevronDown,
  Users,
  HardHat,
  ShieldCheck,
  Building2,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { UserRole } from '../../types';
import { LanguageSelector } from './LanguageSelector';
import { LocationSelectorModal } from './LocationSelectorModal';
import { IdentityVerificationModal } from './IdentityVerificationModal';
import { AatralLogo } from './AatralLogo';

interface HeaderProps {
  onOpenAuth: (initialRole?: UserRole) => void;
  onSearchChange?: (query: string) => void;
  onOpenGrievance?: () => void;
  isLandingView?: boolean;
  onToggleLandingView?: (showLanding: boolean) => void;
  onOpenVerification?: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  isLandingView = false,
  onToggleLandingView,
}) => {
  const {
    currentUser,
    currentRole,
    logoutUser,
    selectedCity,
    activeAddress,
    bookings,
    workOrders,
    complaints,
    t,
  } = useApp();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationsCount = currentUser
    ? currentRole === 'customer'
      ? bookings.filter((b) => b.status === 'in_progress' || b.status === 'matched').length
      : currentRole === 'worker'
      ? bookings.filter((b) => b.status === 'matched' || b.status === 'in_progress').length
      : currentRole === 'admin'
      ? complaints.filter((c) => c.status === 'open').length + 2
      : workOrders.filter((w) => w.status === 'submitted' || w.status === 'partially_assigned').length
    : 0;

  const handleLogoClick = () => {
    if (onToggleLandingView) {
      onToggleLandingView(true);
    }
  };

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string }> = {
    customer: { label: t('role_customer', 'Customer'), icon: Users, color: 'text-emerald-300 bg-emerald-500/20' },
    worker: { label: t('role_worker', 'Worker'), icon: HardHat, color: 'text-amber-300 bg-amber-500/20' },
    admin: { label: t('role_admin', 'Admin'), icon: ShieldCheck, color: 'text-purple-300 bg-purple-500/20' },
    institution: { label: t('role_institution', 'Institution'), icon: Building2, color: 'text-blue-300 bg-blue-500/20' },
  };

  const CurrentRoleIcon = roleLabels[currentRole]?.icon || Users;

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#19153E] via-[#062B3A] to-[#1E194B] border-b border-amber-400/30 shadow-md backdrop-blur-md">
        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-4">
            {/* Logo & Brand */}
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-2 shrink-0 cursor-pointer group min-w-0"
              title="AATRAL Platform"
            >
              <AatralLogo size="md" variant="white" />
            </div>

            {/* RIGHT SIDE: Location -> Language -> Auth Controls */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto min-w-0">
              {/* Location Control */}
              <div className="shrink-0 min-w-0">
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-amber-400/30 bg-[#0A3F55]/70 hover:bg-[#0A3F55] text-white transition-all shadow-2xs cursor-pointer max-w-[90px] xs:max-w-[110px] sm:max-w-[160px] md:max-w-[200px]"
                  title={t('select_location', 'Select Location')}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="text-slate-100 truncate text-[11px] sm:text-xs font-semibold">
                    {activeAddress ? `${activeAddress.area}, ${activeAddress.city}` : selectedCity}
                  </span>
                  <ChevronDown className="w-3 h-3 text-amber-300 shrink-0" />
                </button>
              </div>

              {/* 3. Language Selector */}
              <div className="shrink-0">
                <LanguageSelector />
              </div>

              {/* 4. Logged-In Controls vs Public Auth Buttons */}
              {currentUser ? (
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-xl text-amber-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Platform Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {notificationsCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-[#19153E] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                          {notificationsCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1rem)] bg-[#1B1745] rounded-2xl shadow-2xl border border-amber-400/30 p-3 z-50 animate-in fade-in text-white">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                          <span className="text-xs font-bold text-amber-300">Platform Alerts</span>
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                            {notificationsCount} active
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                            <p className="font-bold text-emerald-300">Cooperative Health Shield Active</p>
                            <p className="text-[11px] text-emerald-200">₹5,00,000 welfare coverage renewed for all members.</p>
                          </div>
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                            <p className="font-bold text-amber-300">Location Selected</p>
                            <p className="text-[11px] text-slate-300">{activeAddress ? `${activeAddress.area}, ${activeAddress.city}` : selectedCity}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Read-Only Current Role Badge */}
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border border-white/15 cursor-default shadow-2xs select-none ${
                    roleLabels[currentRole]?.color || 'text-white'
                  }`}>
                    <CurrentRoleIcon className="w-3.5 h-3.5" />
                    <span>{roleLabels[currentRole]?.label}</span>
                  </div>

                  {/* User Profile Avatar & Sign Out Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1 rounded-xl ring-2 ring-amber-400/50 hover:ring-amber-400 transition-all cursor-pointer"
                    >
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="text-xs font-bold text-white hidden lg:inline truncate max-w-[100px]">
                        {currentUser.name}
                      </span>
                      <ChevronDown className="w-3 h-3 text-amber-300 hidden lg:inline" />
                    </button>

                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in text-slate-800">
                          <div className="px-3 py-2 border-b border-slate-100 mb-1">
                            <p className="font-bold text-xs text-[#062B3A]">{currentUser.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                            <span className="inline-block mt-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              {roleLabels[currentRole]?.label}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              logoutUser();
                              if (onToggleLandingView) onToggleLandingView(true);
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>{t('sign_out', 'Sign Out')}</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* BEFORE LOGIN: Show only Sign In button */
                <div className="shrink-0">
                  <button
                    onClick={() => onOpenAuth('customer')}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#19153E] text-xs font-extrabold shadow-md hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {t('sign_in', 'Sign In')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Location Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />

      {/* Global DigiLocker Identity & Credential Verification Modal */}
      <IdentityVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </>
  );
};
