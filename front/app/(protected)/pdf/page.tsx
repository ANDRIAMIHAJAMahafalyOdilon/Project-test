'use client';

import { useState } from 'react';
import { usePDFTemplates, useGeneratedPDFs, useDocuSignEnvelopes } from '@/hooks/use-pdf';
import { PageHeader } from '@/components/common/page-header';
import { ErrorMessage } from '@/components/common/error-message';
import { PDFTemplateCard } from '@/components/pdf/pdf-template-card';
import { GeneratedPDFsTable } from '@/components/pdf/generated-pdfs-table';
import { DocuSignEnvelopesTable } from '@/components/pdf/docusign-envelopes-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function PDFGenerationPage() {
  const [activeTab, setActiveTab] = useState('templates');
  const { data: templates, isLoading: templatesLoading, error: templatesError, refetch: refetchTemplates } = usePDFTemplates();
  const { data: generatedPDFs, isLoading: pdfsLoading, error: pdfsError, refetch: refetchPDFs } = useGeneratedPDFs();
  const { data: envelopes, isLoading: envelopesLoading, error: envelopesError, refetch: refetchEnvelopes } = useDocuSignEnvelopes();

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Génération PDF"
        description="Générez des PDF et gérez les enveloppes DocuSign"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="generated">PDF générés</TabsTrigger>
          <TabsTrigger value="docusign">DocuSign</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          {templatesError ? (
            <ErrorMessage
              message={templatesError.message || 'Échec du chargement des modèles'}
              onRetry={() => refetchTemplates()}
            />
          ) : templatesLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {templates?.data.map((template) => (
                <PDFTemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="generated" className="mt-6">
          {pdfsError ? (
            <ErrorMessage
              message={pdfsError.message || 'Échec du chargement des PDF'}
              onRetry={() => refetchPDFs()}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>PDF générés</CardTitle>
              </CardHeader>
              <CardContent>
                <GeneratedPDFsTable
                  pdfs={generatedPDFs?.data || []}
                  isLoading={pdfsLoading}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="docusign" className="mt-6">
          {envelopesError ? (
            <ErrorMessage
              message={envelopesError.message || 'Échec du chargement des enveloppes'}
              onRetry={() => refetchEnvelopes()}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Enveloppes DocuSign</CardTitle>
              </CardHeader>
              <CardContent>
                <DocuSignEnvelopesTable
                  envelopes={envelopes?.data || []}
                  isLoading={envelopesLoading}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
