function setup () {
  createCanvas (windowWidth, windowHeight);
}

function draw () {
  background ('white');

  for (let i = 100; i > 0; i -= 3) {
    let sizeCircle = i * 10;

    circle (mouseX, mouseY * 1.02, sizeCircle * 1.02);
    fill ('white');
    circle (mouseX, mouseY, sizeCircle);
    fill ('black');
  }
}

function windowResized () {
  resizeCanvas (windowWidth, windowHeight);
}
