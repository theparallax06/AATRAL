import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Phone,
  User,
  HardHat,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building,
  KeyRound,
  FileCheck,
  Award,
  Shield,
  Briefcase,
  ChevronRight,
  Info,
  QrCode,
  MapPin,
  Check,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { UserRole } from '../../types';
import { AatralLogo } from '../common/AatralLogo';

interface AuthModalProps {
  onClose: () => void;
  initialRole?: UserRole;
  onAuthSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  initialRole,
  onAuthSuccess,
}) => {
  const { loginUser, currentRole, organizations } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || currentRole || 'customer');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Common Form Fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  // Role-Specific Fields
  const [selectedSocietyId, setSelectedSocietyId] = useState(organizations[2]?.id || '');
  const [tradeSkill, setTradeSkill] = useState('Electrical & Smart Wiring');
  const [ncvtCertNumber, setNcvtCertNumber] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('');
  const [mscsRegNo, setMscsRegNo] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('Public Sector Enterprise');
  const [gstinNumber, setGstinNumber] = useState('');

  const roleDescriptions = {
    customer: {
      title: 'Household & Retail Customer',
      desc: 'Book verified electricians, plumbers, carpenters & cleaners. Real-time GPS tracking & fair transparent invoices.',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: User,
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    worker: {
      title: 'Cooperative Member Worker',
      desc: 'Certified artisan dashboard. Receive 88% direct take-home pay, ₹5L insurance, on-duty job alerts & tool grants.',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: HardHat,
      iconBg: 'bg-amber-100 text-amber-700',
    },
    admin: {
      title: 'Cooperative & Federation Admin',
      desc: 'Registrar & union governance console. Verify artisan KYC, manage work orders, analyze AI demand & allocate squads.',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
      icon: ShieldCheck,
      iconBg: 'bg-purple-100 text-purple-700',
    },
    institution: {
      title: 'Institutional / Enterprise Client',
      desc: 'B2B & Government procurement. Post bulk trade tenders, biometric muster roll attendance & milestone escrow releases.',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
      icon: Building2,
      iconBg: 'bg-blue-100 text-blue-700',
    },
    apprentice: {
      title: 'Apprentice / Trainee Member',
      desc: 'Track your training progress, view your assigned mentor, log supervised hours and earn your training stipend.',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-300',
      icon: GraduationCap,
      iconBg: 'bg-teal-100 text-teal-700',
    },
  };

  const handleRoleTabClick = (role: UserRole) => {
    setSelectedRole(role);
    setStep('credentials');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Enter a valid 10-digit mobile number.');
      return;
    }
    setStep('otp');
  };

  const roleOtps: Record<UserRole, string> = {
    customer: '4829',
    worker: '1234',
    admin: '5678',
    institution: '9012',
    apprentice: '3456',
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (otp !== roleOtps[selectedRole]) {
      setOtpError('Invalid OTP');
      return;
    }

    // Determine custom name & details
    let customName = fullName;
    if (!customName) {
      if (selectedRole === 'worker') customName = 'Vikram Singh (Member Worker)';
      else if (selectedRole === 'admin') customName = 'Dr. Rameshwar Patil (Registrar)';
      else if (selectedRole === 'institution') customName = 'Er. Pradeep Khurana (DMRC Lead)';
      else if (selectedRole === 'apprentice') customName = 'Raju Mechanic (Apprentice)';
      else customName = 'Ananya Deshmukh';
    }

    loginUser(selectedRole, {
      name: customName,
      phone: phone || '9876543210',
      email: email || `${selectedRole}@aatral.org`,
      societyId: selectedSocietyId,
      institutionName: institutionName || 'Metropolitan Infrastructure Corp',
      institutionType,
    });

    onAuthSuccess(selectedRole);
  };

  const ActiveIcon = roleDescriptions[selectedRole].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4" style={{maxWidth: 'min(576px, calc(100vw - 24px))'}}>
        {/* Modal Top Header */}
        <div className="bg-[#062B3A] text-white p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <AatralLogo size="sm" variant="white" />
          </div>
          <p className="text-xs text-slate-300">
            Multi-State Labour Cooperative Federation • Multi-Role Secure Login
          </p>

          {/* Role selector tabs */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider">
                Step 1: Select Your Cooperative Role
              </span>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    authMode === 'signin' ? 'bg-white text-[#062B3A]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    authMode === 'signup' ? 'bg-[#E0A922] text-[#062B3A]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1 p-1 bg-black/25 rounded-2xl border border-white/10">
              <button
                onClick={() => handleRoleTabClick('customer')}
                className={`py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[9px] sm:text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer ${
                  selectedRole === 'customer'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => handleRoleTabClick('worker')}
                className={`py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[9px] sm:text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer ${
                  selectedRole === 'worker'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <HardHat className="w-4 h-4" />
                <span>Worker</span>
              </button>

              <button
                onClick={() => handleRoleTabClick('admin')}
                className={`py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[9px] sm:text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => handleRoleTabClick('institution')}
                className={`py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[9px] sm:text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer ${
                  selectedRole === 'institution'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Institution</span>
              </button>

              <button
                onClick={() => handleRoleTabClick('apprentice')}
                className={`py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-xl text-[9px] sm:text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 sm:gap-1 cursor-pointer ${
                  selectedRole === 'apprentice'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Apprentice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[60vh] sm:max-h-none overflow-y-auto">
          {/* Active Role Explainer Banner */}
          <div className="p-3.5 bg-[#F7F7F2] rounded-2xl border border-slate-200 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${roleDescriptions[selectedRole].iconBg} flex items-center justify-center shrink-0`}>
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-[#062B3A]">{roleDescriptions[selectedRole].title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[#35C6B0]">
                  {authMode === 'signup' ? 'New Registration' : 'Secure Login'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                {roleDescriptions[selectedRole].desc}
              </p>
            </div>
          </div>



          {/* Form Step: Credentials */}
          {step === 'credentials' && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in">
              {/* Optional Name for Registration */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'institution' ? 'Authorized Officer Full Name' : 'Full Name (as on Govt ID / DigiLocker)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar / Ananya Sharma"
                    className="w-full px-3 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-[#35C6B0]/30 focus:border-[#35C6B0]"
                  />
                </div>
              )}

              {/* Mobile Phone Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Mobile Number (Aadhaar / DigiLocker Linked)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      if (phoneError) setPhoneError('');
                    }}
                    maxLength={10}
                    className={`w-full pl-9 pr-3 py-2.5 bg-[#F7F7F2] border ${phoneError ? 'border-red-400 focus:ring-red-400/30' : 'border-slate-200 focus:ring-[#35C6B0]/30'} rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:border-[#35C6B0]`}
                    placeholder="9876543210"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-[10px] mt-1 font-medium">{phoneError}</p>
                )}
              </div>

              {/* Worker Specific Inputs */}
              {selectedRole === 'worker' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Trade Skill & Specialty
                    </label>
                    <select
                      value={tradeSkill}
                      onChange={(e) => setTradeSkill(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                    >
                      <option>Electrical & Smart Wiring</option>
                      <option>Sanitary Plumbing & Hydro Repairs</option>
                      <option>Master Carpentry & Woodcraft</option>
                      <option>Deep Sanitization & Housekeeping</option>
                      <option>HVAC & Appliance Diagnostics</option>
                      <option>Elderly & Post-Op Home Care</option>
                      <option>Eco Surface Treatment & Painting</option>
                      <option>Masonry, Tiling & Civil Works</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Affiliated Primary Labour Cooperative Society
                    </label>
                    <select
                      value={selectedSocietyId}
                      onChange={(e) => setSelectedSocietyId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                    >
                      {organizations
                        .filter((o) => o.type === 'primary_society')
                        .map((soc) => (
                          <option key={soc.id} value={soc.id}>
                            {soc.name} ({soc.code})
                          </option>
                        ))}
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1">
                      *Workers are registered via their democratic cooperative society.
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Specific Inputs */}
              {selectedRole === 'admin' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Designation & Authority Token
                    </label>
                    <input
                      type="text"
                      value={adminDesignation}
                      onChange={(e) => setAdminDesignation(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      MSCS Cooperative Registration No.
                    </label>
                    <input
                      type="text"
                      value={mscsRegNo}
                      onChange={(e) => setMscsRegNo(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Institution Specific Inputs */}
              {selectedRole === 'institution' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enterprise / Institution Name
                    </label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. Delhi Metro Rail / AIIMS / CPWD"
                      className="w-full px-3 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GSTIN / GeM Entity Identification
                    </label>
                    <input
                      type="text"
                      value={gstinNumber}
                      onChange={(e) => setGstinNumber(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md shadow-[#35C6B0]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Request Secure OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form Step: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#35C6B0] flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Enter Simulated OTP</h4>
                <p className="text-[11px] text-slate-500">
                  Verification code sent to <span className="font-semibold text-slate-800">{phone}</span>
                </p>
              </div>

              <div className="flex flex-col items-center justify-center my-4">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    if (otpError) setOtpError('');
                  }}
                  className={`w-44 text-center tracking-[0.8em] text-2xl font-mono font-black py-2.5 bg-[#F7F7F2] border-2 ${otpError ? 'border-red-400' : 'border-[#35C6B0]'} rounded-2xl text-slate-900 focus:outline-hidden`}
                />
                {otpError && (
                  <p className="text-red-500 text-xs mt-2 font-bold">{otpError}</p>
                )}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 text-center">
                Demo Verification OTP: <strong className="font-mono text-amber-950">{roleOtps[selectedRole]}</strong>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#062B3A] hover:bg-[#05222E] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Verify & Continue
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
