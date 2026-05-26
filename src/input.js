const keys = {};
const pressed = {};

window.addEventListener('keydown', e => {
  initAudio();
  if (actx && actx.state === 'suspended') actx.resume();
  if (!keys[e.code]) pressed[e.code] = true;
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }
});

window.addEventListener('keyup', e => {
  keys[e.code] = false;
});

function consumePressed(code) {
  const v = pressed[code];
  pressed[code] = false;
  return v;
}
