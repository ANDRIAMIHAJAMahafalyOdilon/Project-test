import type { FormSchema, FormSubmission, ContactFormData, ProfileFormData, ApiResponse, PaginatedResponse } from '@/types';
import { mockFormSchemas, mockFormSubmissions } from '@/mock/forms';
import { loadMockState, saveMockState } from '@/lib/mock-persistence';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SUBMISSIONS_KEY = 'form-submissions';

let submissions: FormSubmission[] = loadMockState(SUBMISSIONS_KEY, [...mockFormSubmissions]);

function persistSubmissions() {
  saveMockState(SUBMISSIONS_KEY, submissions);
}

export async function getFormSchemas(): Promise<ApiResponse<FormSchema[]>> {
  await delay(500);

  return {
    success: true,
    data: mockFormSchemas,
  };
}

export async function getFormSchema(formId: string): Promise<ApiResponse<FormSchema>> {
  await delay(400);

  const schema = mockFormSchemas.find((s) => s.id === formId);

  if (!schema) {
    throw new Error(`Form schema not found: ${formId}`);
  }

  return {
    success: true,
    data: schema,
  };
}

export async function submitContactForm(
  data: ContactFormData
): Promise<ApiResponse<FormSubmission>> {
  await delay(1000);

  const newSubmission: FormSubmission = {
    id: `sub-${Date.now()}`,
    formId: 'contact-form',
    data: { ...data } as Record<string, unknown>,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };

  submissions.push(newSubmission);
  persistSubmissions();

  return {
    success: true,
    data: newSubmission,
    message: 'Contact form submitted successfully',
  };
}

export async function submitProfileForm(
  data: ProfileFormData
): Promise<ApiResponse<ProfileFormData>> {
  await delay(800);

  // Simulate profile update
  return {
    success: true,
    data,
    message: 'Profile updated successfully',
  };
}

export async function submitForm(
  formId: string,
  data: Record<string, unknown>
): Promise<ApiResponse<FormSubmission>> {
  await delay(900);

  const schema = mockFormSchemas.find((s) => s.id === formId);

  if (!schema) {
    throw new Error(`Form schema not found: ${formId}`);
  }

  const newSubmission: FormSubmission = {
    id: `sub-${Date.now()}`,
    formId,
    data,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };

  submissions.push(newSubmission);
  persistSubmissions();

  return {
    success: true,
    data: newSubmission,
    message: 'Form submitted successfully',
  };
}

export async function getFormSubmissions(
  formId?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<FormSubmission>> {
  await delay(600);

  let filteredSubmissions = submissions;

  if (formId) {
    filteredSubmissions = submissions.filter((s) => s.formId === formId);
  }

  // Plus récent en premier (tri par date de soumission décroissante)
  const sorted = [...filteredSubmissions].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = sorted.slice(start, end);

  return {
    data: paginatedData,
    total: filteredSubmissions.length,
    page,
    pageSize,
    totalPages: Math.ceil(filteredSubmissions.length / pageSize),
  };
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<ApiResponse<FormSubmission>> {
  await delay(500);

  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) {
    throw new Error(`Submission not found: ${submissionId}`);
  }

  submission.status = status;
  persistSubmissions();

  return {
    success: true,
    data: submission,
    message: `Submission status updated to ${status}`,
  };
}

export async function deleteSubmission(
  submissionId: string
): Promise<ApiResponse<null>> {
  await delay(400);

  const index = submissions.findIndex((s) => s.id === submissionId);

  if (index === -1) {
    throw new Error(`Submission not found: ${submissionId}`);
  }

  submissions.splice(index, 1);
  persistSubmissions();

  return {
    success: true,
    data: null,
    message: 'Submission deleted successfully',
  };
}
