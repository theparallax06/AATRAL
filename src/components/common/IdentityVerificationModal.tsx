import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  FileText,
  Building,
  Award,
  HardHat,
  User,
  Building2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  QrCode,
  Fingerprint,
  FileCheck2,
  Check,
  Shield,
  FileBadge,
  ExternalLink,
} from 'lucide-react';
import { UserRole, IdentityVerificationDetails } from '../../types';
import { useApp } from '../../hooks/useApp';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: UserRole;
  onVerificationComplete?: (details: IdentityVerificationDetails) => void;
}

export const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onVerificationComplete,
}) => {
  const { currentUser, currentRole, showToast, updateUserVerification } = useApp();
  const effectiveRole = targetRole || currentRole;

  const [step, setStep] = useState<'intro' | 'consent' | 'processing' | 'success' | 'failure'>('intro');
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const [consentAadhaar, setConsentAadhaar] = useState(true);
  const [consentOrg, setConsentOrg] = useState(true);
  const [consentCert, setConsentCert] = useState(true);
  const [mobileOtp, setMobileOtp] = useState('8392');
  const [simulatedAadhaarMasked, setSimulatedAadhaarMasked] = useState('XXXX-XXXX-7419');
  const [failureReason, setFailureReason] = useState<string>('');

  if (!isOpen) return null;

  // Define multi-stage pipeline based on role
  const getPipelineStages = () => {
    switch (effectiveRole) {
      case 'worker':
        return [
          {
            title: 'DigiLocker Identity (e-Aadhaar KYC)',
            subtitle: 'Secure biometric/OTP authentication via MeriPehchaan (No raw UID stored)',
            icon: Fingerprint,
            badge: 'UIDAI DigiLocker Gateway',
          },
          {
            title: 'Cooperative Society Membership Roll',
            subtitle: 'Verification with affiliated Primary Labour Cooperative Society Registry',
            icon: Building,
            badge: 'Registrar of Cooperatives',
          },
          {
            title: 'NCVT / ITI Skill Certificate Verification',
            subtitle: 'Digital certificate verification from National Skill Development Corporation',
            icon: Award,
            badge: 'NCVT / Skill India Digital',
          },
        ];
      case 'admin':
        return [
          {
            title: 'DigiLocker Official KYC Verification',
            subtitle: 'Registrar / Cooperative Officer personal identity authentication',
            icon: Fingerprint,
            badge: 'Government Officer KYC',
          },
          {
            title: 'Organization Authorization Verification',
            subtitle: 'Multi-State Cooperative Society (MSCS) Board Resolution & Authority Token',
            icon: Shield,
            badge: 'Ministry of Cooperation Authorization',
          },
        ];
      case 'institution':
        return [
          {
            title: 'Authorized Signatory Identity Verification',
            subtitle: 'Tender Officer / Institutional Lead authentication via DigiLocker',
            icon: User,
            badge: 'Signatory e-KYC',
          },
          {
            title: 'Enterprise / Corporate Registration Verification',
            subtitle: 'MCA Corporate Identification Number (CIN), GSTIN & GeM Portal Entity Validation',
            icon: Building2,
            badge: 'MCA21 & GST Registry',
          },
        ];
      case 'customer':
      default:
        return [
          {
            title: 'DigiLocker e-KYC Resident Verification',
            subtitle: 'Instant identity and verified residence check via DigiLocker e-Pehchaan',
            icon: Fingerprint,
            badge: 'UIDAI Verified Resident',
          },
        ];
    }
  };

  const stages = getPipelineStages();

  const handleStartConsent = () => {
    setStep('consent');
  };

  const handleProcessVerification = (simulateFailure = false) => {
    setStep('processing');
    setActivePipelineStage(0);

    // Step 1: DigiLocker Aadhaar
    setTimeout(() => {
      setActivePipelineStage(1);

      // Step 2
      setTimeout(() => {
        if (stages.length > 2) {
          setActivePipelineStage(2);
          setTimeout(() => {
            if (simulateFailure) {
              setFailureReason('DigiLocker repository timeout: Certificate mismatch with state registry.');
              setStep('failure');
            } else {
              finishSuccess();
            }
          }, 1200);
        } else {
          if (simulateFailure) {
            setFailureReason('DigiLocker authentication failed: Consent expired or OTP mismatch.');
            setStep('failure');
          } else {
            finishSuccess();
          }
        }
      }, 1300);
    }, 1200);
  };

  const finishSuccess = () => {
    const verifiedDetails: IdentityVerificationDetails = {
      status: 'verified',
      digilockerVerified: true,
      aadhaarMaskedUid: simulatedAadhaarMasked,
      eKycRefToken: `DL-EKYC-${Date.now().toString().slice(-8)}`,
      verifiedAt: new Date().toISOString(),
      stepsCompleted: stages.map((s) => s.title),
      societyVerification:
        effectiveRole === 'worker' || effectiveRole === 'admin'
          ? {
              verified: true,
              membershipId: currentUser?.memberId || 'COOP-DL-2026-991',
              societyCode: currentUser?.societyId || 'SOC-ELEC-401',
              verifiedByRegistrar: 'Office of Central Registrar of Cooperative Societies (CRCS)',
              verifiedAt: new Date().toISOString(),
            }
          : undefined,
      skillsVerification:
        effectiveRole === 'worker'
          ? {
              verified: true,
              tradeName: 'Electrical & Industrial Installations',
              ncvtCertificateId: 'NCVT/DL/2021/88391',
              issuingAuthority: 'National Council for Vocational Training (NCVT)',
              verifiedAt: new Date().toISOString(),
            }
          : undefined,
      adminAuthVerification:
        effectiveRole === 'admin'
          ? {
              verified: true,
              boardResolutionNo: 'BR/NFLSC/2026/08',
              registrarAuthorizationToken: 'REG-AUTH-DL-44810',
              verifiedAt: new Date().toISOString(),
            }
          : undefined,
      orgVerification:
        effectiveRole === 'institution'
          ? {
              verified: true,
              cinOrGstin: '07AAACD1234F1Z5 / U60200DL2002GOI114755',
              orgName: currentUser?.institutionName || 'Metropolitan Infrastructure Corp',
              authorizedSignatoryDesignation: 'Executive Engineer / Authorized Procurement Lead',
              verifiedAt: new Date().toISOString(),
            }
          : undefined,
    };

    updateUserVerification(verifiedDetails);
    setStep('success');
    showToast(`Identity & Credentials successfully verified via DigiLocker!`, 'success');
  };

  // Automatically redirect to dashboard after verification success
  React.useEffect(() => {
    let timer: any;
    if (step === 'success') {
      timer = setTimeout(() => {
        if (onVerificationComplete) {
          onVerificationComplete({
            status: 'verified',
            digilockerVerified: true,
            aadhaarMaskedUid: simulatedAadhaarMasked,
            eKycRefToken: `DL-EKYC-${Date.now().toString().slice(-8)}`,
            verifiedAt: new Date().toISOString(),
          });
        }
        onClose();
      }, 1600);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* DigiLocker Branded Banner Header */}
        <div className="bg-gradient-to-r from-[#062B3A] via-[#062B3A] to-[#35C6B0] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <img
                src="https://img1.digitallocker.gov.in/assets/img/digilocker_logo.png"
                alt="DigiLocker"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <ShieldCheck className="w-6 h-6 text-[#062B3A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">DigiLocker & MeriPehchaan</h3>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Govt. of India Standard
                </span>
              </div>
              <p className="text-xs text-slate-200">
                Decentralized Trust & Cooperative Credential Verification Gateway
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs bg-black/20 p-2 rounded-xl border border-white/10">
            <Lock className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span className="text-[11px] text-slate-200">
              Role: <strong className="text-white uppercase">{effectiveRole}</strong> • DPDP Act Compliant (Zero Raw Aadhaar Storage)
            </span>
          </div>
        </div>

        {/* Modal Content Steps */}
        <div className="p-5 sm:p-6">
          {/* STEP 1: INTRO & ROLE PIPELINE OVERVIEW */}
          {step === 'intro' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#35C6B0] flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="font-black text-base text-[#062B3A]">
                  Verify Your {effectiveRole.toUpperCase()} Identity
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  AATRAL connects directly with DigiLocker and National Cooperative Registries to issue cryptographic proofs of credentials and identity.
                </p>
              </div>

              {/* Pipeline Stages Checklist */}
              <div className="space-y-2.5 bg-[#F7F7F2] p-4 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Verification Stages for {effectiveRole}:
                </p>
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#35C6B0]/10 text-[#35C6B0] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-bold text-xs text-slate-900">{stage.title}</h5>
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {stage.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Protection Guarantee Notice */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Privacy First:</strong> No 12-digit Aadhaar number is saved. AATRAL stores only anonymized cryptographic e-KYC reference hashes and verified skill attributes on the cooperative decentralized ledger.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Verify Later
                </button>
                <button
                  onClick={handleStartConsent}
                  className="flex-2 py-3 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md shadow-[#35C6B0]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <img
                    src="https://img1.digitallocker.gov.in/assets/img/digilocker_logo.png"
                    alt=""
                    className="w-4 h-4 object-contain brightness-0 invert"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span>Proceed to DigiLocker Consent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DIGILOCKER CONSENT & AUTHENTICATION SCREEN */}
          {step === 'consent' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    DL
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">DigiLocker Consent Artifact</h5>
                    <p className="text-[10px] text-slate-500">Ministry of Electronics & IT (MeitY)</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                  Status: Consent Requested
                </span>
              </div>

              <p className="text-xs text-slate-600">
                You are authorizing <strong>AATRAL Decentralized Cooperative Gateway</strong> to fetch and verify the following digital certificates from your DigiLocker repository:
              </p>

              {/* Consent items */}
              <div className="space-y-2.5">
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAadhaar}
                    onChange={(e) => setConsentAadhaar(e.target.checked)}
                    className="mt-0.5 rounded text-[#35C6B0] focus:ring-[#35C6B0]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">UIDAI Aadhaar e-KYC Offline XML</span>
                    <span className="text-[11px] text-slate-500">
                      Masked UID (XXXX-XXXX-7419), Full Name, Age Bracket & State of Residence.
                    </span>
                  </div>
                </label>

                {(effectiveRole === 'worker' || effectiveRole === 'admin') && (
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentOrg}
                      onChange={(e) => setConsentOrg(e.target.checked)}
                      className="mt-0.5 rounded text-[#35C6B0] focus:ring-[#35C6B0]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">
                        Cooperative Society Registration & Membership Roll Token
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Primary Labour Cooperative affiliation and Registrar Membership Roll check.
                      </span>
                    </div>
                  </label>
                )}

                {effectiveRole === 'worker' && (
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentCert}
                      onChange={(e) => setConsentCert(e.target.checked)}
                      className="mt-0.5 rounded text-[#35C6B0] focus:ring-[#35C6B0]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">
                        NCVT / ITI / Skill India Digital Trade Certificate
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Official trade skill certification and master craftsman qualification.
                      </span>
                    </div>
                  </label>
                )}

                {effectiveRole === 'institution' && (
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentOrg}
                      onChange={(e) => setConsentOrg(e.target.checked)}
                      className="mt-0.5 rounded text-[#35C6B0] focus:ring-[#35C6B0]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">
                        MCA21 Corporate Registry / GSTIN / GeM Entity Token
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Authorized Signatory authorization and institutional business entity validation.
                      </span>
                    </div>
                  </label>
                )}
              </div>

              {/* OTP Demonstration Prompt */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#062B3A]">DigiLocker 2FA Security PIN / OTP</span>
                  <span className="text-[10px] text-purple-700 font-mono">Demo: 8392</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={mobileOtp}
                  onChange={(e) => setMobileOtp(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg text-xs font-mono font-bold tracking-widest text-center"
                  placeholder="Enter 6-digit DigiLocker PIN / OTP"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => setStep('intro')}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleProcessVerification(true)}
                    className="px-3 py-2.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="Simulate a verification failure for demo testing"
                  >
                    Test Failure Flow
                  </button>

                  <button
                    type="button"
                    disabled={!consentAadhaar}
                    onClick={() => handleProcessVerification(false)}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#062B3A] to-[#35C6B0] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Verify</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REAL-TIME PROGRESS PIPELINE SPINNER */}
          {step === 'processing' && (
            <div className="py-6 space-y-6 text-center animate-in fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#35C6B0] animate-spin" />
                <ShieldCheck className="w-7 h-7 text-[#35C6B0] absolute inset-0 m-auto" />
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-base text-[#062B3A]">
                  Interrogating DigiLocker & Cooperative Registries
                </h4>
                <p className="text-xs text-slate-500">
                  Retrieving cryptographically signed XML artifacts & validating NCVT / CRCS records...
                </p>
              </div>

              <div className="space-y-2 max-w-md mx-auto text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {stages.map((stage, idx) => {
                  const isDone = idx < activePipelineStage;
                  const isCurrent = idx === activePipelineStage;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5">
                      <div className="flex items-center gap-2.5">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#35C6B0] border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-200" />
                        )}
                        <span className={`font-semibold ${isDone ? 'text-emerald-900' : isCurrent ? 'text-[#35C6B0] font-bold' : 'text-slate-400'}`}>
                          {stage.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {isDone ? 'VERIFIED' : isCurrent ? 'FETCHING...' : 'QUEUED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS SEAL & DIGITAL CREDENTIAL ISSUANCE */}
          {step === 'success' && (
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-emerald-950">
                    Identity & Credentials Verified Successfully!
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Cryptographic seal generated and anchored to the Cooperative Society Ledger.
                  </p>
                </div>
              </div>

              {/* Digital Certificate Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#062B3A] to-[#1a1945] text-white space-y-3 shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#35C6B0]/20 blur-xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span className="font-bold text-xs tracking-wider uppercase text-yellow-300">
                      Cooperative Verified Trust Credential
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                    DL-VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Verified Name</span>
                    <span className="font-bold text-white text-xs">{currentUser?.name || 'Verified Member'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Masked e-KYC UID</span>
                    <span className="font-mono font-bold text-slate-200 text-xs">{simulatedAadhaarMasked}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned Role</span>
                    <span className="font-bold text-emerald-300 capitalize text-xs">{effectiveRole}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Issuing Authority</span>
                    <span className="font-semibold text-slate-200 text-[11px]">
                      {effectiveRole === 'worker'
                        ? 'NCVT & Delhi Labour Coop'
                        : effectiveRole === 'institution'
                        ? 'MCA21 & GeM Registry'
                        : effectiveRole === 'admin'
                        ? 'Ministry of Cooperation'
                        : 'UIDAI DigiLocker Resident'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                  <div className="flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-[#35C6B0]" />
                    <span>Hash: 0x9b7a...48e2</span>
                  </div>
                  <span>Issued: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  if (onVerificationComplete) {
                    onVerificationComplete({
                      status: 'verified',
                      digilockerVerified: true,
                      aadhaarMaskedUid: simulatedAadhaarMasked,
                      eKycRefToken: `DL-EKYC-${Date.now().toString().slice(-8)}`,
                      verifiedAt: new Date().toISOString(),
                    });
                  }
                  onClose();
                }}
                className="w-full py-3 bg-[#062B3A] hover:bg-[#05222E] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span>Entering Verified {effectiveRole.toUpperCase()} Dashboard...</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 5: FAILURE / RETRY STATE */}
          {step === 'failure' && (
            <div className="space-y-4 animate-in fade-in text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-base text-rose-950">Verification Unsuccessful</h4>
                <p className="text-xs text-rose-800 max-w-md mx-auto">
                  {failureReason || 'We could not retrieve the required digital certificate from DigiLocker repository.'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left">
                <p className="font-bold text-slate-800 mb-1">Common Troubleshooting Steps:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                  <li>Ensure your mobile number is linked to your Aadhaar & DigiLocker account.</li>
                  <li>For Workers: Verify that your trade certificate has been synced with Skill India Digital.</li>
                  <li>For Institutions: Confirm your MCA Corporate Identification Number (CIN) is active.</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Close & Retry Later
                </button>
                <button
                  onClick={() => setStep('consent')}
                  className="flex-1 py-2.5 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Verification</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
