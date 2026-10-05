import React, { useState } from 'react';
import { X, Fuel, Gift, Star, Zap, CheckCircle2, Lock, TrendingUp, Award, QrCode, ShieldCheck, AlertTriangle } from 'lucide-react';

interface WorkerRewardsModalProps {
  rating: number;
  workerName: string;
  memberId?: string;
  workerAvatar?: string;
  workerId?: string;
  onClose: () => void;
}

const THRESHOLD = 4.5;

// Deterministic Pass ID from worker ID
const generatePassId = (workerId: string = 'WRK-DEFAULT') => {
  const base = workerId.replace(/\D/g, '').padStart(6, '0').slice(0, 6);
  return `AATRAL-FP-${base}-${new Date().getFullYear()}`;
};

const getValidityString = () => {
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();
  return `${month} ${year}`;
};

// --- Digital Fuel Pass Card ---
const FuelPassCard: React.FC<{
  workerName: string;
  memberId: string;
  passId: string;
  workerAvatar?: string;
  onVerify: () => void;
  onClose: () => void;
}> = ({ workerName, memberId, passId, workerAvatar, onVerify, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(6,43,58,0.85)', backdropFilter: 'blur(8px)' }}>
    <div className="relative w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Card */}
      <div
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #0a2218 0%, #062B3A 50%, #0d3d1a 100%)', border: '2px solid rgba(52,198,176,0.4)' }}
      >
        {/* Top stripe */}
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #35C6B0, #E0A922, #35C6B0)' }} />

        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⛽</span>
              <span className="text-white font-black text-sm tracking-wide">AATRAL COOPGIG</span>
            </div>
            <p className="text-[#35C6B0] text-[10px] font-bold uppercase tracking-widest mt-0.5">Fuel Pass – Worker Benefit</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              ACTIVE
            </span>
          </div>
        </div>

        {/* Worker Info */}
        <div className="px-5 pb-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/40 shrink-0">
            {workerAvatar ? (
              <img src={workerAvatar} alt={workerName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-600 to-[#062B3A] flex items-center justify-center">
                <span className="text-white font-black text-xl">{workerName.charAt(0)}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">{workerName}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Cooperative Member</p>
            <p className="text-amber-300 text-[11px] font-mono font-bold mt-0.5">{memberId}</p>
          </div>
        </div>

        {/* Pass Details */}
        <div className="mx-4 mb-4 rounded-2xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(52,198,176,0.2)' }}>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">Pass ID</span>
            <span className="text-white text-[11px] font-mono font-bold">{passId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">Valid For</span>
            <span className="text-amber-300 text-[11px] font-bold">{getValidityString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">Monthly Benefit</span>
            <span className="text-emerald-300 text-[11px] font-bold">₹800 Fuel Subsidy</span>
          </div>
        </div>

        {/* QR Section */}
        <div className="mx-4 mb-4 flex items-center gap-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(52,198,176,0.3)' }}>
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0 p-1">
            <QrCode className="w-full h-full text-[#062B3A]" />
          </div>
          <div>
            <p className="text-white text-[11px] font-bold">Verification Code</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Scan at partner fuel stations</p>
            <p className="text-[#35C6B0] font-mono text-[10px] font-bold mt-1">
              {passId.split('-').slice(-2).join('-')}
            </p>
          </div>
        </div>

        {/* Non-transferable notice */}
        <div className="mx-4 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
          <p className="text-slate-400 text-[10px]">Non-transferable – Valid only for the registered worker.</p>
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-5 space-y-2">
          <button
            onClick={onVerify}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer transition-all"
            style={{ background: 'linear-gradient(90deg, #35C6B0, #0A9E8A)', boxShadow: '0 4px 16px rgba(52,198,176,0.3)' }}
          >
            <ShieldCheck className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Verify Pass
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Prototype disclaimer */}
      <p className="text-center text-slate-500 text-[10px] mt-3">
        🔒 Prototype mock — No real fuel-station integration.
      </p>
    </div>
  </div>
);

// --- Verify Pass Screen ---
const VerifyPassScreen: React.FC<{
  workerName: string;
  memberId: string;
  passId: string;
  workerAvatar?: string;
  isEligible: boolean;
  onBack: () => void;
}> = ({ workerName, memberId, passId, workerAvatar, isEligible, onBack }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(6,43,58,0.9)', backdropFilter: 'blur(8px)' }}>
    <div className="w-full max-w-xs bg-white rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 flex items-center gap-3" style={{ background: isEligible ? 'linear-gradient(135deg, #062B3A, #0d3d1a)' : 'linear-gradient(135deg, #7f1d1d, #450a0a)' }}>
        <ShieldCheck className={`w-6 h-6 ${isEligible ? 'text-emerald-400' : 'text-red-400'}`} />
        <div>
          <p className="text-white font-black text-sm">Pass Verification</p>
          <p className={`text-[10px] font-semibold ${isEligible ? 'text-emerald-300' : 'text-red-300'}`}>AATRAL CoopGig System</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Worker photo + name */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0">
            {workerAvatar ? (
              <img src={workerAvatar} alt={workerName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-600 to-[#062B3A] flex items-center justify-center">
                <span className="text-white font-black text-xl">{workerName.charAt(0)}</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-[#062B3A] font-black text-base">{workerName}</p>
            <p className="text-slate-500 text-xs">Cooperative Member</p>
          </div>
        </div>

        {/* Verification fields */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
          {[
            { label: 'Member ID', value: memberId, mono: true },
            { label: 'Pass ID', value: passId, mono: true },
            { label: 'Status', value: isEligible ? '✅ ACTIVE' : '❌ INVALID', mono: false },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-slate-500 text-xs">{label}</span>
              <span className={`text-xs font-bold ${mono ? 'font-mono text-[#062B3A]' : isEligible ? 'text-emerald-600' : 'text-red-600'}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Verification result */}
        <div className={`p-3 rounded-xl text-center ${isEligible ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-xs font-bold ${isEligible ? 'text-emerald-800' : 'text-red-800'}`}>
            {isEligible
              ? '✅ Pass verified. This fuel pass belongs to the registered cooperative worker.'
              : '❌ Pass invalid. This worker has not yet met the 4.5★ rating requirement.'}
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-xl bg-[#062B3A] hover:bg-[#05222E] text-white text-xs font-bold cursor-pointer transition-colors"
        >
          ← Back to Pass
        </button>
      </div>
    </div>
  </div>
);

// --- Main Rewards Modal ---
export const WorkerRewardsModal: React.FC<WorkerRewardsModalProps> = ({
  rating,
  workerName,
  memberId = 'MBR-000000',
  workerAvatar,
  workerId,
  onClose,
}) => {
  const isEligible = rating >= THRESHOLD;
  const rawProgress = Math.min((rating / THRESHOLD) * 100, 100);
  const displayRating = rating > 0 ? rating.toFixed(1) : '—';
  const passId = generatePassId(workerId);

  const [showFuelPass, setShowFuelPass] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const tips = [
    'Arrive on time or early for every job',
    'Communicate clearly with customers before and after service',
    'Keep your tools clean and workspace tidy',
    'Follow-up after the job to ensure satisfaction',
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(6,43,58,0.72)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Fuel Rewards Modal"
      >
        {/* Modal Card */}
        <div
          className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: isEligible
              ? 'linear-gradient(145deg, #0a2e1e 0%, #062B3A 40%, #0d3d28 100%)'
              : 'linear-gradient(145deg, #1a1a2e 0%, #062B3A 40%, #1c2236 100%)',
            border: isEligible ? '1.5px solid rgba(52,198,176,0.35)' : '1.5px solid rgba(148,163,184,0.2)',
          }}
        >
          {/* Top decorative glow */}
          <div
            className="absolute inset-x-0 top-0 h-1 rounded-t-3xl"
            style={{
              background: isEligible
                ? 'linear-gradient(90deg, #35C6B0, #E0A922, #35C6B0)'
                : 'linear-gradient(90deg, #64748b, #94a3b8, #64748b)',
            }}
          />

          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                style={{
                  background: isEligible
                    ? 'linear-gradient(135deg, #E0A922, #f59e0b)'
                    : 'linear-gradient(135deg, #475569, #64748b)',
                  boxShadow: isEligible ? '0 0 20px rgba(224,169,34,0.4)' : 'none',
                }}
              >
                {isEligible ? (
                  <Gift className="w-6 h-6 text-white" />
                ) : (
                  <Gift className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-white font-black text-lg leading-tight">
                    Fuel Rewards
                  </h2>
                  {isEligible && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">Cooperative Achievement Program</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white rounded-xl p-1.5 hover:bg-white/10 transition-all shrink-0 mt-0.5"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Rule Banner */}
          <div className="mx-6 mb-4 rounded-2xl px-4 py-3 border"
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderColor: isEligible ? 'rgba(52,198,176,0.25)' : 'rgba(148,163,184,0.15)',
            }}
          >
            <div className="flex items-start gap-2.5">
              <Fuel className="w-4 h-4 text-[#35C6B0] shrink-0 mt-0.5" />
              <p className="text-slate-200 text-xs leading-relaxed">
                <span className="text-white font-bold">Maintain a 4.5★ or higher rating</span> to earn a{' '}
                <span className="text-[#E0A922] font-bold">Petroleum / Fuel Pass</span> — redeemable monthly at partner fuel stations.
              </p>
            </div>
          </div>

          {/* Rating Progress */}
          <div className="mx-6 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Your Rating Progress</span>
              <span className="text-xs font-black"
                style={{ color: isEligible ? '#35C6B0' : '#E0A922' }}
              >
                {displayRating} / {THRESHOLD.toFixed(1)} ⭐
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${rawProgress}%`,
                  background: isEligible
                    ? 'linear-gradient(90deg, #35C6B0, #E0A922)'
                    : 'linear-gradient(90deg, #f59e0b, #d97706)',
                  boxShadow: isEligible ? '0 0 8px rgba(52,198,176,0.5)' : '0 0 6px rgba(245,158,11,0.4)',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-500 text-[10px]">0.0</span>
              <span className={`text-[10px] font-bold ${isEligible ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isEligible ? '✓ Threshold met' : `${(THRESHOLD - rating).toFixed(1)} more to unlock`}
              </span>
              <span className="text-slate-500 text-[10px]">5.0</span>
            </div>
          </div>

          {/* Status Section */}
          {isEligible ? (
            /* ── UNLOCKED STATE ── */
            <div className="mx-6 mb-4 space-y-3">
              {/* Fuel Pass preview card */}
              <div
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(224,169,34,0.15) 0%, rgba(52,198,176,0.15) 100%)',
                  border: '1.5px solid rgba(224,169,34,0.3)',
                }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
                  style={{ background: 'radial-gradient(circle, #E0A922, transparent)', transform: 'translate(30%, -30%)' }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <span className="text-base">⛽</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">Petroleum Fuel Pass</p>
                    <p className="text-amber-300 text-[10px] font-semibold">Active · Renews Monthly</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { icon: '🏪', label: 'Partner Stations', value: '500+' },
                    { icon: '💰', label: 'Monthly Subsidy', value: '₹800' },
                    { icon: '📱', label: 'Digital Voucher', value: 'QR Code' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/5 rounded-xl p-2 text-center">
                      <p className="text-base">{item.icon}</p>
                      <p className="text-white font-bold text-[11px] mt-0.5">{item.value}</p>
                      <p className="text-slate-400 text-[9px] leading-tight">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional perks */}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Award className="w-3.5 h-3.5 text-[#E0A922] shrink-0" />
                <span>Hi, <span className="text-white font-semibold">{workerName.split(' ')[0]}</span>! Your {displayRating}★ rating qualifies you for EV Charging Pass too.</span>
              </div>
            </div>
          ) : (
            /* ── LOCKED STATE ── */
            <div className="mx-6 mb-4 space-y-3">
              <div
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1.5px dashed rgba(148,163,184,0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-300 font-bold text-sm">Petroleum Fuel Pass</p>
                    <p className="text-amber-400 text-[10px] font-semibold">
                      ⭐ Reach {THRESHOLD.toFixed(1)}★ to unlock — you're at {displayRating}★
                    </p>
                  </div>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  You need <span className="text-amber-300 font-bold">{(THRESHOLD - rating).toFixed(1)} more stars</span> to unlock your Fuel Pass.
                  Keep delivering excellent service!
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#35C6B0]" />
                  <p className="text-slate-300 text-xs font-bold">Tips to unlock faster</p>
                </div>
                <ul className="space-y-1.5">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#E0A922] text-xs mt-0.5 shrink-0">✦</span>
                      <span className="text-slate-400 text-[11px] leading-snug">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="px-6 pb-6">
            <button
              onClick={() => isEligible ? setShowFuelPass(true) : onClose()}
              className="w-full py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer"
              style={{
                background: isEligible
                  ? 'linear-gradient(90deg, #35C6B0, #0A9E8A)'
                  : 'linear-gradient(90deg, #334155, #475569)',
                color: 'white',
                boxShadow: isEligible ? '0 4px 16px rgba(52,198,176,0.3)' : 'none',
              }}
            >
              {isEligible ? '⛽ View My Fuel Pass' : "Keep Going — I'll Earn It!"}
            </button>
            {!isEligible && (
              <p className="text-center text-slate-500 text-[10px] mt-2">
                <Zap className="w-2.5 h-2.5 inline mr-0.5" />
                Each 5-star review brings you closer!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fuel Pass Card Modal */}
      {showFuelPass && !showVerify && (
        <FuelPassCard
          workerName={workerName}
          memberId={memberId}
          passId={passId}
          workerAvatar={workerAvatar}
          onVerify={() => setShowVerify(true)}
          onClose={() => setShowFuelPass(false)}
        />
      )}

      {/* Verify Pass Screen */}
      {showVerify && (
        <VerifyPassScreen
          workerName={workerName}
          memberId={memberId}
          passId={passId}
          workerAvatar={workerAvatar}
          isEligible={isEligible}
          onBack={() => setShowVerify(false)}
        />
      )}
    </>
  );
};
