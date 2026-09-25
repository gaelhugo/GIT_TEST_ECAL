# Étoile en mouvement — Gabriel Toneto

Adaptation animée en code de *Five Pointed Star with Color Bands* (1992) de Sol LeWitt.

## Ouvrir le projet

1. Décompresse `Etoile_en_mouvement_Gabriel.zip`.
2. Ouvre le dossier `Etoile_en_mouvement_Gabriel` dans VS Code.
3. Double-clique sur `index.html` pour l’ouvrir dans ton navigateur, ou utilise l’extension Live Server.

Aucune installation ni commande `npm` n’est nécessaire. Le projet utilise HTML, CSS et JavaScript natifs.

## Fichiers

- `index.html` : structure de la page et commandes.
- `style.css` : mise en page et affichage sur ordinateur ou téléphone.
- `script.js` : tracé et animation des étoiles dans un Canvas.
- `assets/reference_capture.jpeg` : capture de l’œuvre fournie pour la présentation.

## Ce que fait le code

`star()` dessine une étoile à cinq branches à partir de dix points alternés. `draw()` empile des étoiles colorées, de la plus grande à la plus petite. `tick()` fait croître et tourner les étoiles ; le décalage d’angle entre les bandes crée la spirale. Quand une étoile grandit vers l’extérieur, une nouvelle apparaît au centre.

Les boutons permettent de mettre l’animation en pause et de la recommencer. Les curseurs modifient la vitesse et l’intensité de la spirale.

## Présentation en quelques phrases

« J’ai choisi *Five Pointed Star with Color Bands* de Sol LeWitt. J’ai conservé l’étoile à cinq branches et les bandes de couleur, mais je les ai redessinées avec du code. J’ai ajouté une croissance continue depuis le centre, une rotation et une spirale réglable. »

Référence : https://www.sollewittprints.org/artwork/lewitt-raisonne-1992-03/
