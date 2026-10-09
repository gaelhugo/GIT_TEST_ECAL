let cols; let rows; 
let size = 20
let c = [];


function setup() {
  createCanvas(800, 800);
  cols = width/size;
  rows =height/size;
  for (let i=0; i<cols; i++){
   c[i] = [];
      for (let j=0; j<rows; j++){
        c[i][j] = color(random(256), random(256),random(0));
     }
  } 
  //print(c);
}

function draw() {
  background(220);
  for (let i=0; i<cols; i++){
    for (let j=0; j<rows; j++ ){
      fill(c[i][j]);
      rect(i*size, j*size, size, size); 
    }
  }
}

let lastI = -1;
let lastJ = -1;

function mouseMoved() {
  let i = floor(mouseX / size);
  let j = floor(mouseY / size);

  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    if (i !== lastI || j !== lastJ) {
      c[i][j] = color(random(256), random(256), random(0));
      lastI = i;
      lastJ = j;
    }
  }
}
