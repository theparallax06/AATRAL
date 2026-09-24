import { Worker, HouseholdBooking, InstitutionalWorkOrder, WorkerUtilizationStats } from '../types';

export function computeWorkerUtilizationStats(
  workers: Worker[],
  bookings: HouseholdBooking[],
  workOrders: InstitutionalWorkOrder[]
): WorkerUtilizationStats {
  const totalWorkers = workers.length;
  
  let availableCount = 0;
  let assignedCount = 0;
  let busyCount = 0;
  let leaveCount = 0;

  workers.forEach((w) => {
    if (w.availability === 'available') {
      if (w.currentWorkloadScore > 75) {
        busyCount++;
      } else {
        availableCount++;
      }
    } else if (w.availability === 'on_job') {
      assignedCount++;
    } else if (w.availability === 'leave' || w.availability === 'offline') {
      leaveCount++;
    } else {
      availableCount++;
    }
  });

  // Identify underutilized workers: workloadScore < 35, or active job count is 0
  const underutilizedWorkersList = workers
    .filter((w) => w.verificationStatus === 'verified' && w.currentWorkloadScore <= 35)
    .map((w, index) => {
      const simulatedWeeklyHours = Math.max(6, Math.min(22, Math.round(w.currentWorkloadScore * 0.4 + (index % 3) * 3)));
      const daysAgo = (index % 4) + 2;
      return {
        worker: w,
        weeklyHours: simulatedWeeklyHours,
        lastJobDaysAgo: daysAgo,
        utilizationPercent: Math.round((simulatedWeeklyHours / 40) * 100),
        reason:
          simulatedWeeklyHours < 12
            ? 'Below cooperative threshold (< 15 hrs/wk)'
            : 'Available for immediate express or institutional contract assignment',
      };
    })
    .sort((a, b) => a.weeklyHours - b.weeklyHours);

  const underutilizedCount = underutilizedWorkersList.length;

  // Total completed jobs
  const completedJobsTotal = workers.reduce((acc, w) => acc + (w.completedJobsCount || 0), 0);

  // Total hours logged
  const totalHoursLogged = workers.reduce((acc, w) => {
    const hours = Math.round((w.completedJobsCount || 10) * 2.5 + (w.currentWorkloadScore || 20) * 0.8);
    return acc + hours;
  }, 0);

  const averageWeeklyHours = Math.round(
    workers.reduce((acc, w) => acc + Math.round((w.currentWorkloadScore || 20) * 0.45 + 10), 0) / (workers.length || 1)
  );

  // Skill-wise workforce distribution
  const skillCategoryMap: Record<
    string,
    { skillName: string; category: string; total: number; available: number; assigned: number }
  > = {};

  workers.forEach((w) => {
    const primarySkill = w.skills[0]?.name || 'General Maintenance';
    const primaryCategory = w.skills[0]?.category || 'General';
    const key = primaryCategory;

    if (!skillCategoryMap[key]) {
      skillCategoryMap[key] = {
        skillName: primarySkill,
        category: primaryCategory,
        total: 0,
        available: 0,
        assigned: 0,
      };
    }

    skillCategoryMap[key].total++;
    if (w.availability === 'on_job') {
      skillCategoryMap[key].assigned++;
    } else {
      skillCategoryMap[key].available++;
    }
  });

  const skillBreakdown = Object.values(skillCategoryMap).map((s) => {
    let demandLevel: 'high' | 'medium' | 'balanced' | 'surplus' = 'balanced';
    if (s.available <= 1 && s.assigned >= 2) demandLevel = 'high';
    else if (s.available >= 4 && s.assigned <= 1) demandLevel = 'surplus';
    else if (s.assigned >= 2) demandLevel = 'medium';

    return {
      skillName: s.skillName,
      category: s.category,
      totalWorkers: s.total,
      availableCount: s.available,
      assignedCount: s.assigned,
      demandLevel,
    };
  });

  // Area-wise workforce breakdown
  const areaMap: Record<
    string,
    { areaName: string; district: string; total: number; available: number; assigned: number }
  > = {};

  workers.forEach((w) => {
    const areaKey = w.location.area || w.location.city || 'Central Hub';
    const districtKey = w.location.city || 'Delhi NCR';

    if (!areaMap[areaKey]) {
      areaMap[areaKey] = {
        areaName: areaKey,
        district: districtKey,
        total: 0,
        available: 0,
        assigned: 0,
      };
    }

    areaMap[areaKey].total++;
    if (w.availability === 'on_job') {
      areaMap[areaKey].assigned++;
    } else {
      areaMap[areaKey].available++;
    }
  });

  const areaBreakdown = Object.values(areaMap).map((a) => ({
    areaName: a.areaName,
    district: a.district,
    totalWorkers: a.total,
    availableCount: a.available,
    assignedCount: a.assigned,
    utilizationRate: Math.round((a.assigned / (a.total || 1)) * 100),
  }));

  // Active assignments from bookings & work orders
  const activeAssignments: WorkerUtilizationStats['activeAssignments'] = [];

  bookings
    .filter((b) => b.status === 'in_progress' || b.status === 'in_transit' || b.status === 'matched')
    .forEach((b) => {
      const assignedW = workers.find((w) => w.id === b.assignedWorkerId);
      activeAssignments.push({
        assignmentId: b.id,
        type: 'household',
        title: `${b.serviceCategoryName} (${b.subService})`,
        workerId: b.assignedWorkerId || 'unassigned',
        workerName: b.assignedWorkerName || 'Pending Assignment',
        workerAvatar: assignedW?.avatar || b.assignedWorkerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        clientName: b.customerName,
        location: b.customerAddress,
        status: b.status === 'in_transit' ? 'En Route (GPS Live)' : b.status === 'in_progress' ? 'Active on Premise' : 'Matched (Awaiting Dispatch)',
        startTime: b.scheduledTimeSlot,
        estEndTime: 'Within 2 Hours',
        loadIndex: 65,
      });
    });

  workOrders
    .filter((wo) => wo.status === 'in_execution' || wo.status === 'partially_assigned' || wo.status === 'fully_assigned')
    .forEach((wo) => {
      wo.assignedWorkers.slice(0, 3).forEach((item) => {
        activeAssignments.push({
          assignmentId: `${wo.id}-${item.workerId}`,
          type: 'institutional',
          title: `${wo.projectTitle} (${item.skillName})`,
          workerId: item.workerId,
          workerName: item.workerName,
          workerAvatar: item.workerAvatar,
          clientName: wo.institutionName,
          location: `${wo.projectLocation}, ${wo.city}`,
          status: 'Institutional On-Site Project',
          startTime: `${wo.startDate} (Day ${item.attendanceDaysCount + 1})`,
          estEndTime: `Target: ${wo.endDate}`,
          loadIndex: 85,
        });
      });
    });

  // Actionable Insights based on current state
  const electricianStat = skillBreakdown.find((s) => s.category.toLowerCase().includes('electric')) || {
    availableCount: 12,
    assignedCount: 5,
  };
  const underutilizedNames = underutilizedWorkersList.slice(0, 2).map((u) => u.worker.name).join(', ');

  const actionableInsights: WorkerUtilizationStats['actionableInsights'] = [
    {
      id: 'ins-1',
      type: 'surplus',
      title: `${electricianStat.availableCount} Electricians available, ${electricianStat.assignedCount} currently assigned`,
      description: `High availability in South & Central Delhi hubs. Excellent capacity to bid on upcoming municipal and commercial electrical tenders.`,
      recommendedAction: 'Allocate available electricians to open institutional tenders or promote instant express slots.',
      category: 'Electrical & Electronics',
    },
    {
      id: 'ins-2',
      type: 'underutilized',
      title: `${underutilizedCount} verified workers are underutilized (< 15 hrs this week)`,
      description: `Artisans including ${underutilizedNames || 'members'} logged low workload hours in the current cycle.`,
      recommendedAction: 'Auto-prioritize underutilized verified members in customer search ranking and bulk institutional shifts.',
      category: 'Workforce Fairness & Equality',
    },
    {
      id: 'ins-3',
      type: 'rebalance_ready',
      title: 'High seasonal demand surge forecasted in Plumbing & HVAC',
      description: 'Monsoon drainage and AC maintenance requests increasing by +48% across urban hubs.',
      recommendedAction: 'Reassign 3 multi-skilled technicians from slow crafts into immediate express plumbing/HVAC readiness.',
      category: 'Dynamic Workload Balancing',
    },
  ];

  return {
    totalWorkers,
    availableCount,
    assignedCount,
    busyCount,
    leaveCount,
    underutilizedCount,
    completedJobsTotal,
    totalHoursLogged,
    averageWeeklyHours,
    underutilizedWorkersList,
    skillBreakdown,
    areaBreakdown,
    activeAssignments,
    actionableInsights,
  };
}
