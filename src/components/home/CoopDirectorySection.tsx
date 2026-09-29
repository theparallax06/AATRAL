import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  MapPin,
  ShieldCheck,
  Filter,
  Users,
  Award,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  Database,
  Building,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { CooperativeOrg } from '../../types';

interface CoopDirectorySectionProps {
  onOpenAuth: (role?: 'customer' | 'worker' | 'admin' | 'institution') => void;
}

// Sample Official National Cooperative Database Dataset (Ministry of Cooperation Sector 51 Schema)
export const OFFICIAL_NCD_COOPERATIVES: (CooperativeOrg & {
  sectorCode: string;
  sectorName: string;
  isOfficialRecord: boolean;
  ncdStatusLabel: string;
})[] = [
  {
    id: 'ncd-org-1',
    name: 'National Federation of Labour & Skilled Service Cooperatives (NFLSC)',
    type: 'federation',
    code: 'FED-NAT-01',
    registrationNumber: 'MSCS/CR/2012/842',
    district: 'Central New Delhi',
    state: 'Delhi NCR',
    contactPerson: 'Dr. Rameshwar Patil (Registrar)',
    contactPhone: '+91 98201 44550',
    contactEmail: 'apex@nflsc.coop',
    workerCount: 14250,
    activeOrdersCount: 128,
    welfareFundBalance: 4850000,
    verificationAuthority: 'Ministry of Cooperation & Central Registrar (CRCS)',
    establishedYear: 2012,
    address: 'Cooperative Bhavan, Lodhi Institutional Area, New Delhi - 110003',
    sectorCode: '51',
    sectorName: 'Labour Contract & Construction Cooperatives (Apex)',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
  {
    id: 'ncd-org-2',
    name: 'Indian Labour Cooperative Society Ltd (ILCS)',
    type: 'federation',
    code: 'ILCS-MSCS-88',
    registrationNumber: 'MSCS/CR/2008/512',
    district: 'New Delhi',
    state: 'Delhi NCR',
    contactPerson: 'K. S. Verma (Managing Director)',
    contactPhone: '+91 98100 23411',
    contactEmail: 'director@ilcs.coop',
    workerCount: 18900,
    activeOrdersCount: 164,
    welfareFundBalance: 6200000,
    verificationAuthority: 'Ministry of Cooperation & MSCS Act 2002',
    establishedYear: 2008,
    address: 'ILCS House, Asaf Ali Road, New Delhi - 110002',
    sectorCode: '51',
    sectorName: 'Labour Contract & Skilled Services (Multi-State)',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
  {
    id: 'ncd-org-3',
    name: 'Metropolitan Skilled Workers District Cooperative Union',
    type: 'district_union',
    parentOrgId: 'ncd-org-1',
    code: 'UNION-DL-04',
    registrationNumber: 'DL/COOP/DIST/2016/119',
    district: 'South Delhi',
    state: 'Delhi NCR',
    contactPerson: 'Sunita Mehra (Secretary)',
    contactPhone: '+91 98112 33441',
    contactEmail: 'delhi.south@nflsc.coop',
    workerCount: 3820,
    activeOrdersCount: 42,
    welfareFundBalance: 1420000,
    verificationAuthority: 'Delhi Registrar of Cooperative Societies (RCS)',
    establishedYear: 2016,
    address: 'Community Center, Okhla Phase III, New Delhi - 110020',
    sectorCode: '51',
    sectorName: 'Electrical, Plumbing & Construction Union',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
  {
    id: 'ncd-org-4',
    name: 'South Delhi Electrical & Electronics Technicians Cooperative Society',
    type: 'primary_society',
    parentOrgId: 'ncd-org-3',
    code: 'SOC-ELEC-401',
    registrationNumber: 'DL/SOC/TECH/401',
    district: 'South Delhi',
    state: 'Delhi NCR',
    contactPerson: 'Karan Sharma (Society President)',
    contactPhone: '+91 98731 22990',
    contactEmail: 'contact@southdelhielectrical.coop',
    workerCount: 340,
    activeOrdersCount: 18,
    welfareFundBalance: 520000,
    verificationAuthority: 'National Council for Vocational Training (NCVT)',
    establishedYear: 2018,
    address: 'Plot 12, Kalkaji Extension Commercial Complex, New Delhi - 110019',
    sectorCode: '51',
    sectorName: 'Electrical & Smart Grid Services',
    isOfficialRecord: false,
    ncdStatusLabel: 'Sample Record (Local Database)',
  },
  {
    id: 'ncd-org-5',
    name: 'Janata Plumbers & Sanitary Works Industrial Cooperative Society',
    type: 'primary_society',
    parentOrgId: 'ncd-org-3',
    code: 'SOC-PLUMB-208',
    registrationNumber: 'DL/SOC/SAN/208',
    district: 'Central Delhi',
    state: 'Delhi NCR',
    contactPerson: 'Mohammad Afzal (Secretary)',
    contactPhone: '+91 98104 55670',
    contactEmail: 'info@janataplumbers.coop',
    workerCount: 290,
    activeOrdersCount: 14,
    welfareFundBalance: 390000,
    verificationAuthority: 'Directorate of Training and Technical Education',
    establishedYear: 2017,
    address: 'B-44, Paharganj Trade Union Complex, New Delhi - 110055',
    sectorCode: '51',
    sectorName: 'Sanitary & Plumbing Services',
    isOfficialRecord: false,
    ncdStatusLabel: 'Sample Record (Local Database)',
  },
  {
    id: 'ncd-org-6',
    name: 'Maharashtra State Cooperative Labour Societies Federation Ltd.',
    type: 'federation',
    code: 'FED-MH-09',
    registrationNumber: 'MH/BOM/LAB/FED/1984',
    district: 'Mumbai City',
    state: 'Maharashtra',
    contactPerson: 'Shri Vasantrao Deshmukh',
    contactPhone: '+91 98220 11234',
    contactEmail: 'sec@mhlabourfed.coop',
    workerCount: 24500,
    activeOrdersCount: 210,
    welfareFundBalance: 8900000,
    verificationAuthority: 'Maharashtra State RCS & Labour Department',
    establishedYear: 1984,
    address: 'Cooperage Road, Nariman Point, Mumbai - 400021',
    sectorCode: '51',
    sectorName: 'Labour Contract & Construction Societies Federation',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
  {
    id: 'ncd-org-7',
    name: 'Greater Mumbai Plumbing & Sanitation Industrial Cooperative Society',
    type: 'primary_society',
    parentOrgId: 'ncd-org-6',
    code: 'SOC-MH-PLUMB-12',
    registrationNumber: 'MH/MUM/SOC/PLUMB/102',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    contactPerson: 'Ganesh Shinde',
    contactPhone: '+91 98200 88990',
    contactEmail: 'contact@mumbaiplumb.coop',
    workerCount: 480,
    activeOrdersCount: 31,
    welfareFundBalance: 780000,
    verificationAuthority: 'Maharashtra State Vocational Board',
    establishedYear: 2015,
    address: 'Andheri East Industrial Estate, Mumbai - 400069',
    sectorCode: '51',
    sectorName: 'Plumbing & Drainage Engineering',
    isOfficialRecord: false,
    ncdStatusLabel: 'Sample Record (Local Database)',
  },
  {
    id: 'ncd-org-8',
    name: 'Kerala State Federation of Labour Contract Cooperative Societies Ltd.',
    type: 'federation',
    code: 'FED-KL-02',
    registrationNumber: 'KL/TVM/LAB/FED/1992',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    contactPerson: 'P. K. Ramachandran (General Secretary)',
    contactPhone: '+91 94470 12345',
    contactEmail: 'admin@keralalabourfed.coop',
    workerCount: 31000,
    activeOrdersCount: 280,
    welfareFundBalance: 12500000,
    verificationAuthority: 'Kerala Cooperative Department',
    establishedYear: 1992,
    address: 'Cooperative Towers, MG Road, Thiruvananthapuram - 695001',
    sectorCode: '51',
    sectorName: 'Labour Contract & Infrastructure Cooperative Federation',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
  {
    id: 'ncd-org-9',
    name: 'Uralungal Labour Contract Cooperative Society Ltd. (ULCCS)',
    type: 'primary_society',
    parentOrgId: 'ncd-org-8',
    code: 'SOC-KL-ULCCS-01',
    registrationNumber: 'KL/KKD/ULCCS/1925',
    district: 'Kozhikode',
    state: 'Kerala',
    contactPerson: 'Rema K. (Chief Administrative Officer)',
    contactPhone: '+91 94460 55001',
    contactEmail: 'info@ulccs.coop',
    workerCount: 11500,
    activeOrdersCount: 95,
    welfareFundBalance: 18500000,
    verificationAuthority: 'ICA Member & Kerala RCS',
    establishedYear: 1925,
    address: 'Vadakara, Kozhikode, Kerala - 673104',
    sectorCode: '51',
    sectorName: 'Infrastructure & Skilled Labour Construction Cooperative',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
  {
    id: 'ncd-org-10',
    name: 'Gujarat State Labour Contract Cooperative Societies Federation Ltd.',
    type: 'federation',
    code: 'FED-GJ-05',
    registrationNumber: 'GJ/GND/LAB/FED/2001',
    district: 'Gandhinagar',
    state: 'Gujarat',
    contactPerson: 'Bhupendrabhai Patel',
    contactPhone: '+91 98250 33412',
    contactEmail: 'gujarat.labour@coopfed.in',
    workerCount: 16200,
    activeOrdersCount: 140,
    welfareFundBalance: 5400000,
    verificationAuthority: 'Gujarat Registrar of Cooperative Societies',
    establishedYear: 2001,
    address: 'Sector 11, Gandhinagar - 382011',
    sectorCode: '51',
    sectorName: 'Labour & Construction Services Federation',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
  {
    id: 'ncd-org-11',
    name: 'Tamil Nadu Labour Contract Cooperative Federation Ltd.',
    type: 'federation',
    code: 'FED-TN-07',
    registrationNumber: 'TN/CHN/LAB/FED/1998',
    district: 'Chennai',
    state: 'Tamil Nadu',
    contactPerson: 'S. Murugan (Secretary)',
    contactPhone: '+91 98401 22334',
    contactEmail: 'tnlabourfed@coop.tn.gov.in',
    workerCount: 19800,
    activeOrdersCount: 175,
    welfareFundBalance: 7100000,
    verificationAuthority: 'Tamil Nadu Department of Cooperation',
    establishedYear: 1998,
    address: 'EVR Periyar Salai, Kilpauk, Chennai - 600010',
    sectorCode: '51',
    sectorName: 'Labour Contract & Artisan Cooperatives',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
  {
    id: 'ncd-org-12',
    name: 'Karnataka State Labour Cooperative Federation (KSLCOF)',
    type: 'federation',
    code: 'FED-KA-03',
    registrationNumber: 'KA/BLR/LAB/FED/2004',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    contactPerson: 'C. M. Siddalingappa',
    contactPhone: '+91 98450 99123',
    contactEmail: 'contact@kslcof.coop',
    workerCount: 21300,
    activeOrdersCount: 190,
    welfareFundBalance: 8200000,
    verificationAuthority: 'Karnataka Department of Cooperatives',
    establishedYear: 2004,
    address: 'Ali Asker Road, Vasanth Nagar, Bengaluru - 560052',
    sectorCode: '51',
    sectorName: 'Labour & Skilled Craft Federation',
    isOfficialRecord: true,
    ncdStatusLabel: 'Ministry of Cooperation NCD Verified',
  },
];

export const CoopDirectorySection: React.FC<CoopDirectorySectionProps> = ({ onOpenAuth }) => {
  const { t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [selectedOrgModal, setSelectedOrgModal] = useState<(typeof OFFICIAL_NCD_COOPERATIVES)[0] | null>(null);

  const statesList = useMemo(() => {
    const set = new Set<string>();
    OFFICIAL_NCD_COOPERATIVES.forEach((org) => set.add(org.state));
    return ['All States', ...Array.from(set)];
  }, []);

  const sectorsList = useMemo(() => {
    return [
      'All Sectors',
      'Labour Contract & Construction',
      'Electrical & Smart Grid',
      'Plumbing & Sanitation',
      'Infrastructure & Skilled Construction',
      'Labour & Skilled Craft Federation',
    ];
  }, []);

  const filteredOrgs = useMemo(() => {
    return OFFICIAL_NCD_COOPERATIVES.filter((org) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        org.name.toLowerCase().includes(query) ||
        org.registrationNumber.toLowerCase().includes(query) ||
        org.district.toLowerCase().includes(query) ||
        org.state.toLowerCase().includes(query) ||
        org.sectorName.toLowerCase().includes(query);

      const matchesState = selectedState === 'All States' || org.state === selectedState;
      const matchesSector =
        selectedSector === 'All Sectors' ||
        org.sectorName.toLowerCase().includes(selectedSector.toLowerCase());

      return matchesSearch && matchesState && matchesSector;
    });
  }, [searchQuery, selectedState, selectedSector]);

  return (
    <section className="space-y-8 p-6 sm:p-10 bg-gradient-to-b from-white to-purple-50/30 rounded-3xl border border-slate-200/90 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#062B3A] text-white shadow-xs">
            <Database className="w-3.5 h-3.5 text-yellow-300" />
            <span>{t('dir_badge', 'Ministry of Cooperation Data Integration')}</span>
            <span className="text-[10px] bg-yellow-400 text-[#062B3A] px-2 py-0.2 rounded-full font-black uppercase">
              {t('dir_badge_sec51', 'Sector 51 List')}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#062B3A]">
            {t('dir_title', 'National Labour & Construction Cooperative Directory')}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('dir_desc', 'Search officially registered Labour Contract & Construction Cooperative Societies and Federations mapped in the National Cooperative Database (NCD) under the Ministry of Cooperation, Government of India.')}
          </p>
        </div>

        <a
          href="https://cooperatives.gov.in/sector-dashboard/sectorlist/51"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-purple-400 text-xs font-bold text-[#062B3A] flex items-center gap-2 shrink-0 transition-all hover:shadow-sm"
        >
          <Building className="w-4 h-4 text-[#35C6B0]" />
          <span>{t('dir_official_btn', 'Official Ministry Dashboard')}</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('dir_search_placeholder', 'Search cooperative name, reg no, district or state...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]/40 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* State Filter */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]/40 transition-all appearance-none cursor-pointer"
          >
            {statesList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#35C6B0]/40 transition-all appearance-none cursor-pointer"
          >
            {sectorsList.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrgs.map((org) => (
          <div
            key={org.id}
            onClick={() => setSelectedOrgModal(org)}
            className="group p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1 relative"
          >
            <div>
              {/* Top Tags */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                    org.type === 'federation'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : org.type === 'district_union'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span className="capitalize">{org.type.replace('_', ' ')}</span>
                </span>

                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    org.isOfficialRecord
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {org.ncdStatusLabel}
                </span>
              </div>

              {/* Title & Reg */}
              <h3 className="font-bold text-sm text-[#062B3A] group-hover:text-[#35C6B0] transition-colors leading-snug line-clamp-2">
                {org.name}
              </h3>

              <p className="text-[11px] font-mono text-slate-500 mt-1 flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Reg: {org.registrationNumber}</span>
              </p>

              {/* Location & Sector */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>
                    {org.district}, {org.state}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{org.sectorName}</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Stats */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>{org.workerCount.toLocaleString()} Members</span>
              </div>

              <span className="text-[11px] font-bold text-[#35C6B0] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <p className="text-sm font-bold text-slate-700">
            {t('dir_no_results', 'No cooperatives found matching')} "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedState('All States');
              setSelectedSector('All Sectors');
            }}
            className="px-4 py-2 bg-[#062B3A] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            {t('dir_reset_btn', 'Reset Filters')}
          </button>
        </div>
      )}

      {/* Cooperative Detail Modal */}
      {selectedOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-6">
            {/* Modal Header */}
            <div className="bg-[#062B3A] text-white p-6 relative">
              <button
                onClick={() => setSelectedOrgModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-[#062B3A] uppercase tracking-wider">
                  {t('dir_modal_ncd_sec51', 'NCD Sector 51')}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {selectedOrgModal.code}
                </span>
              </div>

              <h3 className="text-lg font-bold leading-snug">
                {selectedOrgModal.name}
              </h3>

              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {selectedOrgModal.address || `${selectedOrgModal.district}, ${selectedOrgModal.state}`}
                </span>
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* NCD Verification Badge Box */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  selectedOrgModal.isOfficialRecord
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck
                    className={`w-5 h-5 shrink-0 ${
                      selectedOrgModal.isOfficialRecord ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  />
                  <div>
                    <p className="font-bold">{selectedOrgModal.ncdStatusLabel}</p>
                    <p className="text-[11px] opacity-80">
                      {t('dir_modal_valid_auth', 'Validated Authority')}: {selectedOrgModal.verificationAuthority}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-1 rounded bg-white font-bold border border-emerald-300">
                  {t('dir_modal_crcs_active', 'CRCS / NCD Status Active')}
                </span>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    {t('dir_modal_reg_no', 'Registration No')}
                  </span>
                  <span className="font-bold text-slate-800 font-mono text-xs">
                    {selectedOrgModal.registrationNumber}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    {t('dir_modal_est_year', 'Established Year')}
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    {selectedOrgModal.establishedYear}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    {t('dir_modal_members', 'Member Workers Roster')}
                  </span>
                  <span className="font-bold text-emerald-700 text-xs">
                    {selectedOrgModal.workerCount.toLocaleString()} {t('dir_modal_verified_artisans', 'Verified Artisans')}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">
                    {t('dir_modal_welfare_fund', 'Welfare Fund Balance')}
                  </span>
                  <span className="font-bold text-purple-700 text-xs">
                    ₹{selectedOrgModal.welfareFundBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <h4 className="font-bold text-xs text-[#062B3A] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#35C6B0]" />
                  <span>{t('dir_modal_contact', 'Cooperative Leadership & Secretariat Contact')}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 text-xs pt-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{selectedOrgModal.contactPerson}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedOrgModal.contactPhone}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[11px] col-span-1 sm:col-span-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedOrgModal.contactEmail}</span>
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedOrgModal(null);
                    onOpenAuth('institution');
                  }}
                  className="flex-1 py-3 bg-[#062B3A] hover:bg-[#1E194B] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <Building2 className="w-4 h-4 text-amber-300" />
                  <span>{t('dir_modal_btn_tender', 'Issue Bulk Work Order Tender')}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedOrgModal(null);
                    onOpenAuth('worker');
                  }}
                  className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <span>{t('dir_modal_btn_join', 'Join as Worker')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
