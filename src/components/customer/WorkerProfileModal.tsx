import React from 'react';
import {
  ShieldCheck,
  X,
  Star,
  Award,
  Calendar,
  Phone,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  FileCheck,
  HardHat,
  Clock,
  Briefcase,
  Zap,
} from 'lucide-react';
import { Worker } from '../../types';

interface WorkerProfileModalProps {
  worker: Worker;
  onClose: () => void;
  onBookWorker: (worker: Worker) => void;
}

import { useApp } from '../../hooks/useApp';

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({

  worker,
  onClose,
  onBookWorker,
}) => {
  const { t } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header Profile Cover */}
        <div className="bg-gradient-to-r from-[#062B3A] to-[#35C6B0] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">
                VERIFIED
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black">{worker.name}</h3>
                <span className="bg-yellow-400 text-[#062B3A] text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Award className="w-3 h-3" />
                  {worker.badge}
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium">{worker.societyName}</p>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <span className="flex items-center gap-1 font-bold text-yellow-300">
                  <Star className="w-3.5 h-3.5 fill-yellow-300" />
                  {worker.rating} ({worker.reviewCount} {t('worker_profile_customer_ratings', 'customer ratings')})
                </span>
                <span>•</span>
                <span>{worker.completedJobsCount}+ Jobs Completed</span>
                <span>•</span>
                <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[11px]">
                  {t('worker_profile_member_id', 'Member ID:')} {worker.memberId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-[#1C161A]">
          {/* Cooperative Verification Seal Banner */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">{t('worker_profile_coop_seal_title', 'Cooperative Society Verified Trade Member')}</p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                {t('worker_profile_coop_seal_desc', 'Skills, background, police clearance, and vocational diplomas are officially certified by')}{' '}
                <span className="font-bold">{worker.societyName}</span> {t('worker_profile_coop_seal_desc2', 'under National Skill Qualification Framework (NSQF).')}
              </p>
            </div>
          </div>

          {/* Verified Skills & Certifications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A61AA] mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#35C6B0]" />
              Verified Trade Certifications & Credentials
            </h4>
            <div className="space-y-2.5">
              {worker.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3.5 rounded-2xl bg-[#F7F7F2] border border-slate-200 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-slate-900">{skill.name}</p>
                      <span className="text-[10px] font-semibold bg-purple-100 text-[#35C6B0] px-2 py-0.5 rounded-md">
                        {skill.skillLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 font-medium">{skill.certName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                      <span>{t('worker_profile_issued_by', 'Issued by:')} {skill.certIssuer}</span>
                      <span>•</span>
                      <span className="font-mono">{t('worker_profile_cert_no', 'Cert No:')} {skill.certNumber}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      Govt. Verified
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">{skill.experienceYears} {t('worker_profile_years_exp', 'Years Exp')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Worker Welfare & Insurance Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-[#5A61AA] uppercase tracking-wider mb-1">
                Insurance Shield
              </p>
              <p className="font-bold text-slate-900">{t('worker_profile_accident_policy', '₹5,00,000 Group Accident Policy')}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{worker.insurance.schemeName}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                {t('worker_profile_active_policy', 'Active Policy')} ({worker.insurance.policyNumber})
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-[#5A61AA] uppercase tracking-wider mb-1">
                Rate & Availability
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-[#062B3A]">₹{worker.hourlyRate}{t('worker_profile_hr', '/hr')}</span>
                <span className="text-xs text-slate-500 font-medium">(₹{worker.dailyRate}{t('worker_profile_day_rate', '/day rate')})</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`w-2 h-2 rounded-full ${worker.availability === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="text-[11px] font-medium capitalize text-slate-700">
                  {t('worker_profile_current_status', 'Current Status:')} {worker.availability.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                onBookWorker(worker);
              }}
              className="flex-2 py-3 bg-[#35C6B0] hover:bg-[#2EAD9A] text-white rounded-xl text-xs font-bold shadow-md shadow-[#35C6B0]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>{t('worker_profile_book_direct', 'Book This Verified Worker (Direct Dispatch)')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
