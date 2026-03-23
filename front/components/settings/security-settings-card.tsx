'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AppSettings } from '@/mock/users';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';

const securitySchema = z.object({
  twoFactorAuth: z.boolean(),
  sessionTimeout: z.number().min(5).max(120),
  passwordExpiry: z.number().min(30).max(365),
  loginAttempts: z.number().min(3).max(10),
});

type SecurityFormData = z.infer<typeof securitySchema>;

interface SecuritySettingsCardProps {
  settings?: AppSettings['security'];
  onSave: (data: AppSettings['security']) => Promise<unknown>;
  isSaving: boolean;
}

export function SecuritySettingsCard({ settings, onSave, isSaving }: SecuritySettingsCardProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: settings,
  });

  const twoFactorAuth = watch('twoFactorAuth');

  const onSubmit = async (data: SecurityFormData) => {
    await onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
        <CardDescription>Configurez les options de sécurité de l\'application.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuth" className="text-base">
                Authentification à deux facteurs
              </Label>
              <p className="text-sm text-muted-foreground">
                Sécurisez davantage votre compte
              </p>
            </div>
            <Switch
              id="twoFactorAuth"
              checked={twoFactorAuth}
              onCheckedChange={(checked) => setValue('twoFactorAuth', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Déconnexion automatique (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              {...register('sessionTimeout', { valueAsNumber: true })}
              disabled={isSaving}
            />
            {errors.sessionTimeout && (
              <p className="text-sm text-destructive">{errors.sessionTimeout.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Déconnexion automatique après inactivité (5-120 minutes)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordExpiry">Expiration du mot de passe (jours)</Label>
            <Input
              id="passwordExpiry"
              type="number"
              {...register('passwordExpiry', { valueAsNumber: true })}
              disabled={isSaving}
            />
            {errors.passwordExpiry && (
              <p className="text-sm text-destructive">{errors.passwordExpiry.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Changement de mot de passe requis après ce délai (30-365 jours)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loginAttempts">Tentatives de connexion max.</Label>
            <Input
              id="loginAttempts"
              type="number"
              {...register('loginAttempts', { valueAsNumber: true })}
              disabled={isSaving}
            />
            {errors.loginAttempts && (
              <p className="text-sm text-destructive">{errors.loginAttempts.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Verrouillage du compte après échecs (3-10)
            </p>
          </div>
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
