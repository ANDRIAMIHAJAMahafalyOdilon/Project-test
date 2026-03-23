'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useVoidDocuSignEnvelope } from '@/hooks/use-pdf';
import { DataTable, type Column } from '@/components/common/data-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
import { XCircle } from 'lucide-react';
import type { DocuSignEnvelope } from '@/types';

interface DocuSignEnvelopesTableProps {
  envelopes: DocuSignEnvelope[];
  isLoading?: boolean;
}

export function DocuSignEnvelopesTable({ envelopes, isLoading }: DocuSignEnvelopesTableProps) {
  const voidMutation = useVoidDocuSignEnvelope();
  const [voidTarget, setVoidTarget] = useState<DocuSignEnvelope | null>(null);

  const columns: Column<DocuSignEnvelope>[] = [
    {
      key: 'subject',
      header: 'Objet',
      render: (item) => (
        <span className="font-medium">{item.subject}</span>
      ),
    },
    {
      key: 'recipients',
      header: 'Destinataires',
      render: (item) => (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            {item.recipients.slice(0, 3).map((recipient, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6 border-2 border-background -ml-1 first:ml-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {recipient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">{recipient.name}</p>
                    <p className="text-muted-foreground">{recipient.email}</p>
                    <p className="capitalize">{recipient.status}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          {item.recipients.length > 3 && (
            <span className="text-xs text-muted-foreground ml-1">
              +{item.recipients.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'createdAt',
      header: 'Créé',
      render: (item) => (
        <span className="text-muted-foreground">
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: fr })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          {item.status !== 'completed' && item.status !== 'declined' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoidTarget(item)}
              disabled={voidMutation.isPending}
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="h-4 w-4" />
              <span className="sr-only">Annuler</span>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={envelopes}
        isLoading={isLoading}
        emptyMessage="Aucune enveloppe DocuSign"
      />

      <AlertDialog
        open={!!voidTarget}
        onOpenChange={(open) => {
          if (!open && !voidMutation.isPending) setVoidTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler cette enveloppe ?</AlertDialogTitle>
            <AlertDialogDescription>
              L&apos;enveloppe DocuSign « {voidTarget?.subject} » sera annulée. Les
              destinataires ne pourront plus signer ce document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={voidMutation.isPending}>Retour</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={voidMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (!voidTarget) return;
                voidMutation.mutate(voidTarget.id, {
                  onSettled: () => setVoidTarget(null),
                });
              }}
            >
              Annuler l&apos;enveloppe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
