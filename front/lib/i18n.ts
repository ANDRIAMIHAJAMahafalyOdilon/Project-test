export type Lang = 'fr' | 'en';

export type I18nKey =
  | 'sidebar.principal'
  | 'sidebar.management'
  | 'sidebar.dashboard'
  | 'sidebar.forms'
  | 'sidebar.pdf'
  | 'sidebar.users'
  | 'sidebar.settings'
  | 'breadcrumb.dashboard'
  | 'breadcrumb.forms'
  | 'breadcrumb.pdf'
  | 'breadcrumb.users'
  | 'breadcrumb.settings'
  | 'settings.page.title'
  | 'settings.page.description'
  | 'settings.tabs.general'
  | 'settings.tabs.notifications'
  | 'settings.tabs.security'
  | 'settings.tabs.appearance'
  | 'settings.general.title'
  | 'settings.general.description'
  | 'settings.general.siteName'
  | 'settings.general.siteDescription'
  | 'settings.general.contactEmail'
  | 'settings.general.timezone'
  | 'settings.general.language'
  | 'settings.general.save';

const dict: Record<Lang, Record<I18nKey, string>> = {
  fr: {
    'sidebar.principal': 'Principal',
    'sidebar.management': 'Gestion',
    'sidebar.dashboard': 'Tableau de bord',
    'sidebar.forms': 'Formulaires',
    'sidebar.pdf': 'Génération PDF',
    'sidebar.users': 'Utilisateurs',
    'sidebar.settings': 'Paramètres',

    'breadcrumb.dashboard': 'Tableau de bord',
    'breadcrumb.forms': 'Formulaires',
    'breadcrumb.pdf': 'Génération PDF',
    'breadcrumb.users': 'Utilisateurs',
    'breadcrumb.settings': 'Paramètres',

    'settings.page.title': 'Paramètres',
    'settings.page.description': 'Gérez les paramètres de l’application',

    'settings.tabs.general': 'Général',
    'settings.tabs.notifications': 'Notifications',
    'settings.tabs.security': 'Sécurité',
    'settings.tabs.appearance': 'Apparence',

    'settings.general.title': 'Paramètres généraux',
    'settings.general.description':
      "Configurez les informations de base de l’application.",
    'settings.general.siteName': 'Nom du site',
    'settings.general.siteDescription': 'Description du site',
    'settings.general.contactEmail': 'Email de contact',
    'settings.general.timezone': 'Fuseau horaire',
    'settings.general.language': 'Langue',
    'settings.general.save': 'Enregistrer',
  },
  en: {
    'sidebar.principal': 'Main',
    'sidebar.management': 'Management',
    'sidebar.dashboard': 'Dashboard',
    'sidebar.forms': 'Forms',
    'sidebar.pdf': 'PDF Generation',
    'sidebar.users': 'Users',
    'sidebar.settings': 'Settings',

    'breadcrumb.dashboard': 'Dashboard',
    'breadcrumb.forms': 'Forms',
    'breadcrumb.pdf': 'PDF Generation',
    'breadcrumb.users': 'Users',
    'breadcrumb.settings': 'Settings',

    'settings.page.title': 'Settings',
    'settings.page.description': 'Manage application settings',

    'settings.tabs.general': 'General',
    'settings.tabs.notifications': 'Notifications',
    'settings.tabs.security': 'Security',
    'settings.tabs.appearance': 'Appearance',

    'settings.general.title': 'General settings',
    'settings.general.description': 'Configure base application information.',
    'settings.general.siteName': 'Site name',
    'settings.general.siteDescription': 'Site description',
    'settings.general.contactEmail': 'Contact email',
    'settings.general.timezone': 'Timezone',
    'settings.general.language': 'Language',
    'settings.general.save': 'Save',
  },
};

export function getT(lang: Lang) {
  return (key: I18nKey) => dict[lang][key] ?? dict.fr[key] ?? key;
}

