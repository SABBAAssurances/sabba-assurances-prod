# 🚗 Sabba Assurances - Devis Auto Prestige

Application complète de devis d'assurance automobile avec frontend React et backend Express.js.

## 🚀 Démarrage rapide

### Installation

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Configuration

**Backend** (`backend/.env`) :

```env
PORT=3001
FRONTEND_URL=http://url.fr
API_KEY_IMMATRICULATION=KEY
BREVO_API_KEY=KEY
NODE_ENV=development
EMAIL_SENDER=sender@mail.fr
EMAILS_RECIPIENT=recipient1@mail.fr,recipient2@mail.fr
```

### Lancement

**VS Code (recommandé)** :

1. Ouvrir le projet dans VS Code
2. Run and Debug → "🚀 Full Stack Dev" → F5

**Manuel** :

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

## 📱 Fonctionnalités

- **Recherche véhicule** par plaque d'immatriculation
- **Formulaire multi-étapes** avec validation
- **Sélection version commerciale** du véhicule
- **Envoi email récapitulatif** via Brevo
- **Mode développement** avec données mockées

## 🔌 API

- `GET /api/immatriculation?plaque=AA123BC` - Recherche véhicule
- `POST /api/send-email-recap` - Envoi email

## 🛠️ Technologies

**Frontend** : React 18, TypeScript, CSS Modules  
**Backend** : Express.js, Node.js, Brevo SDK

## 📁 Structure

```
sabba-assurances/
├── frontend/     # React App
├── backend/      # Express API
└── .vscode/      # Configuration VS Code
```

## 🚀 Déploiement

### Vercel (Recommandé)

Consultez le guide complet : [DEPLOYMENT.md](./DEPLOYMENT.md)

**Déploiement rapide :**

```bash
# Backend
cd backend && vercel --prod

# Frontend
cd frontend && vercel --prod
```

### Variables d'environnement Production

**Backend (Vercel Dashboard) :**

- `FRONTEND_URL` : URL de votre frontend Vercel
- `API_KEY_IMMATRICULATION` : Votre clé API
- `BREVO_API_KEY` : Votre clé Brevo
- `DEV` : `false` (production)

**Frontend (Vercel Dashboard) :**

- `REACT_APP_API_URL` : URL de votre backend Vercel + `/api`

### Configuration locale (Développement)

**Backend** (`backend/.env`) :

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
API_KEY_IMMATRICULATION=TokenDemo2025A
BREVO_API_KEY=your_brevo_api_key_here
DEV=true
```

**Frontend** (`frontend/.env`) :

```env
REACT_APP_API_URL=http://localhost:3001/api
```

---

**Développé pour Sabba Assurances par Rayan Kheloufi**
