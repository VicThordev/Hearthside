import { supabase } from './supabase';

// A production build with no VITE_API_URL calls the server that delivered the page.
const apiUrl = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? window.location.origin : ''))?.replace(/\/$/, '');

export class ApiClientError extends Error {}

const ACTIVE_CIRCLE_KEY = 'hearthside.activeCircleId';

// The stored circle is only a preference; the server re-checks membership on every request.
export function getActiveCircleId(): string | null {
  try { return localStorage.getItem(ACTIVE_CIRCLE_KEY); } catch { return null; }
}

export function setActiveCircleId(circleId: string | null) {
  try {
    if (circleId) localStorage.setItem(ACTIVE_CIRCLE_KEY, circleId);
    else localStorage.removeItem(ACTIVE_CIRCLE_KEY);
  } catch { /* Storage can be unavailable in private windows; the selection then lasts for this page only. */ }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiUrl) throw new ApiClientError('VITE_API_URL is not configured. The app is using demo data.');
  const { data: { session } } = await supabase?.auth.getSession() ?? { data: { session: null } };
  if (!session) throw new ApiClientError('Sign in before making an API request.');
  const circleId = getActiveCircleId();

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${session.access_token}`,
      ...(circleId ? { 'X-Care-Circle-Id': circleId } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    throw new ApiClientError(payload?.error?.message ?? `Request failed (${response.status}).`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
