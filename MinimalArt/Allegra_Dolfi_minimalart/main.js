// Palette modifiable : garde 4 couleurs foncées, puis 4 couleurs claires.
// Associer une couleur de chaque groupe permet de bien voir les formes.
const colors = [
    "#dd0b0b", "#ab14ec", "#16d816", "#df690f",
    "#630e52", "#0d6e45", "#06425a", "#e3a41a",
];

let cells = [];
let columns;
let rows;
let cellWidth;
let cellHeight;
let hoveredIndex = -1; // -1 signifie qu'aucune case n'est survolée.
let ctx;

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    ctx = drawingContext; // Le contexte Canvas 2D fourni par p5.js.
    createGrid();

    // Rien ne bouge tout seul : on redessine uniquement lorsque c'est utile.
    noLoop();

    canvas.elt.addEventListener("mouseleave", function () {
        hoveredIndex = -1;
        redraw();
    });
}

function createGrid() {
    // Des cases proches de 110 pixels, réparties sur tout l'écran.
    columns = Math.max(1, Math.round(width / 110));
    rows = Math.max(1, Math.round(height / 110));
    cellWidth = width / columns;
    cellHeight = height / rows;

    for (let index = 0; index < columns * rows; index++) {
        // Au redimensionnement, les couleurs déjà choisies restent stables.
        if (!cells[index]) {
            const dark = Math.floor(random(4));
            const light = 4 + Math.floor(random(4));
            const darkBackground = random() < 0.5;

            // On choisit deux autres couleurs, toujours une foncée et une claire.
            const hoverDark = (dark + 1) % 4;
            const hoverLight = 4 + (light - 4 + 1) % 4;

            cells[index] = {
                backgroundColor: colors[darkBackground ? dark : light],
                shapeColor: colors[darkBackground ? light : dark],
                hoverBackgroundColor: colors[darkBackground ? hoverDark : hoverLight],
                hoverShapeColor: colors[darkBackground ? hoverLight : hoverDark],
                size: random(0.45, 0.8),
            };
        }

        const column = index % columns;
        const row = Math.floor(index / columns);
        // On alterne les cercles et les carrés comme sur un damier.
        cells[index].shape = (column + row) % 2 === 0 ? "circle" : "square";
    }
}

function draw() {
    for (let index = 0; index < columns * rows; index++) {
        drawCell(cells[index], index);
    }
}

function drawCell(cell, index) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    // Arrondir les limites évite les petits espaces entre les fonds.
    const x = Math.round(column * cellWidth);
    const y = Math.round(row * cellHeight);
    const w = Math.round((column + 1) * cellWidth) - x;
    const h = Math.round((row + 1) * cellHeight) - y;
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const size = Math.min(w, h) * cell.size;

    // Si cette case est survolée, on utilise les couleurs alternatives.
    const isHovered = index === hoveredIndex;
    ctx.fillStyle = isHovered ? cell.hoverBackgroundColor : cell.backgroundColor;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = isHovered ? cell.hoverShapeColor : cell.shapeColor;

    if (cell.shape === "circle") {
        // Dessine un cercle au centre de la case.
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Dessine un carré au centre de la case.
        ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
    }
}

function getHoveredCell() {
    if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) {
        return -1;
    }

    // Calcule la colonne et la ligne dans lesquelles se trouve la souris.
    const column = Math.floor(mouseX / cellWidth);
    const row = Math.floor(mouseY / cellHeight);

    // On récupère l'index de la case correspondante.
    return row * columns + column;
}

function handleMouseMove() {
    const nextIndex = getHoveredCell();
    if (nextIndex !== hoveredIndex) {
        hoveredIndex = nextIndex;
        // Toute la grille est redessinée : la case précédente retrouve ses couleurs.
        redraw();
    }
}

// p5.js met mouseX et mouseY à jour avant d'appeler ces fonctions.
function mouseMoved() {
    handleMouseMove();
}

function mouseDragged() {
    handleMouseMove();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
    createGrid();
    if (hoveredIndex !== -1) {
        hoveredIndex = getHoveredCell();
    }
    redraw();
}
