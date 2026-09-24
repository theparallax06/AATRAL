import React, { useState } from 'react';
import {
  AlertCircle,
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { HouseholdBooking } from '../../types';

interface GrievanceModalProps {
  booking?: HouseholdBooking;
  onClose: () => void;
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({ booking, onClose }) => {
  const { currentUser, currentRole, raiseComplaint, showToast } = useApp();
  const [title, setTitle] = useState(booking ? `Issue with Booking ${booking.bookingNumber}` : '');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'service_quality' | 'delayed_arrival' | 'overcharging' | 'safety_compliance'>('service_quality');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    raiseComplaint({
      targetType: booking ? 'booking' : 'general',
      targetId: booking?.id || 'general',
      targetName: booking?.bookingNumber ? `Booking #${booking.bookingNumber}` : 'General Inquiry',
      raisedById: currentUser.id,
      raisedByName: currentUser.name,
      raisedByPhone: currentUser.phone,
      raisedByRole: currentRole,
      subject: `[${category.toUpperCase().replace('_', ' ')}] ${title}`,
      description,
      priority: 'high',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#062B3A]">Cooperative Ombudsman Grievance Cell</h3>
              <p className="text-[11px] text-slate-500">Impartial dispute resolution under Cooperative Bylaws</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Note */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            Complaints are assigned directly to the District Labour Federation Ombudsman. Re-inspection is provided free under the 30-Day Cooperative Guarantee.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-800">
          <div>
            <label className="block font-bold mb-1">Grievance Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
            >
              <option value="service_quality">Workmanship / Service Quality Issue</option>
              <option value="delayed_arrival">Punctuality / Delayed Arrival</option>
              <option value="overcharging">Pricing / Extra Spare Discrepancy</option>
              <option value="safety_compliance">Safety Kit / Protocol Non-compliance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">Subject / Summary</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bathroom fitting loose after pipe joint repair"
              className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Detailed Explanation & Observation</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the issue clearly. The Society Coordinator will contact both parties within 2 working hours."
              className="w-full px-3 py-2 bg-[#F7F7F2] border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
