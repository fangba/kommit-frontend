# Conventions de fichiers

Comment on organise les fichiers dans le projet — valable **partout** (pas seulement l'intégration de maquettes).

## Un fichier = une unité

- **Un composant par fichier.** Jamais deux composants exportés depuis le même fichier (pas de fichier « barrel » de composants qui regroupe `UserIcon` + `ArrowIcon`). Un composant = un fichier à son nom, export par défaut.
- **Un SVG par fichier.** Chaque illustration/asset SVG vit dans son propre fichier `.svg`. Jamais plusieurs SVG entassés dans un même fichier.
- Exception unique : un sous-composant purement privé, jamais réutilisé et trivial, peut rester dans le fichier de son parent — mais dès qu'il a un nom propre ou qu'il pourrait être importé ailleurs, il sort dans son fichier.

## Fichiers de test

- **Colocalisés : le test vit à côté de ce qu'il teste.** `calendrier.ts` → `calendrier.test.ts` dans le même dossier ; `SignupForm.tsx` → `SignupForm.test.tsx` à côté. Jamais dans un dossier `tests/` séparé qui duplique l'arborescence.
- **Convention de nommage : `<nom>.test.ts` / `<nom>.test.tsx`** (le défaut de Vitest).
- **Pourquoi :** le test suit le fichier quand on le déplace, la couverture se voit à l'œil (un fichier sans `.test` à côté = un trou visible), et `logic/` reste homogène — que de la logique pure et ses tests purs.
- **Exception : le end-to-end.** Un parcours Playwright ne teste aucun fichier précis, il traverse toute l'app → dossier dédié `e2e/` à la racine, jamais colocalisé.

## Imports

- **Alias `@/` = `src/` pour tout import inter-dossiers.** `import X from '@/components/ui/Logo'`, jamais `'../../ui/Logo'`. Ça reste lisible et ne casse pas quand on déplace un fichier.
- **Relatif `./` uniquement pour un voisin du même dossier** (`import LoginForm from './LoginForm'`).
- Jamais de `../` qui remonte d'un dossier : si tu remontes, utilise `@/`.
