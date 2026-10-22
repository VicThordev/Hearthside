import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  Mail,
  Smartphone,
  Shield,
  Layers,
  Sparkles,
  ArrowLeft,
  X,
  PhoneCall,
  Tablet,
  CheckCircle2
} from 'lucide-react';
import { ViewMode } from '../../types';

interface AuthViewProps {
  initialMode?: 'signup' | 'login';
  onSuccess: (view?: ViewMode) => void;
  onBackToLanding: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'signup',
  onSuccess,
  onBackToLanding
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [fullName, setFullName] = useState('Sarah Vance');
  const [email, setEmail] = useState('sarah.vance@example.com');
  const [password, setPassword] = useState('Hearthside2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [hasInviteCode, setHasInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('VANCE-PORTLAND-79');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showSeniorHelpModal, setShowSeniorHelpModal] = useState(false);
  const [seniorPin, setSeniorPin] = useState('');
  const [seniorPinSuccess, setSeniorPinSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, text: 'Empty', color: 'bg-slate-200' };
    if (pwd.length < 6) return { level: 1, text: 'Weak', color: 'bg-rose-500' };
    if (pwd.length < 8) return { level: 2, text: 'Fair', color: 'bg-amber-500' };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9!@#$%^&*]/.test(pwd)) {
      return { level: 4, text: 'Strong', color: 'bg-emerald-600' };
    }
    return { level: 3, text: 'Good', color: 'bg-teal-600' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Successfully authenticated, navigate into Eleanor Vance's Care Circle
    onSuccess('overview');
  };

  const handleMagicLink = () => {
    setMagicLinkSent(true);
    setTimeout(() => {
      setMagicLinkSent(false);
    }, 4000);
  };

  const handleSeniorPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seniorPin.length === 4) {
      setSeniorPinSuccess(true);
      setTimeout(() => {
        onSuccess('overview');
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F6FA] text-[#0f172a] font-sans antialiased py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative selection:bg-[#00685f]/20 selection:text-[#00685f]">
      {/* Return to Landing Button */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#00685f] bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#CBD5E1]/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </button>

        <span className="text-[11px] font-medium text-[#64748b]">
          Eleanor Vance's Care Circle Demo
        </span>
      </div>

      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div
          onClick={onBackToLanding}
          className="w-13 h-13 rounded-full bg-[#00685f] text-white flex items-center justify-center shadow-md shadow-[#00685f]/25 mb-3 cursor-pointer hover:scale-105 transition-transform"
        >
          <Heart className="w-6 h-6 fill-white text-white" />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-[#0f172a]">
          Hearthside
        </h1>
        <p className="text-xs font-semibold text-[#00685f] mt-0.5 tracking-wide">
          Better Care, Together.
        </p>

        {/* Security Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F4F1] border border-[#CCE8E2] text-[11px] font-medium text-[#00685f] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HIPAA & State Privacy Compliant • 256-bit Encrypted</span>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-6 sm:p-9 relative">
        {/* Toggle Pills (Sign Up / Log In) */}
        <div className="grid grid-cols-2 p-1 bg-[#EFF6FF]/70 rounded-2xl mb-7 border border-[#E0EBF7]">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#0f172a] shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#0f172a] shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Header Copy */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
            {mode === 'signup'
              ? 'Create your Caregiver account'
              : 'Welcome back to your Care Circle'}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mt-1">
            {mode === 'signup'
              ? 'Join over 12,000 families bringing calm, dignity, and shared coordination to loved ones.'
              : "Sign in to check Eleanor Vance's daily care schedule and coordinate with family."}
          </p>
        </div>

        {/* Social Auth Buttons */}
        <div className="space-y-3 mb-6">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => onSuccess('overview')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-[#0f172a] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Continue with Apple */}
          <button
            type="button"
            onClick={() => onSuccess('overview')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-[#0f172a] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.68-.82 1.13-1.96 1.01-3.1-.97.04-2.15.65-2.85 1.47-.61.71-1.14 1.88-1 2.99 1.08.08 2.16-.54 2.84-1.36z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full border-t border-[#E2E8F0]"></div>
          <span className="bg-white px-3 text-[10px] font-bold text-[#64748b] uppercase tracking-wider whitespace-nowrap">
            OR CONTINUE WITH SECURE EMAIL
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#0f172a] mb-1.5">
                <label htmlFor="fullName">Your Full Name</label>
                <span className="text-[11px] font-normal text-[#94a3b8]">First & Last</span>
              </div>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Vance"
                className="w-full px-4 py-3 rounded-xl bg-[#EFF6FF]/60 border border-transparent focus:border-[#00685f] focus:bg-white text-xs sm:text-sm text-[#0f172a] outline-hidden transition-all placeholder:text-[#94a3b8]"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#0f172a] mb-1.5">
              <label htmlFor="emailAddress">Email Address</label>
              <span className="text-[11px] font-normal text-[#94a3b8]">Private & Verified</span>
            </div>
            <input
              id="emailAddress"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah.vance@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#EFF6FF]/60 border border-transparent focus:border-[#00685f] focus:bg-white text-xs sm:text-sm text-[#0f172a] outline-hidden transition-all placeholder:text-[#94a3b8]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#0f172a] mb-1.5">
              <label htmlFor="accountPassword">Account Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to ' + email)}
                  className="text-[11px] font-medium text-[#00685f] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="accountPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#EFF6FF]/60 border border-transparent focus:border-[#00685f] focus:bg-white text-xs sm:text-sm text-[#0f172a] outline-hidden transition-all placeholder:text-[#94a3b8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#64748b]" />}
              </button>
            </div>

            {/* Password strength bars for Sign Up */}
            {mode === 'signup' && (
              <div className="mt-2.5 space-y-1.5">
                <div className="grid grid-cols-4 gap-1.5">
                  <div className={`h-1.5 rounded-full transition-colors ${strength.level >= 1 ? strength.color : 'bg-slate-200'}`} />
                  <div className={`h-1.5 rounded-full transition-colors ${strength.level >= 2 ? strength.color : 'bg-slate-200'}`} />
                  <div className={`h-1.5 rounded-full transition-colors ${strength.level >= 3 ? strength.color : 'bg-slate-200'}`} />
                  <div className={`h-1.5 rounded-full transition-colors ${strength.level >= 4 ? strength.color : 'bg-slate-200'}`} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                  <span>Password strength: <strong>{strength.text}</strong></span>
                  <span>Requires 8+ characters</span>
                </div>
              </div>
            )}
          </div>

          {/* Invite Code Checkbox (Sign Up Mode) */}
          {mode === 'signup' && (
            <div className="p-3.5 rounded-xl bg-[#EFF6FF]/60 border border-[#DBEAFE] space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInviteCode}
                  onChange={(e) => setHasInviteCode(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#00685f] focus:ring-[#00685f] border-slate-300"
                />
                <div>
                  <div className="text-xs font-semibold text-[#0f172a]">
                    I have an invite code to join a Family Circle
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    Connect directly with your siblings, parents, or care aides
                  </div>
                </div>
              </label>

              {hasInviteCode && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter Invite Code (e.g. VANCE-79)"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-xs font-mono font-bold tracking-wider text-[#00685f] uppercase"
                  />
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Verified: Eleanor Vance's Portland Circle</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 px-5 rounded-xl bg-[#00685f] hover:bg-[#00524b] text-white text-sm font-semibold shadow-md shadow-[#00685f]/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{mode === 'signup' ? 'Create Free Family Account' : 'Sign In to Family Circle'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Terms Disclaimer */}
        <p className="mt-4 text-[11px] text-center text-[#64748b] leading-relaxed">
          By continuing, you agree to Hearthside's{' '}
          <button onClick={onBackToLanding} className="text-[#00685f] hover:underline font-medium">
            Terms of Service
          </button>{' '}
          &{' '}
          <button onClick={onBackToLanding} className="text-[#00685f] hover:underline font-medium">
            Privacy Commitment
          </button>
          . We never sell family care data.
        </p>

        {/* Passwordless Magic Link Box */}
        <div className="mt-6 p-4 rounded-2xl bg-[#F0F9FF] border border-[#E0F2FE] flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0f172a]">
                Prefer 1-click passwordless login?
              </div>
              <div className="text-[11px] text-[#64748b] leading-tight">
                {magicLinkSent ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Check className="w-3 h-3" /> Magic link sent to {email}!
                  </span>
                ) : (
                  'We will send a magic link to your email inbox.'
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMagicLink}
            disabled={magicLinkSent}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:bg-slate-50 text-xs font-semibold text-[#0f172a] shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            {magicLinkSent ? 'Sent!' : 'Send Link'}
          </button>
        </div>

        {/* Shared Tablet / Telephone Help */}
        <div className="mt-5 pt-4 border-t border-[#F1F5F9] text-center">
          <button
            type="button"
            onClick={() => setShowSeniorHelpModal(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#00685f] hover:underline cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Logging in on a shared elder tablet or need telephone help?</span>
          </button>
        </div>
      </div>

      {/* 3 Value Proposition Cards Below */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 max-w-lg w-full">
        {/* Card 1 */}
        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#00685f] mb-1">
            <Shield className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold text-[#0f172a]">Zero Data Monetization</span>
          </div>
          <p className="text-[11px] text-[#64748b] leading-relaxed">
            Private medical schedules with zero third-party ads.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#00685f] mb-1">
            <Layers className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold text-[#0f172a]">Shared Sync Across Circle</span>
          </div>
          <p className="text-[11px] text-[#64748b] leading-relaxed">
            Live coordination across iPhone, Android, and tablets.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#00685f] mb-1">
            <Heart className="w-4 h-4 shrink-0 text-[#00685f]" />
            <span className="text-xs font-bold text-[#0f172a]">Care-First Readability</span>
          </div>
          <p className="text-[11px] text-[#64748b] leading-relaxed">
            Calm high contrast and generous touch targets.
          </p>
        </div>
      </div>

      {/* Footer Support Helpline */}
      <p className="mt-8 text-xs text-[#64748b] text-center max-w-md">
        Questions? Reach our Care Concierge 24/7 at{' '}
        <a href="mailto:support@hearthsidecare.org" className="text-[#00685f] font-semibold hover:underline">
          support@hearthsidecare.org
        </a>{' '}
        or{' '}
        <span className="font-semibold text-[#0f172a]">1-800-HEARTH-CARE</span>
      </p>

      {/* Senior Tablet / Telephone Modal */}
      {showSeniorHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] relative">
            <button
              onClick={() => setShowSeniorHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#00685f] flex items-center justify-center">
                <Tablet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">
                  Senior Tablet & Phone Support
                </h3>
                <p className="text-xs text-[#64748b]">
                  Accessible login for Eleanor Vance & Family
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#475569]">
              <div className="p-3.5 rounded-xl bg-[#F0FDF9] border border-[#CCFBF1]">
                <div className="font-bold text-[#00685f] mb-1">
                  Option 1: Quick 4-Digit Tablet PIN
                </div>
                <p className="text-[11px] text-[#64748b] mb-2.5">
                  Enter Eleanor's pre-configured tablet PIN (Demo: <strong>2026</strong>):
                </p>
                <form onSubmit={handleSeniorPinSubmit} className="flex gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="PIN"
                    value={seniorPin}
                    onChange={(e) => setSeniorPin(e.target.value)}
                    className="w-24 px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-center text-sm font-mono tracking-widest font-bold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00685f] text-white rounded-lg font-semibold hover:bg-[#00524b] text-xs cursor-pointer"
                  >
                    {seniorPinSuccess ? 'Opening...' : 'Sign In with PIN'}
                  </button>
                </form>
                {seniorPinSuccess && (
                  <div className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PIN verified! Launching Care Portal...
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE]">
                <div className="font-bold text-[#1D4ED8] mb-1 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  Option 2: Telephone Assistance
                </div>
                <p className="text-[11px] text-[#475569] leading-relaxed">
                  Call our toll-free family care hotline anytime at <strong>1-800-HEARTH-CARE</strong> (1-800-432-7842). A live care specialist will authenticate your account and assist with scheduling or prescription checks.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex justify-end">
              <button
                onClick={() => setShowSeniorHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
