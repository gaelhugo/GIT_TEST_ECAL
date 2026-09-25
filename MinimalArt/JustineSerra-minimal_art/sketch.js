const PARTICLE_SIZE = 2.5;
const MAX_FORCE = 10;
const MIN_FORCE = 0;

let particles = [];

function setup() {
    createCanvas(windowWidth-20, windowHeight-20);
    /*
    canvasNumRows =25;
    canvasNumCols=25;
    numCircles = 625;
    */
 
    circles();
}

function draw() {
    background(245, 245,235); // only one color = grey scale | 3 colors = RGB | 4th color = opacity
    

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    })
}    


function circles(){
    let c = color(0);
    fill(c);

    for (x=10; x<windowWidth-20; x+=32){
        for (y=10; y<windowHeight-20; y+=32){
             particles.push(new Particle(x, y, 0));
        }
    }
}

class Particle {
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.targetX = x;
        this.targetY = y;
    }

    update(){
        // get verctors for mouse, target, and current position
        let mouseVector = createVector(mouseX, mouseY);
        let currentVector = createVector(this.x, this.y);
        let targetVector = createVector(this.targetX, this.targetY);

        // calculate vector from mouse to particle and its magnitude (distance)
        let fromMouseToParticle = p5.Vector.sub(currentVector, mouseVector);
        let distanceToMouse = fromMouseToParticle.mag();

        // calculate vector from particle to target and its magnitude (distance)
        let fromParticleToTarget = p5.Vector.sub(targetVector, currentVector);
        let distanceToTarget = fromParticleToTarget.mag();

        let totalForce = createVector(0, 0);

        // if mouse is within 100px, calculate a repulsive force
        if (distanceToMouse < 100){
            let repulsionForce = map(distanceToMouse, 0, 100, MAX_FORCE, MIN_FORCE);

            fromMouseToParticle.setMag(repulsionForce);
            totalForce.add(fromMouseToParticle);
        }

        // if particle is not at target, calculate an attractive force
         if (distanceToMouse > 0){
            let attractionForce = map(distanceToTarget, 0, 100, MIN_FORCE, MAX_FORCE);

            fromParticleToTarget.setMag(attractionForce);
            totalForce.add(fromParticleToTarget);
        }

        // add the force to the position
        this.x += totalForce.x;
        this.y += totalForce.y;

    }

    draw(){
        fill(this.color);
        noStroke();
        circle(this.x, this.y, PARTICLE_SIZE);
    }
}