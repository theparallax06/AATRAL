import React, { useState } from 'react';
import {
  Scale,
  X,
  CheckCircle2,
  Sliders,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Award,
  DollarSign,
  Building,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { CooperativeAllocationConfig } from '../../types';
import { PRESET_POLICIES, calculateWageBreakdown, formatINR, DEFAULT_COOPERATIVE_CONFIG } from '../../utils/wageCalculator';

interface CooperativeAllocationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CooperativeAllocationSettingsModal: React.FC<CooperativeAllocationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { allocationConfig, updateAllocationConfig, showToast } = useApp();
  const safeConfig = allocationConfig || DEFAULT_COOPERATIVE_CONFIG;

  const [policyName, setPolicyName] = useState(safeConfig.policyName);
  const [workerShare, setWorkerShare] = useState(safeConfig.workerDirectSharePercent);
  const [opsShare, setOpsShare] = useState(safeConfig.cooperativeOpsPercent);
  const [welfareShare, setWelfareShare] = useState(safeConfig.welfareFundPercent);
  const [insuranceShare, setInsuranceShare] = useState(safeConfig.insurancePoolPercent);
  const [trainingShare, setTrainingShare] = useState(safeConfig.trainingFundPercent);
  const [previewAmount, setPreviewAmount] = useState<number>(1500);

  if (!isOpen) return null;

  const totalPercent = workerShare + opsShare + welfareShare + insuranceShare + trainingShare;
  const isValid = totalPercent === 100;

  const handleApplyPreset = (preset: (typeof PRESET_POLICIES)[0]) => {
    setPolicyName(preset.name);
    setWorkerShare(preset.workerDirectSharePercent);
    setOpsShare(preset.cooperativeOpsPercent);
    setWelfareShare(preset.welfareFundPercent);
    setInsuranceShare(preset.insurancePoolPercent);
    setTrainingShare(preset.trainingFundPercent);
  };

  const handleSave = () => {
    if (!isValid) {
      showToast('Allocation percentages must sum to exactly 100%', 'error');
      return;
    }

    const updated: CooperativeAllocationConfig = {
      ...allocationConfig,
      policyName,
      workerDirectSharePercent: workerShare,
      cooperativeOpsPercent: opsShare,
      welfareFundPercent: welfareShare,
      insurancePoolPercent: insuranceShare,
      trainingFundPercent: trainingShare,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'Cooperative Managing Committee Resolution',
    };

    updateAllocationConfig(updated);
    showToast('Cooperative Fair-Wage Allocation Rules updated successfully!', 'success');
    onClose();
  };

  // Sample simulation calculation
  const mockConfig: CooperativeAllocationConfig = {
    ...allocationConfig,
    policyName,
    workerDirectSharePercent: workerShare,
    cooperativeOpsPercent: opsShare,
    welfareFundPercent: welfareShare,
    insurancePoolPercent: insuranceShare,
    trainingFundPercent: trainingShare,
  };
  const simulationBreakdown = calculateWageBreakdown(previewAmount, mockConfig);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="shrink-0 bg-[#062B3A] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <Scale className="w-5 h-5 text-yellow-300" />
            <h3 className="text-base sm:text-lg font-black">{t('admin_alloc_text_1', 'Cooperative Fair-Wage Allocation Rule Engine')}</h3>
          </div>
          <p className="text-xs text-purple-200">{t('admin_alloc_text_2', 'Configure dynamic, democratic revenue distribution rules approved by the Cooperative General Body')}</p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Preset Policy Selection */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Cooperative Policy Presets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_POLICIES.map((preset) => {
                const isSelected = workerShare === preset.workerDirectSharePercent && welfareShare === preset.welfareFundPercent;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F7F7F2] border-[#35C6B0] ring-1 ring-[#35C6B0]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                      <span className="text-[9px] font-bold bg-[#35C6B0]/10 text-[#35C6B0] px-1.5 py-0.5 rounded">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Percentage Sliders */}
          <div className="space-y-4 bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{t('admin_alloc_text_3', 'Distribution Allocation Sliders')}</span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                Total: {totalPercent}% / 100%
              </span>
            </div>

            {/* Worker Direct Share */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />{t('admin_alloc_text_4', 'Worker Direct Take-Home Earnings')}</span>
                <span className="font-black text-emerald-700 text-sm">{workerShare}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={95}
                value={workerShare}
                onChange={(e) => setWorkerShare(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-500 block">{t('admin_alloc_text_5', 'Direct take-home wage deposited instantly to the artisan\'s verified bank/UPI account.')}</span>
            </div>

            {/* Cooperative Ops */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#35C6B0]" />{t('admin_alloc_text_6', 'Cooperative Operations & Dispatch')}</span>
                <span className="font-black text-[#35C6B0] text-sm">{opsShare}%</span>
              </div>
              <input
                type="range"
                min={2}
                max={15}
                value={opsShare}
                onChange={(e) => setOpsShare(Number(e.target.value))}
                className="w-full accent-[#35C6B0]"
              />
              <span className="text-[10px] text-slate-500 block">{t('admin_alloc_text_7', 'Maintenance of local cooperative tool libraries, supervisor oversight, and server infrastructure.')}</span>
            </div>

            {/* Welfare Fund */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-pink-600" />{t('admin_alloc_text_8', 'Member Welfare & Emergency Medical Pool')}</span>
                <span className="font-black text-pink-700 text-sm">{welfareShare}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={welfareShare}
                onChange={(e) => setWelfareShare(Number(e.target.value))}
                className="w-full accent-pink-600"
              />
            </div>

            {/* Insurance Pool */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Group Accident & Health Insurance Fund (₹5L Suraksha)
                </span>
                <span className="font-black text-blue-700 text-sm">{insuranceShare}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                value={insuranceShare}
                onChange={(e) => setInsuranceShare(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Skill Training */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />{t('admin_alloc_text_9', 'NCVT / Skill India Continuous Upgrading Fund')}</span>
                <span className="font-black text-amber-700 text-sm">{trainingShare}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={trainingShare}
                onChange={(e) => setTrainingShare(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>

          {/* Live Simulation Preview Card */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Live Work Order Simulation ({formatINR(previewAmount)})
              </span>
              <div className="flex items-center gap-1">
                {[500, 1500, 5000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPreviewAmount(amt)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      previewAmount === amt ? 'bg-yellow-400 text-slate-950' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-emerald-400 block">{t('admin_alloc_text_10', 'Worker Direct Share')}</span>
                <strong className="text-sm text-emerald-300">
                  {formatINR(simulationBreakdown.workerEarnings.amount)}
                </strong>
                <span className="text-[9px] text-slate-400 block">({workerShare}%)</span>
              </div>

              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-purple-400 block">{t('admin_alloc_text_11', 'Coop Hub Ops')}</span>
                <strong className="text-sm text-purple-300">
                  {formatINR(simulationBreakdown.cooperativeOps.amount)}
                </strong>
                <span className="text-[9px] text-slate-400 block">({opsShare}%)</span>
              </div>

              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-pink-400 block">{t('admin_alloc_text_12', 'Welfare Fund')}</span>
                <strong className="text-sm text-pink-300">
                  {formatINR(simulationBreakdown.welfareAllocation.amount)}
                </strong>
                <span className="text-[9px] text-slate-400 block">({welfareShare}%)</span>
              </div>

              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] text-blue-400 block">{t('admin_alloc_text_13', 'Insurance & Skill')}</span>
                <strong className="text-sm text-blue-300">
                  {formatINR(
                    simulationBreakdown.insuranceAllocation.amount + simulationBreakdown.trainingAllocation.amount
                  )}
                </strong>
                <span className="text-[9px] text-slate-400 block">({insuranceShare + trainingShare}%)</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              *0% corporate commission deducted. Worker earns +{simulationBreakdown.aggregatorComparison.cooperativeAdvantagePercent}% more take-home pay compared to venture-backed gig aggregators.
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="shrink-0 bg-white border-t border-slate-100 p-4 sm:p-5 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >{t('admin_alloc_text_14', 'Cancel')}</button>
          <button
            disabled={!isValid}
            onClick={handleSave}
            className="flex-2 py-3 bg-[#35C6B0] hover:bg-[#2EAD9A] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-[#35C6B0]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('admin_alloc_text_15', 'Save & Publish Cooperative Allocation Rules')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
