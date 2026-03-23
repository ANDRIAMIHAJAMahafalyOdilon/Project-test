'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFormSchemas,
  getFormSchema,
  submitContactForm,
  submitProfileForm,
  submitForm,
  getFormSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
} from '@/api/forms';
import type { ContactFormData, ProfileFormData } from '@/types';

export function useFormSchemas() {
  return useQuery({
    queryKey: ['forms', 'schemas'],
    queryFn: getFormSchemas,
  });
}

export function useFormSchema(formId: string) {
  return useQuery({
    queryKey: ['forms', 'schema', formId],
    queryFn: () => getFormSchema(formId),
    enabled: !!formId,
  });
}

export function useFormSubmissions(formId?: string, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['forms', 'submissions', formId, page, pageSize],
    queryFn: () => getFormSubmissions(formId, page, pageSize),
  });
}

export function useSubmitContactForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactFormData) => submitContactForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'submissions'] });
    },
  });
}

export function useSubmitProfileForm() {
  return useMutation({
    mutationFn: (data: ProfileFormData) => submitProfileForm(data),
  });
}

export function useSubmitForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formId, data }: { formId: string; data: Record<string, unknown> }) =>
      submitForm(formId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'submissions'] });
    },
  });
}

export function useUpdateSubmissionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      status,
    }: {
      submissionId: string;
      status: 'pending' | 'approved' | 'rejected';
    }) => updateSubmissionStatus(submissionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'submissions'] });
    },
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submissionId: string) => deleteSubmission(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'submissions'] });
    },
  });
}
