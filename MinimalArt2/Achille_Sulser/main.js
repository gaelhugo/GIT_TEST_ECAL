const SVG_NS = "http://www.w3.org/2000/svg";

const CASES = 14;
const TAILLE = 1400;
const PAS = TAILLE / CASES;
const EPAISSEUR = 2;
const PAPIER = "#f4f1ec";
const ENCRE = "#111111";

const svg = document.getElementById("tableau");

function element(nom, attributs) {
  const el = document.createElementNS(SVG_NS, nom);
  for (const [cle, valeur] of Object.entries(attributs)) {
    el.setAttribute(cle, valeur);
  }
  return el;
}

function ligne(groupe, x1, y1, x2, y2) {
  groupe.appendChild(element("line", { x1, y1, x2, y2 }));
}

svg.appendChild(
  element("rect", { x: 0, y: 0, width: TAILLE, height: TAILLE, fill: PAPIER }),
);

const grille = element("g", {
  id: "grille",
  stroke: ENCRE,
  "stroke-width": EPAISSEUR,
});
svg.appendChild(grille);

for (let i = 1; i < CASES; i++) {
  const p = i * PAS;
  ligne(grille, p, 0, p, TAILLE);
  ligne(grille, 0, p, TAILLE, p);
}

const ROTATIONS = [
  { angle: 30, colonne: 5, rangee: 9 },
  { angle: 60, colonne: 3, rangee: 2 },
];
const ETENDUE = Math.ceil(CASES * Math.SQRT2);

const decoupe = element("clipPath", { id: "papier" });
decoupe.appendChild(
  element("rect", { x: 0, y: 0, width: TAILLE, height: TAILLE }),
);
svg.appendChild(decoupe);

const grillesTournees = [];

for (const { angle, colonne, rangee } of ROTATIONS) {
  const cx = colonne * PAS;
  const cy = rangee * PAS;
  const demi = ETENDUE * PAS;

  const cadre = element("g", { "clip-path": "url(#papier)" });
  const tournee = element("g", {
    id: `grille-${angle}`,
    stroke: ENCRE,
    "stroke-width": EPAISSEUR,
    transform: `rotate(${angle} ${cx} ${cy})`,
  });
  cadre.appendChild(tournee);
  svg.appendChild(cadre);
  grillesTournees.push({ groupe: tournee, angle, cx, cy });

  for (let k = -ETENDUE; k <= ETENDUE; k++) {
    const d = k * PAS;
    ligne(tournee, cx + d, cy - demi, cx + d, cy + demi);
    ligne(tournee, cx - demi, cy + d, cx + demi, cy + d);
  }
}

const AMPLITUDE = 90;
const DOUCEUR = 0.12;

let cible = 0;
let actuel = 0;
let animation = null;

function orienter(decalage) {
  for (const { groupe, angle, cx, cy } of grillesTournees) {
    groupe.setAttribute("transform", `rotate(${angle + decalage} ${cx} ${cy})`);
  }
}

function animer() {
  actuel += (cible - actuel) * DOUCEUR;
  if (Math.abs(cible - actuel) < 0.01) actuel = cible;
  orienter(actuel);
  animation = actuel === cible ? null : requestAnimationFrame(animer);
}

function viser(decalage) {
  cible = decalage;
  if (!animation) animation = requestAnimationFrame(animer);
}

svg.addEventListener("pointermove", (e) => {
  const zone = svg.getBoundingClientRect();
  const position = (e.clientX - zone.left) / zone.width;
  viser((position - 0.5) * AMPLITUDE);
});

svg.addEventListener("pointerleave", () => viser(0));
