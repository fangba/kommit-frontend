---
name: setup-cd
description: Assiste la mise en place du déploiement continu du frontend sur Vercel. Prépare le `vercel.json`, indique les variables d'environnement et le réglage de l'auth cross-origin, et liste ce que tu poses toi-même dans le dashboard Vercel (brancher le repo, variables, branche de prod). Utiliser quand l'utilisateur dit "setup-cd", "branche Vercel", "mets en place la CD front", "déploiement continu frontend".
---

## Entrée

- La **cible** (Vercel) et la **branche déployée** (`dev`), depuis le ticket CD ou la demande directe.
- L'**URL du backend déployé** (l'API que le front doit appeler en prod, pas `localhost`).
- Le **repo courant** : une SPA Vite + React Router, buildée avec `pnpm build`.

## Sortie

- Un **déploiement continu fonctionnel, mis en place avec l'utilisateur** : à chaque merge sur `dev`, Vercel build et déploie, et l'app déployée **s'affiche ET se connecte** (auth cross-origin qui marche), pas seulement une page qui charge.
- Un **plan d'ensemble en prose**, en trois sections (repo frontend / dashboard Vercel / blocage backend), qui donne la vue globale.
- Une **liste de tâches `TaskCreate`** qui reprend ce plan, une tâche par action, cochée au fil de l'avancement.
- La liste explicite de ce qui reste à faire **à la main dans le dashboard Vercel** (et côté backend).

---

> ⚠️ **Skill écrit de connaissance, pas encore éprouvé sur un vrai déploiement** (contrairement à `setup-ci`, prouvé bout en bout). À valider et corriger au premier branchement Vercel réel.

## Format de restitution — vue d'ensemble ET tâches cochables

Restituer en **deux temps complémentaires**, jamais l'un sans l'autre. Le premier donne la cohérence et le « pourquoi » ; le second donne le suivi vivant en bas d'écran. Les garder alignés : même ordre, même découpage.

1. **Un plan d'ensemble en prose**, en trois sections :
   - **§1 Dans ce repo (frontend)** — ce qui se commite ici (`vercel.json`).
   - **§2 Dashboard Vercel** — les étapes à cliquer soi-même (import du repo, preset Vite, variable `VITE_API_URL`, Production Branch, deploy).
   - **§3 Blocage backend** — l'auth cross-origin, à faire dans le repo backend + le dashboard Render.
2. **Une liste `TaskCreate`** qui reprend ce plan, **une tâche par action concrète**, dans le même ordre. Suivre le statut au fil de l'eau : passer la tâche en **`in_progress`** au moment où on l'attaque (elle s'affiche en orange), puis en **`completed`** quand elle est finie. Ne jamais annoncer « on est sur la tâche X » sans l'avoir passée en `in_progress` — sinon l'affichage et le discours ne collent pas.

Ne pas numéroter deux fois de deux façons différentes : les sous-points d'une section de prose et les tâches doivent se correspondre un pour un, pour que l'utilisateur retrouve chaque tâche dans le plan.

## Comment

### 1. Brancher le service Vercel

Un projet Vercel connecté au repo frontend. Preset **Vite** (build `pnpm build`, sortie `dist`, install `pnpm install --frozen-lockfile`). Node lu depuis le `.nvmrc` (24). Définir la **Production Branch** selon le besoin : `dev` si c'est l'environnement DEV visé ; sinon `main` = prod et `dev` sort en preview.

### 2. Variables d'environnement (le piège Vite)

Vite n'expose au client **que** les variables préfixées **`VITE_`**, et **au moment du build**. L'URL du backend doit donc être `VITE_API_URL` (ou similaire), posée dans Vercel **par environnement** (Production / Preview). Une variable non préfixée `VITE_` n'arrivera jamais dans le bundle → le front tape dans le vide.

### 3. Auth cross-origin (le vrai point dur)

Le front déployé (domaine `*.vercel.app`) appelle le backend déployé (autre domaine). Les cookies de session (better-auth, `credentials: 'include'`) sont alors **cross-site** : ils exigent `SameSite=None; Secure` côté backend, et le **CORS du backend doit autoriser l'origine Vercel avec credentials** (ajouter l'URL Vercel à `CORS_ORIGINS` côté back). Sans ça, l'app s'affiche mais la connexion échoue en silence. C'est l'échec le plus fréquent d'un front déployé.

### 4. `vercel.json` pré-rempli — le cadre qui sert à guider

Écrire le `vercel.json` **complet à l'avance**, en dérivant du `package.json` tout ce qui est déterminable sans deviner : `framework`, `installCommand`, `buildCommand`, `outputDirectory`, plus la réécriture SPA. Le fichier ne fait pas tout tout seul (il n'agit qu'une fois sur la branche déployée, et ne crée ni le projet ni les variables), mais il sert de **cadre** : il fige les valeurs exactes, et c'est à partir de lui qu'on dicte à l'utilisateur quoi coller au dashboard.

```json
{
  "framework": "vite",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- `buildCommand` = le script `build` du `package.json` (ici `tsc -b && vite build` via `pnpm build`), pour garder le typecheck que le défaut Vercel (`vite build`) sauterait.
- La **réécriture SPA** est indispensable : React Router côté client, sans elle un lien direct vers une page profonde renvoie un 404.
- Ce qu'on **ne peut pas** mettre dans le fichier et qui reste manuel au dashboard : créer/brancher le projet, poser les variables d'env (on ne lit pas le vrai `.env`), définir la Production Branch.

### 5. Porte de qualité (note)

Vercel déploie au merge **même si la CI GitHub est rouge** — il lance son propre build, il ignore ton workflow lint/test. Pour ne déployer que sur CI verte : option « attendre les checks » côté Vercel, ou branch protection (cf. `setup-ci` §6, non applicable sur privé gratuit). Le signaler, ne pas prétendre que le déploiement est gated par défaut.

### 6. Vérifier

Déclencher un déploiement (merge sur `dev`), ouvrir l'URL déployée, et **tester la connexion réelle** — pas juste que la page charge : se connecter, vérifier que la session tient (c'est ce qui valide l'auth cross-origin des §2-3).

## Ce qui se fait à la main (Vercel ne s'automatise pas tout en CLI)

Lister clairement pour l'utilisateur ce qui passe par le dashboard : créer/brancher le projet, poser les variables d'environnement, définir la Production Branch. Le skill prépare le `vercel.json` et l'URL/les valeurs ; l'utilisateur clique la partie dashboard.

## Hors périmètre

- La **CI** (lint/build/test) : c'est `setup-ci`.
- Le **déploiement du backend** : autre repo, autre plateforme (Render, cf. `deploy-render` côté back).
