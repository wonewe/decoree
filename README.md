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
- **Personalized Korean Phrasebook** : sélection multi-catégories, suivi de progression simulé et recherche plein texte.
- **Blog détaillé** : chaque tendance/événement dispose d’une page immersive (photo, contenu riche) avec verrouillage Premium sur les articles réservés.
- **Premium Content Subscription** : formulaire d’email relié à Stripe Checkout (via endpoint sécurisé) pour déclencher la souscription.
- **Multilingue FR/KR** : bascule instantanée de la navigation, des CTA et contenus textes.
- **Responsive** : layout Tailwind responsive (mobile-first), navigation sticky, cartes adaptatives.
- **Decorée Studio (Admin)** : formulaire `/admin` pour ajouter des tendances, événements et expressions sans toucher au code. Les entrées sont stockées dans le navigateur (localStorage) puis fusionnées avec les données mockées.
- **Sécurisation par login** : `/admin` est protégé par Firebase Authentication (email/mot de passe ou Google). Tout utilisateur peut créer un compte, mais seules les adresses listées dans `VITE_DECOREE_ADMIN_EMAILS` voient et accèdent au Studio.

## Intégrations futures

- **Stripe** : brancher les webhooks (`checkout.session.completed`) pour activer/désactiver automatiquement les droits Premium côté Firestore/Custom Claims.
- **Firebase Firestore** : connecter `contentService.ts` à Firestore pour gérer les contenus temps réel.
- **Maps & APIs** : géolocalisation d’événements (Kakao/Google) et suggestions dynamiques.
- **Auth & personnalisation** : connecter l’abonnement aux profils utilisateurs, stocker la progression phrasebook.
- **Tests** : ajouter des tests unitaires (Vitest) et des tests E2E (Playwright) dès la prochaine itération.
- **CMS connecté** : remplacer le stockage local du Studio par un backend (Firestore, Contentful, Strapi…) pour que l’équipe puisse collaborer en temps réel.
- **Rôles avancés** : déléguer la gestion d’accès à Firebase Custom Claims ou à un CMS pour restreindre les permissions par profil.

## Configuration de l’authentification

1. Dupliquez `.env.example` en `.env` puis complétez les variables `VITE_FIREBASE_*` avec la configuration de votre projet Firebase.
2. Dans la console Firebase :
   - Activez **Authentication → Email/Password**.
   - Activez également **Authentication → Google** si vous souhaitez permettre la connexion par Google.
   - Créez les comptes administrateurs qui doivent accéder au studio ou laissez-les utiliser la page `/signup`.
3. Listez les emails autorisés dans `VITE_DECOREE_ADMIN_EMAILS` (séparés par des virgules). Ces comptes seront reconnus comme administrateurs et verront le lien “Studio Décorée”.
4. Relancez `npm run dev` pour que Vite recharge la configuration. Rendez-vous sur `/login` ou `/signup` pour tester la connexion ; une fois authentifié, vous serez redirigé vers `/admin`.

## Stripe Checkout

1. Créez une clé **Publishable** Stripe et renseignez `VITE_STRIPE_PUBLISHABLE_KEY`. Définissez également `VITE_STRIPE_CHECKOUT_ENDPOINT` (par défaut `/api/create-checkout-session`) et `VITE_STRIPE_PRICE_ID`. Activez le flux en production avec `VITE_STRIPE_ENABLED=true`.
2. Implémentez un endpoint sécurisé (Firebase Functions, Vercel serverless, etc.) qui reçoit `{ email, planId }`, utilise la clé secrète Stripe (`sk_...`) et renvoie `{ sessionId, url }`. Un exemple Firebase est disponible dans `stripe/functions/createCheckoutSession.ts`.
3. Déployez cette fonction et configurez les URLs `success_url` et `cancel_url`. Ajoutez votre domaine Vercel dans **Authentication → Sign-in method → Authorised domains**.
4. Sur Vercel, ajoutez les variables d’environnement (`VITE_STRIPE_*` côté front + clé secrète côté fonction) puis redeployez.
5. Mettez en place un webhook Stripe `checkout.session.completed` pour marquer l’utilisateur premium (Custom Claims, Firestore…). Le front ne doit pas accorder l’accès Premium sans cette vérification serveur.

## Notes UX/UI

- Palette inspirée du dancheong traditionnel (bleu, vert, rouge).
- Boutons arrondis pour rappeler les badges événementiels et univers K-Pop.
- Mise en avant du Trend Decoder sur la homepage pour pousser la conversion premium.

## Suivi qualité

- **Performance** : Vite + Tailwind pour un bundle léger.
- **Accessibilité** : composants respectant la sémantique de base (titres, paragraphes, boutons).
- **Internationalisation** : structure prête pour l’ajout de nouvelles langues (en, ja, zh).

Bonne exploration ! 🎌✈️🇫🇷🇰🇷
