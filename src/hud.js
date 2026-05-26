function romanNumeral(n) {
  return ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n] || String(n);
}

function padScore(n) {
  return String(n).padStart(6, '0');
}

function drawUIPanel(x, y, w, h, kanji, en) {
  rect(x, y, w, h, PAL.inkBlack);
  rect(x + 2, y + 2, w - 4, h - 4, PAL.ink);
  rect(x, y, w, 2, PAL.gold);
  rect(x, y + h - 2, w, 2, PAL.gold);
  rect(x, y, 2, h, PAL.gold);
  rect(x + w - 2, y, 2, h, PAL.gold);
  rectO(x + 3, y + 3, w - 6, h - 6, PAL.goldDk);

  ctx.fillStyle = PAL.goldHi;
  rect(x - 2, y - 2, 6, 2, PAL.goldHi);
  rect(x - 2, y - 2, 2, 6, PAL.goldHi);
  rect(x + w - 4, y - 2, 6, 2, PAL.goldHi);
  rect(x + w, y - 2, 2, 6, PAL.goldHi);
  rect(x - 2, y + h, 6, 2, PAL.goldHi);
  rect(x - 2, y + h - 4, 2, 6, PAL.goldHi);
  rect(x + w - 4, y + h, 6, 2, PAL.goldHi);
  rect(x + w, y + h - 4, 2, 6, PAL.goldHi);

  if (en) {
    rect(x + 2, y + 2, w - 4, 18, PAL.beamDk);
    rect(x + 2, y + 19, w - 4, 1, PAL.goldDk);
    rect(x + 2, y + 20, w - 4, 1, PAL.gold);
    ctx.fillStyle = PAL.goldHi;
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(en, x + w / 2, y + 11);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}

function drawCooldownIcon(x, y, key, label, cd, maxCd, accent) {
  const w = 54, h = 54;
  rect(x, y, w, h, PAL.inkBlack);
  rect(x + 2, y + 2, w - 4, h - 4, PAL.ink);
  rect(x, y, w, 2, PAL.gold);
  rect(x, y + h - 2, w, 2, PAL.gold);
  rect(x, y, 2, h, PAL.gold);
  rect(x + w - 2, y, 2, h, PAL.gold);
  rectO(x + 3, y + 3, w - 6, h - 6, PAL.goldDk);

  if (cd > 0 && maxCd > 0) {
    const pct = cd / maxCd;
    const fillH = ((h - 8) * pct) | 0;
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = PAL.heartDk;
    ctx.fillRect(x + 4, y + h - 4 - fillH, w - 8, fillH);
    ctx.globalAlpha = 1;
  } else {
    ctx.globalAlpha = 0.20 + 0.10 * Math.sin(bgTime * 0.18);
    ctx.fillStyle = accent;
    ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = (cd <= 0) ? PAL.goldHi : PAL.boneDk;
  ctx.font = 'bold 22px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(key, x + w / 2, y + 22);
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = (cd <= 0) ? accent : PAL.boneDk;
  ctx.fillText(label, x + w / 2, y + 42);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawBossHPBar() {
  const barW = 520, barH = 16, barX = (W - barW) / 2, barY = H - 84;
  drawUIPanel(barX - 30, barY - 26, barW + 60, barH + 44, null, 'YAMA  THE  FALLEN  MASTER');
  rect(barX, barY, barW, barH, PAL.inkBlack);
  const pct = clamp(boss.hp / boss.maxHp, 0, 1);
  const fillW = (barW * pct) | 0;
  if (fillW > 0) {
    const gr = ctx.createLinearGradient(barX, barY, barX, barY + barH);
    gr.addColorStop(0, PAL.redHi);
    gr.addColorStop(0.5, PAL.red);
    gr.addColorStop(1, PAL.redDk);
    ctx.fillStyle = gr;
    ctx.fillRect(barX, barY, fillW, barH);
    ctx.fillStyle = PAL.heartHi;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(barX, barY, fillW, 2);
    ctx.globalAlpha = 1;
  }
  rect(barX - 2, barY - 2, barW + 4, 2, PAL.gold);
  rect(barX - 2, barY + barH, barW + 4, 2, PAL.gold);
  rect(barX - 2, barY - 2, 2, barH + 4, PAL.gold);
  rect(barX + barW, barY - 2, 2, barH + 4, PAL.gold);
  rect(barX + barW / 2 - 1, barY - 3, 2, barH + 6, PAL.goldHi);

  ctx.fillStyle = PAL.bone;
  ctx.font = '11px "Press Start 2P", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(Math.max(0, boss.hp | 0) + ' / ' + boss.maxHp, barX + barW - 8, barY + barH / 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

function drawWaveBanner() {
  let a;
  if (waveState.banner === 'in') a = waveState.bannerTimer / 30;
  else if (waveState.banner === 'hold') a = 1;
  else a = 1 - waveState.bannerTimer / 30;

  ctx.globalAlpha = a * 0.7;
  ctx.fillStyle = PAL.inkBlack;
  ctx.fillRect(0, H / 2 - 90, W, 180);
  ctx.globalAlpha = a;

  const w = waves[waveState.current];
  ctx.fillStyle = PAL.gold;
  ctx.fillRect(80, H / 2 - 70, W - 160, 3);
  ctx.fillRect(80, H / 2 + 67, W - 160, 3);
  ctx.fillStyle = PAL.goldDk;
  ctx.fillRect(80, H / 2 - 64, W - 160, 1);
  ctx.fillRect(80, H / 2 + 64, W - 160, 1);

  ctx.fillStyle = PAL.gold;
  ctx.font = 'bold 14px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('STAGE', W / 2, H / 2 - 40);

  ctx.fillStyle = PAL.red;
  ctx.font = 'bold 80px "Press Start 2P", monospace';
  ctx.fillText(romanNumeral(w.id), W / 2, H / 2 + 8);

  ctx.fillStyle = PAL.bone;
  ctx.font = 'bold 14px "Press Start 2P", monospace';
  ctx.fillText('- ' + w.message + ' -', W / 2, H / 2 + 56);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = 1;
}

function drawUI() {
  drawUIPanel(16, 14, 240, 50, null, 'VITALITY');
  const hpPerHeart = 2;
  for (let i = 0; i < 5; i++) {
    const heartHp = clamp(player.hp - i * hpPerHeart, 0, hpPerHeart);
    let fill;
    if (heartHp >= hpPerHeart) fill = 1;
    else if (heartHp >= 1) fill = 0.5;
    else fill = 0;
    drawPixelHeart(30 + i * 22, 34, fill, fill > 0);
  }

  drawUIPanel(16, 72, 240, 32, null, 'SPIRIT');
  const kiX = 30, kiY = 94, kiW = 212, kiH = 6;
  rect(kiX, kiY, kiW, kiH, PAL.kiDk);
  rect(kiX - 1, kiY - 1, kiW + 2, 1, PAL.gold);
  rect(kiX - 1, kiY + kiH, kiW + 2, 1, PAL.gold);
  rect(kiX - 1, kiY - 1, 1, kiH + 2, PAL.gold);
  rect(kiX + kiW, kiY - 1, 1, kiH + 2, PAL.gold);
  const kiPct = player.ki / player.maxKi;
  const fillW = (kiW * kiPct) | 0;
  if (fillW > 0) {
    const gr = ctx.createLinearGradient(kiX, kiY, kiX + kiW, kiY);
    gr.addColorStop(0, PAL.kiDk);
    gr.addColorStop(0.5, PAL.ki);
    gr.addColorStop(1, PAL.kiHi);
    ctx.fillStyle = gr;
    ctx.fillRect(kiX, kiY, fillW, kiH);
    ctx.fillStyle = PAL.bone;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(kiX, kiY, fillW, 1);
    ctx.globalAlpha = 1;
  }
  if (player.ki >= player.maxKi) {
    ctx.globalAlpha = 0.4 + 0.3 * Math.sin(bgTime * 0.2);
    ctx.fillStyle = PAL.kiHi;
    ctx.fillRect(kiX, kiY, kiW, kiH);
    ctx.globalAlpha = 1;
  }

  const curWave = waves[waveState.current];
  drawUIPanel(W / 2 - 150, 14, 300, 50, null, 'STAGE ' + romanNumeral(curWave.id));
  ctx.fillStyle = PAL.heartHi;
  ctx.font = 'bold 14px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(curWave.message, W / 2, 46);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  drawUIPanel(W - 256, 14, 240, 50, null, 'RECORD');
  ctx.fillStyle = PAL.bone;
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(padScore(gameState.score), W - 240, 46);
  ctx.fillStyle = PAL.gold;
  ctx.font = 'bold 12px "Press Start 2P", monospace';
  ctx.fillText('×' + String(gameState.fragments).padStart(2, '0'), W - 80, 46);
  ctx.fillStyle = PAL.goldHi;
  rect(W - 110, 41, 8, 8, PAL.goldHi);
  ctx.fillStyle = PAL.inkBlack;
  rect(W - 109, 42, 6, 6, PAL.inkBlack);
  ctx.fillStyle = PAL.gold;
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('1', W - 106, 46);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  drawCooldownIcon(W - 252, H - 64, 'J', 'SLASH', player.attackCooldown, 22, PAL.bone);
  drawCooldownIcon(W - 192, H - 64, 'K', 'STAR',  player.throwCooldown,  28, PAL.gold);
  drawCooldownIcon(W - 132, H - 64, 'L', 'DASH',  player.dashCooldown,   50, PAL.ki);
  drawCooldownIcon(W - 72,  H - 64, 'I', 'BURST', player.specialCooldown, 90, PAL.heart);

  ctx.fillStyle = PAL.boneDk;
  ctx.font = 'bold 10px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('A D MOVE   SPACE JUMP   M MUTE', 20, H - 24);

  if (player.combo > 1 && player.comboTimer > 0) {
    const a = Math.min(1, player.comboTimer / 30);
    ctx.globalAlpha = a;
    const wx = player.x + player.w / 2;
    const wy = player.y - 14;
    const sx = (wx - CAMERA.x) * CAMERA.zoom;
    const sy = (wy - CAMERA.y) * CAMERA.zoom;
    const scale = 1 + Math.min(0.6, player.combo * 0.06);
    ctx.font = `bold ${(18 * scale) | 0}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = PAL.inkBlack;
    ctx.lineWidth = 5;
    ctx.strokeText('×' + player.combo, sx, sy);
    ctx.fillStyle = PAL.heartHi;
    ctx.fillText('×' + player.combo, sx, sy);
    ctx.font = `bold ${(8 * scale) | 0}px "Press Start 2P", monospace`;
    ctx.strokeText('COMBO', sx, sy + 14 * scale);
    ctx.fillStyle = PAL.gold;
    ctx.fillText('COMBO', sx, sy + 14 * scale);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  if (boss && boss.awakened && boss.state !== 'dead' && boss.spawnEffect <= 0) {
    drawBossHPBar();
  }

  if (waveState.banner !== 'none') {
    drawWaveBanner();
  }
}
