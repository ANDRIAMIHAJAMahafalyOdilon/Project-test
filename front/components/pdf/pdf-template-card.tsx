'use client';

import { useState } from 'react';
import { useGeneratePDF } from '@/hooks/use-pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import type { PDFTemplate } from '@/types';

interface PDFTemplateCardProps {
  template: PDFTemplate;
}

const categoryColors: Record<string, string> = {
  invoice: 'bg-blue-100 text-blue-800',
  report: 'bg-emerald-100 text-emerald-800',
  contract: 'bg-amber-100 text-amber-800',
  certificate: 'bg-cyan-100 text-cyan-800',
  job: 'bg-violet-100 text-violet-900 dark:bg-violet-950/40 dark:text-violet-200',
};

const categoryLabels: Record<string, string> = {
  invoice: 'Facture',
  report: 'Rapport',
  contract: 'Contrat',
  certificate: 'Certificat',
  job: 'Fiche de poste',
};

export function PDFTemplateCard({ template }: PDFTemplateCardProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const generateMutation = useGeneratePDF();

  const handleGenerate = () => {
    generateMutation.mutate(
      {
        templateId: template.id,
        data: {
          generatedAt: new Date().toISOString(),
          templateName: template.name,
        },
      },
      {
        onSuccess: () => {
          setIsGenerated(true);
          setTimeout(() => setIsGenerated(false), 3000);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              {template.name}
            </CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={categoryColors[template.category] || 'bg-gray-100 text-gray-800'}
          >
            {categoryLabels[template.category] || template.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isGenerated && (
          <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 mb-4">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription>
              PDF généré avec succès !
            </AlertDescription>
          </Alert>
        )}

        {generateMutation.isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {generateMutation.error?.message || 'Échec de la génération du PDF'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
        >
          {generateMutation.isPending ? (
            <Spinner className="mr-2" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {generateMutation.isPending ? 'Génération...' : 'Générer le PDF'}
        </Button>
      </CardFooter>
    </Card>
  );
}
