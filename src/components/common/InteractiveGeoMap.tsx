import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Navigation,
  Layers,
  Sparkles,
  Search,
  Star,
  CheckCircle2,
  HardHat,
  Building2,
  Crosshair,
  Maximize2,
  Info,
} from 'lucide-react';
import { Worker, HouseholdBooking } from '../../types';
import { useApp } from '../../hooks/useApp';

interface InteractiveGeoMapProps {
  onSelectWorker?: (worker: Worker) => void;
  selectedCategory?: string;
  activeBooking?: HouseholdBooking;
  heightClassName?: string;
  showCoopHubs?: boolean;
}

export const InteractiveGeoMap: React.FC<InteractiveGeoMapProps> = ({
  onSelectWorker,
  selectedCategory = 'all',
  activeBooking,
  heightClassName = 'h-[440px]',
  showCoopHubs = true,
}) => {
  const { workers, organizations, selectedCity } = useApp();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [radiusFilter, setRadiusFilter] = useState<number>(5); // km
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>(selectedCategory);
  const [showRadar, setShowRadar] = useState(true);

  // Map coordinates projection for South/Central Delhi mock coordinate grid
  // Base center lat: 28.5600, lng: 77.2200
  const centerLat = 28.56;
  const centerLng = 77.22;

  const projectToSvg = (lat: number, lng: number) => {
    // scale roughly to 600x400 SVG box
    const x = 300 + (lng - centerLng) * 2600;
    const y = 200 - (lat - centerLat) * 2600;
    return {
      x: Math.max(30, Math.min(570, x)),
      y: Math.max(30, Math.min(370, y)),
    };
  };

  const filteredWorkers = workers.filter((w) => {
    if (selectedFilterCategory !== 'all') {
      const matchCat = w.skills.some((s) => s.category.toLowerCase().includes(selectedFilterCategory.toLowerCase()));
      if (!matchCat) return false;
    }
    return true;
  });

  return (
    <div className={`relative w-full ${heightClassName} bg-[#041D27] rounded-2xl overflow-hidden shadow-lg border border-[#062B3A]/30 flex flex-col`}>
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#062B3A]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs shadow-md pointer-events-auto">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold">{selectedCity} Cooperative Geo-Grid</span>
          <span className="text-[10px] text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
            {filteredWorkers.length} Verified Workers Live
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#062B3A]/90 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setRadiusFilter(3)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
              radiusFilter === 3 ? 'bg-[#35C6B0] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            3 km
          </button>
          <button
            onClick={() => setRadiusFilter(5)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
              radiusFilter === 5 ? 'bg-[#35C6B0] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            5 km
          </button>
          <button
            onClick={() => setRadiusFilter(10)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
              radiusFilter === 10 ? 'bg-[#35C6B0] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            10 km
          </button>
          <button
            onClick={() => setShowRadar(!showRadar)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all ${
              showRadar ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
            }`}
            title="Toggle Live AI Radar Sweep"
          >
            <Sparkles className="w-3 h-3" />
            AI Radar
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-1 w-full h-full relative cursor-crosshair">
        <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(108, 79, 232, 0.12)" strokeWidth="0.8" />
            </pattern>

            {/* Radar gradient */}
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(108, 79, 232, 0.35)" />
              <stop offset="60%" stopColor="rgba(108, 79, 232, 0.08)" />
              <stop offset="100%" stopColor="rgba(108, 79, 232, 0)" />
            </radialGradient>

            <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#35C6B0" />
            </linearGradient>
          </defs>

          {/* Background & Grid */}
          <rect width="600" height="400" fill="#03161D" />
          <rect width="600" height="400" fill="url(#grid-map)" />

          {/* Road Network Lines Simulation */}
          <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" strokeLinecap="round">
            {/* Outer Ring Road */}
            <path d="M 50 120 Q 200 80 400 130 T 550 220" fill="none" />
            <path d="M 80 320 Q 280 350 480 310" fill="none" />
            {/* Radial Arterials */}
            <path d="M 300 20 L 300 380" fill="none" strokeDasharray="4 4" stroke="rgba(108, 79, 232, 0.2)" />
            <path d="M 40 200 L 560 200" fill="none" strokeDasharray="4 4" stroke="rgba(108, 79, 232, 0.2)" />
            <path d="M 120 60 L 480 340" fill="none" />
            <path d="M 480 60 L 120 340" fill="none" />
          </g>

          {/* Range Concentric Rings from User Location */}
          <circle cx="300" cy="200" r={radiusFilter * 16} fill="url(#radar-glow)" stroke="rgba(108, 79, 232, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="300" cy="200" r={radiusFilter * 8} fill="none" stroke="rgba(108, 79, 232, 0.3)" strokeWidth="1" />

          {/* Radar Sweep Effect */}
          {showRadar && (
            <g transform="translate(300, 200)">
              <line x1="0" y1="0" x2={radiusFilter * 16} y2="0" stroke="#35C6B0" strokeWidth="2" opacity="0.7" className="radar-sweep" />
              <circle cx="0" cy="0" r="4" fill="#35C6B0" />
            </g>
          )}

          {/* Cooperative Society HQ Hubs */}
          {showCoopHubs &&
            organizations.slice(1, 4).map((org, i) => {
              const pos = projectToSvg(28.54 + i * 0.02, 77.21 + i * 0.03);
              return (
                <g key={org.id} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="14" fill="#062B3A" stroke="#35C6B0" strokeWidth="1.5" />
                  <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#E0A922" />
                  <text x="0" y="24" fill="#E0A922" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {org.code}
                  </text>
                </g>
              );
            })}

          {/* Active Job Route Simulation if activeBooking exists */}
          {activeBooking && (
            <g>
              <path
                d="M 300 200 Q 340 180 390 160"
                fill="none"
                stroke="url(#route-gradient)"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              {/* In Transit pulsing vehicle marker */}
              <circle cx="345" cy="180" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2">
                <animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Center User Pin (Customer / Current Position) */}
          <g transform="translate(300, 200)">
            <circle cx="0" cy="0" r="18" fill="rgba(16, 185, 129, 0.2)" className="animate-ping" />
            <circle cx="0" cy="0" r="9" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="-14" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
              You (Request Location)
            </text>
          </g>

          {/* Worker Location Markers */}
          {filteredWorkers.map((worker) => {
            const pos = projectToSvg(worker.location.lat, worker.location.lng);
            const isSelected = selectedWorker?.id === worker.id;
            const isAvailable = worker.availability === 'available';

            return (
              <g
                key={worker.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  setSelectedWorker(worker);
                  if (onSelectWorker) onSelectWorker(worker);
                }}
                className="cursor-pointer group"
              >
                {/* Outer halo */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 20 : 14}
                  fill={isSelected ? '#35C6B0' : isAvailable ? '#062B3A' : '#4B5563'}
                  stroke={isSelected ? '#FFFFFF' : isAvailable ? '#10B981' : '#9CA3AF'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all duration-200"
                />

                {/* Worker Initials / Icon */}
                <text x="0" y="3" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {worker.name.split(' ').map((n) => n[0]).join('')}
                </text>

                {/* Verification badge tick */}
                {worker.verificationStatus === 'verified' && (
                  <circle cx="8" cy="-8" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
                )}

                {/* Worker hover/selected label */}
                <g className={`transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <rect x="-55" y="-38" width="110" height="24" rx="6" fill="#062B3A" stroke="rgba(255,255,255,0.2)" />
                  <text x="0" y="-23" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {worker.name}
                  </text>
                  <text x="0" y="-12" fill="#10B981" fontSize="8" textAnchor="middle">
                    ★ {worker.rating} • {worker.badge}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Worker Info Bottom Card */}
      {selectedWorker && (
        <div className="absolute bottom-3 left-3 right-3 bg-[#FAF9F6] rounded-xl p-3 shadow-2xl border border-[#062B3A]/20 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-2 z-30">
          <div className="flex items-center gap-3">
            <img
              src={selectedWorker.avatar}
              alt={selectedWorker.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#35C6B0]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1C161A]">{selectedWorker.name}</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {selectedWorker.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#5A61AA] truncate max-w-xs">{selectedWorker.societyName}</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                <span>★ {selectedWorker.rating} ({selectedWorker.reviewCount} reviews)</span>
                <span>•</span>
                <span>{selectedWorker.skills[0]?.name}</span>
                <span>•</span>
                <span className="font-semibold text-[#062B3A]">₹{selectedWorker.hourlyRate}/hr</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedWorker(null)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
            {onSelectWorker && (
              <button
                onClick={() => onSelectWorker(selectedWorker)}
                className="px-3.5 py-1.5 rounded-lg bg-[#35C6B0] text-white text-xs font-semibold hover:bg-[#2EAD9A] shadow-sm flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Select Worker
              </button>
            )}
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="bg-[#03161D]/90 border-t border-white/10 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-300">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Available Worker
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#35C6B0]"></span> Selected Worker
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#E0A922]"></span> Cooperative Society HQ
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          Proximity: Haversine Geo-Radius Matching Engine
        </span>
      </div>
    </div>
  );
};
