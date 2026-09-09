# Flow — Accueil déconnecté (Kommit)

Deux frames pour le même écran : l'état de repos (01, frame canonique pour les données) et l'état survol du bouton « Créer un compte » (02).

## 01 — accueil-deconnecte-01-1-2842 (Desktop - Full)

Structure de haut en bas :

- **Header (bandeau de navigation en haut)** : le logo Kommit à gauche, et à droite deux boutons d'action côte à côte — un premier bouton (probablement "Se connecter") et un second bouton (probablement "S'inscrire" ou équivalent). Ce sont les deux seules actions proposées à un visiteur non authentifié.
- **Bloc d'accroche (juste sous le header)** : un titre d'accroche ("Prêt(e) pour ton daily standup ?") et un sous-titre descriptif expliquant la promesse du produit (suivre ses résultats jour après jour). Ce bloc sert de message d'entrée qui explique à quoi sert le produit avant même de se connecter.
- **Corps principal (zone centrale, grand rectangle arrondi)** : une large zone visuelle sous l'accroche — d'après le nom du calque ("Rectangle 2") il s'agit probablement d'un aperçu/illustration du produit ou d'un mockup, mais son contenu détaillé n'est pas décomposé dans les données structurelles disponibles pour ce node ; à confirmer visuellement.
- **Footer (bas de page)** : mention de création ("Créé par ViDev") et mention de droits réservés ("2026 Kommit. Tous droits réservés."), centrées en bas de l'écran. Le calque est nommé "Bottom Action Bar (Mobile Only)", ce qui suggère que cette barre a un rôle différent (actions) en version mobile, mais qu'ici, en desktop, elle n'affiche que les mentions légales.

## 02 — accueil-deconnecte-02-14-2358 (Desktop - Full - Option 1-A)

Même structure que 01, à deux différences près, toutes les deux dans le header :

- Le bouton « Créer un compte » est en **état survol** (`state="Hover"` dans le brut) : le dégradé bleu passe à `opacity-80`. C'est la seule information de style nouvelle de cette frame.
- Un calque **`Pointer Finger`** (node `15:16`) est posé au-dessus de ce bouton. C'est une **annotation d'interaction**, pas de l'UI : elle indique que le parcours continue par un clic sur « Créer un compte ». Il ne doit jamais être intégré (son asset, `assets-bruts/vector.svg`, ne sert donc qu'à la traçabilité).

Aucune donnée à extraire de cette frame : les textes sont identiques à 01, qui reste la frame canonique.

## Rôle dans le parcours

C'est la porte d'entrée du produit pour un visiteur anonyme : elle présente le produit et propose deux issues — se connecter (retour utilisateur existant) ou s'inscrire (nouvel utilisateur) — via les deux boutons du header. Aucun autre état ou écran n'est représenté dans ce node.
