# 🚀 Guide de Déploiement Vercel

## Prérequis

1. **Compte Vercel** : Créer un compte sur [vercel.com](https://vercel.com)
2. **Vercel CLI** : Installer la CLI Vercel
   ```bash
   npm i -g vercel
   ```

## 📋 Étapes de Déploiement

### 1. Déploiement du Backend

#### A. Préparer le projet backend

```bash
cd backend
```

#### B. Lier le projet à Vercel

```bash
vercel link
```

Suivez les instructions :

- Sélectionnez votre compte Vercel
- Choisissez "Link to existing project" ou "Create new project"
- Si nouveau projet, donnez un nom (ex: `sabba-assurances-backend`)

#### C. Variables d'environnement Vercel

Créer les variables d'environnement dans Vercel :

```bash
vercel env add FRONTEND_URL
vercel env add API_KEY_IMMATRICULATION
vercel env add BREVO_API_KEY
vercel env add NODE_ENV
vercel env add EMAIL_SENDER
vercel env add EMAIL_RECIPIENT
```

**Valeurs recommandées :**

- `FRONTEND_URL` : URL de votre frontend Vercel (ex: `https://sabba-assurances-frontend.vercel.app`)
- `API_KEY_IMMATRICULATION` : Votre clé API immatriculation
- `BREVO_API_KEY` : Votre clé API Brevo
- `NODE_ENV` : `production` (pour la production)
- `EMAIL_SENDER` : Votre email d'expédition (ex: `sender@mail.fr`)
- `EMAIL_RECIPIENT` : Votre email de réception (ex: `recipient@mail.fr`)

#### D. Déployer le backend

```bash
vercel --prod
```

**Notez l'URL du backend** (ex: `https://sabba-assurances-backend.vercel.app`)

### 2. Déploiement du Frontend

#### A. Préparer le projet frontend

```bash
cd frontend
```

#### B. Lier le projet à Vercel

```bash
vercel link
```

Suivez les instructions :

- Sélectionnez votre compte Vercel
- Choisissez "Link to existing project" ou "Create new project"
- Si nouveau projet, donnez un nom (ex: `sabba-assurances-frontend`)

#### C. Variables d'environnement Frontend

**Option 1 : Fichier .env.production**
Créer le fichier `.env.production` :

```env
REACT_APP_API_URL=https://sabba-assurances-backend.vercel.app/api
```

**Option 2 : Variables Vercel (Recommandé)**

```bash
vercel env add REACT_APP_API_URL
```

Valeur : `https://sabba-assurances-backend.vercel.app/api`

#### D. Déployer le frontend

```bash
vercel --prod
```

### 3. Configuration des Domaines

#### A. Backend

- URL : `https://sabba-assurances-backend.vercel.app`
- Endpoints :
  - `GET /api/immatriculation`
  - `POST /api/send-email-recap`

#### B. Frontend

- URL : `https://sabba-assurances-frontend.vercel.app`
- Redirige automatiquement les requêtes `/api/*` vers le backend

## 🔧 Configuration Avancée

### Variables d'environnement Backend (Vercel Dashboard)

| Variable                  | Description             | Exemple                                        |
| ------------------------- | ----------------------- | ---------------------------------------------- |
| `FRONTEND_URL`            | URL du frontend         | `https://sabba-assurances-frontend.vercel.app` |
| `API_KEY_IMMATRICULATION` | Clé API immatriculation | `TokenDemo2025A`                               |
| `BREVO_API_KEY`           | Clé API Brevo           | `xkeysib-...`                                  |
| `DEV`                     | Mode développement      | `false`                                        |

### Variables d'environnement Frontend (Vercel Dashboard)

| Variable            | Description          | Exemple                                           |
| ------------------- | -------------------- | ------------------------------------------------- |
| `REACT_APP_API_URL` | URL de l'API backend | `https://sabba-assurances-backend.vercel.app/api` |

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

## 🧪 Tests Post-Déploiement

### 1. Test du Backend

```bash
# Test de recherche véhicule
curl "https://sabba-assurances-backend.vercel.app/api/immatriculation?plaque=AA123BC"

# Test d'envoi email
curl -X POST "https://sabba-assurances-backend.vercel.app/api/send-email-recap" \
  -H "Content-Type: application/json" \
  -d '{"formData":{"nom":"Test","email":"test@test.com"}}'
```

### 2. Test du Frontend

- Ouvrir l'URL du frontend
- Tester la recherche de véhicule
- Tester l'envoi d'email
- Vérifier dans la console que `REACT_APP_API_URL` est bien défini

## 🔄 Mise à Jour

### Backend

```bash
cd backend
vercel --prod
```

### Frontend

```bash
cd frontend
vercel --prod
```

## 🐛 Dépannage

### Erreurs CORS

- Vérifier que `FRONTEND_URL` est correctement configuré
- S'assurer que l'URL ne se termine pas par `/`

### Erreurs d'API

- Vérifier les variables d'environnement dans Vercel Dashboard
- Consulter les logs dans Vercel Dashboard
- Vérifier que `REACT_APP_API_URL` est bien défini côté frontend

### Erreurs de Build

- Vérifier que toutes les dépendances sont dans `package.json`
- Consulter les logs de build dans Vercel Dashboard

### Variable REACT_APP_API_URL undefined

- S'assurer que la variable commence bien par `REACT_APP_`
- Vérifier la configuration dans Vercel Dashboard
- Redéployer après modification des variables d'environnement

### Erreur "Your codebase isn't linked to a project on Vercel"

- Exécuter `vercel link` dans le répertoire du projet
- Suivre les instructions pour lier le projet
- Vérifier que vous êtes connecté avec `vercel whoami`

### Erreur de liaison Vercel

- Vérifier que vous êtes connecté : `vercel login`
- Supprimer le lien existant : `vercel unlink`
- Relier le projet : `vercel link`

## 📊 Monitoring

### Vercel Analytics

- Activer Vercel Analytics pour le frontend
- Surveiller les performances et erreurs

### Logs

- Backend : Vercel Dashboard → Functions → Logs
- Frontend : Vercel Dashboard → Deployments → Logs

## 🔒 Sécurité

### Variables d'environnement

- Ne jamais commiter les clés API dans le code
- Utiliser les variables d'environnement Vercel
- Limiter l'accès aux variables sensibles
- **Important** : Les variables côté client (frontend) doivent commencer par `REACT_APP_`

### CORS

- Configurer correctement `FRONTEND_URL`
- Éviter `*` en production

---

**Déployé avec ❤️ sur Vercel**
