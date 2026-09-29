import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  X,
  AlertTriangle,
  User,
  Smartphone,
  Send,
  ChevronDown,
  ChevronUp,
  Navigation,
  HardHat,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { HouseholdBooking, SosAlert, SosContactNotification } from '../../types';

interface WorkerSosModalProps {
  job: HouseholdBooking;
  workerName: string;
  workerPhone: string;
  onClose: () => void;
}

type SosScreen = 'confirm' | 'sending' | 'success';

const smsColor = 'text-blue-700 bg-blue-50 border-blue-200';
const waColor = 'text-green-700 bg-green-50 border-green-200';

const statusBadge = (status: SosContactNotification['smsStatus']) => {
  switch (status) {
    case 'sending':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
          <Loader2 className="w-2.5 h-2.5 animate-spin" />
          Sending…
        </span>
      );
    case 'sent':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
          <Send className="w-2.5 h-2.5" />
          Sent
        </span>
      );
    case 'delivered':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
          <CheckCircle2 className="w-2.5 h-2.5" />
          Delivered ✓✓
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold">
          ✗ Failed
        </span>
      );
  }
};

const buildWorkerMessage = (alert: SosAlert): string => {
  const time = new Date(alert.timestamp).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  return `🚨 WORKER EMERGENCY ALERT — AATRAL SAFETY

Worker ${alert.customerName} has triggered an SOS at a customer premises.

📍 Location: ${alert.location.address}
🗺️ Live Track: maps.google.com/?q=${alert.location.lat.toFixed(6)},${alert.location.lng.toFixed(6)}

📋 Job: ${alert.bookingNumber} (${alert.serviceCategory})
🏠 Customer: ${alert.workerName} | ${alert.workerPhone}
👷 Worker Phone: ${alert.customerPhone}
🕐 Time: ${time}

If unreachable, contact AATRAL Emergency Helpline: 1800-XXX-XXXX

— Sent automatically by AATRAL Safety System`;
};

export const WorkerSosModal: React.FC<WorkerSosModalProps> = ({
  job,
  workerName,
  workerPhone,
  onClose,
}) => {
  const {
    emergencyContacts,
    triggerWorkerSOS,
    sosAlerts,
    userLocation,
    selectedCity,
  } = useApp();

  const [screen, setScreen] = useState<SosScreen>('confirm');
  const [triggeredAlert, setTriggeredAlert] = useState<SosAlert | null>(null);
  const [expandedMessage, setExpandedMessage] = useState(false);

  const activeContacts = emergencyContacts.filter(c => c.isActive);
  const locationAddress =
    userLocation?.formattedAddress ??
    `${job.location?.area ?? ''}, ${job.location?.city ?? selectedCity}`;
  const lat = userLocation?.lat ?? job.location?.lat ?? 28.56;
  const lng = userLocation?.lng ?? job.location?.lng ?? 77.22;

  const liveAlert = triggeredAlert
    ? sosAlerts.find(a => a.id === triggeredAlert.id) ?? triggeredAlert
    : null;

  const handleActivateSOS = () => {
    setScreen('sending');
    setTimeout(() => {
      const alert = triggerWorkerSOS(job.id, workerName, workerPhone);
      if (alert) {
        setTriggeredAlert(alert);
        setTimeout(() => setScreen('success'), 800);
      } else {
        setScreen('confirm');
      }
    }, 600);
  };

  // Force re-render while statuses are updating
  const [, setTick] = useState(0);
  useEffect(() => {
    if (screen !== 'success') return;
    const interval = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(interval);
  }, [screen]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden" style={{maxWidth: 'min(512px, calc(100vw - 24px))'}}>

        {/* ── Red Header ── */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 px-4 py-4 sm:px-6 sm:py-5 text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center ${screen === 'sending' ? 'animate-pulse' : ''}`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-lg tracking-tight">
                  {screen === 'confirm' && '🚨 Worker SOS'}
                  {screen === 'sending' && 'Activating SOS…'}
                  {screen === 'success' && 'SOS Alert Sent'}
                </h2>
                <p className="text-red-200 text-xs mt-0.5">
                  {screen === 'confirm' && 'Review and activate emergency alert'}
                  {screen === 'sending' && 'Notifying your emergency contacts'}
                  {screen === 'success' && 'Your contacts have been notified'}
                </p>
              </div>
            </div>
            {screen !== 'sending' && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 space-y-4 max-h-[65vh] overflow-y-auto overflow-x-hidden">

          {/* CONFIRM SCREEN */}
          {screen === 'confirm' && (
            <>
              {activeContacts.length === 0 ? (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="font-bold text-sm text-amber-800">No Active Emergency Contacts</p>
                  <p className="text-xs text-amber-700">
                    Go to the <strong>Safety & Contacts</strong> tab and add at least one active contact before using SOS.
                  </p>
                </div>
              ) : (
                <>
                  {/* Worker / Job details */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5" />
                      Active Job
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#062B3A]">{job.serviceCategoryName}</span>
                      <span className="font-mono text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{job.bookingNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Customer: <span className="font-semibold">{job.customerName}</span>
                      <span className="mx-1 text-slate-300">|</span>
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{job.customerPhone ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.customerAddress}</span>
                    </div>
                  </div>

                  {/* GPS Location */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5" />
                      Your Current Location (will be shared)
                    </p>
                    <p className="text-xs text-emerald-800 font-medium">{locationAddress}</p>
                    <p className="text-[10px] text-emerald-600 font-mono">
                      {lat.toFixed(6)}, {lng.toFixed(6)}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-emerald-700 underline font-semibold"
                    >
                      Preview on Google Maps ↗
                    </a>
                  </div>

                  {/* Contacts that will receive alert */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Contacts to be Notified ({activeContacts.length})
                    </p>
                    {activeContacts.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-[#062B3A]">{c.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{c.phone} · {c.relationship}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${smsColor}`}>SMS</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${waColor}`}>WhatsApp</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Warning */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-700">
                      This will immediately send emergency SMS and WhatsApp messages to all active contacts above. Only activate if you are in a genuine emergency.
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* SENDING SCREEN */}
          {screen === 'sending' && (
            <div className="py-10 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-200 flex items-center justify-center animate-pulse">
                <ShieldAlert className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-lg text-[#062B3A]">Triggering Emergency Alert…</p>
                <p className="text-sm text-slate-500 mt-1">
                  Notifying {activeContacts.length} emergency contact{activeContacts.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                <span className="text-sm text-red-600 font-semibold">Please wait…</span>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {screen === 'success' && liveAlert && (
            <>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm text-emerald-800">Emergency Alert Activated</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {new Date(liveAlert.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Per-contact delivery table */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Delivery Status</p>
                {liveAlert.contactsNotified.map(cn => (
                  <div key={cn.contactId} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#062B3A]/10 text-[#062B3A] flex items-center justify-center font-bold text-sm">
                        {cn.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#062B3A]">{cn.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{cn.phone}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] font-bold text-blue-700">SMS</span>
                        </div>
                        {statusBadge(cn.smsStatus)}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-green-600" />
                          <span className="text-[10px] font-bold text-green-700">WhatsApp</span>
                        </div>
                        {statusBadge(cn.whatsappStatus)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Location shared */}
              <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#35C6B0]" />
                  Location Shared
                </p>
                <p className="text-xs text-slate-700 font-medium">{liveAlert.location.address}</p>
                <a
                  href={`https://maps.google.com/?q=${liveAlert.location.lat},${liveAlert.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#35C6B0] underline font-semibold"
                >
                  View Live Location ↗
                </a>
              </div>

              {/* Message preview */}
              <div className="space-y-1">
                <button
                  onClick={() => setExpandedMessage(x => !x)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  {expandedMessage ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {expandedMessage ? 'Hide' : 'Preview'} sent message
                </button>
                {expandedMessage && (
                  <pre className="text-[10px] text-slate-600 bg-[#FAF9F6] border border-slate-200 p-3 rounded-xl overflow-auto leading-relaxed whitespace-pre-wrap font-mono max-h-48">
                    {buildWorkerMessage(liveAlert)}
                  </pre>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-4 pb-5 pt-2 sm:px-6 sm:pb-6 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-3">
          {screen === 'confirm' && (
            <>
              <button
                onClick={onClose}
                className="flex-1 min-w-[100px] py-2.5 sm:py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              {activeContacts.length > 0 && (
                <button
                  onClick={handleActivateSOS}
                  className="flex-1 min-w-[140px] py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 cursor-pointer transition-colors animate-pulse"
                >
                  <ShieldAlert className="w-4 h-4" />
                  🚨 Activate SOS
                </button>
              )}
            </>
          )}
          {screen === 'success' && (
            <button
              onClick={onClose}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-[#062B3A] hover:bg-[#35C6B0] text-white text-sm font-bold cursor-pointer transition-colors"
            >
              Close — Stay Safe
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
