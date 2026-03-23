'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDeletePDF } from '@/hooks/use-pdf';
import { downloadPDF } from '@/api/pdf';
import { DataTable, type Column } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
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
import { Download, Trash2 } from 'lucide-react';
import type { PDFGenerationResponse } from '@/types';

interface GeneratedPDFsTableProps {
  pdfs: PDFGenerationResponse[];
  isLoading?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function GeneratedPDFsTable({ pdfs, isLoading }: GeneratedPDFsTableProps) {
  const deleteMutation = useDeletePDF();
  const [downloadTarget, setDownloadTarget] = useState<PDFGenerationResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PDFGenerationResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadConfirm = async () => {
    if (!downloadTarget) return;
    setIsDownloading(true);
    try {
      const blob = await downloadPDF(downloadTarget.id, downloadTarget.filename);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadTarget.filename;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadTarget(null);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  const columns: Column<PDFGenerationResponse>[] = [
    {
      key: 'filename',
      header: 'Nom du fichier',
      render: (item) => (
        <span className="font-medium">{item.filename}</span>
      ),
    },
    {
      key: 'size',
      header: 'Taille',
      render: (item) => (
        <span className="text-muted-foreground">{formatFileSize(item.size)}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Généré',
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDownloadTarget(item)}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Télécharger</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(item)}
            disabled={deleteMutation.isPending}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Supprimer</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={pdfs}
        isLoading={isLoading}
        emptyMessage="Aucun PDF généré"
      />
      <AlertDialog
        open={!!downloadTarget}
        onOpenChange={(open) => {
          if (!open && !isDownloading) setDownloadTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Télécharger le PDF</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmer le téléchargement de &quot;{downloadTarget?.filename}&quot; sur votre
              appareil.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDownloading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDownloadConfirm} disabled={isDownloading}>
              {isDownloading ? 'Téléchargement...' : 'Télécharger'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce PDF ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le fichier &quot;{deleteTarget?.filename}&quot; sera définitivement supprimé de la
              liste des PDF générés. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
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
