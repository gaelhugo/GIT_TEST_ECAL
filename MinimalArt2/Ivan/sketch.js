const CANVAS_W = 2400;
const CANVAS_H = 1640;

const DISC_RADIUS = 770;
const RING_WIDTH = 90;
const FAN_RADIUS = DISC_RADIUS - RING_WIDTH;
const FAN_SHIFT_Y = -3;

const SECTORS_PER_HALF = 11;
const SEPARATOR_WIDTH = 3;
const SEPARATOR_COLOR = '#f9eddf';

const FACING_UPPER_LEFT = 225;
const FACING_LOWER_RIGHT = FACING_UPPER_LEFT + 180;

const DIAGONAL_SHIFT = 8;
const BAND_EDGE_UPPER_LEFT = 100;
const BAND_EDGE_LOWER_RIGHT = 80;

const LEFT_DISC = { x: 815, y: 820 };
const RIGHT_DISC = { x: 1585, y: 820 };

let leftRotation = 0;
let rightRotation = 0;
let grabbedDisc = null;
let lastMouseAngle = 0;
let leftReturning = false;
let rightReturning = false;

const RETURN_SPEED = 5;
const RETURN_STOP_ANGLE = 0.001;

const halves = [
    {
        name: 'left disc, lower right (pink)',
        disc: LEFT_DISC,
        facing: FACING_LOWER_RIGHT,
        ringColor: '#e4b3ad',
        sectorColors: ['#e6ce81', '#c9a7a2', '#00261e', '#d6ad23', '#606363', '#e6ce81', '#c9a7a2', '#00261e', '#d6ad23', '#606363', '#e6ce81']
    },
    {
        name: 'right disc, upper left (coral)',
        disc: RIGHT_DISC,
        facing: FACING_UPPER_LEFT,
        ringColor: '#ff6e51',
        sectorColors: ['#97c3a3', '#d0490b', '#68aea8', '#002546', '#adb2b8', '#00495d', '#e8a980', '#093424', '#ae9060', '#292922', '#86a14d']
    },
    {
        name: 'right disc, lower right (navy)',
        disc: RIGHT_DISC,
        facing: FACING_LOWER_RIGHT,
        ringColor: '#234162',
        sectorColors: ['#4b1023', '#fdc9ab', '#814a28', '#e5de46', '#7f000e', '#f28800', '#342f1d', '#5d94e1', '#451b39', '#ccc1b6', '#00289c']
    },
    {
        name: 'left disc, upper left (dark teal)',
        disc: LEFT_DISC,
        facing: FACING_UPPER_LEFT,
        ringColor: '#003748',
        sectorColors: ['#481809', '#859291', '#2d567c', '#e87f00', '#780021', '#fa9cb8', '#009943', '#ec9983', '#d74b00', '#c3bbad', '#3f2242']
    }

];

// helpers
function pointOnCircle(cx, cy, radius, angleDeg) {
    return {
        x: cx + radius * cos(radians(angleDeg)),
        y: cy + radius * sin(radians(angleDeg))
    };
}

// arcs
function addArc(cx, cy, radius, fromDeg, toDeg) {
    const steps = max(2, ceil(abs(toDeg - fromDeg)));
    for (let i = 0; i <= steps; i++) {
        const p = pointOnCircle(cx, cy, radius, lerp(fromDeg, toDeg, i / steps));
        vertex(p.x, p.y);
    }
}

function halfSpan(distance, radius) {
    return degrees(acos(distance / radius));
}

function drawRingAndBand(disc, facing, shift, color) {
    const span = halfSpan(shift, DISC_RADIUS);
    noStroke();
    fill(color);
    beginShape();
    addArc(disc.x, disc.y, DISC_RADIUS, facing - span, facing + span);
    endShape(CLOSE);
}

function drawSector(cx, cy, facing, bandEdge, startDeg, endDeg, color) {
    const startLen = bandEdge / cos(radians(startDeg - facing));
    const endLen = bandEdge / cos(radians(endDeg - facing));
    const start = pointOnCircle(cx, cy, startLen, startDeg);
    const end = pointOnCircle(cx, cy, endLen, endDeg);

    fill(color);
    beginShape();
    vertex(start.x, start.y);
    addArc(cx, cy, FAN_RADIUS, startDeg, endDeg);
    vertex(end.x, end.y);
    endShape(CLOSE);
}

function drawFan(disc, facing, bandEdge, colors) {
    const cx = disc.x;
    const cy = disc.y + FAN_SHIFT_Y;
    const span = halfSpan(bandEdge, FAN_RADIUS);
    const firstAngle = facing - span;
    const sectorAngle = (2 * span) / SECTORS_PER_HALF;

    stroke(SEPARATOR_COLOR);
    strokeWeight(SEPARATOR_WIDTH);
    strokeJoin(MITER);

    for (let i = 0; i < SECTORS_PER_HALF; i++) {
        drawSector(cx, cy, facing, bandEdge,
            firstAngle + i * sectorAngle,
            firstAngle + (i + 1) * sectorAngle,
            colors[i]);
    }
}

function drawHalf(half) {
    const isUpperLeft = half.facing === FACING_UPPER_LEFT;
    const shift = isUpperLeft ? DIAGONAL_SHIFT : -DIAGONAL_SHIFT;
    const bandEdge = isUpperLeft ? BAND_EDGE_UPPER_LEFT : BAND_EDGE_LOWER_RIGHT;

    drawRingAndBand(half.disc, half.facing, shift, half.ringColor);
    drawFan(half.disc, half.facing, bandEdge, half.sectorColors);
}

// Rotation
function drawRotatedHalf(half) {
    const angle = (half.disc === LEFT_DISC) ? leftRotation : rightRotation;
    push();
    translate(half.disc.x, half.disc.y);
    rotate(angle);
    translate(-half.disc.x, -half.disc.y);
    drawHalf(half);
    pop();
}

function getLayout() {
    const scaleFactor = min(width / CANVAS_W, height / CANVAS_H);
    return {
        scaleFactor: scaleFactor,
        offsetX: (width - CANVAS_W * scaleFactor) / 2,
        offsetY: (height - CANVAS_H * scaleFactor) / 2
    };
}

function mouseInArtwork() {
    const layout = getLayout();
    return {
        x: (mouseX - layout.offsetX) / layout.scaleFactor,
        y: (mouseY - layout.offsetY) / layout.scaleFactor
    };
}

function discAt(m) {
    const distLeft = dist(m.x, m.y, LEFT_DISC.x, LEFT_DISC.y);
    const distRight = dist(m.x, m.y, RIGHT_DISC.x, RIGHT_DISC.y);

    if (distLeft > DISC_RADIUS && distRight > DISC_RADIUS) {
        return null;
    }
    return (distLeft <= distRight) ? LEFT_DISC : RIGHT_DISC;
}

function wrapAngle(a) {
    return atan2(sin(a), cos(a));
}

function addRotation(disc, delta) {
    if (disc === LEFT_DISC) {
        leftRotation += delta;
    }
    else {
        rightRotation += delta;
    }
}

function setReturning(disc, value) {
    if (disc === LEFT_DISC) {
        leftReturning = value;
    }
    else {
        rightReturning = value;
    }
}

// One animation step
function easeTowardZero(angle) {
    const dt = min(deltaTime, 50) / 1000;          // seconds
    const amount = 1 - exp(-RETURN_SPEED * dt);
    const next = lerp(angle, 0, amount);
    return (abs(next) < RETURN_STOP_ANGLE) ? 0 : next;
}

function updateReturnAnimation() {
    if (leftReturning) {
        leftRotation = easeTowardZero(leftRotation);
        if (leftRotation === 0) leftReturning = false;
    }
    if (rightReturning) {
        rightRotation = easeTowardZero(rightRotation);
        if (rightRotation === 0) rightReturning = false;
    }
    if (!leftReturning && !rightReturning) {
        noLoop();
    }
}

// Interaction
function mousePressed() {
    if (mouseButton !== LEFT) return;
    const m = mouseInArtwork();
    const disc = discAt(m);
    if (disc === null) return;
    grabbedDisc = disc;
    lastMouseAngle = atan2(m.y - disc.y, m.x - disc.x);
    setReturning(disc, false);
}

function mouseDragged() {
    if (grabbedDisc === null) return;
    const m = mouseInArtwork();
    const mouseAngle = atan2(m.y - grabbedDisc.y, m.x - grabbedDisc.x);
    addRotation(grabbedDisc, wrapAngle(mouseAngle - lastMouseAngle));
    lastMouseAngle = mouseAngle;
    redraw();
}

function mouseReleased() {
    if (grabbedDisc === null) {
        return;
    }
    else if (grabbedDisc === LEFT_DISC) {
        leftRotation = wrapAngle(leftRotation);
    }
    else {
        rightRotation = wrapAngle(rightRotation);
    }
    setReturning(grabbedDisc, true);
    grabbedDisc = null;
    loop();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    redraw();
}

function draw() {
    background('white');
    updateReturnAnimation();
    const layout = getLayout();

    push();
    translate(layout.offsetX, layout.offsetY);
    scale(layout.scaleFactor);

    for (const half of halves) {
        drawRotatedHalf(half);
    }
    pop();
}