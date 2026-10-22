import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Clock,
  Heart,
  Plus,
  Search,
  X,
  CheckCircle2,
  Trash2,
  Stethoscope,
  Pill,
  ShieldAlert,
  Car
} from 'lucide-react';

interface DirectoryProvider {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: 'physician' | 'nursing' | 'pharmacy' | 'facility' | 'safety';
  address: string;
  phone: string;
  fax?: string;
  hours: string;
  emergencyNotes: string;
  badge: string;
}

const INITIAL_DIRECTORY: DirectoryProvider[] = [
  {
    id: 'p-1',
    name: 'Dr. Christopher Chen, MD',
    role: 'Attending Cardiologist',
    organization: 'Providence Heart Clinic - West Pavilion',
    category: 'physician',
    address: 'Suite 410, 9155 SW Barnes Rd, Portland, OR 97225',
    phone: '(503) 216-2188',
    fax: '(503) 216-2189',
    hours: 'Mon - Fri • 8:00 AM – 4:30 PM',
    emergencyNotes: 'On call via Providence switchboard for hypertensive urgency.',
    badge: 'Primary Specialist'
  },
  {
    id: 'p-2',
    name: 'Cedar Hills Walgreens Pharmacy #1042',
    role: 'Preferred Pharmacy & Refills',
    organization: 'Walgreens Co.',
    category: 'pharmacy',
    address: '14600 SW Farmington Rd, Beaverton, OR 97007',
    phone: '(503) 644-8452',
    fax: '(503) 644-8459',
    hours: '24/7 Drive-Thru • Pharmacist: J. Miller',
    emergencyNotes: 'Direct digital prescription relay on file under Eleanor Vance.',
    badge: '24/7 Pharmacy'
  },
  {
    id: 'p-3',
    name: 'Cascade Health Visiting Nurses',
    role: 'In-Home Nursing & Physical Therapy',
    organization: 'Cascade Health Services of Oregon',
    category: 'nursing',
    address: '12250 SW 1st St, Beaverton, OR 97005',
    phone: '(503) 555-0199',
    fax: '(503) 555-0198',
    hours: 'Nurse Beth RN: Mon / Wed / Fri (8:30 AM)',
    emergencyNotes: 'RN on-call 24 hours for acute symptom triage.',
    badge: 'Verified Aide'
  },
  {
    id: 'p-4',
    name: 'Providence St. Vincent Medical Center',
    role: 'Emergency Department & Acute Triage',
    organization: 'Providence Health & Services',
    category: 'facility',
    address: '9205 SW Barnes Rd, Portland, OR 97225',
    phone: '(503) 216-1234',
    fax: '(503) 216-7000',
    hours: '24 Hours Emergency Care',
    emergencyNotes: "Designated destination in Eleanor's 911 beacon profile.",
    badge: 'Preferred ER'
  },
  {
    id: 'p-5',
    name: 'Portland Senior Safety Solutions',
    role: 'Home Accessibility & Mobility Equipment',
    organization: 'Licensed Oregon Contractor #208119',
    category: 'safety',
    address: '4800 SW Meadows Rd, Lake Oswego, OR 97035',
    phone: '(503) 555-0177',
    hours: 'Mon - Fri • 8:00 AM – 5:00 PM',
    emergencyNotes: 'Installed ADA grab-bars in master bath. 24-hr contractor hotline.',
    badge: 'Safety Contractor'
  }
];

export const ServiceDirectoryView: React.FC = () => {
  const [providers, setProviders] = useState<DirectoryProvider[]>(INITIAL_DIRECTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Provider Form State
  const [form, setForm] = useState({
    name: '',
    role: '',
    organization: '',
    category: 'physician' as DirectoryProvider['category'],
    address: '',
    phone: '',
    hours: 'Mon - Fri • 9:00 AM – 5:00 PM',
    emergencyNotes: '',
    badge: 'Verified Provider'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    const newProvider: DirectoryProvider = {
      id: `p-${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim() || 'Medical Provider',
      organization: form.organization.trim() || 'Independent Practice',
      category: form.category,
      address: form.address.trim() || 'Portland Metro Area',
      phone: form.phone.trim(),
      hours: form.hours.trim() || 'Office Hours On File',
      emergencyNotes: form.emergencyNotes.trim() || 'Contact primary office line for triage.',
      badge: form.badge
    };

    setProviders([newProvider, ...providers]);
    setIsModalOpen(false);
    showToast(`Added ${newProvider.name} to Eleanor's directory.`);

    // Reset form
    setForm({
      name: '',
      role: '',
      organization: '',
      category: 'physician',
      address: '',
      phone: '',
      hours: 'Mon - Fri • 9:00 AM – 5:00 PM',
      emergencyNotes: '',
      badge: 'Verified Provider'
    });
  };

  const handleDeleteProvider = (id: string, name: string) => {
    setProviders(providers.filter(p => p.id !== id));
    showToast(`Removed ${name} from directory.`);
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    return provider.category === selectedCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-[#F6F9FF]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-[#00685f] text-white shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-teal-200" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00685f]">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Trusted Care Network • Portland Metro</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
            Service Directory & Providers
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Verified physicians, pharmacies, therapists, emergency clinics, and home safety contractors serving Eleanor's circle.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-xl shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Provider</span>
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search provider, specialty, or clinic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Providers' },
            { id: 'physician', label: 'Physicians' },
            { id: 'nursing', label: 'Nursing & Therapy' },
            { id: 'pharmacy', label: 'Pharmacy' },
            { id: 'facility', label: 'Emergency & Hospitals' },
            { id: 'safety', label: 'Home Safety' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c] hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProviders.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E1F0FF] text-[#00685f]">
                  {item.badge}
                </span>
                <span className="text-xs text-[#64748B] font-medium">{item.role}</span>
              </div>

              <h3 className="font-bold text-base text-[#081d2c] pt-1">
                {item.name}
              </h3>
              <div className="text-xs font-medium text-[#475569]">
                {item.organization}
              </div>

              <div className="space-y-1.5 text-xs text-[#64748B] pt-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{item.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`tel:${item.phone}`} className="font-semibold text-[#00685f] hover:underline">
                    {item.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.hours}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#F1F5F9]">
              <div className="text-[11px] text-[#475569] bg-[#F8FAFC] p-2.5 rounded-xl">
                <strong className="text-[#081d2c]">Protocol: </strong>
                {item.emergencyNotes}
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={`tel:${item.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#d0e7ff] transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Provider</span>
                </a>

                <button
                  onClick={() => handleDeleteProvider(item.id, item.name)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove Provider"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E2E8F0]">
          <Building2 className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
          <h3 className="font-bold text-sm text-[#081d2c]">No providers found</h3>
          <p className="text-xs text-[#64748B] mt-1">Try searching for a different keyword or category.</p>
        </div>
      )}

      {/* Add Provider Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00685f]" />
                <h3 className="font-bold text-base text-[#081d2c]">Add Provider to Directory</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProvider} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Provider or Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jennifer Adams, MD / Beaverton Physical Therapy"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Specialty / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physical Therapist"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Category Network
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:ring-2 focus:ring-[#00685f]/30"
                  >
                    <option value="physician">Physicians & Clinics</option>
                    <option value="nursing">Nursing & Therapy</option>
                    <option value="pharmacy">Pharmacy & Supplies</option>
                    <option value="facility">Emergency & Hospitals</option>
                    <option value="safety">Home Safety & Mobility</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Clinic or Practice Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oregon Health & Science University (OHSU)"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(503) 555-0123"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Badge Label
                  </label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white"
                  >
                    <option value="Verified Specialist">Verified Specialist</option>
                    <option value="In-Home Care">In-Home Care</option>
                    <option value="24/7 Support">24/7 Support</option>
                    <option value="Safety Contractor">Safety Contractor</option>
                    <option value="Preferred Clinic">Preferred Clinic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Street Address & Suite
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3181 SW Sam Jackson Park Rd, Portland, OR 97239"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Office Hours / Availability
                </label>
                <input
                  type="text"
                  placeholder="Mon - Fri • 8:30 AM – 5:00 PM"
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Care Protocol & Emergency Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Call triage nurse for urgent refills or after-hours coverage."
                  value={form.emergencyNotes}
                  onChange={(e) => setForm({ ...form, emergencyNotes: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
