import axios from 'axios';

// Local to this repo — no shared api-client package exists (multi-repo, per
// docs/coordination/03-code-ownership.md). Base URL points at citycalls-api.
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

let accessToken: string | undefined;

export function setAccessToken(token: string | undefined): void {
  accessToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Standard envelope per docs/10-api-standards.md §3-4.
export interface ApiSuccessEnvelope<T> {
  success: true;
  message: string;
  data: T;
  meta: { page: number; limit: number; total: number; totalPages: number } | null;
  errors: null;
}

export interface ApiErrorEnvelope {
  success: false;
  message: string;
  data: null;
  errors: { field: string; code: string; message: string }[];
}
