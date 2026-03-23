'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getDashboardData,
  getDashboardStats,
  getRevenueData,
  getUserGrowthData,
  getRecentActivity,
} from '@/api/dashboard';

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });
}

export function useRevenueData(year?: number) {
  return useQuery({
    queryKey: ['dashboard', 'revenue', year],
    queryFn: () => getRevenueData(year),
  });
}

export function useUserGrowthData(period?: 'week' | 'month' | 'quarter' | 'year') {
  return useQuery({
    queryKey: ['dashboard', 'userGrowth', period],
    queryFn: () => getUserGrowthData(period),
  });
}

export function useRecentActivity(limit: number = 5) {
  return useQuery({
    queryKey: ['dashboard', 'activity', limit],
    queryFn: () => getRecentActivity(limit),
  });
}
