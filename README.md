# Simulateur de trafic

Application web de simulation de trafic routier en temps réel, développée avec React et le canvas HTML5.
Configurez le réseau, les paramètres de circulation et observez les véhicules, les feux et les embouteillages en direct.

**Démo en ligne :** [ViviJamais203.github.io/simulateur-de-trafic](https://ViviJamais203.github.io/simulateur-de-trafic)

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm (inclus avec Node.js)
- Git

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ViviJamais203/simulateur-de-trafic.git
cd simulateur-de-trafic
```

### 2. Installer les dépendances

```bash
npm install
```

---

## Lancer le projet

### Mode développement

Lance un serveur local avec rechargement automatique :

```bash
npm run dev
```

L'application est ensuite accessible à l'adresse indiquée dans le terminal (généralement `http://localhost:5173`).

### Aperçu de la version de production

Compile puis lance un serveur de prévisualisation de la version optimisée :

```bash
npm run build
npm run preview
```

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile le projet pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Analyse le code avec ESLint |
| `npm test` | Lance les tests en mode watch |
| `npm run test:run` | Lance les tests une seule fois |
| `npm run test:ui` | Lance les tests avec l'interface graphique Vitest |
| `npm run test:coverage` | Génère le rapport de couverture de tests |
| `npm run deploy` | Déploie sur GitHub Pages |

---

## Structure du projet

```
simulateur-de-trafic/
│
├── assets/                  # Images statiques (captures d'écran des réseaux)
│
├── coverage/                # Rapport de couverture de tests (généré par npm run test:coverage)
│
├── src/
│   ├── simulation/          # Moteur de simulation (logique métier pure, sans React)
│   │   ├── Simulation.js    # Boucle principale : spawn, déplacement, congestion, statistiques
│   │   ├── Vehicle.js       # Entité véhicule : déplacement, freinage, traversée d'intersection
│   │   ├── Road.js          # Tronçon routier bidirectionnel avec gestion de capacité
│   │   ├── Intersection.js  # Intersection avec cycle de feux de circulation
│   │   ├── TrafficLight.js  # Feu de circulation (vert / rouge)
│   │   ├── renderer.js      # Rendu canvas 2D (routes, véhicules, feux, congestions)
│   │   └── tests/           # Tests unitaires Vitest pour chaque classe du moteur
│   │
│   ├── networks/            # Définitions des réseaux routiers disponibles
│   │   ├── petiteVille.js   # Carrefour à 4 branches (N, S, E, O)
│   │   └── carrefourMort.js # Carrefour hexagonal à 6 branches
│   │
│   ├── components/          # Composants React réutilisables
│   │   ├── SimulationCanvas.jsx   # Canvas animé + boucle requestAnimationFrame
│   │   ├── SimulationControls.jsx # Boutons pause, vitesse (x0.5 à x4), reset
│   │   ├── StatisticsPanel.jsx    # Panneau de statistiques en temps réel
│   │   └── ParametersForm.jsx     # Formulaire de configuration des paramètres
│   │
│   ├── pages/               # Pages de l'application (routing React Router)
│   │   ├── HomePage.jsx        # Page d'accueil
│   │   ├── ParametersPage.jsx  # Configuration des paramètres de simulation
│   │   ├── SimulationPage.jsx  # Exécution et visualisation de la simulation
│   │   └── NotFoundPage.jsx    # Page 404
│   │
│   ├── App.jsx              # Composant racine avec la définition des routes
│   ├── main.jsx             # Point d'entrée React (montage dans #root)
│   ├── style.css            # Styles des composants et variables CSS globales
│   └── index.css            # Styles de mise en page et thème général
│
├── .github/workflows/       # Pipeline CI/CD GitHub Actions (déploiement automatique sur main)
├── index.html               # Point d'entrée HTML (monté par Vite)
├── vite.config.js           # Configuration Vite
├── vitest.config.js         # Configuration Vitest
└── eslint.config.js         # Configuration ESLint
```

---

## Déploiement

Le déploiement sur GitHub Pages est automatique à chaque push sur la branche `main` via GitHub Actions.

Pour déployer manuellement :

```bash
npm run deploy
```
