# CRM Simplifié

Application web CRM simplifiée pour gérer les clients, les opportunités commerciales et l'historique des contacts.

## Technologies utilisées

- **React 18** avec **TypeScript**
- **Vite** pour le build et le développement
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **localStorage** pour la persistance des données (remplaçable par une API)

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Build

```bash
npm run build
```

## Fonctionnalités

### Gestion des clients
- Ajouter, modifier, supprimer des clients
- Rechercher par nom, email ou téléphone
- Filtrer par statut (Actif/Inactif)

### Gestion des opportunités
- Créer des opportunités liées à un client
- Modifier et supprimer des opportunités
- Filtrer par statut (Nouveau, En cours, Gagné, Perdu)

### Historique de contact
- Ajouter des contacts (Appel, Email, Réunion)
- Consulter l'historique par client

### Dashboard
- Statistiques globales
- Vue d'ensemble des opportunités
- Clients récents

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── services/      # Services de gestion des données
├── types/         # Types TypeScript
├── hooks/         # Hooks personnalisés
└── layouts/       # Layouts (Dashboard)
```
