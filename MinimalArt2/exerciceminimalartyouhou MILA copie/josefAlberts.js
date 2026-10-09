const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

const mouseForce = 0.08;
const pushForce = 0.1;
const friction = 0.82;
const springs = { outer: 0.015, frame: 0.02, red: 0.025 };

const noiseSize = 150;
const noiseOpacity = 0.03;

let outer, frame, red, center, noisePattern;

function createNoise() {
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = noiseCanvas.height = noiseSize;
    const nctx = noiseCanvas.getContext("2d");
    const img = nctx.createImageData(noiseSize, noiseSize);

    for (let i = 0; i < img.data.length; i += 4) {
        img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.random() * 255;
        img.data[i + 3] = 255;
    }

    nctx.putImageData(img, 0, 0);
    noisePattern = ctx.createPattern(noiseCanvas, "repeat");
}

function drawNoise() {
    if (!noisePattern) return;
    ctx.save();
    ctx.globalAlpha = noiseOpacity;
    ctx.fillStyle = noisePattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function makeSquare(size, yDivider) {
    const x = (canvas.width - size) / 2;
    const y = (canvas.height - size) / yDivider;
    return { x, y, size, homeX: x, homeY: y, vx: 0, vy: 0 };
}

function createSquares() {
    const { width: w, height: h } = canvas;
    const margin = Math.min(w, h) * 0.015;
    const outerSize = Math.min(w, h) - margin * 2;
    const frameSize = outerSize * 0.78;
    const redSize = frameSize * 0.72;
    const centerSize = redSize * 0.67;

    outer = makeSquare(outerSize, 2);
    frame = makeSquare(frameSize, 1.5);
    red = makeSquare(redSize, 1.4);
    center = makeSquare(centerSize, 1.4);

    mouse.x = center.x + center.size / 2;
    mouse.y = center.y + center.size / 2;
}

function updateCenter() {
    center.vx += (mouse.x - center.size / 2 - center.x) * mouseForce;
    center.vy += (mouse.y - center.size / 2 - center.y) * mouseForce;
    center.vx *= 0.8;
    center.vy *= 0.8;
    center.x += center.vx;
    center.y += center.vy;
}

function updateSquare(s, spring) {
    s.vx += (s.homeX - s.x) * spring;
    s.vy += (s.homeY - s.y) * spring;
    s.vx *= friction;
    s.vy *= friction;
    s.x += s.vx;
    s.y += s.vy;
}

function constrainAndPush(child, parent) {
    for (const [a, v] of [["x", "vx"], ["y", "vy"]]) {
        const min = parent[a];
        const max = parent[a] + parent.size - child.size;

        if (child[a] < min) {
            child[a] = min;
            parent[v] -= Math.max(0, -child[v]) * pushForce;
        } else if (child[a] > max) {
            child[a] = max;
            parent[v] += Math.max(0, child[v]) * pushForce;
        }
    }
}

function constrainInsideScreen() {
    for (const [a, v, limit] of [["x", "vx", canvas.width], ["y", "vy", canvas.height]]) {
        const max = limit - outer.size;
        if (outer[a] < 0 || outer[a] > max) {
            outer[a] = Math.min(Math.max(outer[a], 0), max);
            outer[v] = 0;
        }
    }
}

function updatePhysics() {
    updateCenter();
    constrainAndPush(center, red);

    updateSquare(red, springs.red);
    constrainAndPush(red, frame);

    updateSquare(frame, springs.frame);
    constrainAndPush(frame, outer);

    updateSquare(outer, springs.outer);
    constrainInsideScreen();
}

function draw() {
    ctx.fillStyle = "#DCBD9C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#634A24";
    ctx.fillRect(outer.x, outer.y, outer.size, outer.size);

    ctx.strokeStyle = "#DCBD9C";
    ctx.lineWidth = 2;
    ctx.strokeRect(frame.x, frame.y, frame.size, frame.size);

    ctx.fillStyle = "#733F29";
    ctx.fillRect(red.x, red.y, red.size, red.size);

    ctx.fillStyle = "#6E2E20";
    ctx.fillRect(center.x, center.y, center.size, center.size);

    drawNoise();
}

function animate() {
    updatePhysics();
    draw();
    requestAnimationFrame(animate);
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createSquares();
    createNoise();
}

window.addEventListener("resize", resize);

resize();
animate();