# Projet final — Clone de Vinted

## 1. Présentation du projet

Vous allez construire le **frontend d'un clone de Vinted** : une marketplace de vêtements et accessoires d'occasion.

L'API backend est **fournie et fonctionne en local** sur votre machine. Votre travail consiste à créer l'interface React qui consomme cette API : catalogue avec recherche et filtres, détail des articles, création d'annonces, gestion de vos annonces, et favoris.

Le projet est fourni sous forme d'un **scaffold** (repo GitHub) contenant :

- La stack technique configurée (Vite, TypeScript, Tailwind CSS, TanStack Query)
- Le routing configuré avec des **pages placeholder** à compléter
- Un service API prêt à l'emploi (authentification automatique)
- Les types TypeScript et constantes de référence
- Le serveur Express avec des données pré-chargées (~35 articles)

**Votre travail** : remplacer les pages placeholder par votre implémentation, créer les composants nécessaires, et faire fonctionner l'application de bout en bout.

---

## 2. Modalités

| Aspect | Détail |
| --- | --- |
| Équipes | Groupes de 3 étudiants |
| Travail | Hors cours, sur temps personnel (~5 semaines) |
| Rendu | Repository GitHub fonctionnel |
| Soutenance | ~15 min par groupe — **6 mai 2026** |
| Ressources | Libres (IA incluse), mais **tout le code doit pouvoir être expliqué en soutenance** |
| Git | Contributions des 3 membres visibles dans l'historique, commits réguliers |

---

## 3. Démarrage

### Créer votre repo

1. **Un membre** du groupe fork le repo scaffold sur GitHub :
   - Aller sur le repo scaffold : https://github.com/stephane-ruhlmann/esgi-vinted-clone-scaffold
   - Cliquer sur **Fork** (en haut à droite)
   - Décocher "Copy the `main` branch only" si la case apparaît
   - Cliquer sur **Create fork**
2. Dans les **Settings** du fork : renommer le repo si souhaité (ex : `vinted-clone-groupe-X`)
3. Toujours dans **Settings > Collaborators** : ajouter les 2 autres membres du groupe comme collaborateurs
4. Chaque membre clone le fork :

```bash
git clone <url-de-votre-fork>
cd vinted-clone
pnpm install          # Installe aussi les dépendances du serveur (postinstall)
```

> **Attention** : ne créez pas un nouveau repo vide. Partez du **fork** pour conserver le scaffold et l'historique.

### Configuration

Copiez le fichier `.env.example` en `.env` et personnalisez votre nom :

```bash
cp .env.example .env
```

```env
VITE_USER_NAME=Prénom Nom
```

Ce nom sera automatiquement associé aux annonces que vous créez.

### Lancement

Ouvrez **deux terminaux** :

```bash
# Terminal 1 — Frontend (Vite)
pnpm dev

# Terminal 2 — API (Express)
pnpm api
```

- Frontend : `http://localhost:5173`
- API : `http://localhost:3000` (proxiée par Vite, vous n'avez pas besoin d'y accéder directement)

### Vérification

Ouvrez `http://localhost:5173`. Vous devez voir la navbar et la page "Catalogue" (placeholder). Ouvrez les DevTools (onglet Network), allez sur `http://localhost:5173/api/articles` : vous devez voir un tableau JSON d'articles.

---

## 4. Ce qui est fourni

### Structure du projet

```
vinted-clone/
├── src/                          # Votre espace de travail
│   ├── components/               # Vide — vos composants à créer
│   ├── pages/                    # Pages placeholder à compléter
│   │   ├── CataloguePage.tsx
│   │   ├── ArticleDetailPage.tsx
│   │   ├── PublishPage.tsx
│   │   ├── MyArticlesPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   └── EditArticlePage.tsx
│   ├── hooks/
│   │   └── useCurrentUserId.ts   # Votre identifiant utilisateur
│   ├── lib/
│   │   └── userId.ts             # Génération/lecture du userId (ne pas modifier)
│   ├── services/
│   │   └── api.ts                # Service API prêt à l'emploi
│   ├── types/
│   │   └── article.ts            # Types et constantes
│   ├── test/
│   │   └── setup.ts              # Setup Vitest (si vous choisissez les tests)
│   ├── App.tsx                   # Layout avec navbar (ne pas modifier sauf personnalisation)
│   ├── main.tsx                  # Point d'entrée, routing et providers (ne pas modifier)
│   └── index.css                 # Tailwind CSS
├── server/                       # API Express — NE PAS MODIFIER
└── ...                           # Config (vite, tsconfig, prettier, etc.)
```

### Fichiers clés à connaître

**`src/services/api.ts`** — Service pour appeler l'API. Quatre méthodes :

- `api.get<T>(path)` — requête GET
- `api.post<T>(path, body)` — requête POST
- `api.put<T>(path, body)` — requête PUT
- `api.delete<T>(path)` — requête DELETE

Le `userId` et le `userName` sont injectés **automatiquement**. Vous n'avez jamais à les passer vous-même.

```typescript
// Exemple d'utilisation
const articles = await api.get<Article[]>("/api/articles");
const created = await api.post<Article>("/api/articles", { title: "...", ... });
```

**`src/types/article.ts`** — Types et constantes de référence :

- `Article` — type complet d'un article (id, title, description, price, category, size, condition, imageUrl, userName, userId, createdAt)
- `ArticleFormData` — type pour les formulaires (sans id, userId, userName, createdAt)
- `CATEGORIES` — tableau des catégories (`{ id, label }`)
- `CONDITIONS` — tableau des états (`{ value, label }`)

**`src/hooks/useCurrentUserId.ts`** — Hook qui retourne votre userId :

```typescript
const userId = useCurrentUserId();
// Utile pour : article.userId === userId → c'est votre annonce
```

**`src/App.tsx`** — Layout avec la navbar (liens NavLink) et `<Outlet />` pour le contenu des pages. Le routing est configuré dans `main.tsx`.

**`src/pages/*.tsx`** — Chaque page contient un simple `<h1>` placeholder. Vous remplacez ce contenu par votre implémentation.

---

## 5. API — Référence

### Endpoints

#### Articles

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/articles` | Liste des articles (avec filtres, voir ci-dessous) |
| `GET` | `/api/articles/:id` | Détail d'un article |
| `POST` | `/api/articles` | Créer un article |
| `PUT` | `/api/articles/:id` | Modifier un article (vous devez en être le propriétaire) |
| `DELETE` | `/api/articles/:id` | Supprimer un article (vous devez en être le propriétaire) |
| `GET` | `/api/users/:userId/articles` | Liste des articles d'un utilisateur |

#### Favoris

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/api/favorites` | Liste de vos favoris |
| `POST` | `/api/favorites/:articleId` | Ajouter un favori |
| `DELETE` | `/api/favorites/:articleId` | Retirer un favori |

### Filtres du catalogue (`GET /api/articles`)

| Paramètre | Type | Description |
| --- | --- | --- |
| `search` | string | Recherche texte (titre + description) |
| `category` | string | Filtrer par catégorie (clé : `tops`, `bottoms`, `shoes`, `coats`, `accessories`, `sportswear`) |
| `condition` | string | Filtrer par état (clé : `neuf_avec_etiquette`, `neuf_sans_etiquette`, `tres_bon_etat`, `bon_etat`, `satisfaisant`) |
| `priceMin` | number | Prix minimum |
| `priceMax` | number | Prix maximum |
| `sort` | string | Tri : `price_asc`, `price_desc`, `date_desc` (défaut) |

Les filtres se combinent (AND). Seuls les paramètres non vides sont envoyés.

### Données d'un article (création)

| Champ | Type | Requis | Contrainte |
| --- | --- | --- | --- |
| `title` | string | oui | 3 à 100 caractères |
| `description` | string | oui | 10 à 1000 caractères |
| `price` | number | oui | > 0 |
| `category` | string | oui | Clé de catégorie valide |
| `size` | string | oui | Taille libre (XS, M, 42...) |
| `condition` | string | oui | Clé de condition valide |
| `imageUrl` | string | oui | URL d'image valide |

Le `userId` et le `userName` sont ajoutés automatiquement par `api.ts`.

### Erreurs

L'API retourne `{ "error": "message" }` avec le code HTTP correspondant. Votre service `api.ts` lève une exception avec le message — utilisez un `try/catch` ou la gestion d'erreur de TanStack Query.

| Situation | Réponse |
| --- | --- |
| Article inexistant | 404 |
| Modification/suppression d'un article qui ne vous appartient pas | 403 |
| Données invalides | 400 |

### Données au démarrage

L'API démarre avec ~35 articles pré-chargés. Ces articles appartiennent à d'autres utilisateurs : votre page "Mes annonces" sera **vide au début**, c'est normal. Créez des annonces pour la remplir.

Les données sont **en mémoire** : elles sont réinitialisées à chaque redémarrage du serveur.

---

## 6. Fonctionnalités obligatoires

### 6.1 Catalogue (3 pts)

**Objectif** : afficher les articles, permettre de chercher, filtrer et trier.

**Attendus** :

- Afficher les articles dans une **grille de cartes** (image, titre, prix, catégorie, état, vendeur)
- Chaque carte est un **lien cliquable** vers la page de détail
- **Barre de recherche** : filtre les articles par texte (titre + description)
- **Filtre par catégorie** : menu déroulant avec les catégories + option "Toutes"
- **Filtre par état** : menu déroulant avec les conditions + option "Tous"
- **Filtre par prix** : champs min et max
- **Tri** : menu déroulant avec "Plus récent", "Prix croissant", "Prix décroissant"
- Les filtres se combinent et mettent à jour la liste en temps réel
- Afficher un **message** quand aucun article ne correspond aux filtres
- Gérer les états **chargement** et **erreur**

**Critères de validation** :

- [x] La grille affiche les articles avec image, titre, prix formaté (ex : "12,50 €"), catégorie, état
- [x] La recherche filtre les articles en temps réel
- [x] Chaque filtre fonctionne individuellement
- [x] Les filtres se combinent correctement
- [x] Le tri change l'ordre d'affichage
- [x] Un état vide est affiché quand aucun résultat ne correspond
- [x] Un spinner s'affiche pendant le chargement
- [x] Un message d'erreur s'affiche si l'API ne répond pas

### 6.2 Détail article (1 pt)

**Objectif** : afficher toutes les informations d'un article.

**Attendus** :

- Afficher : image (grande), titre, prix, description complète, catégorie, état, taille, vendeur, date de publication
- Lien de retour vers le catalogue
- Gérer les cas : chargement, erreur, article inexistant

**Critères de validation** :

- [x] Cliquer sur une carte du catalogue affiche la page de détail
- [x] Tous les champs de l'article sont affichés
- [x] La date est formatée en français (ex : "15/04/2026")
- [x] Le prix est formaté (ex : "25,00 €")
- [x] Un lien permet de revenir au catalogue
- [x] Un article inexistant affiche un message d'erreur

### 6.3 Création d'annonce (2 pts)

**Objectif** : formulaire de création d'un article avec validation.

**Attendus** :

- Formulaire avec tous les champs requis (titre, description, prix, catégorie, état, taille, URL image)
- **Validation côté client** avant envoi : tous les champs requis, contraintes respectées (longueur titre, description, prix > 0)
- **Messages d'erreur** affichés sous les champs invalides

> L'utilisation d'une librairie de formulaires comme **React Hook Form** ou **Formik** est recommandée. Les formulaires contrôlés avec `useState` sont aussi acceptés. Dans tous les cas, vous devez pouvoir expliquer votre choix en soutenance.
- Après création réussie : **redirection** vers la page de détail du nouvel article
- Gérer l'erreur API (afficher le message)

**Critères de validation** :

- [ ] Le formulaire affiche tous les champs
- [ ] Les catégories et états sont proposés en menu déroulant (issus de `CATEGORIES` et `CONDITIONS`)
- [ ] Soumettre un formulaire vide affiche les erreurs de validation
- [ ] Soumettre un formulaire valide crée l'article et redirige vers sa page de détail
- [ ] L'article apparaît dans le catalogue après création
- [ ] Une erreur API est affichée à l'utilisateur

### 6.4 Mes annonces + suppression (1,5 pts)

**Objectif** : voir ses propres annonces et pouvoir les supprimer.

**Attendus** :

- Afficher uniquement les articles de l'utilisateur courant
- Si aucune annonce : afficher un message avec un lien vers la page de publication
- **Suppression avec confirmation** : demander confirmation avant de supprimer
- Après suppression : la liste se met à jour
- Gérer les états chargement et erreur

**Critères de validation** :

- [ ] La page affiche uniquement les articles de l'utilisateur
- [ ] La page est vide au démarrage (les articles du seed n'appartiennent pas à l'utilisateur)
- [ ] Après création d'un article, il apparaît dans "Mes annonces"
- [ ] Cliquer sur "Supprimer" demande confirmation (par ex. `window.confirm`)
- [ ] Confirmer la suppression retire l'article de la liste
- [ ] L'article supprimé n'apparaît plus dans le catalogue

### 6.5 Favoris (2 pts)

**Objectif** : ajouter/retirer des favoris et voir la liste de ses favoris.

**Attendus** :

- **Bouton favori** sur les cartes articles (coeur, étoile, ou équivalent)
- Cliquer sur le bouton ajoute ou retire l'article des favoris
- L'état du bouton (actif/inactif) reflète l'état réel du favori
- **Page Favoris** : liste des articles en favoris
- Pouvoir retirer un favori depuis la page Favoris
- Si aucun favori : afficher un message
- Gérer les états chargement et erreur

**Critères de validation** :

- [x] Un bouton favori est visible sur les cartes du catalogue
- [x] Cliquer ajoute/retire le favori (l'icône change)
- [x] La page Favoris liste les articles en favoris
- [x] Retirer un favori depuis la page Favoris met à jour la liste
- [x] L'état des favoris est cohérent entre le catalogue et la page Favoris
- [x] Un état vide est affiché quand il n'y a aucun favori

---

## 7. Fonctionnalités au choix

Choisissez **au moins 2** fonctionnalités parmi les 4 suivantes. Chaque fonctionnalité supplémentaire rapporte **+1,5 pt bonus**.

### 7.1 Brouillon automatique (1,5 pts)

**Objectif** : sauvegarder automatiquement le formulaire de création dans `localStorage`, et restaurer les données si l'utilisateur quitte et revient.

**Attendus** :

- Quand l'utilisateur remplit le formulaire de création, les données sont sauvegardées **automatiquement** dans `localStorage` (pas de bouton "Sauvegarder")
- S'il quitte la page et revient, les champs sont **pré-remplis** avec les données du brouillon
- Après publication réussie, le brouillon est **supprimé**

**Critères de validation** :

- [ ] Remplir partiellement le formulaire, quitter la page, revenir : les champs sont pré-remplis
- [ ] La sauvegarde est automatique (pas de bouton)
- [ ] Après publication réussie, revenir sur le formulaire : les champs sont vides (brouillon supprimé)

### 7.2 Édition d'annonce (1,5 pts)

**Objectif** : modifier un article existant via un formulaire pré-rempli.

**Attendus** :

- La page `EditArticlePage.tsx` et la route `/articles/:id/edit` sont déjà dans le scaffold — il reste à implémenter le contenu
- Accessible depuis la page "Mes annonces" (ajouter un bouton "Modifier" sur chaque carte)
- Le formulaire est **pré-rempli** avec les valeurs actuelles de l'article
- Seul le **propriétaire** peut modifier son article (vérifier `article.userId`)
- Après modification réussie : redirection vers la page de détail
- Utiliser le **même composant de formulaire** que pour la création

**Critères de validation** :

- [ ] Cliquer sur "Modifier" ouvre le formulaire avec les valeurs actuelles
- [ ] Modifier un champ et soumettre met à jour l'article
- [ ] Après modification, la page de détail affiche les nouvelles valeurs
- [ ] Tenter de modifier l'article de quelqu'un d'autre affiche un message d'erreur
- [ ] Le composant de formulaire est partagé entre création et édition

### 7.3 Tests composants (1,5 pts)

**Objectif** : écrire au moins 3 tests pertinents avec Vitest et React Testing Library.

**Attendus** :

- Au moins **3 tests** dans des fichiers `*.test.tsx`
- Les tests doivent vérifier le **comportement** (ce que l'utilisateur voit et fait), pas l'implémentation interne
- Les tests doivent passer avec `pnpm test`

**Exemples de tests pertinents** (à adapter à vos composants) :

- Un composant de carte affiche le titre, le prix formaté, le vendeur
- Un formulaire affiche des erreurs si on soumet sans remplir les champs
- Un bouton favori appelle la bonne fonction au clic

**Critères de validation** :

- [ ] `pnpm test` exécute au moins 3 tests
- [ ] Tous les tests passent
- [ ] Les tests vérifient des comportements utilisateur, pas des détails d'implémentation

### 7.4 Design responsive (1,5 pts)

**Objectif** : l'application est utilisable sur mobile (largeur ~375px).

**Attendus** :

- La grille d'articles s'adapte (1 colonne sur mobile, 2-3 sur desktop)
- La navbar reste utilisable sur petit écran (menu burger ou adaptation du layout)
- Les formulaires sont lisibles et utilisables sur mobile
- Les pages de détail s'affichent correctement

**Critères de validation** :

- [ ] Redimensionner le navigateur à 375px de large : le contenu reste lisible et utilisable
- [ ] La navigation fonctionne sur mobile
- [ ] Les formulaires sont remplissables sur mobile
- [ ] Les images ne débordent pas de l'écran

---

## 8. Barème (20 points + bonus)

| Catégorie | Points |
| --- | --- |
| **Fonctionnel obligatoire** | **10** |
| Catalogue (liste + recherche + filtres + tri) | 3 |
| Détail article | 1 |
| Création d'annonce (formulaire + validation + redirection) | 2 |
| Mes annonces + suppression avec confirmation | 1,5 |
| Favoris (toggle + page) | 2 |
| Navigation cohérente (liens entre pages, pas de liens cassés, retour catalogue) | 0,5 |
| **Fonctionnalités au choix** (x2 minimum) | **3** |
| Chaque fonctionnalité | 1,5 |
| **Qualité technique** | **5** |
| **Questions individuelles** | **2** |
| **Total** | **20** |
| **Bonus** (fonctionnalité au choix supplémentaire) | **+1,5 par fonctionnalité** |
| **Pénalité reproductibilité** | **-3** |

**Exemple** : 2 choix = 10 + 3 + 5 + 2 = 20. Avec 3 choix = 21,5. Les 4 = 23.

---

## 9. Qualité technique (5 pts)

| Critère | Points | Ce qu'on vérifie |
| --- | --- | --- |
| TypeScript strict | 1 | Pas de `any`, aucune erreur TypeScript (`npx tsc --noEmit` passe) |
| Architecture propre | 2 | Composants bien découpés, appels API structurés (TanStack Query ou custom hooks), pas de logique dupliquée |
| Gestion loading/error | 1 | Chaque page gérant des données affiche un état de chargement et un message en cas d'erreur |
| Code lisible | 1 | Nommage clair, code formaté (`pnpm format`), pas d'erreur lint (`pnpm lint`) |

### Commandes utiles

```bash
npx tsc --noEmit   # Vérification TypeScript (0 erreur attendue)
pnpm lint           # Vérification oxlint (0 erreur attendue)
pnpm format         # Formatage automatique avec Prettier
```

---

## 10. Rendu

### Comment rendre

1. **Vérifiez** que votre branche `main` contient la version finale de votre projet
2. **Envoyez l'URL** de votre repo GitHub (le fork) via MyGES avant la deadline
3. Le repo doit être **public** ou accessible par l'enseignant (ajouté en collaborateur)
4. On clonera votre repo le jour de la soutenance — ce qui est sur `main` à ce moment-là fait foi

> Pas de ZIP, pas de clé USB, pas de lien Google Drive. **Uniquement le repo GitHub.**

### Checklist de rendu

Avant de rendre, vérifiez chaque point :

- [ ] `git clone <votre-repo>` sur une machine propre
- [ ] `pnpm install` s'exécute sans erreur
- [ ] `pnpm dev` lance le frontend
- [ ] `pnpm api` lance le serveur
- [ ] L'application fonctionne dans le navigateur
- [ ] Le dossier `server/` n'a **pas été modifié** (on vérifiera le diff avec le scaffold)
- [ ] `npx tsc --noEmit` — 0 erreur
- [ ] `pnpm lint` — 0 erreur
- [ ] Les 3 membres du groupe ont des commits dans l'historique Git
- [ ] Le fichier `.env` n'est **pas** commité (il est dans `.gitignore`)
- [ ] Si vous avez choisi les tests : `pnpm test` passe

**Si le projet ne se lance pas** (`clone` + `install` + `dev` + `api`) : **-3 pts** sur la note finale. C'est testé en live lors de la soutenance.

---

## 11. Soutenance

### Format

- **~15 minutes par groupe**
- Devant jury, sur votre machine

### Déroulement

1. **Démo fonctionnelle** (~8 min) : parcours des fonctionnalités implémentées
2. **Questions techniques** (~4 min) : choix d'architecture, explications de code
3. **Questions individuelles** (~3 min) : chaque membre répond à :

| Question | Ce qu'on évalue |
| --- | --- |
| Une partie du code qui mériterait d'être améliorée | Capacité d'auto-critique |
| Une partie du code dont vous êtes fier(e) | Compréhension des bonnes pratiques |
| Un endroit où vous avez galéré | Honnêteté, apprentissage |

**Important** : chaque membre doit pouvoir expliquer l'ensemble du code. Un membre qui ne sait pas expliquer une partie peut être noté différemment du reste du groupe.

---

## 12. Ressources

- [React — Documentation officielle](https://react.dev)
- [TanStack Query — Guide](https://tanstack.com/query/latest/docs/framework/react/overview)
- [React Router — Documentation](https://reactrouter.com)
- [Tailwind CSS — Référence](https://tailwindcss.com/docs)
- [Vitest — Documentation](https://vitest.dev)
- [React Testing Library — Guide](https://testing-library.com/docs/react-testing-library/intro)
