    /**
     * Carrés bouncing
     * Animation interactive en Canvas, sans bibliothèque externe.
     *
     * Gestes : faire glisser la composition pour la lancer; cliquer sur un carré
     * lancé en crée une nouvelle composition imbriquée si un emplacement est libre.
     */

    // Références de la page et dimensions de la scène de référence.
    const canvas = document.getElementById('scene');
    const ctx = canvas.getContext('2d');

    const sceneWidth = 1440;
    const sceneHeight = 1024;

    // Paramètres de l'animation et état partagé entre les fonctions.
    const groups = [];
    const groupSize = 661;
    const speed = 90;
    const shrinkPerBounce = 0.025;
    const minimumScale = 0.2;
    const scaleSmoothing = 8;
    let nextHue = 8;
    let activeDrag = null;
    let lastFrameTime = 0;
    let renderScale = 1;

    // Géométrie et couleurs des trois carrés imbriqués, dans la scène de référence.
    const squares = [
      { x: 0, y: 0, width: 661, height: 670, color: '#d43821', lightness: 48 },
      { x: 68, y: 105, width: 526, height: 529, color: '#bc3825', lightness: 44 },
      { x: 134, y: 197, width: 394, height: 395, color: '#9d3124', lightness: 38 }
    ];

    // Ajuste le Canvas à l'écran sans modifier les coordonnées logiques du jeu.
    function resizeCanvas() {
      const parent = canvas.parentElement;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      renderScale = rect.width / sceneWidth;
      ctx.setTransform(dpr * renderScale, 0, 0, dpr * renderScale, 0, 0);
    }

    // Crée un ensemble de carrés et initialise leurs vitesses et leur apparence.
    function makeGroup(x, y, vx = 0, vy = 0, scale = 1) {
      const hue = nextHue;
      nextHue = (nextHue + 137.508) % 360;
      return {
        x,
        y,
        size: groupSize * scale,
        height: 670 * scale,
        scale,
        targetScale: scale,
        originalColors: groups.length === 0,
        vx,
        vy,
        hue,
        launched: vx !== 0 || vy !== 0,
        innerSquares: squares.slice(1).map((square, index) => {
          const parentSquare = squares[index];
          const angle = Math.random() * Math.PI * 2;
          return {
            x: square.x - parentSquare.x,
            y: square.y - parentSquare.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed
          };
        })
      };
    }

    // Garde les couleurs d'origine du premier groupe, puis calcule les teintes des copies.
    function colorsFor(group) {
      return squares.map((square) => group.originalColors
        ? square.color
        : `hsl(${group.hue} 72% ${square.lightness}%)`);
    }

    // Convertit une position de souris/tactile en coordonnées de la scène logique.
    function pointerPosition(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) / renderScale,
        y: (event.clientY - rect.top) / renderScale
      };
    }

    // Renvoie le groupe visible le plus haut sous le pointeur.
    function hitTest(point) {
      return [...groups].reverse().find((group) =>
        point.x >= group.x && point.x <= group.x + group.size &&
        point.y >= group.y && point.y <= group.y + group.height
      );
    }

    // Teste le chevauchement de deux rectangles; gap ajoute une marge facultative.
    function overlaps(a, b, gap = 0) {
      return a.x < b.x + b.size + gap && a.x + a.size + gap > b.x &&
        a.y < b.y + b.height + gap && a.y + a.height + gap > b.y;
    }

    // Parcourt la scène pour trouver un emplacement qui ne chevauche aucun groupe.
    function findOpenPosition(size, groupHeight) {
      const step = Math.max(12, Math.floor(size / 8));
      for (let y = 0; y <= sceneHeight - groupHeight; y += step) {
        for (let x = 0; x <= sceneWidth - size; x += step) {
          const candidate = { x, y, size, height: groupHeight };
          if (!groups.some((group) => overlaps(candidate, group, 2))) {
            return { x, y };
          }
        }
      }
      return null;
    }

    // Crée une nouvelle composition complète, si la scène a assez de place.
    function spawnGroup(source) {
      const position = findOpenPosition(source.size, source.height);
      if (!position) return;
      const angle = Math.random() * Math.PI * 2;
      groups.push(makeGroup(
        position.x,
        position.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        source.scale
      ));
    }

    // Programme une réduction de 2,5 %; la taille réelle sera interpolée dans le temps.
    function shrinkGroup(group) {
      group.targetScale = Math.max(minimumScale, group.targetScale - shrinkPerBounce);
    }

    // Rapproche progressivement la taille actuelle de la taille cible pour éviter les à-coups.
    function updateGroupScale(group, deltaTime) {
      const progress = 1 - Math.exp(-scaleSmoothing * deltaTime);
      group.scale += (group.targetScale - group.scale) * progress;
      group.size = groupSize * group.scale;
      group.height = 670 * group.scale;
    }

    // Inverse la vitesse lors d'un contact avec les limites de la scène.
    function bounceOffWalls(group, width, height, changeColor = true) {
      let bounces = 0;
      if ((group.x <= 0 && group.vx < 0) ||
          (group.x + group.size >= width && group.vx > 0)) {
        group.vx = -group.vx;
        bounces += 1;
      }
      if ((group.y <= 0 && group.vy < 0) ||
          (group.y + group.height >= height && group.vy > 0)) {
        group.vy = -group.vy;
        bounces += 1;
      }
      group.x = Math.max(0, Math.min(group.x, Math.max(0, width - group.size)));
      group.y = Math.max(0, Math.min(group.y, Math.max(0, height - group.height)));
      if (bounces > 0 && changeColor) {
        group.originalColors = false;
        for (let i = 0; i < bounces; i += 1) {
          shrinkGroup(group);
          group.hue = (group.hue + 47) % 360;
        }
      }
    }

    // Déplace le groupe attrapé, en bloquant son passage à travers les autres groupes.
    function moveDraggedGroup(group, targetX, targetY) {
      const startX = group.x;
      const startY = group.y;
      let nextX = Math.max(0, Math.min(targetX, sceneWidth - group.size));
      let nextY = Math.max(0, Math.min(targetY, sceneHeight - group.height));

      groups.forEach((other) => {
        if (other === group) return;
        const overlapsVertically = startY < other.y + other.height &&
          startY + group.height > other.y;
        if (!overlapsVertically) return;
        if (nextX > startX && startX + group.size <= other.x &&
            nextX + group.size > other.x) {
          nextX = Math.min(nextX, other.x - group.size);
        } else if (nextX < startX && startX >= other.x + other.size &&
            nextX < other.x + other.size) {
          nextX = Math.max(nextX, other.x + other.size);
        }
      });
      group.x = nextX;

      groups.forEach((other) => {
        if (other === group) return;
        const overlapsHorizontally = group.x < other.x + other.size &&
          group.x + group.size > other.x;
        if (!overlapsHorizontally) return;
        if (nextY > startY && startY + group.height <= other.y &&
            nextY + group.height > other.y) {
          nextY = Math.min(nextY, other.y - group.height);
        } else if (nextY < startY && startY >= other.y + other.height &&
            nextY < other.y + other.height) {
          nextY = Math.max(nextY, other.y + other.height);
        }
      });
      group.y = nextY;
    }

    // Repousse le groupe mobile rencontré par le groupe que l'utilisateur déplace.
    function resolveDraggedCollision(active, other) {
      const overlapX = Math.min(active.x + active.size - other.x, other.x + other.size - active.x);
      const overlapY = Math.min(active.y + active.height - other.y, other.y + other.height - active.y);
      if (overlapX < overlapY) {
        const direction = active.x + active.size / 2 < other.x + other.size / 2 ? 1 : -1;
        other.x = direction > 0 ? active.x + active.size : active.x - other.size;
        if (other.vx * direction < 0) other.vx = -other.vx;
      } else {
        const direction = active.y + active.height / 2 < other.y + other.height / 2 ? 1 : -1;
        other.y = direction > 0 ? active.y + active.height : active.y - other.height;
        if (other.vy * direction < 0) other.vy = -other.vy;
      }
      shrinkGroup(active);
      shrinkGroup(other);
      bounceOffWalls(other, sceneWidth, sceneHeight, false);
    }

    // Résout les collisions entre les groupes et échange leurs composantes de vitesse.
    function resolveGroupCollisions() {
      for (let i = 0; i < groups.length; i += 1) {
        for (let j = i + 1; j < groups.length; j += 1) {
          const a = groups[i];
          const b = groups[j];
          if (!overlaps(a, b)) continue;
          if (a === activeDrag?.group) {
            resolveDraggedCollision(a, b);
            continue;
          }
          if (b === activeDrag?.group) {
            resolveDraggedCollision(b, a);
            continue;
          }

          const overlapX = Math.min(a.x + a.size - b.x, b.x + b.size - a.x);
          const overlapY = Math.min(a.y + a.height - b.y, b.y + b.height - a.y);
          if (overlapX < overlapY) {
            const direction = a.x + a.size / 2 < b.x + b.size / 2 ? -1 : 1;
            a.x += direction * overlapX / 2;
            b.x -= direction * overlapX / 2;
            [a.vx, b.vx] = [b.vx, a.vx];
          } else {
            const direction = a.y + a.height / 2 < b.y + b.height / 2 ? -1 : 1;
            a.y += direction * overlapY / 2;
            b.y -= direction * overlapY / 2;
            [a.vy, b.vy] = [b.vy, a.vy];
          }
          shrinkGroup(a);
          shrinkGroup(b);
          bounceOffWalls(a, sceneWidth, sceneHeight, false);
          bounceOffWalls(b, sceneWidth, sceneHeight, false);
        }
      }
    }

    // Commence le glisser et mémorise les données nécessaires au lancer.
    function startDrag(event) {
      const point = pointerPosition(event);
      const group = hitTest(point);
      if (!group) return;

      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      activeDrag = {
        group,
        pointerId: event.pointerId,
        offsetX: point.x - group.x,
        offsetY: point.y - group.y,
        startX: point.x,
        startY: point.y,
        moved: false,
        wasLaunched: group.launched,
        previousVx: group.vx,
        previousVy: group.vy,
        samples: [{ x: point.x, y: point.y, time: performance.now() }]
      };
      group.vx = 0;
      group.vy = 0;
    }

    // Suit le pointeur, déplace le groupe et conserve des échantillons de trajectoire.
    function moveDrag(event) {
      if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
      const point = pointerPosition(event);
      const group = activeDrag.group;
      const dx = point.x - activeDrag.startX;
      const dy = point.y - activeDrag.startY;
      if (Math.hypot(dx, dy) > 5) activeDrag.moved = true;

      moveDraggedGroup(
        group,
        point.x - activeDrag.offsetX,
        point.y - activeDrag.offsetY
      );
      activeDrag.samples.push({ x: point.x, y: point.y, time: performance.now() });
      activeDrag.samples = activeDrag.samples.filter((sample) => performance.now() - sample.time < 120);
    }

    // Termine le glisser : lance le groupe ou crée une composition au clic.
    function endDrag(event) {
      if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
      const drag = activeDrag;
      activeDrag = null;
      if (drag.moved) {
        const first = drag.samples[0];
        const last = drag.samples[drag.samples.length - 1];
        const elapsed = Math.max(16, last.time - first.time) / 1000;
        const vx = (last.x - first.x) / elapsed;
        const vy = (last.y - first.y) / elapsed;
        const angle = Math.atan2(vy, vx);
        drag.group.vx = Math.cos(angle) * speed;
        drag.group.vy = Math.sin(angle) * speed;
        drag.group.launched = true;
      } else if (drag.wasLaunched) {
        drag.group.vx = drag.previousVx;
        drag.group.vy = drag.previousVy;
        spawnGroup(drag.group);
      }
    }

    // Met à jour les groupes à chaque image, indépendamment de la fréquence d'affichage.
    function updateGroups(deltaTime) {
      groups.forEach((group) => {
        updateGroupScale(group, deltaTime);
        if (group === activeDrag?.group) return;
        group.x += group.vx * deltaTime;
        group.y += group.vy * deltaTime;
        bounceOffWalls(group, sceneWidth, sceneHeight);
        if (group.launched) updateInnerSquares(group, deltaTime);
      });
      resolveGroupCollisions();
    }

    // Fait rebondir les carrés intérieurs dans leurs carrés parents.
    function updateInnerSquares(group, deltaTime) {
      group.innerSquares.forEach((inner, index) => {
        const square = squares[index + 1];
        const container = squares[index];
        const maxX = container.width - square.width;
        const maxY = container.height - square.height;
        let bounced = false;

        inner.x += inner.vx * deltaTime;
        inner.y += inner.vy * deltaTime;
        if ((inner.x <= 0 && inner.vx < 0) || (inner.x >= maxX && inner.vx > 0)) {
          inner.vx = -inner.vx;
          bounced = true;
        }
        if ((inner.y <= 0 && inner.vy < 0) || (inner.y >= maxY && inner.vy > 0)) {
          inner.vy = -inner.vy;
          bounced = true;
        }
        inner.x = Math.max(0, Math.min(inner.x, maxX));
        inner.y = Math.max(0, Math.min(inner.y, maxY));
        if (bounced && index === 0) {
          shrinkGroup(group);
          group.originalColors = false;
          group.hue = (group.hue + 47) % 360;
        } else if (bounced) {
          group.originalColors = false;
          group.hue = (group.hue + 47) % 360;
        }
      });
    }

    // Boucle principale : calcule le temps écoulé, met à jour et dessine la scène.
    function draw(time) {
      const deltaTime = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.03) : 0;
      lastFrameTime = time;
      updateGroups(deltaTime);
      ctx.clearRect(0, 0, sceneWidth, sceneHeight);

      groups.forEach((group) => {
        const colors = colorsFor(group);
        let offsetX = group.x;
        let offsetY = group.y;
        squares.forEach((square, index) => {
          if (index > 0) {
            offsetX += group.innerSquares[index - 1].x * group.scale;
            offsetY += group.innerSquares[index - 1].y * group.scale;
          }
          ctx.fillStyle = colors[index];
          ctx.fillRect(offsetX, offsetY, square.width * group.scale, square.height * group.scale);
        });
      });

      requestAnimationFrame(draw);
    }

    // Démarrage : prépare le Canvas, crée le groupe initial et branche les interactions.
    resizeCanvas();
    groups.push(makeGroup(389, 177));
    canvas.addEventListener('pointerdown', startDrag);
    canvas.addEventListener('pointermove', moveDrag);
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(draw);
