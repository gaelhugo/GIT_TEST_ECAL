
//recupérer dessin et faire les forme 
const svg = document.getElementById("art");   // le dessin entier
const g = document.getElementById("g");     // le groupe qui contiendra les formes
const NS = "http://www.w3.org/2000/svg";

// Pour CHAQUE forme on calcule son centre et sa largeur.
// (on cherche le plus petit/grand x et y = le rectangle qui l'entoure)
const info = SHAPES.map(p => {
    let a = 1e9, b = -1e9, c = 1e9, d = -1e9;   // a/b = x min/max, c/d = y min/max
    for (let i = 0; i < p.length; i += 2) {     // on lit les points 2 par 2 (x puis y)
        a = Math.min(a, p[i]); b = Math.max(b, p[i]);
        c = Math.min(c, p[i + 1]); d = Math.max(d, p[i + 1]);
    }
    return {
        cx: (a + b) / 2,   // centre en x
        cy: (c + d) / 2,   // centre en y
        w: b - a
    };       // largeur
});

const els = SHAPES.map((_, i) => {
    const e = document.createElementNS(NS, "path");
    e.dataset.i = i;
    g.appendChild(e);
    return e;
});


//  Au lieu de sauter d'une valeur à l'autre, chaque valeur est
// "attachée" à sa cible par un ressort : elle accélère, freine,
// et dépasse un tout petit peu avant de se stabiliser.
// C'est ça qui donne l'effet fluide / organique.
const RX = 460, RY = 360;   // taille de la zone déformée autour de la souris
// (une ellipse : 460 px de large, 360 de haut)

// P = les 4 valeurs animées. Pour chacune :
//   x = valeur actuelle   v = vitesse actuelle   t = cible (là où elle veut aller)
//   k = raideur du ressort (grand = réagit vite)
//   z = amortissement (1 = pas de rebond, 0.5 = beaucoup de rebond)
const P = {
    s: { x: 0, v: 0, t: 0, k: 70, z: 0.92 },
    fx: { x: 467, v: 0, t: 467, k: 55, z: 0.95 },
    fy: { x: 504, v: 0, t: 504, k: 55, z: 0.95 },
    g: { x: 1, v: 0, t: 1, k: 55, z: 0.95 }
};


function step(p, dt) {
    const c = 2 * Math.sqrt(p.k) * p.z;
    p.v += ((p.t - p.x) * p.k - p.v * c) * dt;
    p.x += p.v * dt;
    return Math.abs(p.v) > 0.002 || Math.abs(p.t - p.x) > 0.002;
}


function bulge(u, m) { return 1 - Math.pow(1 - u, m); }


function draw() {
    // valeurs actuelles des ressorts
    const s = Math.max(0, P.s.x),            // intensité (jamais négative)
        gain = P.g.x,                      // gain
        fx = P.fx.x, fy = P.fy.x;          // centre de la déformation

    // ATTENTION au nom : ici mx et my ne sont PAS la souris !
    // ce sont les "m" de la fonction bulge : la force du bombé,
    // une en largeur (x), une en hauteur (y).
    // 1 = aucun effet. Plus c'est grand, plus la forme grossit.
    // → en largeur : 0.35 ; en hauteur : 0.3  (change ces 2 chiffres pour régler la taille)
    const mx = 1 + 0.35 * s * gain;
    const my = 1 + 0.3 * s * gain;

    // on refait chaque forme, une par une
    for (let k = 0; k < SHAPES.length; k++) {
        const p = SHAPES[k];
        const out = new Array(p.length / 2);   // les points déformés, sous forme de texte

        // chaque point du contour, x puis y
        for (let i = 0; i < p.length; i += 2) {
            let x = p[i], y = p[i + 1];

            // 1) vecteur entre le centre de déformation et ce point
            const dx = x - fx, dy = y - fy;

            // 2) distance normalisée dans l'ellipse (0 = centre, 1 = bord de la zone)
            const u = Math.hypot(dx / RX, dy / RY);

            // 3) si le point est dans la zone → on le déplace
            if (u > 0 && u < 1) {
                // bulge(u, m) / u = "de combien on multiplie le vecteur"
                // (x et y ont chacun leur m → ça grossit plus dans un sens que dans l'autre)
                x = fx + dx * bulge(u, mx) / u;
                y = fy + dy * bulge(u, my) / u;
            }
            // 4) on écrit le point dans le langage SVG : "M" = commencer, "L" = tracer une ligne jusqu'à
            out[i >> 1] = (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
        }
        // "Z" = fermer la forme. On remplace le contour de la forme par le nouveau.
        els[k].setAttribute("d", out.join("") + "Z");
    }
}

let last = performance.now(), running = false;

function frame(now) {
    // dt = temps depuis la dernière image, en secondes (plafonné pour éviter un saut si l'onglet était en pause)
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;

    // on avance les 4 ressorts ; "moving" reste vrai si au moins un bouge encore
    let moving = false;
    for (const key in P) moving = step(P[key], dt) || moving;

    draw();                                              // on redessine
    if (moving) requestAnimationFrame(frame);            // ça bouge encore → image suivante
    else running = false;                                // tout est stable → on s'endort
}

// "réveille" la boucle si elle dormait (appelée à chaque mouvement de souris)
function wake() {
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
}


let rel;   // minuteur (voir plus bas)

function over(e) {
    const t = e.target;   // l'élément sous la souris

    if (t && t.tagName === "path" && t.dataset.i !== undefined) {
        // → la souris est sur une forme
        const n = info[+t.dataset.i];                       // ses infos (centre, largeur)
        P.fx.t = n.cx; P.fy.t = n.cy;                      // la déformation se centre sur elle
        P.g.t = Math.min(1, Math.max(0.4, 120 / n.w));      // grandes formes → effet réduit (entre 0.4 et 1)
        P.s.t = 1;                                          // intensité cible = max
        clearTimeout(rel);                                  // on annule un éventuel relâchement prévu

    } else if (P.s.t) {
        // → la souris est sur le noir (entre deux formes) : on attend 160 ms avant de relâcher.
        //   Sinon la toile se détendrait puis se retendrait à chaque passage entre 2 formes (clignotement)
        clearTimeout(rel);
        rel = setTimeout(() => { P.s.t = 0; wake(); }, 160);   // intensité cible = 0 → la toile se détend
    }
    wake();   // dans tous les cas on relance l'animation
}

svg.addEventListener("pointermove", over);   // la souris (ou le doigt) bouge
svg.addEventListener("pointerdown", over);   // clic / toucher
svg.addEventListener("pointerleave", () => { // la souris sort du dessin → tout se détend
    clearTimeout(rel); P.s.t = 0; wake();
});

draw();   // premier dessin au chargement de la page