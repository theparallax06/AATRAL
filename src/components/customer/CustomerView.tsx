import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Users,
  HeartPulse,
  Car,
  Trees,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Search,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  FileText,
  MessageSquare,
  Award,
  HeartHandshake,
  TrendingUp,
  Navigation,
  Compass,
  Wallet,
  PlusCircle,
  History,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { ServiceCategory, Worker, HouseholdBooking } from '../../types';
import { BookingFlowModal } from './BookingFlowModal';
import { BookingTrackerModal } from './BookingTrackerModal';
import { WorkerProfileModal } from './WorkerProfileModal';
import { EmergencyContactsPanel } from './EmergencyContactsPanel';
import { SosModal } from './SosModal';
import { InteractiveGeoMap } from '../common/InteractiveGeoMap';
import { LocationSelectorModal } from '../common/LocationSelectorModal';
import { rankAndMatchWorkers } from '../../utils/matchingEngine';
import { formatAddress } from '../../utils/geoUtils';
import { useHistoryState } from '../../hooks/useHistoryState';

interface CustomerViewProps {
  onOpenGrievance: (booking?: HouseholdBooking) => void;
  initialCategoryId?: string;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  onOpenGrievance,
  initialCategoryId,
}) => {
  const {
    t,
    categories,
    workers,
    bookings,
    currentUser,
    selectedCity,
    activeAddress,
    userLocation,
    detectGpsLocation,
    showToast,
    getUserWallet,
  } = useApp();


  const [activeTab, setActiveTab] = useHistoryState<'explore' | 'bookings' | 'workers' | 'map' | 'wallet' | 'safety'>('explore', 'customerTab');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(initialCategoryId || 'all');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [sosTriggerBooking, setSosTriggerBooking] = useState<HouseholdBooking | null>(null);
  
  // Modals state
  const [bookingCategory, setBookingCategory, closeBookingCategory] = useHistoryState<ServiceCategory | null>(null, 'customerBookingCategory');
  const [preselectedWorker, setPreselectedWorker] = useState<Worker | undefined>(undefined);
  const [trackingBooking, setTrackingBooking, closeTrackingBooking] = useHistoryState<HouseholdBooking | null>(null, 'customerTrackingBooking');
  const [viewingWorker, setViewingWorker, closeViewingWorker] = useHistoryState<Worker | null>(null, 'customerViewingWorker');

  // Sync if initialCategoryId changes
  React.useEffect(() => {
    if (initialCategoryId && initialCategoryId !== 'all') {
      setSelectedCategoryFilter(initialCategoryId);
      const matchedCat = categories.find((c) => c.id === initialCategoryId);
      if (matchedCat) {
        showToast(`Selected ${matchedCat.name} services`, 'info');
      }
    }
  }, [initialCategoryId, categories]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return Wrench;
      case 'Zap': return Zap;
      case 'Hammer': return Hammer;
      case 'Paintbrush': return Paintbrush;
      case 'Sparkles': return Sparkles;
      case 'Users': return Users;
      case 'HeartPulse': return HeartPulse;
      case 'Car': return Car;
      case 'Trees': return Trees;
      case 'Cpu': return Cpu;
      default: return Wrench;
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subCategories.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Use matchingEngine to rank workers based on distance to activeAddress or userLocation
  const rankedWorkerResults = rankAndMatchWorkers(workers, {
    customerLat: userLocation?.lat || activeAddress?.lat || 28.56,
    customerLng: userLocation?.lng || activeAddress?.lng || 77.22,
    serviceCategoryId: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : undefined,
  });

  const activeBookings = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <>
    <div className="space-y-6">
      {/* Current Address & GPS Header Bar */}
      <div className="bg-[#FAF9F6] border border-slate-200 p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#35C6B0]/10 text-[#35C6B0] flex items-center justify-center shrink-0 font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {t('cust_service_address', 'Service Address')} ({activeAddress?.label || t('cust_home', 'Home')}):
              </span>
              {userLocation?.isRealGps && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  {t('cust_live_gps', 'Live Device GPS')}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-[#062B3A] line-clamp-1">
              {activeAddress ? formatAddress(activeAddress) : 'Flat 402, Block C, Greater Kailash II, New Delhi'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              detectGpsLocation(
                (loc) => showToast(`GPS location acquired: ${loc.addressStr}`, 'success'),
                () => showToast('Simulated GPS location active for demo', 'info')
              );
            }}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#35C6B0]" />
            <span>{t('cust_use_gps', 'Use GPS')}</span>
          </button>

          <button
            onClick={() => setShowLocationModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#35C6B0] hover:bg-[#2EAD9A] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{t('cust_change_map', 'Change State / Map')}</span>
            <span className="xs:hidden">Change</span>
          </button>
        </div>
      </div>

      {/* Hero Banner with Emergency SOS & Search */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#062B3A] via-[#0A3F55] to-[#35C6B0] text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#E0A922]/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('cust_hero_badge', 'Cooperative-Owned Skilled Marketplace • Zero Middleman Exploitation')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {t('hero_title', 'Book Verified Cooperative Craftsmen & Household Experts')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            {t('hero_subtitle', 'Every technician is certified by their registered Labour Cooperative Society with verified NCVT/ITI credentials, fair wages, and comprehensive insurance coverage.')}
          </p>

          {/* Search bar & quick triggers */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('cust_search_placeholder', 'Search trade, skilled repair, or craftsman...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-[#1C161A] text-xs font-medium rounded-2xl shadow-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E0A922]"
              />
            </div>

            <button
              onClick={() => {
                setPreselectedWorker(undefined);
                setBookingCategory(categories[1]); // Electrical emergency
              }}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-[#1C161A] text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
            >
              <Zap className="w-4 h-4 text-[#1C161A]" />
              <span>{t('cust_emergency_btn', 'Emergency SOS (30 Mins)')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Booking Banner Alert if exists */}
      {activeBookings.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#062B3A] text-white flex flex-wrap items-center justify-between gap-4 shadow-lg border border-emerald-500/30 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs">{t('cust_active_service', 'Active Service in Progress')}</span>
                <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-yellow-300">
                  {t('cust_otp', 'OTP')}: {activeBookings[0].otpCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-200">
                {activeBookings[0].serviceCategoryName} • {t('cust_assigned_to', 'Assigned to')} {activeBookings[0].assignedWorkerName} ({activeBookings[0].status.replace('_', ' ').toUpperCase()})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTrackingBooking(activeBookings[0])}
              className="flex-1 sm:flex-none px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('cust_track_live', 'Track Live GPS & Chat')}</span>
            </button>
            <button
              onClick={() => setSosTriggerBooking(activeBookings[0])}
              className="flex-1 sm:flex-none px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 animate-pulse cursor-pointer"
              title="Emergency SOS — alerts your saved emergency contacts instantly"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>🚨 SOS</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none bg-[#F7F7F2] p-1 rounded-2xl border border-slate-200 text-[10px] sm:text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'explore'
                ? 'bg-[#062B3A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            {t('cust_tab_categories', 'Categories')}
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'workers'
                ? 'bg-[#062B3A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            {t('cust_tab_workers', 'Workers')}
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-[#062B3A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            {t('cust_tab_map', 'Radar Map')}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all relative whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-[#062B3A] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            {t('cust_tab_bookings', 'Bookings')} ({bookings.length})
            {activeBookings.length > 0 && (
              <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-2.5 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'safety'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-red-600'
            }`}
          >
            <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Safety
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 hidden sm:inline">{t('cust_district', 'District')}:</span>
          <span className="font-bold text-[#062B3A] bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
            {selectedCity}
          </span>
        </div>
      </div>

      {/* TAB 1: Explore Service Categories Grid */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredCategories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.icon);
              return (
                <div
                  key={cat.id}
                  className="group bg-[#FAF9F6] rounded-3xl border border-[#062B3A]/10 shadow-xs hover:shadow-xl hover:border-[#35C6B0]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Category Image Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/90 via-[#062B3A]/30 to-transparent"></div>

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#062B3A] shadow-md">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {cat.popularBadge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#35C6B0] text-white shadow-xs">
                          {cat.popularBadge}
                        </span>
                      )}
                    </div>

                    {/* Bottom Category Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-base leading-tight drop-shadow-xs">{cat.name}</h3>
                      <p className="text-[11px] text-slate-200 mt-0.5">{t('cust_starting_at', 'Starting at')} ₹{cat.basePrice}</p>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Subcategories preview */}
                    <div className="flex flex-wrap gap-1">
                      {cat.subCategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="text-[10px] font-medium bg-[#F7F7F2] text-[#062B3A] px-2 py-0.5 rounded-md border border-slate-200"
                        >
                          {sub}
                        </span>
                      ))}
                      {cat.subCategories.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{cat.subCategories.length - 3} {t('cust_more', 'more')}
                        </span>
                      )}
                    </div>

                    {/* Guarantee Seal */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {t('cust_warranty', 'Coop Warranty')}
                      </span>

                      <button
                        onClick={() => {
                          setPreselectedWorker(undefined);
                          setBookingCategory(cat);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#062B3A] hover:bg-[#35C6B0] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>{t('cust_book_service', 'Book Service')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Verified Workers Directory */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#35C6B0]" />
                <span className="text-xs font-bold text-[#062B3A]">
                  {t('cust_ai_ranked', 'AI & Proximity Ranked Cooperative Master Craftsmen')} ({rankedWorkerResults.length})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t('cust_ranked_by', 'Ranked by real-time GPS proximity to')} <span className="font-bold text-slate-700">{activeAddress?.area || activeAddress?.city || 'your address'}</span>, {t('cust_ranked_desc', 'verified NCVT/ITI skill certifications, and cooperative wage ratings.')}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#F7F7F2] border border-slate-200 text-xs font-medium text-slate-700"
              >
                <option value="all">{t('cust_all_trades', 'All Trade Specializations')}</option>
                <option value="electrical">{t('cust_elec', 'Electrical & Electronics')}</option>
                <option value="plumbing">{t('cust_plumb', 'Plumbing & Sanitary')}</option>
                <option value="carpentry">{t('cust_carp', 'Carpentry & Woodwork')}</option>
                <option value="caregiving">{t('cust_care', 'Elderly Care & Nursing')}</option>
                <option value="painting">{t('cust_paint', 'Painting & Waterproofing')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rankedWorkerResults.map(({ worker, distanceKm, etaMinutes, compositeScore, highlightReasons }) => (
              <div
                key={worker.id}
                className="bg-[#FAF9F6] rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <div className="relative">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#35C6B0]"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white text-[8px]">
                        ✓
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-[#1C161A] truncate">{worker.name}</h4>
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md shrink-0">
                          ★ {worker.rating} ({worker.reviewCount})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A61AA] truncate">{worker.societyName}</p>
                      
                      {/* Distance & ETA Badge */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <Navigation className="w-2.5 h-2.5" />
                          {distanceKm} km • ~{etaMinutes} mins
                        </span>
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          {compositeScore}% {t('cust_match', 'Match')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Certifications Tag */}
                  <div className="space-y-1.5 bg-[#F7F7F2] p-3 rounded-2xl text-xs mt-3">
                    <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {worker.skills[0]?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {worker.skills[0]?.certIssuer} • {worker.skills[0]?.experienceYears} {t('cust_yrs_exp', 'yrs experience')}
                    </p>
                    <p className="text-[10px] text-[#35C6B0] font-medium italic">
                      ✓ {highlightReasons?.[0] || t('cust_coop_certified', 'Cooperative-certified artisan')}
                    </p>
                  </div>
                </div>

                {/* Rates & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-xs font-black text-[#062B3A]">₹{worker.hourlyRate}/{t('cust_hr', 'hr')}</span>
                    <span className="text-[10px] text-slate-400 block">{t('cust_fair_rate', 'Coop Fair Rate')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingWorker(worker)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Credentials
                    </button>
                    <button
                      onClick={() => {
                        const targetCat = categories.find((c) =>
                          worker.skills.some((s) => s.category.toLowerCase().includes(c.slug))
                        ) || categories[0];
                        setPreselectedWorker(worker);
                        setBookingCategory(targetCat);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#35C6B0] hover:bg-[#2EAD9A] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Book Worker
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Interactive Geo Radar Map */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#062B3A]">{t('cust_map_title', 'Live Cooperative Workforce Geo-Radar')}</h3>
              <p className="text-xs text-slate-500">
                {t('cust_map_desc', 'Click on any worker marker to view their verification certificate, proximity ETA, and fair rates.')}
              </p>
            </div>
          </div>
          <InteractiveGeoMap
            onSelectWorker={(w) => {
              setViewingWorker(w);
            }}
            heightClassName="h-[520px]"
          />
        </div>
      )}

      {/* TAB 4: Customer Bookings & History */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Active Bookings Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A61AA] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#35C6B0]" />
              {t('cust_ongoing_bookings', 'Ongoing Service Bookings')} ({activeBookings.length})
            </h3>

            {activeBookings.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF9F6] rounded-3xl border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-xs text-slate-700">{t('cust_no_pending', 'No pending household bookings.')}</p>
                <p className="text-[11px] text-slate-500 mt-1">{t('cust_explore_cat', 'Explore categories above to book a verified worker.')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-3xl bg-[#FAF9F6] border-2 border-[#35C6B0]/30 shadow-md space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#062B3A]">{b.serviceCategoryName}</h4>
                          <span className="font-mono text-[10px] bg-purple-100 text-[#35C6B0] px-2 py-0.5 rounded font-bold">
                            {b.bookingNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{b.subService}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 capitalize animate-pulse">
                        {b.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F7F7F2] rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={b.assignedWorkerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                          alt={b.assignedWorkerName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#35C6B0]"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{b.assignedWorkerName}</p>
                          <p className="text-[10px] text-slate-500 font-medium">OTP Code: <span className="font-mono font-bold text-[#35C6B0]">{b.otpCode}</span></p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-[#062B3A]">₹{b.finalPrice}</span>
                        <span className="text-[10px] text-emerald-700 block font-semibold">{t('cust_escrow', 'Escrow Safe')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTrackingBooking(b)}
                        className="flex-1 py-2.5 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{t('cust_track_actions', 'Track Live GPS & Actions')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings & Invoices */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A61AA] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#35C6B0]" />
              {t('cust_past_completed', 'Past Completed Services & Warranty Receipts')} ({pastBookings.length})
            </h3>

            <div className="space-y-3">
              {pastBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-[#1C161A]">{b.serviceCategoryName} - {b.subService}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{b.bookingNumber}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t('cust_serviced_by', 'Serviced by')} {b.assignedWorkerName} ({b.societyName}) • {b.scheduledDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-black text-[#062B3A]">₹{b.finalPrice}</span>
                      <span className="text-[10px] text-emerald-700 block font-semibold">{t('cust_settled', 'Settled')}</span>
                    </div>

                    <button
                      onClick={() => setTrackingBooking(b)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#35C6B0]" />
                      <span>{t('cust_invoice', 'Invoice / Review')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Modals */}
      {bookingCategory && (
        <BookingFlowModal
          category={bookingCategory}
          initialWorker={preselectedWorker}
          onClose={() => {
            closeBookingCategory();
            setPreselectedWorker(undefined);
          }}
          onSuccess={(created) => {
            closeBookingCategory();
            setPreselectedWorker(undefined);
            setTrackingBooking(created);
          }}
        />
      )}

      {trackingBooking && (
        <BookingTrackerModal
          booking={trackingBooking}
          onClose={closeTrackingBooking}
          onOpenGrievance={(bk) => onOpenGrievance(bk)}
        />
      )}

      {viewingWorker && (
        <WorkerProfileModal
          worker={viewingWorker}
          onClose={closeViewingWorker}
          onBookWorker={(w) => {
            const targetCat = categories.find((c) =>
              w.skills.some((s) => s.category.toLowerCase().includes(c.slug))
            ) || categories[0];
            setViewingWorker(null);
            setPreselectedWorker(w);
            setBookingCategory(targetCat);
          }}
        />
      )}

      {/* Global Location Selector Modal */}
      {showLocationModal && (
        <LocationSelectorModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
        />
      )}

      {/* TAB 6: SAFETY & EMERGENCY CONTACTS */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          {/* Safety header card */}
          <div className="bg-gradient-to-br from-red-700 to-red-500 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute top-0 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-white/20">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <h3 className="font-black text-xl tracking-tight">Safety Settings</h3>
              </div>
              <p className="text-sm text-red-100">
                Manage trusted emergency contacts. During an active booking, press the <strong>🚨 SOS</strong> button to instantly notify all contacts with your live GPS location.
              </p>
              {activeBookings.length > 0 && (
                <button
                  onClick={() => setSosTriggerBooking(activeBookings[0])}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-white text-red-700 font-black text-sm flex items-center gap-2 shadow-lg hover:bg-red-50 transition-colors cursor-pointer animate-pulse"
                >
                  <ShieldAlert className="w-4 h-4" />
                  🚨 Trigger SOS for Active Booking
                </button>
              )}
            </div>
          </div>
          <EmergencyContactsPanel />
        </div>
      )}

      {/* AATRAL CASH WALLET */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#062B3A] to-[#35C6B0] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Wallet className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Wallet className="w-5 h-5 text-emerald-300" />
                </span>
                <h3 className="font-black text-xl tracking-tight">Aatral Cash</h3>
              </div>
              
              <div>
                <p className="text-sm text-purple-200">Available Balance</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black">₹{currentUser ? getUserWallet(currentUser.id).balance : 0}</span>
                </div>
              </div>

              
              <p className="text-xs text-purple-200 max-w-sm">
                Aatral Cash can be used to seamlessly pay for verified cooperative services. You can earn credits through rewards, promotions, and refunds.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-[#062B3A] px-2 flex items-center gap-2">
              <History className="w-4 h-4 text-[#35C6B0]" />
              Transaction History
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              {currentUser && getUserWallet(currentUser.id).transactions.map((tx) => (
                <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {tx.type === 'credit' ? <PlusCircle className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-800">{tx.reason}</h5>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className={`font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </div>
                </div>
              ))}
              
              {(!currentUser || getUserWallet(currentUser.id).transactions.length === 0) && (

                <div className="p-8 text-center bg-[#FAF9F6] rounded-3xl border border-slate-200 border-dashed">
                  <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700">No Transactions Yet</h4>
                  <p className="text-xs text-slate-500 mt-1">Your Aatral Cash activity will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>

      {/* SOS Modal */}
      {sosTriggerBooking && (
        <SosModal
          booking={sosTriggerBooking}
          onClose={() => setSosTriggerBooking(null)}
        />
      )}
    </>
  );
};
