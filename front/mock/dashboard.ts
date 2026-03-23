import type { DashboardStats, RevenueData, ChartDataPoint, ActivityLog } from '@/types';

export const mockDashboardStats: DashboardStats = {
  totalUsers: 12847,
  activeUsers: 8234,
  totalRevenue: 284750,
  pendingTasks: 23,
  completedTasks: 156,
  conversionRate: 3.2,
};

export const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 18500, expenses: 12000, profit: 6500 },
  { month: 'Feb', revenue: 22300, expenses: 13500, profit: 8800 },
  { month: 'Mar', revenue: 19800, expenses: 11200, profit: 8600 },
  { month: 'Apr', revenue: 25600, expenses: 14800, profit: 10800 },
  { month: 'May', revenue: 28900, expenses: 16200, profit: 12700 },
  { month: 'Jun', revenue: 32100, expenses: 17500, profit: 14600 },
  { month: 'Jul', revenue: 29400, expenses: 15800, profit: 13600 },
  { month: 'Aug', revenue: 35200, expenses: 18900, profit: 16300 },
  { month: 'Sep', revenue: 31800, expenses: 17200, profit: 14600 },
  { month: 'Oct', revenue: 38500, expenses: 20100, profit: 18400 },
  { month: 'Nov', revenue: 42300, expenses: 22500, profit: 19800 },
  { month: 'Dec', revenue: 48700, expenses: 25800, profit: 22900 },
];

export const mockUserGrowth: ChartDataPoint[] = [
  { name: 'Jan', value: 8200, previousValue: 7500 },
  { name: 'Feb', value: 8900, previousValue: 8200 },
  { name: 'Mar', value: 9400, previousValue: 8900 },
  { name: 'Apr', value: 10200, previousValue: 9400 },
  { name: 'May', value: 11100, previousValue: 10200 },
  { name: 'Jun', value: 12847, previousValue: 11100 },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Doe',
    action: 'created',
    target: 'Invoice #INV-2024-001',
    timestamp: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Jane Smith',
    action: 'approved',
    target: 'Contract #CON-2024-015',
    timestamp: '2024-03-15T09:45:00Z',
  },
  {
    id: '3',
    userId: '1',
    userName: 'Admin User',
    action: 'updated',
    target: 'User permissions',
    timestamp: '2024-03-15T09:15:00Z',
  },
  {
    id: '4',
    userId: '2',
    userName: 'John Doe',
    action: 'signed',
    target: 'Document #DOC-2024-042',
    timestamp: '2024-03-14T16:30:00Z',
  },
  {
    id: '5',
    userId: '3',
    userName: 'Jane Smith',
    action: 'generated',
    target: 'Report Q1-2024',
    timestamp: '2024-03-14T14:20:00Z',
  },
  {
    id: '6',
    userId: '1',
    userName: 'Admin User',
    action: 'deleted',
    target: 'Draft invoice #DFT-001',
    timestamp: '2024-03-14T11:00:00Z',
  },
  {
    id: '7',
    userId: '2',
    userName: 'John Doe',
    action: 'sent',
    target: 'DocuSign envelope #ENV-2024-008',
    timestamp: '2024-03-13T15:45:00Z',
  },
  {
    id: '8',
    userId: '3',
    userName: 'Jane Smith',
    action: 'completed',
    target: 'Task: Review documents',
    timestamp: '2024-03-13T10:30:00Z',
  },
];
