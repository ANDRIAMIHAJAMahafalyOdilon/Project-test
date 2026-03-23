import type { LoginCredentials, RegisterData, AuthResponse, User, ApiResponse } from '@/types';
import { mockUsers, generateMockToken, getMockTokenExpiration } from '@/mock/auth';
import { loadMockState, saveMockState } from '@/lib/mock-persistence';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const REGISTERED_USERS_KEY = 'auth-registered-users';

type AuthUser = User & { password: string };

function nextRegisteredUserId(list: AuthUser[]): string {
  const nums = list
    .map((u) => parseInt(u.id, 10))
    .filter((n) => Number.isFinite(n));
  return String((nums.length ? Math.max(...nums) : 0) + 1);
}

function persistRegisteredUsers() {
  saveMockState(REGISTERED_USERS_KEY, registeredUsers);
}

/** Utilisateurs mock (inscription) — persistés pour survivre au F5 */
let registeredUsers: AuthUser[] = loadMockState(
  REGISTERED_USERS_KEY,
  mockUsers.map((u) => ({ ...u }))
);

export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
  await delay(800); // Simulate network latency

  const user = registeredUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    data: {
      user: userWithoutPassword,
      token: generateMockToken(user.id),
      expiresAt: getMockTokenExpiration(),
    },
  };
}

export async function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
  await delay(1000);

  // Check if email already exists
  const existingUser = registeredUsers.find((u) => u.email === data.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Create new user
  const newUser: AuthUser = {
    id: nextRegisteredUserId(registeredUsers),
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: 'user',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(newUser);
  persistRegisteredUsers();

  const { password: _, ...userWithoutPassword } = newUser;

  return {
    success: true,
    data: {
      user: userWithoutPassword,
      token: generateMockToken(newUser.id),
      expiresAt: getMockTokenExpiration(),
    },
  };
}

export async function logout(): Promise<ApiResponse<null>> {
  await delay(300);
  return {
    success: true,
    data: null,
    message: 'Logged out successfully',
  };
}

export async function getCurrentUser(token: string): Promise<ApiResponse<User>> {
  await delay(500);

  if (!token || !token.startsWith('mock-jwt-token-')) {
    throw new Error('Invalid token');
  }

  // Extract user ID from token
  const userId = token.split('-')[3];
  const user = registeredUsers.find((u) => u.id === userId);

  if (!user) {
    throw new Error('User not found');
  }

  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    data: userWithoutPassword,
  };
}

export async function forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
  await delay(1200);

  const user = registeredUsers.find((u) => u.email === email);
  
  // Always return success for security (don't reveal if email exists)
  return {
    success: true,
    data: {
      message: 'If an account exists with this email, a password reset link has been sent.',
    },
  };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> {
  await delay(1000);

  // Simulate password reset
  return {
    success: true,
    data: {
      message: 'Password has been reset successfully. Please login with your new password.',
    },
  };
}
