const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

const grandX = 50;
const grandY = 50;
const grandTaille = 700;

const bleu = "#1932be";

const bandes = 20;
const largeurBande = grandTaille / bandes;

const nombreRonds = 20;
const espaceRonds = grandTaille / nombreRonds;
const rayonRond = 15;

const nombreCasesCentre = 10;

const petitTaille =
    espaceRonds * nombreCasesCentre;

const petitX =
    grandX +
    (grandTaille - petitTaille) / 2;

const petitY =
    grandY +
    (grandTaille - petitTaille) / 2;

const bandesCentre = 10;
const hauteurCentre =
    petitTaille / bandesCentre;

const nombreCarres = 10;

const espaceCarres =
    petitTaille / nombreCarres;

const tailleCarre = 30;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener("mousemove", (event) => {

    const rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    dessiner();
});


function dessiner() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const decalageGrand =
        (mouseX / canvas.width) * bandes;

    for (let i = 0; i < bandes; i++) {

        let position =
            (i + decalageGrand) % bandes;

        // Évite les valeurs négatives
        if (position < 0) {
            position += bandes;
        }

        const gris = Math.round(
            50 +
            (255 - 50) *
            (position / (bandes - 1))
        );

        ctx.fillStyle =
            `rgb(${gris}, ${gris}, ${gris})`;

        ctx.fillRect(
            grandX + i * largeurBande,
            grandY,
            largeurBande + 1,
            grandTaille
        );
    }

    ctx.fillStyle = bleu;

    for (let ligne = 0; ligne < nombreRonds; ligne++) {

        for (let colonne = 0; colonne < nombreRonds; colonne++) {

            const x =
                grandX +
                colonne * espaceRonds +
                espaceRonds / 2;

            const y =
                grandY +
                ligne * espaceRonds +
                espaceRonds / 2;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                rayonRond,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }

    const decalagePetit =
        (mouseY / canvas.height) * bandesCentre;

    for (let i = 0; i < bandesCentre; i++) {

        let position =
            (i + decalagePetit) % bandesCentre;

        if (position < 0) {
            position += bandesCentre;
        }

        const gris = Math.round(
            60 +
            (255 - 60) *
            (position / (bandesCentre - 1))
        );

        ctx.fillStyle =
            `rgb(${gris}, ${gris}, ${gris})`;

        ctx.fillRect(
            petitX,
            petitY + i * hauteurCentre,
            petitTaille,
            hauteurCentre + 1
        );
    }

    ctx.fillStyle = bleu;

    for (let ligne = 0; ligne < nombreCarres; ligne++) {

        for (let colonne = 0; colonne < nombreCarres; colonne++) {

            const x =
                petitX +
                colonne * espaceCarres +
                (espaceCarres - tailleCarre) / 2;

            const y =
                petitY +
                ligne * espaceCarres +
                (espaceCarres - tailleCarre) / 2;

            ctx.fillRect(
                x,
                y,
                tailleCarre,
                tailleCarre
            );
        }
    }
}


dessiner();
