import { InstitutionalWorkOrder, Worker } from '../types';

export interface AIRecommendation {
  workerId: string;
  reason: string;
  matchScore: number;
}

export interface AIRecommendationResult {
  recommendations: AIRecommendation[];
  recommendedWorkerIds: string[];
  shortageSummary: string | null;
}

/**
 * Simulates a call to the Gemini AI API to recommend a workforce for an institutional work order.
 * In a production environment, this would format the order and workers into a prompt and call Gemini.
 */
export const generateAIWorkforceRecommendations = async (
  order: InstitutionalWorkOrder,
  availableWorkers: Worker[]
): Promise<AIRecommendationResult> => {
  // Simulate network latency for AI processing (1.5 - 2.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Determine needed skills based on the project title and mock data patterns
  const neededKeywords = order.projectTitle.toLowerCase();
  let requiredSkillCategory = '';
  
  if (neededKeywords.includes('electric') || neededKeywords.includes('substation') || neededKeywords.includes('wire')) {
    requiredSkillCategory = 'electric';
  } else if (neededKeywords.includes('plumb') || neededKeywords.includes('sanitary') || neededKeywords.includes('pipe')) {
    requiredSkillCategory = 'plumb';
  } else if (neededKeywords.includes('wood') || neededKeywords.includes('carpent') || neededKeywords.includes('panel')) {
    requiredSkillCategory = 'carpent';
  } else if (neededKeywords.includes('clean') || neededKeywords.includes('sanitiz')) {
    requiredSkillCategory = 'clean';
  }

  // Filter workers based on required skill (loose text matching for mock)
  let matchedWorkers = availableWorkers.filter((w) => {
    if (!requiredSkillCategory) return true;
    return w.skills.some((s) => s.toLowerCase().includes(requiredSkillCategory)) || 
           w.tradeCategory.toLowerCase().includes(requiredSkillCategory);
  });

  // Sort by rating (simulating AI picking the best performers first)
  matchedWorkers.sort((a, b) => b.rating - a.rating);

  // Take up to required count
  const requiredCount = order.requiredWorkersCount - order.assignedWorkers.length;
  if (requiredCount <= 0) {
    return { recommendations: [], recommendedWorkerIds: [], shortageSummary: null };
  }

  const selectedWorkers = matchedWorkers.slice(0, requiredCount);
  const recommendations: AIRecommendation[] = selectedWorkers.map((w, index) => {
    // Generate realistic AI reasons based on the worker's stats
    const reasons = [
      `High verification level (${w.verificationStatus}) and excellent ${w.rating} rating.`,
      `Proximity match: Registered in similar district with required NCVT certification.`,
      `Optimal workload balance: Currently available for immediate assignment.`,
      `Strong historical performance on similar institutional projects.`,
    ];
    return {
      workerId: w.id,
      reason: reasons[index % reasons.length],
      matchScore: Math.floor(92 + Math.random() * 7), // 92 - 98
    };
  });

  const recommendedWorkerIds = recommendations.map((r) => r.workerId);
  
  let shortageSummary = null;
  if (selectedWorkers.length < requiredCount) {
    shortageSummary = `AI Alert: Found ${selectedWorkers.length} qualified specialists. Shortage of ${requiredCount - selectedWorkers.length} workers with required certifications in this region.`;
  } else {
    shortageSummary = `AI successfully identified ${selectedWorkers.length} optimal candidates based on skill, location, and rating.`;
  }

  return {
    recommendations,
    recommendedWorkerIds,
    shortageSummary,
  };
};
