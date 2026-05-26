const projectiles = [];

function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.type === 'shuriken') p.rot += 0.5;
    if (p.life <= 0 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
      projectiles.splice(i, 1);
      continue;
    }
    if (p.owner === 'player') {
      let hit = false;
      for (const e of enemies) {
        if (e.hp <= 0) continue;
        if (aabb({ x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h }, e)) {
          damageEnemy(e, 1, p.x);
          hit = true;
          break;
        }
      }
      if (boss && boss.awakened && boss.state !== 'dead' && boss.invul <= 0) {
        if (aabb({ x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h }, boss)) {
          damageBoss(1);
          hit = true;
        }
      }
      if (hit) { projectiles.splice(i, 1); continue; }
    } else {
      if (player.invul <= 0 && aabb({ x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h }, player)) {
        hurtPlayer(1, p.x);
        projectiles.splice(i, 1);
        continue;
      }
    }
  }
}

function drawProjectiles() {
  for (const p of projectiles) {
    if (p.type === 'shuriken') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = PAL.niBladeDk;
      ctx.fillRect(-1, -5, 2, 10);
      ctx.fillRect(-5, -1, 10, 2);
      ctx.fillStyle = PAL.niBlade;
      ctx.fillRect(0, -5, 1, 10);
      ctx.fillRect(-5, 0, 10, 1);
      ctx.fillStyle = PAL.gold;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
      if (Math.random() < 0.4) {
        spawnParticles(p.x, p.y, { n: 1, color: PAL.bone, speed: 0.5, life: 10, g: 0 });
      }
    } else if (p.type === 'arrow') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = '#5a3a1f';
      ctx.fillRect(-5, 0, 10, 1);
      ctx.fillStyle = PAL.niBladeDk;
      ctx.fillRect(4, -1, 3, 3);
      ctx.fillStyle = PAL.lanternRed;
      ctx.fillRect(-5, -1, 1, 1);
      ctx.fillRect(-5, 1, 1, 1);
      ctx.restore();
    } else if (p.type === 'shockwave') {
      const cx = p.x, cy = p.y;
      ctx.fillStyle = PAL.gold;
      ctx.fillRect(cx - 8, cy - 2, 16, 1);
      ctx.fillStyle = PAL.beamLt;
      ctx.fillRect(cx - 7, cy, 14, 4);
      ctx.fillStyle = PAL.goldHi;
      for (let i = 0; i < 5; i++) {
        const dx = (Math.random() - 0.5) * 16;
        const dy = -Math.random() * 8;
        rect(cx + dx, cy + dy, 2, 2, PAL.gold);
      }
    } else if (p.type === 'kiwave') {
      const cx = p.x, cy = p.y;
      for (let r = 8; r > 0; r -= 2) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = PAL.red;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = PAL.redHi;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.bone;
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
