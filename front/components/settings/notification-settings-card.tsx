'use client';

import { useForm } from 'react-hook-form';
import type { AppSettings } from '@/mock/users';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';

interface NotificationSettingsCardProps {
  settings?: AppSettings['notifications'];
  onSave: (data: AppSettings['notifications']) => Promise<unknown>;
  isSaving: boolean;
}

export function NotificationSettingsCard({ settings, onSave, isSaving }: NotificationSettingsCardProps) {
  const { watch, setValue, handleSubmit } = useForm({
    defaultValues: settings,
  });

  const onSubmit = async (data: AppSettings['notifications']) => {
    await onSave(data);
  };

  const notifications = [
    {
      id: 'emailNotifications',
      label: 'Notifications par email',
      description: 'Recevoir les mises à jour importantes par email',
    },
    {
      id: 'pushNotifications',
      label: 'Notifications push',
      description: 'Recevoir les notifications dans votre navigateur',
    },
    {
      id: 'weeklyDigest',
      label: 'Résumé hebdomadaire',
      description: 'Recevoir un récapitulatif hebdomadaire de l\'activité',
    },
    {
      id: 'marketingEmails',
      label: 'Emails marketing',
      description: 'Recevoir les actualités et nouvelles fonctionnalités',
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choisissez comment recevoir les notifications.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor={notification.id} className="text-base">
                  {notification.label}
                </Label>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
              <Switch
                id={notification.id}
                checked={watch(notification.id)}
                onCheckedChange={(checked) => setValue(notification.id, checked)}
                disabled={isSaving}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Spinner className="mr-2" />}
            Enregistrer
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
