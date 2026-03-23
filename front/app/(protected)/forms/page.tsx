'use client';

import { useState } from 'react';
import { useFormSchemas, useFormSubmissions } from '@/hooks/use-forms';
import { PageHeader } from '@/components/common/page-header';
import { ErrorMessage } from '@/components/common/error-message';
import { ContactFormCard } from '@/components/forms/contact-form-card';
import { ProfileFormCard } from '@/components/forms/profile-form-card';
import { InvoiceFormCard } from '@/components/forms/invoice-form-card';
import { SubmissionsTable } from '@/components/forms/submissions-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileEdit, ListChecks } from 'lucide-react';

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState('forms');
  const { error: schemasError, refetch: refetchSchemas } = useFormSchemas();
  const {
    data: submissions,
    isLoading: submissionsLoading,
    error: submissionsError,
    refetch: refetchSubmissions,
  } = useFormSubmissions();

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Formulaires"
        description="Créez et gérez les soumissions de formulaires"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={activeTab === 'forms' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('forms')}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Remplir un formulaire
            </Button>
            <Button
              type="button"
              variant={activeTab === 'submissions' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('submissions')}
            >
              <ListChecks className="mr-2 h-4 w-4" />
              Voir les soumissions
            </Button>
          </div>
        }
      />

      {schemasError && (
        <ErrorMessage
          message={
            schemasError.message || 'Échec du chargement des modèles de formulaires'
          }
          onRetry={() => refetchSchemas()}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="forms">Formulaires</TabsTrigger>
          <TabsTrigger value="submissions">Soumissions</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ContactFormCard />
            <ProfileFormCard />
            <InvoiceFormCard />
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          {submissionsError ? (
            <ErrorMessage
              message={submissionsError.message || 'Échec du chargement des soumissions'}
              onRetry={() => refetchSubmissions()}
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                <CardTitle>Soumissions récentes</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetchSubmissions()}
                  disabled={submissionsLoading}
                >
                  Actualiser
                </Button>
              </CardHeader>
              <CardContent>
                <SubmissionsTable
                  submissions={submissions?.data ?? []}
                  isLoading={submissionsLoading}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
