import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

import {
  X,
  MapPin,
  Navigation,
  Search,
  Check,
  Plus,
  Home,
  Briefcase,
  Bookmark,
  Trash2,
  Edit2,
  AlertCircle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  RefreshCw,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { ALL_INDIAN_STATES_AND_UTS, ALL_MAJOR_CITIES, IndiaState } from '../../data/indiaLocations';
import { SavedAddress, formatAddress, reverseGeocodeCoords } from '../../utils/geoUtils';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress?: (address: SavedAddress) => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
}) => {
  const {
    activeAddress,
    savedAddresses,
    setActiveAddress,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    detectGpsLocation,
    userLocation,
    setSelectedCity,
    t,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'gps' | 'saved' | 'manual' | 'map'>(
    userLocation?.isRealGps ? 'gps' : savedAddresses.length > 0 ? 'saved' : 'gps'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(userLocation?.error || null);

  // Cascading Form State
  const [selectedStateCode, setSelectedStateCode] = useState<string>('DL');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Central Delhi');
  const [selectedCityName, setSelectedCityName] = useState<string>('New Delhi');
  const [selectedArea, setSelectedArea] = useState<string>('Connaught Place');
  const [pincode, setPincode] = useState<string>('110001');
  const [flatNumber, setFlatNumber] = useState<string>('Flat 102, Block A');
  const [street, setStreet] = useState<string>('Connaught Place Main Road');
  const [landmark, setLandmark] = useState<string>('Near Central Metro Gate 2');
  const [labelType, setLabelType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [customTitle, setCustomTitle] = useState<string>('');

  // Map Picker State (lat, lng coords)
  const [pickedCoords, setPickedCoords] = useState<{ lat: number; lng: number }>({
    lat: userLocation?.lat || activeAddress?.lat || 28.6139,
    lng: userLocation?.lng || activeAddress?.lng || 77.209,
  });

  // Derived Cascading Options
  const currentStateObj: IndiaState =
    ALL_INDIAN_STATES_AND_UTS.find((s) => s.code === selectedStateCode) || ALL_INDIAN_STATES_AND_UTS[0];
  const currentDistricts = currentStateObj.districts || [];
  const currentDistrictObj =
    currentDistricts.find((d) => d.name === selectedDistrictName) || currentDistricts[0];
  const currentCities = currentDistrictObj ? currentDistrictObj.cities : [];
  const currentCityObj =
    currentCities.find((c) => c.name === selectedCityName) || currentCities[0] || {
      name: selectedCityName,
      pincode: '110001',
      lat: 28.6139,
      lng: 77.209,
      popularAreas: ['Main Market', 'Civil Lines', 'City Center'],
    };

  // Sync state if userLocation changes
  useEffect(() => {
    if (userLocation?.error) {
      setGpsError(userLocation.error);
    }
  }, [userLocation]);

  const handleStateChange = (code: string) => {
    setSelectedStateCode(code);
    const newState = ALL_INDIAN_STATES_AND_UTS.find((s) => s.code === code);
    if (newState && newState.districts.length > 0) {
      const firstDist = newState.districts[0];
      setSelectedDistrictName(firstDist.name);
      if (firstDist.cities.length > 0) {
        const firstCity = firstDist.cities[0];
        setSelectedCityName(firstCity.name);
        setPincode(firstCity.pincode);
        setSelectedArea(firstCity.popularAreas[0] || 'Main Area');
        setPickedCoords({ lat: firstCity.lat, lng: firstCity.lng });
      }
    }
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrictName(distName);
    const dist = currentDistricts.find((d) => d.name === distName);
    if (dist && dist.cities.length > 0) {
      const firstCity = dist.cities[0];
      setSelectedCityName(firstCity.name);
      setPincode(firstCity.pincode);
      setSelectedArea(firstCity.popularAreas[0] || 'Main Area');
      setPickedCoords({ lat: firstCity.lat, lng: firstCity.lng });
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCityName(cityName);
    const city = currentCities.find((c) => c.name === cityName);
    if (city) {
      setPincode(city.pincode);
      setSelectedArea(city.popularAreas[0] || 'Main Area');
      setPickedCoords({ lat: city.lat, lng: city.lng });
    }
  };

  const handleTriggerGps = () => {
    setIsDetectingGps(true);
    setGpsError(null);
    setActiveTab('gps');

    detectGpsLocation(
      (loc) => {
        setIsDetectingGps(false);
        setPickedCoords({ lat: loc.lat, lng: loc.lng });
        showToast(`📍 Real GPS Acquired: ${loc.addressStr}`, 'success');
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsError(err);
        showToast(err, 'warning');
      }
    );
  };

  const handleSaveAndActivate = (e: React.FormEvent) => {
    e.preventDefault();

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: labelType,
      customTitle: customTitle || (labelType === 'Other' ? selectedArea : labelType),
      flatNumber: flatNumber.trim(),
      street: street.trim(),
      landmark: landmark.trim(),
      area: selectedArea,
      city: selectedCityName,
      district: selectedDistrictName,
      state: currentStateObj.name,
      pincode: pincode.trim(),
      lat: pickedCoords.lat,
      lng: pickedCoords.lng,
      isDefault: true,
    };

    addSavedAddress(newAddr);
    setActiveAddress(newAddr);
    setSelectedCity(selectedCityName);

    if (onSelectAddress) {
      onSelectAddress(newAddr);
    }

    showToast(`Active service address set to ${newAddr.label} (${newAddr.area}, ${newAddr.city})`, 'success');
    onClose();
  };

  const handleSelectExistingAddress = (addr: SavedAddress) => {
    setActiveAddress(addr);
    setSelectedCity(addr.city);
    if (onSelectAddress) {
      onSelectAddress(addr);
    }
    showToast(`Active service address updated to ${addr.label}`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-3 sm:my-4" style={{maxWidth: 'min(672px, calc(100vw - 24px))'}}>
        {/* Modal Header */}
        <div className="bg-[#062B3A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#35C6B0] flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>{t('select_location', 'Select Service Address')}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Real GPS & All 28 Indian States
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {activeAddress
                  ? `${activeAddress.area}, ${activeAddress.city}, ${activeAddress.state}`
                  : 'Detect device GPS or select address manually for accurate artisan dispatch'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="grid grid-cols-4 bg-[#F7F7F2] p-1 sm:p-1.5 border-b border-slate-200 text-[10px] sm:text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('gps');
              if (!userLocation?.isRealGps && !isDetectingGps) {
                handleTriggerGps();
              }
            }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'gps' || isDetectingGps
                ? 'bg-[#35C6B0] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin text-yellow-300' : 'text-emerald-400'}`} />
            <span>{isDetectingGps ? 'Locating...' : 'Real GPS'}</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'saved' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('saved_addresses', 'Saved')}</span>
            <span>({savedAddresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manual' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Cascading Form</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'map' ? 'bg-[#062B3A] text-white shadow-xs' : 'text-slate-600 hover:text-[#062B3A]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Map Pin</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5 text-[#1C161A]">
          {/* TAB 1: REAL GPS DETECTION TAB */}
          {activeTab === 'gps' && (
            <div className="space-y-4">
              {/* GPS Active / Detection Box */}
              <div className="p-5 bg-gradient-to-br from-slate-900 to-[#062B3A] text-white rounded-3xl shadow-lg border border-white/10 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-[#35C6B0]/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Browser Geolocation API (HTML5)
                    </span>
                  </div>

                  {userLocation?.accuracyMeters && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Target className="w-3 h-3 text-emerald-400" />
                      Accuracy: ±{userLocation.accuracyMeters}m ({userLocation.accuracyMeters <= 30 ? 'High' : userLocation.accuracyMeters <= 100 ? 'Medium' : 'Standard'})
                    </span>
                  )}
                </div>

                {/* Loading State */}
                {isDetectingGps ? (
                  <div className="p-6 text-center space-y-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                    <RefreshCw className="w-8 h-8 text-yellow-300 animate-spin mx-auto" />
                    <div>
                      <p className="font-bold text-sm text-white">Acquiring GPS Satellite & Device Coordinates...</p>
                      <p className="text-xs text-slate-300 mt-1">Please allow location access if prompted by browser.</p>
                    </div>
                  </div>
                ) : gpsError ? (
                  /* Error State */
                  <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl space-y-3 text-red-100">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-white">GPS Access Unavailable / Permission Denied</h4>
                        <p className="text-xs text-red-200 leading-relaxed">{gpsError}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={handleTriggerGps}
                        className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry GPS Detection</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('manual')}
                        className="px-3.5 py-1.5 bg-[#E0A922] text-[#062B3A] hover:bg-yellow-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Use Manual Cascading Entry</span>
                      </button>
                    </div>
                  </div>
                ) : userLocation?.isRealGps && activeAddress ? (
                  /* Success Detected Address Display */
                  <div className="space-y-3 bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                          Detected Human-Readable Address:
                        </span>
                        <h4 className="font-bold text-sm text-white mt-0.5 leading-snug">
                          {activeAddress.flatNumber && activeAddress.flatNumber !== 'Current GPS Coordinates'
                            ? `${activeAddress.flatNumber}, `
                            : ''}
                          {activeAddress.street ? `${activeAddress.street}, ` : ''}
                          {activeAddress.area}, {activeAddress.city}, {activeAddress.state} - {activeAddress.pincode}
                        </h4>
                      </div>

                      <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        Live Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-white/10">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Coordinates:</span>
                        <span className="font-mono font-bold text-white">
                          {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Last Updated:</span>
                        <span className="font-medium text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-yellow-300" />
                          {userLocation.lastUpdated
                            ? new Date(userLocation.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            : 'Just now'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Idle / Standby */
                  <div className="p-4 text-center space-y-2 bg-white/5 rounded-2xl border border-white/10">
                    <Navigation className="w-6 h-6 text-[#E0A922] mx-auto" />
                    <p className="text-xs font-bold text-white">Click below to detect your device GPS coordinates.</p>
                  </div>
                )}

                {/* GPS Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    onClick={handleTriggerGps}
                    disabled={isDetectingGps}
                    className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-yellow-300 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    <span>{userLocation?.isRealGps ? 'Refresh GPS Location' : 'Use My Current Location'}</span>
                  </button>

                  {userLocation?.isRealGps && (
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-[#E0A922] hover:bg-yellow-400 text-[#062B3A] rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#062B3A]" />
                      <span>Confirm & Continue</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Fallback Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-[#062B3A]">Prefer to select your state or city manually?</h4>
                  <p className="text-[11px] text-slate-500">Choose from all 28 Indian States & 8 Union Territories.</p>
                </div>
                <button
                  onClick={() => setActiveTab('manual')}
                  className="px-3.5 py-2 bg-[#062B3A] text-white rounded-xl text-xs font-bold hover:bg-[#35C6B0] transition-colors cursor-pointer shrink-0"
                >
                  Manual Form →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Your Registered Saved Addresses
                </span>
                <button
                  onClick={() => setActiveTab('manual')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#35C6B0] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('add_new_address', 'Add New Address')}</span>
                </button>
              </div>

              {savedAddresses.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">No saved addresses yet</p>
                  <p className="text-xs text-slate-500">
                    Use GPS detection or fill out the cascading state & city form to save your service location.
                  </p>
                  <button
                    onClick={() => setActiveTab('manual')}
                    className="px-4 py-2 bg-[#35C6B0] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#062B3A] transition-colors cursor-pointer"
                  >
                    Enter New Address
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = activeAddress?.id === addr.id;
                    const Icon = addr.label === 'Home' ? Home : addr.label === 'Work' ? Briefcase : Bookmark;

                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectExistingAddress(addr)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#F7F7F2] border-[#35C6B0] ring-2 ring-[#35C6B0]/30 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              addr.label === 'Home'
                                ? 'bg-emerald-100 text-emerald-800'
                                : addr.label === 'Work'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#1C161A]">
                                {addr.customTitle || addr.label}
                              </span>
                              {isSelected && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  <Check className="w-3 h-3" /> Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {formatAddress(addr)}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-1">
                              <span>📍 {addr.city}, {addr.state}</span>
                              <span>•</span>
                              <span>PIN: {addr.pincode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedStateCode(
                                ALL_INDIAN_STATES_AND_UTS.find((s) => s.name === addr.state)?.code || 'DL'
                              );
                              setSelectedDistrictName(addr.district);
                              setSelectedCityName(addr.city);
                              setSelectedArea(addr.area);
                              setPincode(addr.pincode);
                              setFlatNumber(addr.flatNumber);
                              setStreet(addr.street);
                              setLandmark(addr.landmark || '');
                              setLabelType(addr.label);
                              setPickedCoords({ lat: addr.lat, lng: addr.lng });
                              setActiveTab('manual');
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-[#062B3A]"
                            title="Edit Address"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {savedAddresses.length > 1 && (
                            <button
                              onClick={() => deleteSavedAddress(addr.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                              title="Delete Address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CASCADING MANUAL ENTRY & FORM */}
          {activeTab === 'manual' && (
            <form onSubmit={handleSaveAndActivate} className="space-y-4">
              {/* Quick Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick search any Indian city, pincode, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs font-medium rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                />
              </div>

              {searchQuery.trim() && (
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs max-h-40 overflow-y-auto space-y-1 text-xs">
                  {ALL_MAJOR_CITIES.filter(
                    (c) =>
                      c.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.pincode.includes(searchQuery)
                  ).slice(0, 6).map((c) => (
                    <div
                      key={c.cityName}
                      onClick={() => {
                        const stateObj = ALL_INDIAN_STATES_AND_UTS.find((s) => s.name === c.stateName);
                        if (stateObj) setSelectedStateCode(stateObj.code);
                        setSelectedDistrictName(c.districtName);
                        setSelectedCityName(c.cityName);
                        setPincode(c.pincode);
                        setSelectedArea(c.popularAreas[0] || 'Main City Area');
                        setPickedCoords({ lat: c.lat, lng: c.lng });
                        setSearchQuery('');
                        showToast(`Selected ${c.cityName}, ${c.stateName}`, 'info');
                      }}
                      className="p-2 hover:bg-purple-50 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-bold text-[#062B3A]">{c.cityName}, {c.stateName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">PIN: {c.pincode}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#062B3A] uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    Cascading Selection (State → District → City → Area)
                  </span>
                  <span className="text-[11px] text-slate-500">28 States + 8 UTs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* State / UT Selector */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      1. State / Union Territory *
                    </label>
                    <select
                      value={selectedStateCode}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                    >
                      <optgroup label="28 States of India">
                        {ALL_INDIAN_STATES_AND_UTS.filter((s) => s.type === 'state').map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name} ({s.code})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="8 Union Territories">
                        {ALL_INDIAN_STATES_AND_UTS.filter((s) => s.type === 'ut').map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.name} ({s.code})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* District / City Selector */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      2. District / Union *
                    </label>
                    <select
                      value={selectedDistrictName}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                    >
                      {currentDistricts.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* City / Hub */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      3. City / Town *
                    </label>
                    <select
                      value={selectedCityName}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                    >
                      {currentCities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Area / Popular Locality */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      4. Area / Locality *
                    </label>
                    {currentCityObj.popularAreas && currentCityObj.popularAreas.length > 0 ? (
                      <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                      >
                        {currentCityObj.popularAreas.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        placeholder="e.g. Sector 18, Indiranagar"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                        required
                      />
                    )}
                  </div>

                  {/* Indian PIN Code */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      5. PIN Code (6-Digits) *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 110048"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Street Address */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      House / Flat / Building No. *
                    </label>
                    <input
                      type="text"
                      value={flatNumber}
                      onChange={(e) => setFlatNumber(e.target.value)}
                      placeholder="e.g. Flat 304, Tower B, Galaxy Heights"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Street / Road / Sector *
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Outer Ring Road, 14th Cross"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Prominent Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite Metro Pillar 42, Near Cooperative Bank"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]"
                  />
                </div>

                {/* Address Label Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Save As:
                  </label>
                  <div className="flex items-center gap-2">
                    {(['Home', 'Work', 'Other'] as const).map((lbl) => {
                      const Icon = lbl === 'Home' ? Home : lbl === 'Work' ? Briefcase : Bookmark;
                      return (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setLabelType(lbl)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            labelType === lbl
                              ? 'bg-[#062B3A] text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{lbl}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('saved')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Back to Saved
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t('save_address_btn', 'Save & Set Active Address')}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: INTERACTIVE MAP PIN PICKER */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs text-purple-900">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#35C6B0]" />
                  <span>
                    Click anywhere on the interactive grid to reposition service pin
                  </span>
                </div>
                <span className="font-mono text-[11px] bg-purple-200/60 px-2 py-0.5 rounded text-purple-950 font-bold">
                  {pickedCoords.lat.toFixed(4)}, {pickedCoords.lng.toFixed(4)}
                </span>
              </div>

              {/* Interactive Real Map using Leaflet */}
              <div
                className="relative w-full h-72 rounded-2xl overflow-hidden border border-slate-300 shadow-inner group z-10"
              >
                <MapContainer
                  center={[pickedCoords.lat, pickedCoords.lng]}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[pickedCoords.lat, pickedCoords.lng]} />
                  <MapEventsComponent
                    center={[pickedCoords.lat, pickedCoords.lng]}
                    onMapClick={async (lat, lng) => {
                      setPickedCoords({ lat, lng });
                      const geocoded = await reverseGeocodeCoords(lat, lng);
                      if (geocoded.area) setSelectedArea(geocoded.area);
                      if (geocoded.city) setSelectedCityName(geocoded.city);
                      if (geocoded.pincode) setPincode(geocoded.pincode);
                      showToast(`Pin moved: ${geocoded.formattedAddress}`, 'info');
                    }}
                  />
                </MapContainer>

                {/* Overlay helper banner */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#062B3A]/90 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs flex items-center justify-between border border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Selected: {selectedArea}, {selectedCityName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold">Verified Coverage</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className="text-xs font-bold text-[#35C6B0] hover:underline cursor-pointer"
                >
                  ← Edit Street Details
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndActivate}
                  className="px-5 py-2.5 bg-[#062B3A] hover:bg-[#35C6B0] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Confirm & Save Location</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component to handle map clicks and sync center
const MapEventsComponent = ({
  center,
  onMapClick,
}: {
  center: [number, number];
  onMapClick: (lat: number, lng: number) => void;
}) => {
  const map = useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);

  return null;
};


