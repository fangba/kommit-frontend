# Flow — Sign up (création de compte)

Source Figma : fileKey `gxIzB1SWVwxww58hjYOcNi`

Les 4 frames représentent le **même écran** (formulaire de création de compte), à 4 états successifs du remplissage/validation. Ce n'est pas une succession d'écrans différents mais un seul formulaire dont l'état change selon ce que l'utilisateur a saisi.

## Écran commun aux 4 états

- Barre de navigation en haut : logo Kommit à gauche, bouton "Se connecter" à droite (permet de rejoindre le flow de connexion si l'utilisateur a déjà un compte).
- Titre de page au-dessus de la carte du formulaire (zone "Title", contenu non détaillé dans les métadonnées, à vérifier au code brut).
- Carte "Créer un compte" centrée, contenant :
  - Champ **Prénom** (obligatoire)
  - Champ **Email** (obligatoire, avec exemple de saisie en placeholder)
  - Champ **Mot de passe** (obligatoire)
  - Bouton principal **"Créer un compte"**
  - Lien secondaire "Tu as déjà un compte ? Connecte-toi." (renvoie vers le flow de connexion)
  - Mention "Authentification sécurisée" sous la carte
- Pied de page avec mention de copyright.

## Séquence 01 — node 15:24 — État initial (formulaire vide)

Tous les champs sont vides (placeholders visibles, dont un exemple d'email). Le bouton "Créer un compte" est affiché dans un état visuellement atténué (non activement disponible), cohérent avec un formulaire pas encore rempli. C'est l'écran que voit l'utilisateur en arrivant sur la page de création de compte.

**Transition vers l'état suivant** : l'utilisateur commence à saisir ses informations dans les champs.

## Séquence 02 — node 15:480 — Formulaire rempli, en cours de saisie

Les trois champs sont renseignés (prénom, email, mot de passe partiellement saisi — un mot de passe court est en cours de frappe). Le bouton "Créer un compte" passe dans un état actif/plein, différent de l'état atténué de la séquence 01. Aucun message d'erreur n'est affiché à ce stade.

**Transition vers l'état suivant** : l'utilisateur valide le formulaire (ou quitte le champ mot de passe) alors que le mot de passe ne respecte pas la règle de longueur minimale, ce qui déclenche l'état d'erreur suivant.

## Séquence 03 — node 16:75 — État d'erreur de validation

Mêmes valeurs que la séquence précédente (prénom et email inchangés), mais le champ **Mot de passe** est mis en évidence comme invalide et un message d'erreur apparaît sous le champ : le mot de passe doit contenir au moins 8 caractères. Le bouton "Créer un compte" reste affiché mais la soumission est bloquée par cette erreur de validation. C'est un état de feedback, pas une nouvelle étape du parcours.

**Transition vers l'état suivant** : l'utilisateur corrige son mot de passe en le complétant jusqu'à la longueur minimale requise, ce qui fait disparaître l'erreur.

## Séquence 04 — node 18:421 — Formulaire valide, prêt à soumettre

Prénom et email inchangés, le champ mot de passe contient maintenant une saisie plus longue respectant la règle de validation — le message d'erreur a disparu et le champ n'est plus signalé comme invalide. Le bouton "Créer un compte" est dans son état actif. C'est l'état juste avant la soumission réussie du formulaire (l'écran de résultat après soumission — succès ou redirection — n'est pas inclus dans ces 4 frames).

## Résumé du parcours

1. Arrivée sur le formulaire vide (01).
2. Saisie des champs par l'utilisateur (02) — bouton devient actif.
3. Si le mot de passe est trop court : affichage d'une erreur de validation sous le champ (03).
4. Correction du mot de passe jusqu'à la longueur requise : l'erreur disparaît, le formulaire est valide et prêt à être soumis (04).

Les 4 frames documentent donc un seul écran de formulaire et son cycle de validation du mot de passe, pas 4 pages distinctes. La suite du parcours (écran de succès, redirection après création de compte, ou lien vers "Se connecter") n'est pas couverte par ces frames.
