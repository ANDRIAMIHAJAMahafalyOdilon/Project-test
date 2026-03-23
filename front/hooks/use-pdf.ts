'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPDFTemplates,
  getPDFTemplate,
  generatePDF,
  getGeneratedPDFs,
  deletePDF,
  createDocuSignEnvelope,
  getDocuSignEnvelopes,
  voidDocuSignEnvelope,
} from '@/api/pdf';
import type { PDFGenerationRequest } from '@/types';

export function usePDFTemplates() {
  return useQuery({
    queryKey: ['pdf', 'templates'],
    queryFn: getPDFTemplates,
  });
}

export function usePDFTemplate(templateId: string) {
  return useQuery({
    queryKey: ['pdf', 'template', templateId],
    queryFn: () => getPDFTemplate(templateId),
    enabled: !!templateId,
  });
}

export function useGeneratedPDFs(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['pdf', 'generated', page, pageSize],
    queryFn: () => getGeneratedPDFs(page, pageSize),
  });
}

export function useGeneratePDF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PDFGenerationRequest) => generatePDF(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf', 'generated'] });
    },
  });
}

export function useDeletePDF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pdfId: string) => deletePDF(pdfId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf', 'generated'] });
    },
  });
}

export function useDocuSignEnvelopes(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['docusign', 'envelopes', page, pageSize],
    queryFn: () => getDocuSignEnvelopes(page, pageSize),
  });
}

export function useCreateDocuSignEnvelope() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subject,
      recipients,
      documentUrl,
    }: {
      subject: string;
      recipients: { email: string; name: string }[];
      documentUrl: string;
    }) => createDocuSignEnvelope(subject, recipients, documentUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['docusign', 'envelopes'] });
    },
  });
}

export function useVoidDocuSignEnvelope() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (envelopeId: string) => voidDocuSignEnvelope(envelopeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['docusign', 'envelopes'] });
    },
  });
}
