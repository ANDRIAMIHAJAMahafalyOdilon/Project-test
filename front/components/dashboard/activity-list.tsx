'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ActivityLog } from '@/types';
import { cn } from '@/lib/utils';

interface ActivityListProps {
  activities: ActivityLog[];
}

const actionColors: Record<string, string> = {
  created: 'text-emerald-600',
  approved: 'text-emerald-600',
  updated: 'text-blue-600',
  signed: 'text-cyan-600',
  generated: 'text-indigo-600',
  deleted: 'text-red-600',
  sent: 'text-amber-600',
  completed: 'text-emerald-600',
};

export function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No recent activity
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const initials = activity.userName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();

        return (
          <div key={activity.id} className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.userName}</span>{' '}
                <span className={cn('font-medium', actionColors[activity.action] || 'text-muted-foreground')}>
                  {activity.action}
                </span>{' '}
                <span className="text-muted-foreground">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: fr })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
