import { CooperativeAllocationConfig, FairWageBreakdown } from '../types';

export const DEFAULT_COOPERATIVE_CONFIG: CooperativeAllocationConfig = {
  id: 'cfg-coop-default',
  societyId: 'org-soc-1',
  policyName: 'Standard Fair-Wage Cooperative Policy',
  workerDirectSharePercent: 85,
  cooperativeOpsPercent: 6,
  welfareFundPercent: 4,
  insurancePoolPercent: 3,
  trainingFundPercent: 2,
  emergencyReliefPoolPercent: 0,
  minimumHourlyGuarantee: 250,
  minimumDailyGuarantee: 1200,
  escrowReleaseTrigger: 'otp_verified',
  settlementFrequency: 'instant_upi',
  lastUpdated: '2026-08-20',
  updatedBy: 'Managing Committee & General Body Resolution #2026/04',
};

export const PRESET_POLICIES: {
  id: string;
  name: string;
  description: string;
  workerDirectSharePercent: number;
  cooperativeOpsPercent: number;
  welfareFundPercent: number;
  insurancePoolPercent: number;
  trainingFundPercent: number;
  badge: string;
}[] = [
  {
    id: 'preset-standard',
    name: 'Standard Labour Cooperative (85% Member Share)',
    description: 'Balanced model with strong worker take-home and stable welfare fund reserve.',
    workerDirectSharePercent: 85,
    cooperativeOpsPercent: 6,
    welfareFundPercent: 4,
    insurancePoolPercent: 3,
    trainingFundPercent: 2,
    badge: 'Recommended',
  },
  {
    id: 'preset-high-welfare',
    name: 'High-Welfare & Family Security Scheme (80% Member Share)',
    description: 'Allocates enhanced funds toward group medical cover and worker children scholarships.',
    workerDirectSharePercent: 80,
    cooperativeOpsPercent: 5,
    welfareFundPercent: 7,
    insurancePoolPercent: 5,
    trainingFundPercent: 3,
    badge: 'Maximum Social Security',
  },
  {
    id: 'preset-artisan-guild',
    name: 'Direct Craftsman Guild (90% Member Share)',
    description: 'Minimal administrative deduction optimized for senior master craftsmen and independent guild technicians.',
    workerDirectSharePercent: 90,
    cooperativeOpsPercent: 4,
    welfareFundPercent: 3,
    insurancePoolPercent: 2,
    trainingFundPercent: 1,
    badge: 'Highest Payout',
  },
  {
    id: 'preset-institutional',
    name: 'Institutional Enterprise Contract (82% Member Share)',
    description: 'Designed for large infrastructure projects with dedicated site supervisor & safety tooling allocation.',
    workerDirectSharePercent: 82,
    cooperativeOpsPercent: 8,
    welfareFundPercent: 4,
    insurancePoolPercent: 3,
    trainingFundPercent: 3,
    badge: 'Enterprise Scaled',
  },
];

export interface WageCalculationOptions {
  statusOverride?: 'settled_instant_upi' | 'in_escrow' | 'processing' | 'paid_direct';
  customUtr?: string;
  settledDate?: string;
}

export function calculateWageBreakdown(
  totalAmount: number,
  config: CooperativeAllocationConfig = DEFAULT_COOPERATIVE_CONFIG,
  options?: WageCalculationOptions
): FairWageBreakdown {
  const safeTotal = Math.max(0, totalAmount);
  
  // Calculate raw shares
  const workerPercent = config.workerDirectSharePercent;
  const opsPercent = config.cooperativeOpsPercent;
  const welfarePercent = config.welfareFundPercent;
  const insurancePercent = config.insurancePoolPercent;
  const trainingPercent = config.trainingFundPercent;

  const workerAmount = Math.round((safeTotal * workerPercent) / 100);
  const opsAmount = Math.round((safeTotal * opsPercent) / 100);
  const welfareAmount = Math.round((safeTotal * welfarePercent) / 100);
  const insuranceAmount = Math.round((safeTotal * insurancePercent) / 100);
  const trainingAmount = safeTotal - workerAmount - opsAmount - welfareAmount - insuranceAmount;

  // Typical aggregator cuts 28% for private corporate commission
  const aggregatorCorporateCut = Math.round(safeTotal * 0.28);
  const coopAdvantage = Math.round(
    ((workerAmount - (safeTotal - aggregatorCorporateCut)) / (safeTotal - aggregatorCorporateCut || 1)) * 100
  );

  const randomUtrSuffix = Math.floor(100000 + Math.random() * 900000);
  const defaultUtr = options?.customUtr || `UPI/COOP-PAY/${new Date().getFullYear()}/${randomUtrSuffix}`;

  return {
    totalServiceAmount: safeTotal,
    workerEarnings: {
      amount: workerAmount,
      percentage: workerPercent,
      status: options?.statusOverride || 'settled_instant_upi',
      payoutUtr: defaultUtr,
      settledAt: options?.settledDate || 'Instant Settlement via NPCI UPI / Direct Cooperative Ledger',
    },
    cooperativeOps: {
      amount: opsAmount,
      percentage: opsPercent,
      description: 'District cooperative hub dispatch, equipment depreciation, and escrow infrastructure maintenance.',
    },
    welfareAllocation: {
      amount: welfareAmount,
      percentage: welfarePercent,
      description: 'Worker Social Welfare Fund (emergency medical grants, maternity support, tool repair grants).',
    },
    insuranceAllocation: {
      amount: insuranceAmount,
      percentage: insurancePercent,
      description: '₹5,00,000 Group Accident & Health Suraksha Policy contribution pool.',
    },
    trainingAllocation: {
      amount: Math.max(0, trainingAmount),
      percentage: trainingPercent,
      description: 'NCVT / Skill India continuous trade upskilling & master craftsman masterclasses.',
    },
    aggregatorComparison: {
      corporateCommissionAvoided: aggregatorCorporateCut,
      cooperativeAdvantagePercent: Math.max(15, coopAdvantage),
    },
    policyAppliedName: config.policyName,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
