#!/usr/bin/env bash
# Hook PostToolUse (matcher Edit|Write).
# But : lancer ESLint sur le fichier qu'on vient d'écrire et remonter ses
# problèmes — SANS bloquer. Remplace l'ancienne vérif grep mono-règle : la règle
# des imports parents vit désormais dans eslint.config.js (no-restricted-imports),
# et ESLint apporte en plus react-hooks, variables inutilisées, etc.

# 1) Extraire le chemin du fichier modifié depuis le JSON reçu sur stdin.
file="$(node -e 'const s=require("fs").readFileSync(0,"utf8");let p="";try{p=JSON.parse(s).tool_input.file_path||""}catch{}process.stdout.write(p)')"

# 2) Ne traiter que les fichiers TS/TSX (ce que la config ESLint cible).
case "$file" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

# 3) Linter uniquement ce fichier. eslint sort en code 1 s'il trouve un problème.
out="$(pnpm exec eslint "$file" 2>&1)" || true

# 4) Rien à signaler -> on quitte proprement, aucun bruit.
[ -z "$out" ] && exit 0

# 5) Injecter le rapport ESLint dans le contexte de Claude. exit 0 => NON bloquant.
node -e 'const m=process.argv[1];process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:"⚠️ ESLint sur le fichier édité :\n"+m}}))' "$out"
exit 0
