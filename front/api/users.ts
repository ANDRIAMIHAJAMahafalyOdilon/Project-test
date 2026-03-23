import type { User, ApiResponse, PaginatedResponse } from '@/types';
import { mockUsersList, mockSettings, type AppSettings } from '@/mock/users';
import { loadMockState, saveMockState } from '@/lib/mock-persistence';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const USERS_STORAGE_KEY = 'admin-users';
const SETTINGS_STORAGE_KEY = 'app-settings';

function nextUserId(list: User[]): string {
  const nums = list
    .map((u) => parseInt(u.id, 10))
    .filter((n) => Number.isFinite(n));
  return String((nums.length ? Math.max(...nums) : 0) + 1);
}

/** Données mock persistées (survit au rafraîchissement de la page) */
let users: User[] = loadMockState(USERS_STORAGE_KEY, [...mockUsersList]);
let settings: AppSettings = loadMockState(SETTINGS_STORAGE_KEY, {
  ...mockSettings,
  general: { ...mockSettings.general },
  notifications: { ...mockSettings.notifications },
  security: { ...mockSettings.security },
  appearance: { ...mockSettings.appearance },
});

function persistUsers() {
  saveMockState(USERS_STORAGE_KEY, users);
}

function persistSettings() {
  saveMockState(SETTINGS_STORAGE_KEY, settings);
}

export async function getUsers(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  role?: string
): Promise<ApiResponse<PaginatedResponse<User>>> {
  await delay(600);

  let filteredUsers = [...users];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (u) =>
        u.firstName.toLowerCase().includes(searchLower) ||
        u.lastName.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
    );
  }

  if (role && role !== 'all') {
    filteredUsers = filteredUsers.filter((u) => u.role === role);
  }

  // Plus récent en premier (création la plus récente en haut du tableau)
  filteredUsers.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(start, start + pageSize);

  return {
    success: true,
    data: {
      data: paginatedUsers,
      total,
      page,
      pageSize,
      totalPages,
    },
  };
}

export async function getUser(id: string): Promise<ApiResponse<User>> {
  await delay(400);

  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    success: true,
    data: user,
  };
}

export async function createUser(
  data: Omit<User, 'id' | 'createdAt'>
): Promise<ApiResponse<User>> {
  await delay(800);

  const existingUser = users.find((u) => u.email === data.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const newUser: User = {
    ...data,
    id: nextUserId(users),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  persistUsers();

  return {
    success: true,
    data: newUser,
    message: 'User created successfully',
  };
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<ApiResponse<User>> {
  await delay(600);

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  if (data.email) {
    const existingUser = users.find((u) => u.email === data.email && u.id !== id);
    if (existingUser) {
      throw new Error('Email already exists');
    }
  }

  users[userIndex] = { ...users[userIndex], ...data };
  persistUsers();

  return {
    success: true,
    data: users[userIndex],
    message: 'User updated successfully',
  };
}

export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  await delay(500);

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users.splice(userIndex, 1);
  persistUsers();

  return {
    success: true,
    data: null,
    message: 'User deleted successfully',
  };
}

// Settings API
export async function getSettings(): Promise<ApiResponse<AppSettings>> {
  await delay(400);

  return {
    success: true,
    data: settings,
  };
}

export async function updateSettings(
  data: Partial<AppSettings>
): Promise<ApiResponse<AppSettings>> {
  await delay(600);

  settings = {
    general: { ...settings.general, ...data.general },
    notifications: { ...settings.notifications, ...data.notifications },
    security: { ...settings.security, ...data.security },
    appearance: { ...settings.appearance, ...data.appearance },
  };
  persistSettings();

  return {
    success: true,
    data: settings,
    message: 'Settings updated successfully',
  };
}
