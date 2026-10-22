export type ViewMode = 
  | 'calendar' 
  | 'care-team' 
  | 'care-notes' 
  | 'vault' 
  | 'settings' 
  | 'overview' 
  | 'tasks' 
  | 'directory' 
  | 'reports'
  | 'landing'
  | 'auth';

export interface Caregiver {
  id: string;
  name: string;
  initials: string;
  role: string;
  relationship: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  isAccountOwner?: boolean;
  isPrimaryContact?: boolean;
  assignedTasksCount: number;
  assignedTasksNote?: string;
  permissionsNote: string;
  tier: 'Primary Organizer' | 'Collaborator' | 'Restricted Helper' | 'Clinical';
  licenseNumber?: string;
  organization?: string;
  expirationDate?: string;
  canEditSchedule?: boolean;
  hasVaultAccess?: boolean;
  isOnline?: boolean;
  lastActive?: string;
}

export interface PendingInvite {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  relation: string;
  sentDate: string;
  expiresInDays: number;
  statusNote: string;
  isHospitalApprovalPending?: boolean;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  dateStr: string;
  category: 'medical' | 'vitals' | 'transport' | 'errands' | 'social';
  assigneeName: string;
  assigneeInitials: string;
  assigneeRole?: string;
  location?: string;
  driver?: string;
  isToday?: boolean;
  isRideConfirmed?: boolean;
  description?: string;
  duration?: string;
  address?: string;
  mapDistanceNote?: string;
  routeMapImage?: string;
  primaryTransport?: {
    name: string;
    role: string;
    status: 'Confirmed' | 'Pending' | 'Declined';
  };
  backupTransport?: {
    name: string;
    role: string;
    status: 'Standby' | 'Assigned';
  };
  checklist?: { id: string; text: string; completed: boolean }[];
  attachedDocName?: string;
  attachedDocSize?: string;
  attachedDocUploader?: string;
  completed?: boolean;
}

export interface CareNote {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorRole: string;
  authorAvatar: string;
  timestamp: string;
  durationNote?: string;
  title: string;
  content: string;
  category: 'medical' | 'vitals' | 'errands' | 'social' | 'critical';
  isPinned?: boolean;
  isCritical?: boolean;
  pinnedNotice?: string;
  attachedDocName?: string;
  attachedDocSize?: string;
  acknowledgments?: { count: number; total: number; userAcknowledged: boolean };
  image?: string;
  imageCaption?: string;
  vitals?: {
    bloodPressure?: string;
    bpStatus?: string;
    heartPulse?: number;
    pulseStatus?: string;
    hydrationCurrentOz?: number;
    hydrationGoalOz?: number;
  };
  restockedItems?: string[];
  receiptAmount?: string;
  cognitiveNote?: string;
  reactions: { likes: number; users: string[]; hasLiked?: boolean };
  comments: {
    id: string;
    authorName: string;
    authorInitials: string;
    authorAvatar?: string;
    timestamp: string;
    text: string;
  }[];
}

export interface VaultDocument {
  id: string;
  title: string;
  filename: string;
  fileSize: string;
  category: 'insurance' | 'legal' | 'clinical' | 'prescriptions' | 'home-safety';
  categoryLabel: string;
  badge?: string;
  isRestricted?: boolean;
  isPinned?: boolean;
  isVerified?: boolean;
  verifiedNotice?: string;
  previewThumbnail?: string;
  policyHolder?: string;
  memberId?: string;
  rxBinPcn?: string;
  validUntil?: string;
  watermarkNote?: string;
  primaryProxy?: string;
  alternateProxy?: string;
  hasDnr?: boolean;
  hasPolst?: boolean;
  physicianName?: string;
  highlights?: string;
  allergies?: { name: string; severity: string }[];
  activeMeds?: string[];
  pharmacyNotice?: string;
  inspectorNotice?: string;
  nextInspection?: string;
  downloadCount?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  planName: string;
  amount: string;
  status: 'Paid' | 'Processing';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'medication' | 'invite' | 'comment';
}
