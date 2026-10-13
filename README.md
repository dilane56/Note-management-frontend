# EduGrades — frontend

Interface web de gestion des notes (Next.js 14, React 18, TypeScript, Tailwind CSS 4, composants Radix/shadcn).
Elle consomme l'API du backend Spring Boot (`../NOTE-MANAGEMENT-BACKEND`).

## Démarrage

Prérequis : Node.js 18.18 ou plus récent, et le backend démarré (port 8080 par défaut).

```bash
npm ci
cp .env.example .env.local   # puis adapter NEXT_PUBLIC_API_URL si besoin
npm run dev                  # http://localhost:3000
```

Le backend doit autoriser l'origine du frontend (`CORS_ALLOWED_ORIGINS`, par défaut `http://localhost:3000,http://localhost:3001`).

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (échoue en cas d'erreur TypeScript) |
| `npm start` | Sert le build de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires (Vitest) |

## Variables d'environnement

| Variable | Défaut | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | URL du backend, sans `/` final. Intégrée au build : la redéfinir sur Vercel avant de déployer. |

## Fonctionnalités par rôle

- **Administrateur** :
  - utilisateurs, filières, classes, matières et évaluations ;
  - assignation des enseignants ;
  - relevés PDF par classe (ZIP ou PDF unique) ou par étudiant, et envoi par email ;
  - exports Excel ;
  - statistiques.
- **Enseignant** :
  - saisie, modification et suppression des notes et commentaires, pour ses matières ;
  - consultation de ses matières (coefficient et barème en lecture seule, fixés par l'administrateur) et de ses classes, avec leurs statistiques.
- **Étudiant** :
  - ses notes, sur le barème de la matière et sur 20 ;
  - sa moyenne et son rang par évaluation ;
  - relevé PDF et export Excel.

L'interface n'affiche que ce que le rôle permet ; c'est le backend qui contrôle réellement les droits.

## Organisation du code

```
app/                page unique, en-tête et navigation par rôle
components/
  admin/            écrans de gestion (administrateur)
  teacher/          saisie des notes, matières, classes (enseignant)
  student-dashboard.tsx
  statistics-view.tsx   statistiques d'une classe (admin et enseignant)
  shared.tsx            composants communs (confirmation, erreurs, sélecteurs…)
  ui/                   composants de base shadcn
contexts/auth-context.tsx   session : connexion, vérification du token, déconnexion sur 401
hooks/              chargement des données (useAsync) et hooks par ressource
lib/
  api.ts            client HTTP unique : token, erreurs du backend, téléchargements
  types.ts          types alignés sur les DTO du backend
  format.ts         libellés et calculs d'affichage (note sur 20, rang, évaluations)
  *-api.ts          appels par ressource
```

## Points à connaître

- **Session.** Le token JWT est conservé dans `localStorage` et vérifié au démarrage (`/api/auth/validate-token`). Toute réponse 401 déconnecte l'utilisateur avec le message « session expirée ».
- **Erreurs.** Le message renvoyé par le backend (`message` et `fieldErrors`) est affiché tel quel dans les notifications : email déjà utilisé, note en double, suppression impossible, trop de tentatives de connexion…
- **Notes.** Une note est saisie sur la note maximale de sa matière. Les moyennes et les rangs viennent du backend (moyenne pondérée sur 20). Le frontend ne fait que ramener chaque note sur 20 pour l'affichage.
- **Déploiement Vercel.** Le projet utilise npm (`package-lock.json`). Pensez à définir `NEXT_PUBLIC_API_URL` dans les variables du projet.
