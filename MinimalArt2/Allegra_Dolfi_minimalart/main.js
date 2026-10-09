// Modifiez ici le nombre de cercles, l'epaisseur et l'espacement.
const NUMBER_OF_CIRCLES = 30;
const CIRCLE_SPACING = 0.95 / NUMBER_OF_CIRCLES;

// Modifiez ici les couleurs de la premiere palette et les palettes suivantes.
const BLACK = "#0a0505";
const RED = "#bb0709";
const DARK_RED = "#4d050b";
const palettes = [
    [RED, DARK_RED],
    ["#0066FF", "#001B55"],
    ["#FF7A00", "#7A2500"],
    ["#00A878", "#004C3F"]
];

let currentPalette = 0;

function setup() {
    const canvasSize = min(windowWidth, windowHeight);
    createCanvas(canvasSize, canvasSize);
    noLoop();
}

function draw() {
    background(255);

    const spacing = min(width, height) * CIRCLE_SPACING;
    const palette = palettes[currentPalette];

    noStroke();
    for (let distanceFromOutside = 0; distanceFromOutside < NUMBER_OF_CIRCLES; distanceFromOutside++) {
        if (distanceFromOutside % 2 === 0) {
            fill(BLACK);
        } else if (Math.floor(distanceFromOutside / 2) % 2 === 0) {
            fill(palette[1]);
        } else {
            fill(palette[0]);
        }

        const diameter = spacing * (NUMBER_OF_CIRCLES + 1 - distanceFromOutside);
        circle(width / 2, height / 2, diameter);
    }

    fill(BLACK);
    circle(width / 2, height / 2, spacing);
}

function mousePressed() {
    currentPalette = (currentPalette + 1) % palettes.length;
    redraw();
}

function windowResized() {
    const canvasSize = min(windowWidth, windowHeight);
    resizeCanvas(canvasSize, canvasSize);
    redraw();
}
