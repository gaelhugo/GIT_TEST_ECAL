let sqr = []
let nbrsqr = 30
function setup() {

    createCanvas(900, 900);

    for (let i = 0; i < nbrsqr + 2; i += 1) {
        for (let j = 0; j < nbrsqr + 2; j += 1) {
            x = i * width / nbrsqr
            y = j * height / nbrsqr
            sqr.push(new Carre(x - width / nbrsqr - (width / nbrsqr / 2),
            y - width / nbrsqr - (width / nbrsqr / 2),
            width / nbrsqr,
            height / nbrsqr))

        }
    }
}

function draw() {
    background(255,255,255,10);

    for (let i = 0; i < sqr.length; i++) {
        sqr[i].rcolor();
    }

    for (let i = 0; i < sqr.length; i++) {
        sqr[i].interaction();
    }

}
