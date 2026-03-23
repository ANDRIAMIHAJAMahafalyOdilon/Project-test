'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ChartDataPoint } from '@/types';

interface UserGrowthChartProps {
  data: ChartDataPoint[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const formatNumber = (value: number) => {
    return `${(value / 1000).toFixed(1)}k`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={formatNumber}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--popover-foreground))',
          }}
          formatter={(value: number) => [value.toLocaleString(), '']}
          labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
        />
        <Legend />
        <Bar
          dataKey="previousValue"
          name="Période précédente"
          fill="hsl(var(--chart-2))"
          radius={[4, 4, 0, 0]}
          opacity={0.6}
        />
        <Bar
          dataKey="value"
          name="Période actuelle"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
