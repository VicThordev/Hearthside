import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { requireSupabase, supabase } from '../lib/supabase';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const throwOnError = (error: { message: string } | null) => { if (error) throw new Error(error.message); };

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null, session, loading,
    async signUp(email, password, fullName) {
      const { data, error } = await requireSupabase().auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } } });
      throwOnError(error); return { needsEmailConfirmation: !data.session };
    },
    async signIn(email, password) { const { error } = await requireSupabase().auth.signInWithPassword({ email, password }); throwOnError(error); },
    async signInWithMagicLink(email) { const { error } = await requireSupabase().auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } }); throwOnError(error); },
    async signInWithOAuth(provider) { const { error } = await requireSupabase().auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } }); throwOnError(error); },
    async resetPassword(email) { const { error } = await requireSupabase().auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); throwOnError(error); },
    async signOut() { const { error } = await requireSupabase().auth.signOut(); throwOnError(error); },
  }), [loading, session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
