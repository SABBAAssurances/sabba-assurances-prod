# Backend - API Devis Auto Prestige

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
- `NODE_ENV` : Mode d'exécution
  - Si `NODE_ENV=development` : Mode développement (emails non envoyés, juste loggés ; API d'immatriculation mockée)
  - Si `NODE_ENV=production` ou non défini : Mode production (emails réellement envoyés ; API réelle d'immatriculation)

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

### GET /api/immatriculation

Récupère les informations d'un véhicule par sa plaque d'immatriculation.

**Paramètres :**

- `plaque` (string, requis) : Plaque d'immatriculation du véhicule

**Exemple :**

```
GET /api/immatriculation?plaque=AA123BC
```

**Mode développement :**
Si `DEV=true`, retourne toujours les données mockées d'une Renault Megane III, peu importe la plaque fournie.

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
├── server.js            # Point d'entrée
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

En mode développement (`DEV=true`), l'API d'immatriculation retourne des données mockées pour une Renault Megane III. Cela permet de :

- Tester l'application sans consommer d'appels API réels
- Développer sans dépendre de l'API externe
- Avoir des données cohérentes pour les tests

Les données mockées incluent toutes les informations nécessaires pour le formulaire d'assurance.
