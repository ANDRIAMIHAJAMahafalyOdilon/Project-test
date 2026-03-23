import type { User } from '@/types';

// Extended mock users for the users management page
export const mockUsersList: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: '2024-02-15T00:00:00Z',
    lastLogin: '2024-03-14T14:20:00Z',
  },
  {
    id: '3',
    email: 'manager@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    createdAt: '2024-01-20T00:00:00Z',
    lastLogin: '2024-03-13T09:15:00Z',
  },
  {
    id: '4',
    email: 'sarah.wilson@example.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: '2024-02-28T00:00:00Z',
    lastLogin: '2024-03-12T16:45:00Z',
  },
  {
    id: '5',
    email: 'mike.johnson@example.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    createdAt: '2024-03-01T00:00:00Z',
    lastLogin: '2024-03-10T11:30:00Z',
  },
  {
    id: '6',
    email: 'emily.davis@example.com',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-03-11T08:00:00Z',
  },
  {
    id: '7',
    email: 'alex.brown@example.com',
    firstName: 'Alex',
    lastName: 'Brown',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    createdAt: '2024-03-05T00:00:00Z',
  },
  {
    id: '8',
    email: 'lisa.garcia@example.com',
    firstName: 'Lisa',
    lastName: 'Garcia',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    createdAt: '2024-02-20T00:00:00Z',
    lastLogin: '2024-03-09T13:20:00Z',
  },
];

// Settings mock data
export interface AppSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    timezone: string;
    language: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginAttempts: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    showAvatars: boolean;
  };
}

export const mockSettings: AppSettings = {
  general: {
    siteName: 'BackOffice Pro',
    siteDescription: 'A modern backoffice management system',
    contactEmail: 'support@backoffice.com',
    timezone: 'UTC',
    language: 'en',
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    marketingEmails: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
  },
  appearance: {
    theme: 'system',
    compactMode: false,
    showAvatars: true,
  },
};
