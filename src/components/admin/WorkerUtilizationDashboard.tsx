import React, { useState } from 'react';
import {
  Users,
  HardHat,
  Briefcase,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MapPin,
  Award,
  Zap,
  ArrowRight,
  Filter,
  Search,
  Activity,
  Layers,
  ChevronRight,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Worker } from '../../types';
import { computeWorkerUtilizationStats } from '../../utils/workerUtilizationEngine';

export const WorkerUtilizationDashboard: React.FC = () => {
  const { workers, bookings, workOrders, updateWorkerAvailability, rebalanceWorkforce, rebalanceWorker, showToast, updateWorkerSafetyStatus, t } = useApp();
  
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'underutilized' | 'skills' | 'areas' | 'assignments'>('overview');

  const stats = computeWorkerUtilizationStats(workers, bookings, workOrders);

  // Filtered workers list
  const filteredWorkers = workers.filter((w) => {
    const matchesSkill =
      selectedSkillFilter === 'all' ||
      w.skills.some((s) => s.category.toLowerCase().includes(selectedSkillFilter.toLowerCase()) || s.name.toLowerCase().includes(selectedSkillFilter.toLowerCase()));
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.societyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSkill && matchesSearch;
  });

  const handleRebalanceWorker = (workerId: string, workerName: string) => {
    rebalanceWorker(workerId);
  };

  const handleBatchAutoBalance = () => {
    rebalanceWorkforce();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Workforce Command & Auto-Rebalance */}
      <div className="bg-gradient-to-r from-[#062B3A] via-[#3B2C78] to-[#35C6B0] text-white p-5 sm:p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/10 text-yellow-300">
              <Activity className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-black">{t('admin_util_text_1', 'Cooperative Workforce Utilization & Employment Command')}</h3>
          </div>
          <p className="text-xs text-purple-200">{t('admin_util_text_2', 'Real-time workload distribution, skill saturation index, and fair-share allocation balancing')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBatchAutoBalance}
            className="px-4 py-2.5 bg-gradient-to-r from-[#E0A922] to-yellow-400 text-[#062B3A] rounded-xl text-xs font-black shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#062B3A]" />
            <span>AI Rebalance Workforce ({stats.underutilizedCount} Underutilized)</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('admin_util_text_3', 'Total Members')}</span>
            <Users className="w-4 h-4 text-[#35C6B0]" />
          </div>
          <span className="text-2xl font-black text-[#062B3A] mt-1 block">{stats.totalWorkers}</span>
          <span className="text-[10px] text-slate-500">{t('admin_util_text_4', '100% Certified Artisans')}</span>
        </div>

        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('admin_util_text_5', 'Available Ready')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">{stats.availableCount}</span>
          <span className="text-[10px] text-emerald-700 font-semibold">{t('admin_util_text_6', 'Immediate Dispatch')}</span>
        </div>

        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('admin_util_text_7', 'Assigned on Jobs')}</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-blue-800 mt-1 block">{stats.assignedCount}</span>
          <span className="text-[10px] text-blue-700 font-semibold">{t('admin_util_text_8', 'Active on Sites')}</span>
        </div>

        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-amber-200 bg-amber-50/30 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('admin_util_text_9', 'Underutilized')}</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-900 mt-1 block">{stats.underutilizedCount}</span>
          <span className="text-[10px] text-amber-700 font-semibold">&lt; 15 hrs this week</span>
        </div>

        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-purple-200 bg-purple-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('admin_util_text_10', 'Jobs Completed')}</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-purple-900 mt-1 block">{stats.completedJobsTotal}</span>
          <span className="text-[10px] text-purple-700 font-semibold">{t('admin_util_text_11', 'Quality Verified')}</span>
        </div>

        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('admin_util_text_12', 'Workload Hours')}</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-indigo-900 mt-1 block">{stats.totalHoursLogged}h</span>
          <span className="text-[10px] text-indigo-700 font-semibold">Avg {stats.averageWeeklyHours} hrs/wk</span>
        </div>
      </div>

      {/* Actionable Insights Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-[#062B3A] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#35C6B0]" />
            <span>{t('admin_util_text_13', 'Cooperative Workforce Intelligence & Insights')}</span>
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">{t('admin_util_text_14', 'Auto-evaluated every 15 mins')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stats.actionableInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-2xl border transition-all ${
                insight.type === 'underutilized'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : insight.type === 'surplus'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-purple-50/60 border-purple-200 text-purple-950'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-black leading-snug">{insight.title}</span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    insight.type === 'underutilized'
                      ? 'bg-amber-200 text-amber-900'
                      : insight.type === 'surplus'
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-purple-200 text-purple-900'
                  }`}
                >
                  {insight.category}
                </span>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed mb-2.5">{insight.description}</p>
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[10px] opacity-90">Action: {insight.recommendedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Utilization Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 bg-[#F7F7F2] p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeSubTab === 'overview' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Workforce Roster ({workers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('underutilized')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'underutilized' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t('admin_util_text_15', 'Underutilized Workers')}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px]">
              {stats.underutilizedCount}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeSubTab === 'skills' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >{t('admin_util_text_16', 'Skill-wise Distribution')}</button>
          <button
            onClick={() => setActiveSubTab('areas')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeSubTab === 'areas' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >{t('admin_util_text_17', 'Area-wise Workforce')}</button>
          <button
            onClick={() => setActiveSubTab('assignments')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeSubTab === 'assignments' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Active Assignments ({stats.activeAssignments.length})
          </button>
        </div>

        {/* Filter / Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member, skill, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-slate-200 rounded-xl w-40 sm:w-56 focus:outline-none focus:ring-1 focus:ring-[#35C6B0]"
            />
          </div>
        </div>
      </div>

      {/* SUBTAB 1: WORKFORCE ROSTER */}
      {activeSubTab === 'overview' && (
        <div className="space-y-3">
          <div className="overflow-x-auto bg-[#FAF9F6] rounded-3xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F2] text-[#062B3A] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">{t('admin_util_text_18', 'Member Craftsman')}</th>
                  <th className="p-3.5">{t('admin_util_text_19', 'Primary Trade & Skill')}</th>
                  <th className="p-3.5">{t('admin_util_text_20', 'Cooperative Society')}</th>
                  <th className="p-3.5">{t('admin_util_text_21', 'Location Hub')}</th>
                  <th className="p-3.5">{t('admin_util_text_22', 'Current Status')}</th>
                  <th className="p-3.5">{t('admin_util_text_23', 'Workload Index')}</th>
                  <th className="p-3.5">{t('admin_util_text_24', 'Weekly Hours')}</th>
                  <th className="p-3.5 text-right">{t('admin_util_text_25', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredWorkers.map((worker) => {
                  const isUnderutilized = worker.currentWorkloadScore <= 35;
                  const weeklyHours = Math.max(8, Math.round(worker.currentWorkloadScore * 0.45 + 6));
                  return (
                    <tr key={worker.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={worker.avatar}
                            alt={worker.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{worker.name}</span>
                              {worker.verificationStatus === 'verified' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{worker.memberId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">{worker.skills[0]?.name}</span>
                        <span className="text-[10px] text-slate-500 block">{worker.skills[0]?.skillLevel}</span>
                      </td>
                      <td className="p-3.5 text-[11px] text-[#5A61AA] max-w-[180px] truncate">
                        {worker.societyName}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[11px] text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {worker.location.area}, {worker.location.city}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            worker.availability === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : worker.availability === 'on_job'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              worker.availability === 'available'
                                ? 'bg-emerald-500'
                                : worker.availability === 'on_job'
                                ? 'bg-blue-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          {worker.availability === 'available'
                            ? 'Available'
                            : worker.availability === 'on_job'
                            ? 'On Job'
                            : 'Offline'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-slate-700">{worker.currentWorkloadScore}%</span>
                            <span
                              className={`text-[9px] font-bold ${
                                isUnderutilized ? 'text-amber-600' : 'text-emerald-600'
                              }`}
                            >
                              {isUnderutilized ? 'Low Load' : 'Active'}
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isUnderutilized ? 'bg-amber-500' : 'bg-[#35C6B0]'
                              }`}
                              style={{ width: `${worker.currentWorkloadScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900">{weeklyHours} hrs</span>
                        <span className="text-[10px] text-slate-500 block">{t('admin_util_text_26', 'This cycle')}</span>
                      </td>
                      <td className="p-3.5 text-right">
                        {isUnderutilized ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRebalanceWorker(worker.id, worker.name)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            >{t('admin_util_text_27', 'Prioritize')}</button>
                            {worker.safetyStatus !== 'suspended' ? (
                              <button
                                onClick={() => updateWorkerSafetyStatus(worker.id, 'suspended', 'Admin intervention.')}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >Suspend</button>
                            ) : (
                              <button
                                onClick={() => updateWorkerSafetyStatus(worker.id, 'active', 'Admin intervention.')}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >Reactivate</button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">{t('admin_util_text_28', 'Balanced')}</span>
                            {worker.safetyStatus !== 'suspended' ? (
                              <button
                                onClick={() => updateWorkerSafetyStatus(worker.id, 'suspended', 'Admin intervention.')}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >Suspend</button>
                            ) : (
                              <button
                                onClick={() => updateWorkerSafetyStatus(worker.id, 'active', 'Admin intervention.')}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                              >Reactivate</button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: UNDERUTILIZED WORKERS LIST & BALANCING */}
      {activeSubTab === 'underutilized' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950">
            <div>
              <h5 className="font-bold text-sm">{t('admin_util_text_29', 'Underutilized Workforce Equalizer')}</h5>
              <p className="text-[11px] text-amber-800 mt-0.5">
                These {stats.underutilizedCount} verified members have logged under 15 hours this week. Cooperative principles mandate distributing gig requests to balance income across all members.
              </p>
            </div>
            <button
              onClick={handleBatchAutoBalance}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t('admin_util_text_30', 'Prioritize All for Inbound Jobs')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.underutilizedWorkersList.map(({ worker, weeklyHours, lastJobDaysAgo, utilizationPercent, reason }) => (
              <div
                key={worker.id}
                className="p-4 bg-[#FAF9F6] rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{worker.name}</h4>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          {weeklyHours}h / 40h
                        </span>
                      </div>
                      <p className="text-xs text-[#5A61AA] truncate">{worker.skills[0]?.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {worker.location.area}, {worker.location.city}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-[#F7F7F2] rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">{t('admin_util_text_31', 'Utilization Rate')}</span>
                      <span className="font-bold text-amber-700">{utilizationPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${utilizationPercent}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium italic mt-1">
                      {reason} (Last order: {lastJobDaysAgo} days ago)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRebalanceWorker(worker.id, worker.name)}
                  className="w-full py-2 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('admin_util_text_32', 'Assign to Immediate Dispatch Pool')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SKILL-WISE WORKFORCE DISTRIBUTION */}
      {activeSubTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.skillBreakdown.map((item, idx) => (
            <div key={idx} className="p-5 bg-[#FAF9F6] rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.category}</h4>
                  <p className="text-[11px] text-[#5A61AA]">{item.skillName}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.demandLevel === 'surplus'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.demandLevel === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {item.demandLevel === 'surplus'
                    ? 'Surplus Available'
                    : item.demandLevel === 'high'
                    ? 'High Saturation'
                    : 'Balanced'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-500 block">{t('admin_util_text_33', 'Total')}</span>
                  <strong className="text-base text-slate-900 font-black">{item.totalWorkers}</strong>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-900">
                  <span className="text-[10px] text-emerald-700 block">{t('admin_util_text_34', 'Available')}</span>
                  <strong className="text-base text-emerald-800 font-black">{item.availableCount}</strong>
                </div>
                <div className="p-2 bg-blue-50 rounded-xl text-blue-900">
                  <span className="text-[10px] text-blue-700 block">{t('admin_util_text_35', 'Assigned')}</span>
                  <strong className="text-base text-blue-800 font-black">{item.assignedCount}</strong>
                </div>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(item.assignedCount / (item.totalWorkers || 1)) * 100}%` }}
                />
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${(item.availableCount / (item.totalWorkers || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 4: AREA-WISE WORKFORCE */}
      {activeSubTab === 'areas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.areaBreakdown.map((area, idx) => (
            <div key={idx} className="p-5 bg-[#FAF9F6] rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#35C6B0]" />
                    <span>{area.areaName}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">{area.district}</p>
                </div>
                <span className="text-xs font-black text-[#062B3A]">{area.utilizationRate}% Utilized</span>
              </div>

              <div className="flex justify-between items-center text-xs p-2.5 bg-[#F7F7F2] rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-500 block">{t('admin_util_text_36', 'Total Artisans')}</span>
                  <strong className="text-sm font-bold text-slate-800">{area.totalWorkers}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block">{t('admin_util_text_34', 'Available')}</span>
                  <strong className="text-sm font-bold text-emerald-800">{area.availableCount}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-blue-700 block">{t('admin_util_text_35', 'Assigned')}</span>
                  <strong className="text-sm font-bold text-blue-800">{area.assignedCount}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 5: ACTIVE LIVE ASSIGNMENTS */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.activeAssignments.map((assign, idx) => (
              <div key={idx} className="p-4 bg-[#FAF9F6] rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={assign.workerAvatar}
                      alt={assign.workerName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{assign.workerName}</h5>
                      <span className="text-[10px] text-[#5A61AA]">{assign.title}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      assign.type === 'institutional'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {assign.type.toUpperCase()}
                  </span>
                </div>

                <div className="p-2.5 bg-[#F7F7F2] rounded-xl text-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Client:</span>
                    <span className="font-semibold text-slate-800">{assign.clientName}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{assign.location}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-700">{assign.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
