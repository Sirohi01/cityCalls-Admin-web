'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope, setAccessToken } from '../api/client';
import { LoginResponse } from '../types/auth';
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
  return useMutation<void, Error, ForgotPasswordFormValues>({
    mutationFn: async (input) => {
      // Placeholder: will be connected to real endpoint when ready
      console.log('Mock API call: forgot-password', input);
      return new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordFormValues & { token: string }>({
    mutationFn: async (input) => {
      // Placeholder
      console.log('Mock API call: reset-password', input);
      return new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
}

export function usePermission(module: string, action: 'read' | 'write' | 'create' | 'delete' = 'read') {
  // Mock permission check: assume the user has access to everything for now
  // In a real scenario, this would read from a fetched user profile context
  console.log(`Checking permission for ${module}:${action}`);
  return true;
}
