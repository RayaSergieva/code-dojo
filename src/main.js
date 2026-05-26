const gameState = {
  mode: 'title',
  score: 0,
  fragments: 0,
  victory: false,
  defeat: false,
  victoryTimer: 0,
  defeatTimer: 0
};

function startGame() {
  gameState.mode = 'play';
  gameState.score = 0;
  gameState.fragments = 0;
  gameState.victory = false;
  gameState.defeat = false;
  gameState.victoryTimer = 0;
  gameState.defeatTimer = 0;

  player.x = 460;
  player.y = GROUND_Y - player.h;
  player.vx = 0;
  player.vy = 0;
  player.hp = player.maxHp;
  player.ki = 30;
  player.combo = 0;
  player.comboTimer = 0;
  player.facing = 1;
  player.invul = 30;
  player.attackCooldown = 0;
  player.throwCooldown = 0;
  player.dashCooldown = 0;
  player.specialCooldown = 0;

  enemies.length = 0;
  projectiles.length = 0;
  pickups.length = 0;
  particles.length = 0;
  boss = null;

  startWave(0);
}

function update() {
  if (freeze > 0) { freeze--; return; }

  if (consumePressed('KeyM')) {
    muted = !muted;
    SFX.menu();
  }

  if (gameState.mode === 'title') {
    if (consumePressed('Space')) {
      SFX.menu();
      startGame();
    }
    return;
  }

  if (gameState.mode === 'victory' || gameState.mode === 'defeat') {
    if (consumePressed('KeyR')) {
      gameState.mode = 'title';
      bgTime = 0;
    }
    return;
  }

  updatePlayer();
  updateEnemies();
  updateBoss();
  updateProjectiles();
  updatePickups();
  updateParticles();
  updateWaves();

  if (gameState.victory) gameState.mode = 'victory';
  if (gameState.defeat) gameState.mode = 'defeat';

  if (shakeTime > 0) {
    shakeTime--;
    if (shakeTime <= 0) shakeAmount = 0;
  }
}

function draw() {
  updateCamera();

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  if (shakeTime > 0 && shakeAmount > 0) {
    const sx = (Math.random() - 0.5) * shakeAmount;
    const sy = (Math.random() - 0.5) * shakeAmount;
    ctx.translate(sx, sy);
  }
  ctx.scale(CAMERA.zoom, CAMERA.zoom);
  ctx.translate(-CAMERA.x, -CAMERA.y);

  drawBackground();
  drawPickups();
  for (const e of enemies) drawEnemy(e);
  drawBossSprite();
  drawPlayer();
  drawProjectiles();
  drawParticles();

  ctx.restore();

  if (gameState.mode === 'play') drawUI();

  if (player.invul > 50 && player.hp > 0) {
    ctx.globalAlpha = 0.25 * ((player.invul - 50) / 10);
    ctx.fillStyle = PAL.red;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  const vg = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 550);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

  if (boss && boss.awakened) {
    ctx.globalAlpha = 0.05 + 0.03 * Math.sin(bgTime * 0.05);
    ctx.fillStyle = PAL.red;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  if (gameState.mode === 'title') drawTitleScreen();
  else if (gameState.mode === 'victory') drawVictoryScreen();
  else if (gameState.mode === 'defeat') drawDefeatScreen();

  if (muted) {
    ctx.fillStyle = PAL.red;
    ctx.font = 'bold 10px "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('MUTED', W - 10, H - 6);
    ctx.textAlign = 'left';
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
