# Decorée – MVP Web App

Decorée est une application web monopage (SPA) pensée pour accompagner les voyageurs francophones (18-25 ans) lors de leurs séjours en Corée du Sud. Ce MVP couvre les fonctionnalités essentielles décrites dans le PRD : Trend Decoder hebdomadaire, calendrier d’événements K-Culture, phrasebook personnalisé et amorce d’abonnement premium.

## Démarrer le projet

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Construire la version de production
npm run build
```

> 📌 TailwindCSS, Vite et React sont déjà configurés. Le projet utilise TypeScript et React Router.

## Structure principale

- `src/App.tsx` – Configuration du routing SPA avec React Router.
- `src/components/*` – Composants UI (Trend Decoder, calendrier, phrasebook, CTA abonnement, etc.).
- `src/pages/*` – Pages basées sur les sections du PRD.
- `src/shared/i18n.tsx` – Contexte de localisation (FR/KR) et gestion du switcher.
- `src/services/*` – Services simulant l’accès Firestore et Stripe pour l’environnement MVP.
- `src/data/*` – Contenu mocké pour Trend Decoder, événements et phrasebook.

## Fonctionnalités MVP

- **Weekly Trend Decoder** : cartes de tendances filtrées (premium & gratuites) avec aperçu pour tester l’UX d’un paywall.
- **K-Culture Event Calendar** : filtrage par type d’événement (concert, festival, pop-up, etc.).
- **Personalized Korean Phrasebook** : sélection multi-catégories, suivi de progression simulé.
- **Premium Content Subscription** : formulaire d’email + simulation d’appel Stripe pour préparer l’intégration réelle.
- **Multilingue FR/KR** : bascule instantanée de la navigation, des CTA et contenus textes.
- **Responsive** : layout Tailwind responsive (mobile-first), navigation sticky, cartes adaptatives.

## Intégrations futures

- **Stripe** : remplacer `createMockCheckoutSession` par un appel réel vers une Cloud Function ou un backend.
- **Firebase Firestore** : connecter `contentService.ts` à Firestore pour gérer les contenus temps réel.
- **Maps & APIs** : géolocalisation d’événements (Kakao/Google) et suggestions dynamiques.
- **Auth & personnalisation** : connecter l’abonnement aux profils utilisateurs, stocker la progression phrasebook.
- **Tests** : ajouter des tests unitaires (Vitest) et des tests E2E (Playwright) dès la prochaine itération.

## Notes UX/UI

- Palette inspirée du dancheong traditionnel (bleu, vert, rouge).
- Boutons arrondis pour rappeler les badges événementiels et univers K-Pop.
- Mise en avant du Trend Decoder sur la homepage pour pousser la conversion premium.

## Suivi qualité

- **Performance** : Vite + Tailwind pour un bundle léger.
- **Accessibilité** : composants respectant la sémantique de base (titres, paragraphes, boutons).
- **Internationalisation** : structure prête pour l’ajout de nouvelles langues (en, ja, zh).

Bonne exploration ! 🎌✈️🇫🇷🇰🇷
