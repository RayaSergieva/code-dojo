const pickups = [];

function updatePickups() {
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    p.vy += 0.3;
    p.y += p.vy;
    p.life--;
    if (p.y + p.h >= GROUND_Y) {
      p.y = GROUND_Y - p.h;
      p.vy = 0;
    }
    p.bob = (p.bob || 0) + 0.1;
    if (p.life <= 0) pickups.splice(i, 1);
  }
}

function drawPickups() {
  for (const p of pickups) {
    const bob = Math.sin(p.bob || 0) * 2;
    const x = p.x, y = p.y + bob;
    if (p.type === 'fragment') {
      ctx.globalAlpha = 0.4 + 0.3 * Math.sin((p.bob || 0) * 2);
      ctx.fillStyle = PAL.gold;
      ctx.fillRect(x - 2, y - 2, p.w + 4, p.h + 4);
      ctx.globalAlpha = 1;
      ctx.fillStyle = PAL.inkBlack;
      ctx.fillRect(x, y, p.w, p.h);
      ctx.fillStyle = PAL.goldHi;
      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.random() < 0.5 ? '0' : '1', x + p.w / 2, y + p.h / 2);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    } else if (p.type === 'heart') {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = PAL.heart;
      ctx.fillRect(x - 3, y - 3, p.w + 6, p.h + 6);
      ctx.globalAlpha = 1;
      drawPixelHeart(x - 1, y - 1, 1, true);
    } else if (p.type === 'ki') {
      const pulse = 0.5 + 0.5 * Math.sin((p.bob || 0) * 3);
      ctx.globalAlpha = 0.3 + 0.3 * pulse;
      ctx.fillStyle = PAL.ki;
      ctx.beginPath();
      ctx.arc(x + p.w / 2, y + p.h / 2, 6 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = PAL.kiHi;
      ctx.beginPath();
      ctx.arc(x + p.w / 2, y + p.h / 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.bone;
      ctx.beginPath();
      ctx.arc(x + p.w / 2 - 1, y + p.h / 2 - 1, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const HEART_PATTERN = [
  "..XXX....XXX..",
  ".XHFHX..XHFHX.",
  "XHFFFHHHHFFFHX",
  "XFFFFFFFFFFFFX",
  "XFFFFFFFFFFFFX",
  "XFFFFFFFFFFFFX",
  ".XFFFFFFFFFFX.",
  "..XFFFFFFFFX..",
  "...XFFFFFFX...",
  "....XFFFFX....",
  ".....XFFX.....",
  "......XX......"
];

function drawPixelHeart(x, y, fill, glow) {
  if (glow) {
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = PAL.heartHi;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        for (let py = 0; py < HEART_PATTERN.length; py++) {
          for (let pxi = 0; pxi < HEART_PATTERN[py].length; pxi++) {
            if (HEART_PATTERN[py][pxi] !== '.') {
              ctx.fillRect(x + pxi + dx, y + py + dy, 1, 1);
            }
          }
        }
      }
    }
    ctx.globalAlpha = 1;
  }
  for (let py = 0; py < HEART_PATTERN.length; py++) {
    for (let pxi = 0; pxi < HEART_PATTERN[py].length; pxi++) {
      const c = HEART_PATTERN[py][pxi];
      if (c === '.') continue;
      const isRightHalf = pxi >= 7;
      let color;
      if (fill === 1) {
        color = c === 'X' ? PAL.heartDk : (c === 'F' ? PAL.heart : PAL.heartHi);
      } else if (fill === 0.5) {
        if (!isRightHalf) {
          color = c === 'X' ? PAL.heartDk : (c === 'F' ? PAL.heart : PAL.heartHi);
        } else {
          color = c === 'X' ? PAL.heartEmpty : '#0a0006';
        }
      } else {
        color = c === 'X' ? PAL.heartEmpty : '#0a0006';
      }
      ctx.fillStyle = color;
      ctx.fillRect(x + pxi, y + py, 1, 1);
    }
  }
}
