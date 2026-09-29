import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Phone,
  MessageSquare,
  FileText,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  KeyRound,
  Sparkles,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { HouseholdBooking } from '../../types';
import { useApp } from '../../hooks/useApp';
import { LiveWorkerTracker } from './LiveWorkerTracker';
import { InvoiceModal } from '../common/InvoiceModal';
import { ChatDrawer } from '../common/ChatDrawer';

const CANCEL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const CANCEL_REASONS = [
  'Booked by mistake',
  'Found another worker',
  'No longer required',
  'Schedule changed',
  'Price issue',
  'Other',
];

interface BookingTrackerModalProps {
  booking: HouseholdBooking;
  onClose: () => void;
  onOpenGrievance?: (booking: HouseholdBooking) => void;
}

export const BookingTrackerModal: React.FC<BookingTrackerModalProps> = ({
  booking,
  onClose,
  onOpenGrievance,
}) => {
  const { t, updateBookingStatus, rateBooking, cancelBooking, showToast } = useApp();
  const [showChat, setShowChat] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [rating, setRating] = useState(booking.rating || 5);
  const [reviewText, setReviewText] = useState(booking.reviewText || '');
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Update current time every 15 seconds to recompute window eligibility
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  const bookingCreatedAt = booking.createdAt ? new Date(booking.createdAt).getTime() : 0;
  const canCancel =
    booking.status !== 'completed' &&
    booking.status !== 'cancelled' &&
    bookingCreatedAt > 0 &&
    now - bookingCreatedAt <= CANCEL_WINDOW_MS;

  const windowExpired =
    booking.status !== 'completed' &&
    booking.status !== 'cancelled' &&
    bookingCreatedAt > 0 &&
    now - bookingCreatedAt > CANCEL_WINDOW_MS;

  const handleConfirmCancel = () => {
    const finalReason = cancelReason === 'Other' ? (customReason.trim() || 'Other') : cancelReason;
    if (!finalReason) {
      showToast('Please select a cancellation reason.', 'error');
      return;
    }
    cancelBooking(booking.id, finalReason);
    setCancelSuccess(true);
    setShowCancelModal(false);
    showToast('Booking cancelled successfully.', 'success');
  };

  const handleSimulateNextState = () => {
    if (booking.status === 'requested') {
      updateBookingStatus(booking.id, 'matched');
    } else if (booking.status === 'matched') {
      updateBookingStatus(booking.id, 'in_transit');
    } else if (booking.status === 'in_transit') {
      updateBookingStatus(booking.id, 'in_progress');
    } else if (booking.status === 'in_progress') {
      updateBookingStatus(booking.id, 'completed', { paymentStatus: 'paid' });
      setShowReviewBox(true);
    }
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    rateBooking(booking.id, rating, reviewText);
    setShowReviewBox(false);
  };

  const getStatusStep = () => {
    switch (booking.status) {
      case 'requested':
        return 1;
      case 'matched':
        return 2;
      case 'in_transit':
        return 3;
      case 'in_progress':
        return 4;
      case 'completed':
        return 5;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#062B3A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#35C6B0] flex items-center justify-center font-black text-white text-sm">
              CG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{booking.serviceCategoryName}</h3>
                <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded text-yellow-300">
                  {booking.bookingNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {booking.subService} • {t('tracker_scheduled', 'Scheduled')}: {booking.scheduledTimeSlot}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Chat ({booking.chatMessages.length})</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Stepper Bar */}
        <div className="p-4 bg-[#F7F7F2] border-b border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
            <span className={currentStep >= 1 ? 'text-[#35C6B0]' : ''}>{t('tracker_step1', 'Requested')}</span>
            <span className={currentStep >= 2 ? 'text-[#35C6B0]' : ''}>{t('tracker_step2', 'Matched')}</span>
            <span className={currentStep >= 3 ? 'text-[#35C6B0]' : ''}>{t('tracker_step3', 'In Transit')}</span>
            <span className={currentStep >= 4 ? 'text-[#35C6B0]' : ''}>{t('tracker_step4', 'In Progress')}</span>
            <span className={currentStep >= 5 ? 'text-emerald-700' : ''}>{t('tracker_step5', 'Completed')}</span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-[#062B3A] to-[#35C6B0] transition-all duration-500"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-[#1C161A]">
          {/* OTP Security Box */}
          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-[#062B3A] text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-yellow-300">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    Security Verification OTP
                  </p>
                  <p className="text-2xl font-black font-mono tracking-widest text-yellow-300">
                    {booking.otpCode}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Share this code with {booking.assignedWorkerName} when they arrive at your door.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-md font-bold">
                  Escrow Protected: ₹{booking.finalPrice}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{t('tracker_released_only', 'Released only after your satisfaction')}</p>
              </div>
            </div>
          )}

          {/* Interactive Live Worker Tracker */}
          <LiveWorkerTracker
            booking={booking}
            onCallWorker={() => {
              window.open(`tel:${booking.assignedWorkerPhone}`, '_self');
            }}
            onChatWorker={() => setShowChat(true)}
          />

          {/* Apprentice Banner */}
          {booking.apprenticeAssistingId && (
            <div className="px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#35C6B0] text-white flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#062B3A]">Apprentice Assisting On-Site</p>
                <p className="text-[11px] text-[#5A61AA] mt-0.5 leading-snug">
                  A cooperative apprentice is assisting on this job under the direct supervision of your verified professional. Your payment is unaffected, and their training stipend is fully sponsored by the cooperative.
                </p>
              </div>
            </div>
          )}

          {/* Review & Rating Card if Completed */}
          {booking.status === 'completed' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h5 className="font-bold text-xs text-emerald-900">{t('tracker_work_verified', 'Work Verified & Completed')}</h5>
                    <p className="text-[11px] text-emerald-700">{t('tracker_guarantee_active', '30-Day Cooperative Workmanship Guarantee Active')}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInvoice(true)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-900 hover:bg-emerald-100 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#35C6B0]" />
                  <span>{t('tracker_download_invoice', 'Download Invoice')}</span>
                </button>
              </div>

              {booking.reviewText ? (
                <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(booking.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 font-medium">"{booking.reviewText}"</p>
                </div>
              ) : (
                <form onSubmit={handleSaveReview} className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-2.5">
                  <p className="text-xs font-bold text-emerald-950">{t('tracker_rate_work', 'Rate Cooperative Workmanship')}</p>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{rating}.0 / 5</span>
                  </div>
                  <input
                    type="text"
                    placeholder={t('tracker_review_placeholder', 'Write a brief review to support this worker\'s cooperative standing...')}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                  >
                    Submit Review to Society Ledger
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Cancellation Status */}
          {booking.status === 'cancelled' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-900">Booking Cancelled</p>
                {booking.cancellationReason && (
                  <p className="text-[11px] text-rose-700 mt-0.5">Reason: {booking.cancellationReason}</p>
                )}
                <p className="text-[11px] text-rose-500 mt-1">Any escrow amount will be refunded within 2–3 business days.</p>
              </div>
            </div>
          )}

          {/* Cancel Success Banner */}
          {cancelSuccess && booking.status === 'cancelled' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Cancellation confirmed. Refund initiated.
            </div>
          )}

          {/* Cancellation Window */}
          {canCancel && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-800 font-semibold">Cancellation available within 10 min of booking</span>
              </div>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          )}

          {windowExpired && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200">
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Cancellation window expired (only allowed within 10 minutes of booking).</span>
            </div>
          )}

          {/* Action Simulation Bar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#062B3A]">{t('tracker_demo_controls', 'Demonstration Controls')}</p>
              <p className="text-[11px] text-slate-500">
                Step through live simulation lifecycle:
              </p>
            </div>

            <div className="flex items-center gap-2">
              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <button
                  onClick={handleSimulateNextState}
                  className="px-4 py-2 rounded-xl bg-[#062B3A] hover:bg-[#05222E] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('tracker_advance_to', 'Advance Status to:')} {booking.status === 'requested' ? 'Matched' : booking.status === 'matched' ? 'In Transit' : booking.status === 'in_transit' ? 'In Progress' : 'Completed'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {onOpenGrievance && (
                <button
                  onClick={() => onOpenGrievance(booking)}
                  className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{t('tracker_raise_grievance', 'Raise Grievance')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Modals */}
      {showInvoice && <InvoiceModal booking={booking} onClose={() => setShowInvoice(false)} />}
      {showChat && (
        <ChatDrawer
          booking={booking}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm">Cancel Booking</h4>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 font-medium">
                Booking <span className="font-mono font-bold text-[#062B3A]">{booking.bookingNumber}</span> — Select a reason to cancel:
              </p>
              <div className="space-y-2">
                {CANCEL_REASONS.map((reason) => (
                  <label key={reason} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="cancel-reason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={() => setCancelReason(reason)}
                      className="accent-rose-600"
                    />
                    <span className="text-xs font-medium text-slate-700">{reason}</span>
                  </label>
                ))}
              </div>
              {cancelReason === 'Other' && (
                <textarea
                  placeholder="Please describe your reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs resize-none h-16 focus:outline-none focus:border-rose-400"
                />
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={!cancelReason}
                  className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center">Escrow amount will be refunded within 2–3 business days.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
