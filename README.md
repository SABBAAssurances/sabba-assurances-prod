# Sabba Assurances — Devis Auto Prestige

Application web de demande de devis d'assurance automobile. L'utilisateur saisit sa plaque d'immatriculation, les données du véhicule sont récupérées automatiquement depuis une API externe, puis un formulaire multi-étapes collecte les informations nécessaires et envoie un email récapitulatif à l'équipe Sabba Assurances.

**Frontend** : React 19 + TypeScript, déployé sur Vercel  
**Backend** : Express.js + Node.js, déployé sur Vercel (fonctions serverless)

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
4. [Lancer le projet en local](#lancer-le-projet-en-local)
5. [Architecture](#architecture)
6. [Structure des fichiers](#structure-des-fichiers)
7. [Parcours utilisateur](#parcours-utilisateur)
8. [Référence API](#référence-api)
9. [APIs externes](#apis-externes)
10. [Sécurité](#sécurité)
11. [Mode développement](#mode-développement)
12. [Déploiement sur Vercel](#déploiement-sur-vercel)

---

## Prérequis

- Node.js >= 18
- npm >= 9
- Comptes actifs sur : [apiplaqueimmatriculation.com](https://www.apiplaqueimmatriculation.com), [Brevo](https://brevo.com), [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)

---

## Installation

```bash
# Cloner le repo
git clone <url-du-repo>
cd sabba-assurances

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

---

## Configuration des variables d'environnement

### Backend — `backend/.env`

Copier depuis l'exemple :

```bash
cp backend/.env.example backend/.env
```

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port du serveur local | `3001` |
| `NODE_ENV` | Environnement. Si différent de `production`, active le mode dev (données mockées, emails loggués) | `development` |
| `FRONTEND_URL` | URL du frontend autorisée à appeler le backend. Requête refusée (403) si l'`Origin` ne correspond pas. | `http://localhost:3000` |
| `API_KEY_IMMATRICULATION` | Clé API pour [apiplaqueimmatriculation.com](https://www.apiplaqueimmatriculation.com). Inutilisée en mode dev. | `abc123...` |
| `BREVO_API_KEY` | Clé API Brevo (v3) pour l'envoi d'emails transactionnels. Inutilisée en mode dev. | `xkeysib-...` |
| `EMAIL_SENDER` | Adresse email expéditeur des demandes de devis. Doit être vérifiée dans Brevo. | `contact@sabba-assurances.fr` |
| `EMAILS_RECIPIENT` | Un ou plusieurs emails destinataires, séparés par des virgules. | `conseiller@sabba.fr,backup@sabba.fr` |
| `TURNSTILE_SECRET_KEY` | Clé secrète Cloudflare Turnstile (côté serveur). Obligatoire — toute requête sans token valide est rejetée (403). | `0x4AAAA...` |

**Exemple complet pour le développement local :**

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_KEY_IMMATRICULATION=votre_cle_ici
BREVO_API_KEY=votre_cle_brevo_ici
EMAIL_SENDER=contact@sabba-assurances.fr
EMAILS_RECIPIENT=conseiller@sabba.fr
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

> Utiliser les **clés de test Cloudflare** en local (voir [documentation officielle](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)). La clé secrète ci-dessus valide toujours côté backend.

---

### Frontend — `frontend/.env`

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Description | Exemple |
|---|---|---|
| `REACT_APP_API_URL` | URL de base de l'API backend, sans slash final | `http://localhost:3001/api` |
| `REACT_APP_TURNSTILE_SITE_KEY` | Clé publique Cloudflare Turnstile (côté client). Si absente, le widget n'est pas affiché et le formulaire fonctionne sans vérification. | `0x4AAAA...` |

**Exemple complet pour le développement local :**

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

> Utiliser les **clés de test Cloudflare** en local (voir [documentation officielle](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)). La clé publique ci-dessus valide toujours côté frontend.

---

## Lancer le projet en local

### Option 1 — VS Code (recommandé)

Ouvrir le dossier `sabba-assurances/` dans VS Code, puis **Run and Debug > "Full Stack Dev" > F5**.  
Les deux serveurs démarrent simultanément.

### Option 2 — Terminaux séparés

```bash
# Terminal 1 — Backend (http://localhost:3001)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend && npm start
```

---

## Architecture

```
sabba-assurances/
├── backend/
│   ├── api/index.js          ← Point d'entrée VERCEL (voir vercel.json)
│   ├── server.js             ← Point d'entrée LOCAL (nodemon)
│   ├── routes/
│   │   ├── immatriculation.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── immatriculationController.js
│   │   └── emailController.js
│   ├── services/
│   │   ├── immatriculationService.js  ← Appel apiplaqueimmatriculation.com
│   │   └── emailService.js            ← Envoi via Brevo, template HTML
│   └── vercel.json           ← Redirige TOUT le trafic vers api/index.js
│
└── frontend/
    └── src/
        ├── App.tsx            ← Orchestrateur principal, gestion des étapes
        ├── components/        ← Un composant par étape du formulaire
        ├── services/api.ts    ← Client HTTP axios vers le backend
        └── types/index.ts     ← Types TypeScript partagés
```

### Point critique : deux entry points backend

| Contexte | Fichier utilisé |
|---|---|
| Production (Vercel) | `backend/api/index.js` |
| Développement local | `backend/server.js` |

`backend/vercel.json` contient `"routes": [{ "src": "/(.*)", "dest": "/api/index.js" }]`, ce qui signifie que **toute modification de sécurité doit être faite dans `api/index.js`**, pas dans `server.js`.

### Serverless : pas d'état en mémoire

Sur Vercel, le backend tourne en fonctions serverless. Chaque invocation est indépendante — toute variable ou Map stockée en mémoire est réinitialisée à chaque appel. C'est pourquoi le projet n'utilise ni rate limiter en mémoire ni cache applicatif.

---

## Structure des fichiers

### Backend

```
backend/
├── api/
│   └── index.js              ← App Express complète pour Vercel. Contient les middlewares
│                               requireFrontendOrigin et requireTurnstileToken.
├── server.js                 ← Identique à api/index.js mais avec app.listen() pour local.
├── routes/
│   ├── immatriculation.js    ← GET /immatriculation
│   └── email.js              ← POST /send-email-recap
├── controllers/
│   ├── immatriculationController.js  ← Valide la plaque, appelle le service
│   └── emailController.js            ← Valide le body, appelle le service
├── services/
│   ├── immatriculationService.js     ← Appel HTTP vers apiplaqueimmatriculation.com.
│   │                                   Retourne des données mockées si NODE_ENV != production.
│   └── emailService.js               ← Construction du template HTML + envoi via Brevo.
│                                       Loggue l'email en console si NODE_ENV != production.
├── .env.example              ← Template des variables d'environnement
└── vercel.json               ← Config Vercel : maxDuration 30s, tout vers api/index.js
```

### Frontend

```
frontend/src/
├── App.tsx                   ← Machine à états du formulaire. Gère currentStep, formData,
│                               vehicleData, loading, error, success.
├── components/
│   ├── VehicleSearch.tsx     ← Étape 1 : saisie plaque + widget Turnstile
│   ├── ApiResultStep.tsx     ← Étape 2 : affichage résultat API, choix version commerciale
│   ├── InsuranceInfoStep.tsx ← Étape 3 : bonus/malus, sinistres, garanties
│   ├── VehicleInfoStep.tsx   ← Étape 4 : complétion données véhicule
│   ├── AdditionalInfoStep.tsx← Étape 5 : financement, stationnement, particularités
│   ├── PersonalInfoStepFirstPart.tsx  ← Étape 6a : identité, adresse
│   ├── PersonalInfoStepSecondPart.tsx ← Étape 6b : permis, profession, coordonnées
│   ├── SummaryStep.tsx       ← Étape 7 : récapitulatif + widget Turnstile pour envoi email
│   ├── SuccessStep.tsx       ← Étape 8 : confirmation envoi
│   └── StepIndicator.tsx     ← Barre de progression
├── services/
│   └── api.ts                ← getVehicleInfo(plaque, token) et sendEmailRecap(formData, vehicleData, token)
└── types/
    └── index.ts              ← FormData, VehicleData, FormStep (enum), ApiResponse
```

---

## Parcours utilisateur

```
1. VEHICLE_SEARCH      Saisie plaque d'immatriculation
         ↓
2. API_RESULT          Données véhicule récupérées — l'utilisateur choisit la version commerciale
         ↓                    (ou continue manuellement si véhicule non trouvé → étape VEHICLE_INFO)
3. INSURANCE_INFO      Bonus/malus, sinistres 36 mois, garanties souhaitées
         ↓
4. VEHICLE_INFO        Complétion des infos véhicule (valeur, énergie, puissance…)
         ↓
5. ADDITIONAL_INFO     Mode de financement, lieu de stationnement, demandes particulières
         ↓
6a. PERSONAL_INFO_1   Prénom, nom, adresse, code postal, ville, date de naissance
         ↓
6b. PERSONAL_INFO_2   Mois/année permis, profession, email, téléphone
         ↓
7. SUMMARY            Récapitulatif complet + envoi email via Brevo
         ↓
8. SUCCESS            Confirmation de la demande
```

**Lien direct avec pré-remplissage** : le frontend accepte le paramètre `?immat=AA-123-BC` dans l'URL pour pré-remplir et déclencher automatiquement la recherche.

---

## Référence API

Tous les endpoints nécessitent :
- Header `Origin` égal à la valeur de `FRONTEND_URL` (vérifié par `requireFrontendOrigin`)
- Header `X-Turnstile-Token` avec un token Cloudflare Turnstile valide (vérifié par `requireTurnstileToken`, ignoré si `TURNSTILE_SECRET_KEY` n'est pas défini)

### `GET /api/health`

Vérification de disponibilité. Aucun middleware de sécurité.

**Réponse 200 :**
```json
{ "success": true, "status": "OK", "message": "Serveur backend opérationnel" }
```

---

### `GET /api/vref?plaque=AA-123-BC`

Recherche d'un véhicule par plaque d'immatriculation.

**Headers requis :** `Origin`, `X-Turnstile-Token`

**Paramètres :**

| Paramètre | Type | Description |
|---|---|---|
| `plaque` | string (query) | Plaque au format `AA-123-BC` ou `AA123BC` |

**Réponse 200 :**
```json
{
  "success": true,
  "data": {
    "immat": "AA123BC",
    "marque": "RENAULT",
    "modele": "MEGANE III",
    "version": "1.9 DCI 130 XV DE FRANCE",
    "date1erCir_fr": "18-04-2009",
    "energie": "2",
    "energieNGC": "DIESEL",
    "puisFisc": "7",
    "boite_vitesse": "M",
    "vin": "VF1DZ0N...",
    "liste_sra_commercial": [
      { "sra_id": "RE80126", "sra_commercial": "1.9 DCI 130 XV DE FRANCE" },
      { "sra_id": "RE80127", "sra_commercial": "1.9 DCI 130 GT" }
    ],
    "nbr_req_restants": 87,
    "energieLibelle": "DIESEL",
    "genreLibelle": "VP (Véhicule Particulier)",
    "boiteVitesseLibelle": "Manuelle"
    // ... (voir types/index.ts → VehicleData pour tous les champs)
  }
}
```

**Réponse 404 — véhicule non trouvé :**
```json
{ "success": false, "error": "Aucune donnée trouvée pour cette plaque" }
```

**Réponse 403 — sécurité :**
```json
{ "success": false, "error": "Accès non autorisé." }
// ou
{ "success": false, "error": "Vérification manquante." }
// ou
{ "success": false, "error": "Vérification échouée." }
```

---

### `POST /api/send-email-recap`

Envoie l'email de récapitulatif à l'équipe Sabba Assurances.

**Headers requis :** `Origin`, `X-Turnstile-Token`, `Content-Type: application/json`

**Body :**
```json
{
  "formData": {
    "prenom": "Jean",
    "nomFamille": "Dupont",
    "adresse": "12 rue de la Paix",
    "ville": "Paris",
    "codePostal": "75001",
    "dateNaissance": "1985-03-15",
    "moisAnneePermis": "2003-06",
    "profession": "Cadre",
    "email": "jean.dupont@example.com",
    "telephone": "0612345678",
    "immatriculation": "AA-123-BC",
    "marqueVehicule": "RENAULT",
    "typeVersion": "MEGANE III",
    "dateMiseCirculation": "2009-04-18",
    "valeurVehicule": 8000,
    "energie": "DIESEL",
    "nombreCVFiscaux": "7",
    "bonusMalus": "0.90",
    "sinistres36Mois": false,
    "sinistres36MoisDetails": "",
    "utilisationVehicule": "Trajets domicile-travail",
    "modeFinancement": "Comptant",
    "lieuStationnement": "Garage",
    "choixGaranties": "Tous risques",
    "demandesParticulieres": "",
    "commentConnaissance": "Recommandation"
    // ... (voir types/index.ts → FormData pour tous les champs)
  },
  "vehicleData": { /* objet VehicleData retourné par /api/immatriculation, optionnel */ }
}
```

**Réponse 200 :**
```json
{ "success": true, "message": "Email envoyé avec succès", "messageId": "..." }
```

**Réponse 400 :**
```json
{ "success": false, "error": "Données manquantes" }
```

---

## APIs externes

### apiplaqueimmatriculation.com

- **Documentation** : [apiplaqueimmatriculation.com](https://www.apiplaqueimmatriculation.com)
- **Utilisation** : Appel `GET /plaque?immatriculation={plaque}&token={API_KEY}&pays=FR`
- **Tarification** : Pack de requêtes prépayées (crédits consommés à chaque appel réel)
- **Important** : En mode développement (`NODE_ENV != production`), aucun appel réel n'est effectué — des données fictives d'une Renault Mégane sont retournées.

### Brevo (ex-Sendinblue)

- **SDK** : `sib-api-v3-sdk` (API v3)
- **Usage** : Emails transactionnels (`TransactionalEmailsApi.sendTransacEmail`)
- **Configuration** : L'adresse `EMAIL_SENDER` doit être vérifiée (domaine ou email) dans le dashboard Brevo.
- **Destinataires multiples** : `EMAILS_RECIPIENT` accepte plusieurs adresses séparées par des virgules.
- **En mode développement** : l'email n'est pas envoyé, son contenu HTML est simplement loggué dans la console.

### Cloudflare Turnstile

- **Documentation** : [developers.cloudflare.com/turnstile](https://developers.cloudflare.com/turnstile/)
- **Package React** : `@marsidev/react-turnstile` (recommandé officiellement par Cloudflare)
- **Mode** : Managed + `appearance: "interaction-only"` — le widget est invisible pour les utilisateurs légitimes, visible uniquement si une interaction manuelle est requise.
- **Fonctionnement** :
  1. Le frontend obtient un token à usage unique auprès de Cloudflare
  2. Ce token est envoyé dans le header `X-Turnstile-Token` de chaque requête protégée
  3. Le backend vérifie le token via `https://challenges.cloudflare.com/turnstile/v0/siteverify`
  4. Le token expire après 300 secondes — le widget le renouvelle automatiquement
- **Deux widgets indépendants** : un sur la recherche de plaque (`VehicleSearch`), un sur l'envoi de l'email (`SummaryStep`)
- **En développement** : utiliser les [clés de test Cloudflare](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) — elles valident toujours sans interaction utilisateur réelle

---

## Sécurité

Deux couches de protection sur tous les endpoints `/api/immatriculation` et `/api/send-email-recap` :

### 1. Vérification Origin (`requireFrontendOrigin`)

Toute requête dont le header `Origin` ne correspond pas exactement à `FRONTEND_URL` est rejetée avec un 403. Les navigateurs envoient toujours ce header pour les requêtes cross-origin. Les bots et `curl` sans header `Origin` sont bloqués à cette étape.

### 2. Cloudflare Turnstile (`requireTurnstileToken`)

Token cryptographique à usage unique, valide 300 secondes, généré par Cloudflare après analyse comportementale de l'utilisateur. Un bot ne peut pas générer de token valide sans passer le challenge Cloudflare. Le backend vérifie chaque token contre l'API Cloudflare — il est impossible de réutiliser un token ou d'en fabriquer un faux.

### 3. Échappement HTML dans les emails

Toutes les données saisies par l'utilisateur sont passées par la fonction `esc()` avant insertion dans le template HTML de l'email, empêchant toute injection HTML/CSS.

---

## Mode développement

Quand `NODE_ENV` est différent de `production` :

- **Immatriculation** : aucun appel à l'API payante. Retourne systématiquement les données d'une Renault Mégane III fictive, quelle que soit la plaque saisie.
- **Email** : aucun envoi réel. Le contenu HTML complet de l'email est affiché dans les logs de la console backend sous `--- MAIL DEV MODE ---`.
- **Turnstile** : utiliser les [clés de test Cloudflare](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) dans les `.env` locaux (`1x00000000000000000000AA` côté frontend, `1x0000000000000000000000000000000AA` côté backend). Ces clés valident toujours automatiquement.

---

## Déploiement sur Vercel

### Variables d'environnement à configurer dans le dashboard Vercel

**Backend (projet `sabba-assurances-backend`) :**

| Variable | Valeur production |
|---|---|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://sabba-assurances-front.vercel.app` |
| `API_KEY_IMMATRICULATION` | Votre clé API |
| `BREVO_API_KEY` | Votre clé Brevo |
| `EMAIL_SENDER` | Votre adresse expéditeur vérifiée |
| `EMAILS_RECIPIENT` | Email(s) destinataire(s) |
| `TURNSTILE_SECRET_KEY` | Clé secrète Turnstile |

**Frontend (projet `sabba-assurances-front`) :**

| Variable | Valeur production |
|---|---|
| `REACT_APP_API_URL` | `https://sabba-assurances-backend.vercel.app/api` |
| `REACT_APP_TURNSTILE_SITE_KEY` | Clé publique Turnstile |

### Commandes de déploiement

```bash
# Backend
cd backend && vercel --prod

# Frontend
cd frontend && vercel --prod
```

### Point d'entrée Vercel

`backend/vercel.json` redirige **tout le trafic** vers `api/index.js` :

```json
{
  "version": 2,
  "functions": { "api/index.js": { "maxDuration": 30 } },
  "routes": [{ "src": "/(.*)", "dest": "/api/index.js" }]
}
```

Toute modification de logique serveur (routes, middlewares, sécurité) doit être faite dans `api/index.js`. Le fichier `server.js` n'est utilisé qu'en développement local.

---

**Développé pour Sabba Assurances par Rayan Kheloufi**
