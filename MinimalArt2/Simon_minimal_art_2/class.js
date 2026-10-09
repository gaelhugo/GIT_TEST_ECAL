class Serpentin {

    constructor(x, ystart, yend, longueur, step, weight, color, pixel) {

        this.x = x
        this.ystart = ystart
        this.yend = yend
        this.longueur = longueur
        this.step = step
        this.weight = weight
        this.color = color
        this.pixel = pixel
        this.weightBase = weight
        this.longueurBase = longueur

    }

    dessiner() {

        let largeur = (this.yend - this.ystart) / (this.step * 2 - 2)
        let y = this.ystart   // copie locale : this.ystart ne doit pas changer d'une image à l'autre

        strokeCap(PROJECT)
        strokeWeight(this.weight)
        stroke(this.color)

        for (let i = 0; i < this.step; i++) {
            line(this.x, y, this.x + this.longueur, y)
            line(this.x + this.longueur, y, this.x + this.longueur, y + largeur)
            y += largeur
            line(this.x + this.longueur, y, this.x, y)
            line(this.x, y, this.x, y + largeur)
            y += largeur
        }

    }

    mouseOver() {
        if (mouseX > this.x && mouseX < this.x + this.longueur && mouseY > this.ystart && mouseY < this.yend) {

            this.weight = this.weightBase * (1 + 0.999 * sin(frameCount * 0.04))

        } else {

            this.weight = constrain(this.weight, 2, 30)
            this.weightBase = this.weight

        }
    }
}