'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitProfileForm } from '@/hooks/use-forms';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, Save } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer un email valide'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
  notifications: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileFormCard() {
  const { user } = useAuth();
  const submitMutation = useSubmitProfileForm();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      notifications: true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
        bio: '',
        notifications: true,
      });
    }
  }, [user, reset]);

  const notifications = watch('notifications');

  const onSubmit = (data: ProfileFormData) => {
    submitMutation.mutate(data, {
      onSuccess: () => {
        submitMutation.reset();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Mettez à jour vos informations</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {submitMutation.isSuccess && (
            <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription>
                Profil mis à jour !
              </AlertDescription>
            </Alert>
          )}

          {submitMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {submitMutation.error?.message || 'Échec de la mise à jour'}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register('firstName')}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register('lastName')}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileEmail">Adresse email</Label>
            <Input
              id="profileEmail"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone (optionnel)</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optionnelle)</Label>
            <Textarea
              id="bio"
              placeholder="Parlez-nous de vous..."
              rows={3}
              {...register('bio')}
              aria-invalid={!!errors.bio}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir les mises à jour par email
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={(checked) => setValue('notifications', checked)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <Spinner className="mr-2" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {submitMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
