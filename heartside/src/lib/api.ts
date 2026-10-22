const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
import { supabase } from './supabase';

export class ApiClientError extends Error {}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiUrl) throw new ApiClientError('VITE_API_URL is not configured. The app is using demo data.');
  const { data: { session } } = await supabase?.auth.getSession() ?? { data: { session: null } };
  if (!session) throw new ApiClientError('Sign in before making an API request.');
  const circleId = localStorage.getItem('hearthside.activeCircleId');

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

  return response.json() as Promise<T>;
}
