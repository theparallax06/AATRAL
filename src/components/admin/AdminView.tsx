import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  Users,
  HardHat,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Briefcase,
  Layers,
  HeartPulse,
  Scale,
  PlusCircle,
  ArrowRight,
  Filter,
  DollarSign,
  FileCheck,
  CheckSquare,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Activity,
  Sliders,
  Wallet,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Worker, InstitutionalWorkOrder, CooperativeOrg, Complaint } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { WorkerUtilizationDashboard } from './WorkerUtilizationDashboard';
import { formatINR, DEFAULT_COOPERATIVE_CONFIG } from '../../utils/wageCalculator';
import { generateAIWorkforceRecommendations, AIRecommendationResult } from '../../utils/aiRecommendationEngine';
import { useHistoryState } from '../../hooks/useHistoryState';


export const AdminView: React.FC = () => {
  const {
    addWalletCredit,
    getUserWallet,
    apprenticeships,
    adminValidateApprentice,
    assignMentor,
    t,
    workers,
    workOrders,
    organizations,
    complaints,
    allocationConfig,
    verifyWorker,
    assignWorkersToOrder,
    approveWelfareRecord,
    resolveComplaint,
    resolveComplaintOutcome,
    generateAIDemandForecast,
    getAIRecommendations,
    showToast,
    registerWorker,
  } = useApp();

  // Build a list of known customer accounts for the promo modal
  const KNOWN_CUSTOMERS = [
    { id: DEMO_USERS.customer.id, name: DEMO_USERS.customer.name, role: 'Customer' },
    { id: 'usr-app-1', name: 'Kumar Raj', role: 'Apprentice' },
    { id: 'usr-app-2', name: 'Arun Das', role: 'Apprentice' },
  ];


  const safeConfig = allocationConfig || DEFAULT_COOPERATIVE_CONFIG;

  const [activeTab, setActiveTab] = useHistoryState<
    'overview' | 'utilization' | 'allocation_rules' | 'verifications' | 'workorders' | 'hierarchy' | 'ai_forecast' | 'welfare' | 'complaints' | 'ai-forecast' | 'apprentices'
  >('overview', 'adminTab');

  // Allocation Modal State
  const [allocatingOrder, setAllocatingOrder, closeAllocatingOrder] = useHistoryState<InstitutionalWorkOrder | null>(null, 'adminAllocatingOrder');
  const [selectedWorkerIdsForOrder, setSelectedWorkerIdsForOrder] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendationResult | null>(null);

  // Verification Review Modal State
  const [reviewingWorker, setReviewingWorker, closeReviewingWorker] = useHistoryState<Worker | null>(null, 'adminReviewingWorker');

  // Promo Modal State
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoUserId, setPromoUserId] = useState('');
  const [promoAmount, setPromoAmount] = useState('500');
  const [promoReason, setPromoReason] = useState('');

  // New Member Worker Registration Modal
  const [showAddWorkerModal, setShowAddWorkerModal, closeAddWorkerModal] = useHistoryState(false, 'adminShowAddWorkerModal');
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerPhone, setNewWorkerPhone] = useState('+91 98112 33445');
  const [newWorkerSkill, setNewWorkerSkill] = useState('Senior Industrial Electrician');
  const [newWorkerCategory, setNewWorkerCategory] = useState('electrical');
  const [newWorkerCert, setNewWorkerCert] = useState('NCVT ITI National Trade Certificate (Electrician)');
  const [newWorkerSocietyId, setNewWorkerSocietyId] = useState(organizations[2]?.id || '');

  // AI Forecast state
  const [aiForecastCategory, setAiForecastCategory] = useState('electrical');
  const [aiForecastDistrict, setAiForecastDistrict] = useState('Chennai');
  const [forecastData, setForecastData] = useState<any>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  React.useEffect(() => {
    let active = true;
    const fetchForecast = async () => {
      setForecastLoading(true);
      const data = await generateAIDemandForecast(aiForecastDistrict, aiForecastCategory);
      if (active) setForecastData(data);
      if (active) setForecastLoading(false);
    };
    fetchForecast();
    return () => { active = false; };
  }, [aiForecastCategory, aiForecastDistrict, generateAIDemandForecast]);

  const pendingWorkers = workers.filter((w) => w.verificationStatus === 'pending');
  const verifiedWorkers = workers.filter((w) => w.verificationStatus === 'verified');
  const openComplaints = complaints.filter((c) => c.status !== 'resolved');

  // Collect all welfare records across all workers
  const allWelfareRecords = workers.flatMap((w) =>
    w.welfareRecords.map((wr) => ({ ...wr, workerName: w.name, workerId: w.id, societyName: w.societyName }))
  );
  const pendingWelfare = allWelfareRecords.filter((wr) => wr.status === 'pending');

  const handleOpenAllocation = async (order: InstitutionalWorkOrder) => {
    setAllocatingOrder(order);
    setSelectedWorkerIdsForOrder(order.assignedWorkers.map((w) => w.workerId));
    
    // AI Allocation trigger
    setIsGeneratingAI(true);
    setAiRecommendations(null);
    try {
      const verifiedWorkers = workers.filter((w) => w.verificationStatus === 'verified');
      const aiResult = await generateAIWorkforceRecommendations(order, verifiedWorkers);
      setAiRecommendations(aiResult);
      
      // Auto-select AI recommended workers, combining with already assigned workers
      const newSelection = new Set(order.assignedWorkers.map((w) => w.workerId));
      aiResult.recommendedWorkerIds.forEach((id) => newSelection.add(id));
      setSelectedWorkerIdsForOrder(Array.from(newSelection));
    } catch (err) {
      console.error("AI Allocation failed", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveAllocation = () => {
    if (!allocatingOrder) return;
    assignWorkersToOrder(allocatingOrder.id, selectedWorkerIdsForOrder);
    closeAllocatingOrder();
    showToast(`Workforce roster updated: ${selectedWorkerIdsForOrder.length} cooperative members assigned.`, 'success');
  };

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName.trim()) return;

    registerWorker({
      userId: `usr-${Date.now()}`,
      name: newWorkerName,
      phone: newWorkerPhone,
      email: `${newWorkerName.toLowerCase().replace(/\s+/g, '')}@coopmember.org`,
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
      societyId: newWorkerSocietyId,
      badge: 'Certified Craftsman',
      rating: 4.8,
      reviewCount: 0,
      hourlyRate: 350,
      dailyRate: 1800,
      skills: [
        {
          id: `sk-${Date.now()}`,
          name: newWorkerSkill,
          category: newWorkerCategory,
          skillLevel: 'Advanced' as any,
          experienceYears: 4,
          certName: newWorkerCert,
          certIssuer: 'National Council for Vocational Training (NCVT)',
          certNumber: `NCVT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          verifiedDate: new Date().toISOString().split('T')[0],
        },
      ],
      location: { lat: 28.56, lng: 77.22, address: 'Cooperative Quarters, New Delhi' },
      verificationStatus: 'verified',
    });

    closeAddWorkerModal();
    setNewWorkerName('');
  };

  return (
    <div className="space-y-6 text-[#1C161A]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#062B3A] via-[#0A3F55] to-[#35C6B0] text-white p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-yellow-300 font-black">
              CG
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {t('admin_title', 'Labour Cooperative Federation Administration Hub')}
            </h2>
          </div>
          <p className="text-xs text-purple-200">
            Delhi State Apex Federation of Skilled Labour & Artisan Cooperative Societies (Regd. Act 2002)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="px-4 py-2 bg-[#E0A922] hover:bg-yellow-400 text-[#062B3A] rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('admin_view_text_1', 'Enroll New Member')}</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 bg-[#F7F7F2] p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'overview' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >{t('admin_view_text_8', 'Overview')}</button>
        <button
          onClick={() => setActiveTab('utilization')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'utilization' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('admin_view_text_9', 'Worker Utilization & Employment')}</span>
        </button>
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-3.5 py-2 rounded-xl transition-all relative whitespace-nowrap shrink-0 ${
            activeTab === 'verifications' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >
          Verification Queue
          {pendingWorkers.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-bold">
              {pendingWorkers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('workorders')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'workorders' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >{t('admin_view_text_11', 'Bulk Institutional Orders')}</button>
        <button
          onClick={() => setActiveTab('ai_forecast')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
            activeTab === 'ai_forecast' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />{t('admin_view_text_12', 'AI Demand & Allocation')}</button>
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'hierarchy' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >
          Hierarchy ({organizations.length})
        </button>
        <button
          onClick={() => setActiveTab('welfare')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'welfare' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >{t('admin_view_text_13', 'Welfare Grants')}</button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'complaints' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >
          Ombudsman ({openComplaints.length})
        </button>
        <button
          onClick={() => setActiveTab('apprentices')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
            activeTab === 'apprentices' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" /> Apprentices ({apprenticeships.length})
        </button>
      </div>

      {/* TAB 0: WORKER UTILIZATION & EMPLOYMENT DASHBOARD */}
      {activeTab === 'utilization' && <WorkerUtilizationDashboard />}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Action Alerts Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">{t('admin_view_text_25', 'Action Needed')}</span>
                <Clock className="w-4 h-4 text-amber-700" />
              </div>
              <h4 className="font-bold text-xs text-amber-950">{t('admin_view_text_26', 'Worker Skill Audits Pending')}</h4>
              <p className="text-[11px] text-amber-800">
                {pendingWorkers.length} candidate technicians awaiting Society Seal verification.
              </p>
              <button
                onClick={() => setActiveTab('verifications')}
                className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 pt-1"
              >
                Review Queue →
              </button>
            </div>

            <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded">{t('admin_view_text_27', 'High Value Order')}</span>
                <Building2 className="w-4 h-4 text-blue-700" />
              </div>
              <h4 className="font-bold text-xs text-blue-950">{t('admin_view_text_28', 'DMRC Rail Metro Bulk Deployment')}</h4>
              <p className="text-[11px] text-blue-800">{t('admin_view_text_29', '20 Industrial Electricians required (17 assigned). Need 3 certified specialists.')}</p>
              <button
                onClick={() => handleOpenAllocation(workOrders[0])}
                className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1 pt-1"
              >
                Allocate Remaining Workers →
              </button>
            </div>

            <div className="p-4 rounded-3xl bg-purple-50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">{t('admin_view_text_30', 'AI Forecast Alert')}</span>
                <Sparkles className="w-4 h-4 text-purple-700" />
              </div>
              <h4 className="font-bold text-xs text-purple-950">{t('admin_view_text_31', 'Monsoon Waterproofing Spike')}</h4>
              <p className="text-[11px] text-purple-800">{t('admin_view_text_32', 'Model forecasts +85% surge in South Delhi district. Recommends upskilling 15 painters.')}</p>
              <button
                onClick={() => setActiveTab('ai_forecast')}
                className="text-xs font-bold text-purple-900 hover:underline flex items-center gap-1 pt-1"
              >
                View AI Allocation →
              </button>
            </div>
          </div>

          {/* Quick Active Work Orders List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A61AA]">{t('admin_view_text_33', 'Institutional Work Orders Under Execution')}</h3>
              <button
                onClick={() => setActiveTab('workorders')}
                className="text-xs font-bold text-[#35C6B0] hover:underline"
              >
                View All ({workOrders.length})
              </button>
            </div>

            <div className="space-y-3">
              {workOrders.map((wo) => (
                <div
                  key={wo.id}
                  className="p-5 rounded-3xl bg-[#FAF9F6] border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#062B3A]">{wo.projectTitle}</h4>
                      <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                        {wo.orderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Client: {wo.institutionName} • Site: {wo.projectLocation}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="font-bold text-[#35C6B0]">
                        Workforce: {wo.assignedWorkers.length} / {wo.requiredWorkersCount} Workers
                      </span>
                      <span>•</span>
                      <span>Budget: ₹{(wo.budgetTotal || 0).toLocaleString('en-IN')}</span>
                      <span>•</span>
                      <span className="capitalize font-semibold text-emerald-700">Status: {wo.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAllocation(wo)}
                      className="px-4 py-2 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{t('admin_view_text_34', 'Manage Roster')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORKER VERIFICATION QUEUE */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#062B3A]">{t('admin_view_text_35', 'Cooperative Society Skill Audit & Seal Verification')}</h3>
              <p className="text-xs text-slate-500">{t('admin_view_text_36', 'Verify NCVT/ITI diploma certificates and issue official member credentials.')}</p>
            </div>
          </div>

          <div className="space-y-3">
            {workers.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-3xl bg-[#FAF9F6] border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-300" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{w.name}</h4>
                      <span className="font-mono text-[10px] bg-purple-50 text-[#35C6B0] px-1.5 py-0.5 rounded font-semibold">
                        ID: {w.memberId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{w.societyName}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {w.skills[0]?.name} ({w.skills[0]?.certIssuer})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    w.verificationStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : w.verificationStatus === 'pending'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {w.verificationStatus}
                  </span>

                  {w.verificationStatus === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => verifyWorker(w.id, 'verified')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />{t('admin_view_text_37', 'Approve & Issue Seal')}</button>
                      <button
                        onClick={() => verifyWorker(w.id, 'rejected')}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold"
                      >{t('admin_view_text_38', 'Reject')}</button>
                    </div>
                  )}

                  {w.verificationStatus === 'verified' && (
                    <button
                      onClick={() => setReviewingWorker(w)}
                      className="px-3 py-1.5 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50"
                    >{t('admin_view_text_39', 'View Certs')}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INSTITUTIONAL WORK ORDERS */}
      {activeTab === 'workorders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-[#062B3A]">{t('admin_view_text_40', 'Enterprise & Government Work Orders')}</h3>
              <p className="text-xs text-slate-500">{t('admin_view_text_41', 'Allocate multi-worker squads, inspect muster rolls, and certify milestone deliveries.')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-6 rounded-3xl bg-[#FAF9F6] border border-slate-200 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#062B3A] text-white px-2 py-0.5 rounded">
                        {wo.orderNumber}
                      </span>
                      <h4 className="text-base font-black text-[#062B3A]">{wo.projectTitle}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      Institution: {wo.institutionName} • Site: {wo.projectLocation}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-emerald-700">₹{(wo.budgetTotal || 0).toLocaleString('en-IN')}</span>
                    <p className="text-[10px] text-slate-400">{t('admin_view_text_42', 'Total Escrow Value')}</p>
                  </div>
                </div>

                {/* Assigned Squad Matrix */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5A61AA] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#35C6B0]" />
                      Assigned Member Workforce ({wo.assignedWorkers.length} / {wo.requiredWorkersCount})
                    </span>
                    <button
                      onClick={() => handleOpenAllocation(wo)}
                      className="text-xs font-bold text-[#35C6B0] hover:underline"
                    >
                      + Reallocate / Add Workers
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {wo.assignedWorkers.map((aw) => (
                      <div key={aw.workerId} className="p-2.5 bg-[#F7F7F2] rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={aw.photo} alt={aw.workerName} className="w-7 h-7 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-slate-800">{aw.workerName}</p>
                            <p className="text-[10px] text-slate-500">{aw.skill}</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-700 text-[11px]">₹{aw.dailyWage}/day</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones Progress */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5A61AA] block mb-2">{t('admin_view_text_43', 'Project Milestones & Verification')}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {wo.milestones.map((m) => (
                      <div key={m.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900">{m.title}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded capitalize ${
                            m.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">₹{(m.amount || 0).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AI DEMAND FORECASTING & WORKFORCE ALLOCATION */}
      {activeTab === 'ai_forecast' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-[#062B3A] to-[#35C6B0] text-white space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <h3 className="text-lg font-black">{t('admin_view_text_44', 'AI Demand Forecasting & Predictive Workforce Allocation')}</h3>
            </div>
            <p className="text-xs text-purple-200 leading-relaxed max-w-3xl">{t('admin_view_text_45', 'Trained on historical meteorological seasons, festival timelines, municipal infrastructure tenders, and housing colony density to eliminate supply bottlenecks.')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Select Domain for Predictive Analysis:</span>
              <select
                value={aiForecastCategory}
                onChange={(e) => setAiForecastCategory(e.target.value)}
                className="px-3 py-1.5 bg-[#F7F7F2] border border-slate-300 rounded-xl font-bold text-[#062B3A]"
              >
                <option value="electrical">{t('admin_view_text_46', 'Electrical & Grid Works')}</option>
                <option value="plumbing">{t('admin_view_text_47', 'Plumbing & Monsoon Leakages')}</option>
                <option value="carpentry">{t('admin_view_text_48', 'Carpentry & Structural Wood')}</option>
                <option value="painting">{t('admin_view_text_49', 'Painting & Waterproofing')}</option>
                <option value="cleaning">Cleaning & Janitorial</option>
                <option value="gardening">Gardening & Landscaping</option>
                <option value="masonry">Masonry</option>
                <option value="appliance repair">Appliance Repair</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Select District:</span>
              <select
                value={aiForecastDistrict}
                onChange={(e) => setAiForecastDistrict(e.target.value)}
                className="px-3 py-1.5 bg-[#F7F7F2] border border-slate-300 rounded-xl font-bold text-[#062B3A]"
              >
                <option value="Chengalpattu">Chengalpattu</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Erode">Erode</option>
                <option value="Madurai">Madurai</option>
                <option value="Salem">Salem</option>
                <option value="Thanjavur">Thanjavur</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
                <option value="Tiruppur">Tiruppur</option>
                <option value="Vellore">Vellore</option>
              </select>
            </div>
          </div>

          {/* AI Forecast Result Card */}
          <div className="p-6 rounded-3xl bg-[#FAF9F6] border-2 border-[#35C6B0]/30 shadow-md space-y-5">
            {forecastLoading || !forecastData ? (
              <div className="flex flex-col justify-center items-center h-32 space-y-3">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35C6B0]"></div>
                 <span className="text-xs text-slate-500">Querying AI Prediction Engine...</span>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold bg-purple-100 text-[#35C6B0] px-2 py-0.5 rounded">{t('admin_view_text_50', 'Predictive Analysis Engine')}</span>
                    <h4 className="text-base font-black text-[#062B3A] mt-1">
                      Demand Outlook for {forecastData.category.toUpperCase()} in {forecastData.area} ({forecastData.period})
                    </h4>
                  </div>
    
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500">{t('admin_view_text_51', 'Predicted Volume Surge')}</span>
                    <p className="text-2xl font-black text-purple-800">{forecastData.predictedDemandMultiplier}</p>
                  </div>
                </div>

            {/* AI Insights & Reasoning */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A61AA]">
                AI Contextual Reasoning:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {forecastData.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#F7F7F2] p-2.5 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#35C6B0] mt-1.5 shrink-0"></span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Proactive Recommendations */}
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#35C6B0]" />
                Federation Action Recommendations:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {forecastData.recommendedActions.map((act: string, i: number) => (
                  <div key={i} className="p-2.5 bg-white rounded-xl shadow-2xs text-purple-950 font-medium">
                    {act}
                  </div>
                ))}
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: COOPERATIVE HIERARCHY */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-4">
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-[#062B3A]">{t('admin_view_text_52', 'Cooperative Federation Institutional Structure')}</h3>
            <p className="text-xs text-slate-500">{t('admin_view_text_53', 'Configurable 3-tier hierarchy: Apex State Federation → District Unions → Primary Labour Societies.')}</p>
          </div>

          <div className="space-y-3">
            {organizations.map((org) => (
              <div key={org.id} className="p-5 rounded-3xl bg-[#FAF9F6] border border-slate-200 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      org.type === 'apex_federation'
                        ? 'bg-[#062B3A] text-white'
                        : org.type === 'district_union'
                        ? 'bg-[#35C6B0] text-white'
                        : 'bg-emerald-700 text-white'
                    }`}>
                      {org.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C161A]">{org.name}</h4>
                      <p className="text-xs text-slate-500">{org.address} • Reg: {org.registrationNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-[#062B3A]">{org.workerCount} Registered Members</span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-[#35C6B0] font-semibold uppercase text-[10px]">
                      {org.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F7F7F2] text-[#062B3A] text-[11px] font-medium border border-slate-200">
                    Authority: {org.verificationAuthority}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F7F7F2] text-[#062B3A] text-[11px] font-medium border border-slate-200">
                    District: {org.district}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F7F7F2] text-[#062B3A] text-[11px] font-medium border border-slate-200">
                    Welfare Fund: ₹{(org.welfareFundBalance || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: WELFARE CLAIMS CONSOLE */}
      {activeTab === 'welfare' && (
        <div className="space-y-4">
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#062B3A]">{t('admin_view_text_54', 'Social Security & Welfare Grant Disbursals')}</h3>
              <p className="text-xs text-slate-500">{t('admin_view_text_55', 'Review member grant applications (Tool Subsidies, Medical Grants, Scholarships).')}</p>
            </div>
            <span className="font-bold text-xs bg-purple-100 text-purple-900 px-3 py-1 rounded-xl">{t('admin_view_text_56', 'Total Corpus: ₹14,20,000')}</span>
          </div>

          <div className="space-y-3">
            {allWelfareRecords.map((wr) => (
              <div key={wr.id} className="p-4 rounded-3xl bg-[#FAF9F6] border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900">{wr.title}</h4>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{wr.referenceNo}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Member: <span className="font-bold">{wr.workerName}</span> ({wr.societyName})
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Applied: {wr.date} {wr.notes ? `• ${wr.notes}` : ''}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-purple-900">₹{(wr.amount || 0).toLocaleString('en-IN')}</span>

                  {wr.status === 'pending' ? (
                    <button
                      onClick={() => approveWelfareRecord(wr.workerId, wr.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >{t('admin_view_text_57', 'Approve & Disburse')}</button>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold capitalize">
                      {wr.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: OMBUDSMAN & GRIEVANCES */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#062B3A] to-[#40357F] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Scale className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                    <Scale className="w-5 h-5 text-amber-300" />
                  </span>
                  <h3 className="font-black text-xl tracking-tight">{t('admin_view_text_58', 'Cooperative Ombudsman & Grievance Redressal')}</h3>
                </div>
                <p className="text-sm text-purple-200 leading-relaxed max-w-lg">
                  {t('admin_view_text_59', 'Mediate disputes with transparent warranty inspections, ensure fair resolution, and uphold cooperative integrity across the federation.')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-center border border-white/5">
                  <span className="block text-2xl font-black text-white">{complaints.filter(c => c.status !== 'resolved').length}</span>
                  <span className="block text-[10px] font-bold text-purple-200 uppercase tracking-wider mt-0.5">Active Tickets</span>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-center border border-white/5">
                  <span className="block text-2xl font-black text-emerald-300">{complaints.filter(c => c.status === 'resolved').length}</span>
                  <span className="block text-[10px] font-bold text-purple-200 uppercase tracking-wider mt-0.5">Resolved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {complaints.map((comp) => (
              <div key={comp.id} className="group relative bg-[#F7F7F2] md:bg-white overflow-hidden p-0 rounded-3xl border border-[#E8EAE6] shadow-xs hover:shadow-lg hover:border-[#C5EBE4] transition-all duration-300">
                <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-3xl bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity ${comp.status === 'resolved' ? 'from-emerald-400 to-emerald-600' : 'from-[#35C6B0] to-[#062B3A]'}" />
                
                <div className="flex flex-col md:flex-row md:items-stretch h-full">
                  <div className="flex-1 p-5 md:p-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[10px] bg-white text-[#062B3A] px-2.5 py-1 rounded-lg font-bold border border-[#E8EAE6] shadow-xs">
                        {comp.ticketNo}
                      </span>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize ${
                        comp.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {comp.status === 'resolved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 text-amber-700" />}
                        {comp.status}
                      </span>
                      {comp.priority === 'critical' && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-900 border border-red-200">
                          <AlertTriangle className="w-3 h-3 text-red-700" />
                          Critical
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-[15px] text-[#062B3A] leading-tight group-hover:text-[#35C6B0] transition-colors">{comp.subject}</h4>
                      <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">{comp.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#E8EAE6]">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-[#35C6B0] uppercase tracking-widest">Raised By</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#062B3A]">
                          <Users className="w-3.5 h-3.5 text-[#5A61AA]" />
                          {comp.raisedByName} <span className="text-slate-400 font-normal">({comp.raisedByRole})</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-[#35C6B0] uppercase tracking-widest">Targeted Entity</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#062B3A]">
                          <HardHat className="w-3.5 h-3.5 text-[#5A61AA]" />
                          {comp.targetName} <span className="text-slate-400 font-normal">({comp.targetType})</span>
                        </div>
                      </div>
                      {comp.targetType === 'booking' && (
                        <div className="space-y-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                          <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Ombudsman Escrow</span>
                          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Payment Held Pending Resolution
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-row md:flex-col items-center justify-center gap-3 bg-[#F7F7F2] border-t md:border-t-0 md:border-l border-[#E8EAE6] p-5 md:w-[180px]">
                    {comp.status !== 'resolved' ? (
                      <>
                        <button
                          onClick={() => resolveComplaintOutcome(comp.id, 'dismissed', 'Dismissed after review. Escrow released to worker.')}
                          className="w-full px-4 py-2.5 bg-white hover:bg-[#E8EAE6] text-[#062B3A] border border-[#C5EBE4] rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Dismiss / Release Payout
                        </button>
                        <button
                          onClick={() => resolveComplaintOutcome(comp.id, 'upheld', 'Upheld after review. Refunded to customer / Rework ordered.')}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border border-red-600 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-100" />
                          Uphold / Refund
                        </button>
                      </>
                    ) : (
                      <div className="w-full px-4 py-3 bg-white border border-[#E8EAE6] rounded-xl text-center space-y-1.5 shadow-xs">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outcome</span>
                        <span className={`inline-block px-3 py-1 rounded-md font-bold text-[11px] capitalize ${
                          comp.outcome === 'upheld' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {comp.outcome || 'Resolved'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {complaints.length === 0 && (
              <div className="p-10 text-center bg-gradient-to-b from-[#F7F7F2] to-white rounded-3xl border border-[#E8EAE6] border-dashed">
                <Scale className="w-14 h-14 text-[#C5EBE4] mx-auto mb-4" />
                <h4 className="font-bold text-lg text-[#062B3A]">No Active Grievances</h4>
                <p className="text-sm text-[#5A61AA] mt-1">The cooperative platform is running smoothly with no reported issues.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multi-Worker Allocation Modal */}
      {allocatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#062B3A] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{t('admin_view_text_61', 'Allocate Cooperative Workers')}</h3>
                <p className="text-xs text-slate-300">
                  {allocatingOrder.projectTitle} (Required: {allocatingOrder.requiredWorkersCount} Workers)
                </p>
              </div>
              <button onClick={closeAllocatingOrder} className="text-white hover:text-slate-300">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              
              {isGeneratingAI ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-purple-200 border-t-[#35C6B0] rounded-full animate-spin mx-auto" />
                  <div>
                    <h4 className="font-bold text-[#062B3A]">{t('admin_view_text_62', 'AI Workforce Intelligence Analysing...')}</h4>
                    <p className="text-xs text-slate-500">{t('admin_view_text_63', 'Matching required skills, location, rating & availability')}</p>
                  </div>
                </div>
              ) : aiRecommendations && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex gap-3">
                    <Sparkles className="w-5 h-5 text-[#35C6B0] shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-purple-900">{t('admin_view_text_64', 'AI Recommended Workforce')}</h4>
                      <p className="text-xs text-purple-700">{aiRecommendations.shortageSummary}</p>
                    </div>
                  </div>

                  {aiRecommendations.recommendations.length > 0 && (
                    <div className="space-y-2">
                      {aiRecommendations.recommendations.map((rec) => {
                        const w = verifiedWorkers.find(worker => worker.id === rec.workerId);
                        if (!w) return null;
                        const isChecked = selectedWorkerIdsForOrder.includes(w.id);
                        return (
                          <div
                            key={`ai-${w.id}`}
                            onClick={() => {
                              if (isChecked) {
                                setSelectedWorkerIdsForOrder(selectedWorkerIdsForOrder.filter((id) => id !== w.id));
                              } else {
                                setSelectedWorkerIdsForOrder([...selectedWorkerIdsForOrder, w.id]);
                              }
                            }}
                            className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-[#35C6B0]/10 border-[#35C6B0] shadow-2xs'
                                : 'bg-white border-purple-200 hover:bg-purple-50/50'
                            }`}
                          >
                            <div className="flex gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 accent-[#35C6B0] mt-2.5"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <img src={w.avatar} alt={w.name} className="w-9 h-9 rounded-xl object-cover" />
                                  <div>
                                    <p className="font-bold text-xs text-slate-900">{w.name}</p>
                                    <p className="text-[10px] text-slate-500">{w.societyName} • {w.skills[0]?.name}</p>
                                  </div>
                                </div>
                                <div className="mt-2 text-[10px] text-purple-800 bg-purple-100/50 px-2 py-1 rounded-md border border-purple-100/50 flex items-start gap-1.5">
                                  <Activity className="w-3 h-3 shrink-0 mt-0.5" />
                                  <span>{rec.reason} (Match: {rec.matchScore}%)</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right text-xs shrink-0 self-start mt-2">
                              <span className="font-bold text-[#062B3A]">₹{w.dailyRate}/day</span>
                              <span className="text-[10px] text-yellow-600 block">★ {w.rating}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  All Available Cooperative Members (Manual Selection)
                </p>

                <div className="space-y-2">
                  {verifiedWorkers.map((w) => {
                    const isChecked = selectedWorkerIdsForOrder.includes(w.id);
                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedWorkerIdsForOrder(selectedWorkerIdsForOrder.filter((id) => id !== w.id));
                          } else {
                            setSelectedWorkerIdsForOrder([...selectedWorkerIdsForOrder, w.id]);
                          }
                        }}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#35C6B0]/10 border-[#35C6B0] shadow-2xs'
                            : 'bg-[#F7F7F2] border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#35C6B0]"
                          />
                          <img src={w.avatar} alt={w.name} className="w-9 h-9 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-xs text-slate-900">{w.name}</p>
                            <p className="text-[10px] text-slate-500">{w.societyName} • {w.skills[0]?.name}</p>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          <span className="font-bold text-[#062B3A]">₹{w.dailyRate}/day</span>
                          <span className="text-[10px] text-yellow-600 block">★ {w.rating}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Selected: {selectedWorkerIdsForOrder.length} of {allocatingOrder.requiredWorkersCount}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={closeAllocatingOrder}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >{t('admin_view_text_65', 'Cancel')}</button>
                <button
                  onClick={handleSaveAllocation}
                  className="px-5 py-2 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md"
                >{t('admin_view_text_66', 'Save Workforce Roster')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Member Registration Modal */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#062B3A]">{t('admin_view_text_67', 'Enroll New Cooperative Member Worker')}</h3>
              <button onClick={closeAddWorkerModal} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('admin_view_text_68', 'Full Member Name')}</label>
                <input
                  type="text"
                  required
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar Verma"
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('admin_view_text_69', 'Mobile Phone')}</label>
                <input
                  type="tel"
                  required
                  value={newWorkerPhone}
                  onChange={(e) => setNewWorkerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('admin_view_text_70', 'Primary Skill Specialization')}</label>
                <input
                  type="text"
                  required
                  value={newWorkerSkill}
                  onChange={(e) => setNewWorkerSkill(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('admin_view_text_71', 'Trade Category')}</label>
                <select
                  value={newWorkerCategory}
                  onChange={(e) => setNewWorkerCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                >
                  <option value="electrical">{t('admin_view_text_72', 'Electrical')}</option>
                  <option value="plumbing">{t('admin_view_text_73', 'Plumbing')}</option>
                  <option value="carpentry">{t('admin_view_text_74', 'Carpentry')}</option>
                  <option value="caregiving">{t('admin_view_text_75', 'Caregiving')}</option>
                  <option value="painting">{t('admin_view_text_76', 'Painting')}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('admin_view_text_77', 'NCVT / ITI Certificate Title')}</label>
                <input
                  type="text"
                  value={newWorkerCert}
                  onChange={(e) => setNewWorkerCert(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeAddWorkerModal}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600"
                >{t('admin_view_text_65', 'Cancel')}</button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#062B3A] hover:bg-[#05222E] text-white rounded-xl font-bold shadow-md"
                >{t('admin_view_text_79', 'Register & Issue Seal')}</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* TAB: APPRENTICES MANAGEMENT */}
      {activeTab === 'apprentices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#062B3A] flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#35C6B0]" />
                Apprenticeship Programme
              </h2>
              <p className="text-xs text-slate-500 mt-1">Assign apprentices to verified mentors, review training progress, and approve verified worker promotions.</p>
            </div>
          </div>

          {/* Assign New Apprentice */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h3 className="font-bold text-[#062B3A] text-sm flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-[#35C6B0]" /> Register & Assign Apprentice to Mentor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Apprentice Name</label>
                <input
                  type="text"
                  id="appr-name-input"
                  placeholder="e.g. Suresh Verma"
                  className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assign Mentor</label>
                <select id="appr-mentor-select" className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl text-sm">
                  {verifiedWorkers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({apprenticeships.filter(a => a.mentorId === w.id && a.status === 'active').length}/2)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Skill Category</label>
                <select id="appr-skill-select" className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl text-sm">
                  <option value="Electrical & Wiring">Electrical & Wiring</option>
                  <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                  <option value="Carpentry & Furniture">Carpentry & Furniture</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    const nameEl = document.getElementById('appr-name-input') as HTMLInputElement;
                    const mentorEl = document.getElementById('appr-mentor-select') as HTMLSelectElement;
                    const skillEl = document.getElementById('appr-skill-select') as HTMLSelectElement;
                    const name = nameEl?.value.trim();
                    if (!name) { showToast('Please enter apprentice name.', 'error'); return; }
                    const mentorId = mentorEl?.value;
                    const mentor = verifiedWorkers.find(w => w.id === mentorId);
                    assignMentor('usr-app-' + Date.now(), name, mentorId, mentor?.name || 'Unknown', skillEl?.value || 'General');
                    if (nameEl) nameEl.value = '';
                  }}
                  className="w-full py-2.5 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Assign to Mentor
                </button>
              </div>
            </div>
          </div>

          {/* All Apprenticeships */}
          <div className="space-y-3">
            {apprenticeships.length === 0 ? (
              <div className="text-center py-10 bg-[#F7F7F2] rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-semibold">No apprentices registered yet.</p>
              </div>
            ) : (
              apprenticeships.map(appr => {
                const progress = Math.min(100, Math.round((appr.trainingHours / 120) * 100));
                return (
                  <div key={appr.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-black text-[#062B3A]">{appr.apprenticeName}</h4>
                        <p className="text-xs text-slate-500">Mentor: <span className="font-semibold text-[#35C6B0]">{appr.mentorName}</span> · {appr.skillCategory}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold self-start sm:self-auto ${
                        appr.status === 'active' ? 'bg-[#35C6B0]/10 text-[#35C6B0]' :
                        appr.status === 'pending_admin' ? 'bg-amber-100 text-amber-700' :
                        appr.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        appr.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {appr.status === 'pending_admin' ? '⏳ Awaiting Review' : appr.status.charAt(0).toUpperCase() + appr.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-semibold">
                      <span>Training: {appr.trainingHours}/120 hrs, {appr.assistedJobs.length}/15 jobs</span>
                      <span className="text-[#35C6B0] font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3">
                      <div className="bg-[#35C6B0] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>

                    {appr.evaluation && (
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs mb-3">
                        <p className="font-bold text-amber-800 mb-1">⭐ Mentor Evaluation (Rating: {appr.evaluation.rating}/5)</p>
                        <p className="text-slate-700 italic">"{appr.evaluation.comments}"</p>
                      </div>
                    )}

                    {appr.status === 'pending_admin' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => { adminValidateApprentice(appr.apprenticeId, 'completed'); showToast(`${appr.apprenticeName} approved as Verified Worker!`, 'success'); }}
                          className="flex-1 py-2 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          ✓ Approve as Verified Worker
                        </button>
                        <button
                          onClick={() => { adminValidateApprentice(appr.apprenticeId, 'retrain'); showToast(`${appr.apprenticeName} sent back for retraining.`, 'info'); }}
                          className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-bold transition-colors"
                        >
                          ↺ Request Retraining
                        </button>
                        <button
                          onClick={() => { adminValidateApprentice(appr.apprenticeId, 'rejected'); showToast(`${appr.apprenticeName}'s application rejected.`, 'error'); }}
                          className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}


      {/* Verification Review / View Certs Modal */}
      {reviewingWorker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg text-[#062B3A] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#35C6B0]" />
                {t('admin_view_text_cert_modal_title', 'Worker Certificates')}
              </h3>
              <button onClick={closeReviewingWorker} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={reviewingWorker.avatar} alt={reviewingWorker.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{reviewingWorker.name}</h4>
                  <p className="text-sm font-semibold text-[#35C6B0]">{reviewingWorker.memberId}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-700 text-sm">Verified Credentials</h5>
                {reviewingWorker.skills.map((skill, idx) => (
                  <div key={idx} className="p-3 border border-emerald-100 bg-emerald-50/50 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{skill.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Level: {skill.skillLevel}</p>
                      {skill.certification && (
                        <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> {skill.certification}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {reviewingWorker.verificationDocUrl && (
                <div className="pt-2">
                  <a href={reviewingWorker.verificationDocUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-[#F7F7F2] hover:bg-[#35C6B0] text-[#062B3A] hover:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Original Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg text-[#062B3A] flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#35C6B0]" />
                Issue Aatral Cash
              </h3>
              <button onClick={() => setShowPromoModal(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Customer / User</label>
                <select
                  value={promoUserId}
                  onChange={(e) => setPromoUserId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#35C6B0]/20 focus:border-[#35C6B0]"
                >
                  <option value="">-- Select a user --</option>
                  {KNOWN_CUSTOMERS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.role})
                    </option>
                  ))}
                </select>
                {promoUserId && (
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Current balance: <span className="font-bold text-emerald-700">₹{getUserWallet(promoUserId).balance}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Credit Amount (₹)</label>
                <input 
                  type="number" 
                  value={promoAmount}
                  onChange={(e) => setPromoAmount(e.target.value)}
                  min="1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#35C6B0]/20 focus:border-[#35C6B0]" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Reason</label>
                <input 
                  type="text" 
                  value={promoReason}
                  onChange={(e) => setPromoReason(e.target.value)}
                  placeholder="e.g. Promotional campaign — Raksha Bandhan"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#35C6B0]/20 focus:border-[#35C6B0]" 
                />
              </div>
            </div>
            
            <button
              onClick={() => {
                if (promoUserId && promoAmount && Number(promoAmount) > 0) {
                  const customerName = KNOWN_CUSTOMERS.find(c => c.id === promoUserId)?.name || promoUserId;
                  addWalletCredit(promoUserId, Number(promoAmount), promoReason || 'Admin promotional credit');
                  showToast(`₹${promoAmount} credited to ${customerName}'s Aatral Cash wallet!`, 'success');
                  setShowPromoModal(false);
                  setPromoUserId('');
                  setPromoAmount('500');
                  setPromoReason('');
                } else {
                  showToast('Please select a user and enter a valid amount.', 'error');
                }
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#062B3A] to-[#35C6B0] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Issue Credits
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

