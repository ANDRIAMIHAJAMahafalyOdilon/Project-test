import type { DashboardData, DashboardStats, RevenueData, ChartDataPoint, ActivityLog, ApiResponse, PaginatedResponse } from '@/types';
import { mockDashboardStats, mockRevenueData, mockUserGrowth, mockActivityLogs } from '@/mock/dashboard';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
  await delay(800);

  return {
    success: true,
    data: {
      stats: mockDashboardStats,
      revenueChart: mockRevenueData,
      userGrowth: mockUserGrowth,
      recentActivity: mockActivityLogs.slice(0, 5),
    },
  };
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  await delay(500);

  return {
    success: true,
    data: mockDashboardStats,
  };
}

export async function getRevenueData(
  year?: number
): Promise<ApiResponse<RevenueData[]>> {
  await delay(600);

  // Could filter by year if needed, using mock data for now
  return {
    success: true,
    data: mockRevenueData,
  };
}

export async function getUserGrowthData(
  period?: 'week' | 'month' | 'quarter' | 'year'
): Promise<ApiResponse<ChartDataPoint[]>> {
  await delay(500);

  return {
    success: true,
    data: mockUserGrowth,
  };
}

export async function getActivityLogs(
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<ActivityLog>> {
  await delay(700);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = mockActivityLogs.slice(start, end);

  return {
    data: paginatedData,
    total: mockActivityLogs.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockActivityLogs.length / pageSize),
  };
}

export async function getRecentActivity(
  limit: number = 5
): Promise<ApiResponse<ActivityLog[]>> {
  await delay(400);

  return {
    success: true,
    data: mockActivityLogs.slice(0, limit),
  };
}
