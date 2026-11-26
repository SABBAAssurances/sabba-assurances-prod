# 🚀 Guide de Déploiement Vercel

> La référence à jour pour les variables d'environnement et l'API est le [README principal](README.md). En cas de divergence, le README fait foi.

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

**IMPORTANT** : Configurez les variables d'environnement directement dans le dashboard Vercel :

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet backend
3. Allez dans "Settings" → "Environment Variables"
4. Ajoutez les variables suivantes :

| Variable                  | Description                            | Exemple                                                          |
| ------------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| `FRONTEND_URL`            | URL du frontend                        | `https://sabba-assurances-frontend.vercel.app`                   |
| `API_KEY_IMMATRICULATION` | Clé API immatriculation                | `TokenDemo2025A`                                                 |
| `BREVO_API_KEY`           | Clé API Brevo                          | `xkeysib-...`                                                    |
| `NODE_ENV`                | Mode environnement                     | `production`                                                     |
| `EMAIL_SENDER`            | Email d'expédition                     | `sender@mail.fr`                                                 |
| `EMAILS_RECIPIENT`        | Emails de réception (séparés par ,)   | `recipient1@mail.fr,recipient2@mail.fr,recipient3@mail.fr`       |
| `TURNSTILE_SECRET_KEY`    | Clé secrète Cloudflare Turnstile (obligatoire) | `0x4AAAA...`                                            |

**Note** : Ne pas utiliser la commande `vercel env add` pour éviter les conflits.

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
REACT_APP_TURNSTILE_SITE_KEY=votre_cle_publique_turnstile
```

**Option 2 : Variables Vercel (Recommandé)**

```bash
vercel env add REACT_APP_API_URL
```

Valeur : `https://sabba-assurances-backend.vercel.app/api`

```bash
vercel env add REACT_APP_TURNSTILE_SITE_KEY
```

Valeur : la clé publique du widget Cloudflare Turnstile (obligatoire).

#### D. Déployer le frontend

```bash
vercel --prod
```

### 3. Configuration des Domaines

#### A. Backend

- URL : `https://sabba-assurances-backend.vercel.app`
- Endpoints :
  - `GET /api/health`
  - `GET /api/vref`
  - `POST /api/send-email-recap`

#### B. Frontend

- URL : `https://sabba-assurances-frontend.vercel.app`
- Redirige automatiquement les requêtes `/api/*` vers le backend

## 🔧 Configuration Avancée

### Structure Vercel Functions

Le backend utilise une structure Express.js adaptée pour Vercel :

- `api/index.js` : Point d'entrée principal (fonction serverless)
- `routes/` : Définition des routes Express
- `controllers/` : Logique métier
- `services/` : Services externes (API, email)

### Variables d'environnement Backend (Vercel Dashboard)

| Variable                  | Description             | Exemple                                        |
| ------------------------- | ----------------------- | ---------------------------------------------- |
| `FRONTEND_URL`            | URL du frontend         | `https://sabba-assurances-frontend.vercel.app` |
| `API_KEY_IMMATRICULATION` | Clé API immatriculation | `TokenDemo2025A`                               |
| `BREVO_API_KEY`           | Clé API Brevo           | `xkeysib-...`                                  |
| `NODE_ENV`                | Mode environnement      | `production`                                   |
| `EMAIL_SENDER`            | Email d'expédition      | `sender@mail.fr`                               |
| `EMAILS_RECIPIENT`        | Emails de réception     | `recipient1@mail.fr,recipient2@mail.fr`        |
| `TURNSTILE_SECRET_KEY`    | Clé secrète Turnstile   | `0x4AAAA...`                                   |

### Variables d'environnement Frontend (Vercel Dashboard)

| Variable            | Description          | Exemple                                           |
| ------------------- | -------------------- | ------------------------------------------------- |
| `REACT_APP_API_URL` | URL de l'API backend | `https://sabba-assurances-backend.vercel.app/api` |
| `REACT_APP_TURNSTILE_SITE_KEY` | Clé publique Turnstile | `0x4AAAA...`                          |

### Configuration locale (Développement)

**Backend** (`backend/.env`) :

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
API_KEY_IMMATRICULATION=TokenDemo2025A
BREVO_API_KEY=your_brevo_api_key_here
NODE_ENV=development
EMAIL_SENDER=sender@mail.fr
EMAILS_RECIPIENT=recipient1@mail.fr
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

**Frontend** (`frontend/.env`) :

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

## 🧪 Tests Post-Déploiement

### 1. Test du Backend

```bash
# Test de disponibilité (seul endpoint appelable sans protection)
curl "https://sabba-assurances-backend.vercel.app/api/health"
```

Les endpoints `/api/vref` et `/api/send-email-recap` exigent un `Origin` valide et un token Turnstile : ils répondent 403 à un appel `curl` direct, c'est le comportement attendu. Ils se testent depuis le frontend.

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

### Erreur "Environment Variable references Secret which does not exist"

- Cette erreur se produit quand `vercel.json` référence des secrets inexistants
- **Solution** : Supprimer la section `"env"` du fichier `vercel.json`
- Configurer les variables d'environnement directement dans le dashboard Vercel
- Ne pas utiliser `vercel env add` pour éviter les conflits

### Erreur 404 sur toutes les routes

- **Cause** : Vercel ne trouve pas le point d'entrée de l'application
- **Solution** : Vérifier que `api/index.js` existe et exporte l'app Express
- Vérifier que `vercel.json` contient la configuration des routes
- Redéployer après modification : `vercel --prod`

### Erreur "Cannot find module" dans les logs

- Vérifier que toutes les dépendances sont dans `package.json`
- S'assurer que les chemins d'importation sont corrects
- Vérifier que les fichiers `routes/` et `controllers/` existent

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
