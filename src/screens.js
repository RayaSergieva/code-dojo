function drawTitleScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, W, H);

  const tx = W / 2 - 220, ty = 80, tw = 440, th = 200;
  const pg = ctx.createLinearGradient(0, ty, 0, ty + th);
  pg.addColorStop(0, PAL.paper);
  pg.addColorStop(1, PAL.paperDk);
  ctx.fillStyle = pg;
  ctx.fillRect(tx, ty, tw, th);
  rectO(tx, ty, tw, th, PAL.goldDk);
  rectO(tx + 4, ty + 4, tw - 8, th - 8, PAL.gold);
  rect(tx - 6, ty - 4, tw + 12, 6, PAL.beamDk);
  rect(tx - 6, ty - 4, tw + 12, 1, PAL.beamLt);
  rect(tx - 6, ty + th - 2, tw + 12, 6, PAL.beamDk);
  rect(tx - 6, ty + th - 2, tw + 12, 1, PAL.beamLt);

  const crestX = W / 2, crestY = ty + 50;
  ctx.save();
  ctx.translate(crestX, crestY);
  ctx.save();
  ctx.rotate(-Math.PI / 4);
  rect(-2, -22, 4, 38, PAL.inkBlack);
  rect(-1, -22, 2, 38, PAL.boneDk);
  rect(-5, 12, 10, 3, PAL.goldDk);
  ctx.restore();
  ctx.save();
  ctx.rotate(Math.PI / 4);
  rect(-2, -22, 4, 38, PAL.inkBlack);
  rect(-1, -22, 2, 38, PAL.boneDk);
  rect(-5, 12, 10, 3, PAL.goldDk);
  ctx.restore();
  rect(-4, -4, 8, 8, PAL.gold);
  rect(-3, -3, 6, 6, PAL.goldHi);
  rect(-2, -2, 4, 4, PAL.gold);
  rect(-1, -1, 2, 2, PAL.inkBlack);
  ctx.restore();

  ctx.fillStyle = PAL.inkBlack;
  ctx.font = 'bold 44px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DOJO', W / 2, ty + 110);
  ctx.fillStyle = PAL.redDk;
  ctx.font = 'bold 22px "Press Start 2P", monospace';
  ctx.fillText('OF BYTES', W / 2, ty + 150);
  ctx.fillStyle = PAL.paperSh;
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.fillText('- A DUEL OF CODE AND STEEL -', W / 2, ty + 178);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  for (let i = 0; i < 5; i++) {
    const rotL = bgTime * 0.04 + i * 1.2;
    drawSmallShuriken(60 + i * 6, 200 + Math.sin(bgTime * 0.03 + i) * 30, rotL);
    drawSmallShuriken(W - 60 - i * 6, 200 + Math.cos(bgTime * 0.03 + i) * 30, -rotL);
  }

  if (Math.floor(bgTime / 30) % 2 === 0) {
    ctx.fillStyle = PAL.gold;
    ctx.font = 'bold 14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESS SPACE TO BEGIN', W / 2, H - 130);
    ctx.textAlign = 'left';
  }

  drawUIPanel(W / 2 - 320, H - 100, 640, 70, null, 'CONTROLS');
  ctx.fillStyle = PAL.bone;
  ctx.font = '9px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('A D MOVE     SPACE JUMP/DOUBLE     J SLASH', W / 2, H - 64);
  ctx.fillText('K SHURIKEN (15)   L DASH (10)   I KI BURST (100)', W / 2, H - 46);
  ctx.textAlign = 'left';
}

function drawVictoryScreen() {
  gameState.victoryTimer++;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);

  const tx = W / 2 - 220, ty = 100, tw = 440, th = 280;
  const pg = ctx.createLinearGradient(0, ty, 0, ty + th);
  pg.addColorStop(0, PAL.paper);
  pg.addColorStop(1, PAL.paperDk);
  ctx.fillStyle = pg;
  ctx.fillRect(tx, ty, tw, th);
  rectO(tx, ty, tw, th, PAL.goldDk);
  rectO(tx + 4, ty + 4, tw - 8, th - 8, PAL.gold);
  rect(tx - 6, ty - 4, tw + 12, 6, PAL.beamDk);
  rect(tx - 6, ty - 4, tw + 12, 1, PAL.beamLt);
  rect(tx - 6, ty + th - 2, tw + 12, 6, PAL.beamDk);
  rect(tx - 6, ty + th - 2, tw + 12, 1, PAL.beamLt);

  const cx = W / 2;
  ctx.fillStyle = PAL.redDk;
  ctx.font = 'bold 56px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VICTORY', cx, ty + 100);
  ctx.fillStyle = PAL.gold;
  rect(tx + 60, ty + 142, tw - 120, 3, PAL.gold);
  rect(tx + 80, ty + 148, tw - 160, 1, PAL.goldDk);
  ctx.fillStyle = PAL.paperSh;
  ctx.font = '11px "Press Start 2P", monospace';
  ctx.fillText('THE FALLEN MASTER IS DEFEATED', cx, ty + 172);
  ctx.fillText('THE DOJO STANDS', cx, ty + 190);

  ctx.fillStyle = PAL.inkBlack;
  ctx.font = 'bold 11px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE', tx + 80, ty + 224);
  ctx.fillText('FRAGMENTS', tx + 80, ty + 246);
  ctx.fillStyle = PAL.redDk;
  ctx.font = 'bold 13px "Press Start 2P", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(padScore(gameState.score), tx + tw - 80, ty + 224);
  ctx.fillText('×' + gameState.fragments, tx + tw - 80, ty + 246);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  if (Math.floor(gameState.victoryTimer / 30) % 2 === 0) {
    ctx.fillStyle = PAL.gold;
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESS R TO BEGIN ANEW', W / 2, H - 60);
    ctx.textAlign = 'left';
  }
}

function drawDefeatScreen() {
  gameState.defeatTimer++;
  ctx.fillStyle = 'rgba(40,8,8,0.65)';
  ctx.fillRect(0, 0, W, H);

  const tx = W / 2 - 220, ty = 100, tw = 440, th = 280;
  ctx.fillStyle = '#2a1818';
  ctx.fillRect(tx, ty, tw, th);
  rectO(tx, ty, tw, th, PAL.redDk);
  rectO(tx + 4, ty + 4, tw - 8, th - 8, PAL.red);
  rect(tx - 6, ty - 4, tw + 12, 6, PAL.beamDk);
  rect(tx - 6, ty - 4, tw + 12, 1, PAL.beamLt);
  rect(tx - 6, ty + th - 2, tw + 12, 6, PAL.beamDk);
  rect(tx - 6, ty + th - 2, tw + 12, 1, PAL.beamLt);

  const cx = W / 2;
  ctx.fillStyle = PAL.redHi;
  ctx.font = 'bold 50px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DEFEATED', cx, ty + 100);
  ctx.fillStyle = PAL.red;
  rect(tx + 60, ty + 142, tw - 120, 3, PAL.red);
  rect(tx + 80, ty + 148, tw - 160, 1, PAL.redDk);
  ctx.fillStyle = PAL.boneDk;
  ctx.font = '11px "Press Start 2P", monospace';
  ctx.fillText('THE SHADOWS CLAIM ANOTHER', cx, ty + 172);
  ctx.fillText('RISE AGAIN', cx, ty + 190);

  ctx.fillStyle = PAL.bone;
  ctx.font = 'bold 11px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE', tx + 80, ty + 224);
  ctx.fillText('STAGE', tx + 80, ty + 246);
  ctx.fillStyle = PAL.redHi;
  ctx.font = 'bold 13px "Press Start 2P", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(padScore(gameState.score), tx + tw - 80, ty + 224);
  ctx.fillText(romanNumeral(waves[waveState.current].id) + ' / V', tx + tw - 80, ty + 246);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  if (Math.floor(gameState.defeatTimer / 30) % 2 === 0) {
    ctx.fillStyle = PAL.redHi;
    ctx.font = 'bold 12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESS R TO TRY AGAIN', W / 2, H - 60);
    ctx.textAlign = 'left';
  }
}
