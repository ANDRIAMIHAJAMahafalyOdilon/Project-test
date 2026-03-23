// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Authentication
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';
export const TOKEN_EXPIRY_HOURS = 24;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
  BIO_MAX_LENGTH: 500,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  FORMS: '/forms',
  PDF: '/pdf',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// Public Routes (no auth required)
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
] as const;

// Protected Routes (auth required)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.FORMS,
  ROUTES.PDF,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
] as const;

// PDF Categories
export const PDF_CATEGORIES = {
  INVOICE: 'invoice',
  REPORT: 'report',
  CONTRACT: 'contract',
  CERTIFICATE: 'certificate',
} as const;

// Form Types
export const FORM_TYPES = {
  CONTACT: 'contact-form',
  PROFILE: 'profile-form',
  INVOICE: 'invoice-form',
} as const;

// Submission Statuses
export const SUBMISSION_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// DocuSign Statuses
export const DOCUSIGN_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  DECLINED: 'declined',
} as const;
