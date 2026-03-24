'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitForm } from '@/hooks/use-forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, FileText } from 'lucide-react';

const invoiceSchema = z.object({
  clientName: z.string().min(2, 'Le nom du client est requis'),
  clientEmail: z.string().email('Veuillez entrer un email valide'),
  amount: z.coerce.number().min(0.01, 'Le montant doit être supérieur à 0'),
  dueDate: z.string().min(1, 'La date d\'échéance est requise'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export function InvoiceFormCard() {
  const submitMutation = useSubmitForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      amount: 0,
      dueDate: '',
      description: '',
    },
  });

  const onSubmit = (data: InvoiceFormData) => {
    submitMutation.mutate(
      { formId: 'invoice-form', data },
      {
        onSuccess: () => {
          reset();
          submitMutation.reset();
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle facture</CardTitle>
        <CardDescription>Créer une nouvelle facture</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {submitMutation.isSuccess && (
            <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription>
                Facture créée avec succès !
              </AlertDescription>
            </Alert>
          )}

          {submitMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {submitMutation.error?.message || 'Échec de la création de la facture'}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="clientName">Nom du client</Label>
            <Input
              id="clientName"
              placeholder="Client ou entreprise"
              {...register('clientName')}
              aria-invalid={!!errors.clientName}
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email du client</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="client@company.com"
              {...register('clientEmail')}
              aria-invalid={!!errors.clientEmail}
            />
            {errors.clientEmail && (
              <p className="text-sm text-destructive">{errors.clientEmail.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (Ar)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount')}
                aria-invalid={!!errors.amount}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                aria-invalid={!!errors.dueDate}
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceDescription">Description</Label>
            <Textarea
              id="invoiceDescription"
              placeholder="Description de la facture..."
              rows={3}
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="mt-3 pt-2">
          <Button
            type="submit"
            className="w-full"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <Spinner className="mr-2" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            {submitMutation.isPending ? 'Création...' : 'Créer la facture'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
