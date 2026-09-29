import React from 'react';
import {
  ShieldCheck,
  Printer,
  X,
  CheckCircle2,
  FileText,
  HeartHandshake,
  DollarSign,
  HeartPulse,
  Award,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { HouseholdBooking, InstitutionalWorkOrder } from '../../types';
import { useApp } from '../../hooks/useApp';
import { calculateWageBreakdown, formatINR } from '../../utils/wageCalculator';

interface InvoiceModalProps {
  booking?: HouseholdBooking;
  workOrder?: InstitutionalWorkOrder;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, workOrder, onClose }) => {
  const { allocationConfig } = useApp();
  const isHousehold = !!booking;
  const invNumber = isHousehold
    ? `INV-${booking?.bookingNumber.replace('CG-BK-', '')}-2026`
    : `INV-${workOrder?.orderNumber}-2026`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const grossAmount = isHousehold ? booking?.finalPrice || 450 : workOrder?.budgetTotal || 740000;

  // Dynamic Fair-Wage Distribution Breakdown using Active Cooperative Policy Rules
  const breakdown = calculateWageBreakdown(grossAmount, allocationConfig, {
    statusOverride: isHousehold && booking?.status === 'completed' ? 'settled_instant_upi' : 'in_escrow',
    settledDate: isHousehold && booking?.status === 'completed' ? 'Disbursed via NPCI UPI / Direct Cooperative Ledger' : 'Held in Cooperative Transparent Escrow (Instant Release on OTP/Signoff)',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Control Bar */}
        <div className="bg-[#062B3A] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-400" />
            <div>
              <h3 className="font-bold text-sm">Official Cooperative Service & Wage Invoice</h3>
              <p className="text-[11px] text-slate-300">
                Transparent Cooperative Fair-Wage & Social Security Allocation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-5 sm:p-7 space-y-5 text-[#1C161A]">
          {/* Header & Logo */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#062B3A] flex items-center justify-center text-white font-black text-sm">
                  CG
                </div>
                <span className="font-black text-xl text-[#062B3A]">AATRAL</span>
              </div>
              <p className="text-xs font-semibold text-slate-700">
                National Federation of Labour & Skilled Service Cooperatives
              </p>
              <p className="text-[11px] text-slate-500">
                Regd. Under Multi-State Cooperative Societies Act • MSCS/CR/2012/842
              </p>
              <p className="text-[11px] text-slate-500">
                Cooperative Bhavan, Lodhi Institutional Area, New Delhi
              </p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {breakdown.workerEarnings.status === 'settled_instant_upi' ? 'WAGE SETTLED DIRECT TO WORKER' : 'COOPERATIVE ESCROW HELD'}
              </div>
              <p className="text-xs font-mono font-bold text-[#062B3A]">{invNumber}</p>
              <p className="text-xs text-slate-500">Date: {dateStr}</p>
              <p className="text-[11px] text-slate-500">Policy: {allocationConfig.policyName}</p>
            </div>
          </div>

          {/* Billed To / Service Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F7F7F2] p-4 rounded-2xl border border-[#062B3A]/10">
            <div>
              <p className="text-[10px] font-bold text-[#5A61AA] uppercase tracking-wider mb-0.5">Billed To (Client)</p>
              <p className="font-bold text-[#1C161A] text-sm">
                {isHousehold ? booking?.customerName : workOrder?.institutionName}
              </p>
              <p className="text-slate-600 mt-0.5">
                {isHousehold ? booking?.customerAddress : workOrder?.projectLocation}
              </p>
              <p className="text-slate-600">
                Phone: {isHousehold ? booking?.customerPhone : workOrder?.contactPhone}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#5A61AA] uppercase tracking-wider mb-0.5">Assigned Primary Labour Cooperative</p>
              <p className="font-bold text-[#1C161A] text-sm">
                {isHousehold ? booking?.societyName : workOrder?.societyName}
              </p>
              <p className="text-slate-600 mt-0.5">
                Member Artisan: {isHousehold ? `${booking?.assignedWorkerName} (ID: ${booking?.assignedWorkerId || 'Verified'})` : `${workOrder?.assignedWorkers.length} Certified Cooperative Members`}
              </p>
              <p className="text-emerald-700 font-medium flex items-center gap-1 mt-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                DigiLocker & NCVT Skill Verification Authenticated
              </p>
            </div>
          </div>

          {/* Service Line Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-[#062B3A]/20 text-[#062B3A] font-bold">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Description of Skilled Cooperative Work</th>
                  <th className="py-2 px-2 text-center">Trade Category</th>
                  <th className="py-2 px-2 text-right">Service Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-2 font-mono">1</td>
                  <td className="py-3 px-2">
                    <p className="font-bold text-slate-800">
                      {isHousehold ? `${booking?.serviceCategoryName} - ${booking?.subService}` : workOrder?.projectTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isHousehold ? booking?.issueDescription : workOrder?.projectDescription}
                    </p>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">
                      {isHousehold ? booking?.serviceCategoryName : workOrder?.serviceCategoryName}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900">
                    {formatINR(grossAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TRANSPARENT FAIR-WAGE BREAKDOWN SECTION */}
          <div className="bg-gradient-to-br from-[#062B3A]/5 via-[#35C6B0]/5 to-emerald-500/5 p-4 sm:p-5 rounded-2xl border border-[#35C6B0]/20 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#35C6B0]" />
                <span className="text-xs font-bold text-[#062B3A]">
                  Democratic Cooperative Revenue Allocation ({allocationConfig.policyName})
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Zero Corporate Platform Profit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {/* Worker Direct Share */}
              <div className="bg-white p-3 rounded-xl shadow-2xs border border-emerald-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase">Worker Direct Wage</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-base font-black text-emerald-700">
                  {formatINR(breakdown.workerEarnings.amount)}
                </div>
                <div className="text-[10px] font-semibold text-emerald-800">
                  Maximized Direct Take-Home
                </div>
                <div className="text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-100 truncate">
                  Ref: {breakdown.workerEarnings.payoutUtr}
                </div>
              </div>

              {/* Coop Ops */}
              <div className="bg-white p-3 rounded-xl shadow-2xs border border-purple-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-900 uppercase">Coop Operations</span>
                  <Shield className="w-3.5 h-3.5 text-[#35C6B0]" />
                </div>
                <div className="text-base font-black text-purple-700">
                  {formatINR(breakdown.cooperativeOps.amount)}
                </div>
                <div className="text-[10px] font-semibold text-purple-800">
                  Sustained Hub & Tool Pool
                </div>
                <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                  Tool library, dispatch
                </div>
              </div>

              {/* Welfare Fund */}
              <div className="bg-white p-3 rounded-xl shadow-2xs border border-pink-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-pink-900 uppercase">Member Welfare</span>
                  <HeartPulse className="w-3.5 h-3.5 text-pink-600" />
                </div>
                <div className="text-base font-black text-pink-700">
                  {formatINR(breakdown.welfareAllocation.amount)}
                </div>
                <div className="text-[10px] font-semibold text-pink-800">
                  Secured Emergency Pool
                </div>
                <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                  Medical & relief grants
                </div>
              </div>

              {/* Insurance & Training */}
              <div className="bg-white p-3 rounded-xl shadow-2xs border border-blue-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-900 uppercase">Insurance & Skill</span>
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-base font-black text-blue-700">
                  {formatINR(breakdown.insuranceAllocation.amount + breakdown.trainingAllocation.amount)}
                </div>
                <div className="text-[10px] font-semibold text-blue-800">
                  Guaranteed Suraksha & NCVT
                </div>
                <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                  ₹5L accident policy fund
                </div>
              </div>
            </div>

            {/* Aggregator Comparison Note */}
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Ethical Cooperative Difference:</strong> Aggregator corporate platforms deduct heavy commissions. Under AATRAL, <strong>the full value remains with workers and their mutual welfare fund</strong>.
                </span>
              </span>
              <span className="text-xs font-bold text-emerald-800 shrink-0 ml-2">
                Maximum Value to Worker
              </span>
            </div>
          </div>

          {/* Warranty & Settlement Status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-amber-900">30-Day Cooperative Workmanship Guarantee & Dispute Ombudsman</p>
                <p className="text-[11px] text-amber-700">
                  Backed by District Cooperative Union & Ministry of Cooperation. Free re-inspection if issue recurs.
                </p>
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <div className="text-[11px] text-slate-400">
              Generated by AATRAL Digital Ledger System • Authenticated via Society Public Key
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 mr-2">Total Service Value:</span>
              <span className="text-xl font-black text-[#062B3A]">{formatINR(grossAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#062B3A] hover:bg-[#05222E] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
