import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, LayoutDashboard, FilePlus, Shield, Zap, Users } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Tableau de bord',
    description: 'Indicateurs en temps réel avec graphiques et métriques pour suivre vos performances.',
  },
  {
    icon: FileText,
    title: 'Formulaires dynamiques',
    description: 'Créez et gérez des formulaires avec validation, suivi des soumissions et workflows personnalisés.',
  },
  {
    icon: FilePlus,
    title: 'Génération PDF',
    description: 'Générez des PDF professionnels à partir de modèles avec données et mise en forme personnalisables.',
  },
  {
    icon: Shield,
    title: 'Intégration DocuSign',
    description: 'Workflow de signature électronique avec DocuSign pour contrats et accords.',
  },
  {
    icon: Zap,
    title: 'Rapide et réactif',
    description: 'Conçu avec des technologies modernes pour des performances optimales sur tous les appareils.',
  },
  {
    icon: Users,
    title: 'Gestion des utilisateurs',
    description: 'Authentification sécurisée avec contrôle d\'accès par rôle et profils utilisateurs.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            DocuFlow
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Commencer</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Gestion documentaire
              <span className="text-primary block mt-2">simplifiée</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl text-pretty">
              Rationalisez vos flux documentaires avec notre plateforme complète. 
              Générez des PDF, gérez des formulaires et traitez les signatures électroniques en un seul endroit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t bg-muted/30">
          <div className="container py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-muted-foreground mt-2">
                Des fonctionnalités puissantes pour gérer vos documents efficacement
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="bg-background">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
