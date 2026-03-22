# Backend API

API Node.js/Express/TypeScript avec MongoDB, PDFKit et DocuSign.

## Démarrage

```bash
# Variables d'environnement
cp .env.example .env
# Éditer .env : MONGO_URI, PORT, etc.

npm install
npm run dev
```

## Tests

```bash
# Avec MongoDB local (mongodb://127.0.0.1:27017/test)
set MONGO_URI=mongodb://127.0.0.1:27017/test
npm test

# Ou avec mongodb-memory-server (si le module se résout correctement)
npm test
```

## Endpoints

- `GET /api/health` — Health check
- `GET /api/pdf/templates` — Liste des modèles PDF
- `GET /api/pdf/templates/:id` — Détail d'un modèle
- `POST /api/pdf/generate` — Générer un PDF
- `GET /api/pdf/generated` — Liste des PDFs générés (paginée)
- `DELETE /api/pdf/generated/:id` — Supprimer un PDF
- `POST /api/docusign/envelopes` — Créer une enveloppe DocuSign
- `GET /api/docusign/envelopes` — Liste des enveloppes (paginée)
- `GET /api/docusign/envelopes/:id` — Détail d'une enveloppe
- `PATCH /api/docusign/envelopes/:id/void` — Annuler une enveloppe

Documentation Swagger : `/docs`

## Docker

```bash
docker build -t back .
docker run -p 4000:4000 -e MONGO_URI=mongodb://host.docker.internal:27017/app back
```
