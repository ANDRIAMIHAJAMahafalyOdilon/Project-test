import type { PDFTemplate, PDFGenerationResponse, DocuSignEnvelope } from '@/types';

export const mockPDFTemplates: PDFTemplate[] = [
  {
    id: 'invoice-template',
    name: 'Modèle de facture',
    description: 'Modèle de facture standard avec charte graphique',
    category: 'invoice',
  },
  {
    id: 'report-template',
    name: 'Rapport d\'activité',
    description: 'Modèle de rapport professionnel pour bilans trimestriels',
    category: 'report',
  },
  {
    id: 'contract-template',
    name: 'Contrat de prestation',
    description: 'Contrat type d\'accord de services',
    category: 'contract',
  },
  {
    id: 'certificate-template',
    name: 'Certificat de formation',
    description: 'Certificat de fin de formation et stages',
    category: 'certificate',
  },
  {
    id: 'nda-template',
    name: 'Accord de confidentialité',
    description: 'Modèle NDA type pour partenariats',
    category: 'contract',
  },
  {
    id: 'job-posting-fullstack-test',
    name: 'Fiche de poste — Full Stack & Test Engineer',
    description:
      'Document PDF structuré conforme à la fiche de poste (missions, tests, compétences, profil).',
    category: 'job',
  },
];

export const mockGeneratedPDFs: PDFGenerationResponse[] = [
  {
    id: 'pdf-001',
    url: '/mock-pdfs/invoice-2024-001.pdf',
    filename: 'Invoice-2024-001.pdf',
    size: 125400,
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'pdf-002',
    url: '/mock-pdfs/report-q1-2024.pdf',
    filename: 'Report-Q1-2024.pdf',
    size: 2458000,
    createdAt: '2024-03-14T16:45:00Z',
  },
  {
    id: 'pdf-003',
    url: '/mock-pdfs/contract-acme-2024.pdf',
    filename: 'Contract-Acme-2024.pdf',
    size: 89200,
    createdAt: '2024-03-13T11:20:00Z',
  },
];

export const mockDocuSignEnvelopes: DocuSignEnvelope[] = [
  {
    id: 'env-001',
    status: 'completed',
    subject: 'Service Agreement - Acme Corp',
    recipients: [
      { email: 'john@acme.com', name: 'John Smith', status: 'signed' },
      { email: 'legal@company.com', name: 'Legal Team', status: 'signed' },
    ],
    createdAt: '2024-03-10T09:00:00Z',
    completedAt: '2024-03-12T14:30:00Z',
  },
  {
    id: 'env-002',
    status: 'sent',
    subject: 'NDA - Partner Company',
    recipients: [
      { email: 'ceo@partner.com', name: 'CEO Partner', status: 'pending' },
    ],
    createdAt: '2024-03-14T10:00:00Z',
  },
  {
    id: 'env-003',
    status: 'delivered',
    subject: 'Employment Contract - New Hire',
    recipients: [
      { email: 'newhire@email.com', name: 'New Employee', status: 'pending' },
      { email: 'hr@company.com', name: 'HR Department', status: 'signed' },
    ],
    createdAt: '2024-03-15T08:00:00Z',
  },
  {
    id: 'env-004',
    status: 'declined',
    subject: 'Amendment - Previous Contract',
    recipients: [
      { email: 'client@other.com', name: 'Client Name', status: 'declined' },
    ],
    createdAt: '2024-03-08T11:00:00Z',
  },
];
