import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';

export interface Branch {
  _id: string;
  name: string;
  code: string;
  coverage?: { pinCodes: string[]; cities: string[]; states: string[] };
  managerId?: string;
  active: boolean;
  createdAt: string;
}

export interface SubBranch {
  _id: string;
  branchId: string;
  name: string;
  code: string;
  managerId?: string;
  active: boolean;
  createdAt: string;
}

export interface Team {
  _id: string;
  branchId: string;
  subBranchId?: string;
  name: string;
  leadId?: string;
  memberIds: string[];
  active: boolean;
  createdAt: string;
}

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Branch[]>>('/branches');
      return res.data.data;
    },
  });
}

export interface CreateBranchInput {
  name: string;
  code: string;
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation<Branch, AxiosError<ApiErrorEnvelope>, CreateBranchInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Branch>>('/branches', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useSubBranches() {
  return useQuery({
    queryKey: ['sub-branches'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<SubBranch[]>>('/sub-branches');
      return res.data.data;
    },
  });
}

export interface CreateSubBranchInput {
  branchId: string;
  name: string;
  code: string;
}

export function useCreateSubBranch() {
  const queryClient = useQueryClient();
  return useMutation<SubBranch, AxiosError<ApiErrorEnvelope>, CreateSubBranchInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<SubBranch>>('/sub-branches', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sub-branches'] }),
  });
}

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<Team[]>>('/teams');
      return res.data.data;
    },
  });
}

export interface CreateTeamInput {
  branchId: string;
  name: string;
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation<Team, AxiosError<ApiErrorEnvelope>, CreateTeamInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<Team>>('/teams', input);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  });
}
