// @refresh reset
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Worker,
  HouseholdBooking,
  InstitutionalWorkOrder,
  CooperativeOrg,
  Complaint,
  ServiceCategory,
  AIDemandForecast,
  AIAllocationRecommendation,
  BookingStatus,
  WorkOrderStatus,
  WorkerAvailability,
  WelfareRecord,
  ChatMessage,
  CooperativeAllocationConfig,
  IdentityVerificationDetails,
  ApprenticeshipRecord,
  UserWalletsMap,
  UserWalletEntry,
  EmergencyContact,
  SosAlert,
  SosContactNotification,
} from '../types';

import {
  INITIAL_ORGS,
  SERVICE_CATEGORIES,
  INITIAL_WORKERS,
  INITIAL_BOOKINGS,
  INITIAL_WORK_ORDERS,
  INITIAL_COMPLAINTS,
  INITIAL_DEMAND_FORECASTS,
  DEMO_USERS,
  INITIAL_APPRENTICESHIPS,
  INITIAL_WALLETS,
} from '../data/mockData';

import { SupportedLanguage, translateText } from '../i18n/translations';
import { SavedAddress, findNearestIndianCity, formatAddress, reverseGeocodeCoords } from '../utils/geoUtils';
import { DEFAULT_COOPERATIVE_CONFIG } from '../utils/wageCalculator';

export interface UserLocationState {
  lat: number;
  lng: number;
  isGpsActive: boolean;
  isRealGps?: boolean;
  accuracyMeters?: number;
  lastUpdated?: string;
  isLoading?: boolean;
  error?: string | null;
  formattedAddress?: string;
}

const DEFAULT_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-home-1',
    label: 'Home',
    customTitle: 'Home (Central Residence)',
    flatNumber: 'Flat 102, Block A',
    street: 'Connaught Place Main Road',
    landmark: 'Near Central Metro Gate 2',
    area: 'Connaught Place',
    city: 'New Delhi',
    district: 'Central Delhi',
    state: 'Delhi (NCT)',
    pincode: '110001',
    lat: 28.6315,
    lng: 77.2167,
    isDefault: true,
  },
  {
    id: 'addr-work-1',
    label: 'Work',
    customTitle: 'Work Office (Cyber Hub)',
    flatNumber: 'Building 10B, 4th Floor',
    street: 'DLF Cyber City',
    landmark: 'Opposite Cyber Hub Metro',
    area: 'Cyber Hub / DLF Phase 2',
    city: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    lat: 28.4908,
    lng: 77.0892,
    isDefault: false,
  },
  {
    id: 'addr-other-1',
    label: 'Other',
    customTitle: 'Parents House (Bandra)',
    flatNumber: 'Apt 12, Sea Breeze Society',
    street: 'Perry Cross Road',
    landmark: 'Near St. Andrew Church',
    area: 'Bandra West',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    pincode: '400050',
    lat: 19.0596,
    lng: 72.8295,
    isDefault: false,
  },
];

interface AppContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  loginUser: (role: UserRole, customUser?: Partial<UserProfile>) => void;
  apprenticeships: ApprenticeshipRecord[];
  recordApprenticeJob: (apprenticeId: string, bookingId: string, hours: number, stipend: number) => void;
  submitApprenticeEvaluation: (apprenticeId: string, rating: number, comments: string) => void;
  adminValidateApprentice: (apprenticeId: string, decision: 'completed' | 'rejected' | 'retrain') => void;
  assignMentor: (apprenticeId: string, apprenticeName: string, mentorId: string, mentorName: string, skillCategory: string) => void;
  addWalletCredit: (userId: string, amount: number, reason: string) => void;
  deductWalletCredit: (userId: string, amount: number, reason: string) => void;
  getUserWallet: (userId: string) => UserWalletEntry;
  userWallets: UserWalletsMap;

  logoutUser: () => void;

  // Language & i18n
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;

  // Saved Addresses & GPS
  savedAddresses: SavedAddress[];
  activeAddress: SavedAddress;
  setActiveAddress: (address: SavedAddress) => void;
  addSavedAddress: (address: SavedAddress) => void;
  updateSavedAddress: (address: SavedAddress) => void;
  deleteSavedAddress: (id: string) => void;
  userLocation: UserLocationState;
  detectGpsLocation: (
    onSuccess?: (loc: { lat: number; lng: number; addressStr: string }) => void,
    onError?: (error: string) => void
  ) => void;
  
  // Data
  categories: ServiceCategory[];
  workers: Worker[];
  bookings: HouseholdBooking[];
  workOrders: InstitutionalWorkOrder[];
  organizations: CooperativeOrg[];
  complaints: Complaint[];
  demandForecasts: AIDemandForecast[];
  
  // User Verification
  updateUserVerification: (details: IdentityVerificationDetails) => void;

  // Actions - Household Bookings
  createBooking: (bookingData: Partial<HouseholdBooking>) => HouseholdBooking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, extra?: Partial<HouseholdBooking>) => void;
  addChatMessage: (bookingId: string, text: string, senderRole: UserRole) => void;
  rateBooking: (bookingId: string, rating: number, reviewText: string) => void;
  cancelBooking: (bookingId: string, reason?: string) => void;
  
  // Actions - Institutional Work Orders
  createWorkOrder: (workOrderData: Partial<InstitutionalWorkOrder>) => InstitutionalWorkOrder;
  updateWorkOrderStatus: (workOrderId: string, status: WorkOrderStatus) => void;
  assignWorkersToWorkOrder: (workOrderId: string, workerIds: string[]) => void;
  removeWorkerFromWorkOrder: (workOrderId: string, workerId: string) => void;
  verifyMilestone: (workOrderId: string, milestoneId: string, verifierName: string) => void;
  recordAttendance: (workOrderId: string, workerId: string, date: string, status: 'present' | 'absent' | 'half_day') => void;
  submitInstitutionFeedback: (workOrderId: string, rating: number, comment: string) => void;
  
  // Actions - Worker Management
  verifyWorker: (workerId: string, approved: boolean, badge?: Worker['badge'], notes?: string) => void;
  registerWorker: (workerData: Partial<Worker>) => Worker;
  updateWorkerAvailability: (workerId: string, status: WorkerAvailability) => void;
  rebalanceWorker: (workerId: string) => void;
  rebalanceWorkforce: () => void;
  addWelfareClaim: (workerId: string, claimData: Omit<WelfareRecord, 'id' | 'workerId' | 'workerName' | 'referenceNo' | 'status'>) => void;
  approveWelfareClaim: (claimId: string, approved: boolean) => void;
  
  // Actions - Organizations
  addOrganization: (orgData: Partial<CooperativeOrg>) => CooperativeOrg;
  
  // Actions - Complaints
  raiseComplaint: (complaintData: Partial<Complaint>) => Complaint;
  resolveComplaint: (complaintId: string, resolutionNotes: string) => void;
  resolveComplaintOutcome: (complaintId: string, outcome: 'upheld' | 'dismissed', adminNotes: string) => void;
  updateWorkerSafetyStatus: (workerId: string, status: 'active' | 'suspension_review' | 'disciplinary_review' | 'suspended', notes: string) => void;
  
  // AI Tools
  getAIRecommendations: (categoryOrSkill: string, targetLocation?: string) => AIAllocationRecommendation;
  generateAIDemandForecast: (area: string, category: string) => Promise<AIDemandForecast>;
  
  // Cooperative Fair Wage Allocation Policy
  allocationConfig: CooperativeAllocationConfig;
  updateAllocationConfig: (config: CooperativeAllocationConfig) => void;
  assignWorkersToOrder: (workOrderId: string, workerIds: string[]) => void;
  approveWelfareRecord: (workerId: string, recordId: string) => void;

  // Emergency Contacts
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'addedAt'>) => void;
  updateEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;

  // SOS Alerts
  sosAlerts: SosAlert[];
  triggerSOS: (bookingId: string) => SosAlert | null;
  triggerWorkerSOS: (jobId: string, workerName: string, workerPhone: string) => SosAlert | null;

  // Toast notifications
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'aatral_role',
  USER: 'aatral_user',
  WORKERS: 'aatral_workers',
  BOOKINGS: 'aatral_bookings',
  WORK_ORDERS: 'aatral_work_orders',
  ORGS: 'aatral_orgs',
  COMPLAINTS: 'aatral_complaints',
  CITY: 'aatral_city',
  LANG: 'aatral_lang',
  SAVED_ADDRESSES: 'aatral_saved_addresses',
  ACTIVE_ADDRESS: 'aatral_active_address',
  USER_LOCATION: 'aatral_user_location',
  ALLOCATION_CONFIG: 'aatral_allocation_config',
  WALLETS: 'aatral_wallets',
  EMERGENCY_CONTACTS: 'aatral_emergency_contacts',
  SOS_ALERTS: 'aatral_sos_alerts',
};

// ─── Reward configuration ────────────────────────────────────────────────────
const WELCOME_BONUS = 500;         // ₹ credited on first login
const COMPLETION_REWARD_PCT = 0.05; // 5% of finalPrice on job rated/completed


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'customer';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CITY) || 'New Delhi';
  });

  // Language state
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translateText(key, currentLanguage, fallback);
  };

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_ADDRESSES);
    return saved ? JSON.parse(saved) : DEFAULT_SAVED_ADDRESSES;
  });

  const [activeAddress, setActiveAddressState] = useState<SavedAddress>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ADDRESS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_SAVED_ADDRESSES[0];
  });

  const [userLocation, setUserLocation] = useState<UserLocationState>({
    lat: 28.5355,
    lng: 77.2505,
    isGpsActive: false,
  });

  const setActiveAddress = (address: SavedAddress) => {
    setActiveAddressState(address);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ADDRESS, JSON.stringify(address));
    setSelectedCityState(address.city);
    localStorage.setItem(STORAGE_KEYS.CITY, address.city);
    setUserLocation({
      lat: address.lat,
      lng: address.lng,
      isGpsActive: true,
      lastUpdated: new Date().toISOString(),
    });
  };

  const addSavedAddress = (address: SavedAddress) => {
    const updated = [address, ...savedAddresses.filter((a) => a.id !== address.id)];
    setSavedAddresses(updated);
    localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(updated));
  };

  const updateSavedAddress = (address: SavedAddress) => {
    const updated = savedAddresses.map((a) => (a.id === address.id ? address : a));
    setSavedAddresses(updated);
    localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(updated));
    if (activeAddress.id === address.id) {
      setActiveAddress(address);
    }
  };

  const deleteSavedAddress = (id: string) => {
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(updated));
    if (activeAddress.id === id && updated.length > 0) {
      setActiveAddress(updated[0]);
    }
  };

  // GPS Detection with real browser Geolocation API and reverse geocoding
  const detectGpsLocation = (
    onSuccess?: (loc: { lat: number; lng: number; addressStr: string }) => void,
    onError?: (error: string) => void
  ) => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setUserLocation((prev) => ({ ...prev, isLoading: true, error: null }));
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          // Perform reverse geocoding to get actual locality and complete address
          const geocoded = await reverseGeocodeCoords(lat, lng);

          const gpsAddress: SavedAddress = {
            id: `gps-location`,
            label: 'Home',
            customTitle: 'Current GPS Location',
            flatNumber: geocoded.street || `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            street: geocoded.street,
            area: geocoded.area,
            city: geocoded.city,
            district: geocoded.district,
            state: geocoded.state,
            pincode: geocoded.pincode,
            lat,
            lng,
            isDefault: true,
          };

          const newLocState: UserLocationState = {
            lat,
            lng,
            isGpsActive: true,
            isRealGps: true,
            accuracyMeters: accuracy,
            lastUpdated: new Date().toISOString(),
            isLoading: false,
            error: null,
            formattedAddress: geocoded.formattedAddress,
          };

          setUserLocation(newLocState);
          localStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(newLocState));
          setActiveAddressState(gpsAddress);
          localStorage.setItem(STORAGE_KEYS.ACTIVE_ADDRESS, JSON.stringify(gpsAddress));
          setSelectedCityState(geocoded.city);
          localStorage.setItem(STORAGE_KEYS.CITY, geocoded.city);

          const addressStr = geocoded.formattedAddress;

          if (onSuccess) {
            onSuccess({ lat, lng, addressStr });
          }
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err.message);
          let errMsg = 'GPS location permission denied or unavailable.';
          if (err.code === err.PERMISSION_DENIED) {
            errMsg = 'GPS permission was denied by your browser. Please allow location permissions in browser settings or enter/select your address manually below.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errMsg = 'GPS location information is currently unavailable from your device. Please try again or enter your address manually.';
          } else if (err.code === err.TIMEOUT) {
            errMsg = 'GPS location request timed out. Please click Refresh Location or enter your address manually.';
          }

          setUserLocation((prev) => ({
            ...prev,
            isGpsActive: false,
            isLoading: false,
            error: errMsg,
          }));

          if (onError) {
            onError(errMsg);
          }
        },
        { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      const errMsg = 'Geolocation API is not supported by your browser or device.';
      setUserLocation((prev) => ({
        ...prev,
        isGpsActive: false,
        isLoading: false,
        error: errMsg,
      }));
      if (onError) onError(errMsg);
    }
  };

  const [categories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKERS);
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [bookings, setBookings] = useState<HouseholdBooking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [workOrders, setWorkOrders] = useState<InstitutionalWorkOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });

  const [organizations, setOrganizations] = useState<CooperativeOrg[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORGS);
    return saved ? JSON.parse(saved) : INITIAL_ORGS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [demandForecasts] = useState<AIDemandForecast[]>(INITIAL_DEMAND_FORECASTS);

  const [allocationConfig, setAllocationConfig] = useState<CooperativeAllocationConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALLOCATION_CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_COOPERATIVE_CONFIG;
  });

  const [apprenticeships, setApprenticeships] = useState<ApprenticeshipRecord[]>(() => {
    const saved = localStorage.getItem('aatral_apprenticeships');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_APPRENTICESHIPS;
  });

  const updateAllocationConfig = (config: CooperativeAllocationConfig) => {
    setAllocationConfig(config);
    localStorage.setItem(STORAGE_KEYS.ALLOCATION_CONFIG, JSON.stringify(config));
    showToast(`Cooperative Allocation Policy updated: ${config.workerDirectSharePercent}% Direct Worker Payout`, 'success');
  };

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    localStorage.setItem(STORAGE_KEYS.CITY, city);
    showToast(`Location set to ${city}`, 'info');
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORGS, JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('aatral_apprenticeships', JSON.stringify(apprenticeships));
  }, [apprenticeships]);


  // ─── userWallets registry ─────────────────────────────────────────────────
  // Keyed by UserProfile.id. This is the single source of truth for Aatral Cash.
  const [userWallets, setUserWallets] = useState<UserWalletsMap>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLETS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_WALLETS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(userWallets));
  }, [userWallets]);

  // Helper: returns a wallet entry (never undefined)
  const getUserWallet = (userId: string): UserWalletEntry => {
    return userWallets[userId] ?? { balance: 0, transactions: [], welcomeGranted: false, rewardedBookingIds: [] };
  };

  // ─── Emergency Contacts ───────────────────────────────────────────────────
  // Stored per-user in a map: userId -> EmergencyContact[]
  const [emergencyContactsMap, setEmergencyContactsMap] = useState<Record<string, EmergencyContact[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(emergencyContactsMap));
  }, [emergencyContactsMap]);

  // Derived: contacts for the currently logged-in user
  const emergencyContacts: EmergencyContact[] = currentUser
    ? (emergencyContactsMap[currentUser.id] ?? [])
    : [];

  const setUserContacts = (userId: string, contacts: EmergencyContact[]) => {
    setEmergencyContactsMap(prev => ({ ...prev, [userId]: contacts }));
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id' | 'addedAt'>) => {
    if (!currentUser) return;
    const existing = emergencyContactsMap[currentUser.id] ?? [];
    if (existing.length >= 3) {
      showToast('Maximum 3 emergency contacts allowed.', 'error');
      return;
    }
    const newContact: EmergencyContact = {
      ...contact,
      id: 'ec-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      addedAt: new Date().toISOString(),
    };
    setUserContacts(currentUser.id, [...existing, newContact]);
    showToast(`Emergency contact "${newContact.name}" added.`, 'success');
  };

  const updateEmergencyContact = (contact: EmergencyContact) => {
    if (!currentUser) return;
    const existing = emergencyContactsMap[currentUser.id] ?? [];
    setUserContacts(currentUser.id, existing.map(c => c.id === contact.id ? contact : c));
    showToast(`Contact "${contact.name}" updated.`, 'success');
  };

  const removeEmergencyContact = (id: string) => {
    if (!currentUser) return;
    const existing = emergencyContactsMap[currentUser.id] ?? [];
    const removed = existing.find(c => c.id === id);
    setUserContacts(currentUser.id, existing.filter(c => c.id !== id));
    if (removed) showToast(`Contact "${removed.name}" removed.`, 'info');
  };

  // ─── SOS Alerts ───────────────────────────────────────────────────────────
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOS_ALERTS);
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOS_ALERTS, JSON.stringify(sosAlerts));
  }, [sosAlerts]);

  const triggerSOS = (bookingId: string): SosAlert | null => {
    if (!currentUser) return null;

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      showToast('Booking not found for SOS.', 'error');
      return null;
    }

    const activeContacts = emergencyContacts.filter(c => c.isActive);
    if (activeContacts.length === 0) {
      showToast('No active emergency contacts found. Please add contacts in Safety Settings.', 'warning');
      return null;
    }

    const now = new Date().toISOString();
    const lat = userLocation?.lat ?? booking.location?.lat ?? 28.56;
    const lng = userLocation?.lng ?? booking.location?.lng ?? 77.22;
    const address = userLocation?.formattedAddress
      ?? `${booking.location?.area ?? ''}, ${booking.location?.city ?? selectedCity}`;

    const contactsNotified: SosContactNotification[] = activeContacts.map(c => ({
      contactId: c.id,
      name: c.name,
      phone: c.phone,
      smsSentAt: now,
      smsStatus: 'sending',
      whatsappSentAt: now,
      whatsappStatus: 'sending',
    }));

    const alert: SosAlert = {
      id: 'sos-' + Date.now(),
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      serviceCategory: booking.serviceCategoryName,
      workerName: booking.assignedWorkerName ?? 'Worker',
      workerPhone: booking.assignedWorkerPhone ?? 'N/A',
      timestamp: now,
      location: { lat, lng, address },
      contactsNotified,
      status: 'active',
    };

    setSosAlerts(prev => [alert, ...prev]);
    showToast('🚨 SOS Alert Triggered! Notifying emergency contacts...', 'error');

    // Simulate sent → delivered progression
    setTimeout(() => {
      setSosAlerts(prev => prev.map(a => {
        if (a.id !== alert.id) return a;
        return {
          ...a,
          contactsNotified: a.contactsNotified.map(cn => ({
            ...cn,
            smsStatus: 'sent',
            whatsappStatus: 'sent',
          })),
        };
      }));
    }, 1500);

    setTimeout(() => {
      setSosAlerts(prev => prev.map(a => {
        if (a.id !== alert.id) return a;
        return {
          ...a,
          contactsNotified: a.contactsNotified.map(cn => ({
            ...cn,
            smsStatus: 'delivered',
            whatsappStatus: 'delivered',
          })),
        };
      }));
      showToast('✅ SOS messages delivered to all contacts!', 'success');
    }, 4000);

    return alert;
  };

  const triggerWorkerSOS = (jobId: string, workerName: string, workerPhone: string): SosAlert | null => {
    if (!currentUser) return null;

    const booking = bookings.find(b => b.id === jobId);
    if (!booking) {
      showToast('Job not found for SOS.', 'error');
      return null;
    }

    const activeContacts = emergencyContacts.filter(c => c.isActive);
    if (activeContacts.length === 0) {
      showToast('No active emergency contacts. Add contacts in Safety Settings first.', 'warning');
      return null;
    }

    const now = new Date().toISOString();
    const lat = userLocation?.lat ?? booking.location?.lat ?? 28.56;
    const lng = userLocation?.lng ?? booking.location?.lng ?? 77.22;
    const address = userLocation?.formattedAddress
      ?? `${booking.location?.area ?? ''}, ${booking.location?.city ?? selectedCity}`;

    const contactsNotified: SosContactNotification[] = activeContacts.map(c => ({
      contactId: c.id,
      name: c.name,
      phone: c.phone,
      smsSentAt: now,
      smsStatus: 'sending',
      whatsappSentAt: now,
      whatsappStatus: 'sending',
    }));

    const alert: SosAlert = {
      id: 'sos-wrk-' + Date.now(),
      customerId: currentUser.id,
      customerName: workerName,
      customerPhone: workerPhone,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      serviceCategory: booking.serviceCategoryName,
      workerName: booking.customerName ?? 'Customer',
      workerPhone: booking.customerPhone ?? 'N/A',
      timestamp: now,
      location: { lat, lng, address },
      contactsNotified,
      status: 'active',
    };

    setSosAlerts(prev => [alert, ...prev]);
    showToast('🚨 Worker SOS Alert Triggered! Notifying emergency contacts...', 'error');

    setTimeout(() => {
      setSosAlerts(prev => prev.map(a => {
        if (a.id !== alert.id) return a;
        return {
          ...a,
          contactsNotified: a.contactsNotified.map(cn => ({
            ...cn,
            smsStatus: 'sent',
            whatsappStatus: 'sent',
          })),
        };
      }));
    }, 1500);

    setTimeout(() => {
      setSosAlerts(prev => prev.map(a => {
        if (a.id !== alert.id) return a;
        return {
          ...a,
          contactsNotified: a.contactsNotified.map(cn => ({
            ...cn,
            smsStatus: 'delivered',
            whatsappStatus: 'delivered',
          })),
        };
      }));
      showToast('✅ Worker SOS messages delivered to all contacts!', 'success');
    }, 4000);

    return alert;
  };


  const recordApprenticeJob = (apprenticeId: string, bookingId: string, hours: number, stipend: number) => {

    setApprenticeships(prev => prev.map(a => {
      if (a.apprenticeId === apprenticeId && a.status === 'active') {
        return {
          ...a,
          trainingHours: a.trainingHours + hours,
          assistedJobs: [...a.assistedJobs, bookingId],
          stipendEarned: a.stipendEarned + stipend
        };
      }
      return a;
    }));
    
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          apprenticeAssistingId: apprenticeId,
          apprenticeAssistingName: 'Apprentice', // We can derive this if needed
          stipendAwarded: stipend
        };
      }
      return b;
    }));
    
    // Add to wallet balance of apprentice
    addWalletCredit(apprenticeId, stipend, `Training Stipend for assisting on job ${bookingId}`);
  };

  const submitApprenticeEvaluation = (apprenticeId: string, rating: number, comments: string) => {
    setApprenticeships(prev => prev.map(a => {
      if (a.apprenticeId === apprenticeId) {
        return {
          ...a,
          status: 'pending_admin',
          evaluation: {
            rating,
            comments,
            date: new Date().toISOString()
          }
        };
      }
      return a;
    }));
  };

  const adminValidateApprentice = (apprenticeId: string, decision: 'completed' | 'rejected' | 'retrain') => {
    setApprenticeships(prev => prev.map(a => {
      if (a.apprenticeId === apprenticeId) {
        return {
          ...a,
          status: decision === 'retrain' ? 'active' : decision
        };
      }
      return a;
    }));
    
    if (decision === 'completed') {
      setWorkers(prev => prev.map(w => {
        if (w.id === apprenticeId) {
          return {
            ...w,
            badge: 'Verified Member'
          };
        }
        return w;
      }));
    }
  };

  const assignMentor = (apprenticeId: string, apprenticeName: string, mentorId: string, mentorName: string, skillCategory: string) => {
    const existing = apprenticeships.filter(a => a.mentorId === mentorId && a.status === 'active');
    if (existing.length >= 2) {
      showToast('This mentor already has 2 active apprentices. Maximum limit is 2.', 'error');
      return;
    }
    const newRecord: ApprenticeshipRecord = {
      id: 'app-rec-' + Date.now(),
      apprenticeId,
      apprenticeName,
      mentorId,
      mentorName,
      skillCategory,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      trainingHours: 0,
      assistedJobs: [],
      stipendEarned: 0,
    };
    setApprenticeships(prev => [...prev, newRecord]);
    showToast(`Apprentice ${apprenticeName} assigned to Mentor ${mentorName}!`, 'success');
  };



  // ─── Wallet credit / debit ────────────────────────────────────────────────
  // Both functions now target the global userWallets registry by userId,
  // so Admin can credit any user, not just the currently logged-in user.
  const addWalletCredit = (userId: string, amount: number, reason: string) => {
    if (!userId || amount <= 0) return;
    const newTx = {
      id: 'wt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      amount,
      type: 'credit' as const,
      reason,
      date: new Date().toISOString(),
    };
    setUserWallets(prev => {
      const entry = prev[userId] ?? { balance: 0, transactions: [], welcomeGranted: false, rewardedBookingIds: [] };
      return {
        ...prev,
        [userId]: {
          ...entry,
          balance: entry.balance + amount,
          transactions: [newTx, ...entry.transactions],
        },
      };
    });
    // Show toast only if it's the currently logged-in user
    if (currentUser?.id === userId) {
      showToast(`+₹${amount} Aatral Cash added: ${reason}`, 'success');
    }
  };

  const deductWalletCredit = (userId: string, amount: number, reason: string) => {
    if (!userId || amount <= 0) return;
    setUserWallets(prev => {
      const entry = prev[userId] ?? { balance: 0, transactions: [], welcomeGranted: false, rewardedBookingIds: [] };
      const deductAmt = Math.min(amount, entry.balance); // never go below 0
      if (deductAmt <= 0) return prev;
      const newTx = {
        id: 'wt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        amount: deductAmt,
        type: 'debit' as const,
        reason,
        date: new Date().toISOString(),
      };
      return {
        ...prev,
        [userId]: {
          ...entry,
          balance: entry.balance - deductAmt,
          transactions: [newTx, ...entry.transactions],
        },
      };
    });
  };


  const loginUser = (role: UserRole, customUser?: Partial<UserProfile>) => {
    const base = DEMO_USERS[role];
    const updated: UserProfile = { ...base, ...customUser, role };
    setCurrentUser(updated);
    setCurrentRole(role);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    showToast(`Signed in successfully as ${updated.name}`, 'success');

    // Grant welcome bonus on first-ever login for this userId
    const userId = updated.id;
    const existingWallet = userWallets[userId];
    if (!existingWallet || !existingWallet.welcomeGranted) {
      const welcomeTx = {
        id: 'wt-welcome-' + Date.now(),
        amount: WELCOME_BONUS,
        type: 'credit' as const,
        reason: 'Welcome to AATRAL! 🎉',
        date: new Date().toISOString(),
      };
      setUserWallets(prev => {
        const entry = prev[userId] ?? { balance: 0, transactions: [], welcomeGranted: false, rewardedBookingIds: [] };
        return {
          ...prev,
          [userId]: {
            ...entry,
            balance: entry.balance + WELCOME_BONUS,
            transactions: [welcomeTx, ...entry.transactions],
            welcomeGranted: true,
          },
        };
      });
    }
  };


  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentRole('customer');
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    showToast('Signed out successfully.', 'info');
  };

  const updateUserVerification = (details: IdentityVerificationDetails) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        verificationDetails: details,
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
    if (currentRole === 'worker') {
      setWorkers((prev) =>
        prev.map((w) => {
          if (currentUser && (w.userId === currentUser.id || w.id === currentUser.id)) {
            return {
              ...w,
              verificationStatus: details.status === 'verified' ? 'verified' : w.verificationStatus,
              badge: details.status === 'verified' ? 'Certified Pro' : w.badge,
            };
          }
          return w;
        })
      );
    }
  };

  // ---------------- BOOKINGS ----------------
  const createBooking = (data: Partial<HouseholdBooking>): HouseholdBooking => {
    const bookingId = `bk-2026-${Date.now().toString().slice(-4)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const cat = categories.find((c) => c.id === data.serviceCategoryId) || categories[0];

    // Find best nearby available worker in society
    const availableWorkers = workers.filter(
      (w) => w.verificationStatus === 'verified' && (w.availability === 'available' || w.availability === 'offline')
    );
    const matchedWorker = availableWorkers[0] || workers[0];

    const newBooking: HouseholdBooking = {
      id: bookingId,
      bookingNumber: `CG-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name || 'Customer',
      customerPhone: currentUser.phone || '+91 98200 00000',
      customerAddress: data.customerAddress || currentUser.address || 'Flat 101, Civil Lines, New Delhi',
      serviceCategoryId: cat.id,
      serviceCategoryName: cat.name,
      subService: data.subService || cat.subCategories[0],
      issueDescription: data.issueDescription || 'Standard service request',
      isEmergency: data.isEmergency || false,
      scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTimeSlot: data.scheduledTimeSlot || (data.isEmergency ? 'Immediate (Express 30 Mins)' : '10:00 AM - 12:00 PM'),
      status: 'matched',
      assignedWorkerId: matchedWorker.id,
      assignedWorkerName: matchedWorker.name,
      assignedWorkerPhone: matchedWorker.phone,
      assignedWorkerPhoto: matchedWorker.avatar,
      assignedWorkerRating: matchedWorker.rating,
      assignedWorkerSociety: matchedWorker.societyName,
      societyId: matchedWorker.societyId,
      societyName: matchedWorker.societyName,
      estimatedPrice: data.estimatedPrice || cat.basePrice,
      finalPrice: data.finalPrice || cat.basePrice,
      paymentStatus: 'escrow_coop',
      paymentMethod: data.paymentMethod || 'UPI / Card',
      otpCode: randomOtp,
      workImagesBefore: data.workImagesBefore || [],
      workImagesAfter: [],
      chatMessages: [
        {
          id: `msg-${Date.now()}-1`,
          senderId: 'sys',
          senderName: 'AATRAL Automated Dispatch',
          senderRole: 'admin',
          text: `Booking confirmed! Cooperative verified worker ${matchedWorker.name} has been assigned from ${matchedWorker.societyName}.`,
          timestamp: 'Just now',
          isSystem: true,
        },
      ],
      timeline: [
        {
          status: 'requested',
          label: 'Booking Created',
          timestamp: 'Just now',
          description: 'Request registered in Cooperative Central Dispatch Ledger.',
          completed: true,
        },
        {
          status: 'matched',
          label: 'Allocated to Certified Worker',
          timestamp: 'Just now',
          description: `${matchedWorker.name} (${matchedWorker.badge}) allocated.`,
          completed: true,
        },
        {
          status: 'in_transit',
          label: 'Worker En Route',
          timestamp: 'Pending',
          description: 'Worker traveling with calibrated safety tools.',
          completed: false,
        },
        {
          status: 'in_progress',
          label: 'Service Active (OTP Security)',
          timestamp: 'Pending',
          description: 'Verified with OTP upon arrival.',
          completed: false,
        },
        {
          status: 'completed',
          label: 'Completed & Certified',
          timestamp: 'Pending',
          description: 'Direct wage settlement to worker with 30-day warranty.',
          completed: false,
        },
      ],
      location: {
        lat: 28.5355,
        lng: 77.2505,
        area: 'Greater Kailash II',
        city: selectedCity,
      },
      createdAt: new Date().toISOString(),
      ...data,
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking #${newBooking.bookingNumber} created and assigned to ${matchedWorker.name}!`, 'success');
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, extra?: Partial<HouseholdBooking>) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updatedTimeline = b.timeline.map((t) => {
            if (t.status === status) {
              return { ...t, completed: true, timestamp: 'Updated just now' };
            }
            return t;
          });
          return {
            ...b,
            status,
            timeline: updatedTimeline,
            ...extra,
          };
        }
        return b;
      })
    );
    showToast(`Booking status updated to ${status.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const addChatMessage = (bookingId: string, text: string, senderRole: UserRole) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            chatMessages: [...b.chatMessages, newMessage],
          };
        }
        return b;
      })
    );
  };

  const rateBooking = (bookingId: string, rating: number, reviewText: string) => {
    let bookingToReward: HouseholdBooking | undefined;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          bookingToReward = b;
          return {
            ...b,
            rating,
            reviewText,
            reviewDate: new Date().toISOString().split('T')[0],
          };
        }
        return b;
      })
    );
    showToast('Thank you for rating your cooperative worker!', 'success');

    // Grant 5% completion reward — idempotent (check rewardedBookingIds)
    if (bookingToReward && currentUser) {
      const customerId = bookingToReward.customerId;
      const wallet = userWallets[customerId] ?? { balance: 0, transactions: [], welcomeGranted: false, rewardedBookingIds: [] };
      if (!wallet.rewardedBookingIds.includes(bookingId)) {
        const rewardAmt = Math.max(1, Math.round((bookingToReward.finalPrice || bookingToReward.estimatedPrice) * COMPLETION_REWARD_PCT));
        const rewardTx = {
          id: 'wt-reward-' + Date.now(),
          amount: rewardAmt,
          type: 'credit' as const,
          reason: `Service Reward: ${bookingToReward.bookingNumber} (${Math.round(COMPLETION_REWARD_PCT * 100)}% cashback)`,
          date: new Date().toISOString(),
        };
        setUserWallets(prev => {
          const entry = prev[customerId] ?? { balance: 0, transactions: [], welcomeGranted: false, rewardedBookingIds: [] };
          return {
            ...prev,
            [customerId]: {
              ...entry,
              balance: entry.balance + rewardAmt,
              transactions: [rewardTx, ...entry.transactions],
              rewardedBookingIds: [...entry.rewardedBookingIds, bookingId],
            },
          };
        });
        if (currentUser.id === customerId) {
          showToast(`+₹${rewardAmt} Aatral Cash reward for completing ${bookingToReward.bookingNumber}!`, 'success');
        }
      }
    }
  };


  const cancelBooking = (bookingId: string, reason?: string) => {
    let walletUsedAmt = 0;
    let customerId = '';
    let bookingNumber = '';
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          walletUsedAmt = b.walletUsedAmount || 0;
          customerId = b.customerId;
          bookingNumber = b.bookingNumber;
          return {
            ...b,
            status: 'cancelled',
            cancellationReason: reason || 'Customer request',
            chatMessages: [
              ...b.chatMessages,
              {
                id: `msg-${Date.now()}`,
                senderId: 'sys',
                senderName: 'System',
                senderRole: 'admin' as const,
                text: `Booking cancelled. Reason: ${reason || 'Customer request'}. Escrow refunded.`,
                timestamp: 'Just now',
                isSystem: true,
              },
            ],
          };
        }
        return b;
      })
    );
    // Refund wallet amount if customer had used Aatral Cash
    if (walletUsedAmt > 0 && customerId) {
      addWalletCredit(customerId, walletUsedAmt, `Refund: Booking #${bookingNumber} cancelled`);
    }
    showToast('Booking has been cancelled and escrow refunded.', 'info');
  };


  // ---------------- WORK ORDERS ----------------
  const createWorkOrder = (data: Partial<InstitutionalWorkOrder>): InstitutionalWorkOrder => {
    const orderId = `wo-2026-${Date.now().toString().slice(-4)}`;
    const cat = categories.find((c) => c.id === data.serviceCategoryId) || categories[0];
    const targetSociety = organizations.find((o) => o.type === 'primary_society') || organizations[2];

    const newOrder: InstitutionalWorkOrder = {
      id: orderId,
      orderNumber: `WO-${data.institutionName ? data.institutionName.slice(0, 4).toUpperCase() : 'INST'}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      institutionId: currentUser.id,
      institutionName: data.institutionName || currentUser.institutionName || 'Institutional Client',
      institutionType: (data.institutionType as any) || 'Government Dept',
      contactPerson: data.contactPerson || currentUser.name,
      contactPhone: data.contactPhone || currentUser.phone,
      contactEmail: data.contactEmail || currentUser.email,
      projectTitle: data.projectTitle || 'Institutional Facility Maintenance Order',
      projectDescription: data.projectDescription || 'Comprehensive service contract by certified cooperative workforce.',
      serviceCategoryId: cat.id,
      serviceCategoryName: cat.name,
      projectLocation: data.projectLocation || 'Central Administrative Campus',
      city: selectedCity,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      estimatedDays: data.estimatedDays || 15,
      totalWorkersRequired: data.totalWorkersRequired || 10,
      assignedWorkers: [],
      status: 'submitted',
      budgetTotal: data.budgetTotal || 250000,
      dailyWagePerWorker: data.dailyWagePerWorker || 1800,
      cooperativeCommissionPercent: 5,
      welfareContributionPerWorker: 50,
      milestones: [
        {
          id: `ms-${Date.now()}-1`,
          title: 'Site Safety Audit & Material Readiness',
          targetDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          payoutAmount: (data.budgetTotal || 250000) * 0.3,
          completionPercent: 0,
        },
        {
          id: `ms-${Date.now()}-2`,
          title: 'Core Execution & Mid-Term Inspection',
          targetDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          payoutAmount: (data.budgetTotal || 250000) * 0.4,
          completionPercent: 0,
        },
        {
          id: `ms-${Date.now()}-3`,
          title: 'Final Testing, Handover & Completion Sign-Off',
          targetDate: data.endDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          status: 'pending',
          payoutAmount: (data.budgetTotal || 250000) * 0.3,
          completionPercent: 0,
        },
      ],
      attendance: [],
      billingStatus: 'unbilled',
      societyId: targetSociety.id,
      societyName: targetSociety.name,
      createdAt: new Date().toISOString(),
      ...data,
    };

    setWorkOrders((prev) => [newOrder, ...prev]);
    showToast(`Work Order #${newOrder.orderNumber} submitted to Cooperative Federation!`, 'success');
    return newOrder;
  };

  const updateWorkOrderStatus = (workOrderId: string, status: WorkOrderStatus) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          return { ...wo, status };
        }
        return wo;
      })
    );
    showToast(`Work Order updated to ${status.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const assignWorkersToWorkOrder = (workOrderId: string, workerIds: string[]) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          const newAssigned = workerIds.map((wId) => {
            const worker = workers.find((w) => w.id === wId);
            return {
              workerId: wId,
              workerName: worker ? worker.name : 'Cooperative Worker',
              workerAvatar: worker?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
              phone: worker?.phone || '+91 98000 00000',
              skillName: worker?.skills[0]?.name || 'Certified Specialist',
              skillLevel: worker?.skills[0]?.skillLevel || 'Skilled',
              rating: worker?.rating || 4.8,
              assignedDate: new Date().toISOString().split('T')[0],
              status: 'assigned' as const,
              dailyWage: wo.dailyWagePerWorker || 1800,
              attendanceDaysCount: 0,
            };
          });

          // Merge without duplicates
          const existingIds = new Set(wo.assignedWorkers.map((aw) => aw.workerId));
          const filteredNew = newAssigned.filter((a) => !existingIds.has(a.workerId));
          const totalAssigned = [...wo.assignedWorkers, ...filteredNew];

          const newStatus: WorkOrderStatus =
            totalAssigned.length >= wo.totalWorkersRequired
              ? 'fully_assigned'
              : totalAssigned.length > 0
              ? 'partially_assigned'
              : wo.status;

          return {
            ...wo,
            assignedWorkers: totalAssigned,
            status: newStatus,
          };
        }
        return wo;
      })
    );
    showToast(`Assigned ${workerIds.length} worker(s) to Work Order`, 'success');
  };

  const removeWorkerFromWorkOrder = (workOrderId: string, workerId: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          const remaining = wo.assignedWorkers.filter((a) => a.workerId !== workerId);
          const newStatus: WorkOrderStatus =
            remaining.length === 0
              ? 'planning'
              : remaining.length < wo.totalWorkersRequired
              ? 'partially_assigned'
              : 'fully_assigned';

          return {
            ...wo,
            assignedWorkers: remaining,
            status: newStatus,
          };
        }
        return wo;
      })
    );
    showToast('Worker reallocated/removed from work order', 'info');
  };

  const verifyMilestone = (workOrderId: string, milestoneId: string, verifierName: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          const updatedMilestones = wo.milestones.map((ms) => {
            if (ms.id === milestoneId) {
              return {
                ...ms,
                status: 'verified' as const,
                completionPercent: 100,
                verifiedByAdmin: verifierName,
              };
            }
            return ms;
          });
          return {
            ...wo,
            milestones: updatedMilestones,
          };
        }
        return wo;
      })
    );
    showToast('Milestone successfully verified & approved for escrow release', 'success');
  };

  const recordAttendance = (workOrderId: string, workerId: string, date: string, status: 'present' | 'absent' | 'half_day') => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          const worker = wo.assignedWorkers.find((w) => w.workerId === workerId);
          const newRecord = {
            date,
            workerId,
            workerName: worker?.workerName || 'Worker',
            status,
            checkInTime: '08:00 AM',
            checkOutTime: '05:00 PM',
            verifiedBySiteSupervisor: true,
          };
          return {
            ...wo,
            attendance: [newRecord, ...wo.attendance.filter((a) => !(a.date === date && a.workerId === workerId))],
          };
        }
        return wo;
      })
    );
    showToast(`Biometric/site attendance recorded for ${date}`, 'success');
  };

  const submitInstitutionFeedback = (workOrderId: string, rating: number, comment: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          return {
            ...wo,
            feedback: {
              rating,
              comment,
              verifiedBy: currentUser.name,
              date: new Date().toISOString().split('T')[0],
            },
          };
        }
        return wo;
      })
    );
    showToast('Institutional project rating and satisfaction audit submitted!', 'success');
  };

  // ---------------- WORKER ACTIONS ----------------
  const verifyWorker = (workerId: string, approved: boolean, badge: Worker['badge'] = 'Certified Pro', notes?: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const newStatus = approved ? 'verified' : 'rejected';
          const updatedSkills = w.skills.map((s) => ({
            ...s,
            verifiedByCoop: approved,
            verifiedDate: approved ? new Date().toISOString().split('T')[0] : undefined,
          }));
          return {
            ...w,
            verificationStatus: newStatus,
            badge: approved ? badge : 'Apprentice',
            skills: updatedSkills,
          };
        }
        return w;
      })
    );
    showToast(
      approved
        ? `Worker successfully verified with Cooperative Registry Seal (#${badge})!`
        : `Worker verification rejected: ${notes || 'Documentation discrepancy'}`,
      approved ? 'success' : 'warning'
    );
  };

  const registerWorker = (data: Partial<Worker>): Worker => {
    const newId = `wrk-${Date.now().toString().slice(-4)}`;
    const soc = organizations.find((o) => o.id === data.societyId) || organizations[2];

    const newWorker: Worker = {
      id: newId,
      userId: `usr-${newId}`,
      name: data.name || 'New Member',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      phone: data.phone || '+91 98000 11223',
      email: data.email || 'worker@aatral.org',
      societyId: soc.id,
      societyName: soc.name,
      federationName: 'Metropolitan Skilled Workers District Cooperative Union',
      memberId: `${soc.code.slice(0, 3)}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending',
      badge: 'Apprentice',
      skills: data.skills || [
        {
          id: `sk-${Date.now()}`,
          name: 'General Service Technician',
          category: 'Electrical & Electronics',
          experienceYears: 2,
          skillLevel: 'Beginner',
          certName: 'Provisional Trade Application',
          certIssuer: 'State Vocational Board',
          certNumber: `VTC-${Math.floor(1000 + Math.random() * 9000)}`,
          verifiedByCoop: false,
        },
      ],
      hourlyRate: data.hourlyRate || 250,
      dailyRate: data.dailyRate || 1400,
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      location: data.location || {
        lat: 28.5355,
        lng: 77.2505,
        address: 'South Delhi Sector',
        area: 'Kalkaji',
        city: selectedCity,
      },
      availability: 'offline',
      currentWorkloadScore: 0,
      welfareRecords: [],
      insurance: {
        policyNumber: `PROV-SURAKSHA-${Math.floor(1000 + Math.random() * 9000)}`,
        schemeName: 'Labour Welfare Group Accident & Health Shield (Provisional)',
        providerName: 'United India Insurance',
        coverageAmount: 200000,
        validTill: '2027-03-31',
        nomineeName: 'Family Nominee',
        nomineeRelation: 'Spouse',
        status: 'active',
        lastPremiumPaidByCoop: 'Enrolled via Cooperative Onboarding Fund',
      },
      trainings: [],
      bankAccount: {
        bankName: 'Delhi State Cooperative Bank',
        accountNumberMasked: '•••• •••• 7711',
        ifsc: 'DSCB0001004',
      },
      earnings: {
        today: 0,
        thisMonth: 0,
        total: 0,
        pendingPayout: 0,
        welfareContribution: 0,
      },
      ...data,
    };

    setWorkers((prev) => [newWorker, ...prev]);
    showToast(`New worker ${newWorker.name} enrolled into ${soc.name}! Awaiting society verification.`, 'success');
    return newWorker;
  };

  const updateWorkerAvailability = (workerId: string, status: WorkerAvailability) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return { ...w, availability: status };
        }
        return w;
      })
    );
    showToast(`Availability set to ${status.toUpperCase()}`, 'info');
  };

  const rebalanceWorker = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return { ...w, currentWorkloadScore: Math.max(w.currentWorkloadScore, 50) };
        }
        return w;
      })
    );
    showToast(`Prioritized worker for incoming express bookings and enterprise tenders.`, 'success');
  };

  const rebalanceWorkforce = () => {
    setWorkers((prev) => {
      let count = 0;
      const next = prev.map((w) => {
        if (w.verificationStatus === 'verified' && w.currentWorkloadScore <= 35) {
          count++;
          return { ...w, currentWorkloadScore: Math.max(w.currentWorkloadScore, 50) };
        }
        return w;
      });
      setTimeout(() => {
        showToast(`Auto-balanced workforce roster: ${count} underutilized workers prioritized for upcoming dispatch.`, 'success');
      }, 100);
      return next;
    });
  };

  const addWelfareClaim = (
    workerId: string,
    claimData: Omit<WelfareRecord, 'id' | 'workerId' | 'workerName' | 'referenceNo' | 'status'>
  ) => {
    const worker = workers.find((w) => w.id === workerId);
    const newClaim: WelfareRecord = {
      id: `welf-${Date.now()}`,
      workerId,
      workerName: worker?.name || 'Worker',
      type: claimData.type,
      title: claimData.title,
      amount: claimData.amount,
      date: new Date().toISOString().split('T')[0],
      status: 'under_review',
      referenceNo: `WLF-${claimData.type.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      notes: claimData.notes,
    };

    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            welfareRecords: [newClaim, ...w.welfareRecords],
          };
        }
        return w;
      })
    );
    showToast(`Welfare claim #${newClaim.referenceNo} for ₹${claimData.amount} submitted to Society Welfare Committee`, 'success');
  };

  const approveWelfareClaim = (claimId: string, approved: boolean) => {
    setWorkers((prev) =>
      prev.map((w) => {
        const updatedRecords = w.welfareRecords.map((r) => {
          if (r.id === claimId) {
            return {
              ...r,
              status: approved ? ('approved' as const) : ('rejected' as const),
            };
          }
          return r;
        });
        return {
          ...w,
          welfareRecords: updatedRecords,
        };
      })
    );
    showToast(`Welfare claim ${approved ? 'APPROVED for disbursement' : 'REJECTED with committee notes'}`, approved ? 'success' : 'warning');
  };

  // ---------------- ORGANIZATIONS ----------------
  const addOrganization = (orgData: Partial<CooperativeOrg>): CooperativeOrg => {
    const newOrg: CooperativeOrg = {
      id: `org-${Date.now()}`,
      name: orgData.name || 'New Labour Cooperative Society',
      type: orgData.type || 'primary_society',
      parentOrgId: orgData.parentOrgId || 'org-union-1',
      code: `SOC-${Math.floor(100 + Math.random() * 900)}`,
      registrationNumber: `REG/COOP/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      district: orgData.district || 'South Delhi',
      state: 'Delhi NCR',
      contactPerson: orgData.contactPerson || 'Secretary in Charge',
      contactPhone: orgData.contactPhone || '+91 98000 00000',
      contactEmail: orgData.contactEmail || 'contact@newcoop.org',
      workerCount: 0,
      activeOrdersCount: 0,
      welfareFundBalance: 100000,
      verificationAuthority: 'National Skill Development Council (NSDC)',
      establishedYear: new Date().getFullYear(),
      address: orgData.address || 'Cooperative Office Complex',
      ...orgData,
    };

    setOrganizations((prev) => [...prev, newOrg]);
    showToast(`Cooperative Entity '${newOrg.name}' registered in Federation Tree!`, 'success');
    return newOrg;
  };

  // ---------------- COMPLAINTS ----------------
  const raiseComplaint = (data: Partial<Complaint>): Complaint => {
    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      ticketNo: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      raisedByRole: currentRole,
      raisedById: currentUser.id,
      raisedByName: currentUser.name,
      raisedByPhone: currentUser.phone,
      targetType: data.targetType || 'booking',
      targetId: data.targetId || 'general',
      targetName: data.targetName || 'General Grievance',
      subject: data.subject || 'Service Grievance',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
      ...data,
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    showToast(`Grievance Ticket #${newComplaint.ticketNo} registered. Society Ombudsman notified.`, 'info');
    return newComplaint;
  };

  const resolveComplaint = (complaintId: string, resolutionNotes: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'resolved',
            resolutionNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    showToast('Complaint marked as resolved with cooperative mediation notes.', 'success');
  };

  const updateWorkerSafetyStatus = (workerId: string, status: 'active' | 'suspension_review' | 'disciplinary_review' | 'suspended', notes: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          return { ...w, safetyStatus: status };
        }
        return w;
      })
    );
    showToast(`Worker ${status.replace('_', ' ')} status updated. Notes: ${notes}`, 'warning');
  };

  const resolveComplaintOutcome = (complaintId: string, outcome: 'upheld' | 'dismissed', adminNotes: string) => {
    let targetWorkerId = null;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          if (c.targetType === 'worker') {
            targetWorkerId = c.targetId;
          }
          return {
            ...c,
            status: 'resolved',
            outcome,
            adminNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    if (targetWorkerId && outcome === 'upheld') {
      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id === targetWorkerId) {
            const newCount = (w.upheldComplaintsCount || 0) + 1;
            let newStatus = w.safetyStatus || 'active';
            if (newCount >= 5) {
              newStatus = 'disciplinary_review';
            } else if (newCount >= 3) {
              newStatus = 'suspension_review';
            }
            return {
              ...w,
              upheldComplaintsCount: newCount,
              safetyStatus: newStatus,
            };
          }
          return w;
        })
      );
    }
    
    showToast(`Complaint marked as ${outcome}`, outcome === 'upheld' ? 'error' : 'success');
  };

  // ---------------- AI DEMAND & ALLOCATION TOOLS ----------------
  const getAIRecommendations = (categoryOrSkill: string, targetLocation: string = 'South Delhi'): AIAllocationRecommendation => {
    const matchedWorkers = workers
      .filter((w) => w.verificationStatus === 'verified')
      .map((w, idx) => {
        // Calculate dynamic fitness score
        const hasDirectSkill = w.skills.some(
          (s) =>
            s.category.toLowerCase().includes(categoryOrSkill.toLowerCase()) ||
            s.name.toLowerCase().includes(categoryOrSkill.toLowerCase())
        );
        const skillScore = hasDirectSkill ? 40 : 20;
        const ratingScore = (w.rating / 5.0) * 30;
        const workloadScore = (1 - w.currentWorkloadScore / 100) * 20;
        const experienceScore = Math.min(w.skills[0]?.experienceYears || 2, 10);
        const totalFit = Math.min(99, Math.round(skillScore + ratingScore + workloadScore + experienceScore));
        const fakeDistance = (1.2 + idx * 0.9).toFixed(1);

        return {
          workerId: w.id,
          workerName: w.name,
          skillMatchScore: totalFit,
          distanceKm: parseFloat(fakeDistance),
          rating: w.rating,
          experienceYears: w.skills[0]?.experienceYears || 4,
          currentWorkload: w.currentWorkloadScore,
          matchReason: hasDirectSkill
            ? `Verified ${w.badge} • ${w.skills[0]?.experienceYears} yrs experience • Low fatigue score (${w.currentWorkloadScore}%) • ${fakeDistance} km proximity`
            : `Cross-trained in complementary trade • Strong 4.8+ track record in ${targetLocation}`,
          fitRank: idx + 1,
        };
      })
      .sort((a, b) => b.skillMatchScore - a.skillMatchScore);

    return {
      recommendedWorkers: matchedWorkers,
      allocationRationale: `AATRAL AI Optimization Engine matched ${matchedWorkers.length} certified cooperative guild members balancing travel proximity, verified NCVT/HSSC certification, and workload anti-fatigue fairness.`,
      estimatedEfficiencyGain: '34% faster turnaround & 28% lower travel carbon footprint',
    };
  };

  const generateAIDemandForecast = async (area: string, category: string): Promise<AIDemandForecast> => {
    try {
      const response = await fetch('http://localhost:8000/predict-demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: area.replace(' Zone', '').replace(' District', ''), service_type: category })
      });
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (e) {
      console.warn("Failed to fetch from ML service, falling back to local mock", e);
      const existing = demandForecasts.find(
        (f) => f.area.toLowerCase().includes(area.toLowerCase()) || f.serviceCategory.toLowerCase().includes(category.toLowerCase())
      );
      if (existing) {
        return {
          ...existing,
          category: existing.serviceCategory,
          predictedDemandMultiplier: `${Math.round((existing.predictedDemandIndex / (existing.historicalDemandIndex || 1)) * 100) / 100}x (${existing.seasonalFactor.split(' ')[0] || '+45%'})`,
          reasons: [
            existing.demandSpikeReason,
            existing.seasonalFactor,
            `Historical index baseline at ${existing.historicalDemandIndex} projecting surge to ${existing.predictedDemandIndex} in ${existing.area}`,
          ],
          recommendedActions: [
            `Mobilize ${existing.suggestedWorkerCount} standby verified artisans from affiliated primary societies`,
            'Pre-allocate safety tooling buffer and emergency dispatch vehicle kits',
            'Issue proactive advisory to registered institutional facility managers',
          ],
        };
      }

      return {
        area: `${area} Zone`,
        serviceCategory: category,
        category: category,
        period: 'Next 14 Days',
        historicalDemandIndex: 70,
        predictedDemandIndex: 105,
        confidenceScore: 91,
        suggestedWorkerCount: 28,
        seasonalFactor: '+40% Projected Peak based on Local Climatic & Seasonal Work Orders',
        demandSpikeReason: `Projected rise in ${category} requests due to institutional budget cycles and seasonal weather shifts.`,
        predictedDemandMultiplier: '1.5x (+40% Surge)',
        reasons: [
          `Projected rise in ${category} requests due to institutional budget cycles and seasonal weather shifts.`,
          '+40% Projected Peak based on Local Climatic & Seasonal Work Orders',
          'Increased demand across residential and commercial sectors in peak hours.',
        ],
        recommendedActions: [
          'Mobilize 28 standby certified technicians from local primary societies',
          'Issue advance callout reminders for high-demand skill categories',
          'Pre-allocate essential trade consumables and inspection kits',
        ],
        chartData: [
          { date: 'Day 1', historical: 60, predicted: 62 },
          { date: 'Day 3', historical: 65, predicted: 70 },
          { date: 'Day 5', historical: 68, predicted: 78 },
          { date: 'Day 7', historical: 72, predicted: 88 },
          { date: 'Day 9', historical: 76, predicted: 94 },
          { date: 'Day 11', historical: 80, predicted: 102 },
          { date: 'Day 14', historical: 84, predicted: 115 },
        ],
      };
    }
  };

  const assignWorkersToOrder = assignWorkersToWorkOrder;
  const approveWelfareRecord = (workerId: string, recordId: string) => approveWelfareClaim(recordId, true);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        selectedCity,
        setSelectedCity,
        loginUser,
        apprenticeships,
        recordApprenticeJob,
        submitApprenticeEvaluation,
        adminValidateApprentice,
        assignMentor,
        addWalletCredit,
        deductWalletCredit,
        getUserWallet,
        userWallets,

        logoutUser,
        updateUserVerification,
        currentLanguage,
        setLanguage,
        t,
        savedAddresses,
        activeAddress,
        setActiveAddress,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        userLocation,
        detectGpsLocation,
        categories,
        workers,
        bookings,
        workOrders,
        organizations,
        complaints,
        demandForecasts,
        allocationConfig,
        updateAllocationConfig,
        assignWorkersToOrder,
        approveWelfareRecord,
        createBooking,
        updateBookingStatus,
        addChatMessage,
        rateBooking,
        cancelBooking,
        createWorkOrder,
        updateWorkOrderStatus,
        assignWorkersToWorkOrder,
        removeWorkerFromWorkOrder,
        verifyMilestone,
        recordAttendance,
        submitInstitutionFeedback,
        verifyWorker,
        registerWorker,
        updateWorkerAvailability,
        rebalanceWorker,
        rebalanceWorkforce,
        addWelfareClaim,
        approveWelfareClaim,
        addOrganization,
        raiseComplaint,
        resolveComplaint,
        resolveComplaintOutcome,
        updateWorkerSafetyStatus,
        getAIRecommendations,
        generateAIDemandForecast,
        toastMessage,
        showToast,
        emergencyContacts,
        addEmergencyContact,
        updateEmergencyContact,
        removeEmergencyContact,
        sosAlerts,
        triggerSOS,
        triggerWorkerSOS,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

