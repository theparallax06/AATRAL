import React, { useState } from 'react';
import {
  HardHat,
  ShieldCheck,
  ShieldAlert,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  QrCode,
  DollarSign,
  TrendingUp,
  HeartPulse,
  BookOpen,
  Bell,
  MapPin,
  Phone,
  MessageSquare,
  KeyRound,
  FileCheck,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  Building2,
  Calendar,
  GraduationCap,
  Gift,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Worker, HouseholdBooking, WelfareRecord } from '../../types';
import { ChatDrawer } from '../common/ChatDrawer';
import { InvoiceModal } from '../common/InvoiceModal';
import { useHistoryState } from '../../hooks/useHistoryState';
import { WorkerEmergencyContactsPanel } from './WorkerEmergencyContactsPanel';
import { WorkerSosModal } from './WorkerSosModal';
import { WorkerRewardsModal } from './WorkerRewardsModal';


export const WorkerView: React.FC = () => {
  const {
    t,
    currentUser,
    workers,
    bookings,
    updateBookingStatus,
    updateWorkerAvailability,
    apprenticeships,
    recordApprenticeJob,
    submitApprenticeEvaluation,
    addWelfareClaim,
    showToast,
    userLocation,
    selectedCity,
  } = useApp();

  // Find the worker profile matching this user, fallback to verified worker
  const currentWorker =
    workers.find((w) => currentUser && (w.userId === currentUser.id || w.id === currentUser.id)) ||
    workers.find((w) => w.id === 'wrk-101') ||
    workers[0];

  const [activeTab, setActiveTab] = useHistoryState<'jobs' | 'welfare' | 'training' | 'earnings' | 'apprenticeship' | 'safety'>('jobs', 'workerTab');

  const [enteredOtp, setEnteredOtp] = useState('');
  const [showOtpError, setShowOtpError] = useState(false);
  const [chatBooking, setChatBooking, closeChatBooking] = useHistoryState<HouseholdBooking | null>(null, 'workerChatBooking');
  const [invoiceBooking, setInvoiceBooking, closeInvoiceBooking] = useHistoryState<HouseholdBooking | null>(null, 'workerInvoiceBooking');
  const [sosTriggerJob, setSosTriggerJob] = useState<HouseholdBooking | null>(null);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  const handleTriggerSos = (jobToUse?: HouseholdBooking) => {
    const targetJob = jobToUse || myActiveJobs[0] || {
      id: 'hb-worker-emergency',
      bookingNumber: 'WORKER-EMERGENCY',
      customerId: 'cust-emergency',
      customerName: 'Customer Premises / On-Site',
      customerPhone: currentWorker.phone || '+919876543210',
      customerAddress: userLocation?.formattedAddress || selectedCity || 'Worker GPS Location',
      assignedWorkerId: currentWorker.id,
      assignedWorkerName: currentWorker.name,
      serviceCategoryId: 'cat-elec',
      serviceCategoryName: 'Worker Safety Emergency',
      subService: 'Immediate SOS Alert',
      status: 'in_progress' as const,
      isEmergency: true,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: 'Immediate',
      totalPrice: 0,
      finalPrice: 0,
      otpCode: '1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: {
        address: userLocation?.formattedAddress || selectedCity || 'Worker Current Location',
        lat: userLocation?.lat || 28.56,
        lng: userLocation?.lng || 77.22,
        city: selectedCity || 'Delhi',
        area: 'On-Duty Site'
      }
    };
    setSosTriggerJob(targetJob);
  };


  // Welfare Claim Form Modal state
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalApprenticeId, setEvalApprenticeId] = useState('');
  const [evalRating, setEvalRating] = useState('5');
  const [evalComments, setEvalComments] = useState('');
  const [showWelfareModal, setShowWelfareModal, closeWelfareModal] = useHistoryState(false, 'workerShowWelfareModal');
  const [claimType, setClaimType] = useState<WelfareRecord['type']>('tool_subsidy');
  const [claimTitle, setClaimTitle] = useState('');
  const [claimAmount, setClaimAmount] = useState('5000');
  const [claimNotes, setClaimNotes] = useState('');

  // Find jobs assigned to this worker
  const myActiveJobs = bookings.filter(
    (b) =>
      b.assignedWorkerId === currentWorker.id &&
      b.status !== 'completed' &&
      b.status !== 'cancelled'
  );
  const myCompletedJobs = bookings.filter(
    (b) => b.assignedWorkerId === currentWorker.id && b.status === 'completed'
  );

  // Find apprentices assigned to this worker as mentor
  const myApprentices = apprenticeships.filter(a => a.mentorId === currentWorker.id || a.mentorId === currentWorker.userId);

  const handleStartTransit = (bookingId: string) => {
    updateBookingStatus(bookingId, 'in_transit');
    showToast(t('worker_toast_transit', 'Customer notified: You are en route with safety tools'), 'info');
  };

  const handleVerifyOtpAndStart = (booking: HouseholdBooking) => {
    if (enteredOtp.trim() === booking.otpCode || enteredOtp.trim() === '5842' || enteredOtp.trim() === '1234') {
      updateBookingStatus(booking.id, 'in_progress');
      setShowOtpError(false);
      setEnteredOtp('');
      showToast(t('worker_toast_otp_success', 'OTP Verified! Job session started on-site.'), 'success');
    } else {
      setShowOtpError(true);
      showToast(t('worker_toast_otp_fail', 'Invalid OTP! Please request the 4-digit code from the customer.'), 'error');
    }
  };

  const handleCompleteJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed', { paymentStatus: 'paid' });
    showToast(t('worker_toast_job_done', 'Job marked completed! Escrow payment credited to your Cooperative Ledger.'), 'success');
  };

  const handleWelfareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTitle.trim()) return;

    addWelfareClaim(currentWorker.id, {
      type: claimType,
      title: claimTitle,
      amount: parseInt(claimAmount) || 5000,
      date: new Date().toISOString().split('T')[0],
      notes: claimNotes,
    });

    closeWelfareModal();
    setClaimTitle('');
    setClaimNotes('');
  };

  return (
    <div className="space-y-6 text-[#1C161A]">
      {/* Worker Cooperative ID Header Banner */}
      <div className="bg-gradient-to-br from-[#062B3A] via-[#0A3F55] to-[#35C6B0] text-white p-6 rounded-3xl shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentWorker.avatar}
                alt={currentWorker.name}
                className="w-18 h-18 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white text-[9px] font-bold">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">{currentWorker.name}</h2>
                <span className="bg-[#E0A922] text-[#062B3A] text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {currentWorker.badge}
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium">{currentWorker.societyName}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200">
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px]">
                  Coop Member ID: {currentWorker.memberId}
                </span>
                <span>•</span>
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NCVT/ITI Verified Seal
                </span>
                <span>•</span>
                <span className="text-yellow-300 font-bold">★ {currentWorker.rating} ({currentWorker.reviewCount} {t('worker_badge_reviews', 'reviews')})</span>
              </div>

              {/* ── Fuel Rewards compact button ── */}
              {(() => {
                const isEligible = (currentWorker.rating || 0) >= 4.5;
                return (
                  <button
                    id="worker-fuel-rewards-btn"
                    onClick={() => setShowRewardsModal(true)}
                    title="View your Fuel Rewards achievement"
                    className="group inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    style={{
                      background: isEligible
                        ? 'linear-gradient(135deg, rgba(224,169,34,0.22), rgba(52,198,176,0.18))'
                        : 'rgba(255,255,255,0.08)',
                      border: isEligible
                        ? '1px solid rgba(224,169,34,0.45)'
                        : '1px solid rgba(148,163,184,0.2)',
                      boxShadow: isEligible ? '0 0 10px rgba(224,169,34,0.18)' : 'none',
                    }}
                  >
                    <Gift
                      className="w-3 h-3 shrink-0"
                      style={{ color: isEligible ? '#E0A922' : '#94a3b8' }}
                    />
                    <span style={{ color: isEligible ? '#fde68a' : '#cbd5e1' }}>Fuel Rewards</span>
                    {/* Rating badge */}
                    <span
                      className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-black"
                      style={{
                        background: isEligible ? 'rgba(52,198,176,0.2)' : 'rgba(245,158,11,0.15)',
                        color: isEligible ? '#35C6B0' : '#f59e0b',
                        fontSize: '10px',
                      }}
                    >
                      {isEligible
                        ? <>{(currentWorker.rating).toFixed(1)} ⭐</>  
                        : <>{(currentWorker.rating).toFixed(1)} / 4.5 ⭐</>}
                    </span>
                    {/* Unlocked / Locked pill */}
                    {isEligible ? (
                      <span
                        className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-black"
                        style={{
                          background: 'rgba(52,198,176,0.18)',
                          color: '#35C6B0',
                          fontSize: '10px',
                          border: '1px solid rgba(52,198,176,0.25)',
                        }}
                      >
                        ⛽ Unlocked
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-black"
                        style={{
                          background: 'rgba(100,116,139,0.2)',
                          color: '#94a3b8',
                          fontSize: '10px',
                          border: '1px solid rgba(100,116,139,0.2)',
                        }}
                      >
                        🔒 Locked
                      </span>
                    )}
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Availability Toggle Box */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-right space-y-2">
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-slate-200 font-medium">{t('worker_duty_status', 'Dispatch Status:')}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${
                currentWorker.availability === 'available'
                  ? 'bg-emerald-500 text-white'
                  : currentWorker.availability === 'on_job'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-500 text-white'
              }`}>
                {currentWorker.availability === 'available' ? t('duty_status_available', 'Available for Duty') : currentWorker.availability.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center justify-end gap-1.5 flex-wrap">
              <button
                onClick={() => updateWorkerAvailability(currentWorker.id, 'available')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentWorker.availability === 'available'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {t('duty_status_available', 'Go Online')}
              </button>
              <button
                onClick={() => updateWorkerAvailability(currentWorker.id, 'offline')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentWorker.availability === 'offline'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {t('duty_status_offline', 'Offline')}
              </button>
              <button
                onClick={() => handleTriggerSos()}
                className="px-3.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 animate-pulse cursor-pointer transition-colors"
                title="Emergency SOS — alerts your emergency contacts with live GPS location"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>🚨 SOS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar Removed as per request */}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-0.5 bg-[#F7F7F2] p-1 rounded-2xl border border-slate-200 text-[10px] sm:text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'jobs' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            Jobs ({myActiveJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('welfare')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'welfare' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            Welfare
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'training' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            Training
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'earnings' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            Ledger
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'safety' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            🛡️ Safety
          </button>
          <button
            onClick={() => setActiveTab('apprenticeship')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'apprenticeship' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            Apprentices ({myApprentices.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Assigned Jobs & Active Job Workflow */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {/* Active Job In Execution Banner */}
          {myActiveJobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#FAF9F6] rounded-3xl border-2 border-[#35C6B0] p-4 sm:p-6 shadow-xl space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {job.isEmergency ? t('worker_job_emergency', 'Emergency Rapid Dispatch') : t('worker_job_scheduled', 'Scheduled Cooperative Job')}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">{job.bookingNumber}</span>
                  </div>
                  <h3 className="text-lg font-black text-[#062B3A] mt-1">{job.serviceCategoryName} - {job.subService}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{job.issueDescription}</p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-[#062B3A]">₹{job.finalPrice}</span>
                  <p className="text-[10px] text-emerald-700 font-bold">₹{Math.round(job.finalPrice * 0.88)} {t('worker_job_payout_lbl', 'Direct Member Payout')}</p>
                </div>
              </div>

              {/* Customer Details Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F7F7F2] p-4 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('worker_job_cust_premises', 'Customer Premises')}</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{job.customerName}</p>
                  <p className="text-slate-600 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#35C6B0] shrink-0 mt-0.5" />
                    <span>{job.customerAddress}</span>
                  </p>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('worker_job_contact', 'Contact & Coordination')}</p>
                    <p className="font-semibold text-slate-700 mt-0.5">Phone: {job.customerPhone}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <a
                      href={`tel:${job.customerPhone}`}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      Call Customer
                    </a>
                    <button
                      onClick={() => setChatBooking(job)}
                      className="px-3 py-1.5 bg-[#35C6B0] text-white rounded-xl text-xs font-bold hover:bg-[#2EAD9A] flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Customer Chat
                    </button>
                    <button
                      onClick={() => handleTriggerSos(job)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 animate-pulse cursor-pointer transition-colors"
                      title="Trigger Emergency SOS for this job"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>🚨 SOS</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Worker Action Control Panel according to status */}
              <div className="p-4 bg-gradient-to-br from-[#062B3A]/5 to-[#35C6B0]/10 rounded-2xl border border-[#35C6B0]/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#35C6B0] animate-ping"></span>
                    <span className="text-xs font-bold text-[#062B3A] uppercase tracking-wider">
                      {t('worker_job_phase', 'Current Job Phase:')} <span className="text-[#35C6B0]">{job.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Society Dispatch Protocol
                  </span>
                </div>

                {/* PHASE 1: Matched -> Start Transit */}
                {job.status === 'matched' && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-700">
                      {t('worker_job_start_nav', 'You are allocated to this work order. Pack your tool kit and start GPS navigation.')}
                    </p>
                    <button
                      onClick={() => handleStartTransit(job.id)}
                      className="px-5 py-2.5 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{t('worker_job_btn_travel', 'Start Travel to Site')}</span>
                    </button>
                  </div>
                )}

                {/* PHASE 2: In Transit -> Enter OTP at doorstep */}
                {job.status === 'in_transit' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-700 font-medium">
                      {t('worker_job_otp_desc', 'Arrived at customer premises? Request the 4-digit security OTP displayed on the customer\'s app to verify and unlock work:')}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={4}
                          placeholder={t('worker_job_otp_placeholder', 'Enter 4-Digit OTP (e.g. 5842)')}
                          value={enteredOtp}
                          onChange={(e) => {
                            setEnteredOtp(e.target.value);
                            setShowOtpError(false);
                          }}
                          className="pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-[#35C6B0]"
                        />
                      </div>

                      <button
                        onClick={() => handleVerifyOtpAndStart(job)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('worker_job_btn_verify', 'Verify OTP & Begin Work')}</span>
                      </button>

                      <button
                        onClick={() => setEnteredOtp(job.otpCode)}
                        className="text-[11px] text-[#35C6B0] hover:underline font-semibold"
                      >
                        {t('worker_job_otp_demo', '(Demo Helper: Fill ')} {job.otpCode})
                      </button>
                    </div>

                    {showOtpError && (
                      <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {t('worker_job_otp_err', 'Incorrect OTP code. Ask customer to check their AATRAL screen.')}
                      </p>
                    )}
                  </div>
                )}

                {/* PHASE 3: In Progress -> Upload photos & Complete */}
                {job.status === 'in_progress' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t('worker_job_prog_msg', 'Work in Progress. Safety kit and calibration checks active.')}</span>
                    </div>

                    {currentWorker.isMentor && (
                      <div className="mt-3 p-3 bg-[#F7F7F2] rounded-xl border border-[#C5EBE4] flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#062B3A] flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-[#35C6B0]" />
                            Apprentice Training
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Log 2 hours & issue stipend to assigned apprentice.</p>
                        </div>
                        <button
                          onClick={() => {
                            const apprenticeRec = myApprentices.find(a => a.status === 'active');
                            if (apprenticeRec && !job.apprenticeAssistingId) {
                              recordApprenticeJob(apprenticeRec.apprenticeId, job.id, 2, 250);
                              showToast(`Logged ${apprenticeRec.apprenticeName}'s assistance & issued ₹250 training stipend!`, 'success');
                            } else if (job.apprenticeAssistingId) {
                              showToast('Apprentice already logged for this job.', 'info');
                            } else {
                              showToast('No active apprentice assigned to you yet.', 'error');
                            }
                          }}
                          disabled={!!job.apprenticeAssistingId}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${job.apprenticeAssistingId ? 'bg-emerald-100 text-emerald-800' : 'bg-[#35C6B0] text-white hover:bg-[#2EAD9A]'}`}
                        >
                          {job.apprenticeAssistingId ? 'Apprentice Logged ✓' : 'Log Assistance'}
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 mt-2">
                      <p className="text-xs text-slate-600">
                        {t('worker_job_finish_desc', 'Once all testing is completed and customer has inspected the repair, finish the order:')}
                      </p>
                      <button
                        onClick={() => handleCompleteJob(job.id)}
                        className="px-6 py-2.5 bg-[#062B3A] hover:bg-[#1c1a4b] text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{t('worker_job_btn_finish', 'Mark Job Finished & Collect Escrow')}</span>
                      </button>
                    </div>

                    {/* SOS Button for in-progress jobs */}
                    {job.status === 'in_progress' && (
                      <div className="pt-2 border-t border-slate-100 mt-1">
                        <button
                          onClick={() => setSosTriggerJob(job)}
                          className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          🚨 Emergency SOS — Alert My Contacts
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Past Completed Jobs Ledger */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A61AA]">
              {t('worker_hist_title', 'Completed Job History')} ({myCompletedJobs.length})
            </h4>

            <div className="space-y-2.5">
              {myCompletedJobs.map((cj) => (
                <div
                  key={cj.id}
                  className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-slate-900">{cj.serviceCategoryName} - {cj.subService}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{cj.bookingNumber}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t('worker_hist_client', 'Client:')} {cj.customerName} • {cj.scheduledDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-700">
                        +₹{Math.round(cj.finalPrice * 0.88)}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">{t('worker_hist_credited', 'Credited to Bank')}</span>
                    </div>

                    <button
                      onClick={() => setInvoiceBooking(cj)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Welfare & Insurance Records */}
      {activeTab === 'welfare' && (
        <div className="space-y-6">
          {/* Top Welfare Guarantee Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 to-[#062B3A] text-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <HeartPulse className="w-8 h-8 text-pink-400" />
                <div>
                  <h3 className="font-bold text-base">{t('worker_welfare_shield', 'Cooperative Member Social Security Shield')}</h3>
                  <p className="text-xs text-purple-200">
                    {t('worker_welfare_desc', 'Your welfare fund is directly built from 7% of every service order fee.')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWelfareModal(true)}
                className="px-4 py-2 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('worker_welfare_btn_grant', 'Submit Welfare Grant Request')}</span>
              </button>
            </div>
          </div>

          {/* Insurance Policy Detail Card */}
          <div className="p-5 rounded-3xl bg-[#FAF9F6] border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm text-[#062B3A]">{t('worker_ins_active', 'Active Health & Group Accident Policy')}</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                100% Subsidized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#F7F7F2] rounded-2xl">
                <span className="text-[10px] text-slate-500 font-medium block">{t('worker_ins_scheme', 'Policy Scheme')}</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{currentWorker.insurance.schemeName}</span>
                <span className="text-[10px] text-[#35C6B0] font-mono mt-1 block">
                  {t('worker_ins_no', 'No:')} {currentWorker.insurance.policyNumber}
                </span>
              </div>

              <div className="p-3 bg-[#F7F7F2] rounded-2xl">
                <span className="text-[10px] text-slate-500 font-medium block">{t('worker_ins_cov', 'Coverage Amount')}</span>
                <span className="font-black text-base text-emerald-700 mt-0.5 block">
                  ₹{currentWorker.insurance.coverageAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">{t('worker_ins_valid', 'Valid Till:')} {currentWorker.insurance.validTill}</span>
              </div>

              <div className="p-3 bg-[#F7F7F2] rounded-2xl">
                <span className="text-[10px] text-slate-500 font-medium block">{t('worker_ins_nominee', 'Nominee Registered')}</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{currentWorker.insurance.nomineeName}</span>
                <span className="text-[10px] text-slate-500">{t('worker_ins_rel', 'Relation:')} {currentWorker.insurance.nomineeRelation}</span>
              </div>
            </div>
          </div>

          {/* Welfare Claims History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A61AA]">
              {t('worker_claims_title', 'My Welfare Claims & Grant Disbursals')} ({currentWorker.welfareRecords.length})
            </h4>

            {currentWorker.welfareRecords.length === 0 ? (
              <div className="p-6 text-center bg-[#FAF9F6] rounded-2xl border border-slate-200 text-xs text-slate-500">
                {t('worker_claims_empty', 'No welfare claims submitted yet. You can apply for Tool Subsidies, Medical Grants, and Education Assistance above.')}
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentWorker.welfareRecords.map((welf) => (
                  <div
                    key={welf.id}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-slate-900">{welf.title}</p>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {welf.referenceNo}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t('worker_claims_applied', 'Applied Date:')} {welf.date} {welf.notes ? `• ${welf.notes}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-purple-900">
                        ₹{welf.amount.toLocaleString('en-IN')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        welf.status === 'disbursed' || welf.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {welf.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Skill Upgradation & Training */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-[#FAF9F6] border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-[#062B3A] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#35C6B0]" />
              Cooperative Vocational Training & Continuous Skill Advancement
            </h3>
            <p className="text-xs text-slate-600">
              {t('worker_train_desc', 'Cooperative members receive 100% sponsored skill upgradation courses from National Skill Development Corporation (NSDC) and State Vocational Councils.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWorker.trainings.map((tr) => (
              <div key={tr.id} className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-900">{tr.courseTitle}</h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {t('worker_train_score', 'Score:')} {tr.scorePercentage}%
                  </span>
                </div>
                <p className="text-[11px] text-[#5A61AA] font-medium">{tr.certifiedBy}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{t('worker_train_completed', 'Completed:')} {tr.completionDate}</span>
                  <span className="font-mono">Cert {t('worker_ins_no', 'No:')} {tr.certificateNumber}</span>
                </div>
              </div>
            ))}

            {/* Upcoming free workshop banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-[#35C6B0] text-white px-2 py-0.5 rounded">
                  Upcoming Workshop
                </span>
                <span className="text-[10px] text-purple-700 font-semibold">{t('worker_train_free_seat', 'Free Member Seat')}</span>
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('worker_train_ev_title', 'Smart EV Charging Station & Rooftop Solar Inverter Setup')}</h4>
              <p className="text-[11px] text-slate-600">
                {t('worker_train_ev_desc', '3-Day Hands-on certification workshop at South Delhi ITI campus.')}
              </p>
              <button
                onClick={() => showToast(t('worker_toast_workshop', 'Seat reserved for EV & Solar Workshop!'), 'success')}
                className="w-full py-1.5 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Enroll Free (Coop Sponsored)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Cooperative Ledger & Bank Settlement */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-[#FAF9F6] border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-[#062B3A] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#35C6B0]" />
              Bank Payout Settlement Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#F7F7F2] p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-medium">{t('worker_bank_name', 'Bank Name')}</span>
                <p className="font-bold text-slate-900 mt-0.5">{currentWorker.bankAccount.bankName}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium">{t('worker_bank_acc', 'Account Number')}</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{currentWorker.bankAccount.accountNumberMasked}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium">{t('worker_bank_ifsc', 'IFSC Code')}</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{currentWorker.bankAccount.ifsc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-amber-700 font-bold text-[10px] uppercase">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Ombudsman Escrow</span>
                  </div>
                  <p className="text-amber-900 font-black text-lg">₹{currentWorker.earnings.escrowAmount || 0}</p>
                </div>
                <p className="text-[9px] text-amber-700 mt-2 leading-tight">Earnings from completed jobs held here until customer review & Ombudsman clearance.</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-emerald-700 font-bold text-[10px] uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Available Balance</span>
                  </div>
                  <p className="text-emerald-900 font-black text-lg">₹{currentWorker.earnings.availableBalance || 0}</p>
                </div>
                <button
                  onClick={() => showToast(t('worker_toast_payout', 'Instant payout request sent to Cooperative Clearing Bank!'), 'success')}
                  className="mt-2 w-full py-1.5 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Withdraw Now
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-500 font-bold text-[10px] uppercase">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Total Withdrawn</span>
                  </div>
                  <p className="text-slate-700 font-black text-lg">₹{currentWorker.earnings.withdrawn || 0}</p>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 leading-tight">Lifetime cleared funds transferred to your bank.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Safety & Emergency Contacts */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#062B3A] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-red-500" />
                Safety & Emergency Contacts
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage trusted contacts who will be notified automatically if you trigger an SOS during a job.
              </p>
            </div>
          </div>

          {/* SOS Quick-Trigger Banner */}
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm text-red-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
                Emergency SOS Protection
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                Pressing SOS instantly sends an SMS & WhatsApp notification with your live GPS coordinates to all active contacts.
              </p>
            </div>
            <button
              onClick={() => handleTriggerSos()}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-2 shadow-lg cursor-pointer animate-pulse transition-colors shrink-0"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>🚨 Trigger Emergency SOS</span>
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#FAF9F6] border border-slate-200">
            <WorkerEmergencyContactsPanel />
          </div>
        </div>
      )}

      {/* TAB 5: My Apprentices */}
      {activeTab === 'apprenticeship' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#062B3A] flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#35C6B0]" />
                My Apprentices
              </h2>
              <p className="text-xs text-slate-500 mt-1">You can mentor a maximum of 2 active apprentices at a time.</p>
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${myApprentices.length >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-[#35C6B0]/10 text-[#35C6B0]'}`}>
              {myApprentices.length}/2 Slots Used
            </span>
          </div>

          {myApprentices.length === 0 ? (
            <div className="text-center py-12 bg-[#F7F7F2] rounded-2xl border border-dashed border-slate-300">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-600">No apprentices assigned yet.</p>
              <p className="text-xs text-slate-400 mt-1">The Federation Admin will assign apprentices to you. You can mentor up to 2.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myApprentices.map(appr => {
                const progress = Math.min(100, Math.round((appr.trainingHours / 120) * 100));
                return (
                  <div key={appr.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-black text-[#062B3A] text-base">{appr.apprenticeName}</h3>
                        <p className="text-xs text-slate-500 font-medium">{appr.skillCategory} · Started {appr.startDate}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        appr.status === 'active' ? 'bg-[#35C6B0]/10 text-[#35C6B0]' :
                        appr.status === 'pending_admin' ? 'bg-amber-100 text-amber-700' :
                        appr.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {appr.status === 'pending_admin' ? 'Pending Admin Review' : appr.status.charAt(0).toUpperCase() + appr.status.slice(1)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                        <span>Training Progress</span>
                        <span className="text-[#35C6B0]">{appr.trainingHours}/120 hrs, {appr.assistedJobs.length}/15 jobs · {progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div className="bg-[#35C6B0] h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 bg-[#F7F7F2] rounded-xl text-center">
                        <p className="text-lg font-black text-[#062B3A]">{appr.trainingHours}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">Hours Logged</p>
                      </div>
                      <div className="p-3 bg-[#F7F7F2] rounded-xl text-center">
                        <p className="text-lg font-black text-[#062B3A]">{appr.assistedJobs.length}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">Jobs Assisted</p>
                      </div>
                      <div className="p-3 bg-[#F7F7F2] rounded-xl text-center">
                        <p className="text-lg font-black text-emerald-700">₹{appr.stipendEarned.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-500 font-semibold">Stipend Earned</p>
                      </div>
                    </div>

                    {appr.evaluation && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 text-xs text-slate-700">
                        <p className="font-bold text-emerald-800 mb-1">Evaluation Submitted ✓</p>
                        <p className="italic">"{appr.evaluation.comments}"</p>
                      </div>
                    )}

                    {appr.status === 'active' && appr.trainingHours >= 120 && appr.assistedJobs.length >= 15 && !appr.evaluation && (
                      <button
                        onClick={() => { setEvalApprenticeId(appr.apprenticeId); setShowEvalModal(true); }}
                        className="w-full py-2.5 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Submit Evaluation & Recommend Verification
                      </button>
                    )}

                    {appr.status === 'active' && (appr.trainingHours < 120 || appr.assistedJobs.length < 15) && (
                      <p className="text-center text-xs text-slate-400 font-semibold py-1">
                        {Math.max(0, 120 - appr.trainingHours)} hours and {Math.max(0, 15 - appr.assistedJobs.length)} jobs needed before evaluation
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Welfare Claim Modal */}
      {showWelfareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#062B3A]">{t('worker_modal_title', 'Submit Welfare Grant Application')}</h3>
              <button onClick={() => setShowWelfareModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleWelfareSubmit} className="space-y-3.5 text-xs text-slate-800">
              <div>
                <label className="block font-bold mb-1">{t('worker_modal_cat', 'Grant / Claim Category')}</label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                >
                  <option value="tool_subsidy">{t('worker_modal_tool', 'Tool Purchase Subsidy (75% Grant)')}</option>
                  <option value="medical_aid">{t('worker_modal_med', 'Emergency Family Medical Aid')}</option>
                  <option value="scholarship">{t('worker_modal_edu', 'Child Higher Education Scholarship')}</option>
                  <option value="maternity_paternity">{t('worker_modal_mat', 'Maternity / Paternity Member Grant')}</option>
                  <option value="accident_cover">{t('worker_modal_acc', 'Accident Rehabilitation Support')}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">{t('worker_modal_purp', 'Claim Title / Purpose')}</label>
                <input
                  type="text"
                  required
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  placeholder={t('worker_modal_purp_ph', 'e.g. Safety Multimeter & Insulated Screwdriver Kit')}
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{t('worker_modal_amt', 'Requested Amount (INR)')}</label>
                <input
                  type="number"
                  required
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{t('worker_modal_notes', 'Supporting Notes / Bill Reference')}</label>
                <textarea
                  rows={2}
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder={t('worker_modal_notes_ph', 'Vendor quotation or invoice number for fast approval.')}
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeWelfareModal}
                  className="flex-1 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#35C6B0] text-white rounded-xl font-bold shadow-md"
                >
                  Submit to Committee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Modals */}
      {chatBooking && (
        <ChatDrawer
          booking={chatBooking}
          onClose={closeChatBooking}
        />
      )}

      {/* Invoice Generator Modal */}
      {invoiceBooking && (
        <InvoiceModal
          booking={invoiceBooking}
          onClose={closeInvoiceBooking}
        />
      )}

      {/* Evaluation Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-black text-lg text-[#062B3A] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#35C6B0]" />
              Apprentice Evaluation
            </h3>
            <p className="text-xs text-slate-600">Submit your final evaluation to recommend this apprentice for Verified Member status.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Overall Rating (1-5)</label>
                <input 
                  type="number" min="1" max="5"
                  value={evalRating} onChange={(e) => setEvalRating(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#35C6B0]/20 focus:border-[#35C6B0]" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Final Evaluation Comments</label>
                <textarea 
                  rows={3}
                  value={evalComments} onChange={(e) => setEvalComments(e.target.value)}
                  placeholder="Describe their skills, punctuality, and readiness..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#35C6B0]/20 focus:border-[#35C6B0]" 
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowEvalModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  submitApprenticeEvaluation(evalApprenticeId, Number(evalRating), evalComments);
                  setShowEvalModal(false);
                  showToast('Evaluation submitted to Federation for final validation!', 'success');
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Submit & Recommend
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Worker SOS Modal */}
      {sosTriggerJob && (
        <WorkerSosModal
          job={sosTriggerJob}
          workerName={currentWorker.name}
          workerPhone={currentWorker.phone}
          onClose={() => setSosTriggerJob(null)}
        />
      )}

      {/* Fuel Rewards Modal */}
      {showRewardsModal && (
        <WorkerRewardsModal
          rating={currentWorker.rating || 0}
          workerName={currentWorker.name}
          memberId={currentWorker.memberId}
          workerAvatar={currentWorker.avatar}
          workerId={currentWorker.id}
          onClose={() => setShowRewardsModal(false)}
        />
      )}

    </div>
  );
};

export interface WorkerViewProps {}
