# Decorée – MVP Web App

Decorée est une application web monopage (SPA) pensée pour accompagner les voyageurs francophones (18-25 ans) lors de leurs séjours en Corée du Sud. Ce MVP couvre les fonctionnalités essentielles décrites dans le PRD : Trend Decoder hebdomadaire, calendrier d’événements K-Culture, phrasebook personnalisé et hub de support local (services publics, apps, communauté).

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
- `src/components/*` – Composants UI (Trend Decoder, calendrier, phrasebook, Pop-up Radar, etc.).
- `src/pages/*` – Pages basées sur les sections du PRD.
- `src/shared/i18n.tsx` – Contexte de localisation (FR/KR) et gestion du switcher.
- `src/services/*` – Services simulant l’accès Firestore pour l’environnement MVP.
- `src/data/*` – Contenu mocké pour Trend Decoder, événements et phrasebook.

## Fonctionnalités MVP

- **Weekly Trend Decoder** : cartes de tendances éditoriales (FR, KO, JA) avec navigation par intensité et auteurs.
- **K-Culture Event Calendar** : filtrage par type d’événement (concert, festival, pop-up, etc.).
- **Personalized Korean Phrasebook** : sélection multi-catégories, suivi de progression simulé et recherche plein texte.
- **Pop-up Radar** : cartes compactes, recherche et fiches détaillées pour suivre les collaborations et pop-ups par quartier.
- **Local Support Hub** : onglet “Support local” dédié (guides services publics, tutoriels d’apps coréennes, communauté étudiants/expats).
- **Blog détaillé** : chaque tendance/événement dispose d’une page immersive (photo, contenu riche) avec astuces pratiques.
- **Multilingue FR/KR** : bascule instantanée de la navigation, des CTA et contenus textes.
- **Responsive** : layout Tailwind responsive (mobile-first), navigation sticky, cartes adaptatives.
- **Decorée Studio (Admin)** : formulaire `/admin` pour ajouter des tendances, événements et expressions sans toucher au code. Les entrées sont stockées dans le navigateur (localStorage) puis fusionnées avec les données mockées.
- **Sécurisation par login** : `/admin` est protégé par Firebase Authentication (email/mot de passe ou Google). Tout utilisateur peut créer un compte, mais seules les adresses listées dans `VITE_DECOREE_ADMIN_EMAILS` voient et accèdent au Studio.

## Intégrations futures

- **Monétisation publicitaire** : préparer les emplacements natifs (Trend Decoder, Pop-up Radar, hub local) et connecter un réseau/serveur pub lorsque les audiences seront suffisantes.
- **Firebase Firestore** : connecter `contentService.ts` à Firestore pour gérer les contenus temps réel.
- **Maps & APIs** : géolocalisation d’événements (Kakao/Google) et suggestions dynamiques.
- **Auth & personnalisation** : relier les préférences utilisateurs (langue, favoris) aux profils et stocker la progression phrasebook.
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

## Mode contenu statique

Pour développer hors ligne ou sans projet Firebase, définissez `VITE_USE_STATIC_CONTENT=true` dans votre `.env`. Les repositories sauteront alors les requêtes Firestore et utiliseront instantanément les données mockées (ajout/mise à jour/suppression resteront indisponibles tant que Firebase n’est pas configuré).

## Traduction automatique du Pop-up Radar

- Les fiches du Pop-up Radar peuvent être rédigées en coréen puis automatiquement exposées en français, anglais ou japonais.
- Activez `VITE_POPUP_AUTO_TRANSLATE=true` pour autoriser cette traduction côté client (Google Translate non authentifié est utilisé en fallback). Si l’appel échoue, le texte coréen reste affiché.
- Seule la collection “Pop-ups” est concernée ; les tendances, événements et phrasebook continuent d’utiliser leurs langues respectives.

## Notes UX/UI

- Palette inspirée du dancheong traditionnel (bleu, vert, rouge).
- Boutons arrondis pour rappeler les badges événementiels et univers K-Pop.
- Mise en avant du Trend Decoder sur la homepage pour favoriser l’engagement éditorial.

## Suivi qualité

- **Performance** : Vite + Tailwind pour un bundle léger.
- **Accessibilité** : composants respectant la sémantique de base (titres, paragraphes, boutons).
- **Internationalisation** : structure prête pour l’ajout de nouvelles langues (en, ja, zh).

Bonne exploration ! 🎌✈️🇫🇷🇰🇷
