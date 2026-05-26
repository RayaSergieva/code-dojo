function drawNinjaSprite(x, y, f, fr, attacking) {
  const sashOffset = Math.sin(player.animTimer * 0.18) * 1.5 - player.vx * 1.2;
  rect(x + (f > 0 ? -2 : player.w - 1) - sashOffset * f, y + 8, 3, 14, PAL.niSash);
  rect(x + (f > 0 ? -2 : player.w - 1) - sashOffset * f, y + 8, 1, 14, PAL.niSashLt);

  const legSpread = Math.abs(player.vx) > 0.5 ? (fr % 2 === 0 ? 1 : -1) : 0;
  rect(x + 3, y + 20, 3, 8, PAL.niMain);
  rect(x + 8, y + 20, 3, 8, PAL.niMain);
  if (legSpread) {
    rect(x + 3 + legSpread, y + 24, 3, 4, PAL.niMain);
    rect(x + 8 - legSpread, y + 24, 3, 4, PAL.niMain);
  }
  rect(x + 2, y + 27, 5, 1, PAL.niLt);
  rect(x + 7, y + 27, 5, 1, PAL.niLt);

  rect(x + 2, y + 8, 10, 14, PAL.niMain);
  rect(x + 2, y + 8, 10, 2, PAL.niLt);
  rect(x + (f > 0 ? 2 : 9), y + 8, 3, 12, PAL.niLt);
  rect(x + 2, y + 16, 10, 3, PAL.niSash);
  rect(x + 2, y + 16, 10, 1, PAL.niSashLt);
  rect(x + (f > 0 ? 9 : 2), y + 17, 3, 4, PAL.niSashLt);

  rect(x + 1, y + 10, 2, 6, PAL.niMain);
  rect(x + 11, y + 10, 2, 6, PAL.niMain);

  rect(x + 3, y + 2, 8, 6, PAL.niMain);
  rect(x + 3, y + 2, 8, 1, PAL.niLt);
  rect(x + 4, y + 5, 6, 1, PAL.niSkin);
  rect(x + (f > 0 ? 5 : 7), y + 5, 1, 1, PAL.niEye);
  rect(x + (f > 0 ? 8 : 5), y + 5, 1, 1, PAL.niEye);
  rect(x + 3, y + 3, 8, 1, PAL.niSash);
  const ht = Math.sin(player.animTimer * 0.2) * 2;
  rect(x + (f > 0 ? 0 : player.w - 1), y + 3 + ht * 0.2, 1, 5, PAL.niSash);
  rect(x + (f > 0 ? -1 : player.w), y + 5 + ht * 0.3, 1, 4, PAL.niSashLt);

  if (attacking <= 0) {
    rect(x + (f > 0 ? 11 : 1), y + 8, 1, 12, PAL.niBladeDk);
    rect(x + (f > 0 ? 12 : 0), y + 9, 1, 10, PAL.niBlade);
  }

  if (attacking > 0) {
    const phase = 1 - attacking / 14;
    const bx = x + (f > 0 ? player.w : -16);
    const by = y + 8;
    for (let i = 0; i < 16; i++) {
      const arc = Math.sin(phase * Math.PI) * 8;
      rect(bx + (f > 0 ? i : 15 - i), by + 8 + arc - i * 0.3, 1, 1, PAL.niBlade);
      rect(bx + (f > 0 ? i : 15 - i), by + 9 + arc - i * 0.3, 1, 1, PAL.niBladeDk);
    }
    ctx.globalAlpha = 0.5 * (1 - phase);
    ctx.fillStyle = PAL.bone;
    ctx.beginPath();
    ctx.arc(x + player.w / 2, y + player.h / 2, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawPatrolSprite(e) {
  const x = e.x | 0, y = e.y | 0, f = e.facing;
  rect(x + 3, y + 18, 3, 8, PAL.enPurp);
  rect(x + 8, y + 18, 3, 8, PAL.enPurp);
  rect(x + 2, y + 25, 5, 1, PAL.enPurpLt);
  rect(x + 7, y + 25, 5, 1, PAL.enPurpLt);
  rect(x + 2, y + 6, 10, 14, PAL.enPurp);
  rect(x + 2, y + 6, 10, 2, PAL.enPurpLt);
  rect(x + 2, y + 14, 10, 2, PAL.enRed);
  rect(x + 2, y + 14, 10, 1, PAL.enRedLt);
  rect(x + 1, y + 8, 2, 6, PAL.enPurp);
  rect(x + 11, y + 8, 2, 6, PAL.enPurp);
  rect(x + 3, y + 0, 8, 6, PAL.enPurp);
  rect(x + 3, y + 0, 8, 1, PAL.enPurpLt);
  rect(x + 4, y + 3, 6, 1, '#0a0006');
  rect(x + (f > 0 ? 5 : 7), y + 3, 1, 1, PAL.enPurpEye);
  rect(x + (f > 0 ? 8 : 5), y + 3, 1, 1, PAL.enPurpEye);
  rect(x + 3, y + 1, 8, 1, PAL.enRed);

  if (e.state === 'attack' && e.attackTimer > 0) {
    const phase = 1 - e.attackTimer / 14;
    const bx = x + (f > 0 ? e.w : -14);
    const by = y + 8;
    for (let i = 0; i < 14; i++) {
      const arc = Math.sin(phase * Math.PI) * 6;
      rect(bx + (f > 0 ? i : 13 - i), by + 6 + arc - i * 0.4, 1, 1, PAL.niBlade);
    }
  } else {
    rect(x + (f > 0 ? 11 : 1), y + 8, 1, 8, PAL.niBlade);
  }
}

function drawArcherSprite(e) {
  const x = e.x | 0, y = e.y | 0, f = e.facing;
  rect(x + 2, y + 15, 4, 7, PAL.enGreen);
  rect(x + 8, y + 15, 4, 7, PAL.enGreen);
  rect(x + 2, y + 6, 10, 11, PAL.enGreen);
  rect(x + 2, y + 6, 10, 2, PAL.enGreenLt);
  rect(x + 3, y + 0, 8, 6, PAL.enGreen);
  rect(x + 3, y + 0, 8, 1, PAL.enGreenLt);
  rect(x + 4, y + 3, 6, 1, '#0a0a06');
  rect(x + (f > 0 ? 6 : 7), y + 3, 1, 1, PAL.enGreenEye);
  rect(x + 3, y + 1, 8, 1, '#8a6020');

  const bx = x + (f > 0 ? 12 : -3);
  ctx.strokeStyle = '#8a6020';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(bx, y + 8, 6, f > 0 ? -Math.PI / 2 : Math.PI / 2, f > 0 ? Math.PI / 2 : 3 * Math.PI / 2, false);
  ctx.stroke();
  ctx.strokeStyle = '#d8d0a8';
  ctx.beginPath();
  ctx.moveTo(bx, y + 2);
  ctx.lineTo(bx + (f > 0 ? 2 : -2), y + 8);
  ctx.lineTo(bx, y + 14);
  ctx.stroke();

  if (e.platformY) {
    const py = e.platformY;
    rect(x - 6, py, e.w + 12, 6, PAL.beamDk);
    rect(x - 6, py, e.w + 12, 1, PAL.beamLt);
    rect(x - 6, py + 5, e.w + 12, 1, PAL.gold);
    rect(x + e.w / 2 - 1, py + 6, 2, GROUND_Y - py - 6, PAL.beamDk);
    rect(x - 4, py - 3, e.w + 8, 3, PAL.lanternRed);
    rect(x - 4, py - 3, e.w + 8, 1, PAL.lanternHi);
  }
}

function drawBossSprite() {
  if (!boss) return;
  const x = boss.x | 0, y = boss.y | 0, f = boss.facing;

  if (boss.spawnEffect > 0) {
    const t = boss.spawnEffect / 90;
    ctx.globalAlpha = 0.7 * (1 - t) + 0.3;
    for (let r = 60; r > 20; r -= 4) {
      ctx.globalAlpha = 0.05 * t;
      ctx.fillStyle = PAL.red;
      ctx.beginPath();
      ctx.arc(x + boss.w / 2, y + boss.h / 2, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (boss.phase2) {
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.08 + Math.random() * 0.08;
      ctx.fillStyle = PAL.red;
      ctx.beginPath();
      ctx.arc(x + boss.w / 2, y + boss.h / 2, 30 + i * 6 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (boss.invul > 0 && Math.floor(boss.invul / 3) % 2 === 0) ctx.globalAlpha = 0.4;

  rect(x + 8, y + 44, 8, 16, PAL.bossArmor);
  rect(x + 28, y + 44, 8, 16, PAL.bossArmor);
  rect(x + 8, y + 44, 8, 2, PAL.bossArmHi);
  rect(x + 28, y + 44, 8, 2, PAL.bossArmHi);
  rect(x + 6, y + 56, 12, 3, PAL.bossArmor);
  rect(x + 26, y + 56, 12, 3, PAL.bossArmor);
  rect(x + 6, y + 58, 12, 1, PAL.bossGold);
  rect(x + 26, y + 58, 12, 1, PAL.bossGold);

  rect(x + 4, y + 20, 36, 26, PAL.bossArmor);
  rect(x + 4, y + 20, 36, 3, PAL.bossArmHi);
  rect(x + 4, y + 20, 3, 26, PAL.bossArmHi);
  rect(x + 10, y + 24, 24, 18, PAL.bossArmor);
  rect(x + 10, y + 24, 24, 1, PAL.bossGold);
  rect(x + 10, y + 41, 24, 1, PAL.bossGold);
  rect(x + 10, y + 24, 1, 18, PAL.bossGold);
  rect(x + 33, y + 24, 1, 18, PAL.bossGold);

  const sx = x + 18, sy = y + 27;
  rect(sx + 1, sy,     5, 1, PAL.bossGoldHi);
  rect(sx,     sy + 1, 7, 4, PAL.bossGoldHi);
  rect(sx + 1, sy + 5, 5, 1, PAL.bossGoldHi);
  rect(sx + 1, sy + 6, 1, 1, PAL.bossGoldHi);
  rect(sx + 3, sy + 6, 1, 1, PAL.bossGoldHi);
  rect(sx + 5, sy + 6, 1, 1, PAL.bossGoldHi);
  rect(sx + 1, sy + 2, 2, 2, PAL.bossArmor);
  rect(sx + 4, sy + 2, 2, 2, PAL.bossArmor);
  rect(sx + 1, sy + 2, 1, 1, PAL.bossEye);
  rect(sx + 4, sy + 2, 1, 1, PAL.bossEye);

  rect(x + 0, y + 18, 8, 10, PAL.bossArmor);
  rect(x + 36, y + 18, 8, 10, PAL.bossArmor);
  rect(x + 0, y + 18, 8, 2, PAL.bossGold);
  rect(x + 36, y + 18, 8, 2, PAL.bossGold);
  rect(x + 1, y + 20, 1, 8, PAL.bossArmHi);
  rect(x + 42, y + 20, 1, 8, PAL.bossArmHi);

  rect(x + 2, y + 28, 4, 14, PAL.bossArmor);
  rect(x + 38, y + 28, 4, 14, PAL.bossArmor);

  rect(x + 18, y + 14, 8, 6, PAL.bossSkin);

  rect(x + 12, y + 2, 20, 14, PAL.bossArmor);
  rect(x + 12, y + 2, 20, 2, PAL.bossArmHi);
  rect(x + 14, y + 8, 16, 8, '#5a1a1a');
  rect(x + 14, y + 8, 16, 1, '#8a2a2a');
  rect(x + 15, y + 11, 5, 2, '#0a0006');
  rect(x + 24, y + 11, 5, 2, '#0a0006');
  rect(x + 17, y + 12, 1, 1, PAL.bossEye);
  rect(x + 26, y + 12, 1, 1, PAL.bossEye);
  if (boss.phase2) {
    rect(x + 16, y + 12, 1, 1, PAL.bossEye);
    rect(x + 19, y + 12, 1, 1, PAL.bossEye);
    rect(x + 25, y + 12, 1, 1, PAL.bossEye);
    rect(x + 28, y + 12, 1, 1, PAL.bossEye);
  }
  rect(x + 18, y + 15, 8, 1, '#0a0006');
  rect(x + 19, y + 14, 1, 1, PAL.bone);
  rect(x + 21, y + 14, 1, 1, PAL.bone);
  rect(x + 23, y + 14, 1, 1, PAL.bone);

  ctx.fillStyle = PAL.bossHorn;
  ctx.beginPath();
  ctx.moveTo(x + 10, y + 4);
  ctx.lineTo(x + 4, y - 4);
  ctx.lineTo(x + 8, y - 2);
  ctx.lineTo(x + 13, y + 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 34, y + 4);
  ctx.lineTo(x + 40, y - 4);
  ctx.lineTo(x + 36, y - 2);
  ctx.lineTo(x + 31, y + 2);
  ctx.closePath();
  ctx.fill();
  rect(x + 20, y - 2, 4, 4, PAL.bossGold);
  rect(x + 21, y - 1, 2, 2, PAL.red);

  if (boss.state === 'slash') {
    const phase = 1 - boss.stateTimer / 50;
    const bx = x + (f > 0 ? boss.w + 4 : -36);
    const by = y + 16;
    for (let i = 0; i < 36; i++) {
      const arc = Math.sin(phase * Math.PI) * 14;
      rect(bx + (f > 0 ? i : 35 - i), by + 12 + arc - i * 0.4, 1, 1, PAL.niBlade);
      rect(bx + (f > 0 ? i : 35 - i), by + 13 + arc - i * 0.4, 1, 1, PAL.niBladeDk);
    }
    ctx.globalAlpha = 0.4 * (1 - phase);
    ctx.fillStyle = PAL.gold;
    ctx.beginPath();
    ctx.arc(x + boss.w / 2, y + boss.h / 2, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else {
    rect(x + (f > 0 ? 44 : -2), y + 20, 2, 28, PAL.niBladeDk);
    rect(x + (f > 0 ? 45 : -1), y + 22, 1, 24, PAL.niBlade);
    rect(x + (f > 0 ? 42 : -2), y + 46, 6, 3, PAL.bossGold);
  }

  ctx.globalAlpha = 1;
}

function drawSmallShuriken(cx, cy, rot) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.fillStyle = PAL.gold;
  ctx.fillRect(-1, -6, 2, 12);
  ctx.fillRect(-6, -1, 12, 2);
  ctx.fillStyle = PAL.goldHi;
  ctx.fillRect(0, -6, 1, 12);
  ctx.fillRect(-6, 0, 12, 1);
  ctx.fillStyle = PAL.inkBlack;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}
