---
name: setup-ci
description: Met en place la CI GitHub Actions du repo. Écrit le `.github/workflows/ci.yml` à partir d'un ticket et le mène jusqu'au vert sur un vrai run. Utiliser quand l'utilisateur dit "setup-ci", "mets en place la CI", "crée le workflow", "écris la CI".
---

## Entrée

- Le **ticket** (lien ou ID) décrivant la CI voulue — branche cible, vérifications, périmètre (ce qui reste hors CI) — quand le travail est suivi dans le board ; sinon la **demande directe** de l'utilisateur.
- Le **repo courant**, avec son `package.json`, son lockfile et ses scripts.
- La **branche d'intégration** que visent les PR (par défaut `dev`, sinon `main`).
- Les **vérifications voulues** dans la CI (build et tests toujours ; lint seulement si un linter est réellement configuré).

## Sortie

- Un fichier **`.github/workflows/ci.yml`** qui lance ces vérifications sur chaque PR vers la branche d'intégration.
- Un **`.nvmrc`** figeant la version de Node, lu par la CI et le local (même version partout).
- Une **CI verte constatée sur un vrai run** — la PR poussée, le run GitHub observé au vert, pas « ça passe en local ».

---

## Comment

### 0. Lire le ticket (s'il y en a un)

Si un ticket est fourni, en extraire les specs qui pilotent le workflow : **branche cible**, **vérifications** attendues (build / tests / lint), et **périmètre** (ce qui est explicitement hors CI, ex. e2e, ESLint). Ces specs priment sur les défauts. Sans ticket, confirmer ces points avec l'utilisateur avant d'écrire.

### 1. Détecter la stack (lecture seule, avant d'écrire quoi que ce soit)

- **Gestionnaire de paquets** depuis le lockfile : `pnpm-lock.yaml` → pnpm (noter `lockfileVersion` : `9.0` → pnpm 9). Sur ce projet, c'est **toujours pnpm** (cf. `package.md`). Install en CI : `pnpm install --frozen-lockfile`.
- **Scripts** dans `package.json` : repérer `build`, `test:run` (ou `test` en mode run), `lint`. N'ajouter une étape que pour un script qui existe.
- **Version de Node** : lire un `.nvmrc` / `engines` existant. S'il n'y en a pas, choisir la **dernière LTS** et la figer soi-même dans un `.nvmrc`.

### 2. Repérer les pièges d'environnement

- **⚠️ Linter sur TypeScript trop récent.** Si le lint passe par **ESLint** et que le repo est en **TypeScript ≥ 7**, ESLint refuse de démarrer (`typescript-eslint` plafonne à TS 6). Deux issues : aligner TypeScript sur 6, ou ne pas mettre de lint. **Ne jamais poser une étape `pnpm lint` qui plantera** — vérifier d'abord que `pnpm lint` tourne en local.
- **Variables exigées au chargement.** Chercher un fichier de config qui `throw` si une variable manque (ex. env qui exige une clé). Si les tests l'importent, prévoir une valeur factice au bon step — sans jamais brancher de vraie base ni de vrai service.

### 3. Écrire le workflow

`.github/workflows/ci.yml`, un seul job, déclenché sur PR vers la branche d'intégration :

```yaml
name: CI

on:
  pull_request:
    branches: [dev]

# Annule le run précédent quand la PR est mise à jour, au lieu de les empiler.
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Installer pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Installer Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm

      - name: Installer les dépendances
        run: pnpm install --frozen-lockfile

      # Étape lint UNIQUEMENT si `pnpm lint` existe et tourne (cf. §2).
      - name: Lint (ESLint)
        run: pnpm lint

      - name: Build (typecheck + build Vite)
        run: pnpm build

      - name: Tests unitaires
        run: pnpm test:run
```

Adapter : la branche dans `on.pull_request.branches`, la version pnpm au lockfile, retirer l'étape lint si aucun linter.

### 4. Valider en local (fail fast)

Rejouer la séquence de la CI sur la machine avant de pousser : `pnpm install --frozen-lockfile`, puis `pnpm lint` (si présent), `pnpm build`, `pnpm test:run`. Si ça casse en local, corriger avant de toucher à GitHub.

### 5. Valider sur un vrai run (le contrat de sortie)

- Committer `ci.yml` + `.nvmrc`, pousser, ouvrir une **PR vers la branche d'intégration** — c'est ça qui déclenche la CI.
- **Regarder le run** (`gh run watch <id> --exit-status`) et corriger les allers-retours qui ne cassent **qu'en CI** (version de Node, cache pnpm, variable d'env absente du runner) jusqu'au vert.
- Rapporter le **résultat réel** du run, jamais « ça devrait passer ».

### 6. Branch protection (note — action GitHub à part)

« Bloquer le merge tant que la CI est rouge » n'est pas dans le workflow : c'est une protection de branche côté GitHub. Ce n'est **pas** le travail de ce skill (une action ponctuelle, à effet, à confirmer), mais voici la procédure quand on veut la poser :

1. **Le check doit exister** : le workflow doit être mergé sur la branche cible, sinon le check est fantôme.
2. **Récupérer son nom exact** via `gh pr checks` ou `gh run list` sur une PR récente.
3. **Confirmer** avec l'utilisateur (action à effet sur le repo).
4. **Poser** via `gh api repos/{owner}/{repo}/branches/{branch}/protection` en exigeant ce status check, puis relire pour confirmer.

⚠️ **Sur un repo privé en plan gratuit, ce n'est pas applicable** : l'appel renvoie un 403 (protection classique réservée aux plans payants en privé) ou la règle n'est pas appliquée. Le signaler franchement, ne jamais prétendre l'avoir posée.

## Hors périmètre

- Le **déploiement** (CD) : c'est un autre skill (`setup-cd`).
- La **pose** de la branch protection : action à part (cf. §6), pas ce skill.
- Les **e2e** (Playwright) : lents et dépendants d'un backend lancé, hors de cette CI par défaut. Ne pas les ajouter sans demande explicite.
