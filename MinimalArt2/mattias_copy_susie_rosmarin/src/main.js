import p5 from "p5";

let c1 = [246, 246, 246];
let c2 = [55, 60, 60];

const sketch = (p) => {
  let frameSize = Math.min(p.windowWidth, p.windowHeight) - 100;
  let cubeSize = frameSize / 1.98;
  let cubeCols = 10;
  let cubeRows = 10;
  let grainLayer;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);

    grainLayer = p.createGraphics(p.windowWidth, p.windowHeight);
    granulateSimple(grainLayer, 200, true);
  };

  const frame = () => {
    p.rect(0, 0, frameSize, frameSize);
  };

  const cube = () => {
    p.noStroke();
    for (let i = 0; i < cubeCols; i++) {
      const T = i / (cubeCols - 1);
      const R = c1[0] + (c2[0] - c1[0]) * T;
      const G = c1[1] + (c2[1] - c1[1]) * T;
      const B = c1[2] + (c2[2] - c1[2]) * T;
      p.fill(R, G, B);
      p.rect((cubeSize / cubeCols) * i, 0, cubeSize / cubeCols, cubeSize);
    }

    for (let x = 0; x < cubeCols; x++) {
      for (let y = 0; y < cubeRows; y++) {
        const T = 1 - y / (cubeRows - 1);
        const R = c1[0] + (c2[0] - c1[0]) * T;
        const G = c1[1] + (c2[1] - c1[1]) * T;
        const B = c1[2] + (c2[2] - c1[2]) * T;
        p.fill(R, G, B);
        p.rect(
          (cubeSize / cubeCols) * x + cubeSize / cubeCols / 2,
          (cubeSize / cubeRows) * y,
          cubeSize / cubeCols / 2,
          cubeSize / cubeRows,
        );
      }
    }
  };

  const granulateSimple = (target, amount, applyAlpha = true) => {
    target.loadPixels();
    const d = target.pixelDensity();
    const totalValues = 4 * (target.width * d) * (target.height * d);

    for (let i = 0; i < totalValues; i += 4) {
      const grainAmount = Math.floor(Math.random() * (2 * amount + 1)) - amount;

      target.pixels[i] += grainAmount; // R
      target.pixels[i + 1] += grainAmount; // G
      target.pixels[i + 2] += grainAmount; // B

      if (applyAlpha) {
        target.pixels[i + 3] += grainAmount;
      } else {
        // Donne une opacité partielle si le calque était transparent au départ
        target.pixels[i + 3] = 30;
      }
    }

    target.updatePixels();
  };

  p.mouseMoved = () => {
    cubeCols = p.floor(p.constrain(p.map(p.mouseX, 100, p.windowWidth - 100, 2, 20),2,20));
    cubeRows = p.floor(p.constrain(p.map(p.mouseY, 100, p.windowHeight - 100, 2, 20), 2, 20));
  }

  p.draw = () => {
    p.background(255);

    p.push();
    p.translate(p.width / 2 - frameSize / 2, p.height / 2 - frameSize / 2);
    p.clip(frame);

    //p.translate(-cubeSize * 0.75 * Math.sqrt(2), frameSize / 2 );
    p.translate(frameSize / 2 - cubeSize * 1.5 * Math.sqrt(2), frameSize / 2);
    p.rotate(-45);
    for (let x = 0; x < 3; x++) {
      if (x > 0) {
        p.translate(0, cubeSize);
      }
      p.push();
      for (let y = 0; y < 3; y++) {
        cube();

        p.translate(cubeSize, 0);
      }
      p.pop();
    }
    p.pop();
    p.blendMode(p.OVERLAY);
    p.image(grainLayer, 0, 0);
    p.blendMode(p.BLEND);
  };
};

new p5(sketch);
