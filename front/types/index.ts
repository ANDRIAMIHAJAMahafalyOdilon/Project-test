// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingTasks: number;
  completedTasks: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  previousValue?: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueChart: RevenueData[];
  userGrowth: ChartDataPoint[];
  recentActivity: ActivityLog[];
}

// Forms Types
export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormSchema {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  notifications: boolean;
}

// PDF Types
export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  category: 'invoice' | 'report' | 'contract' | 'certificate' | 'job';
}

export interface PDFGenerationRequest {
  templateId: string;
  data: Record<string, unknown>;
  options?: {
    watermark?: boolean;
    password?: string;
    format?: 'A4' | 'Letter';
  };
}

export interface PDFGenerationResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  createdAt: string;
}

// DocuSign Types (Simulated)
export interface DocuSignEnvelope {
  id: string;
  status: 'draft' | 'sent' | 'delivered' | 'completed' | 'declined';
  subject: string;
  recipients: {
    email: string;
    name: string;
    status: 'pending' | 'signed' | 'declined';
  }[];
  createdAt: string;
  completedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}
