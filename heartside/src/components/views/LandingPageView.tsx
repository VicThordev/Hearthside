import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  ShieldCheck,
  Users,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  PhoneCall,
  Activity,
  AlertTriangle,
  Pill,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  Shield,
  Eye,
  Building2,
  User,
  HeartHandshake,
  MessageSquare,
  ClipboardList,
  Sparkle,
  Radio,
  FileCheck2,
  HelpCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { ViewMode } from '../../types';

interface LandingPageViewProps {
  onEnterApp: (view?: ViewMode) => void;
  onOpenAuth?: (mode?: 'signup' | 'login') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp, onOpenAuth }) => {
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [heroTaskChecked, setHeroTaskChecked] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Can my aging parent use this easily?',
      a: 'Yes! We designed Hearthside with senior accessibility at its core. Older adults can choose simplified high-contrast tablet displays or receive gentle voice/SMS phone reminders without needing to navigate apps or memorize passwords.'
    },
    {
      q: 'Can we invite non-family members like professional caregivers or neighbors?',
      a: 'Absolutely. With granular role-based permissions, you can give visiting nurses, physical therapists, or helpful neighbors access to specific tasks or shift logs while keeping private legal files, medications, and family financial records completely hidden.'
    },
    {
      q: 'Is Hearthside HIPAA compliant?',
      a: 'Hearthside is architected following strict HIPAA standards and zero-trust security guidelines. All communications and files are encrypted using AES-256 at rest and TLS 1.3 in transit, and we execute Business Associate Agreements (BAAs) with professional care partners.'
    },
    {
      q: 'What happens if a sibling lives in another time zone?',
      a: 'Hearthside handles multi-time-zone family care circles effortlessly. Tasks, calendar appointments, and medication logs display accurately in each user’s local time zone, preventing confusion between siblings coordinating across different coasts or continents.'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#0f172a] font-sans antialiased selection:bg-[#00685f]/20 selection:text-[#00685f]">
      {/* 1. STICKY TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00685f] to-[#044e47] flex items-center justify-center text-white shadow-sm shadow-[#00685f]/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-teal-100 text-teal-100" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-[#0f172a] flex items-center gap-1.5">
                Hearthside
              </div>
              <p className="text-[11px] font-medium text-[#64748b] -mt-1 tracking-wide">
                Better Care, Together
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#475569]">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#00685f] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#00685f] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-[#00685f] transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="hover:text-[#00685f] transition-colors cursor-pointer"
            >
              Security & Privacy
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#00685f] transition-colors cursor-pointer"
            >
              About Us
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onOpenAuth ? onOpenAuth('login') : onEnterApp('auth'))}
              className="text-xs font-semibold text-[#475569] hover:text-[#0f172a] px-3 py-2 cursor-pointer transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => (onOpenAuth ? onOpenAuth('signup') : onEnterApp('auth'))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#00685f] hover:bg-[#00524b] shadow-sm shadow-[#00685f]/25 transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onEnterApp('overview')}
              title="Open Care Circle Profile"
              className="w-9 h-9 rounded-full bg-[#E6F4F1] border border-[#B2DFDB] text-[#00685f] flex items-center justify-center hover:bg-[#D4EFE9] transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO / WELCOME SECTION WITH MILD LOW-OPACITY TEAL AESTHETIC BACKGROUND */}
      <section className="relative overflow-hidden pt-14 pb-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-[#E6F4F1]/40 via-[#F0FDF9]/25 to-white border-b border-[#E2E8F0]/40">
        {/* Mild teal low-opacity ambient light glows */}
        <div className="absolute top-0 inset-x-0 h-[520px] bg-gradient-to-b from-[#00685f]/[0.06] via-[#00685f]/[0.02] to-transparent pointer-events-none -z-10" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1050px] h-[420px] bg-[#00685f]/[0.07] rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-44 left-1/4 w-[350px] h-[350px] bg-[#2DD4BF]/[0.05] rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-44 right-1/4 w-[350px] h-[350px] bg-[#00685f]/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-[#00685f]/15 text-xs font-medium text-[#334155] shadow-xs mb-8">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Trusted Family Caregiving Platform • Free 14-Day Family Trial</span>
        </div>

        {/* Hero headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f172a] tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          Caring for Someone You Love <br className="hidden sm:inline" />
          Shouldn't Fall on One Person.
        </h1>

        {/* Hero subtitle */}
        <p className="text-base sm:text-lg text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-8">
          Bring your family together to organize daily routines, share responsibilities, coordinate doctor appointments, and keep siblings aligned — with dignity, calm clarity, and quiet peace of mind.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <button
            onClick={() => (onOpenAuth ? onOpenAuth('signup') : onEnterApp('auth'))}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#00685f] hover:bg-[#00534c] text-white text-sm font-semibold shadow-md shadow-[#00685f]/25 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Your Free Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] text-sm font-semibold border border-[#E2E8F0] shadow-2xs transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#64748b]" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Trust highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[#64748b]">
          <div className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#00685f]" />
            <span>No credit card required</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#00685f]" />
            <span>Invite up to 3 members free</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00685f]" />
            <span>HIPAA & US Privacy conscious</span>
          </div>
        </div>

        {/* 3. HERO DASHBOARD PREVIEW CARD (Eleanor Vance's Care Circle) */}
        <div className="mt-14 max-w-5xl mx-auto text-left">
          <div className="bg-white rounded-2xl border border-[#CBD5E1]/70 shadow-xl overflow-hidden">
            {/* Card Header Bar */}
            <div className="bg-[#FFFFFF] border-b border-[#E2E8F0] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] border border-[#B2DFDB] text-[#00685f] font-bold text-base flex items-center justify-center shrink-0">
                  EV
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#0f172a]">
                      Eleanor Vance's Care Circle
                    </h3>
                    <span className="text-xs text-[#64748b] font-normal">
                      Age 79 • Portland, OR
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-[#10b981]">
                      All tasks covered today • On schedule
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F8F5] text-[#0D9488] border border-[#CCFBF1]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {heroTaskChecked ? '3 Completed' : '2 Completed'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                  <Clock className="w-3.5 h-3.5" />
                  {heroTaskChecked ? '0 Upcoming' : '1 Upcoming'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                  0 Overdue
                </span>
              </div>
            </div>

            {/* Notification / Feed Highlight */}
            <div className="bg-[#F0FDF9] border-b border-[#CCFBF1] px-4 sm:px-5 py-3 flex items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 sm:mt-0">
                  DV
                </div>
                <div className="text-[#0f172a]">
                  <span className="font-semibold text-[#00685f]">David Vance (Son)</span> posted a fresh care update:
                  <span className="italic text-[#334155] ml-1">
                    "Mom had a great 30-minute walk in the rose garden today! Blood pressure stable at 122/80."
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-[#64748b] shrink-0 whitespace-nowrap">
                49 mins ago
              </span>
            </div>

            {/* Card Content Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FAFCFD]">
              {/* Left Column: Today's Coordinated Schedule */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00685f]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                      Today's Coordinated Schedule
                    </h4>
                  </div>
                  <span className="text-xs font-medium text-[#64748b]">
                    Wednesday, Oct 24
                  </span>
                </div>

                {/* Schedule Item 1 */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#00685f] text-white font-bold text-xs tracking-wide shrink-0">
                      10:30 AM
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-[#0f172a]">
                        Cardiology Follow-up v. Dr. Chen
                      </h5>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        St. Vincent Clinic • Routine 6-month checkup
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#334155]">
                        <span className="w-4 h-4 rounded-full bg-[#00685f]/15 text-[#00685f] text-[9px] font-bold flex items-center justify-center">
                          DV
                        </span>
                        <span>Assigned to: <strong>David Vance (Son)</strong></span>
                      </div>
                    </div>
                  </div>
                  <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F8F5] text-[#0D9488] border border-[#CCFBF1] shrink-0">
                    Ride Confirmed
                  </span>
                </div>

                {/* Schedule Item 2 */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#0284C7] text-white font-bold text-xs tracking-wide shrink-0">
                      1:15 PM
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-[#0f172a]">
                        Physical Therapy Exercises
                      </h5>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Mobility stretch sheet • Hip flexion & light balance
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#334155]">
                        <span className="w-4 h-4 rounded-full bg-[#0284C7]/15 text-[#0284C7] text-[9px] font-bold flex items-center justify-center">
                          SV
                        </span>
                        <span>Assigned to: <strong>Sarah Vance (Daughter-in-law)</strong></span>
                      </div>
                    </div>
                  </div>
                  <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] shrink-0">
                    Completed 1:45 PM
                  </span>
                </div>

                {/* Schedule Item 3 */}
                <div className={`p-3.5 rounded-xl transition-colors border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  heroTaskChecked ? 'bg-[#F0FDF4] border-[#BBF7D0]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#0F766E] text-white font-bold text-xs tracking-wide shrink-0">
                      5:30 PM
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-[#0f172a]">
                        Heart-Healthy Dinner & Evening Meds Check
                      </h5>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Low-sodium soup, Metoprolol 25mg with glass of water
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#334155]">
                        <span className="w-4 h-4 rounded-full bg-[#0F766E]/15 text-[#0F766E] text-[9px] font-bold flex items-center justify-center">
                          NB
                        </span>
                        <span>Assigned to: <strong>Nurse Beth (Care Aide)</strong></span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setHeroTaskChecked(!heroTaskChecked)}
                    className={`self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      heroTaskChecked
                        ? 'bg-[#10B981] text-white shadow-xs'
                        : 'bg-[#00685f] hover:bg-[#00524b] text-white shadow-xs'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{heroTaskChecked ? 'Completed' : 'Check-off'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Care Circle Team & Vitals */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                      Care Circle Team
                    </span>
                    <span className="text-[11px] font-medium text-[#00685f] bg-[#E6F4F1] px-2 py-0.5 rounded-full">
                      4 Active
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#00685f] font-bold text-[10px] flex items-center justify-center">
                          DV
                        </span>
                        <div>
                          <div className="font-semibold text-[#0f172a]">David Vance</div>
                          <div className="text-[11px] text-[#64748b]">Primary Organizer/Lead</div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                          SV
                        </span>
                        <div>
                          <div className="font-semibold text-[#0f172a]">Sarah Vance</div>
                          <div className="text-[11px] text-[#64748b]">Daily Physical Care</div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                          MV
                        </span>
                        <div>
                          <div className="font-semibold text-[#0f172a]">Marcus Vance</div>
                          <div className="text-[11px] text-[#64748b]">Remote Support & Financial</div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center">
                          NB
                        </span>
                        <div>
                          <div className="font-semibold text-[#0f172a]">Nurse Beth RN</div>
                          <div className="text-[11px] text-[#64748b]">Visiting Nurse / Elder Aide</div>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                  </div>
                </div>

                {/* Recent Vitals Log */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                      Recent Vitals Log
                    </span>
                    <Activity className="w-3.5 h-3.5 text-[#00685f]" />
                  </div>
                  <div className="flex items-center justify-between py-1 text-xs border-b border-[#F1F5F9]">
                    <span className="text-[#64748b]">BP: 122/80 mmHg</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E8F8F5] text-[#0D9488]">
                      Optimal
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 text-xs">
                    <span className="text-[#64748b]">Resting Pulse: 71 bpm</span>
                    <span className="text-[10px] text-[#94a3b8]">Today 9:15 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Preview Callout */}
            <div className="bg-white border-t border-[#E2E8F0] p-3 text-center">
              <button
                onClick={() => onEnterApp('overview')}
                className="text-xs font-semibold text-[#00685f] hover:text-[#004d46] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch live interactive portal for Eleanor Vance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* 4. SECTION 2: THREE STEPS */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC] border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs font-bold tracking-widest text-[#00685f] uppercase mb-2">
            SIMPLE & INTUITIVE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight max-w-2xl mx-auto mb-4">
            From Caregiver Burnout to Shared Support in Three Steps
          </h2>
          <p className="text-sm sm:text-base text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-14">
            No complicated enterprise health software. Hearthside turns messy family group chats and missed appointments into a serene, shared rhythm.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] text-[#00685f] font-extrabold text-lg flex items-center justify-center mb-6">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                  Create Your Family Care Circle
                </h3>
                <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                  Set up a private, protected care space in 2 minutes for your parent or loved one. Easily add daily medications, regular appointments, emergency contacts, and personal care routines.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2 text-xs font-medium text-[#00685f]">
                <Clock className="w-4 h-4 text-[#00685f]" />
                <span>Quick 2-Minute Onboarding</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] text-[#00685f] font-extrabold text-lg flex items-center justify-center mb-6">
                  02
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                  Invite Your Family & Helpers
                </h3>
                <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                  Bring in siblings, adult grandchildren, visiting nurse aides, and helpful neighbors with role-based permissions tailored so each person sees exactly what they need.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2 text-xs font-medium text-[#00685f]">
                <ShieldCheck className="w-4 h-4 text-[#00685f]" />
                <span>Role-Based Safety Controls</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] text-[#00685f] font-extrabold text-lg flex items-center justify-center mb-6">
                  03
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-3">
                  Share Everyday Tasks & Stay in Sync
                </h3>
                <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                  Coordinate rides, meal deliveries, prescription refills, and morning check-ins without endless group text chains or duplicated errands.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2 text-xs font-medium text-[#00685f]">
                <Sparkles className="w-4 h-4 text-[#00685f]" />
                <span>Unified Essential Sync</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: COMPREHENSIVE TOOLSET */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-xs font-bold tracking-widest text-[#00685f] uppercase mb-2">
          COMPREHENSIVE TOOLSET
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight max-w-2xl mx-auto mb-4">
          Built For Real Family Caregiving Needs
        </h2>
        <p className="text-sm sm:text-base text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-14">
          Everything your family needs to deliver compassionate, organized care without the mental exhaustion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Feature 1 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#00685f]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] text-[#00685f] flex items-center justify-center mb-5">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] mb-2">
                Shared Care Calendar
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                Multi-caregiver scheduling with automated appointment reminders, ride assignments, and two-way sync with Google, Apple, and Outlook calendars.
              </p>
            </div>
            <div className="text-[11px] font-medium text-[#00685f] bg-[#F0FDF9] px-2.5 py-1 rounded-md inline-block self-start">
              Automatic time-zone synchronization
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#00685f]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] mb-2">
                Smart Task Delegation
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                Assign grocery runs, household maintenance, pharmacy pick-ups, and wellness checks with clear single-person ownership and unambiguous due dates.
              </p>
            </div>
            <div className="text-[11px] font-medium text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md inline-block self-start">
              One-touch completion confirmations
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#00685f]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#F0FDF9] text-[#0D9488] flex items-center justify-center mb-5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] mb-2">
                Real-Time Family Care Notes
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                A centralized chronological feed for doctor visit summaries, mood notes, and daily anecdotes. Keeps long-distance siblings informed without repeated phone calls.
              </p>
            </div>
            <div className="text-[11px] font-medium text-[#0D9488] bg-[#F0FDF9] px-2.5 py-1 rounded-md inline-block self-start">
              Photo attachments & audio clips supported
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#00685f]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-5">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] mb-2">
                Medication & Health Reminders
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                Structured dosage schedules, refill alerts, and adherence logs with visual pill identification so nobody ever wonders, "Did mom take her pills this morning?"
              </p>
            </div>
            <div className="text-[11px] font-medium text-[#0284C7] bg-[#F0F9FF] px-2.5 py-1 rounded-md inline-block self-start">
              Zero medical jargon, clean verification
            </div>
          </div>

          {/* Feature 5 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#00685f]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center mb-5">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] mb-2">
                Private Document Vault
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                Safely store digital copies of insurance cards, healthcare power of attorney documents, living wills, and doctor contact records for rapid emergency access.
              </p>
            </div>
            <div className="text-[11px] font-medium text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-1 rounded-md inline-block self-start">
              Encrypted with AES-256 at rest
            </div>
          </div>

          {/* Feature 6 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#00685f]/40 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E6F4F1] text-[#00685f] flex items-center justify-center mb-5">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] mb-2">
                Local Care Service Directory
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6">
                Direct curated access to vetted wheelchair-accessible transport, meal prep partners, adult day care programs, and vetted in-home care agencies in your area.
              </p>
            </div>
            <div className="text-[11px] font-medium text-[#00685f] bg-[#F0FDF9] px-2.5 py-1 rounded-md inline-block self-start">
              Verified community providers
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: THE HEARTHSIDE DIFFERENCE (Comparison) */}
      <section className="py-20 bg-[#F8FAFC] border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs font-bold tracking-widest text-[#00685f] uppercase mb-2">
            THE HEARTHSIDE DIFFERENCE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight max-w-2xl mx-auto mb-4">
            Transforming the Family Caregiving Experience
          </h2>
          <p className="text-sm sm:text-base text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-14">
            Caregiving often pushes one sibling to total exhaustion while others feel left out. Here is what shifts when you bring Hearthside into your family.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
            {/* Traditional Caregiving (Overwhelmed) */}
            <div className="bg-white rounded-2xl border border-rose-200/80 p-8 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-400"></div>
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 mb-3">
                TRADITIONAL CAREGIVING
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-6">
                The Overwhelmed Solo Caregiver
              </h3>

              <div className="space-y-5 text-xs sm:text-sm text-[#475569]">
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-[#0f172a]">Chaotic 45-message group texts:</strong> Important medical decisions get buried between casual chit-chat and emoji reactions.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-[#0f172a]">Sibling tension & invisible labor:</strong> The local child shoulders doctor visits, laundry, and groceries alone while others feel detached or defensive.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-[#0f172a]">Double-dosing & missed rides:</strong> No verifiable record of who picked up the prescription or who took mom to physiotherapy.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-[#0f172a]">Emotional exhaustion & burnout:</strong> Caregivers report chronic anxiety, disrupted careers, and diminished quality time with aging parents.
                  </div>
                </div>
              </div>
            </div>

            {/* Coordinated with Hearthside */}
            <div className="bg-white rounded-2xl border border-teal-200/90 p-8 shadow-xs relative overflow-hidden bg-gradient-to-b from-[#F0FDF9]/40 to-white">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00685f]"></div>
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#00685f] bg-[#E6F4F1] mb-3">
                COORDINATED WITH HEARTHSIDE
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-6">
                The Harmonious Care Circle
              </h3>

              <div className="space-y-5 text-xs sm:text-sm text-[#475569]">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0f172a]">Single, calm dashboard:</strong> Clear today view showing assigned rides, completed meds, and doctor check-ins in one spot.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0f172a]">Balanced responsibility:</strong> Remote siblings order supplies and manage billing; local siblings handle appointments without feeling abandoned.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0f172a]">Real-time verification:</strong> Instant notifications when medications are taken or when Grandma gets safely home from the clinic.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00685f] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0f172a]">Restored family relationships:</strong> Visits become meaningful family bonding moments rather than frantic crisis management operations.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Split Feature Spotlight Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto mt-10">
            {/* Banner 1: For Adult Children */}
            <div className="bg-[#EFF6FF]/70 rounded-2xl border border-[#DBEAFE] p-8 flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-white border border-[#BFDBFE] mb-3">
                  FOR ADULT CHILDREN & SIBLINGS
                </div>
                <h4 className="text-lg font-bold text-[#0f172a] mb-2">
                  Relieve Mental Overload & Coordinate Without Drama
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-5">
                  You shouldn't have to keep an entire medical binder in your head while balancing your own children, career, and household.
                </p>

                <div className="space-y-2.5 text-xs text-[#334155] mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>Eliminate 20+ repetitive weekly coordination calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>Keep remote siblings meaningfully involved in everyday support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>Instant access to emergency cards and physician numbers</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Family Plans</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Banner 2: For Parents & Older Adults */}
            <div className="bg-[#F0FDF9]/80 rounded-2xl border border-[#CCFBF1] p-8 flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#0F766E] bg-white border border-[#99F6E4] mb-3">
                  FOR PARENTS & OLDER ADULTS
                </div>
                <h4 className="text-lg font-bold text-[#0f172a] mb-2">
                  Preserve Independence, Autonomy & Dignity
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-5">
                  Receiving help shouldn't feel like losing control. Loved ones know exactly who is visiting and can participate actively without feeling like a burden.
                </p>

                <div className="space-y-2.5 text-xs text-[#334155] mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Gentle reminders by automated phone call or high-contrast screen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Know which family member is arriving for dinner or appointments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Care decisions are made in open collaboration, never behind their back</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#0F766E] font-medium italic">
                Tested with seniors aged 70-88 for intuitive usability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 5: PRICING */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-xs font-bold tracking-widest text-[#00685f] uppercase mb-2">
          FAIR & TRANSPARENT PLANS
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight max-w-2xl mx-auto mb-4">
          Invest in Family Harmony & Better Care
        </h2>
        <p className="text-sm sm:text-base text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-8">
          Start free today. Upgrade when you need extra family members or advanced medical record capabilities.
        </p>

        {/* Toggle Switch */}
        <div className="inline-flex items-center p-1 bg-[#F1F5F9] rounded-full border border-[#E2E8F0] mb-14 text-xs font-semibold">
          <button
            onClick={() => setPricingCycle('monthly')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              pricingCycle === 'monthly'
                ? 'bg-white text-[#0f172a] shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setPricingCycle('annual')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              pricingCycle === 'annual'
                ? 'bg-white text-[#0f172a] shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] font-bold text-[#00685f] bg-[#E6F4F1] px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Card 1: Starter */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-1">
                STARTER
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                Free Circle
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-[#0f172a]">$0</span>
                <span className="text-xs text-[#64748b]">/ month</span>
              </div>
              <p className="text-xs text-[#64748b] mb-6">
                Essential coordination for immediate primary care.
              </p>

              <div className="space-y-3 text-xs text-[#334155] border-t border-[#F1F5F9] pt-6 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>1 Care Circle</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Up to 3 Family Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Basic Task Delegation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Shared Calendar</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => (onOpenAuth ? onOpenAuth('signup') : onEnterApp('auth'))}
              className="w-full py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer text-center"
            >
              Get Started Free
            </button>
          </div>

          {/* Card 2: Family Plus (Most Popular) */}
          <div className="bg-white rounded-2xl border-2 border-[#00685f] p-6 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00685f] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
              MOST POPULAR
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#00685f] mb-1">
                FAMILY PLUS
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                Complete Family
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-[#0f172a]">
                  {pricingCycle === 'monthly' ? '$14.99' : '$11.99'}
                </span>
                <span className="text-xs text-[#64748b]">/ month</span>
              </div>
              <p className="text-xs text-[#64748b] mb-6">
                Ideal for siblings sharing active hands-on care.
              </p>

              <div className="space-y-3 text-xs text-[#334155] border-t border-[#F1F5F9] pt-6 mb-8">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Up to 8 Circle Members</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Unlimited Task Scheduling</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Recurring Routines</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Automated Reminders (SMS/Email)</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Shared Doctor Notes Feed</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => (onOpenAuth ? onOpenAuth('signup') : onEnterApp('auth'))}
              className="w-full py-2.5 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-xs font-bold transition-all shadow-sm shadow-[#00685f]/30 cursor-pointer text-center"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Card 3: Advanced Care */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-1">
                ADVANCED CARE
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                Family Complete
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-[#0f172a]">
                  {pricingCycle === 'monthly' ? '$24.99' : '$19.99'}
                </span>
                <span className="text-xs text-[#64748b]">/ month</span>
              </div>
              <p className="text-xs text-[#64748b] mb-6">
                Full peace of mind with medication & document vaults.
              </p>

              <div className="space-y-3 text-xs text-[#334155] border-t border-[#F1F5F9] pt-6 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Up to 15 Members & Aides</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Everything in Family Plus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Expanded Document Vault (10GB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Advanced Medication Logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Printable Physician PDF Summaries</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => (onOpenAuth ? onOpenAuth('signup') : onEnterApp('auth'))}
              className="w-full py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer text-center"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Card 4: Professional */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-1">
                PROFESSIONAL
              </div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                Care Pro
              </h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-[#0f172a]">
                  {pricingCycle === 'monthly' ? '$49.99' : '$39.99'}
                </span>
                <span className="text-xs text-[#64748b]">/ month</span>
              </div>
              <p className="text-xs text-[#64748b] mb-6">
                For professional case managers and multi-circle families.
              </p>

              <div className="space-y-3 text-xs text-[#334155] border-t border-[#F1F5F9] pt-6 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Up to 35 Caregivers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Multiple Patient Circles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Dedicated Care Concierge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Audit Trail Logging</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onEnterApp('overview')}
              className="w-full py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer text-center"
            >
              Contact Pro Sales
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-[#64748b] max-w-2xl mx-auto">
          Clear, ethical pricing. Cancel anytime in two clicks. No hidden setup fees or surprise automatic upgrades. We will send an email reminder 3 days before your trial converts.
        </p>
      </section>

      {/* 8. SECTION 6: UNCOMPROMISING PROTECTION (Security) */}
      <section id="security" className="py-20 bg-[#F8FAFC] border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs font-bold tracking-widest text-[#00685f] uppercase mb-2">
            UNCOMPROMISING PROTECTION
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight max-w-2xl mx-auto mb-4">
            Built With Healthcare-Grade Security Standards
          </h2>
          <p className="text-sm sm:text-base text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-14">
            We treat your family's personal health information with the sacred trust and privacy it demands.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Sec 1 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#00685f] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-2">
                  Role-Based Access
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Granular controls ensure non-family helpers see only relevant shifts, keeping private medical history and financial notes completely confidential.
                </p>
              </div>
            </div>

            {/* Sec 2 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-2">
                  Bank-Level Encryption
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  End-to-end TLS 1.3 protocol in transit and AES-256 bit encryption at rest for all stored records, vital logs, and shared care documents.
                </p>
              </div>
            </div>

            {/* Sec 3 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF9] text-[#0D9488] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-2">
                  Zero Ad Monetization
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  We never sell family health data, behavioral habits, or contact lists to pharmaceutical advertisers, data brokers, or insurance underwriters.
                </p>
              </div>
            </div>

            {/* Sec 4 */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#00685f] flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0f172a] mb-2">
                  HIPAA Conscious
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Architected in strict alignment with United States Department of Health and Human Services privacy rules and modern zero-trust protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECTION 7: FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-xs font-bold tracking-widest text-[#00685f] uppercase mb-2">
          HAVE QUESTIONS?
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight max-w-2xl mx-auto mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-[#64748b] max-w-2xl mx-auto leading-relaxed mb-12">
          Clear answers to help you and your family take the next step with complete confidence.
        </p>

        <div className="space-y-3 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-[#0f172a] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#00685f] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748b] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-[#64748b] leading-relaxed border-t border-[#F1F5F9]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. SECTION 8: PRE-FOOTER CTA CARD */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E6F4F1]/70 border border-[#B2DFDB] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#00685f] mb-2">
              START TOGETHER TODAY
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">
              Give your loved one the organized care they deserve.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] max-w-xl">
              Join thousands of families finding relief, clarity, and genuine harmony in shared eldercare coordination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => (onOpenAuth ? onOpenAuth('signup') : onEnterApp('auth'))}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#00685f] hover:bg-[#00524b] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-[#00685f]/30 transition-all cursor-pointer hover:shadow-md"
            >
              Start Your Free Plan
            </button>
            <button
              onClick={() => onEnterApp('overview')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs sm:text-sm font-semibold border border-[#CBD5E1] transition-all cursor-pointer"
            >
              Talk with a Care Specialist
            </button>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-10 pb-12 border-b border-[#F1F5F9]">
            {/* Left Brand Col */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00685f] flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-white text-white" />
                </div>
                <div>
                  <span className="font-bold text-[#0f172a] text-lg">Hearthside</span>
                  <div className="text-[10px] text-[#64748b] -mt-1 font-medium">
                    Better Care, Together
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#64748b] leading-relaxed max-w-sm">
                Empowering families and caregivers with compassionate coordination tools. Streamline daily medications, vitals, medical records, and physician instructions within one unified, reassuring hub.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[10px] font-semibold text-[#475569]">
                  <Check className="w-3 h-3 text-[#00685f]" />
                  WCAG 2.2 AA Compliant
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E6F4F1] text-[10px] font-semibold text-[#00685f]">
                  <ShieldCheck className="w-3 h-3" />
                  HIPAA Ready Security
                </span>
              </div>
            </div>

            {/* Links Col 1: Product */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
                Product
              </div>
              <ul className="space-y-2 text-[#64748b]">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-[#00685f]">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#00685f]">How It Works</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-[#00685f]">Pricing Plans</button></li>
                <li><button onClick={() => scrollToSection('security')} className="hover:text-[#00685f]">Security Architecture</button></li>
              </ul>
            </div>

            {/* Links Col 2: Care Resources */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
                Care Resources
              </div>
              <ul className="space-y-2 text-[#64748b]">
                <li><button onClick={() => onEnterApp('care-notes')} className="hover:text-[#00685f]">Care Guides</button></li>
                <li><button onClick={() => onEnterApp('overview')} className="hover:text-[#00685f]">Medication Safety</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-[#00685f]">Family FAQ</button></li>
                <li><button onClick={() => onEnterApp('directory')} className="hover:text-[#00685f]">Support Center</button></li>
              </ul>
            </div>

            {/* Links Col 3: Company */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
                Company
              </div>
              <ul className="space-y-2 text-[#64748b]">
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#00685f]">About Us</button></li>
                <li><button onClick={() => onEnterApp('care-team')} className="hover:text-[#00685f]">Contact Care Team</button></li>
                <li><span className="text-[#94a3b8]">Careers</span></li>
                <li><span className="text-[#94a3b8]">Press Room</span></li>
              </ul>
            </div>

            {/* Links Col 4: Legal & Privacy */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
                Legal & Privacy
              </div>
              <ul className="space-y-2 text-[#64748b]">
                <li><button onClick={() => scrollToSection('security')} className="hover:text-[#00685f]">Terms of Service</button></li>
                <li><button onClick={() => scrollToSection('security')} className="hover:text-[#00685f]">Privacy Policy</button></li>
                <li><button onClick={() => scrollToSection('security')} className="hover:text-[#00685f]">Cookie Preferences</button></li>
                <li><button onClick={() => scrollToSection('security')} className="hover:text-[#00685f]">HIPAA Statement</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
            <p>© 2026 Hearthside Health, Inc. All rights reserved. Thoughtfully crafted for families navigating eldercare together.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => scrollToSection('security')} className="hover:text-[#64748b]">Privacy</button>
              <button onClick={() => scrollToSection('security')} className="hover:text-[#64748b]">Terms</button>
              <button onClick={() => onEnterApp('overview')} className="hover:text-[#64748b]">Care Concierge</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Care Portal Launcher Pill (Bottom-Right for easy navigation back to app anytime) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => onEnterApp('overview')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#081d2c] text-white text-xs font-semibold shadow-xl hover:bg-[#00685f] hover:scale-105 transition-all cursor-pointer border border-white/20 group"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>Open Eleanor's Care Circle</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
