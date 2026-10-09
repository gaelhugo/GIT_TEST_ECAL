const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let circleRadiusScale = 1.4;
let colorsInverted = false;
const minCircleRadiusScale = 0.6;

function draw() {
  const pixelRatio = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();

  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  context.fillStyle = colorsInverted ? "#f8f8f8" : "#08080a";
  context.fillRect(0, 0, width, height);

  const gap = 1;
  const baseline = height * 0.615 + gap;
  const circleX = width * 0.4;
  const radius = width * circleRadiusScale;
  const circleY = baseline - radius - gap;
  const leftAngle = Math.atan2(
    Math.sqrt(radius ** 2 - circleX ** 2),
    -circleX,
  );
  const rightDistance = width - circleX;
  const rightAngle = Math.atan2(
    Math.sqrt(radius ** 2 - rightDistance ** 2),
    rightDistance,
  );

  context.beginPath();
  context.arc(circleX, circleY, radius, leftAngle, rightAngle, true);
  context.lineTo(width, baseline);
  context.lineTo(0, baseline);
  context.closePath();

  context.fillStyle = colorsInverted ? "#08080a" : "#f8f8f8";
  context.fill();
}

canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const nextRadiusScale = Math.max(
      minCircleRadiusScale,
      Math.min(20, circleRadiusScale + Math.sign(event.deltaY) * 0.08),
    );
    if (
      circleRadiusScale > minCircleRadiusScale &&
      nextRadiusScale === minCircleRadiusScale
    ) {
      colorsInverted = !colorsInverted;
    }
    circleRadiusScale = nextRadiusScale;
    draw();
  },
  { passive: false },
);

draw();
window.addEventListener("resize", draw);
