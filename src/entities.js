const player = {
  x: 460, y: GROUND_Y - 28, w: 14, h: 28,
  vx: 0, vy: 0, facing: 1,
  onGround: false, jumps: 0,
  frame: 0, animTimer: 0,
  hp: 10, maxHp: 10,
  ki: 0, maxKi: 100,
  invul: 0,
  attackCooldown: 0,
  throwCooldown: 0,
  dashCooldown: 0,
  specialCooldown: 0,
  dashing: 0,
  attacking: 0,
  specialActive: 0,
  combo: 0, comboTimer: 0,
  sashSway: 0
};

const enemies = [];
let boss = null;

function updatePlayer() {
  if (player.hp <= 0) return;

  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.throwCooldown > 0) player.throwCooldown--;
  if (player.dashCooldown > 0) player.dashCooldown--;
  if (player.specialCooldown > 0) player.specialCooldown--;
  if (player.invul > 0) player.invul--;
  if (player.attacking > 0) player.attacking--;
  if (player.specialActive > 0) player.specialActive--;
  if (player.dashing > 0) player.dashing--;
  if (player.comboTimer > 0) player.comboTimer--;
  if (player.comboTimer <= 0) player.combo = 0;

  if (player.ki < player.maxKi) player.ki = Math.min(player.maxKi, player.ki + 0.08);

  let mx = 0;
  if (!player.dashing) {
    if (keys.KeyA || keys.ArrowLeft) mx -= 1;
    if (keys.KeyD || keys.ArrowRight) mx += 1;
    if (mx !== 0) player.facing = mx;
    player.vx = lerp(player.vx, mx * 3.2, 0.32);
  } else {
    player.vx = player.facing * 6.5;
  }

  if (consumePressed('Space') && player.jumps < 2) {
    player.vy = -11.5;
    player.jumps++;
    player.onGround = false;
    if (player.jumps === 1) {
      SFX.jump();
      spawnParticles(player.x + player.w / 2, player.y + player.h, {
        n: 6, color: PAL.bone, speed: 1.5, life: 18,
        angle: Math.PI / 2, spread: 0.6, g: 0.1
      });
    } else {
      SFX.djump();
      spawnParticles(player.x + player.w / 2, player.y + player.h, {
        n: 10, color: [PAL.gold, PAL.bone], speed: 2, life: 22,
        angle: Math.PI / 2, spread: Math.PI * 0.7, g: 0.1, glow: 1
      });
    }
  }

  if (consumePressed('KeyJ') || consumePressed('KeyZ')) {
    if (player.attackCooldown <= 0) {
      player.attacking = 14;
      player.attackCooldown = 22;
      SFX.slash();
      const ax = player.x + player.w / 2 + player.facing * 16;
      const ay = player.y + player.h / 2;
      spawnParticles(ax, ay, {
        n: 10, color: [PAL.bone, PAL.niBlade], speed: 3, life: 14,
        angle: player.facing > 0 ? 0 : Math.PI, spread: 1.0, g: 0, glow: 1, shrink: true
      });
      const arc = {
        x: player.facing > 0 ? player.x + player.w : player.x - 22,
        y: player.y + 2, w: 24, h: player.h - 4
      };
      damageEnemiesInArc(arc);
    }
  }

  if (consumePressed('KeyK') || consumePressed('KeyX')) {
    if (player.throwCooldown <= 0 && player.ki >= 15) {
      player.throwCooldown = 28;
      player.ki -= 15;
      projectiles.push({
        x: player.x + player.w / 2, y: player.y + player.h / 2 - 2,
        vx: player.facing * 7, vy: 0,
        w: 7, h: 7, type: 'shuriken', owner: 'player', life: 120,
        rot: 0
      });
      SFX.throw();
    }
  }

  if (consumePressed('KeyL') || consumePressed('ShiftLeft') || consumePressed('ShiftRight')) {
    if (player.dashCooldown <= 0 && player.ki >= 10) {
      player.dashing = 14;
      player.dashCooldown = 50;
      player.invul = 16;
      player.ki -= 10;
      SFX.dash();
      for (let i = 0; i < 14; i++) {
        spawnParticles(player.x + player.w / 2, player.y + player.h - 2, {
          n: 1, color: [PAL.bone, PAL.niLt, PAL.gold], speed: 2.5, life: 22,
          angle: player.facing > 0 ? Math.PI : 0, spread: 0.4, g: 0.04, glow: 1
        });
      }
    }
  }

  if (consumePressed('KeyI') || consumePressed('KeyU')) {
    if (player.specialCooldown <= 0 && player.ki >= 100) {
      player.specialActive = 28;
      player.specialCooldown = 90;
      player.invul = 30;
      player.ki = 0;
      SFX.ki();
      const cx = player.x + player.w / 2, cy = player.y + player.h / 2;
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        spawnParticles(cx, cy, {
          n: 1, color: [PAL.gold, PAL.goldHi, PAL.heart], speed: 4, life: 40,
          angle: a, spread: 0.1, g: 0, glow: 1, drag: 0.96
        });
      }
      for (const e of enemies) {
        if (e.hp > 0) damageEnemy(e, 3, cx);
      }
      if (boss && boss.awakened && boss.state !== 'dead') {
        damageBoss(4);
      }
      shake(14, 18);
    }
  }

  player.vy += 0.55;
  if (player.vy > 16) player.vy = 16;

  player.x += player.vx;
  player.y += player.vy;

  if (player.x < ARENA_LEFT) { player.x = ARENA_LEFT; player.vx = 0; }
  if (player.x + player.w > ARENA_RIGHT) { player.x = ARENA_RIGHT - player.w; player.vx = 0; }

  if (player.y + player.h >= GROUND_Y) {
    if (player.vy > 4 && !player.onGround) SFX.land();
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.onGround = true;
    player.jumps = 0;
  } else {
    player.onGround = false;
  }

  player.animTimer++;
  if (player.animTimer % 8 === 0) player.frame = (player.frame + 1) % 4;
  player.sashSway = Math.sin(player.animTimer * 0.18) * 1.5 + (player.vx * 0.4);

  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    if (aabb({ x: player.x, y: player.y, w: player.w, h: player.h }, p)) {
      if (p.type === 'fragment') {
        gameState.score += 25 + player.combo * 5;
        gameState.fragments++;
        SFX.pickup();
        spawnParticles(p.x + p.w / 2, p.y + p.h / 2, {
          n: 10, color: [PAL.gold, PAL.bone], speed: 2, life: 20, glow: 1
        });
      } else if (p.type === 'heart') {
        player.hp = Math.min(player.maxHp, player.hp + 2);
        SFX.heal();
        spawnParticles(p.x + p.w / 2, p.y + p.h / 2, {
          n: 14, color: [PAL.heart, PAL.heartHi], speed: 2.5, life: 30, glow: 1
        });
      } else if (p.type === 'ki') {
        player.ki = Math.min(player.maxKi, player.ki + 30);
        SFX.pickup();
        spawnParticles(p.x + p.w / 2, p.y + p.h / 2, {
          n: 10, color: [PAL.ki, PAL.kiHi], speed: 2, life: 20, glow: 1
        });
      }
      pickups.splice(i, 1);
    }
  }
}

function damageEnemiesInArc(arc) {
  let hit = false;
  for (const e of enemies) {
    if (e.hp <= 0) continue;
    if (aabb(arc, e)) {
      damageEnemy(e, 1, arc.x + arc.w / 2);
      hit = true;
    }
  }
  if (boss && boss.awakened && boss.state !== 'dead' && aabb(arc, boss)) {
    damageBoss(1);
    hit = true;
  }
  if (hit) {
    player.combo++;
    player.comboTimer = 90;
    if (player.combo > 1) gameState.score += player.combo * 5;
    player.ki = Math.min(player.maxKi, player.ki + 4);
    shake(3, 4);
    freezeFrames(2);
  }
}

function damageEnemy(e, amount, sourceX) {
  e.hp -= amount;
  e.invul = 14;
  e.knockback = (e.x + e.w / 2 < sourceX ? -1 : 1) * 4;
  spawnParticles(e.x + e.w / 2, e.y + e.h / 2, {
    n: 10, color: [PAL.red, PAL.redHi, PAL.bone], speed: 2, life: 20, glow: 1
  });
  if (e.hp <= 0) {
    SFX.enemyDie();
    spawnParticles(e.x + e.w / 2, e.y + e.h / 2, {
      n: 20, color: [PAL.red, PAL.niMain, PAL.bone, PAL.gold], speed: 3, life: 30, glow: 1
    });
    gameState.score += 100 + player.combo * 10;
    const drop = Math.random();
    if (drop < 0.18) {
      pickups.push({ x: e.x + 2, y: e.y + e.h - 6, w: 10, h: 10, type: 'heart', vy: -2, life: 600, bob: Math.random() * Math.PI * 2 });
    } else if (drop < 0.35) {
      pickups.push({ x: e.x + 2, y: e.y + e.h - 6, w: 8, h: 8, type: 'ki', vy: -2, life: 600, bob: Math.random() * Math.PI * 2 });
    } else {
      pickups.push({ x: e.x + 2, y: e.y + e.h - 6, w: 8, h: 8, type: 'fragment', vy: -2, life: 600, bob: Math.random() * Math.PI * 2 });
    }
    waveState.enemiesAlive--;
  } else {
    SFX.enemyHit();
  }
}

function damageBoss(amount) {
  if (boss.invul > 0 || boss.state === 'dead') return;
  boss.hp -= amount;
  boss.invul = 12;
  spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 3, {
    n: 18, color: [PAL.red, PAL.redHi, PAL.bossGold, PAL.bone], speed: 3, life: 28, glow: 1
  });
  SFX.bossHit();
  shake(6, 10);
  if (boss.hp <= 0) {
    boss.state = 'dead';
    boss.deathTimer = 120;
    SFX.bossRoar();
    spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, {
      n: 80, color: [PAL.gold, PAL.goldHi, PAL.bone, PAL.heart], speed: 5, life: 80, glow: 1
    });
    gameState.score += 2500;
    shake(20, 40);
  } else if (boss.hp / boss.maxHp <= 0.5 && !boss.phase2) {
    boss.phase2 = true;
    SFX.bossRoar();
    spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, {
      n: 40, color: [PAL.red, PAL.redHi, PAL.bossGold], speed: 4, life: 50, glow: 1
    });
    shake(12, 24);
  }
}

function spawnPatrolEnemy(x, fromLeft) {
  enemies.push({
    type: 'patrol', x, y: GROUND_Y - 26, w: 14, h: 26,
    vx: fromLeft ? 1.2 : -1.2, vy: 0, facing: fromLeft ? 1 : -1,
    onGround: false, hp: 2, maxHp: 2, invul: 0, knockback: 0,
    aiTimer: 60, state: 'walk', attackCooldown: 0, animTimer: 0, frame: 0,
    spawnEffect: 30
  });
}

function spawnArcherEnemy(x, y, fromLeft) {
  enemies.push({
    type: 'archer', x, y, w: 14, h: 22,
    vx: 0, vy: 0, facing: fromLeft ? 1 : -1,
    onGround: true, hp: 1, maxHp: 1, invul: 0, knockback: 0,
    aiTimer: 90, state: 'aim', shotCooldown: 0, animTimer: 0, frame: 0,
    spawnEffect: 30,
    platformY: y + 22
  });
}

function spawnBoss() {
  boss = {
    x: W / 2 - 22, y: GROUND_Y - 60, w: 44, h: 60,
    vx: 0, vy: 0, facing: -1,
    hp: 40, maxHp: 40, invul: 0,
    state: 'idle', stateTimer: 60, phase2: false, awakened: true,
    onGround: true, frame: 0, animTimer: 0, deathTimer: 0,
    spawnEffect: 90
  };
  SFX.bossRoar();
  shake(10, 20);
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.hp <= 0) { enemies.splice(i, 1); continue; }
    if (e.invul > 0) e.invul--;
    if (e.spawnEffect > 0) e.spawnEffect--;
    e.animTimer++;
    if (e.animTimer % 10 === 0) e.frame = (e.frame + 1) % 4;

    if (e.type === 'patrol') {
      if (Math.abs(e.knockback) > 0.1) {
        e.x += e.knockback;
        e.knockback *= 0.78;
      }
      if (e.spawnEffect <= 0) {
        const dx = player.x - e.x;
        if (Math.abs(dx) > 40) {
          e.facing = dx > 0 ? 1 : -1;
          e.vx = e.facing * 1.5;
        } else if (Math.abs(dx) > 24) {
          e.facing = dx > 0 ? 1 : -1;
          e.vx = e.facing * 1.8;
        } else {
          e.vx *= 0.6;
          if (e.attackCooldown <= 0 && Math.abs(player.y - e.y) < 30) {
            e.attackCooldown = 70;
            e.state = 'attack';
            e.attackTimer = 14;
          }
        }
        if (e.attackCooldown > 0) e.attackCooldown--;
        if (e.state === 'attack' && e.attackTimer > 0) {
          e.attackTimer--;
          if (e.attackTimer === 8) {
            const arc = { x: e.facing > 0 ? e.x + e.w : e.x - 16, y: e.y + 2, w: 18, h: e.h - 4 };
            if (player.invul <= 0 && aabb(arc, player)) {
              hurtPlayer(1, e.x + e.w / 2);
            }
          }
          if (e.attackTimer <= 0) e.state = 'walk';
        }
      }
      e.vy += 0.55;
      if (e.vy > 14) e.vy = 14;
      e.x += e.vx; e.y += e.vy;
      if (e.x < ARENA_LEFT) e.x = ARENA_LEFT;
      if (e.x + e.w > ARENA_RIGHT) e.x = ARENA_RIGHT - e.w;
      if (e.y + e.h >= GROUND_Y) { e.y = GROUND_Y - e.h; e.vy = 0; e.onGround = true; }
    } else if (e.type === 'archer') {
      if (e.spawnEffect <= 0) {
        const dx = player.x - e.x;
        e.facing = dx > 0 ? 1 : -1;
        if (e.shotCooldown <= 0) {
          e.shotCooldown = 100;
          const sx = e.x + e.w / 2, sy = e.y + 8;
          const tx = player.x + player.w / 2, ty = player.y + player.h / 2;
          const ang = Math.atan2(ty - sy, tx - sx);
          const speed = 5;
          projectiles.push({
            x: sx, y: sy, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
            w: 10, h: 3, type: 'arrow', owner: 'enemy', life: 180, rot: ang
          });
          SFX.throw();
        } else {
          e.shotCooldown--;
        }
      }
    }
  }
}

function updateBoss() {
  if (!boss) return;
  if (boss.spawnEffect > 0) { boss.spawnEffect--; return; }
  boss.animTimer++;
  if (boss.animTimer % 12 === 0) boss.frame = (boss.frame + 1) % 4;
  if (boss.invul > 0) boss.invul--;

  if (boss.state === 'dead') {
    boss.deathTimer--;
    if (boss.animTimer % 4 === 0) {
      spawnParticles(boss.x + Math.random() * boss.w, boss.y + Math.random() * boss.h, {
        n: 3, color: [PAL.gold, PAL.bossGold, PAL.bone, PAL.heart], speed: 2, life: 40, glow: 1
      });
    }
    if (boss.deathTimer <= 0) {
      spawnParticles(boss.x + boss.w / 2, boss.y + boss.h / 2, {
        n: 60, color: [PAL.gold, PAL.goldHi, PAL.bone], speed: 5, life: 80, glow: 1
      });
      boss = null;
      gameState.victory = true;
      gameState.victoryTimer = 0;
      SFX.win();
    }
    return;
  }

  boss.stateTimer--;
  const dx = (player.x + player.w / 2) - (boss.x + boss.w / 2);
  boss.facing = dx > 0 ? 1 : -1;

  if (boss.state === 'idle') {
    boss.vx *= 0.85;
    if (boss.stateTimer <= 0) {
      const choices = ['charge', 'slash', 'wave'];
      if (boss.phase2) choices.push('slam', 'slash');
      const choice = choices[(Math.random() * choices.length) | 0];
      boss.state = choice;
      boss.stateTimer = { charge: 70, slash: 50, slam: 60, wave: 50 }[choice];
    }
  } else if (boss.state === 'charge') {
    boss.vx = boss.facing * 4.2;
    if (Math.abs(dx) < 50 && boss.stateTimer > 10) {
      if (player.invul <= 0 && aabb({ x: boss.x, y: boss.y, w: boss.w, h: boss.h }, player)) {
        hurtPlayer(2, boss.x + boss.w / 2);
      }
    }
    if (boss.stateTimer <= 0) { boss.state = 'idle'; boss.stateTimer = 30; boss.vx = 0; }
  } else if (boss.state === 'slash') {
    boss.vx *= 0.4;
    if (boss.stateTimer === 20) {
      const arc = {
        x: boss.facing > 0 ? boss.x + boss.w : boss.x - 44,
        y: boss.y + 8, w: 44, h: boss.h - 12
      };
      spawnParticles(arc.x + arc.w / 2, arc.y + arc.h / 2, {
        n: 14, color: [PAL.gold, PAL.bone, PAL.red], speed: 4, life: 20,
        angle: boss.facing > 0 ? 0 : Math.PI, spread: 0.8, glow: 1
      });
      if (player.invul <= 0 && aabb(arc, player)) hurtPlayer(2, arc.x);
    }
    if (boss.stateTimer <= 0) { boss.state = 'idle'; boss.stateTimer = 40; }
  } else if (boss.state === 'slam') {
    if (boss.stateTimer > 40) {
      boss.vy = -10;
      boss.onGround = false;
    }
    if (boss.onGround && boss.vy >= 0 && boss.stateTimer < 50) {
      for (let s = -1; s <= 1; s += 2) {
        projectiles.push({
          x: boss.x + boss.w / 2, y: GROUND_Y - 8, vx: s * 4, vy: 0,
          w: 16, h: 10, type: 'shockwave', owner: 'enemy', life: 80, rot: 0
        });
      }
      shake(10, 16);
      spawnParticles(boss.x + boss.w / 2, GROUND_Y, {
        n: 24, color: [PAL.beamLt, PAL.beamMd, PAL.gold], speed: 4, life: 30,
        angle: -Math.PI / 2, spread: Math.PI, g: 0.3
      });
      boss.state = 'idle';
      boss.stateTimer = 50;
    }
  } else if (boss.state === 'wave') {
    boss.vx *= 0.5;
    if (boss.stateTimer === 25) {
      for (let s = -1; s <= 1; s++) {
        projectiles.push({
          x: boss.x + boss.w / 2, y: boss.y + boss.h / 2,
          vx: boss.facing * 4 + s * 0.5, vy: s * 1.5,
          w: 14, h: 14, type: 'kiwave', owner: 'enemy', life: 100, rot: 0
        });
      }
      SFX.throw();
    }
    if (boss.stateTimer <= 0) { boss.state = 'idle'; boss.stateTimer = 30; }
  }

  boss.vy += 0.55;
  if (boss.vy > 14) boss.vy = 14;
  boss.x += boss.vx;
  boss.y += boss.vy;
  if (boss.x < ARENA_LEFT - 10) boss.x = ARENA_LEFT - 10;
  if (boss.x + boss.w > ARENA_RIGHT + 10) boss.x = ARENA_RIGHT + 10 - boss.w;
  if (boss.y + boss.h >= GROUND_Y) {
    if (!boss.onGround && boss.vy > 4) shake(6, 10);
    boss.y = GROUND_Y - boss.h;
    boss.vy = 0;
    boss.onGround = true;
  } else {
    boss.onGround = false;
  }
}

function hurtPlayer(amount, sourceX) {
  if (player.invul > 0 || player.hp <= 0) return;
  player.hp -= amount;
  player.invul = 60;
  player.combo = 0;
  player.comboTimer = 0;
  player.vx = (player.x + player.w / 2 < sourceX ? -1 : 1) * 4;
  player.vy = -4;
  SFX.hit();
  shake(8, 14);
  spawnParticles(player.x + player.w / 2, player.y + player.h / 2, {
    n: 14, color: [PAL.red, PAL.redHi, PAL.heart], speed: 2.5, life: 24, glow: 1
  });
  if (player.hp <= 0) {
    player.hp = 0;
    gameState.defeat = true;
    gameState.defeatTimer = 0;
    SFX.lose();
  }
}

function drawPlayer() {
  if (player.hp <= 0) return;
  if (player.invul > 0 && Math.floor(player.invul / 3) % 2 === 0) return;

  const x = player.x | 0, y = player.y | 0;
  const f = player.facing;
  const fr = player.frame;
  const bob = (!player.onGround) ? 0 : (Math.abs(player.vx) > 0.5 ? Math.sin(player.animTimer * 0.25) * 1 : 0);

  if (player.specialActive > 0) {
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.2 + Math.random() * 0.2;
      ctx.fillStyle = [PAL.gold, PAL.goldHi, PAL.heart][i % 3];
      ctx.beginPath();
      ctx.arc(x + player.w / 2, y + player.h / 2, 18 + i * 4 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (player.dashing > 0) {
    for (let i = 1; i < 4; i++) {
      ctx.globalAlpha = 0.25 / i;
      drawNinjaSprite(x - f * i * 4, y, f, fr, 0);
    }
    ctx.globalAlpha = 1;
  }

  drawNinjaSprite(x, y + bob, f, fr, player.attacking);
}

function drawEnemy(e) {
  if (e.spawnEffect > 0) {
    ctx.globalAlpha = 1 - e.spawnEffect / 30;
    if (Math.floor(e.spawnEffect / 4) % 2 === 0) ctx.globalAlpha *= 0.5;
  }
  if (e.invul > 0 && Math.floor(e.invul / 3) % 2 === 0) ctx.globalAlpha *= 0.4;

  if (e.type === 'patrol') drawPatrolSprite(e);
  else if (e.type === 'archer') drawArcherSprite(e);
  ctx.globalAlpha = 1;
}
