import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Phone,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Bike,
  Flame,
  Radio,
  FileText,
  KeyRound,
} from 'lucide-react';
import { HouseholdBooking, Worker } from '../../types';
import { useApp } from '../../hooks/useApp';
import { calculateDistanceKm, calculateETAminutes, generateRoutePoints } from '../../utils/geoUtils';

interface LiveWorkerTrackerProps {
  booking: HouseholdBooking;
  worker?: Worker;
  onOpenChat?: () => void;
  onOpenInvoice?: () => void;
  onOpenGrievance?: () => void;
}

export const LiveWorkerTracker: React.FC<LiveWorkerTrackerProps> = ({
  booking,
  worker,
  onOpenChat,
  onOpenInvoice,
  onOpenGrievance,
}) => {
  const { updateBookingStatus, rateBooking, showToast, t } = useApp();

  // Route & simulation coordinates
  const customerCoord = {
    lat: booking.location?.lat || 28.5355,
    lng: booking.location?.lng || 77.2505,
  };

  // Start worker slightly away (e.g. ~3.2 km away)
  const workerBaseCoord = {
    lat: customerCoord.lat + 0.024,
    lng: customerCoord.lng - 0.022,
  };

  const [routePoints, setRoutePoints] = useState(() =>
    generateRoutePoints(workerBaseCoord, customerCoord, 30)
  );

  // Simulation State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 4>(1);
  const [lastUpdatedSecondsAgo, setLastUpdatedSecondsAgo] = useState<number>(0);

  // Telemetry attributes
  const currentWorkerPos = routePoints[currentStepIndex] || workerBaseCoord;
  const progressRatio = currentStepIndex / (routePoints.length - 1);
  const rawDist = calculateDistanceKm(
    currentWorkerPos.lat,
    currentWorkerPos.lng,
    customerCoord.lat,
    customerCoord.lng
  );
  const currentDistanceKm = Math.max(0, Math.round(rawDist * 10) / 10);
  const currentETA = calculateETAminutes(currentDistanceKm);

  // Live status computation based on movement
  const isNearby = currentDistanceKm <= 0.4 && currentDistanceKm > 0.05;
  const isArrived = currentDistanceKm <= 0.05 || currentStepIndex >= routePoints.length - 1;

  // Auto-play simulation interval
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && booking.status !== 'completed' && booking.status !== 'cancelled') {
      const intervalMs = 1200 / simSpeed;
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < routePoints.length - 1) {
            const next = prev + 1;
            setLastUpdatedSecondsAgo(0);

            // Auto status transitions during movement
            if (next === 1 && booking.status === 'matched') {
              updateBookingStatus(booking.id, 'in_transit');
            } else if (next === Math.floor(routePoints.length * 0.85) && !isNearby) {
              showToast(t('live_worker_toast_400m', '⚡ Worker is within 400m of your premises!'), 'info');
            } else if (next === routePoints.length - 1) {
              showToast(t('live_worker_toast_arrived', '🎯 Worker has arrived at your address!'), 'success');
            }
            return next;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, simSpeed, routePoints.length, booking.status]);

  // Last telemetry update ticker
  useEffect(() => {
    const ticker = setInterval(() => {
      setLastUpdatedSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Map projection helpers for SVG (600 x 360)
  const minLat = Math.min(workerBaseCoord.lat, customerCoord.lat) - 0.008;
  const maxLat = Math.max(workerBaseCoord.lat, customerCoord.lat) + 0.008;
  const minLng = Math.min(workerBaseCoord.lng, customerCoord.lng) - 0.008;
  const maxLng = Math.max(workerBaseCoord.lng, customerCoord.lng) + 0.008;

  const projectToMap = (lat: number, lng: number) => {
    const x = 50 + ((lng - minLng) / (maxLng - minLng || 0.01)) * 500;
    const y = 310 - ((lat - minLat) / (maxLat - minLat || 0.01)) * 250;
    return {
      x: Math.max(40, Math.min(560, x)),
      y: Math.max(40, Math.min(320, y)),
    };
  };

  const customerProjected = projectToMap(customerCoord.lat, customerCoord.lng);
  const workerProjected = projectToMap(currentWorkerPos.lat, currentWorkerPos.lng);

  // SVG Polyline Path
  const svgPathD = routePoints.reduce((acc, pt, idx) => {
    const { x, y } = projectToMap(pt.lat, pt.lng);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Traveled path
  const traveledPathD = routePoints.slice(0, currentStepIndex + 1).reduce((acc, pt, idx) => {
    const { x, y } = projectToMap(pt.lat, pt.lng);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const getStatusBadge = () => {
    if (booking.status === 'completed') {
      return { label: t('live_worker_status_completed', 'Service Completed'), color: 'bg-emerald-500 text-white' };
    }
    if (booking.status === 'in_progress') {
      return { label: t('live_worker_status_in_progress', 'Service In Progress (OTP Verified)'), color: 'bg-blue-600 text-white' };
    }
    if (isArrived) {
      return { label: t('live_worker_status_arrived', 'Worker Arrived at Premises'), color: 'bg-emerald-600 text-white animate-pulse' };
    }
    if (isNearby) {
      return { label: t('live_worker_status_nearby', 'Worker is Nearby (< 500m)'), color: 'bg-amber-500 text-white animate-pulse' };
    }
    if (booking.status === 'in_transit' || currentStepIndex > 0) {
      return { label: t('live_worker_status_in_transit', 'Worker On The Way'), color: 'bg-[#35C6B0] text-white' };
    }
    return { label: t('live_worker_status_assigned', 'Technician Assigned'), color: 'bg-slate-700 text-white' };
  };

  const currentStatusBadge = getStatusBadge();

  return (
    <div className="space-y-4">
      {/* Live Map Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 bg-[#041D27] rounded-3xl overflow-hidden shadow-2xl border border-[#062B3A]/40 flex flex-col">
        {/* Top Floating Telemetry Status Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 bg-[#062B3A]/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15 text-white text-xs shadow-lg pointer-events-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold">{currentStatusBadge.label}</span>
            <span className="text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-full font-mono">
              {lastUpdatedSecondsAgo}s ago
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#062B3A]/95 backdrop-blur-md p-1 rounded-2xl border border-white/15 text-white text-xs shadow-lg pointer-events-auto">
            <span className="text-[11px] px-2 text-slate-300 font-medium">
              ⚡ {t('live_worker_simulated_badge', 'Simulated Live Telemetry')}
            </span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-xl transition-all ${
                isPlaying ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
              }`}
              title={isPlaying ? 'Pause Simulation' : 'Play Live Route'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                setSimSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
              }}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-bold font-mono"
              title="Simulation Speed Multiplier"
            >
              {simSpeed}x
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(true);
                showToast(t('live_worker_sim_reset', 'Simulation reset to origin'), 'info');
              }}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-slate-200"
              title="Reset to Origin"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SVG Route Map */}
        <div className="flex-1 w-full h-full relative">
          <svg className="w-full h-full" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid-live-track" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(108, 79, 232, 0.12)" strokeWidth="0.8" />
              </pattern>

              <linearGradient id="live-route-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#35C6B0" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>

              {/* Worker Pulse */}
              <radialGradient id="worker-pulse-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(224, 169, 34, 0.4)" />
                <stop offset="100%" stopColor="rgba(224, 169, 34, 0)" />
              </radialGradient>
            </defs>

            {/* Dark background & grid */}
            <rect width="600" height="360" fill="#03161D" />
            <rect width="600" height="360" fill="url(#grid-live-track)" />

            {/* Background Simulated Road Arteries */}
            <path d="M 0 100 Q 300 80 600 120" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
            <path d="M 0 240 Q 280 260 600 220" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
            <path d="M 180 0 Q 200 180 220 360" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
            <path d="M 420 0 Q 400 180 390 360" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />

            {/* Full Proposed Route Path (Dashed) */}
            <path
              d={svgPathD}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="4"
              strokeDasharray="6 6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Traveled Route Segment (Solid Emerald Glow) */}
            <path
              d={traveledPathD}
              stroke="url(#live-route-grad)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />

            {/* 1. Customer Destination Marker (End Point) */}
            <g transform={`translate(${customerProjected.x}, ${customerProjected.y})`}>
              {/* Radius pulse */}
              <circle cx="0" cy="0" r="24" fill="rgba(16, 185, 129, 0.15)" className="animate-ping" />
              <circle cx="0" cy="0" r="14" fill="#10B981" />
              {/* Destination Icon */}
              <circle cx="0" cy="0" r="6" fill="#FFFFFF" />

              {/* Pin Label Banner */}
              <rect x="-60" y="-34" width="120" height="20" rx="10" fill="#062B3A" stroke="#10B981" strokeWidth="1.5" />
              <text x="0" y="-21" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Your Service Address
              </text>
            </g>

            {/* 2. Worker Live Position Marker (Moving Point) */}
            <g transform={`translate(${workerProjected.x}, ${workerProjected.y})`}>
              {/* Radial glow */}
              <circle cx="0" cy="0" r="28" fill="url(#worker-pulse-grad)" />
              <circle cx="0" cy="0" r="16" fill="#E0A922" className="drop-shadow-lg" />
              <circle cx="0" cy="0" r="13" fill="#1C161A" />

              {/* Transit vehicle icon representation */}
              <circle cx="0" cy="0" r="4" fill="#E0A922" />

              {/* Worker Label Card */}
              <rect x="-65" y="-38" width="130" height="22" rx="11" fill="#062B3A" stroke="#E0A922" strokeWidth="1.5" />
              <text x="0" y="-23" fill="#FFD700" fontSize="9" fontWeight="bold" textAnchor="middle">
                🛠️ {booking.assignedWorkerName || 'Worker'} • {currentDistanceKm} km
              </text>
            </g>
          </svg>
        </div>

        {/* Bottom Floating Stats Bar */}
        <div className="p-3 bg-[#062B3A]/95 backdrop-blur-md border-t border-white/10 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                {t('live_worker_dist_rem', 'Distance Remaining')}
              </span>
              <span className="text-base font-black text-emerald-400">
                {currentDistanceKm} km
              </span>
            </div>

            <div className="h-6 w-px bg-white/15"></div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                {t('live_worker_eta_label', 'Estimated Arrival')}
              </span>
              <span className="text-base font-black text-amber-300">
                ~{currentETA} mins
              </span>
            </div>

            <div className="h-6 w-px bg-white/15"></div>

            <div className="hidden sm:block">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                {t('live_worker_speed_label', 'Speed')}
              </span>
              <span className="text-xs font-bold text-slate-200">
                {isPlaying ? t('live_worker_speed_val', '24 km/h (EV Scooter)') : t('live_worker_stationary', 'Stationary')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {booking.assignedWorkerPhone && (
              <a
                href={`tel:${booking.assignedWorkerPhone}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('live_worker_call', 'Call')}</span>
              </a>
            )}

            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#35C6B0] hover:bg-[#2EAD9A] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat ({booking.chatMessages.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Technician & Security Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Worker Card */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={booking.assignedWorkerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
              alt={booking.assignedWorkerName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#35C6B0]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{booking.assignedWorkerName}</h4>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> NCVT Certified
                </span>
              </div>
              <p className="text-xs text-slate-600">{booking.societyName}</p>
              <div className="flex items-center gap-2 text-[11px] text-amber-600 font-bold pt-0.5">
                <span>⭐ {booking.assignedWorkerRating || 4.9}</span>
                <span>•</span>
                <span>{t('live_worker_protected_shield', 'Protected by Cooperative Welfare Shield')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security OTP Card */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-amber-600" />
              Secure Service Start OTP
            </span>
            <p className="text-xs text-amber-800">
              Share with technician upon arrival to begin work.
            </p>
          </div>

          <div className="px-4 py-2 bg-amber-500 text-white rounded-2xl text-xl font-black font-mono tracking-widest shadow-md">
            {booking.otpCode}
          </div>
        </div>
      </div>
    </div>
  );
};
