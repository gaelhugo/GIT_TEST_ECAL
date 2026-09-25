function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    let rows = 20;
    let cellHeight = height / rows;
    let x = 0;
    let col = 0;

    while (x < width) { // Сolonnes
        let distance = abs(mouseX - x) / width;
        let cellWidth = 4 + distance * 40;

        for (let row = 0; row < rows; row++) { // Lignes
            if ((row + col) % 2 == 0) {
                fill("black");
            }
            else {
                fill("white");
            }
            rect(x, row * cellHeight, cellWidth, cellHeight);
        }
        x += cellWidth;
        col++;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}