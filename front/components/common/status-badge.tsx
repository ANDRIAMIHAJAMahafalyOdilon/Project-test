import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'draft' 
  | 'sent' 
  | 'delivered' 
  | 'completed' 
  | 'declined';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: 'En attente',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
  },
  approved: {
    label: 'Approuvé',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  rejected: {
    label: 'Rejeté',
    className: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  },
  draft: {
    label: 'Brouillon',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400',
  },
  sent: {
    label: 'Envoyé',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
  },
  delivered: {
    label: 'Livré',
    className: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  completed: {
    label: 'Terminé',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  declined: {
    label: 'Refusé',
    className: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge
      variant="secondary"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
