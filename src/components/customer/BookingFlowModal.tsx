import React, { useState } from 'react';
import {
  X,
  Zap,
  Calendar,
  Clock,
  ShieldCheck,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  Info,
  Sparkles,
  Navigation,
  Plus,
  Home,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { ServiceCategory, HouseholdBooking, Worker } from '../../types';
import { LocationSelectorModal } from '../common/LocationSelectorModal';
import { SavedAddress, formatAddress } from '../../utils/geoUtils';

interface BookingFlowModalProps {
  category: ServiceCategory;
  initialWorker?: Worker;
  onClose: () => void;
  onSuccess: (booking: HouseholdBooking) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  category,
  initialWorker,
  onClose,
  onSuccess,
}) => {
  const {
    t,
    currentUser,
    selectedCity,
    createBooking,
    deductWalletCredit,
    getUserWallet,
    savedAddresses,
    activeAddress,
    setActiveAddress,
    detectGpsLocation,
    showToast,
  } = useApp();


  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isEmergency, setIsEmergency] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(category.subCategories[0] || 'Standard Service');
  const [issueDescription, setIssueDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledSlot, setScheduledSlot] = useState('10:00 AM - 12:00 PM');
  
  const [selectedAddressObj, setSelectedAddressObj] = useState<SavedAddress>(activeAddress || savedAddresses[0]);
  const [addressText, setAddressText] = useState(
    activeAddress ? formatAddress(activeAddress) : 'Flat 402, Block C, Greater Kailash II, New Delhi (PIN: 110048)'
  );
  const [showLocationPickerModal, setShowLocationPickerModal] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'UPI / Card' | 'Cash to Cooperative Receipt' | 'NetBanking' | 'Wallet' | 'Aatral Cash' | 'Mixed'>('UPI / Card');
  const [useWallet, setUseWallet] = useState(false);


  const basePrice = category.basePrice;
  const emergencySurcharge = isEmergency ? 150 : 0;
  const estimatedTotal = basePrice + emergencySurcharge;

  // Read wallet from the global registry
  const walletEntry = currentUser ? getUserWallet(currentUser.id) : { balance: 0, transactions: [], welcomeGranted: false, rewardedBookingIds: [] };
  const walletBal = walletEntry.balance;

  let amountToPay = estimatedTotal;
  let walletUsed = 0;
  if (useWallet && walletBal > 0) {
    if (walletBal >= estimatedTotal) {
      walletUsed = estimatedTotal;
      amountToPay = 0;
    } else {
      walletUsed = walletBal;
      amountToPay = estimatedTotal - walletBal;
    }
  }



  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM',
  ];

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressObj(addr);
    setAddressText(formatAddress(addr));
    setActiveAddress(addr);
  };

  const handleTriggerGps = () => {
    setIsDetectingGps(true);
    detectGpsLocation(
      (loc) => {
        setIsDetectingGps(false);
        setAddressText(loc.addressStr);
        showToast('GPS coordinates acquired! Nearest cooperative hub selected.', 'success');
      },
      () => {
        setIsDetectingGps(false);
        showToast('GPS simulated for demo. You can also edit address manually.', 'info');
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePaymentMethod = walletUsed > 0
      ? (amountToPay === 0 ? 'Aatral Cash' : 'Mixed')
      : paymentMethod;

    const newBooking = createBooking({
      serviceCategoryId: category.id,
      serviceCategoryName: category.name,
      subService: selectedSubCategory,
      issueDescription: issueDescription || `${selectedSubCategory} required at premises.`,
      isEmergency,
      scheduledDate: isEmergency ? new Date().toISOString().split('T')[0] : scheduledDate,
      scheduledTimeSlot: isEmergency ? 'Immediate (Express 30 Mins)' : scheduledSlot,
      customerAddress: addressText,
      estimatedPrice: estimatedTotal,
      finalPrice: estimatedTotal,
      paymentMethod: effectivePaymentMethod,
      walletUsedAmount: walletUsed > 0 ? walletUsed : undefined,
      assignedWorkerId: initialWorker?.id,
      assignedWorkerName: initialWorker?.name,
      assignedWorkerPhone: initialWorker?.phone,
      assignedWorkerPhoto: initialWorker?.avatar,
      assignedWorkerRating: initialWorker?.rating,
      societyId: initialWorker?.societyId,
      societyName: initialWorker?.societyName,
    });

    // Deduct wallet amount immediately on booking confirmation
    if (walletUsed > 0 && currentUser) {
      deductWalletCredit(
        currentUser.id,
        walletUsed,
        `Aatral Cash applied: Booking #${newBooking.bookingNumber}`
      );
    }

    onSuccess(newBooking);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#062B3A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#35C6B0]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{category.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#35C6B0] text-white">
                  Coop Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Fully Wage Protected • Backed by District Skilled Labour Federation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step indicator */}
        <div className="px-6 pt-4 pb-2 bg-[#F7F7F2] border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#35C6B0]' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-[#35C6B0] text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>{t('booking_step1_details', 'Service Details')}</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#35C6B0]' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#35C6B0] text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span>{t('booking_step2_schedule', 'Schedule & Address')}</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#35C6B0]' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#35C6B0] text-white' : 'bg-slate-200 text-slate-600'}`}>
              3
            </span>
            <span>{t('booking_step3_escrow', 'Coop Fair Escrow')}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-[#1C161A]">
          {/* STEP 1: Service Issue & Urgency */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Emergency Switch */}
              <div
                onClick={() => setIsEmergency(!isEmergency)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isEmergency
                    ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-sm'
                    : 'bg-[#F7F7F2] border-slate-200 hover:border-[#35C6B0]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEmergency ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-200 text-slate-600'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs">{t('booking_emergency_title', 'Emergency / Immediate Dispatch (30 Mins)')}</p>
                    <p className="text-[11px] text-slate-500">
                      Auto-dispatches nearest available on-duty cooperative technician with tools
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={() => {}}
                  className="w-4 h-4 accent-amber-600"
                />
              </div>

              {/* Sub-Category Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Specific Task / Sub-Service
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {category.subCategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all ${
                        selectedSubCategory === sub
                          ? 'bg-[#35C6B0]/10 border-[#35C6B0] text-[#062B3A] font-bold shadow-2xs'
                          : 'bg-[#F7F7F2] border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe Issue / Special Requirements (Optional)
                </label>
                <textarea
                  rows={3}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder={t('booking_issue_placeholder', 'e.g. MCB tripping repeatedly when microwave starts; please bring spare 16A switch.')}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#35C6B0]/30 focus:border-[#35C6B0]"
                />
              </div>

              {/* Initial Worker Banner if preselected */}
              {initialWorker && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={initialWorker.avatar} alt={initialWorker.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-emerald-900">{t('booking_assigned', 'Assigned:')} {initialWorker.name}</p>
                      <p className="text-[10px] text-emerald-700">{initialWorker.societyName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                    ★ {initialWorker.rating}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('booking_continue', 'Continue to Schedule & Address')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Date, Slot & Address */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              {!isEmergency ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('booking_select_date', 'Select Service Date')}</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('booking_pref_slot', 'Preferred Time Slot')}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setScheduledSlot(slot)}
                          className={`p-2 rounded-xl text-center text-xs font-medium border transition-all ${
                            scheduledSlot === slot
                              ? 'bg-[#35C6B0] text-white border-[#35C6B0]'
                              : 'bg-[#F7F7F2] border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">{t('booking_express_mode', 'Express 30-Minute Dispatch Mode Active')}</p>
                    <p className="text-[11px] text-amber-700">
                      Nearest certified cooperative emergency mobile squad will be routed immediately.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Service Address / Delivery Destination
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTriggerGps}
                      disabled={isDetectingGps}
                      className="text-[11px] font-bold text-[#35C6B0] hover:text-[#2EAD9A] flex items-center gap-1 cursor-pointer"
                    >
                      <Navigation className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                      <span>{isDetectingGps ? 'Detecting GPS...' : 'Use My GPS'}</span>
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setShowLocationPickerModal(true)}
                      className="text-[11px] font-bold text-[#062B3A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('booking_select_map', 'Select on Map / 28 States')}</span>
                    </button>
                  </div>
                </div>

                {/* Saved Address Pills */}
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressObj?.id === addr.id;
                    const Icon = addr.label === 'Home' ? Home : addr.label === 'Work' ? Briefcase : MapPin;
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#35C6B0]/10 border-[#35C6B0] shadow-xs'
                            : 'bg-[#F7F7F2] border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#35C6B0]' : 'text-slate-500'}`} />
                          <span className={`text-[11px] font-bold ${isSelected ? 'text-[#062B3A]' : 'text-slate-700'}`}>
                            {addr.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {addr.area || addr.city}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#35C6B0] absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    placeholder={t('booking_addr_placeholder', 'Enter complete address, flat no, landmark, pincode...')}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#35C6B0]/30 font-medium text-slate-800"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  India-wide coverage: All 28 States & 8 UTs mapped to local Cooperative Federations.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-2 py-2.5 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>{t('booking_review_price', 'Review Fair Price Breakdown')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Transparent Fair Wage Review & Escrow Confirmation */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              {/* Cooperative Price Box */}
              <div className="bg-gradient-to-br from-[#062B3A] to-[#3a378c] text-white p-4 rounded-2xl shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-3">
                  <div>
                    <span className="text-xs text-slate-300 font-medium">{t('booking_est_total', 'Estimated Booking Total')}</span>
                    <h4 className="text-2xl font-black">₹{estimatedTotal}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      Fair Wage Certified
                    </span>
                    <p className="text-[10px] text-slate-300 mt-1">{t('booking_zero_comm', 'Zero Exploitative Commission')}</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-200">
                  <div className="flex justify-between">
                    <span>{t('booking_base_inspection', 'Base Inspection & Service Callout')}</span>
                    <span className="font-semibold">₹{basePrice}</span>
                  </div>
                  {isEmergency && (
                    <div className="flex justify-between text-amber-300">
                      <span>{t('booking_emerg_surcharge', 'Emergency 30-Min Rapid Surcharge')}</span>
                      <span className="font-semibold">+ ₹150</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-300 pt-1.5 border-t border-white/10 text-[11px]">
                    <span>{t('booking_worker_takehome', 'Worker Take-Home (Maximized)')}</span>
                    <span>₹{Math.round(estimatedTotal * 0.88)}</span>
                  </div>
                  <div className="flex justify-between text-purple-200 text-[11px]">
                    <span>{t('booking_welfare_pool', 'Welfare & Health Insurance Pool (Secured)')}</span>
                    <span>₹{Math.round(estimatedTotal * 0.07)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-2.5 items-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    <strong className="text-emerald-900 block mb-0.5">Payment Protection & Dispute Resolution</strong>
                    Your payment is protected by Ombudsman Escrow. It is released to the worker only after service review/resolution.
                  </p>
                </div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI / Card')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      paymentMethod === 'UPI / Card'
                        ? 'bg-[#35C6B0]/10 border-[#35C6B0] text-[#062B3A]'
                        : 'bg-[#F7F7F2] border-slate-200 text-slate-600'
                    }`}
                  >
                    UPI / Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      paymentMethod === 'NetBanking'
                        ? 'bg-[#35C6B0]/10 border-[#35C6B0] text-[#062B3A]'
                        : 'bg-[#F7F7F2] border-slate-200 text-slate-600'
                    }`}
                  >
                    NetBanking
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash to Cooperative Receipt')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      paymentMethod === 'Cash to Cooperative Receipt'
                        ? 'bg-[#35C6B0]/10 border-[#35C6B0] text-[#062B3A]'
                        : 'bg-[#F7F7F2] border-slate-200 text-slate-600'
                    }`}
                  >
                    Cash on OTP
                  </button>
                </div>
              </div>

              {/* Aatral Cash Wallet Toggle */}
              {walletBal > 0 && (
                <div
                  onClick={() => setUseWallet(!useWallet)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    useWallet
                      ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                      : 'bg-[#F7F7F2] border-slate-200 hover:border-[#35C6B0]/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      useWallet ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">Use Aatral Cash</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Available: <span className="font-bold text-emerald-700">₹{walletBal}</span>
                        {useWallet && (
                          <span className="ml-2 text-emerald-700">
                            → Apply <span className="font-bold">₹{walletUsed}</span>
                            {amountToPay > 0 && (
                              <span className="text-slate-500"> + ₹{amountToPay} via {paymentMethod}</span>
                            )}
                            {amountToPay === 0 && <span className="text-emerald-700 font-bold"> (Full payment!)</span>}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    useWallet ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {useWallet && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              )}

              {/* Updated price summary when wallet is applied */}
              {useWallet && walletUsed > 0 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Service Total</span><span>₹{estimatedTotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Aatral Cash Applied</span><span>-₹{walletUsed}</span>
                  </div>
                  <div className="flex justify-between font-black text-[#062B3A] border-t border-emerald-200 pt-1.5">
                    <span>Amount to Pay Now</span><span>₹{amountToPay}</span>
                  </div>
                </div>
              )}


              {/* Guarantee */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Protected by 30-Day Cooperative Workmanship Guarantee and verified NCVT/ITI skill seal.
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-[#062B3A] hover:bg-[#1e1c50] text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('booking_confirm_dispatch', 'Confirm & Dispatch Cooperative Worker')}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Embedded Location Selector Modal */}
      {showLocationPickerModal && (
        <LocationSelectorModal
          isOpen={showLocationPickerModal}
          onClose={() => setShowLocationPickerModal(false)}
          onSelectAddress={(selected) => {
            setSelectedAddressObj(selected);
            setAddressText(formatAddress(selected));
            setShowLocationPickerModal(false);
          }}
        />
      )}
    </div>
  );
};
