const waves = [
  { id: 1, enemies: [{ type: 'patrol', count: 2 }], message: 'OPENING FORM' },
  { id: 2, enemies: [{ type: 'patrol', count: 3 }], message: 'RISING TIDE' },
  { id: 3, enemies: [{ type: 'patrol', count: 2 }, { type: 'archer', count: 1 }], message: 'CROSSED BLADES' },
  { id: 4, enemies: [{ type: 'patrol', count: 3 }, { type: 'archer', count: 2 }], message: 'STORM OF STEEL' },
  { id: 5, enemies: [{ type: 'boss', count: 1 }], message: 'THE MASTER AWAKENS' }
];

const waveState = {
  current: 0,
  enemiesAlive: 0,
  banner: 'none',
  bannerTimer: 0,
  betweenTimer: 0,
  active: false
};

function startWave(idx) {
  waveState.current = idx;
  waveState.banner = 'in';
  waveState.bannerTimer = 0;
  waveState.active = false;
  SFX.bell();
}

function spawnWaveEnemies() {
  const w = waves[waveState.current];
  let countTotal = 0;
  for (const grp of w.enemies) {
    for (let i = 0; i < grp.count; i++) {
      if (grp.type === 'patrol') {
        const fromLeft = i % 2 === 0;
        const x = fromLeft ? ARENA_LEFT + 20 + i * 8 : ARENA_RIGHT - 30 - i * 8;
        spawnPatrolEnemy(x, fromLeft);
        countTotal++;
      } else if (grp.type === 'archer') {
        const fromLeft = i % 2 === 0;
        const ax = fromLeft ? 150 + i * 30 : W - 180 - i * 30;
        const ay = 360;
        spawnArcherEnemy(ax, ay, fromLeft);
        countTotal++;
      } else if (grp.type === 'boss') {
        spawnBoss();
        countTotal++;
      }
    }
  }
  waveState.enemiesAlive = countTotal;
  waveState.active = true;
}

function updateWaves() {
  if (waveState.banner === 'in') {
    waveState.bannerTimer++;
    if (waveState.bannerTimer >= 30) { waveState.banner = 'hold'; waveState.bannerTimer = 0; }
  } else if (waveState.banner === 'hold') {
    waveState.bannerTimer++;
    if (waveState.bannerTimer >= 80) { waveState.banner = 'out'; waveState.bannerTimer = 0; }
  } else if (waveState.banner === 'out') {
    waveState.bannerTimer++;
    if (waveState.bannerTimer >= 30) {
      waveState.banner = 'none';
      waveState.bannerTimer = 0;
      spawnWaveEnemies();
      SFX.waveStart();
    }
  }

  if (waveState.active && waveState.enemiesAlive <= 0) {
    if (!waves[waveState.current].enemies.some(g => g.type === 'boss')) {
      waveState.active = false;
      waveState.betweenTimer = 90;
      SFX.waveEnd();
      player.hp = Math.min(player.maxHp, player.hp + 1);
    }
  }
  if (!waveState.active && waveState.banner === 'none' && waveState.betweenTimer > 0) {
    waveState.betweenTimer--;
    if (waveState.betweenTimer <= 0 && waveState.current + 1 < waves.length) {
      startWave(waveState.current + 1);
    }
  }
}
