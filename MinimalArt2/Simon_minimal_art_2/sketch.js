let widthcadre = 15 / 2
let serpentins = []
let taillePixel = 2.1

function setup() {

    createCanvas(1790 / 2, 1790 / 2);

    let epaisseur

    epaisseur = 30 / 2
    serpentins.push(new Serpentin(widthcadre + epaisseur / 2, widthcadre + epaisseur / 2 - 4, width - epaisseur - 2 + 3, 209 / 2, 13, epaisseur, 'rgba(25, 25, 25)'))

    epaisseur = 2
    serpentins.push(new Serpentin(283 / 2, 0, width + 45 / 2, 195 / 2, 22, epaisseur, 'rgba(26, 28, 26)'))

    epaisseur = 42 / 2
    serpentins.push(new Serpentin(530 / 2, 0 + epaisseur / 2 - 6, width - epaisseur / 2 - 30, 212 / 2, 13, epaisseur, 'rgba(26, 28, 26)'))

    epaisseur = 29 / 2
    serpentins.push(new Serpentin(807 / 2, 0 - epaisseur / 2 - epaisseur / 2, width - epaisseur / 2 - 39, 308 / 2, 13, epaisseur, 'rgba(26, 28, 26)'))

    epaisseur = 42 / 2
    serpentins.push(new Serpentin(1177 / 2, 0 - 40, width - 18, 242 / 2, 9, epaisseur, 'rgba(26, 28, 26)'))

    epaisseur = 28 / 2
    serpentins.push(new Serpentin(1485 / 2, 0 - 56, width - 33, 276 / 2, 10, epaisseur, 'rgba(26, 28, 26)'))

}

function cadre() {
    fill(('rgba(212, 212, 212)'));

    noStroke();
    rect(0, 0, width, widthcadre);
    rect(0, (width - widthcadre), width, widthcadre);
    rect(0, 0, widthcadre, height);
    rect(width - widthcadre, 0, widthcadre, height);
}

function draw() {

    background(('rgba(212, 212, 212)'));

    for (let i = 0; i < serpentins.length; i++) {
        serpentins[i].dessiner();
    }

    for (let i = 0; i < serpentins.length; i++) {
        serpentins[i].mouseOver();
    }

    cadre()
    // Pixelisation : on réduit l'image puis on la ré-agrandit
    // Pixelisation : on réduit l'image puis on la ré-agrandit
    let img = get()
    img.resize((width / taillePixel), height / taillePixel)

 
    img.loadPixels()

    img.updatePixels()

    image(img, 0, 0, width, height)
    // stroke('red')
    // strokeWeight(6)
    // line(0, height / 2, width, height / 2)

}