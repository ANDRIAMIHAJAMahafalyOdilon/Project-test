'use client';

import { useDashboardData } from '@/hooks/use-dashboard';
import { PageHeader } from '@/components/common/page-header';
import { StatsCard } from '@/components/common/stats-card';
import { ErrorMessage } from '@/components/common/error-message';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { UserGrowthChart } from '@/components/dashboard/user-growth-chart';
import { ActivityList } from '@/components/dashboard/activity-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, CheckSquare, TrendingUp } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardData();

  if (error) {
    return (
      <div className="container py-6">
        <PageHeader
          title="Tableau de bord"
          description="Vue d'ensemble de vos indicateurs et activités"
        />
        <div className="mt-6">
          <ErrorMessage
            message={error.message || 'Échec du chargement des données'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your business metrics and activity"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="Total utilisateurs"
              value={formatNumber(data?.data.stats.totalUsers || 0)}
              icon={Users}
              trend={{ value: 12.5, isPositive: true }}
              description="par rapport au mois dernier"
            />
            <StatsCard
              title="Chiffre d'affaires"
              value={formatCurrency(data?.data.stats.totalRevenue || 0)}
              icon={DollarSign}
              trend={{ value: 8.2, isPositive: true }}
              description="par rapport au mois dernier"
            />
            <StatsCard
              title="Tâches terminées"
              value={data?.data.stats.completedTasks || 0}
              icon={CheckSquare}
              description={`${data?.data.stats.pendingTasks || 0} en attente`}
            />
            <StatsCard
              title="Taux de conversion"
              value={`${data?.data.stats.conversionRate || 0}%`}
              icon={TrendingUp}
              trend={{ value: 0.3, isPositive: true }}
              description="par rapport à la semaine dernière"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <RevenueChart data={data?.data.revenueChart || []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Croissance des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <UserGrowthChart data={data?.data.userGrowth || []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ActivityList activities={data?.data.recentActivity || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
