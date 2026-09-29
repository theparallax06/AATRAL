import React, { useState } from 'react';
import {
  Building2,
  HardHat,
  ShieldCheck,
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  Star,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { InstitutionalWorkOrder } from '../../types';
import { InvoiceModal } from '../common/InvoiceModal';
import { useHistoryState } from '../../hooks/useHistoryState';

export const InstitutionView: React.FC = () => {
  const {
    t,
    currentUser,
    workOrders,
    createWorkOrder,
    verifyMilestone,
    organizations,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useHistoryState<'orders' | 'attendance' | 'new_order'>('orders', 'institutionTab');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder, closeSelectedInvoiceOrder] = useHistoryState<InstitutionalWorkOrder | null>(null, 'institutionSelectedInvoiceOrder');

  // New Work Requirement Form state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [serviceCategoryId, setServiceCategoryId] = useState('cat-102');
  const [serviceCategoryName, setServiceCategoryName] = useState('Electrical & Electronics');
  const [requiredWorkersCount, setRequiredWorkersCount] = useState(10);
  const [projectLocation, setProjectLocation] = useState('AIIMS Hospital New OPD Block, Ansari Nagar, New Delhi');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2026-11-30');
  const [budgetTotal, setBudgetTotal] = useState(450000);
  const [targetSocietyId, setTargetSocietyId] = useState(organizations[2]?.id || '');

  // Attendance simulation check-ins
  const [attendanceChecked, setAttendanceChecked] = useState<Record<string, boolean>>({
    'wrk-101': true,
    'wrk-102': true,
    'wrk-103': true,
  });

  const myOrders = workOrders;

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const targetOrg = organizations.find((o) => o.id === targetSocietyId) || organizations[2];

    createWorkOrder({
      institutionId: currentUser?.id || 'usr-inst-1',
      institutionName: currentUser?.institutionName || 'Delhi Metro Rail Corporation (DMRC)',
      institutionType: 'Government / Public Sector',
      contactPerson: currentUser?.name || 'Er. Pradeep Khurana',
      contactPhone: currentUser?.phone || '+91 98114 88770',
      contactEmail: currentUser?.email || 'pkhurana.electrical@dmrc.org.in',
      societyId: targetOrg.id,
      societyName: targetOrg.name,
      projectTitle,
      projectDescription,
      serviceCategoryId,
      serviceCategoryName,
      requiredWorkersCount,
      projectLocation,
      startDate,
      endDate,
      budgetTotal,
    });

    setActiveTab('orders');
    setProjectTitle('');
    setProjectDescription('');
  };

  const handleToggleAttendance = (workerId: string) => {
    setAttendanceChecked((prev) => {
      const nextState = !prev[workerId];
      showToast(
        nextState ? 'Worker biometric site attendance logged!' : 'Attendance check revoked',
        'info'
      );
      return { ...prev, [workerId]: nextState };
    });
  };

  return (
    <div className="space-y-6 text-[#1C161A]">
      {/* Institutional Client Header Banner */}
      <div className="bg-gradient-to-r from-[#041D27] via-[#062B3A] to-[#3b388b] text-white p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-black">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">{currentUser?.institutionName || 'Delhi Metro Rail Corporation (DMRC)'}</h2>
              <p className="text-xs text-blue-200">
                {t('institution_title', 'Institutional Workforce Procurement & Milestone Escrow Console')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new_order')}
            className="px-4 py-2.5 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('inst_view_text_1', 'Post Bulk Work Requirement')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-[#5A61AA] uppercase block">{t('inst_view_text_2', 'Active Work Orders')}</span>
          <span className="text-2xl font-black text-[#062B3A] mt-1 block">{myOrders.length}</span>
          <span className="text-[10px] text-slate-500">{t('inst_view_text_3', 'Full Compliance Protected')}</span>
        </div>

        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">{t('inst_view_text_4', 'Deployed Workers')}</span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">
            {myOrders.reduce((acc, o) => acc + o.assignedWorkers.length, 0)}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold">{t('inst_view_text_5', '100% NCVT Certified')}</span>
        </div>

        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-purple-700 uppercase block">{t('inst_view_text_6', 'Escrow Committed')}</span>
          <span className="text-2xl font-black text-purple-900 mt-1 block">
            ₹{myOrders.reduce((acc, o) => acc + (o.budgetTotal || 0), 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-purple-700 font-semibold">{t('inst_view_text_7', 'Milestone-linked release')}</span>
        </div>

        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase block">{t('inst_view_text_8', 'Cooperative Quality')}</span>
          <span className="text-2xl font-black text-amber-900 mt-1 block">{t('inst_view_text_9', '4.9 / 5.0')}</span>
          <span className="text-[10px] text-amber-700 font-semibold">{t('inst_view_text_10', 'Zero Labor Disputes')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 bg-[#F7F7F2] p-1 rounded-2xl border border-slate-200 text-[10px] sm:text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            Active Projects ({myOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'attendance' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >{t('inst_view_text_11', 'Site Muster Roll & Biometrics')}</button>
          <button
            onClick={() => setActiveTab('new_order')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'new_order' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            + Post New Requirement
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE WORK ORDERS & MILESTONES */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {myOrders.map((wo) => (
            <div key={wo.id} className="p-6 rounded-3xl bg-[#FAF9F6] border border-slate-200 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                      {wo.orderNumber}
                    </span>
                    <h3 className="text-base font-black text-[#062B3A]">{wo.projectTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl">{wo.projectDescription}</p>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#35C6B0]" />
                    Site: {wo.projectLocation} • Assigned Federation: {wo.societyName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium block">{t('inst_view_text_12', 'Total Contract Escrow')}</span>
                  <span className="text-xl font-black text-[#062B3A]">₹{(wo.budgetTotal || 0).toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => setSelectedInvoiceOrder(wo)}
                    className="mt-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 ml-auto"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#35C6B0]" />
                    <span>{t('inst_view_text_13', 'Official Tax Receipt')}</span>
                  </button>
                </div>
              </div>

              {/* Assigned Skilled Members Roster */}
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5A61AA] flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Assigned Cooperative Workforce ({wo.assignedWorkers.length} / {wo.requiredWorkersCount} Technicians)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">{t('inst_view_text_14', 'Cooperative Compliance Verified')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {wo.assignedWorkers.map((aw) => (
                    <div key={aw.workerId} className="p-3 bg-[#F7F7F2] rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={aw.photo} alt={aw.workerName} className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#35C6B0]" />
                        <div>
                          <p className="font-bold text-slate-900">{aw.workerName}</p>
                          <p className="text-[10px] text-slate-500">{aw.skill}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#062B3A] text-[11px]">₹{aw.dailyWage}/day</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones & Escrow Release */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A61AA]">{t('inst_view_text_15', 'Milestone Deliverables & Escrow Release')}</span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {wo.milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border space-y-2 ${
                        m.status === 'approved'
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-slate-900">{m.title}</h5>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          m.status === 'approved'
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs font-black text-[#062B3A]">₹{(m.amount || 0).toLocaleString('en-IN')}</p>

                      {m.status === 'pending' && (
                        <button
                          onClick={() => verifyMilestone(wo.id, m.id, currentUser.name || 'Institution Officer')}
                          className="w-full py-1.5 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >{t('inst_view_text_16', 'Verify & Release Escrow')}</button>
                      )}

                      {m.status === 'approved' && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('inst_view_text_17', 'Escrow Disbursed to Federation')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SITE MUSTER ROLL & BIOMETRICS */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#062B3A]">{t('inst_view_text_18', 'Daily On-Site Muster Roll & Verification')}</h3>
              <p className="text-xs text-slate-500">{t('inst_view_text_19', 'Confirm presence of allocated cooperative technicians on site for today\'s shift.')}</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
              Date: {new Date().toLocaleDateString('en-IN')}
            </span>
          </div>

          <div className="space-y-3">
            {myOrders[0]?.assignedWorkers.map((aw) => {
              const isPresent = !!attendanceChecked[aw.workerId];
              return (
                <div
                  key={aw.workerId}
                  className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={aw.photo} alt={aw.workerName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-300" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-slate-900">{aw.workerName}</p>
                        <span className="text-[10px] font-bold bg-purple-50 text-[#35C6B0] px-1.5 py-0.2 rounded">
                          {aw.skill}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Daily Wage: ₹{aw.dailyWage} • Shift: 08:30 AM - 05:30 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isPresent ? 'Present On-Site (Biometric Verified)' : 'Not Checked-In'}
                    </span>

                    <button
                      onClick={() => handleToggleAttendance(aw.workerId)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isPresent
                          ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                      }`}
                    >
                      {isPresent ? 'Mark Absent' : 'Verify Check-In'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: POST NEW BULK WORK REQUIREMENT */}
      {activeTab === 'new_order' && (
        <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-slate-200 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-black text-lg text-[#062B3A]">{t('inst_view_text_20', 'Post Institutional Workforce Requirement')}</h3>
            <p className="text-xs text-slate-500">{t('inst_view_text_21', 'Contract directly with registered Labour Cooperative Federations. No middleman agency cuts.')}</p>
          </div>

          <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs text-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">{t('inst_view_text_22', 'Project / Contract Title')}</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. AIIMS Trauma Centre Phase 2 Electrical Cabling"
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{t('inst_view_text_23', 'Trade Specialization Required')}</label>
                <select
                  value={serviceCategoryName}
                  onChange={(e) => {
                    setServiceCategoryName(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl"
                >
                  <option value="Electrical & Electronics">{t('inst_view_text_24', 'Electrical & Electronics')}</option>
                  <option value="Plumbing & Sanitary">{t('inst_view_text_25', 'Plumbing & Sanitary')}</option>
                  <option value="Carpentry & Woodwork">{t('inst_view_text_26', 'Carpentry & Woodwork')}</option>
                  <option value="Painting & Waterproofing">{t('inst_view_text_27', 'Painting & Waterproofing')}</option>
                  <option value="Industrial Cleaning">{t('inst_view_text_28', 'Deep Sanitization & Housekeeping')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">{t('inst_view_text_29', 'Scope of Work & Technical Specifications')}</label>
              <textarea
                rows={3}
                required
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Detail technical requirements, site safety norms, expected daily hours, tools required..."
                className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold mb-1">Headcount (Number of Workers)</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  required
                  value={requiredWorkersCount}
                  onChange={(e) => setRequiredWorkersCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Total Project Budget (INR)</label>
                <input
                  type="number"
                  required
                  value={budgetTotal}
                  onChange={(e) => setBudgetTotal(parseInt(e.target.value) || 100000)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">{t('inst_view_text_30', 'Assigned Cooperative Federation')}</label>
                <select
                  value={targetSocietyId}
                  onChange={(e) => setTargetSocietyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl font-medium"
                >
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">{t('inst_view_text_31', 'Project Site Location')}</label>
              <input
                type="text"
                required
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F7F2] border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t('inst_view_text_32', 'Submit Work Order & Lock Escrow Budget')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoice Modal for specific project */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          workOrder={selectedInvoiceOrder}
          onClose={closeSelectedInvoiceOrder}
        />
      )}
    </div>
  );
};
