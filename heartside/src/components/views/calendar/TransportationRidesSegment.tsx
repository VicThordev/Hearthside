import React, { useState } from 'react';
import {
  Car,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Plus,
  Navigation,
  Check,
  X,
  FileText,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface TransportationRidesSegmentProps {
  onScheduleRide?: () => void;
}

interface RideItem {
  id: string;
  title: string;
  destination: string;
  destinationAddress: string;
  pickupAddress: string;
  date: string;
  pickupTime: string;
  appointmentTime: string;
  driverName: string;
  driverRole: string;
  driverPhone: string;
  driverAvatar: string;
  vehicle: string;
  licensePlate: string;
  status: 'In Progress' | 'Confirmed' | 'Reserved' | 'Completed';
  distance: string;
  estimatedDriveTime: string;
  mobilityNeeds: string;
  specialInstructions: string;
  returnTripConfirmed: boolean;
}

export const TransportationRidesSegment: React.FC<TransportationRidesSegmentProps> = ({
  onScheduleRide
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [selectedRideId, setSelectedRideId] = useState<string>('ride-1');
  const [rides, setRides] = useState<RideItem[]>([
    {
      id: 'ride-1',
      title: 'Dr. Christopher Chen Cardiology Follow-Up',
      destination: 'Providence St. Vincent Medical Plaza (West Pavilion)',
      destinationAddress: 'Suite 410, 9155 SW Barnes Rd, Portland, OR 97225',
      pickupAddress: "Eleanor's Residence • 1420 SW Westwood Dr, Portland, OR",
      date: 'Today, Thursday Oct 24, 2024',
      pickupTime: '11:15 AM',
      appointmentTime: '11:30 AM – 12:45 PM',
      driverName: 'Sarah Vance',
      driverRole: 'Primary Caregiver & In-Clinic Escort',
      driverPhone: '(503) 555-0142',
      driverAvatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      vehicle: '2022 Honda CR-V (Silver Metallic)',
      licensePlate: 'OR 742-HVD',
      status: 'In Progress',
      distance: '5.8 miles',
      estimatedDriveTime: '14 mins via US-26 W',
      mobilityNeeds: 'Folding 4-wheel rollator walker fits in rear cargo • Low passenger seat ingress',
      specialInstructions: 'Bring clinical binder with 30-day BP log sheet and latest Lisinopril prescription bottle. Accompany Eleanor directly into Suite 410 waiting lounge.',
      returnTripConfirmed: true
    },
    {
      id: 'ride-2',
      title: 'Quest Diagnostics Serum Potassium Fasting Blood Draw',
      destination: 'Quest Diagnostics Beaverton Outpatient Center',
      destinationAddress: '11795 SW 4th St, Beaverton, OR 97005',
      pickupAddress: "Eleanor's Residence • 1420 SW Westwood Dr, Portland, OR",
      date: 'Thursday, Oct 31, 2024',
      pickupTime: '7:40 AM',
      appointmentTime: '8:00 AM – 8:30 AM',
      driverName: 'David Vance',
      driverRole: 'Logistics Lead & Morning Driver',
      driverPhone: '(503) 555-0188',
      driverAvatar: '/src/assets/images/david_vance_avatar_1792204257121.jpg',
      vehicle: '2021 Subaru Outback (Autumn Green)',
      licensePlate: 'OR 918-BTM',
      status: 'Confirmed',
      distance: '7.2 miles',
      estimatedDriveTime: '18 mins via Beaverton-Hillsdale Hwy',
      mobilityNeeds: 'Standard cane support • Direct door-to-door escort',
      specialInstructions: 'Fasting 12-hour draw. Bring warm water thermos and blueberry muffin for Eleanor immediately after blood draw is completed.',
      returnTripConfirmed: true
    },
    {
      id: 'ride-3',
      title: 'Dr. Sarah Miller Senior Podiatry Examination',
      destination: 'Providence Beaverton Outpatient Health Center',
      destinationAddress: '12350 SW Barnes Rd, Suite 210, Portland, OR 97225',
      pickupAddress: "Eleanor's Residence • 1420 SW Westwood Dr, Portland, OR",
      date: 'Tuesday, Nov 12, 2024',
      pickupTime: '1:25 PM',
      appointmentTime: '2:00 PM – 2:45 PM',
      driverName: 'TriMet LIFT Paratransit',
      driverRole: 'Certified Medical Transit Service',
      driverPhone: '(503) 962-8000',
      driverAvatar: '',
      vehicle: 'TriMet LIFT Van #412 (Hydraulic Wheelchair Lift)',
      licensePlate: 'LIFT-88204',
      status: 'Reserved',
      distance: '6.4 miles',
      estimatedDriveTime: '22 mins (scheduled window)',
      mobilityNeeds: 'Hydraulic lift boarding assistance • Escort David Vance standby',
      specialInstructions: 'Reservation Confirmation #TR-99410. Driver is authorized to assist from front porch threshold to vehicle cabin.',
      returnTripConfirmed: true
    },
    {
      id: 'ride-4',
      title: 'Walgreens Senior Immunization Booster Clinic',
      destination: 'Cedar Hills Walgreens Pharmacy Clinic #1042',
      destinationAddress: '14600 SW Farmington Rd, Beaverton, OR 97007',
      pickupAddress: "Eleanor's Residence • 1420 SW Westwood Dr, Portland, OR",
      date: 'Tuesday, Nov 19, 2024',
      pickupTime: '9:55 AM',
      appointmentTime: '10:15 AM – 10:45 AM',
      driverName: 'Sarah Vance',
      driverRole: 'Primary Driver',
      driverPhone: '(503) 555-0142',
      driverAvatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      vehicle: '2022 Honda CR-V (Silver Metallic)',
      licensePlate: 'OR 742-HVD',
      status: 'Confirmed',
      distance: '5.1 miles',
      estimatedDriveTime: '12 mins',
      mobilityNeeds: 'Rollator walker • Pharmacist consultation seated area',
      specialInstructions: 'Annual Fluzone High-Dose & Arexvy RSV booster administration. 15-minute post-injection observation in pharmacy seating area.',
      returnTripConfirmed: true
    }
  ]);

  // Form State
  const [form, setForm] = useState({
    title: '',
    destination: '',
    destinationAddress: '',
    pickupTime: '10:00 AM',
    date: 'Tomorrow, Oct 25',
    driverName: 'Sarah Vance',
    vehicle: '2022 Honda CR-V',
    mobilityNeeds: 'Rollator walker assistance',
    specialInstructions: ''
  });

  const handleCreateRide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.destination.trim()) return;

    const newRide: RideItem = {
      id: `ride-${Date.now()}`,
      title: form.title.trim(),
      destination: form.destination.trim(),
      destinationAddress: form.destinationAddress.trim() || "Portland Metro Area",
      pickupAddress: "Eleanor's Residence • 1420 SW Westwood Dr, Portland, OR",
      date: form.date,
      pickupTime: form.pickupTime,
      appointmentTime: `${form.pickupTime} + 30 mins`,
      driverName: form.driverName,
      driverRole: form.driverName === 'Sarah Vance' ? 'Primary Caregiver' : 'Family Driver',
      driverPhone: form.driverName === 'Sarah Vance' ? '(503) 555-0142' : '(503) 555-0188',
      driverAvatar: form.driverName === 'Sarah Vance'
        ? '/src/assets/images/sarah_vance_avatar_1792204247520.jpg'
        : '/src/assets/images/david_vance_avatar_1792204257121.jpg',
      vehicle: form.vehicle,
      licensePlate: 'OR Verified',
      status: 'Confirmed',
      distance: '5.5 miles',
      estimatedDriveTime: '15 mins',
      mobilityNeeds: form.mobilityNeeds,
      specialInstructions: form.specialInstructions || 'Door-to-door escort required.',
      returnTripConfirmed: true
    };

    setRides([newRide, ...rides]);
    setIsModalOpen(false);
    setForm({
      title: '',
      destination: '',
      destinationAddress: '',
      pickupTime: '10:00 AM',
      date: 'Tomorrow, Oct 25',
      driverName: 'Sarah Vance',
      vehicle: '2022 Honda CR-V',
      mobilityNeeds: 'Rollator walker assistance',
      specialInstructions: ''
    });
  };

  const filteredRides = rides.filter(r => {
    if (activeFilter === 'upcoming') return r.status !== 'Completed';
    if (activeFilter === 'completed') return r.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-teal-50/60 border border-blue-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-display text-[#081d2c]">
                  Transportation, Escorts & Ride Logistics
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                  {rides.length} Scheduled Trips
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Door-to-door transit coordination, family driver schedules, vehicle ingress preparations, and TriMet LIFT reservations for Eleanor Vance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Ride</span>
            </button>
          </div>
        </div>

        {/* Quick Fleet & Mobility Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Next Active Trip</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">Today at 11:15 AM</span>
            <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
              <Navigation className="w-3 h-3" /> Sarah Vance Driving
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Primary Care Vehicle</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">2022 Honda CR-V</span>
            <span className="text-[10px] text-[#64748B]">Low step-in & walker trunk fit</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">TriMet LIFT Client ID</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">#LIFT-88204</span>
            <span className="text-[10px] text-emerald-700 font-medium">Certified Senior Account</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Mobility Device on Record</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">Drive Nitro 4-Wheel</span>
            <span className="text-[10px] text-purple-700 font-medium">Foldable rollator in cargo</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]'
            }`}
          >
            All Rides ({rides.length})
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === 'upcoming'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]'
            }`}
          >
            Upcoming Rides
          </button>
        </div>

        <span className="text-xs text-[#64748B]">
          Showing <strong>{filteredRides.length}</strong> planned transports
        </span>
      </div>

      {/* Rides List */}
      <div className="space-y-4">
        {filteredRides.map(ride => (
          <div
            key={ride.id}
            className={`p-6 rounded-2xl bg-white border transition-all space-y-4 shadow-2xs hover:shadow-xs ${
              ride.status === 'In Progress'
                ? 'border-blue-400 ring-2 ring-blue-100'
                : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            {/* Top row: Status, Title & Timings */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ride.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800 animate-pulse'
                      : ride.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {ride.status}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {ride.date}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#081d2c] font-display">
                  {ride.title}
                </h3>
              </div>

              <div className="text-left sm:text-right shrink-0 bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-[#E2E8F0]">
                <div className="text-xs font-bold text-[#081d2c] flex items-center sm:justify-end gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pickup: {ride.pickupTime}</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  Appt: {ride.appointmentTime}
                </div>
              </div>
            </div>

            {/* Route Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pickup Location
                </span>
                <p className="font-medium text-[#081d2c]">{ride.pickupAddress}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Destination & Clinic
                </span>
                <p className="font-bold text-[#081d2c]">{ride.destination}</p>
                <p className="text-[11px] text-[#64748B]">{ride.destinationAddress}</p>
              </div>
            </div>

            {/* Logistics & Driver Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="flex items-center gap-2.5">
                {ride.driverAvatar ? (
                  <img
                    src={ride.driverAvatar}
                    alt={ride.driverName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    TL
                  </div>
                )}
                <div>
                  <div className="font-bold text-[#081d2c]">{ride.driverName}</div>
                  <div className="text-[10px] text-[#64748B]">{ride.driverRole}</div>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-[#64748B] block">Vehicle & Plate</span>
                <span className="font-medium text-[#081d2c] block">{ride.vehicle}</span>
                <span className="text-[10px] font-mono text-[#64748B]">{ride.licensePlate}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-[#64748B] block">Route Estimates</span>
                <span className="font-medium text-[#081d2c] block">{ride.distance} • {ride.estimatedDriveTime}</span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  {ride.returnTripConfirmed ? '✓ Return ride confirmed' : 'One-way transit'}
                </span>
              </div>
            </div>

            {/* Mobility & Special notes */}
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Mobility Care Directive:</span>
              </div>
              <p className="text-[#334155] text-[11px] leading-relaxed">
                {ride.mobilityNeeds}. {ride.specialInstructions}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#F1F5F9] text-xs">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${ride.driverPhone}`}
                  className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-[#081d2c] hover:bg-slate-50 transition-colors font-semibold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call Driver ({ride.driverPhone})</span>
                </a>
                <button
                  onClick={() => alert(`Launching GPS navigation to ${ride.destination}`)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Route Map</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Notified Circle: Pickup confirmed for Eleanor with ${ride.driverName}`)}
                  className="px-3 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Pickup Handshake</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule New Ride Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#081d2c]">Schedule Transit or Ride</h3>
                  <p className="text-[11px] text-[#64748B]">Assign driver and transit logistics for Eleanor</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRide} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#081d2c] block mb-1">Appointment or Trip Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Chen Follow-up or Physical Therapy"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#081d2c] block mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Friday, Oct 25"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#081d2c] block mb-1">Pickup Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:15 AM"
                    value={form.pickupTime}
                    onChange={e => setForm({ ...form, pickupTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#081d2c] block mb-1">Destination Facility & Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Vincent Medical Plaza, Suite 410"
                  value={form.destination}
                  onChange={e => setForm({ ...form, destination: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] mb-2"
                />
                <input
                  type="text"
                  placeholder="Street address (e.g. 9155 SW Barnes Rd, Portland, OR)"
                  value={form.destinationAddress}
                  onChange={e => setForm({ ...form, destinationAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#081d2c] block mb-1">Designated Driver *</label>
                  <select
                    value={form.driverName}
                    onChange={e => setForm({
                      ...form,
                      driverName: e.target.value,
                      vehicle: e.target.value === 'Sarah Vance' ? '2022 Honda CR-V' : '2021 Subaru Outback'
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white"
                  >
                    <option value="Sarah Vance">Sarah Vance (Primary)</option>
                    <option value="David Vance">David Vance (Helper)</option>
                    <option value="TriMet LIFT Paratransit">TriMet LIFT Paratransit</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#081d2c] block mb-1">Vehicle</label>
                  <input
                    type="text"
                    value={form.vehicle}
                    onChange={e => setForm({ ...form, vehicle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#081d2c] block mb-1">Mobility & Special Escort Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 4-wheel rollator walker in trunk, assistance getting from threshold to car."
                  value={form.specialInstructions}
                  onChange={e => setForm({ ...form, specialInstructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Scheduled Ride</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
