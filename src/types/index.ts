export type UserRole = 'customer' | 'worker' | 'admin' | 'institution' | 'apprentice';

export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'in_review';

export type WorkerAvailability = 'available' | 'on_job' | 'leave' | 'offline';

export type OrgType = 'federation' | 'apex_society' | 'district_union' | 'primary_society';

export interface IdentityVerificationDetails {
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  digilockerVerified: boolean;
  aadhaarMaskedUid?: string; // e.g. "XXXX-XXXX-8912" (No raw Aadhaar stored)
  eKycRefToken?: string;
  verifiedAt?: string;
  societyVerification?: {
    verified: boolean;
    membershipId: string;
    societyCode: string;
    verifiedByRegistrar: string;
    verifiedAt: string;
  };
  skillsVerification?: {
    verified: boolean;
    tradeName: string;
    ncvtCertificateId: string;
    issuingAuthority: string;
    verifiedAt: string;
  };
  orgVerification?: {
    verified: boolean;
    cinOrGstin: string;
    orgName: string;
    authorizedSignatoryDesignation: string;
    verifiedAt: string;
  };
  adminAuthVerification?: {
    verified: boolean;
    boardResolutionNo: string;
    registrarAuthorizationToken: string;
    verifiedAt: string;
  };
  stepsCompleted: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  address: string;
  city: string;
  pincode: string;
  societyId?: string;
  societyName?: string;
  federationName?: string;
  memberId?: string;
  institutionName?: string;
  institutionType?: string;
  joinedDate: string;
  rating?: number;
  walletBalance?: number;
  walletTransactions?: WalletTransaction[];
  verificationDetails?: IdentityVerificationDetails;
}

export interface CooperativeOrg {
  id: string;
  name: string;
  type: OrgType;
  parentOrgId?: string;
  code: string;
  registrationNumber: string;
  district: string;
  state: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  workerCount: number;
  activeOrdersCount: number;
  welfareFundBalance: number;
  verificationAuthority: string;
  establishedYear: number;
  address: string;
}

export interface WorkerSkill {
  id: string;
  name: string;
  category: string;
  experienceYears: number;
  skillLevel: 'Beginner' | 'Skilled' | 'Master Craftsman';
  certName: string;
  certIssuer: string;
  certNumber: string;
  verifiedByCoop: boolean;
  verifiedDate?: string;
}

export interface WelfareRecord {
  id: string;
  workerId: string;
  workerName: string;
  type: 'medical_aid' | 'accident_cover' | 'tool_subsidy' | 'pension_fund' | 'scholarship' | 'maternity_paternity';
  title: string;
  amount: number;
  date: string;
  status: 'approved' | 'disbursed' | 'under_review' | 'rejected';
  referenceNo: string;
  notes?: string;
}

export interface InsuranceDetail {
  policyNumber: string;
  schemeName: string;
  providerName: string;
  coverageAmount: number;
  validTill: string;
  nomineeName: string;
  nomineeRelation: string;
  status: 'active' | 'renewing';
  lastPremiumPaidByCoop: string;
}

export interface TrainingRecord {
  id: string;
  workerId: string;
  courseTitle: string;
  certifiedBy: string;
  completionDate: string;
  certificateNumber: string;
  scorePercentage: number;
  durationHours: number;
}

export interface Worker {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  societyId: string;
  societyName: string;
  federationName: string;
  memberId: string;
  registrationDate: string;
  verificationStatus: VerificationStatus;
  verificationDocUrl?: string;
  badge: 'Master Craftsman' | 'Certified Pro' | 'Verified Member' | 'Apprentice';
  isMentor?: boolean;
  mentorApprentices?: string[];
  apprenticeshipId?: string;
  skills: WorkerSkill[];
  hourlyRate: number;
  dailyRate: number;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
    city: string;
  };
  availability: WorkerAvailability;
  currentWorkloadScore: number; // 0 to 100
  activeJobId?: string;
  welfareRecords: WelfareRecord[];
  insurance: InsuranceDetail;
  trainings: TrainingRecord[];
  bankAccount: {
    bankName: string;
    accountNumberMasked: string;
    ifsc: string;
  };
  earnings: {
    today: number;
    thisMonth: number;
    total: number;
    pendingPayout: number;
    escrowAmount?: number;
    availableBalance?: number;
    withdrawn?: number;
    welfareContribution: number;
  };
  safetyStatus?: 'active' | 'suspension_review' | 'disciplinary_review' | 'suspended';
  upheldComplaintsCount?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  popularBadge?: string;
  imageUrl: string;
  subCategories: string[];
  averageTimeMinutes: number;
  cooperativeGuarantee: string;
}

export type OmbudsmanStatus = 'payment_held_in_escrow' | 'under_ombudsman_review' | 'rework_required' | 'refund_issued' | 'worker_payout_released' | 'available_to_withdraw';

export type BookingStatus =
  | 'requested'
  | 'matched'
  | 'confirmed'
  | 'in_transit'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface BookingTimelineItem {
  status: BookingStatus;
  label: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface HouseholdBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceCategoryId: string;
  serviceCategoryName: string;
  subService: string;
  issueDescription: string;
  isEmergency: boolean;
  scheduledDate: string;
  scheduledTimeSlot: string;
  status: BookingStatus;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  apprenticeAssistingId?: string;
  apprenticeAssistingName?: string;
  stipendAwarded?: number;
  assignedWorkerPhone?: string;
  assignedWorkerPhoto?: string;
  assignedWorkerRating?: number;
  assignedWorkerSociety?: string;
  societyId: string;
  societyName: string;
  estimatedPrice: number;
  finalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'escrow_coop' | 'refunded';
  ombudsmanStatus?: OmbudsmanStatus;
  escrowAmount?: number;
  refundAmount?: number;
  workerPayoutAmount?: number;
  ombudsmanDecision?: string;
  resolutionTimestamp?: string;
  reworkAssignedWorkerId?: string;
  cancellationReason?: string;
  paymentMethod?: 'UPI / Card' | 'Cash to Cooperative Receipt' | 'NetBanking' | 'Wallet' | 'Aatral Cash' | 'Mixed';
  walletUsedAmount?: number;
  otpCode: string;
  workImagesBefore: string[];
  workImagesAfter: string[];
  rating?: number;
  reviewText?: string;
  reviewDate?: string;
  chatMessages: ChatMessage[];
  timeline: BookingTimelineItem[];
  location: {
    lat: number;
    lng: number;
    area: string;
    city: string;
  };
  createdAt: string;
}

export interface AssignedWorkerItem {
  workerId: string;
  workerName: string;
  workerAvatar: string;
  phone: string;
  skillName: string;
  skillLevel: string;
  rating: number;
  assignedDate: string;
  status: 'assigned' | 'active_on_site' | 'completed' | 'reallocated';
  dailyWage: number;
  attendanceDaysCount: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  payoutAmount: number;
  completionPercent: number;
  verifiedByAdmin?: string;
}

export interface DailyAttendance {
  date: string;
  workerId: string;
  workerName: string;
  status: 'present' | 'absent' | 'half_day';
  checkInTime: string;
  checkOutTime: string;
  verifiedBySiteSupervisor: boolean;
}

export type WorkOrderStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'planning'
  | 'partially_assigned'
  | 'fully_assigned'
  | 'in_execution'
  | 'completed'
  | 'settled';

export interface InstitutionalWorkOrder {
  id: string;
  orderNumber: string;
  institutionId: string;
  institutionName: string;
  institutionType: 'Government Dept' | 'Public Sector' | 'Hospital' | 'Educational Campus' | 'Commercial Real Estate' | 'Industrial Park';
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  projectTitle: string;
  projectDescription: string;
  serviceCategoryId: string;
  serviceCategoryName: string;
  projectLocation: string;
  city: string;
  startDate: string;
  endDate: string;
  estimatedDays: number;
  totalWorkersRequired: number;
  assignedWorkers: AssignedWorkerItem[];
  status: WorkOrderStatus;
  budgetTotal: number;
  dailyWagePerWorker: number;
  cooperativeCommissionPercent: number; // e.g. 5%
  welfareContributionPerWorker: number; // e.g. 50 Rs/day
  milestones: ProjectMilestone[];
  attendance: DailyAttendance[];
  billingStatus: 'unbilled' | 'invoice_generated' | 'paid_in_escrow' | 'released_to_workers';
  feedback?: {
    rating: number;
    comment: string;
    verifiedBy: string;
    date: string;
  };
  societyId: string;
  societyName: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  ticketNo: string;
  raisedByRole: UserRole;
  raisedById: string;
  raisedByName: string;
  raisedByPhone: string;
  targetType: 'booking' | 'work_order' | 'worker' | 'society';
  targetId: string;
  targetName: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  outcome?: 'upheld' | 'dismissed' | 'pending';
  adminNotes?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  date: string;
}

export interface UserWalletEntry {
  balance: number;
  transactions: WalletTransaction[];
  welcomeGranted: boolean;
  rewardedBookingIds: string[]; // tracks which booking IDs already got a reward
}

export type UserWalletsMap = Record<string, UserWalletEntry>;

// ─── Emergency Contacts & SOS ─────────────────────────────────────────────────

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;        // e.g. "+91 98765 43210"
  relationship: string; // e.g. "Spouse", "Parent", "Friend"
  isActive: boolean;    // customer can deactivate without deleting
  addedAt: string;      // ISO date string
}

export interface SosContactNotification {
  contactId: string;
  name: string;
  phone: string;
  smsSentAt: string;
  smsStatus: 'sending' | 'sent' | 'delivered' | 'failed';
  whatsappSentAt: string;
  whatsappStatus: 'sending' | 'sent' | 'delivered' | 'failed';
}

export interface SosAlert {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  bookingId: string;
  bookingNumber: string;
  serviceCategory: string;
  workerName: string;
  workerPhone: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contactsNotified: SosContactNotification[];
  status: 'active' | 'resolved';
}


export interface ApprenticeshipRecord {
  id: string;
  apprenticeId: string;
  apprenticeName: string;
  mentorId: string;
  mentorName: string;
  skillCategory: string;
  startDate: string;
  status: 'active' | 'evaluating' | 'pending_admin' | 'completed' | 'rejected';
  trainingHours: number;
  assistedJobs: string[];
  stipendEarned: number;
  evaluation?: {
    rating: number;
    comments: string;
    date: string;
  };
}

export interface AIDemandForecast {
  area: string;
  serviceCategory: string;
  period: string;
  historicalDemandIndex: number;
  predictedDemandIndex: number;
  confidenceScore: number;
  suggestedWorkerCount: number;
  seasonalFactor: string;
  demandSpikeReason: string;
  chartData: { date: string; historical: number; predicted: number }[];
  category?: string;
  predictedDemandMultiplier?: string;
  reasons?: string[];
  recommendedActions?: string[];
}

export interface AIAllocationRecommendation {
  workOrderId?: string;
  bookingId?: string;
  recommendedWorkers: {
    workerId: string;
    workerName: string;
    skillMatchScore: number; // 0 - 100
    distanceKm: number;
    rating: number;
    experienceYears: number;
    currentWorkload: number;
    matchReason: string;
    fitRank: number;
  }[];
  allocationRationale: string;
  estimatedEfficiencyGain: string;
}

export interface CooperativeAllocationConfig {
  id: string;
  societyId: string;
  policyName: string;
  workerDirectSharePercent: number; // e.g. 85%
  cooperativeOpsPercent: number; // e.g. 6%
  welfareFundPercent: number; // e.g. 4%
  insurancePoolPercent: number; // e.g. 3%
  trainingFundPercent: number; // e.g. 2%
  emergencyReliefPoolPercent: number; // e.g. 0%
  minimumHourlyGuarantee: number; // e.g. ₹200
  minimumDailyGuarantee: number; // e.g. ₹1000
  escrowReleaseTrigger: 'otp_verified' | 'customer_signoff' | 'milestone_approval';
  settlementFrequency: 'instant_upi' | 'daily_batch' | 'weekly_cycle';
  lastUpdated: string;
  updatedBy: string;
}

export interface FairWageBreakdown {
  totalServiceAmount: number;
  workerEarnings: {
    amount: number;
    percentage: number;
    status: 'settled_instant_upi' | 'in_escrow' | 'processing' | 'paid_direct';
    payoutUtr?: string;
    settledAt?: string;
  };
  cooperativeOps: {
    amount: number;
    percentage: number;
    description: string;
  };
  welfareAllocation: {
    amount: number;
    percentage: number;
    description: string;
  };
  insuranceAllocation: {
    amount: number;
    percentage: number;
    description: string;
  };
  trainingAllocation: {
    amount: number;
    percentage: number;
    description: string;
  };
  aggregatorComparison: {
    corporateCommissionAvoided: number; // 25-35% typical aggregator cut
    cooperativeAdvantagePercent: number;
  };
  policyAppliedName: string;
}

export interface WorkerUtilizationStats {
  totalWorkers: number;
  availableCount: number;
  assignedCount: number;
  busyCount: number;
  leaveCount: number;
  underutilizedCount: number;
  completedJobsTotal: number;
  totalHoursLogged: number;
  averageWeeklyHours: number;
  underutilizedWorkersList: {
    worker: Worker;
    weeklyHours: number;
    lastJobDaysAgo: number;
    utilizationPercent: number;
    reason: string;
  }[];
  skillBreakdown: {
    skillName: string;
    category: string;
    totalWorkers: number;
    availableCount: number;
    assignedCount: number;
    demandLevel: 'high' | 'medium' | 'balanced' | 'surplus';
  }[];
  areaBreakdown: {
    areaName: string;
    district: string;
    totalWorkers: number;
    availableCount: number;
    assignedCount: number;
    utilizationRate: number;
  }[];
  activeAssignments: {
    assignmentId: string;
    type: 'household' | 'institutional';
    title: string;
    workerId: string;
    workerName: string;
    workerAvatar: string;
    clientName: string;
    location: string;
    status: string;
    startTime: string;
    estEndTime: string;
    loadIndex: number;
  }[];
  actionableInsights: {
    id: string;
    type: 'surplus' | 'shortage' | 'underutilized' | 'rebalance_ready';
    title: string;
    description: string;
    recommendedAction: string;
    category: string;
  }[];
}
