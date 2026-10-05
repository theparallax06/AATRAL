import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Award,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export const ApprenticeView: React.FC = () => {
  const { currentUser, apprenticeships } = useApp();

  // Find the active apprenticeship for the current user
  const myApprenticeship = apprenticeships.find(a => 
    currentUser && (a.apprenticeId === currentUser.id || a.id === currentUser.id)
  ) || apprenticeships.find(a => a.apprenticeId === 'usr-app-1');

  if (!myApprenticeship) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#062B3A]">No Active Apprenticeship Found</h2>
          <p className="text-slate-600 mt-2">You have not been assigned to a mentor yet. Please contact the cooperative federation.</p>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round((myApprenticeship.trainingHours / 120) * 100));
  const jobsPercent = Math.min(100, Math.round((myApprenticeship.assistedJobs.length / 15) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-20">
      
      {/* Header Profile Section */}
      <div className="bg-[#062B3A] text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#35C6B0] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=300&q=80'} 
            alt="Apprentice" 
            className="w-24 h-24 rounded-full border-4 border-white/10 shadow-lg object-cover"
          />
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" /> Trainee Member
            </div>
            <h1 className="text-2xl sm:text-4xl font-black mb-1">{myApprenticeship.apprenticeName}</h1>
            <p className="text-[#35C6B0] font-semibold flex items-center justify-center sm:justify-start gap-2">
              Assigned Mentor: {myApprenticeship.mentorName}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[200px] text-center">
            <span className="text-xs font-bold text-slate-300 uppercase block mb-1">Status</span>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold ${
              myApprenticeship.status === 'active' ? 'bg-[#35C6B0]/20 text-[#35C6B0]' :
              myApprenticeship.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-amber-500/20 text-amber-300'
            }`}>
              {myApprenticeship.status === 'active' && <Clock className="w-4 h-4" />}
              {myApprenticeship.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
              {myApprenticeship.status.charAt(0).toUpperCase() + myApprenticeship.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress & Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Training Progress Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-black text-[#062B3A] flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#35C6B0]" />
              Training Progress
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-3xl font-black text-[#062B3A]">{myApprenticeship.trainingHours}</span>
                  <span className="text-slate-500 font-semibold ml-1">/ 120 Hours</span>
                </div>
                <span className="text-sm font-bold text-[#35C6B0]">{progressPercent}% Completed</span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-4">
                <div 
                  className="bg-[#35C6B0] h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                </div>
              </div>

              <div className="flex justify-between items-end mt-4">
                <div>
                  <span className="text-2xl font-black text-[#062B3A]">{myApprenticeship.assistedJobs.length}</span>
                  <span className="text-slate-500 font-semibold ml-1">/ 15 Jobs</span>
                </div>
                <span className="text-sm font-bold text-[#35C6B0]">{jobsPercent}% Completed</span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-indigo-400 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${jobsPercent}%` }}
                >
                </div>
              </div>
              
              <p className="text-xs text-slate-500 text-center mt-2">
                Complete 120 hours and 15 jobs of supervised on-the-job training to be eligible for Verified Member status.
              </p>
            </div>
          </div>

          {/* Assisted Jobs Log */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-black text-[#062B3A] flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#35C6B0]" />
              Supervised Jobs Log
            </h2>
            
            {myApprenticeship.assistedJobs.length === 0 ? (
              <div className="text-center py-8 bg-[#F7F7F2] rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-semibold text-sm">No jobs logged yet.</p>
                <p className="text-xs text-slate-400 mt-1">Your mentor will log your hours when you assist them.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myApprenticeship.assistedJobs.map((jobId, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#F7F7F2] rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#35C6B0]/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-[#35C6B0]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#062B3A] text-sm">Job ID: {jobId}</p>
                        <p className="text-xs text-slate-500 font-medium">Assisted {myApprenticeship.mentorName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#35C6B0] text-sm">+2 Hours</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Stipend & Evaluation */}
        <div className="space-y-8">
          
          {/* Stipend Card */}
          <div className="bg-[#062B3A] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#35C6B0] opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Training Stipend Earned</h2>
            <div className="text-4xl font-black text-white mb-2">
              ₹{myApprenticeship.stipendEarned.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400">
              Paid by the cooperative fund. Customer payments go directly to the verified professional.
            </p>
          </div>

          {/* Mentor Evaluation */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-black text-[#062B3A] flex items-center gap-2 mb-4">
              <FileCheck className="w-5 h-5 text-[#35C6B0]" />
              Mentor Evaluation
            </h2>
            
            {myApprenticeship.evaluation ? (
              <div className="bg-[#F7F7F2] p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < myApprenticeship.evaluation!.rating ? 'text-amber-500' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic mb-2">"{myApprenticeship.evaluation.comments}"</p>
                <p className="text-xs font-bold text-[#062B3A] text-right">- {myApprenticeship.mentorName}</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-600">No evaluation yet.</p>
                <p className="text-xs text-slate-500 mt-1">Your mentor will evaluate you once you complete 120 hours and 15 jobs.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
