# Backend - API Devis Auto Prestige

> La référence à jour pour les variables d'environnement et l'API est le [README principal](../README.md). En cas de divergence, le README principal fait foi.

## Description

Backend Express.js pour l'application de devis auto prestige de Sabba Assurances.

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
API_KEY_IMMATRICULATION=TokenDemo2025A
BREVO_API_KEY=your_brevo_api_key_here
NODE_ENV=development
EMAIL_SENDER=sender@mail.fr
EMAILS_RECIPIENT=recipient1@mail.fr,recipient2@mail.fr,recipient3@mail.fr
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

## Variables d'environnement

- `PORT` : Port du serveur (défaut: 3001)
- `FRONTEND_URL` : URL du frontend pour CORS
- `API_KEY_IMMATRICULATION` : Clé API pour l'API d'immatriculation
- `BREVO_API_KEY` : Clé API Brevo pour l'envoi d'emails
- `EMAIL_SENDER` : Adresse email de l'expéditeur des emails
- `EMAILS_RECIPIENT` : Liste des adresses email destinataires, séparées par des virgules
  - Exemple : `email1@domain.fr,email2@domain.fr,email3@domain.fr`
  - Les espaces autour des emails sont automatiquement supprimés
  - Les emails invalides sont ignorés avec un avertissement dans les logs
- `TURNSTILE_SECRET_KEY` : Clé secrète Cloudflare Turnstile. Obligatoire, le serveur refuse de démarrer sans elle.
- `NODE_ENV` : Mode d'exécution
  - Si `NODE_ENV=production` : Mode production (emails réellement envoyés ; API réelle d'immatriculation)
  - Toute autre valeur, ou non défini : Mode développement (emails non envoyés, juste loggés ; API d'immatriculation mockée)

## Démarrage

### Mode développement

```bash
npm run dev
```

### Mode production

```bash
npm start
```

## API Endpoints

### GET /api/vref

Récupère les informations d'un véhicule par sa plaque d'immatriculation.

**Paramètres :**

- `plaque` (string, requis) : Plaque d'immatriculation du véhicule

**Exemple :**

```
GET /api/vref?plaque=AA123BC
```

**Mode développement :**
Si `NODE_ENV` est différent de `production`, retourne toujours les données mockées d'une Renault Megane III, peu importe la plaque fournie.

### POST /api/send-email-recap

Envoie un email de récapitulatif avec les données du formulaire.

**Body :**

```json
{
  "formData": {
    // Données du formulaire
  },
  "vehicleData": {
    // Données du véhicule (optionnel)
  }
}
```

## Structure du projet

```
backend/
├── controllers/          # Contrôleurs
│   ├── immatriculationController.js
│   └── emailController.js
├── routes/              # Routes
│   ├── immatriculation.js
│   └── email.js
├── services/            # Services métier
│   ├── immatriculationService.js
│   └── emailService.js
├── api/index.js         # Point d'entrée Vercel (production)
├── server.js            # Point d'entrée local
├── package.json
└── README.md
```

## Technologies utilisées

- **Express.js** : Framework web
- **Axios** : Client HTTP pour les appels API externes
- **CORS** : Gestion des requêtes cross-origin
- **Dotenv** : Gestion des variables d'environnement
- **Nodemon** : Redémarrage automatique en développement

## Mode développement

En mode développement (`NODE_ENV` différent de `production`), l'API d'immatriculation retourne des données mockées pour une Renault Megane III. Cela permet de :

- Tester l'application sans consommer d'appels API réels
- Développer sans dépendre de l'API externe
- Avoir des données cohérentes pour les tests

Les données mockées incluent toutes les informations nécessaires pour le formulaire d'assurance.

## Export des soumissions vers Google Sheets

La route de récapitulatif conserve sa réponse HTTP et son envoi Brevo. Si
`GOOGLE_SHEETS_ENABLED=true`, elle ajoute une ligne après la tentative d'envoi.
La dernière colonne contient le statut de cet envoi.

Configurer uniquement le backend de production dans Vercel.

| Variable | Valeur attendue |
| --- | --- |
| `GOOGLE_SHEETS_ENABLED` | `true` pour activer, `false` pour désactiver |
| `GOOGLE_SHEETS_ID` | Identifiant du classeur privé |
| `GOOGLE_SHEETS_TAB` | Onglet cible, `Réponses` par défaut |
| `GOOGLE_WIF_AUDIENCE` | Ressource du fournisseur fédéré, commençant par `//iam.googleapis.com/projects/` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Compte de service Google autorisé sur le classeur |

Le fournisseur Google valide l'émetteur et l'audience Vercel ainsi que le
sujet exact du backend de production. Ce sujet reçoit le rôle
`roles/iam.workloadIdentityUser` sur le seul compte de service. Le compte de
service reçoit le rôle Éditeur sur le classeur cible. L'authentification utilise
des jetons OIDC temporaires. Elle ne requiert aucune clé privée à renouveler.

Pour changer de classeur ou d'onglet, reproduire les en-têtes, attribuer l'accès
Éditeur au compte de service, mettre à jour les variables Vercel et redéployer.
La liste `FIELDS` de `services/googleSheetsService.js` définit l'ordre des
champs et doit évoluer avec les en-têtes et la borne `AJ`. Les deux premières
colonnes contiennent l'horodatage de Paris et l'identifiant de la soumission.
Les réponses sont écrites en mode RAW.

Le service retente une fois après un refus explicite pour quota. Après un
délai d'attente sur l'ajout, l'état de l'écriture est inconnu. Consulter les
logs Vercel pour le code d'erreur et rechercher l'identifiant dans la feuille
avant toute reprise manuelle. Il n'y a pas de file persistante. Un second
envoi du formulaire reçoit un nouvel identifiant.

Pour tester hors production, simuler les trois appels HTTP Google et utiliser
des données fictives. Pour désactiver l'export, passer
`GOOGLE_SHEETS_ENABLED` à `false` et redéployer le backend.
