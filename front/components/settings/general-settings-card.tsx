'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AppSettings } from '@/mock/users';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useLanguage } from '@/contexts/language-context';

const generalSchema = z.object({
  siteName: z.string().min(1, 'Le nom du site est requis'),
  siteDescription: z.string().min(1, 'La description est requise'),
  contactEmail: z.string().email('Email invalide'),
  timezone: z.string(),
  language: z.string(),
});

type GeneralFormData = z.infer<typeof generalSchema>;

interface GeneralSettingsCardProps {
  settings?: AppSettings['general'];
  onSave: (data: AppSettings['general']) => Promise<unknown>;
  isSaving: boolean;
}

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const languages = [
  { value: 'en', label: 'Anglais' },
  { value: 'fr', label: 'Français' },
];

export function GeneralSettingsCard({ settings, onSave, isSaving }: GeneralSettingsCardProps) {
  const { t, lang, setLang } = useLanguage();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
    defaultValues: settings,
  });

  const timezone = watch('timezone');
  const language = watch('language');

  const onSubmit = async (data: GeneralFormData) => {
    await onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.general.title')}</CardTitle>
        <CardDescription>{t('settings.general.description')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">{t('settings.general.siteName')}</Label>
            <Input
              id="siteName"
              {...register('siteName')}
              disabled={isSaving}
            />
            {errors.siteName && (
              <p className="text-sm text-destructive">{errors.siteName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">{t('settings.general.siteDescription')}</Label>
            <Input
              id="siteDescription"
              {...register('siteDescription')}
              disabled={isSaving}
            />
            {errors.siteDescription && (
              <p className="text-sm text-destructive">{errors.siteDescription.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">{t('settings.general.contactEmail')}</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register('contactEmail')}
              disabled={isSaving}
            />
            {errors.contactEmail && (
              <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">{t('settings.general.timezone')}</Label>
              <Select
                value={timezone}
                onValueChange={(value) => setValue('timezone', value)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder={lang === 'fr' ? 'Choisir un fuseau' : 'Choose timezone'} />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">{t('settings.general.language')}</Label>
              <Select
                value={language}
                onValueChange={(value) => {
                  setValue('language', value);
                  setLang(value === 'fr' ? 'fr' : 'en');
                }}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder={lang === 'fr' ? 'Choisir une langue' : 'Choose language'} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Spinner className="mr-2" />}
            {t('settings.general.save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
