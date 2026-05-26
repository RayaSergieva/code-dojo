function px(x, y, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x|0, y|0, 1, 1);
}

function rect(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x|0, y|0, w|0, h|0);
}

function rectO(x, y, w, h, c) {
  ctx.strokeStyle = c;
  ctx.lineWidth = 1;
  ctx.strokeRect((x|0) + 0.5, (y|0) + 0.5, (w|0) - 1, (h|0) - 1);
}

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
