import type { User } from '@/types';

// Mock users database
export const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
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
    password: 'user123',
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
    password: 'manager123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    createdAt: '2024-01-20T00:00:00Z',
    lastLogin: '2024-03-13T09:15:00Z',
  },
];

// Mock token generation
export const generateMockToken = (userId: string): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Mock token expiration (24 hours from now)
export const getMockTokenExpiration = (): string => {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24);
  return expiration.toISOString();
};
