class Carre {

    constructor(x, y, h, w,) {

        this.x = x
        this.y = y
        this.h = h
        this.w = w
        this.listcolor =
        [color(213, 47, 31),
        color(46, 115, 210), color(46, 115, 210),
        color(202, 40, 17), color(231, 63, 18),
        color(72, 142, 116)] 

        this.color = random(this.listcolor)
        this.epaisseur = 9

        this.mouseX = mouseX
        this.mouseY = mouseY
        this.d = dist(this.mouseX, this.mouseY, this.x, this.y)

    }

    rcolor() {
 

        fill(this.color)
        stroke(0)
        strokeWeight(this.epaisseur)
        rect(this.x, this.y, this.w, this.h);


    }

    interaction() {


        if( mouseIsPressed == true ){
            let d = dist(mouseX, mouseY, this.x, this.y);
            if (d < 100){

                this.x = this.x + random(-3, 3)
                this.y = this.y + random(-3, 3)              
                rect(this.x, this.y, this.w, this.h);
                fill("yellow")
                stroke("yellow")
                strokeWeight(this.epaisseur)

            }else{
                fill(this.color)
                stroke(0)
                strokeWeight(this.epaisseur)
                rect(this.x, this.y, this.w, this.h);


            }

        }


    }

}