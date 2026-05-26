const particles = [];

function spawnParticles(x, y, opts) {
  const n = opts.n || 8;
  for (let i = 0; i < n; i++) {
    const a = (opts.angle != null
      ? opts.angle + (Math.random() - 0.5) * (opts.spread || Math.PI * 2)
      : Math.random() * Math.PI * 2);
    const s = (opts.speed || 2) * (0.4 + Math.random() * 0.9);
    particles.push({
      x, y,
      vx: Math.cos(a) * s + (opts.vx || 0),
      vy: Math.sin(a) * s + (opts.vy || 0),
      g: opts.g != null ? opts.g : 0.18,
      life: (opts.life || 30) + Math.random() * 10,
      maxLife: (opts.life || 30) + 10,
      size: opts.size || (1 + Math.random() * 2),
      color: Array.isArray(opts.color)
        ? opts.color[(Math.random() * opts.color.length) | 0]
        : (opts.color || PAL.gold),
      glow: opts.glow || 0,
      shrink: opts.shrink !== false,
      drag: opts.drag != null ? opts.drag : 0.99
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  for (const p of particles) {
    const a = Math.max(0, p.life / p.maxLife);
    const s = p.shrink ? Math.max(1, p.size * a) : p.size;
    if (p.glow) {
      ctx.globalAlpha = a * 0.4;
      ctx.fillStyle = p.color;
      ctx.fillRect((p.x - s * 2) | 0, (p.y - s * 2) | 0, (s * 4) | 0, (s * 4) | 0);
    }
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.fillRect((p.x - s / 2) | 0, (p.y - s / 2) | 0, s | 0, s | 0);
  }
  ctx.globalAlpha = 1;
}

const CAMERA = {
  zoom: 1.5,
  x: 0,
  y: 0,
  targetX: 0
};
CAMERA.y = H - H / CAMERA.zoom;
CAMERA.x = (W - W / CAMERA.zoom) / 2;
CAMERA.targetX = CAMERA.x;

function updateCamera() {
  const visW = W / CAMERA.zoom;
  const desired = (typeof player !== 'undefined' ? (player.x + player.w / 2) : W / 2) - visW / 2;
  CAMERA.targetX = clamp(desired, 0, W - visW);
  CAMERA.x = lerp(CAMERA.x, CAMERA.targetX, 0.12);
  CAMERA.y = H - H / CAMERA.zoom;
}

let shakeAmount = 0;
let shakeTime = 0;

function shake(amount, time) {
  shakeAmount = Math.max(shakeAmount, amount);
  shakeTime = Math.max(shakeTime, time);
}

let freeze = 0;

function freezeFrames(n) {
  freeze = Math.max(freeze, n);
}
