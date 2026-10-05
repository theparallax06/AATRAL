import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  HardHat,
  Building2,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  TrendingUp,
  MapPin,
  Clock,
  Award,
  Zap,
  Lock,
  DollarSign,
  FileCheck,
  Building,
  Check,
  Sliders,
  ChevronRight,
  Activity,
  Layers,
  PhoneCall,
  Flame,
  Shield,
  Briefcase,
  Wrench,
  Search,
  Navigation,
  Compass,
  Calendar,
  CreditCard,
  Star,
  Cpu,
  BrainCircuit,
  PieChart,
  UserCheck,
  BriefcaseBusiness,
  Coins,
  Paintbrush,
  Hammer,
  Car,
  Trees,
  HeartPulse,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { UserRole } from '../../types';
import { LocationSelectorModal } from '../common/LocationSelectorModal';

interface LandingPageViewProps {
  onOpenAuth: (initialRole?: UserRole) => void;
  onNavigateToDashboard: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenAuth,
  onNavigateToDashboard,
  onSelectCategory,
}) => {
  const {
    currentUser,
    currentRole,
    t,
    categories,
    workers,
    allocationConfig,
    activeAddress,
    selectedCity,
    detectGpsLocation,
    userLocation,
    showToast,
  } = useApp();

  const handleRoleAction = (targetRole: UserRole) => {
    if (!currentUser) {
      onOpenAuth(targetRole);
    } else if (currentRole === targetRole) {
      onNavigateToDashboard();
    } else {
      showToast(`You are currently signed in as a ${currentRole.toUpperCase()}. Please sign out to access the ${targetRole.toUpperCase()} portal.`, 'info');
    }
  };

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const verifiedCount = workers.filter((w) => w.verificationStatus === 'verified').length;

  const handleGpsClick = () => {
    setIsDetectingGps(true);
    detectGpsLocation();
    setTimeout(() => {
      setIsDetectingGps(false);
      showToast('GPS Location updated successfully!', 'success');
    }, 800);
  };

  const handleServiceClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      handleRoleAction('customer');
    }
  };

  // 9 Core Services with authentic imagery & pricing
  const servicesList = [
    {
      id: 'cat-plumbing',
      name: t('srv_name_plumbing', 'Plumbing'),
      title: t('srv_title_plumbing_sanitary_works', 'Plumbing & Sanitary Works'),
      desc: t('srv_desc_leak_repairs_pipe_installations', 'Leak repairs, pipe installations, drain unclogging, water tank sanitization & pump motors.'),
      rate: t('srv_rate__249_base', '₹249 base'),
      workersCount: 38,
      img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_immediate_callout', 'Immediate Callout'),
      icon: Wrench,
    },
    {
      id: 'cat-electrical',
      name: t('srv_name_electrical', 'Electrical'),
      title: t('srv_title_electrical_smart_grid', 'Electrical & Smart Grid'),
      desc: t('srv_desc_ncvt_certified_wiring_mcb', 'NCVT certified wiring, MCB tripping, inverter setup, smart switchboards & heavy appliance cabling.'),
      rate: t('srv_rate__299_base', '₹299 base'),
      workersCount: 42,
      img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_ncvt_certified', 'NCVT Certified'),
      icon: Zap,
    },
    {
      id: 'cat-carpentry',
      name: t('srv_name_carpentry', 'Carpentry'),
      title: t('srv_title_carpentry_woodwork', 'Carpentry & Woodwork'),
      desc: t('srv_desc_furniture_repair_modular_fittings', 'Furniture repair, modular fittings, lock replacement, bespoke cabinetry & wood polishing.'),
      rate: t('srv_rate__349_base', '₹349 base'),
      workersCount: 29,
      img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_artisan_guild', 'Artisan Guild'),
      icon: Hammer,
    },
    {
      id: 'cat-painting',
      name: t('srv_name_painting', 'Painting'),
      title: t('srv_title_painting_waterproofing', 'Painting & Waterproofing'),
      desc: t('srv_desc_eco_friendly_interior_exterior_painting_anti_fungal', 'Eco-friendly interior/exterior painting, anti-fungal waterproofing & texture finishes.'),
      rate: t('srv_rate__499_base', '₹499 base'),
      workersCount: 31,
      img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_3_year_warranty', '3-Year Warranty'),
      icon: Paintbrush,
    },
    {
      id: 'cat-cleaning',
      name: t('srv_name_cleaning', 'Cleaning'),
      title: t('srv_title_deep_cleaning_sanitization', 'Deep Cleaning & Sanitization'),
      desc: t('srv_desc_hospital_grade_deep_kitchen', 'Hospital-grade deep kitchen & bathroom sanitization, sofa foam shampooing & full home cleans.'),
      rate: t('srv_rate__399_base', '₹399 base'),
      workersCount: 51,
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_insured_staff', 'Insured Staff'),
      icon: Sparkles,
    },
    {
      id: 'cat-caregiving',
      name: t('srv_name_caregiving', 'Caregiving'),
      title: t('srv_title_elderly_care_nursing_assist', 'Elderly Care & Nursing Assist'),
      desc: t('srv_desc_certified_geriatric_attendants_post_operative', 'Certified geriatric attendants, post-operative bedside aides, vitals monitoring & mobility assist.'),
      rate: t('srv_rate__650_shift', '₹650 / shift'),
      workersCount: 22,
      img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_paramedical_aides', 'Paramedical Aides'),
      icon: HeartPulse,
    },
    {
      id: 'cat-driving',
      name: t('srv_name_driving', 'Driving'),
      title: t('srv_title_chauffeur_fleet_driving', 'Chauffeur & Fleet Driving'),
      desc: t('srv_desc_police_rto_verified', 'Police & RTO verified commercial and private car chauffeurs for hourly duty and outstation trips.'),
      rate: t('srv_rate__400_slot', '₹400 / slot'),
      workersCount: 34,
      img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_rto_verified', 'RTO Verified'),
      icon: Car,
    },
    {
      id: 'cat-gardening',
      name: t('srv_name_gardening', 'Gardening'),
      title: t('srv_title_gardening_landscaping', 'Gardening & Landscaping'),
      desc: t('srv_desc_horticulture_guild_malis_for', 'Horticulture guild malis for balcony terrace setup, organic plant care, pruning & lawn care.'),
      rate: t('srv_rate__349_base', '₹349 base'),
      workersCount: 18,
      img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_horticulture_guild', 'Horticulture Guild'),
      icon: Trees,
    },
    {
      id: 'cat-technician',
      name: t('srv_name_technician', 'Technician'),
      title: t('srv_title_appliance_solar_technician', 'Appliance & Solar Technician'),
      desc: t('srv_desc_oem_certified_hvac_diagnostics', 'OEM certified HVAC diagnostics, inverter AC gas refilling, refrigerator PCBs & rooftop solar audits.'),
      rate: t('srv_rate__399_base', '₹399 base'),
      workersCount: 27,
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      badge: t('srv_badge_oem_certified', 'OEM Certified'),
      icon: Cpu,
    },
  ];

  return (
    <div className="space-y-20 py-2 animate-in fade-in">
      {/* ========================================================================= */}
      {/* 1. PUBLIC LANDING PAGE - HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062B3A] via-[#0A3F55] to-[#35C6B0] text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-white/10">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-[#E0A922]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-[#35C6B0]/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Tag Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E0A922] text-[#062B3A] shadow-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {t('landing_badge_democratic', 'Democratic Labour Cooperative Federation')}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {t('landing_badge_multistate', 'Multi-State Cooperative Societies Act Compliant')}
            </span>
          </div>

          {/* Exact Hero Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              {t('landing_hero_title_1', 'Local Skills. Local Services.')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-white">
                {t('landing_hero_title_2', 'Stronger Communities.')}
              </span>
            </h1>

            {/* Exact Supporting Line */}
            <p className="text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed font-normal">
              {t('landing_hero_desc', 'AATRAL connects people who need trusted local services with verified cooperative workers, while helping cooperatives organize work, create employment and serve institutions.')}
            </p>
          </div>

          {/* Primary & Secondary Call to Actions */}
          {!currentUser ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenAuth('customer')}
                className="px-7 py-3.5 bg-[#E0A922] hover:bg-yellow-400 text-[#062B3A] rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#062B3A]" />
                <span>{t('register_now', 'Get Started')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAuth('customer')}
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-bold text-sm border border-white/30 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xs"
              >
                <Lock className="w-4 h-4 text-slate-200" />
                <span>{t('sign_in', 'Sign In')}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToDashboard}
                className="px-7 py-3.5 bg-[#E0A922] hover:bg-yellow-400 text-[#062B3A] rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#062B3A]" />
                <span>{t('landing_btn_dashboard', 'Go to Dashboard')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Location Bar with GPS & Indian Address Search */}
          <div className="p-3.5 bg-black/25 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#35C6B0] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-300 block">{t('select_location', 'Current Service Location:')}</span>
                <span className="font-bold text-white text-xs">
                  {activeAddress ? `${activeAddress.area}, ${activeAddress.city}, ${activeAddress.state}` : selectedCity}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGpsClick}
                disabled={isDetectingGps}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <Navigation className={`w-3.5 h-3.5 text-yellow-300 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{t('use_my_location', 'Use My Location')}</span>
              </button>

              <button
                onClick={() => setShowLocationModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#35C6B0] hover:bg-[#2EAD9A] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-xs"
              >
                <Search className="w-3.5 h-3.5 text-white" />
                <span>{t('add_new_address', 'Enter / Search Address')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BELOW THE HERO - EXPLAIN THE WHOLE SOLUTION VISUALLY (TWO FLOWS) */}
      {/* ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#35C6B0] uppercase tracking-wider bg-[#35C6B0]/10 px-3.5 py-1 rounded-full">
            {t('landing_workflow_badge', 'Transparent Workflow Architecture')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#062B3A]">
            {t('landing_workflow_title', 'How AATRAL Works - Simply & Transparently')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('landing_workflow_desc', 'A seamless digital bridge connecting retail households and large public institutions to verified cooperative artisans:')}
          </p>
        </div>

        {/* FLOW 1: Household Customer Flow */}
        <div className="p-5 sm:p-8 bg-[#FAF9F6] rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-black text-[#062B3A]">{t('landing_flow1_title', 'Household & Retail Service Flow')}</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2">{t('landing_flow1_subtitle', 'For homeowners, tenants, and small offices')}</p>
              </div>
            </div>
            <button
              onClick={() => handleRoleAction('customer')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t('landing_flow1_btn', 'Try Customer Booking')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            {/* Step 1 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                1
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow1_step1_title', 'Need a Service')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow1_step1_desc', 'Select electrical, plumbing, carpentry, cleaning, caregiving or enter custom requirements.')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                2
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow1_step2_title', 'Find a Verified Worker')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow1_step2_desc', 'Matched with nearby NCVT certified artisans from local labour cooperative societies.')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                3
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow1_step3_title', 'Book / Schedule')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow1_step3_desc', 'Choose 30-min urgent SOS callout or schedule preferred date, time and confirmed address.')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                4
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow1_step4_title', 'Worker Performs Service')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow1_step4_desc', 'Live GPS tracking, secure start OTP, insured workmanship and transparent rate card.')}
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                5
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow1_step5_title', 'Payment & Feedback')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow1_step5_desc', 'Direct UPI/card payment with 88% reaching the worker, itemized bill & rating.')}
              </p>
            </div>
          </div>
        </div>

        {/* FLOW 2: Institutional Work Requirement Flow */}
        <div className="p-5 sm:p-8 bg-[#FAF9F6] rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-black text-[#062B3A]">{t('landing_flow2_title', 'Institutional Enterprise & Government Procurement Flow')}</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2">{t('landing_flow2_subtitle', 'For Metro Rail (DMRC), CPWD, hospitals, universities, and commercial developers')}</p>
              </div>
            </div>
            <button
              onClick={() => handleRoleAction('institution')}
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t('landing_flow2_btn', 'Explore Enterprise Portal')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 relative">
            {/* Inst Step 1 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                1
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow2_step1_title', 'Large Work Requirement')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow2_step1_desc', 'Institution posts requisition for multi-worker trades (e.g. 20 certified electricians).')}
              </p>
            </div>

            {/* Inst Step 2 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                2
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow2_step2_title', 'Cooperative Receives Order')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow2_step2_desc', 'Federation reviews specifications, safety protocols, and statutory compliance.')}
              </p>
            </div>

            {/* Inst Step 3 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                3
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow2_step3_title', 'AI Helps Plan Workforce')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow2_step3_desc', 'Algorithms optimize artisan availability, skill readiness, and minimum travel distance.')}
              </p>
            </div>

            {/* Inst Step 4 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                4
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow2_step4_title', 'Multiple Workers Assigned')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow2_step4_desc', 'Cooperative societies mobilize vetted squads with supervisor leads and safety gear.')}
              </p>
            </div>

            {/* Inst Step 5 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                5
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow2_step5_title', 'Project Completed')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow2_step5_desc', 'Digital muster roll attendance logging, daily check-in audits & milestone sign-offs.')}
              </p>
            </div>

            {/* Inst Step 6 */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                6
              </div>
              <h4 className="font-bold text-xs text-[#062B3A]">{t('landing_flow2_step6_title', 'Settlement & Earnings')}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('landing_flow2_step6_desc', 'Escrow funds released directly into worker passbooks with statutory compliance reports.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. EXPLAIN COOPERATIVE VALUE: "More than a marketplace." */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">
            {t('landing_coop_badge', 'Cooperative Empowerment Architecture')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#062B3A]">
            {t('landing_coop_title', '“More than a marketplace.”')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t('landing_coop_desc', 'AATRAL is a comprehensive digital federation operating system designed to elevate informal labour into recognized, dignified, and prosperous cooperative enterprises.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Val 1 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#062B3A]">{t('landing_val1_title', 'Cooperatives Manage Their Members')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing_val1_desc', 'Digital registries for Primary Labour Societies to track rosters, democratic voting, dividends, and society welfare reserves under the Multi-State Cooperative Societies Act.')}
            </p>
          </div>

          {/* Val 2 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#062B3A]">{t('landing_val2_title', 'Verify Worker Identity, Membership & Skills')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing_val2_desc', '3-tier cryptographic verification linking DigiLocker e-KYC (masked Aadhaar), NCVT National Trade Certificates, and registered society membership books.')}
            </p>
          </div>

          {/* Val 3 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#062B3A]">{t('landing_val3_title', 'Find Work for Available Members')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing_val3_desc', 'Expands member income channels by routing both immediate retail home services and high-volume public sector tenders (Metro, CPWD, Railways) to verified artisans.')}
            </p>
          </div>

          {/* Val 4 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#062B3A]">{t('landing_val4_title', 'Reduce Worker Underutilization')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing_val4_desc', 'Live capacity and utilization radar flags idle hours across trade clusters, dispatching standby squads to high-density demand zones to maximize earnings.')}
            </p>
          </div>

          {/* Val 5 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#062B3A]">{t('landing_val5_title', 'Allocate Workers by Skill, Location & Availability')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing_val5_desc', 'Multi-factor matching engine coordinates exact distance, trade certification grade (NSQF level), and current availability to assign the best artisan every time.')}
            </p>
          </div>

          {/* Val 6 */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-[#062B3A]">{t('landing_val6_title', 'Track Earnings & Comprehensive Welfare')}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('landing_val6_desc', 'Guaranteed 88% direct take-home pay, ₹5,00,000 Group Accident Insurance coverage, and dedicated tool damage repair micro-grants built into every work order.')}
            </p>
          </div>
        </div>

        {/* Highlight Banner: AI Demand Forecasting */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#062B3A] to-[#35C6B0] rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E0A922] text-[#062B3A] text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" />
              {t('landing_ai_badge', 'AI-Powered Capability')}
            </div>
            <h3 className="text-xl sm:text-2xl font-black">{t('landing_ai_title', 'Forecast Future Service Demand Using AI')}</h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {t('landing_ai_desc', 'Our neural network predicts upcoming trade spikes across seasons and weather events (e.g. summer HVAC heatwaves, pre-monsoon plumbing), recommending proactive squad mobilizations.')}
            </p>
          </div>

          <button
            onClick={() => handleRoleAction('admin')}
            className="px-5 py-3 bg-[#E0A922] hover:bg-yellow-400 text-[#062B3A] rounded-2xl font-bold text-xs sm:text-sm shrink-0 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <span>{t('landing_ai_btn', 'View AI Forecasts')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SERVICES SECTION: 9 IMAGE-BASED INTERACTIVE CARDS */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#35C6B0] uppercase tracking-wider bg-[#35C6B0]/10 px-3 py-1 rounded-full">
              {t('landing_services_badge', 'Certified Trade Portfolio')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#062B3A] mt-1">
              {t('landing_services_title', 'Verified Cooperative Services')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('landing_services_desc', 'Click any service card to view available verified technicians and book instantly:')}
            </p>
          </div>

          <button
            onClick={() => handleRoleAction('customer')}
            className="px-4 py-2.5 bg-[#062B3A] text-white text-xs font-bold rounded-xl hover:bg-[#1f1d52] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>{t('landing_services_btn', 'Browse Customer Catalog')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 9 Interactive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv) => {
            const IconComp = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => handleServiceClick(srv.id)}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Service Image with Dark Gradient & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={srv.img}
                      alt={srv.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#062B3A]/90 backdrop-blur-xs text-white text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1">
                      <IconComp className="w-3 h-3 text-yellow-300" />
                      <span>{srv.badge}</span>
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-xs font-bold text-yellow-300 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {srv.rate}
                      </span>
                      <h4 className="font-black text-base text-white leading-tight mt-1">
                        {srv.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2.5">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {srv.desc}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {srv.workersCount} {t('srv_verified_pros', 'verified pros nearby')}
                      </span>
                      <span className="text-slate-400 font-medium">{t('srv_std_rate', 'Standard rate card')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button className="w-full py-2.5 bg-[#F7F7F2] group-hover:bg-[#35C6B0] text-[#062B3A] group-hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>{t('landing_service_book', 'Book {srv.name} Service').replace('{srv.name}', srv.name)}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      {!currentUser && (
        <section className="p-6 sm:p-8 md:p-12 bg-gradient-to-r from-[#062B3A] via-[#0A3F55] to-[#35C6B0] rounded-3xl text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl sm:text-2xl md:text-4xl font-black">
              {t('landing_cta_title', 'Ready to Join India\'s Democratic Skilled Service Federation?')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {t('landing_cta_desc', 'Sign in as a Customer, Member Artisan, Cooperative Society Admin, or Institutional Enterprise Client in seconds.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('customer')}
              className="px-7 py-3.5 bg-[#E0A922] hover:bg-yellow-400 text-[#062B3A] rounded-2xl font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <span>{t('landing_cta_btn1', 'Get Started / Login')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleRoleAction('customer')}
              className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-bold text-xs sm:text-sm border border-white/30 cursor-pointer transition-all"
            >
              <span>{t('landing_cta_btn2', 'Explore Household Customer Services')}</span>
            </button>
          </div>
        </section>
      )}

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </div>
  );
};
