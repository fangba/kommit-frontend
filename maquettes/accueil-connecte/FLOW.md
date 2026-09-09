# Flow — Accueil connecté (Kommit)

Trois frames pour le même écran : l'état de repos sans toast (01, frame canonique pour les données), l'état avec toast d'arrivée après inscription (02), et l'état avec toast d'arrivée après connexion (03).

## 01 — accueil-connecte-01-18-510 (état de repos, sans toast)

Structure de haut en bas :

- **Navbar (bandeau de navigation en haut)** : le logo Kommit à gauche, et à droite un unique bouton « Se déconnecter » (avec une icône de sortie). Contrairement à l'accueil déconnecté qui propose deux actions (se connecter / s'inscrire), l'utilisateur connecté n'a qu'une seule action possible dans la navbar : se déconnecter.
- **Greeting personnalisé** : un titre qui salue l'utilisateur par son prénom — « Quoi de neuf aujourd'hui, **Marc** ? » — le prénom étant mis en évidence par rapport au reste du titre. En dessous, un sous-titre d'instruction : « Renseigne ton daily du jour ci-dessous. »
- **Zone centrale de saisie du daily** : présente sous le sous-titre, occupe le corps de la page. **Hors périmètre pour ce ticket** (couverte par une autre US) — sa présence est juste signalée ici, son contenu n'est pas détaillé.
- **Footer (bas de page)** : identique à l'accueil déconnecté — mention de création (« Créé par ViDev ») et mention de droits réservés (« 2026 Kommit. Tous droits réservés. »).

Aucun toast n'est affiché dans cette frame : c'est l'état de repos, quand l'utilisateur revient sur la page sans venir de connexion/inscription (ex. navigation interne, rafraîchissement).

## 02 — accueil-connecte-02-17-199 (toast d'arrivée après inscription)

Même structure que 01, avec en plus un toast affiché en haut à droite, superposé au-dessus du contenu :

- Une icône de succès (coche dans un cercle).
- Le message : **« Bienvenue Marc, ton compte est créé. »**
- Un bouton de fermeture (croix) à droite du message, permettant de faire disparaître le toast manuellement.

Ce toast apparaît uniquement quand l'utilisateur arrive sur l'accueil connecté juste après avoir créé son compte (juste après le flow d'inscription).

## 03 — accueil-connecte-03-18-477 (toast d'arrivée après connexion)

Même structure que 01, avec un toast similaire à celui de 02 mais avec un message différent :

- Même icône de succès.
- Le message : **« Content de te revoir Marc »** (pas de point final, contrairement au message d'inscription).
- Même bouton de fermeture (croix).

Ce toast apparaît uniquement quand l'utilisateur arrive sur l'accueil connecté juste après s'être connecté avec un compte existant (juste après le flow de connexion). Les deux toasts (02 et 03) ne peuvent jamais être affichés en même temps : ils correspondent à deux origines distinctes du même écran d'arrivée.

## Interaction de déconnexion

Le bouton « Se déconnecter » de la navbar (présent dans les trois frames, sans changement d'état visuel entre elles) déclenche la déconnexion : un clic dessus ramène l'utilisateur vers l'accueil déconnecté (cf. `maquettes/accueil-deconnecte/FLOW.md`). Aucune confirmation intermédiaire n'est représentée dans ces frames : le clic semble entraîner un retour direct à l'accueil déconnecté.

## Rôle dans le parcours

C'est l'écran d'accueil pour un utilisateur déjà authentifié. Il sert deux buts : afficher un message de bienvenue contextualisé (toast temporaire selon l'origine — inscription ou connexion — puis disparition, ou aucun toast si retour hors flow d'authentification) et donner accès à la zone de saisie du daily (hors périmètre ici) ainsi qu'à la déconnexion.
