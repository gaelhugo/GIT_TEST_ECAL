import './style.css'
import p5 from 'p5';
import { myDot } from './dot';



let quarterSize = 300;
let startPivotPoint = {x: -quarterSize,y: -quarterSize};
let endPivotPoint = {x: 0,y: 0};

let dots = [];
let scrollValue = 0;

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    for (let i = 0; i < 26; i++) {
      let angle = p.map(i, 0, 25, 0, p.HALF_PI);
      dots.push(new myDot(
        p,
        quarterSize * p.cos(angle - quarterSize),
        quarterSize * p.sin(angle - quarterSize)
      )
      );
    };
  };

  p.mouseWheel = (event) => {
    scrollValue += event.delta / 60;
  };

  const drawQuarter = () => {
    p.drawingContext.save();
    p.drawingContext.beginPath();
    p.drawingContext.roundRect(-quarterSize, -quarterSize, quarterSize, quarterSize, [quarterSize/10, 0, quarterSize/10, 0]); // les strokes
    p.drawingContext.stroke();
    p.drawingContext.clip();

    // Rectangle
    let gradientRect = p.drawingContext.createConicGradient(p.PI, 0, 0);
    gradientRect.addColorStop(0, 'rgba(30,30,40)');
    gradientRect.addColorStop(0.1, 'lightgrey');
    gradientRect.addColorStop(0.2, 'rgba(40,40,55)');
    gradientRect.addColorStop(0.28, 'lightgrey');
    p.drawingContext.fillStyle = gradientRect;
    p.rect(-quarterSize, -quarterSize, quarterSize, quarterSize);

    // Arc
    let gradientArc = p.drawingContext.createConicGradient(p.PI * 2, -quarterSize, -quarterSize);
    gradientArc.addColorStop(0, 'rgba(30,30,40)');
    gradientArc.addColorStop(0.1, 'lightgrey');
    gradientArc.addColorStop(0.2, 'rgba(30,30,40)');
    gradientArc.addColorStop(0.28, 'lightgrey');
    p.drawingContext.fillStyle = gradientArc;
    p.arc(-quarterSize,-quarterSize, quarterSize * 2,quarterSize * 2,0,p.PI + p.HALF_PI);



    for (let i = 0; i < dots.length - 1; i++) {
      let index = ((i + scrollValue) % 25 + 25) % 25;
      let angle = p.map(index, 0, 25, 0, p.HALF_PI);
      dots[i].x = quarterSize * p.cos(angle) - quarterSize;
      dots[i].y = quarterSize * p.sin(angle) - quarterSize;

      dots[i].display();



      p.line(startPivotPoint.x, startPivotPoint.y, dots[i].x, dots[i].y);
      p.line(endPivotPoint.x, endPivotPoint.y, dots[i].x, dots[i].y);

    }
    p.drawingContext.restore();
  }


  p.draw = () => {
    p.background(220);
    p.translate(p.windowWidth / 2, p.windowHeight / 2);
    for (let i = 0; i < 4; i++) {
      if (i == 1 || i == 3) {
        p.push();
        p.translate(quarterSize, quarterSize);
      }

      drawQuarter();
      p.pop();
      p.rotate(p.HALF_PI)
    };
  };
};

new p5(sketch);
