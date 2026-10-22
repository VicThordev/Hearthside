import React, { useState } from 'react';
import {
  ShoppingBag,
  Pill,
  Home,
  CheckCircle2,
  Clock,
  Plus,
  Calendar,
  AlertCircle,
  MapPin,
  Check,
  X,
  FileText,
  DollarSign,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Coffee,
  Sparkles
} from 'lucide-react';

interface GroceriesErrandsSegmentProps {
  onAddErrand?: () => void;
}

interface ErrandItem {
  id: string;
  title: string;
  category: 'groceries' | 'pharmacy' | 'household' | 'maintenance';
  status: 'In Progress' | 'Completed' | 'Upcoming';
  storeOrLocation: string;
  address: string;
  assigneeName: string;
  assigneeRole: string;
  assigneeAvatar: string;
  dueDate: string;
  timeSlot: string;
  estimatedCost?: string;
  paymentMethod?: string;
  notes: string;
  checklist: { id: string; text: string; done: boolean }[];
  receiptAttached?: boolean;
}

export const GroceriesErrandsSegment: React.FC<GroceriesErrandsSegmentProps> = ({
  onAddErrand
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'groceries' | 'pharmacy' | 'household'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errands, setErrands] = useState<ErrandItem[]>([
    {
      id: 'err-1',
      title: 'Safeway Fresh Produce & Dietary Nutrition Restock',
      category: 'groceries',
      status: 'Upcoming',
      storeOrLocation: 'Safeway Supermarket #1520',
      address: 'SW 4th Ave, Portland, OR',
      assigneeName: 'David Vance',
      assigneeRole: 'Logistics Lead',
      assigneeAvatar: '/src/assets/images/david_vance_avatar_1792204257121.jpg',
      dueDate: 'Saturday, Oct 26',
      timeSlot: '10:00 AM – 11:30 AM',
      estimatedCost: '$46.20',
      paymentMethod: "Eleanor's Household Account Card",
      notes: 'Follow low-sodium DASH recommendations. Only purchase unflavored plain Greek yogurt and low-sodium organic vegetable broth.',
      checklist: [
        { id: 'c1', text: 'Organic whole milk (half gallon)', done: false },
        { id: 'c2', text: 'Chobani plain nonfat Greek yogurt (32 oz)', done: false },
        { id: 'c3', text: 'Fresh organic blueberries & ripe bananas', done: false },
        { id: 'c4', text: 'Traditional Medicinals Organic Peppermint Tea', done: false },
        { id: 'c5', text: 'Ensure Plus Vanilla 6-pack (Low sodium)', done: false }
      ],
      receiptAttached: false
    },
    {
      id: 'err-2',
      title: 'Lisinopril 20mg 90-Day Prescription Pickup',
      category: 'pharmacy',
      status: 'Completed',
      storeOrLocation: 'Cedar Hills Walgreens Pharmacy #1042',
      address: '14600 SW Farmington Rd, Beaverton, OR 97007',
      assigneeName: 'David Vance',
      assigneeRole: 'Logistics Lead',
      assigneeAvatar: '/src/assets/images/david_vance_avatar_1792204257121.jpg',
      dueDate: 'Thursday, Oct 24 (Today)',
      timeSlot: '9:30 AM',
      estimatedCost: '$12.40 (Medicare Part D Copay)',
      paymentMethod: 'Vance Family Care Debit',
      notes: 'Refill #Rx-8841029 dispensed by Pharmacist J. Miller. Successfully stocked in kitchen cabinet pill organizer.',
      checklist: [
        { id: 'c6', text: 'Verify 20mg dosage label against Dr. Chen chart', done: true },
        { id: 'c7', text: 'Obtain printed clinical information leaflet', done: true },
        { id: 'c8', text: 'Place in morning compartment of 7-day pill box', done: true }
      ],
      receiptAttached: true
    },
    {
      id: 'err-3',
      title: 'Friday Master Bedroom Linen Refresh & Safety Audit',
      category: 'household',
      status: 'Upcoming',
      storeOrLocation: "Eleanor's Residence • Master Suite",
      address: '1420 SW Westwood Dr, Portland, OR',
      assigneeName: 'Sarah Vance',
      assigneeRole: 'Primary Caregiver',
      assigneeAvatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      dueDate: 'Friday, Oct 25',
      timeSlot: '2:00 PM – 3:00 PM',
      notes: 'Launder lavender bedding in warm water with hypoallergenic detergent. Test suction seals on walk-in shower grab-bars.',
      checklist: [
        { id: 'c9', text: 'Change bedding to fresh hypoallergenic sheets', done: false },
        { id: 'c10', text: 'Inspect suction indicators on shower grab-bars', done: false },
        { id: 'c11', text: 'Empty bedside ultrasonic humidifier and refill with distilled water', done: false },
        { id: 'c12', text: 'Verify non-slip rug grippers are secure', done: false }
      ]
    },
    {
      id: 'err-4',
      title: 'Sunday Afternoon Family Video Call Setup & iPad Station',
      category: 'household',
      status: 'Upcoming',
      storeOrLocation: "Eleanor's Sunroom & Living Recliner",
      address: '1420 SW Westwood Dr, Portland, OR',
      assigneeName: 'Marcus Vance',
      assigneeRole: 'Remote Care Contributor',
      assigneeAvatar: '/src/assets/images/marcus_vance_avatar_1792204257224.jpg',
      dueDate: 'Sunday, Oct 27',
      timeSlot: '4:00 PM – 5:00 PM',
      notes: 'Ensure Eleanor’s 10.9-inch iPad is plugged into the magnetic stand, zoom audio is pre-tested, and grandchildren from Chicago & Seattle are admitted.',
      checklist: [
        { id: 'c13', text: 'Charge iPad to 100% and test front camera lens', done: false },
        { id: 'c14', text: 'Set volume to 85% with noise-canceling profile', done: false },
        { id: 'c15', text: 'Dial in Chicago (Luke & Emma) and Seattle (Mia)', done: false }
      ]
    },
    {
      id: 'err-5',
      title: 'New Seasons Organic Butternut Soup & Broth Batch',
      category: 'groceries',
      status: 'Upcoming',
      storeOrLocation: 'New Seasons Market • Raleigh Hills',
      address: '7300 SW Beaverton Hillsdale Hwy, Portland, OR 97225',
      assigneeName: 'Sarah Vance',
      assigneeRole: 'Primary Caregiver',
      assigneeAvatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      dueDate: 'Tuesday, Oct 29',
      timeSlot: '11:00 AM',
      estimatedCost: '$28.00',
      paymentMethod: 'Care Circle Funds',
      notes: 'Grab 2 quarts of artisan low-sodium bone broth and butternut squash puree for Eleanor’s light lunches.',
      checklist: [
        { id: 'c16', text: 'Pacific Foods Low-Sodium Bone Broth (32 oz)', done: false },
        { id: 'c17', text: 'Fresh roasted butternut squash soup container', done: false },
        { id: 'c18', text: 'Artisan soft brioche rolls', done: false }
      ]
    }
  ]);

  const [form, setForm] = useState({
    title: '',
    category: 'groceries' as ErrandItem['category'],
    storeOrLocation: '',
    address: '',
    dueDate: 'Tomorrow',
    timeSlot: '10:00 AM',
    assigneeName: 'David Vance',
    estimatedCost: '',
    notes: '',
    itemsText: ''
  });

  const toggleItem = (errandId: string, itemId: string) => {
    setErrands(prev =>
      prev.map(e => {
        if (e.id === errandId) {
          const updatedChecklist = e.checklist.map(c =>
            c.id === itemId ? { ...c, done: !c.done } : c
          );
          const allDone = updatedChecklist.every(c => c.done);
          return {
            ...e,
            checklist: updatedChecklist,
            status: allDone ? 'Completed' : 'In Progress'
          };
        }
        return e;
      })
    );
  };

  const handleCreateErrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const items = form.itemsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, i) => ({
        id: `custom-${Date.now()}-${i}`,
        text,
        done: false
      }));

    const newErrand: ErrandItem = {
      id: `err-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      status: 'Upcoming',
      storeOrLocation: form.storeOrLocation.trim() || "Eleanor's Residence",
      address: form.address.trim() || 'Portland, OR',
      assigneeName: form.assigneeName,
      assigneeRole: form.assigneeName === 'David Vance' ? 'Logistics Lead' : 'Primary Caregiver',
      assigneeAvatar: form.assigneeName === 'David Vance'
        ? '/src/assets/images/david_vance_avatar_1792204257121.jpg'
        : '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      dueDate: form.dueDate,
      timeSlot: form.timeSlot,
      estimatedCost: form.estimatedCost ? `$${form.estimatedCost}` : undefined,
      notes: form.notes || 'Care circle routine errand.',
      checklist: items.length > 0 ? items : [{ id: `item-1`, text: form.title, done: false }]
    };

    setErrands([newErrand, ...errands]);
    setIsModalOpen(false);
    setForm({
      title: '',
      category: 'groceries',
      storeOrLocation: '',
      address: '',
      dueDate: 'Tomorrow',
      timeSlot: '10:00 AM',
      assigneeName: 'David Vance',
      estimatedCost: '',
      notes: '',
      itemsText: ''
    });
  };

  const filteredErrands = errands.filter(e => {
    if (activeFilter === 'all') return true;
    return e.category === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/60 border border-amber-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-display text-[#081d2c]">
                  Groceries, Pharmacy & Household Errands
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                  {errands.length} Active Tasks
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Fresh dietary restocking, low-sodium grocery runs, prescription dispensaries, and home safety maintenance for Eleanor Vance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Errand or Grocery Run</span>
            </button>
          </div>
        </div>

        {/* High-level status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Next Grocery Run</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">Saturday 10:00 AM</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Safeway SW 4th Ave
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Pharmacy Dispensary</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">Lisinopril 20mg Refilled</span>
            <span className="text-[10px] text-[#00685f]">Walgreens #1042 • 90-day bottle</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Dietary Adherence</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">DASH Low-Sodium</span>
            <span className="text-[10px] text-purple-700 font-medium">Greek yogurt & fruit restock</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
            <span className="text-[10px] font-semibold text-[#64748B] block">Home Maintenance</span>
            <span className="font-bold text-[#081d2c] mt-0.5 block">Shower Grab-Bars</span>
            <span className="text-[10px] text-blue-700 font-medium">Linen change scheduled Friday</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: `All Errands (${errands.length})` },
            { id: 'groceries', label: 'Grocery Runs' },
            { id: 'pharmacy', label: 'Pharmacy Dispensary' },
            { id: 'household', label: 'Household & Linen' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-[#00685f] text-white shadow-xs'
                  : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#64748B] shrink-0">
          Showing <strong>{filteredErrands.length}</strong> tasks
        </span>
      </div>

      {/* Errands List */}
      <div className="space-y-4">
        {filteredErrands.map(errand => (
          <div
            key={errand.id}
            className={`p-6 rounded-2xl bg-white border transition-all space-y-4 shadow-2xs hover:shadow-xs ${
              errand.status === 'Completed'
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    errand.category === 'groceries'
                      ? 'bg-emerald-100 text-emerald-800'
                      : errand.category === 'pharmacy'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {errand.category.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    errand.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {errand.status}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {errand.dueDate}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#081d2c] font-display">
                  {errand.title}
                </h3>
                <p className="text-xs text-[#475569] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{errand.storeOrLocation} • {errand.address}</span>
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0 bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-[#E2E8F0]">
                <div className="text-xs font-bold text-[#081d2c] flex items-center sm:justify-end gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{errand.timeSlot}</span>
                </div>
                {errand.estimatedCost && (
                  <div className="text-[11px] text-[#00685f] font-semibold mt-0.5">
                    Est: {errand.estimatedCost}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-[#334155] leading-relaxed">
              {errand.notes}
            </p>

            {/* Checklist Container */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                <span>Items & Verification Checklist:</span>
                <span>
                  {errand.checklist.filter(c => c.done).length} / {errand.checklist.length} done
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {errand.checklist.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(errand.id, item.id)}
                    className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-all ${
                      item.done
                        ? 'bg-emerald-50/70 border-emerald-200 text-slate-500'
                        : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#081d2c]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      item.done ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                    }`}>
                      {item.done && '✓'}
                    </span>
                    <span className={`text-xs ${item.done ? 'line-through text-slate-400' : 'font-medium'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignee & Receipt Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#F1F5F9] text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={errand.assigneeAvatar}
                  alt={errand.assigneeName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div>
                  <span className="font-bold text-[#081d2c]">{errand.assigneeName}</span>
                  <span className="text-[10px] text-[#64748B] block">{errand.assigneeRole}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {errand.receiptAttached && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Receipt #48.32 Saved</span>
                  </span>
                )}
                <button
                  onClick={() => alert(`Marked entire errand "${errand.title}" as complete!`)}
                  className="px-3 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#00514a] text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Errand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#081d2c]">Add Errand or Supply Run</h3>
                  <p className="text-[11px] text-[#64748B]">Assign shopping list or household errand</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateErrand} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#081d2c] block mb-1">Errand Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trader Joe's Low-Sodium Pantry Stock"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#081d2c] block mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white"
                  >
                    <option value="groceries">Groceries & Produce</option>
                    <option value="pharmacy">Pharmacy Dispensary</option>
                    <option value="household">Household & Linens</option>
                    <option value="maintenance">Safety & Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#081d2c] block mb-1">Assignee</label>
                  <select
                    value={form.assigneeName}
                    onChange={e => setForm({ ...form, assigneeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white"
                  >
                    <option value="David Vance">David Vance (Logistics)</option>
                    <option value="Sarah Vance">Sarah Vance (Primary)</option>
                    <option value="Marcus Vance">Marcus Vance (Remote)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#081d2c] block mb-1">Store / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Safeway SW 4th Ave"
                    value={form.storeOrLocation}
                    onChange={e => setForm({ ...form, storeOrLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#081d2c] block mb-1">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Saturday 10:00 AM"
                    value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#081d2c] block mb-1">Items List (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="Organic milk&#10;Plain Greek yogurt&#10;Peppermint tea boxes&#10;Distilled water gallon"
                  value={form.itemsText}
                  onChange={e => setForm({ ...form, itemsText: e.target.value })}
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
                  <span>Save Errand</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
