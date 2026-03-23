'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreHorizontal, Check, X, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/common/data-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUpdateSubmissionStatus, useDeleteSubmission } from '@/hooks/use-forms';
import type { FormSubmission } from '@/types';

interface SubmissionsTableProps {
  submissions: FormSubmission[];
  isLoading?: boolean;
}

export function SubmissionsTable({ submissions, isLoading }: SubmissionsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<FormSubmission | null>(null);
  const updateStatus = useUpdateSubmissionStatus();
  const deleteSubmission = useDeleteSubmission();

  const columns: Column<FormSubmission>[] = [
    {
      key: 'formId',
      header: 'Formulaire',
      render: (item) => (
        <span className="font-medium capitalize">
          {item.formId.replace('-form', '').replace('-', ' ')}
        </span>
      ),
    },
    {
      key: 'data',
      header: 'Résumé',
      render: (item) => {
        const data = item.data as Record<string, unknown>;
        const summary = data.name || data.clientName || data.email || 'N/A';
        return <span className="text-muted-foreground">{String(summary)}</span>;
      },
    },
    {
      key: 'submittedAt',
      header: 'Soumis',
      render: (item) => (
        <span className="text-muted-foreground">
          {formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true, locale: fr })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-[52px] text-right',
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label={`Actions pour la soumission ${item.id}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {item.status === 'pending' && (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    updateStatus.mutate({ submissionId: item.id, status: 'approved' })
                  }
                >
                  <Check className="mr-2 h-4 w-4 text-emerald-600" />
                  Approuver
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateStatus.mutate({ submissionId: item.id, status: 'rejected' })
                  }
                >
                  <X className="mr-2 h-4 w-4 text-destructive" />
                  Rejeter
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {item.status === 'approved' && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatus.mutate({ submissionId: item.id, status: 'rejected' })
                }
              >
                <X className="mr-2 h-4 w-4" />
                Marquer comme rejeté
              </DropdownMenuItem>
            )}
            {item.status === 'rejected' && (
              <DropdownMenuItem
                onClick={() =>
                  updateStatus.mutate({ submissionId: item.id, status: 'approved' })
                }
              >
                <Check className="mr-2 h-4 w-4" />
                Marquer comme approuvé
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={submissions}
        isLoading={isLoading}
        emptyMessage="Aucune soumission"
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleteSubmission.isPending) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette soumission ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La soumission sera retirée de la liste.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSubmission.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSubmission.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (!deleteTarget) return;
                deleteSubmission.mutate(deleteTarget.id, {
                  onSettled: () => setDeleteTarget(null),
                });
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
