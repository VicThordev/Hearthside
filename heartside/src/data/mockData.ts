import { Caregiver, PendingInvite, ScheduleEvent, CareNote, VaultDocument, Invoice, NotificationItem } from '../types';

export const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: 'sarah-vance',
    name: 'Sarah Vance',
    initials: 'SV',
    role: 'Primary Organizer',
    relationship: 'Daughter',
    email: 'sarah.vance@hearthcare.org',
    phone: '(503) 555-0192',
    location: 'Portland, OR (5 mi away)',
    avatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
    isAccountOwner: true,
    isPrimaryContact: true,
    assignedTasksCount: 4,
    assignedTasksNote: '4 Assigned Weekly Tasks',
    permissionsNote: 'Admin Permissions • Full Vault Control',
    tier: 'Primary Organizer',
    canEditSchedule: true,
    hasVaultAccess: true,
    isOnline: true,
    lastActive: 'Active now • At residence'
  },
  {
    id: 'david-vance',
    name: 'David Vance',
    initials: 'DV',
    role: 'Collaborator',
    relationship: 'Son (Local)',
    email: 'david.vance@gmail.com',
    phone: '(503) 555-0144',
    location: 'Beaverton, OR',
    avatar: '/src/assets/images/david_vance_avatar_1792204267362.jpg',
    isAccountOwner: false,
    isPrimaryContact: false,
    assignedTasksCount: 3,
    assignedTasksNote: '3 Assigned Tasks (Cardiology & Groceries)',
    permissionsNote: 'Can Edit Schedules & Notes',
    tier: 'Collaborator',
    canEditSchedule: true,
    hasVaultAccess: true,
    isOnline: false,
    lastActive: 'Viewed 42 min ago'
  },
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    initials: 'MV',
    role: 'Collaborator',
    relationship: 'Son (Chicago)',
    email: 'm.vance@archstudio.net',
    phone: '(312) 555-0188',
    location: 'Chicago, IL (CST 1 hr ahead)',
    avatar: '/src/assets/images/marcus_vance_avatar_1792204268376.jpg',
    isAccountOwner: false,
    isPrimaryContact: false,
    assignedTasksCount: 1,
    assignedTasksNote: '1 Task (Sunday Family Video Call)',
    permissionsNote: 'Calendar & Journal Viewing Only',
    tier: 'Collaborator',
    canEditSchedule: false,
    hasVaultAccess: true,
    isOnline: false,
    lastActive: 'Viewed 2h ago • Chicago'
  },
  {
    id: 'nurse-beth',
    name: 'Nurse Beth RN',
    initials: 'BN',
    role: 'Restricted Helper',
    relationship: 'Visiting Nurse • Cascade Health',
    email: 'elizabeth.holland@cascadehealth.org',
    phone: '(503) 555-0199',
    location: 'Cascade Health Services',
    avatar: '/src/assets/images/nurse_beth_avatar_1792204268095.jpg',
    isAccountOwner: false,
    isPrimaryContact: false,
    licenseNumber: 'RN-88921-OR',
    organization: 'Cascade Health',
    expirationDate: 'Dec 31, 2025',
    assignedTasksCount: 5,
    assignedTasksNote: 'Morning Vitals & Physical Therapy Log',
    permissionsNote: 'No access to family chat or bills',
    tier: 'Restricted Helper',
    canEditSchedule: true,
    hasVaultAccess: false,
    isOnline: false,
    lastActive: 'Viewed 15 min ago'
  }
];

export const INITIAL_PENDING_INVITES: PendingInvite[] = [
  {
    id: 'claire-vance',
    name: 'Aunt Claire Vance',
    initials: 'AC',
    email: 'claire.vance42@outlook.com',
    role: 'Family Member',
    relation: 'Sister of Eleanor',
    sentDate: 'Oct 24, 2024',
    expiresInDays: 4,
    statusNote: 'Invite link viewed 1x'
  },
  {
    id: 'dr-robert-miller',
    name: 'Dr. Robert Miller, MD',
    initials: 'RM',
    email: 'r.miller@nwcardiology.med',
    role: 'Physician / Read-Only',
    relation: 'Clinical Vault Only',
    sentDate: 'Oct 26, 2024',
    expiresInDays: 6,
    statusNote: 'Awaiting hospital approval',
    isHospitalApprovalPending: true
  }
];

export const INITIAL_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'event-mon-1',
    title: 'Morning Vitals & Meds',
    time: '8:30 AM',
    day: 'mon',
    dateStr: 'Mon Oct 21',
    category: 'vitals',
    assigneeName: 'Nurse Beth',
    assigneeInitials: 'BN',
    completed: true
  },
  {
    id: 'event-mon-2',
    title: 'Meal Delivery',
    time: '1:00 PM',
    day: 'mon',
    dateStr: 'Mon Oct 21',
    category: 'errands',
    assigneeName: 'David',
    assigneeInitials: 'DV',
    completed: true
  },
  {
    id: 'event-tue-1',
    title: 'Physical Therapy',
    time: '10:00 AM',
    day: 'tue',
    dateStr: 'Tue Oct 22',
    category: 'vitals',
    assigneeName: 'In-home',
    assigneeInitials: 'PT',
    completed: true
  },
  {
    id: 'event-wed-1',
    title: 'Morning Vitals & Meds',
    time: '8:30 AM',
    day: 'wed',
    dateStr: 'Wed Oct 23',
    category: 'vitals',
    assigneeName: 'Nurse Beth',
    assigneeInitials: 'BN',
    completed: true
  },
  {
    id: 'event-wed-2',
    title: 'Prescription Refill Pickup',
    time: '3:30 PM',
    day: 'wed',
    dateStr: 'Wed Oct 23',
    category: 'errands',
    assigneeName: 'Sarah Vance',
    assigneeInitials: 'SV',
    completed: true
  },
  {
    id: 'event-thu-1',
    title: 'Vitals: BP Check',
    time: '8:30 AM',
    day: 'thu',
    dateStr: 'Thu Oct 24',
    category: 'vitals',
    assigneeName: 'Nurse Beth',
    assigneeInitials: 'BN',
    completed: true
  },
  {
    id: 'event-thu-2',
    title: 'Dr. Chen Cardiology Follow-Up',
    time: '11:30 AM – 12:45 PM',
    day: 'thu',
    dateStr: 'Today, Oct 24',
    category: 'medical',
    assigneeName: 'Sarah Vance',
    assigneeInitials: 'SV',
    location: 'St. Vincent Plaza',
    driver: 'Sarah Vance',
    isToday: true,
    isRideConfirmed: true,
    description: 'Bi-annual hypertension medication review and EKG scan.',
    duration: '45 min duration',
    address: 'St. Vincent Medical Plaza, Suite 410, West Pavilion, 9155 SW Barnes Rd, Portland, OR',
    mapDistanceNote: "14 mins away from Eleanor's Residence",
    routeMapImage: '/src/assets/images/portland_care_route_map_1792204249066.jpg',
    primaryTransport: {
      name: 'Sarah Vance',
      role: 'Primary Driver & In-Clinic Companion',
      status: 'Confirmed'
    },
    backupTransport: {
      name: 'David Vance',
      role: 'Backup Driver / On Standby',
      status: 'Standby'
    },
    checklist: [
      { id: 'c1', text: 'Bring Medicare Card & Supplemental ID', completed: true },
      { id: 'c2', text: 'Review & hand over 30-day BP log sheet', completed: false },
      { id: 'c3', text: 'Discuss morning dizziness with 20mg Lisinopril dosage', completed: false }
    ],
    attachedDocName: 'Recent_Cardiology_Report_2024.pdf',
    attachedDocSize: '1.4 MB',
    attachedDocUploader: 'Nurse Beth',
    completed: false
  },
  {
    id: 'event-thu-3',
    title: 'Weekly Family Video Call',
    time: '4:00 PM',
    day: 'thu',
    dateStr: 'Thu Oct 24',
    category: 'social',
    assigneeName: 'Marcus (Zoom)',
    assigneeInitials: 'MV',
    completed: false
  },
  {
    id: 'event-fri-1',
    title: 'Morning Vitals & Meds',
    time: '8:30 AM',
    day: 'fri',
    dateStr: 'Fri Oct 25',
    category: 'vitals',
    assigneeName: 'Nurse Beth',
    assigneeInitials: 'BN',
    completed: false
  },
  {
    id: 'event-fri-2',
    title: 'Housekeeping & Linens',
    time: '2:00 PM',
    day: 'fri',
    dateStr: 'Fri Oct 25',
    category: 'errands',
    assigneeName: 'David & Aide',
    assigneeInitials: 'DV',
    completed: false
  },
  {
    id: 'event-sat-1',
    title: 'Garden Stroll & Tea',
    time: '10:30 AM',
    day: 'sat',
    dateStr: 'Sat Oct 26',
    category: 'social',
    assigneeName: 'Sarah & Eleanor',
    assigneeInitials: 'SV',
    completed: false
  },
  {
    id: 'event-sun-1',
    title: 'Family Sunday Dinner',
    time: '12:30 PM',
    day: 'sun',
    dateStr: 'Sun Oct 27',
    category: 'social',
    assigneeName: 'Whole Vance Family',
    assigneeInitials: 'VF',
    completed: false
  }
];

export const INITIAL_CARE_NOTES: CareNote[] = [
  {
    id: 'note-pinned-1',
    authorId: 'sarah-vance',
    authorName: 'Sarah Vance',
    authorInitials: 'SV',
    authorRole: 'Primary Care Organizer',
    authorAvatar: '/src/assets/images/sarah_vance_avatar_1792204247520.jpg',
    timestamp: 'Today at 9:15 AM',
    durationNote: 'Dr. Christopher Chen\'s Clinic (St. Jude Medical)',
    title: 'Cardiologist Follow-up Notes & Prescription Adjustment',
    category: 'critical',
    isPinned: true,
    isCritical: true,
    pinnedNotice: 'Pinned by Primary Organizer',
    content: `Required Immediate Action Items:\n• Lisinopril increased: Adjusted to 20mg once daily in the morning with water (previously 10mg). New refill bottle placed in morning pill organizer tray.\n• Mandatory BP Check: Record seated blood pressure every day at 6:30 PM before Eleanor's evening tea. If systolic is >140, message Sarah instantly.\n• Lab Scheduled: Serum potassium lab draw scheduled for next Thursday at 8:00 AM (Quest Diagnostics). Transportation confirmed.`,
    attachedDocName: 'Chen_Clinic_Summary_Oct.pdf',
    attachedDocSize: '1.4 MB',
    acknowledgments: { count: 3, total: 4, userAcknowledged: true },
    reactions: { likes: 4, users: ['David Vance', 'Marcus Vance', 'Nurse Beth RN', 'Sarah Vance'], hasLiked: true },
    comments: []
  },
  {
    id: 'note-feed-1',
    authorId: 'nurse-beth',
    authorName: 'Nurse Beth RN',
    authorInitials: 'BN',
    authorRole: 'In-Home Nurse',
    authorAvatar: '/src/assets/images/nurse_beth_avatar_1792204268095.jpg',
    timestamp: 'Today at 11:30 AM',
    durationNote: '45 min Physical Therapy & Vitals',
    title: 'Morning Physical Therapy & Hydration Check-in',
    category: 'vitals',
    content: `Eleanor was energetic and eager to head into the sunroom for physical therapy today! We completed 18 minutes of seated calf flexes and gentle balance reaches along the garden railing. Afterward, she drank a 12 oz lemon-infused electrolyte water with zero complaints. No shortness of breath or dizziness noted during standing transitions.`,
    image: '/src/assets/images/care_sunroom_activity_1792204248670.jpg',
    imageCaption: 'Garden sunroom stretches (11:15 AM)',
    vitals: {
      bloodPressure: '122/80',
      bpStatus: 'Seated • Normal Range',
      heartPulse: 71,
      pulseStatus: 'bpm • Steady',
      hydrationCurrentOz: 48,
      hydrationGoalOz: 64
    },
    reactions: { likes: 3, users: ['Sarah Vance', 'David Vance', 'Marcus Vance'], hasLiked: true },
    comments: [
      {
        id: 'c-1',
        authorName: 'David Vance',
        authorInitials: 'DV',
        timestamp: '11:48 AM',
        text: 'She looks wonderful in the sunroom! So glad the leg tightness subsided. Thanks Beth!'
      },
      {
        id: 'c-2',
        authorName: 'Sarah Vance',
        authorInitials: 'SV',
        timestamp: '12:02 PM',
        text: 'Praise God. I\'ll make sure she drinks another glass when I drop by with dinner tonight.'
      }
    ]
  },
  {
    id: 'note-feed-2',
    authorId: 'david-vance',
    authorName: 'David Vance',
    authorInitials: 'DV',
    authorRole: 'Son / Local Caregiver',
    authorAvatar: '/src/assets/images/david_vance_avatar_1792204267362.jpg',
    timestamp: 'Yesterday at 4:45 PM',
    durationNote: 'Grocery & Pharmacy Trip',
    receiptAmount: '$48.32',
    title: 'Safeway Grocery Run & Pharmacy Pickup Complete',
    category: 'errands',
    content: `Finished the weekly run to Safeway on 4th Avenue and picked up Eleanor's adjusted medication at the pharmacy counter. Mom specifically asked for decaf organic peppermint tea, which I placed in the top pantry cabinet right next to her favorite mug.`,
    restockedItems: [
      'Lisinopril 20mg 90-day bottle',
      'Traditional Medicinals Peppermint Tea',
      'Organic whole milk & Greek yogurt',
      'Ensure Plus Vanilla (pack of 6)'
    ],
    reactions: { likes: 4, users: ['Sarah Vance', 'Marcus Vance', 'Nurse Beth RN'], hasLiked: false },
    comments: []
  },
  {
    id: 'note-feed-3',
    authorId: 'marcus-vance',
    authorName: 'Marcus Vance',
    authorInitials: 'MV',
    authorRole: 'Son (Remote • Chicago)',
    authorAvatar: '/src/assets/images/marcus_vance_avatar_1792204268376.jpg',
    timestamp: '2 days ago',
    durationNote: '35-min Video Call',
    title: 'Sunday Afternoon Video Call Recap',
    category: 'social',
    content: `Had the sweetest Sunday call with Mom on her iPad! Her voice was clear, lively, and in great humor. She spent 20 minutes reminiscing about old trips to Cape Cod and asked me to send framed prints of the grandchildren from our trip last August. Memory recall was sharp as a tack; she remembered everyone's upcoming birthdays without hesitation.`,
    cognitiveNote: 'No signs of confusion or fatigue. Expressed excitement for Sarah\'s roast dinner this weekend.',
    reactions: { likes: 5, users: ['Sarah Vance', 'David Vance', 'Nurse Beth RN'], hasLiked: true },
    comments: []
  }
];

export const INITIAL_VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-1',
    title: 'Medicare Part D & Supplemental Insurance Card 2024.pdf',
    filename: 'Medicare_Part_D_Supplemental_Card_2024.pdf',
    fileSize: '2.4 MB',
    category: 'insurance',
    categoryLabel: 'Insurance & Coverage',
    isPinned: true,
    isVerified: true,
    verifiedNotice: 'Card verified • Uploaded Oct 12, 2024 by Sarah Vance (Daughter)',
    policyHolder: 'Eleanor M. Vance',
    memberId: '1EG4-TE8-MA92',
    rxBinPcn: '004336 / MEDDPRX',
    validUntil: 'Dec 31, 2025. Accepted at Providence St. Vincent and Walgreens Pharmacy (Cedar Hills).',
    watermarkNote: 'Watermarked • Exp: 14 months',
    downloadCount: 14
  },
  {
    id: 'doc-2',
    title: 'Advance Health Care Directive & Durable POA.pdf',
    filename: 'Advance_Health_Care_Directive_Durable_POA.pdf',
    fileSize: '4.1 MB',
    category: 'legal',
    categoryLabel: 'Legal & Directives',
    isRestricted: true,
    badge: 'Notarized & Signed',
    verifiedNotice: 'Executed March 14, 2023 with Oregon Notary Seal • Restricted to Primary Organizers',
    primaryProxy: 'Sarah Vance',
    alternateProxy: 'Marcus Vance',
    hasDnr: true,
    hasPolst: true,
    watermarkNote: 'Requires 2FA verification to unlock raw document',
    downloadCount: 4
  },
  {
    id: 'doc-3',
    title: 'Dr. Chen Cardiology Consultation Summary - Oct 2024.pdf',
    filename: 'Dr_Chen_Cardiology_Summary_Oct_2024.pdf',
    fileSize: '1.4 MB',
    category: 'clinical',
    categoryLabel: 'Cardiology • Dr. Chen, MD',
    verifiedNotice: 'Providence Heart Clinic • Visit date: Oct 18, 2024 • Follow-up scheduled April 2025',
    physicianName: 'Dr. Christopher Chen, MD',
    highlights: 'Patient exhibits stable sinus rhythm. Mild hypertension controlled under updated Lisinopril 10mg. Recommend continuing daily 20-minute assisted walking and reduced sodium intake under 1,500mg/day. Echocardiogram: Normal EF (58%). 3 Exhibits attached (ECG Strip, Labs)',
    downloadCount: 8
  },
  {
    id: 'doc-4',
    title: 'Current Prescriptions & Allergy Sheet.pdf',
    filename: 'Current_Prescriptions_Allergy_Sheet_Oct2024.pdf',
    fileSize: '820 KB',
    category: 'prescriptions',
    categoryLabel: 'Active Prescription • Updated 2 days ago • EMT Fast-Scan',
    verifiedNotice: 'Synced with Cedar Hills Walgreens Pharmacy • Verified by Pharmacist J. Miller',
    allergies: [
      { name: 'Penicillin', severity: 'Severe - Anaphylaxis' },
      { name: 'Sulfa Drugs', severity: 'Hives/Rash' }
    ],
    activeMeds: [
      'Lisinopril (10mg daily, now 20mg)',
      'Atorvastatin (20mg night)',
      'Metformin (500mg with breakfast)',
      'Vitamin D3 (2000 IU)'
    ],
    downloadCount: 22
  },
  {
    id: 'doc-5',
    title: 'Home Safety Inspection & Grab-Bar Installation Manual.pdf',
    filename: 'Home_Safety_Inspection_GrabBar_Manual.pdf',
    fileSize: '5.8 MB',
    category: 'home-safety',
    categoryLabel: 'Home Safety & Mobility',
    verifiedNotice: 'Inspected by Portland Senior Safety Solutions • Completed Aug 29, 2024',
    previewThumbnail: '/src/assets/images/home_safety_grab_bar_1792204248572.jpg',
    highlights: 'Includes warranty certificates, stud locator diagrams for master bathroom walk-in shower, ramp incline schematics, and 24-hr contractor hotline for maintenance.',
    nextInspection: 'Next inspection recommendation: August 2025',
    downloadCount: 6
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-1024',
    date: 'Oct 24, 2024',
    planName: 'Family Plus — Monthly Subscription',
    amount: '$14.99',
    status: 'Paid'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-0924',
    date: 'Sep 24, 2024',
    planName: 'Family Plus — Monthly Subscription',
    amount: '$14.99',
    status: 'Paid'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2024-0824',
    date: 'Aug 24, 2024',
    planName: 'Family Plus — Monthly Subscription',
    amount: '$14.99',
    status: 'Paid'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Prescription Dose Adjustment',
    message: 'Sarah Vance updated Lisinopril morning dosage to 20mg.',
    time: '9:15 AM',
    read: false,
    type: 'medication'
  },
  {
    id: 'n-2',
    title: 'Ride Confirmed for Dr. Chen Visit',
    message: 'Sarah Vance confirmed pickup for 11:15 AM today.',
    time: '10:00 AM',
    read: false,
    type: 'alert'
  },
  {
    id: 'n-3',
    title: 'Vitals Logged by Nurse Beth',
    message: 'BP 122/80 mmHg recorded after morning physical therapy.',
    time: '11:32 AM',
    read: false,
    type: 'comment'
  }
];

export const AUDIT_LOG_EVENTS = [
  { id: 'al-1', time: 'Today 11:32 AM', user: 'Nurse Beth RN', action: 'Logged Vitals & Therapy Session', target: 'Daily Journal #8812', ip: '172.56.41.98' },
  { id: 'al-2', time: 'Today 09:18 AM', user: 'Sarah Vance', action: 'Pinned Medication Change Note', target: 'Prescription Ledger (Lisinopril)', ip: '73.164.22.10' },
  { id: 'al-3', time: 'Today 08:30 AM', user: 'Nurse Beth RN', action: 'Accessed Clinical Med Sheet', target: 'Current Prescriptions.pdf', ip: '172.56.41.98' },
  { id: 'al-4', time: 'Yesterday 04:46 PM', user: 'David Vance', action: 'Logged Pharmacy Receipt', target: 'Household Ledger ($48.32)', ip: '67.183.110.45' },
  { id: 'al-5', time: 'Oct 23, 03:15 PM', user: 'Sarah Vance', action: 'Exported Physician Appointment Note', target: 'Dr_Chen_Cardiology.pdf', ip: '73.164.22.10' },
  { id: 'al-6', time: 'Oct 22, 10:14 AM', user: 'Portland Heart Clinic', action: 'Automated EHR Lab Synchronization', target: 'Potassium Panel #9042', ip: '198.143.44.12' },
  { id: 'al-7', time: 'Oct 21, 01:20 PM', user: 'David Vance', action: 'Checked off Meal Delivery task', target: 'Care Schedule #412', ip: '67.183.110.45' },
  { id: 'al-8', time: 'Oct 20, 08:00 AM', user: 'System Relay', action: 'Verified Backup & AES Key Integrity', target: 'SHA256 Checksum Verified', ip: '10.0.1.4' }
];
