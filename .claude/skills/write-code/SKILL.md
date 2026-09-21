---
name: write-code
description: Implémenter la logique métier frontend pour faire passer les tests (Phase 3 du workflow). Prend le code statique de Phase 1 + les tests rouges de Phase 2, implémente les fonctions et le state pour que tout passe au vert. Trigger sur "write-code", "implémente la logique", "phase 3", "fais passer les tests", "make it green".
---

# Write Code — Faire passer les tests au vert

Ce skill est la Phase 3 du workflow frontend. Il s'exécute APRÈS la Phase 2 (test-first). Les tests définissent ce qui doit être implémenté — rien de plus, rien de moins.

| Étape | Nom | Description |
|-------|-----|-------------|
| 1 | Lire les tests | Comprendre le cahier des charges : quelles fonctions, quels comportements attendus |
| 2 | Lire le code Phase 1 | Identifier les données statiques à convertir en state et les composants à rendre réactifs |
| 3 | Implémenter la logique métier | Créer les fonctions pures, convertir les données en state, ajouter les handlers |
| 4 | Faire passer les tests | Lancer les tests, corriger jusqu'à ce que tout soit vert |
| 5 | Vérifier dans le navigateur | Lancer le dev server, confirmer que l'app fonctionne visuellement |

## Étape 1 : Lire les tests

Parcourir tous les fichiers de test produits par Phase 2. Pour chaque test, identifier :

- Le nom de la fonction appelée
- Les paramètres d'entrée
- Le résultat attendu
- Les edge cases couverts

Les tests sont le cahier des charges. Ne pas deviner des comportements qui ne sont pas testés.

## Étape 2 : Lire le code Phase 1

Parcourir le code statique pour comprendre :

- Les données hardcodées (constantes, fichiers de données) → devront devenir du state
- Les composants qui affichent ces données via props → devront recevoir du state au lieu de constantes
- Le flow de données (qui passe quoi à qui) → identifier où placer le state et les handlers

## Étape 3 : Implémenter la logique métier

1. **Fonctions pures** — Créer les fonctions que les tests importent (calculs, transformations, validations). Les placer dans des modules séparés (ex: `utils/calculations.js`).
2. **State** — Convertir les données hardcodées en `useState` (ou équivalent selon la stack).
3. **Handlers** — Ajouter les handlers d'événements (onSubmit, onClick, onChange) qui modifient le state.
4. **Connexion** — Brancher le state sur les composants via les props existantes. Les composants de Phase 1 sont déjà structurés pour ça grâce aux rules.

## Étape 4 : Faire passer les tests

Lancer les tests après chaque changement significatif. Objectif : tout au vert.

- Si un test échoue → corriger l'implémentation, pas le test
- Si un test semble faux → le signaler à l'utilisateur, ne pas le modifier sans validation
- Quand tout est vert → passer à l'étape 5

## Étape 5 : Vérifier dans le navigateur

Si le MCP Playwright est disponible, spawner un sub-agent pour la vérification. Sinon, lancer le dev server et demander à l'utilisateur de vérifier manuellement.

**Vérification avec Playwright (sub-agent) :**

1. Lancer le dev server en background
2. Naviguer vers l'app (ex: `http://localhost:5173`)
3. Prendre un screenshot de l'état initial
4. Tester le parcours principal (golden path) : saisir un repas dans QuickEntry, soumettre, vérifier que les compteurs se mettent à jour
5. Tester les edge cases identifiés dans les tests
6. Vérifier qu'il n'y a pas de régression visuelle par rapport à la maquette Phase 1
7. Rapporter le résultat (screenshots + observations)

**Vérification manuelle (fallback) :**

1. Lancer le dev server
2. Demander à l'utilisateur de tester le parcours principal et les edge cases

## Livrable

L'app est fonctionnelle : tous les tests passent, la logique métier est implémentée, le rendu est fidèle à la maquette.

## Règles

- Les tests dictent ce qui doit être implémenté. Si un comportement n'a pas de test, ne pas l'inventer.
- Ne JAMAIS modifier un test pour le faire passer. Si un test semble faux, demander à l'utilisateur.
- Les fonctions de logique métier vivent dans des modules séparés, pas dans les composants.
- Le code de rendu (composants, CSS) de Phase 1 ne devrait pas changer structurellement — on ajoute du state et des handlers, on ne restructure pas.
