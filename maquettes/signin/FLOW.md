# Flow — Sign in Kommit

Parcours à deux écrans (deux états successifs de la même carte "Se connecter"), avec un lien de sortie vers le signup.

## 01 — signin-01-15-185.png (node-id 15:185) : formulaire vide

Écran d'entrée sur la page de connexion.

- En-tête : logo Kommit à gauche, bouton "Créer un compte" à droite (accès direct au signup depuis la barre de navigation, sans passer par le formulaire).
- Titre de la carte : "Se connecter".
- Champ Email : vide, affichant un texte d'exemple grisé en filigrane ("jean.dev@gmail.com" à titre d'indication de format, pas une vraie valeur saisie).
- Champ Mot de passe : vide, sans contenu ni filigrane visible.
- Bouton "Me connecter" : présent mais visuellement désactivé/inactif — cohérent avec le fait qu'aucun champ n'est encore rempli.
- Lien de bas de carte : "Pas de compte ? Créer un compte maintenant." — le second segment est cliquable et renvoie vers le formulaire de création de compte (signup).
- Mention "AUTHENTIFICATION SÉCURISÉE" sous la carte (badge de confiance, statique).
- Pied de page global (copyright) identique aux autres pages du site.

## 02 — signin-02-18-347.png (node-id 18:347) : formulaire rempli, prêt à soumettre

Même écran, après saisie des identifiants par l'utilisateur.

- Champ Email : rempli avec une adresse ("marc.developpeur@gmail.com").
- Champ Mot de passe : rempli, valeur masquée par des puces (affichage classique d'un champ password).
- Bouton "Me connecter" : passe à l'état actif/plein (contraste renforcé), signalant que la soumission est possible une fois les deux champs remplis.
- Reste de l'écran identique à l'état 01 : en-tête, lien vers le signup, mention de sécurité, pied de page.

## Ce qui change entre les deux états

- Champs vides → champs remplis (email en clair, mot de passe masqué).
- Bouton "Me connecter" : inactif (champs vides) → actif (champs remplis). Aucune autre validation d'erreur n'apparaît sur ces deux frames (pas d'état "erreur" visible, seulement vide vs rempli).
- Aucune apparition/disparition d'élément de mise en page entre les deux écrans : même structure, même carte, mêmes liens.

## Lien vers le signup

Deux points de sortie identiques sur les deux écrans vers la création de compte :
1. Le bouton "Créer un compte" dans l'en-tête (accessible à tout moment, indépendamment du formulaire).
2. Le lien texte en bas de la carte : "Pas de compte ? Créer un compte maintenant." — le segment "Créer un compte maintenant" est cliquable.
