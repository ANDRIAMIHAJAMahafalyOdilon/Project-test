'use client';

import { useState } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/use-settings';
import { PageHeader } from '@/components/common/page-header';
import { ErrorMessage } from '@/components/common/error-message';
import { GeneralSettingsCard } from '@/components/settings/general-settings-card';
import { NotificationSettingsCard } from '@/components/settings/notification-settings-card';
import { SecuritySettingsCard } from '@/components/settings/security-settings-card';
import { AppearanceSettingsCard } from '@/components/settings/appearance-settings-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Shield, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const { data, isLoading, error, refetch } = useSettings();
  const updateSettings = useUpdateSettings();
  const { t } = useLanguage();

  if (error) {
    return (
      <div className="container py-6">
        <PageHeader title={t('settings.page.title')} description={t('settings.page.description')} />
        <div className="mt-6">
          <ErrorMessage
            message={error.message || 'Échec du chargement des paramètres'}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <PageHeader title={t('settings.page.title')} description={t('settings.page.description')} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.tabs.general')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.tabs.notifications')}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.tabs.security')}</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{t('settings.tabs.appearance')}</span>
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <>
            <TabsContent value="general">
              <GeneralSettingsCard
                settings={data?.data.general}
                onSave={(general) => updateSettings.mutateAsync({ general })}
                isSaving={updateSettings.isPending}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettingsCard
                settings={data?.data.notifications}
                onSave={(notifications) => updateSettings.mutateAsync({ notifications })}
                isSaving={updateSettings.isPending}
              />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettingsCard
                settings={data?.data.security}
                onSave={(security) => updateSettings.mutateAsync({ security })}
                isSaving={updateSettings.isPending}
              />
            </TabsContent>

            <TabsContent value="appearance">
              <AppearanceSettingsCard
                settings={data?.data.appearance}
                onSave={(appearance) => updateSettings.mutateAsync({ appearance })}
                isSaving={updateSettings.isPending}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
