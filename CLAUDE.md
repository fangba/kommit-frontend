# CLAUDE.md

Ce dépôt est le frontend du projet Kommit : une application React/TypeScript/Vite, stylée avec Tailwind et ShadCN/ui (Base UI).

## Arborescence

> Cette arborescence liste les éléments structurants du dépôt. Le dépôt va évoluer au fil de la formation (ajout de tests, de routes, de config CI/CD…) : il faudra la tenir à jour à chaque changement de structure notable.

```
kommit-frontend/
├── .claude/
│   ├── agents/             # agents invocables (code-reviewer, test-planner...)
│   ├── hooks/              # scripts déclenchés par les hooks (ex. vérification des imports)
│   ├── rules/              # règles propres au frontend (architecture, pnpm, ui, tests, périmètre...)
│   ├── skills/             # skills invocables (write-ui, write-code, open-pr, merge-pr...)
│   └── settings.json       # réglages Claude Code du repo
├── .vscode/
│   └── settings.json
├── docs/
│   └── TECH.md             # stack technique
├── maquettes/              # maquettes Figma extraites (screenshots, code brut, assets)
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/             # composants shadcn/ui génériques (Base UI), réutilisés par 2+ écrans
│   │   └── pages/          # un dossier par écran, avec ses morceaux spécifiques (ex. Diagnostic/)
│   ├── lib/
│   │   ├── api/            # le seul endroit qui parle au réseau (ex. health.ts)
│   │   └── utils.ts        # cn() — emplacement shadcn, ne pas déplacer
│   ├── types/
│   │   └── apiContract.ts  # contrat d'API partagé avec le backend
│   ├── App.tsx             # assemblage : providers + routes, aucun affichage
│   ├── index.css           # entrée Tailwind
│   └── main.tsx            # point d'entrée : monte l'app React
├── CLAUDE.md               # ce fichier
├── components.json         # config shadcn/ui
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
└── tsconfig*.json
```
