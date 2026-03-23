'use client';

import { useForm } from 'react-hook-form';
import type { AppSettings } from '@/mock/users';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { Sun, Moon, Monitor } from 'lucide-react';

interface AppearanceSettingsCardProps {
  settings?: AppSettings['appearance'];
  onSave: (data: AppSettings['appearance']) => Promise<unknown>;
  isSaving: boolean;
}

export function AppearanceSettingsCard({ settings, onSave, isSaving }: AppearanceSettingsCardProps) {
  const { watch, setValue, handleSubmit } = useForm({
    defaultValues: settings,
  });

  const theme = watch('theme');
  const compactMode = watch('compactMode');
  const showAvatars = watch('showAvatars');

  const onSubmit = async (data: AppSettings['appearance']) => {
    await onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
        <CardDescription>Personnalisez l\'apparence de l\'application.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base">Theme</Label>
            <RadioGroup
              value={theme}
              onValueChange={(value) => setValue('theme', value as AppSettings['appearance']['theme'])}
              className="grid grid-cols-3 gap-4"
              disabled={isSaving}
            >
              <div>
                <RadioGroupItem
                  value="light"
                  id="light"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Sun className="mb-3 h-6 w-6" />
                  Clair
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="dark"
                  id="dark"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Moon className="mb-3 h-6 w-6" />
                  Sombre
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="system"
                  id="system"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Monitor className="mb-3 h-6 w-6" />
                  Système
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="compactMode" className="text-base">
                Mode compact
              </Label>
              <p className="text-sm text-muted-foreground">
                Réduire les espacements dans l\'application
              </p>
            </div>
            <Switch
              id="compactMode"
              checked={compactMode}
              onCheckedChange={(checked) => setValue('compactMode', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="showAvatars" className="text-base">
                Afficher les avatars
              </Label>
              <p className="text-sm text-muted-foreground">
                Afficher les avatars dans les listes
              </p>
            </div>
            <Switch
              id="showAvatars"
              checked={showAvatars}
              onCheckedChange={(checked) => setValue('showAvatars', checked)}
              disabled={isSaving}
            />
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
