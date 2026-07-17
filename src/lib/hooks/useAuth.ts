'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope, setAccessToken } from '../api/client';
import { LoginResponse, MeResponse } from '../types/auth';
import { LoginFormValues, ForgotPasswordFormValues, ResetPasswordFormValues } from '../validation/auth';
import { AxiosError } from 'axios';

const ACCESS_TOKEN_KEY = 'citycalls_access_token';
const REFRESH_TOKEN_KEY = 'citycalls_refresh_token';

export function useLogin() {
  return useMutation<LoginResponse, AxiosError<ApiErrorEnvelope>, LoginFormValues>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<LoginResponse>>('/auth/login', input);
      return res.data.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        window.localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
    },
  });
}

export function restoreSession(): void {
  if (typeof window === 'undefined') return;
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) setAccessToken(token);
}

export function clearSession(): void {
  setAccessToken(undefined);
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function useForgotPassword() {
  return useMutation<void, AxiosError<ApiErrorEnvelope>, ForgotPasswordFormValues>({
    mutationFn: async (input) => {
      await apiClient.post('/auth/password/reset-request', input);
    },
  });
}

export function useResetPassword() {
  return useMutation<void, AxiosError<ApiErrorEnvelope>, ResetPasswordFormValues & { token: string }>({
    mutationFn: async (input) => {
      await apiClient.post('/auth/password/reset', { token: input.token, newPassword: input.newPassword });
    },
  });
}

// Fetched once per session (long staleTime — a role's permission set doesn't
// change mid-session) and reused by every usePermission() call via the
// TanStack Query cache, rather than each call site re-fetching independently.
export function useMe() {
  return useQuery<MeResponse, AxiosError<ApiErrorEnvelope>>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<MeResponse>>('/auth/me');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Real permission check against the resolved grant set from GET /auth/me —
// module.action, matching the backend's RBAC vocabulary exactly (view/
// create/edit/manageSettings/viewFinancial/assign/export/import), not a
// frontend-invented read/write/create/delete enum. Fails closed: while
// loading or if the user has no grant for this module.action, access is
// denied — never defaults to true.
export function usePermission(module: string, action = 'view'): boolean {
  const { data } = useMe();
  if (!data) return false;
  return Boolean(data.permissions?.[module]?.[action]);
}

// A user can act on ANY of the given {module, action} pairs — used for nav
// items backed by more than one real permission check (e.g. Import/Export,
// which is gated per-entity on the backend, not by one page-level permission).
export function useAnyPermission(checks: { module: string; action?: string }[]): boolean {
  const { data } = useMe();
  if (!data) return false;
  return checks.some((c) => Boolean(data.permissions?.[c.module]?.[c.action ?? 'view']));
}
