import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

// GET /employees populates userId with { name, mobile, email } (real backend
// shape, src/modules/employees/employees.service.ts's listEmployees) — an
// Employee record itself has no name/email/role, those live on the linked User.
export interface Employee {
  _id: string;
  userId: { _id: string; name: string; mobile: string; email?: string };
  branchId: string;
  subBranchId?: string;
  teamId?: string;
  skills: string[];
  certifications: string[];
  dailyCapacity: number;
  active: boolean;
  createdAt: string;
}

export function useEmployees(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Employee[]>>('/employees');
      return res.data.data;
    },
    enabled: options?.enabled ?? true,
  });
}

export interface CreateEmployeeInput {
  userId: string;
  branchId: string;
  subBranchId?: string;
  teamId?: string;
  skills?: string[];
  certifications?: string[];
  dailyCapacity?: number;
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation<Employee, AxiosError<ApiErrorEnvelope>, CreateEmployeeInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Employee>>('/employees', input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export interface UpdateEmployeeInput {
  id: string;
  branchId?: string;
  subBranchId?: string;
  teamId?: string;
  skills?: string[];
  certifications?: string[];
  dailyCapacity?: number;
  active?: boolean;
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation<Employee, AxiosError<ApiErrorEnvelope>, UpdateEmployeeInput>({
    mutationFn: async ({ id, ...input }) => {
      const res = await apiClient.patch<ApiSuccessEnvelope<Employee>>(`/employees/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
