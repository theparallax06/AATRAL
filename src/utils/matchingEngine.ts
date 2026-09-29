import { Worker } from '../types';
import { calculateDistanceKm, calculateETAminutes } from './geoUtils';

export interface MatchCriteria {
  customerLat: number;
  customerLng: number;
  serviceCategoryId?: string;
  subService?: string;
  maxDistanceKm?: number;
  minRating?: number;
  requireVerified?: boolean;
  requireEnhancedSupport?: boolean;
}

export interface WorkerMatchResult {
  worker: Worker;
  distanceKm: number;
  etaMinutes: number;
  compositeScore: number; // 0 - 100
  scoreBreakdown: {
    proximityScore: number; // 0 - 40
    skillScore: number;     // 0 - 25
    credibilityScore: number; // 0 - 15
    ratingScore: number;    // 0 - 10
    availabilityScore: number; // 0 - 10
    reliabilityScore: number; // 0 - 15 (New Safety factor)
  };
  highlightReasons: string[];
}

export function rankAndMatchWorkers(
  workers: Worker[],
  criteria: MatchCriteria
): WorkerMatchResult[] {
  const {
    customerLat,
    customerLng,
    serviceCategoryId,
    subService,
    maxDistanceKm = 50,
    minRating = 0,
    requireVerified = true,
    requireEnhancedSupport = false,
  } = criteria;

  const results: WorkerMatchResult[] = [];

  for (const worker of workers) {
    if (worker.safetyStatus === 'suspended') {
      continue; // Filter out suspended workers entirely
    }

    if (requireVerified && worker.verificationStatus !== 'verified') {
      continue;
    }

    if (worker.rating < minRating) {
      continue;
    }

    // Distance calculation
    const distanceKm = calculateDistanceKm(
      customerLat,
      customerLng,
      worker.location.lat,
      worker.location.lng
    );

    if (distanceKm > maxDistanceKm) {
      continue;
    }

    const etaMinutes = calculateETAminutes(distanceKm);
    const highlightReasons: string[] = [];

    // 1. Proximity Score (Max 40 pts)
    // 0km -> 40pts, 5km -> 35pts, 15km -> 20pts, 30km -> 5pts
    let proximityScore = Math.max(0, Math.min(40, 40 - distanceKm * 1.2));
    if (distanceKm <= 3) {
      highlightReasons.push(`⚡ Ultra-fast dispatch (${distanceKm} km away • ~${etaMinutes} mins ETA)`);
    } else {
      highlightReasons.push(`📍 ${distanceKm} km away (${worker.location.area})`);
    }

    // 2. Skill Relevance Score (Max 25 pts)
    let skillScore = 15; // baseline skill match
    if (serviceCategoryId) {
      const matchSkill = worker.skills.find(
        (s) =>
          s.category.toLowerCase().includes(serviceCategoryId.toLowerCase()) ||
          s.name.toLowerCase().includes(serviceCategoryId.toLowerCase()) ||
          (subService && s.name.toLowerCase().includes(subService.toLowerCase()))
      );

      if (matchSkill) {
        skillScore = 25;
        if (matchSkill.skillLevel === 'Master Craftsman') {
          highlightReasons.push(`🏆 Master Craftsman (${matchSkill.experienceYears}+ yrs exp)`);
        } else {
          highlightReasons.push(`🛠️ Certified in ${matchSkill.name}`);
        }
      } else {
        skillScore = 8;
      }
    }

    // 3. Credibility & Verification (Max 15 pts)
    let credibilityScore = 10;
    if (worker.badge === 'Master Craftsman') {
      credibilityScore = 15;
    } else if (worker.badge === 'Certified Pro') {
      credibilityScore = 14;
    }
    if (worker.insurance.status === 'active') {
      highlightReasons.push(`🛡️ Covered under ₹5L Cooperative Group Insurance`);
    }

    // 4. Rating & Reviews Score (Max 10 pts)
    const ratingScore = Math.min(10, Math.max(0, (worker.rating / 5) * 10));
    if (worker.rating >= 4.8) {
      highlightReasons.push(`⭐ Top-Rated Craftsman (${worker.rating} / 5.0 • ${worker.completedJobsCount}+ jobs)`);
    }

    // 5. Availability & Current Workload (Max 10 pts)
    let availabilityScore = 10;
    if (worker.availability === 'available') {
      // Lower score if high workload
      availabilityScore = Math.max(2, 10 - Math.floor(worker.currentWorkloadScore / 15));
    } else if (worker.availability === 'on_job') {
      availabilityScore = 3;
    } else {
      availabilityScore = 0;
    }

    // 6. Safety & Reliability Score (Max 15 pts)
    let reliabilityScore = 15;
    if (worker.safetyStatus === 'disciplinary_review') {
      reliabilityScore = -50; // Severe penalty for matched but flagged workers
    } else if (worker.safetyStatus === 'suspension_review') {
      reliabilityScore = -20;
    } else {
      if (worker.upheldComplaintsCount === 0) {
        reliabilityScore = 15;
        if (requireEnhancedSupport || worker.rating >= 4.7) {
          highlightReasons.push(`✅ Clean Safety Record (0 upheld complaints)`);
        }
      } else {
        reliabilityScore = Math.max(0, 15 - (worker.upheldComplaintsCount || 0) * 5);
      }
    }

    // Enhanced support requirement boosts safe, verified workers
    if (requireEnhancedSupport) {
      if (worker.safetyStatus === 'active' && worker.verificationStatus === 'verified' && worker.upheldComplaintsCount === 0) {
        reliabilityScore += 20; // Massive boost for enhanced support
      }
    }

    const compositeScore = Math.round(
      proximityScore + skillScore + credibilityScore + ratingScore + availabilityScore + Math.max(0, reliabilityScore)
    );

    results.push({
      worker,
      distanceKm,
      etaMinutes,
      compositeScore: Math.min(100, compositeScore),
      scoreBreakdown: {
        proximityScore: Math.round(proximityScore),
        skillScore: Math.round(skillScore),
        credibilityScore: Math.round(credibilityScore),
        ratingScore: Math.round(ratingScore),
        availabilityScore: Math.round(availabilityScore),
        reliabilityScore: Math.round(Math.max(0, reliabilityScore)),
      },
      highlightReasons: highlightReasons.slice(0, 4),
    });
  }

  // Sort descending by composite score, then proximity
  return results.sort((a, b) => b.compositeScore - a.compositeScore || a.distanceKm - b.distanceKm);
}
