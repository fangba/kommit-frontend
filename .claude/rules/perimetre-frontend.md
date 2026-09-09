# Périmètre de travail — ce repo et rien d'autre

Le seul endroit où il est permis d'écrire est le repo courant : `kommit-frontend-ccem/`.

## Interdit

- **Écrire dans `kommit-backend-ccem/`**, sous n'importe quelle forme : créer, modifier ou supprimer un fichier (code, config, tests, docs, `.claude/`, migrations, n'importe quoi), lancer une commande qui écrit dedans (`git` qui change l'état, `pnpm install`, un script, un formateur, un codemod…).
- Écrire dans le dossier parent `kommit-ccem/` (dont `.claude/`, `.vscode/`).
- Écrire ailleurs sur la machine : `~/.claude`, `/tmp`, un autre repo, le Bureau…
- Contourner par un chemin absolu, un lien symbolique ou un `cd` : l'interdiction porte sur l'emplacement des fichiers, pas sur la façon d'y arriver.

## Autorisé

- Écrire partout dans `kommit-frontend-ccem/`.
- **Lire** le backend et le dossier parent (`Read`, `Grep`, `Glob`, `git log`, `git diff`…) pour comprendre le contexte, une API, un contrat de données.
- Écrire dans le dossier scratchpad fourni par la session pour les fichiers temporaires.

## Si une demande implique d'écrire ailleurs

Demander l'autorisation avant de vouloir le faire. Exception quand la demande est explicitement demandée par l'utilisateur, par exemple pour corriger un fichier de skill dans un autre repo ou pour modifier un bug dans le backend.

Rappel : Kommit est un projet multi-repo. Le backend est un repo indépendant, avec sa propre stack et sa propre histoire git. Une modification faite d'ici ne serait ni review ni commit correctement.
