import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiSuccessEnvelope, ApiErrorEnvelope } from '../api/client';
import { AxiosError } from 'axios';
import axios from 'axios';

export const FILE_CATEGORIES = [
  'ISSUE_IMAGE', 'PRODUCT_IMAGE', 'BEFORE_SERVICE_IMAGE', 'AFTER_SERVICE_IMAGE', 'PART_IMAGE',
  'VENDOR_DOCUMENT', 'EMPLOYEE_DOCUMENT', 'INVOICE_ATTACHMENT', 'RECORDING', 'VIDEO',
  'SIGNATURE', 'PROFILE_IMAGE', 'CATALOG_IMAGE',
] as const;
export type FileCategory = (typeof FILE_CATEGORIES)[number];

export interface UploadedFile {
  _id: string;
  category: FileCategory;
  entityType: string;
  entityId: string;
  provider: 'CLOUDINARY' | 'LOCAL';
  key: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export function useFileList(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ['files', entityType, entityId],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccessEnvelope<UploadedFile[]>>('/files', { params: { entityType, entityId } });
      return res.data.data;
    },
    enabled: !!entityType && !!entityId,
  });
}

type SignedUploadResult =
  | { mode: 'LOCAL'; uploadUrl: string }
  | { mode: 'CLOUDINARY'; timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string };

function useRequestSignedUpload() {
  return useMutation<SignedUploadResult, AxiosError<ApiErrorEnvelope>, { category: FileCategory; entityType: string; entityId: string }>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<SignedUploadResult>>('/files/signed-upload', input);
      return res.data.data;
    },
  });
}

interface ConfirmUploadInput {
  category: FileCategory;
  entityType: string;
  entityId: string;
  publicId: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

function useConfirmUpload() {
  return useMutation<UploadedFile, AxiosError<ApiErrorEnvelope>, ConfirmUploadInput>({
    mutationFn: async (input) => {
      const res = await apiClient.post<ApiSuccessEnvelope<UploadedFile>>('/files/confirm', input);
      return res.data.data;
    },
  });
}

interface DirectUploadInput {
  category: FileCategory;
  entityType: string;
  entityId: string;
  file: File;
}

function useDirectUpload() {
  return useMutation<UploadedFile, AxiosError<ApiErrorEnvelope>, DirectUploadInput>({
    mutationFn: async ({ file, ...fields }) => {
      const form = new FormData();
      form.append('file', file);
      form.append('category', fields.category);
      form.append('entityType', fields.entityType);
      form.append('entityId', fields.entityId);
      const res = await apiClient.post<ApiSuccessEnvelope<UploadedFile>>('/files/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorEnvelope>, { id: string; entityType: string; entityId: string }>({
    mutationFn: async ({ id }) => {
      await apiClient.delete(`/files/${id}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['files', variables.entityType, variables.entityId] });
    },
  });
}

// Orchestrates the full upload: request signed params -> upload directly to
// Cloudinary from the browser (bypassing our API for the file bytes
// themselves) -> confirm with our API so a File row gets created; falls back
// to the direct multipart /files/upload endpoint when Cloudinary is
// disabled (requestSignedUpload returns mode: 'LOCAL' in that case) — same
// two-path split already implemented server-side in lib/fileStorage.ts.
export function useUploadFile(entityType: string, entityId: string) {
  const queryClient = useQueryClient();
  const requestSignedUpload = useRequestSignedUpload();
  const confirmUpload = useConfirmUpload();
  const directUpload = useDirectUpload();

  const isPending = requestSignedUpload.isPending || confirmUpload.isPending || directUpload.isPending;

  const upload = async (file: File, category: FileCategory): Promise<UploadedFile> => {
    const signed = await requestSignedUpload.mutateAsync({ category, entityType, entityId });

    let result: UploadedFile;
    if (signed.mode === 'CLOUDINARY') {
      const form = new FormData();
      form.append('file', file);
      form.append('timestamp', String(signed.timestamp));
      form.append('signature', signed.signature);
      form.append('api_key', signed.apiKey);
      form.append('folder', signed.folder);

      const cloudinaryRes = await axios.post(`https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`, form);

      result = await confirmUpload.mutateAsync({
        category,
        entityType,
        entityId,
        publicId: cloudinaryRes.data.public_id,
        url: cloudinaryRes.data.secure_url,
        mimeType: file.type,
        sizeBytes: file.size,
      });
    } else {
      result = await directUpload.mutateAsync({ category, entityType, entityId, file });
    }

    queryClient.invalidateQueries({ queryKey: ['files', entityType, entityId] });
    return result;
  };

  return { upload, isPending };
}
