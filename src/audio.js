let actx = null;
let masterGain = null;
let muted = false;

function initAudio() {
  if (actx) return;
  try {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = actx.createGain();
    masterGain.gain.value = 0.55;
    masterGain.connect(actx.destination);
  } catch (e) {
    actx = null;
  }
}

function tone(freq, dur, type = 'sine', vol = 0.3, slide = 0, decay = 0.01) {
  if (!actx || muted) return;
  const o = actx.createOscillator();
  const g = actx.createGain();
  o.type = type;
  o.frequency.value = freq;
  if (slide) {
    o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), actx.currentTime + dur);
  }
  g.gain.setValueAtTime(0, actx.currentTime);
  g.gain.linearRampToValueAtTime(vol, actx.currentTime + decay);
  g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
  o.connect(g);
  g.connect(masterGain);
  o.start();
  o.stop(actx.currentTime + dur);
}

function noise(dur, vol = 0.2, filterFreq = 800, filterQ = 2) {
  if (!actx || muted) return;
  const n = actx.createBufferSource();
  const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  n.buffer = buf;
  const f = actx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = filterFreq;
  f.Q.value = filterQ;
  const g = actx.createGain();
  g.gain.setValueAtTime(vol, actx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
  n.connect(f);
  f.connect(g);
  g.connect(masterGain);
  n.start();
  n.stop(actx.currentTime + dur);
}

const SFX = {
  jump:      () => tone(420, 0.10, 'square', 0.22, 240),
  djump:     () => tone(560, 0.12, 'square', 0.22, 320),
  land:      () => tone(80, 0.06, 'sine', 0.18, -40),
  slash:     () => { noise(0.12, 0.30, 2200, 4); tone(880, 0.06, 'sawtooth', 0.10, -400); },
  throw:     () => { tone(700, 0.08, 'triangle', 0.18, 400); noise(0.05, 0.15, 4000, 6); },
  dash:      () => { tone(180, 0.18, 'sawtooth', 0.18, 280); noise(0.18, 0.18, 1200, 3); },
  ki:        () => { tone(440, 0.16, 'sine', 0.20, 600); tone(660, 0.20, 'sine', 0.15, 400); },
  hit:       () => { noise(0.10, 0.30, 600, 1.5); tone(120, 0.10, 'square', 0.20, -60); },
  enemyHit:  () => { noise(0.08, 0.22, 1400, 3); tone(280, 0.08, 'sawtooth', 0.16, -120); },
  enemyDie:  () => { tone(320, 0.18, 'sawtooth', 0.20, -200); noise(0.15, 0.20, 800, 2); },
  bossHit:   () => { noise(0.12, 0.32, 320, 1.5); tone(140, 0.16, 'square', 0.24, -50); },
  bossRoar:  () => { tone(120, 0.6, 'sawtooth', 0.30, -40); noise(0.5, 0.20, 280, 1.2); },
  pickup:    () => { tone(880, 0.06, 'triangle', 0.18, 200); tone(1320, 0.08, 'triangle', 0.16, 200); },
  heal:      () => {
    tone(523, 0.10, 'sine', 0.20);
    setTimeout(() => tone(659, 0.10, 'sine', 0.20), 80);
    setTimeout(() => tone(784, 0.16, 'sine', 0.22), 160);
  },
  waveStart: () => {
    tone(330, 0.30, 'sine', 0.18);
    setTimeout(() => tone(440, 0.30, 'sine', 0.18), 150);
    setTimeout(() => tone(550, 0.40, 'sine', 0.20), 300);
  },
  waveEnd:   () => {
    tone(659, 0.16, 'sine', 0.18);
    setTimeout(() => tone(523, 0.20, 'sine', 0.18), 140);
  },
  bell:      () => {
    tone(880, 0.8, 'sine', 0.18, -200, 0.005);
    tone(1320, 0.6, 'sine', 0.10, -300, 0.005);
  },
  win:       () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle', 0.22), i * 140));
  },
  lose:      () => {
    [392, 330, 277, 220, 165].forEach((f, i) => setTimeout(() => tone(f, 0.30, 'sawtooth', 0.20), i * 180));
  },
  menu:      () => tone(660, 0.06, 'square', 0.12)
};
