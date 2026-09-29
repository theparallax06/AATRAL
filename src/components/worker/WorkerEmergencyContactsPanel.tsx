import React, { useState } from 'react';
import {
  UserPlus,
  ShieldAlert,
  Phone,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  X,
  Users,
  Info,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { EmergencyContact } from '../../types';

const RELATIONSHIPS = [
  'Spouse',
  'Parent',
  'Sibling',
  'Child',
  'Friend',
  'Neighbour',
  'Other',
];

interface ContactFormState {
  name: string;
  phone: string;
  relationship: string;
  isActive: boolean;
}

const emptyForm = (): ContactFormState => ({
  name: '',
  phone: '',
  relationship: 'Spouse',
  isActive: true,
});

export const WorkerEmergencyContactsPanel: React.FC = () => {
  const {
    emergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactFormState>(emptyForm());
  const [formError, setFormError] = useState('');

  const isEditing = editingId !== null;
  const canAdd = emergencyContacts.length < 3;

  const openAdd = () => {
    setForm(emptyForm());
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (contact: EmergencyContact) => {
    setForm({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isActive: contact.isActive,
    });
    setEditingId(contact.id);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setFormError('');
  };

  const validate = (): boolean => {
    if (!form.name.trim()) { setFormError('Name is required.'); return false; }
    if (!form.phone.trim()) { setFormError('Phone number is required.'); return false; }
    const stripped = form.phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(stripped)) {
      setFormError('Enter a valid 10-digit Indian mobile number.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (isEditing) {
      const original = emergencyContacts.find(c => c.id === editingId)!;
      updateEmergencyContact({ ...original, ...form });
    } else {
      addEmergencyContact(form);
    }
    closeForm();
  };

  const handleToggleActive = (contact: EmergencyContact) => {
    updateEmergencyContact({ ...contact, isActive: !contact.isActive });
  };

  const handleRemove = (id: string) => {
    removeEmergencyContact(id);
    if (editingId === id) closeForm();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#062B3A]">Emergency Contacts</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {emergencyContacts.length} of 3 saved — auto-used when SOS is triggered during a job
            </p>
          </div>
        </div>
        {canAdd && (
          <button
            onClick={openAdd}
            className="px-3.5 py-2 rounded-xl bg-[#062B3A] hover:bg-[#35C6B0] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Contact
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800 leading-relaxed">
          While you are on an active job, pressing the <strong>🚨 SOS</strong> button will instantly send your name, job details, and live GPS location to all <strong>active</strong> contacts via SMS and WhatsApp — no additional input needed.
        </p>
      </div>

      {/* Empty state */}
      {emergencyContacts.length === 0 && !showForm && (
        <div className="p-10 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-[#FAF9F6]">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-600">No emergency contacts yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Add up to 3 trusted people who will be alerted on SOS.</p>
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-xl bg-[#062B3A] text-white text-xs font-bold hover:bg-[#35C6B0] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add First Contact
          </button>
        </div>
      )}

      {/* Contact Cards */}
      <div className="space-y-3">
        {emergencyContacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 rounded-2xl border transition-all ${
              contact.isActive
                ? 'bg-white border-emerald-200 shadow-xs'
                : 'bg-[#FAF9F6] border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${
                  contact.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#062B3A] truncate">{contact.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F7F2] text-slate-600 border border-slate-200 shrink-0">
                      {contact.relationship}
                    </span>
                    {contact.isActive ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold shrink-0">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500 font-mono">{contact.phone}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  title={contact.isActive ? 'Deactivate' : 'Activate'}
                  onClick={() => handleToggleActive(contact)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-[#35C6B0] transition-colors cursor-pointer"
                >
                  {contact.isActive
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <XCircle className="w-4 h-4" />}
                </button>
                <button
                  title="Edit"
                  onClick={() => openEdit(contact)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-[#062B3A] transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Remove"
                  onClick={() => handleRemove(contact.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="p-5 rounded-3xl border-2 border-[#35C6B0]/40 bg-[#FAF9F6] space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-[#062B3A]">
              {isEditing ? 'Edit Contact' : 'New Emergency Contact'}
            </h4>
            <button
              onClick={closeForm}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Priya Kumar"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#1C161A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#35C6B0] focus:border-transparent transition"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Mobile Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#1C161A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#35C6B0] focus:border-transparent transition"
              />
            </div>

            {/* Relationship */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Relationship *</label>
              <select
                value={form.relationship}
                onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#1C161A] focus:outline-none focus:ring-2 focus:ring-[#35C6B0] focus:border-transparent transition"
              >
                {RELATIONSHIPS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Active Toggle */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Status</label>
              <div className="flex items-center gap-3 h-[42px]">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    form.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    form.isActive ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
                <span className={`text-xs font-semibold ${form.isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {form.isActive ? 'Active — will receive SOS' : 'Inactive — will NOT receive SOS'}
                </span>
              </div>
            </div>
          </div>

          {formError && (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              {formError}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#35C6B0] hover:bg-[#2EAD9A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {isEditing ? 'Save Changes' : 'Add Contact'}
            </button>
            <button
              onClick={closeForm}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Limit notice */}
      {!canAdd && !showForm && (
        <div className="text-center p-3 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-700 font-semibold">
            ✓ Maximum 3 contacts reached. Remove one to add a new contact.
          </p>
        </div>
      )}
    </div>
  );
};
