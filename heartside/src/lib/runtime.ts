import type { ViewMode } from '../types';

// "demo" is deliberately the default. A live environment must opt in explicitly
// after its backend, policies, and operations are ready.
export const isDemoMode = import.meta.env.VITE_RELEASE_MODE !== 'live';

// Social sign-in buttons are shown only for providers enabled in Supabase Auth, because
// a disabled provider sends the user to a raw JSON error page.
const oauthProviders = String(import.meta.env.VITE_OAUTH_PROVIDERS ?? '').split(',').map((name) => name.trim());
export const isOAuthEnabled = (provider: 'google' | 'apple') => isDemoMode || oauthProviders.includes(provider);

const SAVED_VIEW_KEY = 'hearthside.currentView';
const portalViews: readonly ViewMode[] = ['overview', 'calendar', 'tasks', 'care-team', 'care-notes', 'vault', 'directory', 'reports', 'settings'];

// Remembers the portal screen across a reload. Access is still decided by the sign-in and circle checks in App.
export function getSavedView(): ViewMode | null {
  try {
    const view = sessionStorage.getItem(SAVED_VIEW_KEY) as ViewMode | null;
    return view && portalViews.includes(view) ? view : null;
  } catch { return null; }
}

export function saveView(view: ViewMode) {
  try {
    if (portalViews.includes(view)) sessionStorage.setItem(SAVED_VIEW_KEY, view);
    else sessionStorage.removeItem(SAVED_VIEW_KEY);
  } catch { /* Storage can be unavailable in private windows; a reload then returns to the landing page. */ }
}
