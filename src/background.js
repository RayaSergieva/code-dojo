const stars = [];
for (let i = 0; i < 70; i++) {
  stars.push({
    x: Math.random() * W,
    y: Math.random() * 180,
    b: Math.random() * 0.5 + 0.3,
    tw: Math.random() * Math.PI * 2
  });
}

const petals = [];
for (let i = 0; i < 35; i++) {
  petals.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: -0.2 - Math.random() * 0.4,
    vy: 0.2 + Math.random() * 0.4,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.04,
    size: 2 + Math.random() * 2,
    col: [PAL.blossom, PAL.blossomLt, PAL.blossomDk][(Math.random() * 3) | 0]
  });
}

let bgTime = 0;

function drawBackground() {
  bgTime++;

  const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  grad.addColorStop(0, PAL.skyTop);
  grad.addColorStop(0.45, PAL.skyMid);
  grad.addColorStop(0.85, PAL.skyHorz);
  grad.addColorStop(1, PAL.skyGlow);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, GROUND_Y);

  for (const s of stars) {
    const tw = 0.5 + 0.5 * Math.sin(bgTime * 0.04 + s.tw);
    ctx.globalAlpha = s.b * tw;
    ctx.fillStyle = '#f0e8c8';
    ctx.fillRect(s.x | 0, s.y | 0, 1, 1);
  }
  ctx.globalAlpha = 1;

  const mx = 780, my = 80, mr = 24;
  for (let r = mr + 18; r > mr; r -= 2) {
    ctx.globalAlpha = 0.04 * ((mr + 20 - r) / 20);
    ctx.fillStyle = PAL.moon;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = PAL.moon;
  ctx.beginPath();
  ctx.arc(mx, my, mr, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PAL.moonShade;
  ctx.beginPath();
  ctx.arc(mx - 8, my - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mx + 6, my + 8, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mx - 2, my + 10, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PAL.mtnFar;
  ctx.beginPath();
  ctx.moveTo(0, 280);
  const farPts = [[0,280],[80,240],[160,200],[240,220],[320,180],[420,210],[520,170],[620,200],[720,230],[820,200],[900,220],[W,250]];
  for (const p of farPts) ctx.lineTo(p[0], p[1]);
  ctx.lineTo(W, 320); ctx.lineTo(0, 320); ctx.closePath(); ctx.fill();

  ctx.fillStyle = PAL.mtnMid;
  ctx.beginPath();
  ctx.moveTo(0, 310);
  const midPts = [[0,310],[60,290],[140,250],[220,280],[300,240],[380,265],[460,230],[540,260],[620,250],[700,280],[780,265],[860,290],[W,300]];
  for (const p of midPts) ctx.lineTo(p[0], p[1]);
  ctx.lineTo(W, 340); ctx.lineTo(0, 340); ctx.closePath(); ctx.fill();

  ctx.fillStyle = PAL.snow;
  snowCap(140, 250, 14);
  snowCap(300, 240, 16);
  snowCap(460, 230, 18);
  snowCap(620, 250, 14);
  snowCap(780, 265, 12);
  ctx.globalAlpha = 1;

  drawPagoda(160, 320);
  drawCherryTree(0, 360, true);
  drawCherryTree(W, 360, false);
  drawDojoWall();
  drawFloor();
  drawHangingLanterns();
}

function snowCap(cx, cy, w) {
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(cx - w, cy + w * 0.6);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + w, cy + w * 0.6);
  ctx.lineTo(cx + w * 0.3, cy + w * 0.5);
  ctx.lineTo(cx, cy + w * 0.3);
  ctx.lineTo(cx - w * 0.4, cy + w * 0.6);
  ctx.closePath();
  ctx.fill();
}

function drawPagoda(cx, baseY) {
  ctx.fillStyle = PAL.pagodaDark;
  rect(cx - 26, baseY - 8, 52, 8, PAL.pagodaDark);
  rect(cx - 22, baseY - 30, 44, 22, PAL.pagodaDark);
  ctx.beginPath();
  ctx.moveTo(cx - 32, baseY - 30);
  ctx.lineTo(cx - 22, baseY - 38);
  ctx.lineTo(cx + 22, baseY - 38);
  ctx.lineTo(cx + 32, baseY - 30);
  ctx.lineTo(cx + 26, baseY - 34);
  ctx.lineTo(cx - 26, baseY - 34);
  ctx.closePath();
  ctx.fill();
  rect(cx - 18, baseY - 58, 36, 20, PAL.pagodaDark);
  ctx.beginPath();
  ctx.moveTo(cx - 26, baseY - 58);
  ctx.lineTo(cx - 18, baseY - 64);
  ctx.lineTo(cx + 18, baseY - 64);
  ctx.lineTo(cx + 26, baseY - 58);
  ctx.lineTo(cx + 22, baseY - 62);
  ctx.lineTo(cx - 22, baseY - 62);
  ctx.closePath();
  ctx.fill();
  rect(cx - 12, baseY - 80, 24, 16, PAL.pagodaDark);
  ctx.beginPath();
  ctx.moveTo(cx - 20, baseY - 80);
  ctx.lineTo(cx - 12, baseY - 88);
  ctx.lineTo(cx + 12, baseY - 88);
  ctx.lineTo(cx + 20, baseY - 80);
  ctx.closePath();
  ctx.fill();
  rect(cx - 1, baseY - 94, 2, 6, PAL.pagodaDark);
  rect(cx - 2, baseY - 94, 4, 1, PAL.pagodaDark);

  ctx.fillStyle = '#5a3018';
  rect(cx - 14, baseY - 22, 4, 8, '#5a3018');
  rect(cx - 2, baseY - 22, 4, 8, '#5a3018');
  rect(cx + 10, baseY - 22, 4, 8, '#5a3018');
  rect(cx - 12, baseY - 50, 4, 6, '#5a3018');
  rect(cx - 2, baseY - 50, 4, 6, '#5a3018');
  rect(cx + 8, baseY - 50, 4, 6, '#5a3018');
  rect(cx - 6, baseY - 72, 4, 6, '#5a3018');
  rect(cx + 2, baseY - 72, 4, 6, '#5a3018');

  ctx.fillStyle = PAL.pagodaTrim;
  rect(cx - 26, baseY - 34, 52, 1, PAL.pagodaTrim);
  rect(cx - 22, baseY - 62, 44, 1, PAL.pagodaTrim);
}

function drawCherryTree(rootX, rootY, leftSide) {
  const sign = leftSide ? 1 : -1;
  ctx.fillStyle = PAL.branch;
  for (let i = 0; i < 80; i++) {
    const t = i / 80;
    const tx = rootX + sign * (8 + t * 60 - Math.sin(t * 3) * 8);
    const ty = rootY - 30 - i * 1.8;
    rect(tx - 2, ty, 4, 3, PAL.branch);
  }
  const branches = leftSide
    ? [[40,330,-0.4],[55,290,-0.6],[35,260,-0.3],[60,230,-0.5],[45,200,-0.4],[65,170,-0.5]]
    : [[W-40,330,0.4],[W-55,290,0.6],[W-35,260,0.3],[W-60,230,0.5],[W-45,200,0.4],[W-65,170,0.5]];
  for (const [bx, by] of branches) {
    ctx.fillStyle = PAL.branch;
    for (let i = 0; i < 14; i++) {
      const dx = (leftSide ? 1 : -1) * (i * 2);
      const dy = -i * 1.2 + Math.sin(i * 0.5) * 2;
      rect(bx + dx, by + dy, 3, 2, PAL.branch);
    }
    const tipX = bx + (leftSide ? 1 : -1) * 28;
    const tipY = by - 16;
    drawBlossomCluster(tipX, tipY, 14);
  }
}

function drawBlossomCluster(cx, cy, r) {
  ctx.fillStyle = PAL.blossomDk;
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * r;
    rect(cx + Math.cos(a) * d - 1, cy + Math.sin(a) * d - 1, 3, 3, PAL.blossomDk);
  }
  ctx.fillStyle = PAL.blossom;
  for (let i = 0; i < 22; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * r * 0.85;
    rect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 2, 2, PAL.blossom);
  }
  ctx.fillStyle = PAL.blossomLt;
  for (let i = 0; i < 10; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * r * 0.5;
    rect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1, 1, PAL.blossomLt);
  }
}

function drawDojoWall() {
  const wallTop = 280;
  const wallBot = GROUND_Y;
  const wallH = wallBot - wallTop;

  rect(0, wallTop, W, 18, PAL.beamDk);
  rect(0, wallTop, W, 4, PAL.beamLt);
  rect(0, wallTop + 15, W, 3, PAL.beamMd);
  for (let x = 0; x < W; x += 22) {
    rect(x, wallTop + 6, 1, 8, 'rgba(0,0,0,0.3)');
    rect(x + 8, wallTop + 4, 1, 12, 'rgba(255,200,120,0.06)');
  }
  rect(0, wallTop + 18, W, 1, PAL.gold);

  const cols = [40, 240, 480, 720, W - 40 - 22];
  const colW = 22;
  const shojiY = wallTop + 22;
  const shojiH = wallH - 40;
  const shojiAreas = [
    [cols[0] + colW, cols[1]],
    [cols[1] + colW, cols[2]],
    [cols[2] + colW, cols[3]],
    [cols[3] + colW, cols[4]]
  ];

  for (let i = 0; i < shojiAreas.length; i++) {
    drawShojiPanel(shojiAreas[i][0], shojiY, shojiAreas[i][1] - shojiAreas[i][0], shojiH, i);
  }

  drawHangingScroll(W / 2 - 28, wallTop - 50, 56, 70);
  drawSideBanner(20, wallTop - 30);
  drawSideBanner(W - 36, wallTop - 30);

  for (const cx of cols) {
    drawColumn(cx, wallTop, colW, wallH);
  }

  rect(0, wallBot - 12, W, 5, PAL.beamDk);
  rect(0, wallBot - 12, W, 1, PAL.beamLt);
  rect(0, wallBot - 7, W, 1, PAL.gold);
}

function drawShojiPanel(x, y, w, h, idx) {
  rect(x, y, w, h, PAL.shojiDk);
  const pg = ctx.createLinearGradient(0, y, 0, y + h);
  pg.addColorStop(0, PAL.shojiHot);
  pg.addColorStop(0.5, PAL.shojiPap);
  pg.addColorStop(1, PAL.shojiCool);
  ctx.fillStyle = pg;
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 20; i++) {
    rect(x + 2 + Math.random() * (w - 4), y + 2 + Math.random() * (h - 4), 1, 1, '#8a6020');
  }
  ctx.globalAlpha = 1;

  const ncols = 3, nrows = 5;
  const gw = (w - 4) / ncols, gh = (h - 4) / nrows;
  ctx.fillStyle = PAL.shojiDk;
  for (let i = 1; i < ncols; i++) ctx.fillRect((x + 2 + i * gw) | 0, y + 2, 1, h - 4);
  for (let j = 1; j < nrows; j++) ctx.fillRect(x + 2, (y + 2 + j * gh) | 0, w - 4, 1);

  if (idx === 1) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    const sx = x + w / 2, sy = y + h - 20;
    rect(sx - 2, sy - 12, 4, 12, 'rgba(0,0,0,0.18)');
    ctx.beginPath();
    ctx.arc(sx - 6, sy - 18, 6, 0, Math.PI * 2);
    ctx.arc(sx + 5, sy - 16, 5, 0, Math.PI * 2);
    ctx.arc(sx - 1, sy - 22, 7, 0, Math.PI * 2);
    ctx.fill();
  } else if (idx === 2) {
    ctx.fillStyle = 'rgba(0,0,0,0.20)';
    const sx = x + w / 2, sy = y + h - 14;
    rect(sx - 7, sy - 22, 14, 18, 'rgba(0,0,0,0.20)');
    rect(sx - 4, sy - 30, 8, 8, 'rgba(0,0,0,0.20)');
    rect(sx - 9, sy - 16, 18, 5, 'rgba(0,0,0,0.20)');
  }
}

function drawColumn(x, y, w, h) {
  rect(x, y, w, h, PAL.beamMd);
  rect(x, y, 3, h, PAL.beamLt);
  rect(x + 1, y, 1, h, PAL.beamHi);
  rect(x + w - 3, y, 3, h, PAL.beamDk);
  rect(x + w - 1, y, 1, h, '#1a0f06');
  rect(x - 2, y, w + 4, 5, PAL.beamDk);
  rect(x - 2, y, w + 4, 1, PAL.beamLt);
  rect(x - 2, y + 5, w + 4, 1, PAL.gold);
  rect(x - 2, y + h - 6, w + 4, 6, PAL.beamDk);
  rect(x - 2, y + h - 6, w + 4, 1, PAL.gold);
  for (let i = 8; i < h - 8; i += 14) {
    rect(x + 4, y + i, 1, 6, 'rgba(0,0,0,0.3)');
    rect(x + w - 6, y + i + 4, 1, 6, 'rgba(0,0,0,0.3)');
  }
  const ey = y + h / 2 - 6;
  rect(x + w / 2 - 4, ey, 8, 8, PAL.beamDk);
  rect(x + w / 2 - 3, ey + 1, 6, 6, PAL.gold);
  rect(x + w / 2 - 2, ey + 2, 4, 4, PAL.beamDk);
  rect(x + w / 2 - 1, ey + 3, 2, 2, PAL.gold);
}

function drawHangingScroll(x, y, w, h) {
  rect(x - 4, y - 3, w + 8, 4, PAL.beamDk);
  rect(x - 4, y - 3, w + 8, 1, PAL.beamLt);
  rect(x - 6, y - 3, 2, 6, PAL.beamDk);
  rect(x + w + 4, y - 3, 2, 6, PAL.beamDk);

  const pg = ctx.createLinearGradient(0, y, 0, y + h);
  pg.addColorStop(0, PAL.paper);
  pg.addColorStop(1, PAL.paperDk);
  ctx.fillStyle = pg;
  ctx.fillRect(x, y, w, h);
  rectO(x, y, w, h, PAL.goldDk);
  rectO(x + 2, y + 2, w - 4, h - 4, PAL.gold);

  const cx = x + w / 2;
  ctx.save();
  ctx.translate(cx, y + 18);
  ctx.rotate(-Math.PI / 4);
  rect(-1, -10, 2, 18, PAL.inkBlack);
  rect(0, -10, 1, 18, PAL.boneDk);
  rect(-3, 6, 6, 2, PAL.goldDk);
  ctx.restore();
  ctx.save();
  ctx.translate(cx, y + 18);
  ctx.rotate(Math.PI / 4);
  rect(-1, -10, 2, 18, PAL.inkBlack);
  rect(0, -10, 1, 18, PAL.boneDk);
  rect(-3, 6, 6, 2, PAL.goldDk);
  ctx.restore();
  rect(cx - 2, y + 16, 4, 4, PAL.gold);
  rect(cx - 1, y + 17, 2, 2, PAL.goldHi);

  ctx.fillStyle = PAL.inkBlack;
  ctx.font = 'bold 10px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const letters = ['D', 'O', 'J', 'O'];
  for (let i = 0; i < letters.length; i++) {
    ctx.fillText(letters[i], cx, y + 34 + i * 9);
  }
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  rect(x - 4, y + h - 1, w + 8, 4, PAL.beamDk);
  rect(x - 4, y + h - 1, w + 8, 1, PAL.beamLt);
  rect(x - 2, y + h + 3, 1, 6, '#c8302e');
  rect(x + w + 1, y + h + 3, 1, 6, '#c8302e');
}

function drawSideBanner(x, y) {
  rect(x, y, 16, 26, PAL.lanternDk);
  rect(x + 1, y + 1, 14, 24, PAL.lanternRed);
  rect(x + 1, y + 1, 14, 2, PAL.lanternHi);
  const cx = x + 8, cy = y + 13;
  rect(cx, cy - 4, 1, 1, PAL.gold);
  rect(cx - 1, cy - 3, 3, 1, PAL.gold);
  rect(cx - 2, cy - 2, 5, 1, PAL.gold);
  rect(cx - 3, cy - 1, 7, 1, PAL.gold);
  rect(cx - 3, cy,     7, 1, PAL.goldHi);
  rect(cx - 3, cy + 1, 7, 1, PAL.gold);
  rect(cx - 2, cy + 2, 5, 1, PAL.gold);
  rect(cx - 1, cy + 3, 3, 1, PAL.gold);
  rect(cx,     cy + 4, 1, 1, PAL.gold);
  rect(cx, cy, 1, 1, '#1a0a0a');
  rect(x + 7, y - 4, 1, 4, '#3a2510');
  rect(x + 8, y - 4, 1, 4, '#3a2510');
}

function drawHangingLanterns() {
  drawLantern(160, 240, Math.sin(bgTime * 0.018) * 4);
  drawLantern(W - 160, 240, Math.sin(bgTime * 0.018 + Math.PI) * 4);
}

function drawLantern(cx, topY, swayX) {
  const x = cx + swayX;
  const y = topY;
  ctx.strokeStyle = PAL.rope;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, 280);
  ctx.lineTo(x, y);
  ctx.stroke();

  rect(x - 10, y, 20, 4, PAL.beamDk);
  rect(x - 8, y - 2, 16, 2, PAL.beamMd);

  for (let r = 24; r > 10; r -= 2) {
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = '#ffaa44';
    ctx.beginPath();
    ctx.arc(x, y + 18, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = PAL.lanternDk;
  ctx.beginPath();
  ctx.ellipse(x, y + 18, 12, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PAL.lanternRed;
  ctx.beginPath();
  ctx.ellipse(x, y + 18, 11, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PAL.lanternHi;
  ctx.beginPath();
  ctx.ellipse(x - 4, y + 14, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PAL.lanternDk;
  rect(x - 11, y + 10, 22, 1, PAL.lanternDk);
  rect(x - 12, y + 18, 24, 1, PAL.lanternDk);
  rect(x - 11, y + 26, 22, 1, PAL.lanternDk);

  const fcx = x | 0, fcy = (y + 18) | 0;
  rect(fcx,     fcy - 4, 1, 1, '#1a0a0a');
  rect(fcx - 1, fcy - 3, 3, 1, '#1a0a0a');
  rect(fcx - 1, fcy - 2, 3, 1, '#1a0a0a');
  rect(fcx - 2, fcy - 1, 5, 1, '#1a0a0a');
  rect(fcx - 2, fcy,     5, 1, '#1a0a0a');
  rect(fcx - 2, fcy + 1, 5, 1, '#1a0a0a');
  rect(fcx - 1, fcy + 2, 3, 1, '#1a0a0a');
  rect(fcx,     fcy - 2, 1, 2, '#ffaa44');
  rect(fcx - 1, fcy,     1, 1, '#ffaa44');

  rect(x - 8, y + 32, 16, 3, PAL.beamDk);
  rect(x - 1, y + 35, 2, 6, '#c8302e');
  rect(x - 2, y + 39, 4, 2, '#c8302e');
}

function drawFloor() {
  const fy = GROUND_Y;
  rect(0, fy, W, H - fy, PAL.floorMd);

  for (let y = fy; y < H; y += 1) {
    const t = (y - fy) / (H - fy);
    const r = Math.floor(lerp(0x3e, 0x5a, t));
    const g = Math.floor(lerp(0x26, 0x3a, t));
    const b = Math.floor(lerp(0x14, 0x1f, t));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, y, W, 1);
  }

  ctx.fillStyle = PAL.floorPlank;
  for (let y = fy + 6; y < H; y += 10) {
    ctx.fillRect(0, y, W, 1);
  }

  for (let i = 0; i < 80; i++) {
    const x = Math.random() * W;
    const y = fy + 2 + Math.random() * (H - fy - 4);
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#1a0f06';
    ctx.fillRect(x, y, 4 + Math.random() * 8, 1);
  }
  ctx.globalAlpha = 1;
}
