import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  User,
  ShoppingBag,
  Pill,
  Car,
  Home,
  Check,
  Calendar,
  AlertCircle,
  Search,
  MoreVertical,
  Kanban,
  List as ListIcon,
  Users2,
  ArrowRight,
  MapPin,
  Trash2,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  X,
  FileCheck2,
  SlidersHorizontal
} from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  category: 'medication' | 'groceries' | 'transport' | 'household' | 'clinical';
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'urgent' | 'high' | 'normal';
  assignee: {
    name: string;
    initials: string;
    avatar: string;
    role: string;
  };
  dueDate: string;
  dueTime?: string;
  isToday?: boolean;
  location?: string;
  notes?: string;
  checklist?: { id: string; text: string; done: boolean }[];
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Drive Eleanor to Dr. Chen Cardiology Follow-up',
    category: 'transport',
    status: 'in_progress',
    priority: 'urgent',
    assignee: {
      name: 'Sarah Vance',
      initials: 'SV',
      avatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      role: 'Primary Driver'
    },
    dueDate: 'Today, Oct 24',
    dueTime: '11:15 AM',
    isToday: true,
    location: 'St. Vincent Plaza, Suite 410',
    notes: 'Bring Medicare supplemental card, 30-day BP log sheet, and Lisinopril bottle.',
    checklist: [
      { id: 'c1', text: 'Pick up Eleanor from residence', done: true },
      { id: 'c2', text: 'Check in with Suite 410 receptionist', done: false },
      { id: 'c3', text: 'Obtain clinical summary after appointment', done: false }
    ]
  },
  {
    id: 't-2',
    title: 'Pick up 20mg Lisinopril 90-day bottle at Walgreens',
    category: 'medication',
    status: 'completed',
    priority: 'high',
    assignee: {
      name: 'David Vance',
      initials: 'DV',
      avatar: '/src/assets/images/david_vance_avatar_1792204257121.jpg',
      role: 'Logistics Lead'
    },
    dueDate: 'Today, Oct 24',
    dueTime: '9:30 AM',
    isToday: true,
    location: 'Cedar Hills Walgreens #1042',
    notes: 'Placed in top pantry cabinet next to peppermint tea. Receipt #48.32 saved.',
    checklist: [
      { id: 'c4', text: 'Verify 20mg label with pharmacist', done: true },
      { id: 'c5', text: 'Put in weekly morning pill tray', done: true }
    ]
  },
  {
    id: 't-3',
    title: 'Mandatory 6:30 PM seated blood pressure protocol',
    category: 'medication',
    status: 'todo',
    priority: 'urgent',
    assignee: {
      name: 'Sarah Vance',
      initials: 'SV',
      avatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
      role: 'Evening Check'
    },
    dueDate: 'Today, Oct 24',
    dueTime: '6:30 PM',
    isToday: true,
    location: "Eleanor's Living Room",
    notes: 'Record seated BP after 5 mins of rest. If systolic is >140, message Sarah & Nurse Beth.',
    checklist: [
      { id: 'c6', text: 'Record reading on Hearthside hub', done: false },
      { id: 'c7', text: 'Serve decaf peppermint tea', done: false }
    ]
  },
  {
    id: 't-4',
    title: 'Safeway grocery restock: Greek yogurt, milk, & Ensure',
    category: 'groceries',
    status: 'completed',
    priority: 'normal',
    assignee: {
      name: 'David Vance',
      initials: 'DV',
      avatar: '/src/assets/images/david_vance_avatar_1792204257121.jpg',
      role: 'Logistics Lead'
    },
    dueDate: 'Yesterday',
    location: 'Safeway SW 4th Ave',
    notes: 'Refrigerated goods unpacked; Ensure Plus Vanilla 6-pack placed in bottom pantry.',
    checklist: [
      { id: 'c8', text: 'Organic whole milk', done: true },
      { id: 'c9', text: 'Plain Greek yogurt', done: true },
      { id: 'c10', text: 'Traditional Medicinals Peppermint Tea', done: true }
    ]
  },
  {
    id: 't-5',
    title: 'Friday bedroom linen change & bathroom grab-bar check',
    category: 'household',
    status: 'todo',
    priority: 'normal',
    assignee: {
      name: 'David Vance',
      initials: 'DV',
      avatar: '/src/assets/images/david_vance_avatar_1792204257121.jpg',
      role: 'Logistics Lead'
    },
    dueDate: 'Friday, Oct 25',
    dueTime: '2:00 PM',
    location: "Eleanor's Master Suite",
    notes: 'Wash lavender bedding and verify suction seal firmness on shower safety grab-bars.',
    checklist: [
      { id: 'c11', text: 'Inspect grab-bars per contractor report', done: false },
      { id: 'c12', text: 'Restock fresh bath towels', done: false }
    ]
  },
  {
    id: 't-6',
    title: 'Sunday afternoon family video call setup & iPad charge',
    category: 'household',
    status: 'todo',
    priority: 'normal',
    assignee: {
      name: 'Marcus Vance',
      initials: 'MV',
      avatar: '/src/assets/images/marcus_vance_avatar_1792204257224.jpg',
      role: 'Remote Contributor'
    },
    dueDate: 'Sunday, Oct 27',
    dueTime: '4:00 PM',
    location: 'Zoom ID: 842-119-0294',
    notes: "Connect grandchildren from Chicago & Seattle for Eleanor's weekly family catch-up."
  },
  {
    id: 't-7',
    title: 'In-Home Physical Therapy & Sunroom Stretches',
    category: 'clinical',
    status: 'completed',
    priority: 'high',
    assignee: {
      name: 'Nurse Beth RN',
      initials: 'BN',
      avatar: '/src/assets/images/nurse_beth_avatar_1792204257850.jpg',
      role: 'Cascade Visiting Nurse'
    },
    dueDate: 'Today, Oct 24',
    dueTime: '11:30 AM',
    isToday: true,
    location: "Garden Sunroom",
    notes: '18 min seated stretching, zero dizziness, 12 oz lemon hydration completed.'
  }
];

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCaregiver, setSelectedCaregiver] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New task form state
  const [form, setForm] = useState({
    title: '',
    category: 'medication' as TaskItem['category'],
    priority: 'normal' as TaskItem['priority'],
    status: 'todo' as TaskItem['status'],
    assigneeName: 'Sarah Vance',
    dueDate: 'Tomorrow',
    dueTime: '10:00 AM',
    location: "Eleanor's Residence",
    notes: ''
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          showToast(nextStatus === 'completed' ? `Completed "${t.title}"` : `Moved "${t.title}" back to To Do`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const toggleChecklistItem = (taskId: string, checkId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId && t.checklist) {
          const updatedChecklist = t.checklist.map(c =>
            c.id === checkId ? { ...c, done: !c.done } : c
          );
          const allCompleted = updatedChecklist.every(c => c.done);
          return {
            ...t,
            checklist: updatedChecklist,
            status: allCompleted ? 'completed' : t.status
          };
        }
        return t;
      })
    );
  };

  const handleMoveStatus = (id: string, newStatus: TaskItem['status']) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const handleDeleteTask = (id: string, title: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast(`Removed task "${title}"`);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const assigneeMap: { [key: string]: { initials: string; avatar: string; role: string } } = {
      'Sarah Vance': {
        initials: 'SV',
        avatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
        role: 'Primary Care Organizer'
      },
      'David Vance': {
        initials: 'DV',
        avatar: '/src/assets/images/david_vance_avatar_1792204257121.jpg',
        role: 'Logistics Lead'
      },
      'Marcus Vance': {
        initials: 'MV',
        avatar: '/src/assets/images/marcus_vance_avatar_1792204257224.jpg',
        role: 'Remote Contributor'
      },
      'Nurse Beth RN': {
        initials: 'BN',
        avatar: '/src/assets/images/nurse_beth_avatar_1792204257850.jpg',
        role: 'Cascade Visiting Nurse'
      }
    };

    const assigneeData = assigneeMap[form.assigneeName] || assigneeMap['Sarah Vance'];

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      status: form.status,
      priority: form.priority,
      assignee: {
        name: form.assigneeName,
        initials: assigneeData.initials,
        avatar: assigneeData.avatar,
        role: assigneeData.role
      },
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      location: form.location,
      notes: form.notes
    };

    setTasks([newTask, ...tasks]);
    setShowAddModal(false);
    showToast(`Created task: "${newTask.title}"`);

    // Reset form
    setForm({
      title: '',
      category: 'medication',
      priority: 'normal',
      status: 'todo',
      assigneeName: 'Sarah Vance',
      dueDate: 'Tomorrow',
      dueTime: '10:00 AM',
      location: "Eleanor's Residence",
      notes: ''
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (selectedCaregiver && t.assignee.name !== selectedCaregiver) return false;
    return true;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  // Stats
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
  const todayDueCount = tasks.filter(t => t.isToday && t.status !== 'completed').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const getCategoryBadge = (cat: TaskItem['category']) => {
    switch (cat) {
      case 'medication':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700"><Pill className="w-3 h-3" /> Medication</span>;
      case 'transport':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700"><Car className="w-3 h-3" /> Transport</span>;
      case 'groceries':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700"><ShoppingBag className="w-3 h-3" /> Groceries</span>;
      case 'household':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800"><Home className="w-3 h-3" /> Household</span>;
      case 'clinical':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800"><Sparkles className="w-3 h-3" /> Therapy / Clinical</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (pri: TaskItem['priority']) => {
    if (pri === 'urgent') {
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Urgent</span>;
    }
    if (pri === 'high') {
      return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">High</span>;
    }
    return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Routine</span>;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-[#F6F9FF]">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-[#00685f] text-white shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-teal-200 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00685f]">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span>Care Circle Action Hub • Eleanor Vance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[#081d2c] tracking-tight mt-1">
            Tasks & Errands Board
          </h1>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Coordinate weekly grocery deliveries, pharmacy pickups, doctor appointments, and home safety checks with real-time assignment tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Due Today</span>
            <Calendar className="w-4 h-4 text-[#00685f]" />
          </div>
          <div className="text-2xl font-bold font-display text-[#081d2c]">{todayDueCount}</div>
          <p className="text-[11px] text-[#00685f] font-medium">Cardiology visit & BP check</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Urgent Flags</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-display text-rose-600">{urgentCount}</div>
          <p className="text-[11px] text-[#64748B]">Requires prompt caregiver attention</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Completed This Week</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-700">{completedCount}</div>
          <p className="text-[11px] text-emerald-700 font-medium">Walgreens med refill logged</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Active Caregivers</span>
            <Users2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-display text-[#081d2c]">4 / 4</div>
          <p className="text-[11px] text-[#64748B]">Sarah, David, Marcus, Beth</p>
        </div>
      </div>

      {/* Controls & Filter Ribbon */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search tasks, errands, locations, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl p-0.5 shrink-0">
              <button
                onClick={() => setViewMode('board')}
                className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'board' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
                title="Kanban Board View"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-[#00685f] shadow-xs' : 'text-[#64748B] hover:text-[#081d2c]'
                }`}
                title="List View"
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'medication', label: 'Medication' },
              { id: 'transport', label: 'Transport' },
              { id: 'groceries', label: 'Groceries' },
              { id: 'household', label: 'Household' },
              { id: 'clinical', label: 'Clinical' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c] hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Caregiver filter row */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9] overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider shrink-0">
            Assigned Caregiver:
          </span>
          <button
            onClick={() => setSelectedCaregiver(null)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              !selectedCaregiver
                ? 'bg-[#00685f] text-white shadow-2xs'
                : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#081d2c]'
            }`}
          >
            All Members ({tasks.length})
          </button>
          {[
            { name: 'Sarah Vance', label: 'Sarah (Organizer)', initials: 'SV', color: 'bg-[#00685f]' },
            { name: 'David Vance', label: 'David (Logistics)', initials: 'DV', color: 'bg-[#17324D]' },
            { name: 'Marcus Vance', label: 'Marcus (Remote)', initials: 'MV', color: 'bg-purple-700' },
            { name: 'Nurse Beth RN', label: 'Nurse Beth (Visiting)', initials: 'BN', color: 'bg-teal-700' }
          ].map(cg => {
            const count = tasks.filter(t => t.assignee.name === cg.name).length;
            const isSelected = selectedCaregiver === cg.name;
            return (
              <button
                key={cg.name}
                onClick={() => setSelectedCaregiver(isSelected ? null : cg.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#CCFBF1] text-[#0F766E] border-[#0D9488] ring-2 ring-[#0D9488]/30 shadow-2xs'
                    : 'bg-white border-[#CBD5E1] text-[#081d2c] hover:bg-slate-50'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${cg.color} text-white flex items-center justify-center text-[9px] font-bold`}>
                  {cg.initials}
                </span>
                <span>{cg.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================= */}
      {/* KANBAN BOARD VIEW */}
      {/* ======================================================= */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: To Do / Upcoming */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#081d2c]">
                  To Do
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  {todoTasks.length}
                </span>
              </div>
              <button
                onClick={() => {
                  setForm(f => ({ ...f, status: 'todo' }));
                  setShowAddModal(true);
                }}
                className="text-xs text-[#00685f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-3">
              {todoTasks.map(task => {
                const totalChecks = task.checklist?.length || 0;
                const completedChecks = task.checklist?.filter(c => c.done).length || 0;
                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-[#CBD5E1] transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      {getCategoryBadge(task.category)}
                      {getPriorityBadge(task.priority)}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#081d2c] leading-snug">
                        {task.title}
                      </h4>
                      {task.notes && (
                        <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    {task.location && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#475569]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{task.location}</span>
                      </div>
                    )}

                    {/* Interactive Sub-checklist if available */}
                    {task.checklist && task.checklist.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                          <span>Checklist:</span>
                          <span>{completedChecks} / {totalChecks} done</span>
                        </div>
                        {task.checklist.map(item => (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklistItem(task.id, item.id)}
                            className="flex items-center gap-2 cursor-pointer hover:text-[#00685f] transition-colors"
                          >
                            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                              item.done ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                            }`}>
                              {item.done && '✓'}
                            </span>
                            <span className={`text-[11px] ${item.done ? 'line-through text-slate-400' : 'text-[#081d2c]'}`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="text-[11px] font-medium text-[#081d2c]">{task.assignee.name}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{task.dueTime || task.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        onClick={() => handleMoveStatus(task.id, 'in_progress')}
                        className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-[#00685f] bg-[#E1F0FF] hover:bg-[#d0e7ff] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Start</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Mark as completed"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {todoTasks.length === 0 && (
                <div className="p-8 text-center rounded-xl border border-dashed border-[#CBD5E1] bg-white/60 text-xs text-[#64748B]">
                  No pending tasks in this filter
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress / Today */}
          <div className="bg-[#F0FDFA]/70 border border-[#CCFBF1] p-4 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#CCFBF1]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#081d2c]">
                  In Progress / Today
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {inProgressTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {inProgressTasks.map(task => {
                const totalChecks = task.checklist?.length || 0;
                const completedChecks = task.checklist?.filter(c => c.done).length || 0;
                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-white border-2 border-blue-200 shadow-xs space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      {getCategoryBadge(task.category)}
                      {getPriorityBadge(task.priority)}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#081d2c] leading-snug">
                        {task.title}
                      </h4>
                      {task.notes && (
                        <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    {task.checklist && task.checklist.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                          <span>Action Items:</span>
                          <span>{completedChecks} / {totalChecks} done</span>
                        </div>
                        {task.checklist.map(item => (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklistItem(task.id, item.id)}
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-900 transition-colors"
                          >
                            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                              item.done ? 'bg-emerald-600 text-white' : 'border border-blue-300 bg-white'
                            }`}>
                              {item.done && '✓'}
                            </span>
                            <span className={item.done ? 'line-through text-slate-400' : 'text-[#081d2c] font-medium'}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-200"
                        />
                        <div>
                          <div className="text-[11px] font-bold text-[#081d2c]">{task.assignee.name}</div>
                          <div className="text-[9px] text-[#64748B]">{task.assignee.role}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {task.dueTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        onClick={() => handleMoveStatus(task.id, 'todo')}
                        className="py-1.5 px-2 rounded-lg text-[10px] font-medium text-slate-500 hover:text-[#081d2c] hover:bg-slate-100 transition-colors"
                      >
                        ← Move to To Do
                      </button>
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete Task</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {inProgressTasks.length === 0 && (
                <div className="p-8 text-center rounded-xl border border-dashed border-[#CBD5E1] bg-white/60 text-xs text-[#64748B]">
                  No active tasks in progress
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="bg-[#F0FDF4]/70 border border-[#DCFCE7] p-4 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCFCE7]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#081d2c]">
                  Completed
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {completedTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3 opacity-95 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between gap-2">
                    {getCategoryBadge(task.category)}
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Done
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-[#081d2c] line-through text-slate-500">
                      {task.title}
                    </h4>
                    {task.notes && (
                      <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                        {task.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                        className="w-5 h-5 rounded-full object-cover grayscale"
                      />
                      <span className="text-[10px] text-slate-500">{task.assignee.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveStatus(task.id, 'in_progress')}
                        className="text-[10px] font-medium text-blue-600 hover:underline"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="text-[10px] font-medium text-slate-400 hover:text-[#00685f] hover:underline"
                      >
                        Reopen
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {completedTasks.length === 0 && (
                <div className="p-8 text-center rounded-xl border border-dashed border-[#CBD5E1] bg-white/60 text-xs text-[#64748B]">
                  No completed tasks yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* LIST / TABLE VIEW */}
      {/* ======================================================= */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[11px] uppercase font-bold text-[#64748B] bg-[#F8FAFC]">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => handleToggleTaskStatus(task.id)}
                        className="w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-[#081d2c]'}`}>
                        {task.title}
                      </div>
                      {task.notes && (
                        <div className="text-[11px] text-[#64748B] mt-0.5 truncate max-w-md">{task.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getCategoryBadge(task.category)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-[#081d2c]">{task.assignee.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B]">
                      {task.dueDate} {task.dueTime ? `• ${task.dueTime}` : ''}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create New Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#00685f]" />
                <h3 className="font-bold text-base text-[#081d2c]">Create Care Task / Errand</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pharmacy pickup, grocery run, doctor transport..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#00685f]/30 focus:border-[#00685f]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:ring-2 focus:ring-[#00685f]/30"
                  >
                    <option value="medication">Medication & Vitals</option>
                    <option value="transport">Transport & Escort</option>
                    <option value="groceries">Groceries & Supplies</option>
                    <option value="household">Household & Safety</option>
                    <option value="clinical">Clinical / Physical Therapy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Assignee Caregiver
                  </label>
                  <select
                    value={form.assigneeName}
                    onChange={(e) => setForm({ ...form, assigneeName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white focus:ring-2 focus:ring-[#00685f]/30"
                  >
                    <option value="Sarah Vance">Sarah Vance (Primary Admin)</option>
                    <option value="David Vance">David Vance (Logistics Lead)</option>
                    <option value="Marcus Vance">Marcus Vance (Remote Contributor)</option>
                    <option value="Nurse Beth RN">Nurse Beth RN (Visiting Nurse)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white"
                  >
                    <option value="normal">Routine</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    placeholder="e.g. Today, Tomorrow, Oct 26"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                    Target Time
                  </label>
                  <input
                    type="text"
                    value={form.dueTime}
                    onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Location / Destination
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. St. Vincent Plaza Suite 410 or Safeway SW 4th Ave"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Instructions & Notes
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Provide checklist items, items to buy, or parking instructions..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#CBD5E1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#00685f] hover:bg-[#005049] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
