
let numRows = 38;  
let numCols = 69;

let influence =135; // distance of the mouse influence on the squares and rectangles

function setup() {
    createCanvas(windowWidth, windowHeight);
}


function draw() {
    background(140, 137, 135);

    squares();
    rectangles();
}


function squares(){
    let c = color(0);
    fill(c);
    strokeWeight(0);

    for (let x=0.1; x<numCols; x++){          // x & y = position of square on canvas -> 0, 0.3, -0.1, etc... = minor adjustments to the position
        
        for (let y=0.3; y<numRows; y++){  

                                                    // INSIDE 2ND FOR LOOP: Check if mouse is within the influence area of squares 
            if (mouseX > x * 22 - influence         
                && mouseX < x * 22 + influence      // mouseX = position of mouse on X axis of canvas 
                && mouseY > y * 22 - influence 
                && mouseY < y * 22 + influence){    // mouseY = position of mouse on Y axis of canvas 
                fill(255);
                } else {
                fill(0);
            } 
            
            square(x*22, y*22, 13);         // x*22 = distance between squares | y*22 = distance between squares | 13 = size of the square
  
        }
    }   
}

function rectangles(){
    let c = color(255);
    fill(c);
    strokeWeight(0.1);

    for (let x=0.08; x<numCols; x++){
        for (let y=-0.1; y<numRows; y++){

                                                    // INSIDE 2ND FOR LOOP:Check if mouse is within the influence area of rectangles
            if (mouseX > x * 22 - influence 
                && mouseX < x * 22 + influence 
                && mouseY > y * 22 - influence 
                && mouseY < y * 22 + influence){    
                fill(0);
                } else {
                fill(255);
            } 

            rect(x*22, y*22, 7.4, 15);      // x*22 = distance between rectangles | y*22 = distance between rectangles | 7.2 = width of the rectangle | 15 = height of the rectangle
        }
    }
}


// Forces the canvas to resize dynamically if the window changes size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}