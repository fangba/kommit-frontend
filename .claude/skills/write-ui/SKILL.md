---
name: write-ui
description: Implémenter une maquette (Figma, Google Stitch, HTML, URL) en composants dans la stack du projet. Utiliser quand l'utilisateur demande d'implémenter, intégrer ou convertir une maquette. Trigger sur "implémente la maquette", "intègre la maquette", "write-ui", "convertis en code", "intègre ce design".
---

## Entrée
La référence d'une ou plusieurs maquettes, qui peut avoir plusieurs formes :
- le lien d'une maquette Figma (fileKey + node-id)
- le lien d'un écran Google Stitch
- le lien vers un fichier HTML local
- une URL

## Sortie
Des composants dans la stack du projet, découpés sur les frontières d'US, + les fichiers de données et les assets locaux, assemblés — un rendu fidèle à la maquette, responsive.

---

## Étape 1 : Extraire la source en local (via subagents)

Cette étape est **déléguée à des subagents cloisonnés** — l'orchestrateur ne charge JAMAIS les gros dumps ni les screenshots dans son contexte.

1. **Lancer `mockup-code-fetcher`** avec la source (lien Figma / écran Stitch / fichier HTML / URL). Il récupère le **code brut + les assets** sur disque et rend uniquement les **chemins**.
2. **Si la maquette a un flux / des états** (série de frames Figma) → lancer aussi **`mockup-flow-describer`** avec la source. Il regarde les screenshots et rend un **résumé textuel du flux** (jamais les images).

Passer aux deux agents la **même liste de frames dans le même ordre** : c'est ce qui garantit que le numéro de séquence `<NN>` d'un screenshot et de son brut coïncident. Le nommage est parallèle des deux côtés — `F11-03-1-11434.png` (describer) ↔ `F11-03-1-11434-brut.jsx` (fetcher) — et le **node-id est le lien durable** entre une capture et son code.

À la fin de l'étape, l'orchestrateur dispose des **chemins des bruts + assets** (fetcher) et d'un **résumé textuel du flux** (describer). Il continue les étapes 2 → 5 à partir de **ça uniquement** — jamais en rechargeant les screenshots.

Si aucune source exploitable → demander à l'utilisateur un lien Figma, un fichier HTML ou une URL.

## Source Figma (MCP) — garde-fous spécifiques

Détail de ce que `mockup-code-fetcher` (code) et `mockup-flow-describer` (flux) appliquent pour une source Figma — et garde-fous que l'orchestrateur garde en tête aux étapes 2 → 5. Le MCP Figma ne rend pas du HTML : il rend du **React+Tailwind brut, en positionnement absolu**, + des **URLs d'assets**.

**Règle d'or : le screenshot sert à COMPRENDRE le flow, JAMAIS à implémenter.** Toute valeur (couleur, taille, police, icône) vient du MCP, jamais d'une capture. **Nuance importante — quel outil MCP fait foi pour quoi : voir [`outils-figma-mcp.md`](./outils-figma-mcp.md).** En bref : `get_design_context` fait foi pour la **structure et les classes**, mais **PAS pour les dimensions** (il fige parfois un `Fill` en valeur fixe) → pour une **taille**, c'est `get_metadata` qui fait foi.

1. **Extraire AVANT d'implémenter.**
   - **Le périmètre = le(s) node-id de l'URL, jamais la page.** Un seul node-id → on extrait **ce seul node** (son sous-arbre complet), point. Plusieurs node-ids explicitement fournis → on extrait chacun. `mcp__figma__get_metadata` s'appelle **sur le node du lien** (pour voir son sous-arbre), **jamais sur la page** pour énumérer les frames sœurs — c'est ça qui ramasse des écrans qu'on n'a pas demandés. Si le node lié contient lui-même plusieurs écrans distincts et que le périmètre est ambigu → **s'arrêter et demander**.
   - **Tout le matériau de référence vit dans `maquettes/` à la RACINE du repo, jamais sous `src/`** (ce n'est pas du code qui tourne, ça ne doit pas être compilé ni linté). Pour **chaque** node retenu → `mcp__figma__get_design_context`, sauvegarder le brut dans `maquettes/<série>/code-brut/<série>-<NN>-<node-id>-brut.jsx` (non retouché, JSX intégral). Screenshots → `maquettes/<série>/screenshots/` (même nommage, `.png`), résumé du flux → `maquettes/<série>/FLOW.md`. Assets bruts téléchargés → `maquettes/<série>/assets-bruts/`.
2. **Télécharger les assets tout de suite.** Les URLs `https://www.figma.com/api/mcp/asset/...` **expirent en 7 jours** → `curl` immédiat dans `maquettes/<série>/assets-bruts/`, une seule commande. On commite les **fichiers téléchargés**, jamais les URLs. (Les assets réellement **utilisés** par l'appli seront copiés/renommés vers `src/assets/` à l'Étape 4 — `src/` ne contient que ce qui sert au runtime.)
3. **Le brut remplace « le HTML »** dans les étapes 2 → 5 : on analyse et on implémente depuis les fichiers bruts + assets locaux. Utiliser les **noms de calques** (`data-name`, `sc-*`) comme indice de regroupement.
   - **Séparer le LAYOUT des VALEURS de style.** On **réécrit le layout** (positionnement absolu → flex/grid responsive), mais on **préserve chaque valeur de style à l'identique** : couleur, **ombre** (`shadow`, `drop-shadow`, y compris `shadow-[inset_…]`), `border`, `radius`, `ring`, `outline`, espacements, opacité. Réécrire le layout ne change **jamais** le résultat visuel.
   - **Un wrapper qui porte une classe de style N'EST PAS un déchet.** Le MCP pose souvent une valeur sur un `<div>` d'aspect « inutile » (`absolute inset-0 pointer-events-none …`) — typiquement une **ombre intérieure**. Ce div porte une **couche de style à conserver**, pas à supprimer. Ne jeter un nœud que s'il est **réellement vide de style**.
   - **Seuls déchets supprimables**, explicitement : le calque **`Cursors`** (annotation d'interaction) et les **placeholders de debug évidents** (ex. `bg-[red]` sur un conteneur). Pour tout le reste, si l'intention d'un nœud est ambiguë (déchet ou style ?) → **s'arrêter et demander**, jamais deviner.
4. **États** (survol, sélection, admin…) → depuis le brut de la **frame d'état correspondante**. Pas de brut pour un état = revenir au point 1. Interdit de l'inférer d'un screenshot.

## Étape 2 : Analyser le HTML

Avant d'écrire le moindre code, analyser le HTML téléchargé et extraire :

1. **Design tokens** — Lister toutes les couleurs, fonts, border-radius, espacements. Les mapper vers le système de tokens du projet (Tailwind `@theme`, CSS variables, etc.).
2. **Patterns répétés** — Identifier les blocs HTML qui se répètent (nav items, cards, list items). Chaque pattern répété 2+ fois = un composant.
3. **Données** — Extraire tous les textes, valeurs, URLs d'images qui sont en dur dans le HTML. Les regrouper dans des constantes.
4. **Incohérences** — Repérer les valeurs hardcodées qui ont un équivalent token. Les normaliser vers le token.

## Étape 3 : Planifier la structure

Avant d'écrire le moindre code, lister :

- Les composants à créer (un par pattern répété ou par section logique)
- **Séparer le réutilisable du spécifique** — distinction **universelle** (quel que soit le framework ou le langage) : ce qui est générique / réutilisé par 2+ écrans (bouton, champ, carte, logo…) va dans un dossier **partagé** ; ce qui est propre à un écran reste groupé **par écran**. **Tout vit sous `src/components/`, avec exactement deux sous-dossiers, pas un de plus :**
  - **`components/ui/`** — tous les génériques réutilisables (boutons, champs, cartes, logo, icônes…).
  - **`components/pages/<Écran>/`** — la page ET tous ses morceaux spécifiques (header, sections, footer…) groupés dans son dossier.
  - Rien à la racine de `src/` (pas de `src/pages/` séparé) et pas de 3ᵉ dossier (`layout/`, `shared/`, `common/`, `features/`…) : un élément « layout » (header/footer) reste dans `components/pages/<Écran>/` tant qu'un seul écran l'utilise, et ne remonte dans `components/ui/` que le jour où un 2ᵉ écran le réutilise. Si le projet a **déjà** une convention différente, s'aligner dessus ; sinon, c'est `components/ui/` + `components/pages/`, point.
- **Extraire tout composant réutilisable, systématiquement.** Dès qu'un élément est générique ou apparaît **2+ fois** (bouton, champ, icône-bouton, carte…), l'extraire en composant réutilisable (dans le dossier générique du projet, ex. `ui/`) paramétré par props/variants — jamais le dupliquer ni le laisser inline. Garde-fou inverse : un bloc utilisé **une seule fois** et non générique reste **local** à son écran (pas de sur-découpage).
- **Découper les composants sur les frontières d'US / logique métier** : jamais deux US dans un même composant. Si la couture visuelle colle à la couture métier → un composant ; sinon isoler la logique dans un hook/module. (Les US viennent des tickets/spec, pas de la maquette.)
- Les fichiers de données (constantes, assets)
- Le composant racine qui assemble le tout

Adapter la structure à la stack du projet. **La stack se lit dans `package.json`, elle ne se suppose pas** : c'est là qu'on trouve le framework (React, Vue, Angular, Next, Svelte…) et la lib de styling à utiliser.

### Format de présentation du plan — OBLIGATOIRE

Présenter la structure comme un **véritable arbre de dossiers** (bloc de code, style `tree`), **jamais** comme une liste à puces en vrac. On doit lire le plan comme on lirait un `ls -R` : la hiérarchie réelle des dossiers et fichiers qui vont être créés, chaque fichier suivi d'un commentaire court de son rôle. C'est le cœur du plan, pas un à-côté.

Règles de l'arbre :
- Racine = le dossier réel du projet (`src/`), pas un dossier abstrait.
- Un nœud par fichier/dossier **réellement créé**, avec son extension exacte (`.tsx`, `.vue`, …).
- Chaque fichier annoté en fin de ligne : rôle + (si utile) pourquoi réutilisable vs spécifique.
- Marquer les fichiers **modifiés/remplacés** existants (ex. `App.tsx  ← remplacé`).
- Regrouper visuellement générique (`ui/`) et spécifique (écran/feature) par la hiérarchie elle-même.

Exemple du niveau de détail attendu :

```
src/
├── components/
│   ├── ui/                        # génériques réutilisables
│   │   ├── Button.tsx             # variantes primary/tertiary + slot icône (2 boutons dans la maquette)
│   │   └── icons/
│   │       ├── SendIcon.tsx       # SVG inline, currentColor
│   │       └── InfoIcon.tsx
│   └── pages/
│       └── DailyEntry/            # l'écran + TOUS ses morceaux spécifiques (dont header/footer)
│           ├── DailyEntryPage.tsx # assemble tout
│           ├── Header.tsx         # logo + bouton déconnexion
│           ├── Heatmap.tsx        # grille 7×53 pilotée par données
│           ├── DailyEntryCard.tsx # textarea + submit
│           └── Footer.tsx         # crédit
└── data/
    └── daily.ts                   # constantes (prénom, textes, labels)
```

Après l'arbre, ajouter seulement : les tokens extraits (bref) et les **points d'arbitrage** à trancher. Puis présenter à l'utilisateur AVANT d'implémenter et **attendre validation**.

## Étape 4 : Implémenter

1. **Tokens** — Configurer le design system du projet avec les tokens extraits.
2. **Assets** — copier depuis `maquettes/<série>/assets-bruts/` vers `src/assets/<série>/` le **sous-ensemble réellement utilisé**, renommé en noms **sémantiques** (`fries.png`, `trash.svg`…), en **dédupliquant** les ré-exports d'une même image (le MCP en sort un par frame). Les bruts dans `maquettes/` gardent leurs noms machine traçables ; la copie + renommage se fait **ici** (orchestrateur), **jamais au fetch** — le fetcher reste mécanique. `src/assets/` ne contient donc que les images utilisées au runtime.
3. **Données** — Créer les fichiers de constantes (données, navigation) et y référencer les assets par leurs noms sémantiques.
4. **Composants** — Construire **d'abord les réutilisables** (dossier générique, ex. `ui/`) identifiés à l'Étape 3, **puis les composants spécifiques** à l'écran qui les composent : les pages consomment les primitives, donc l'ordre de dépendance impose bas → haut. Si un réutilisable **émerge** en cours de route (non repéré à l'analyse), l'extraire vers le dossier générique à ce moment-là aussi. Respecter les rules du projet :
   - Props pour les données variables
   - Tokens exclusivement (pas de valeurs hardcodées si un token existe)
   - Accessibilité (`aria-label` sur les boutons icônes, sémantique HTML)
   - Valeurs SVG/calculées paramétrées avec formules explicites
5. **Assemblage** — Composer les composants, importer les données, passer les props.

## Étape 5 : Vérifier

1. Lancer le dev server (port du framework ; si occupé, essayer le suivant et le signaler).
2. Comparer visuellement avec la maquette source.
3. **Passe responsive** — à 375 / 768 / 1280 px : layout qui casse, texte qui déborde, images mal dimensionnées, cibles tactiles ≥ 44×44px.
4. **Passe a11y** — `aria-label` sur les boutons icônes, `alt` sur les images, `type` sur les boutons, navigation clavier logique, focus piégé puis rendu sur modals/drawers si présents.
5. **Audit console** — lancer en dev, corriger TOUTES les erreurs et warnings (ou expliquer toute suppression).
6. Vérifier les interactions — **uniquement celles de `FLOW.md`**.

## Règles pendant la conversion

- Ne JAMAIS faire un copier-coller brut du HTML vers du code. Toujours passer par l'analyse (étape 2).
- Les **curseurs / doigts / pointeurs** présents dans la maquette (souvent un calque `Cursors`) sont des **annotations d'interaction** (survol/clic), **pas de l'UI** → ne jamais les intégrer. Ils indiquent où coder l'interaction (voir `FLOW.md`), rien de plus.
- Si l'intention n'est pas déductible de la source (placement volontaire vs erreur, ce qui doit flexer vs rester fixe) → **s'arrêter et demander**, ne pas combler seul par une devinette.
- Si le HTML source utilise des valeurs hardcodées ET des tokens pour la même chose, normaliser vers le token.
- **Données : une seule frame fait foi.** Sur une série de frames (états), les données affichées (noms, prix, quantités…) sont souvent du dummy qui **varie d'une frame à l'autre**. Choisir la frame **canonique** (l'état de repos / écran de base) comme source unique des données ; les autres frames ne servent qu'à la **structure des états** (survol, admin…), jamais à extraire une donnée.
- **Texte tronqué / omis = artefact d'affichage, pas la donnée.** Un libellé coupé par une largeur fixe (« Burger Smoke B », « Pepsi 25cl ME… ») ou absent dans la frame canonique n'est PAS la vraie valeur. Récupérer la valeur **complète** là où la maquette la montre en entier (une autre carte, une autre frame) ; ne jamais transcrire la troncature ni les points de suspension. Si la valeur complète est introuvable partout → **demander**, ne pas inventer.
- Les images sur des URLs externes sont temporaires. Les isoler dans un fichier de constantes pour faciliter le remplacement futur.
- **Animations** : standardiser une seule approche, et n'implémenter QUE les interactions réellement présentes dans la maquette / `FLOW.md`. Ne JAMAIS inventer d'animations « premium » (entrées blur-slide, hero mot-par-mot, parallax, compteurs…) que la maquette ne montre pas.
- **Tokens d'abord** : configurer les tokens (couleurs, polices, espacements) AVANT d'écrire les composants ; ensuite, zéro valeur brute si un token existe.
