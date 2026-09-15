/**
 * The Fairy Post Office & The Moon's Apartment - Interactions & Ambient Audio
 * Manages object reactions, audio synthesis, ambient canvas, telescope view,
 * balcony celestial atmosphere, and random magical events.
 */

// Ambient Web Audio Synthesizer (Zero external dependencies, completely self-contained)
class MoonAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.activeTracks = {
      nightWind: null,
      rain: null,
      candle: null,
      musicBox: null
    };
    this.gains = {};
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.isMuted) {
        if (this.masterGain) this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } else {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        if (this.masterGain) this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  // Dreamy celestial music box chime (scale: pentatonic starlight)
  playChime(pitchShift = 1) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6

    baseNotes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitchShift, now + idx * 0.07);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.035, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.85);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.9);
    });
  }

  // Paper rustle sound
  playPaperRustle() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.06;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  // Key click / brass lock tumbler sound
  playKeyUnlock() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [400, 750, 1200].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.05, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.12);
    });
  }

  // Radio brief vintage tune
  playRadioTune() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const waltzNotes = [440, 523.25, 587.33, 659.25, 587.33, 523.25];

    waltzNotes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.22);

      // Add gentle vibrato
      gain.gain.setValueAtTime(0.001, now + idx * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.03, now + idx * 0.22 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.22 + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.22);
      osc.stop(now + idx * 0.22 + 0.35);
    });
  }

  // Water drop / tea cup swirl
  playDroplet() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.08);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }
}

export const moonAudio = new MoonAudioEngine();

/**
 * Dreamy canvas background for fireflies & stars (Main View)
 */
export function initFirefliesCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const fireflies = [];
  const stars = [];

  for (let i = 0; i < 70; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * (height * 0.75),
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.006,
      phase: Math.random() * Math.PI * 2
    });
  }

  const count = window.innerWidth < 768 ? 22 : 40;
  for (let i = 0; i < count; i++) {
    fireflies.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 1.2,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.35 - 0.08,
      glowPhase: Math.random() * Math.PI * 2,
      glowSpeed: Math.random() * 0.03 + 0.015,
      color: Math.random() > 0.4 ? '#ffd875' : '#c9ffb8'
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Random occasional shooting star
  let shootingStar = null;
  function maybeSpawnShootingStar() {
    if (!shootingStar && Math.random() < 0.003) {
      shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.35,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 9 + 8,
        angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
        life: 1.0,
        decay: 0.02
      };
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw stars
    stars.forEach((s) => {
      s.phase += s.twinkleSpeed;
      const alpha = 0.2 + (Math.sin(s.phase) + 1) * 0.35 * s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 250, 235, ${alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(254, 240, 190, 0.4)';
      ctx.fill();
    });

    // Shooting Star
    maybeSpawnShootingStar();
    if (shootingStar) {
      ctx.save();
      ctx.beginPath();
      const endX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
      const endY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

      const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.life})`);
      grad.addColorStop(0.4, `rgba(255, 225, 160, ${shootingStar.life * 0.7})`);
      grad.addColorStop(1, 'rgba(255, 225, 160, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();

      shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
      shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
      shootingStar.life -= shootingStar.decay;

      if (shootingStar.life <= 0) shootingStar = null;
    }

    // Fireflies
    fireflies.forEach((f) => {
      f.glowPhase += f.glowSpeed;
      f.x += f.vx;
      f.y += f.vy;

      if (f.x < -20) f.x = width + 20;
      if (f.x > width + 20) f.x = -20;
      if (f.y < -20) f.y = height + 20;
      if (f.y > height + 20) f.y = -20;

      const dx = f.x - mouse.x;
      const dy = f.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        f.x += (dx / dist) * 0.7;
        f.y += (dy / dist) * 0.7;
      }

      const glowAlpha = Math.max(0.1, (Math.sin(f.glowPhase) + 1) / 2);

      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4.5);
      grad.addColorStop(0, f.color);
      grad.addColorStop(0.3, `rgba(245, 215, 130, ${glowAlpha * 0.65})`);
      grad.addColorStop(1, 'rgba(245, 215, 130, 0)');

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 240, ${glowAlpha * 0.9 + 0.1})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * Telescope Celestial Viewer Canvas
 */
export function initTelescopeCanvas(canvasId, sightings, onSelectSighting) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth || 500);
  let height = (canvas.height = canvas.parentElement.clientHeight || 400);

  // Celestial targets placed across the starry eyepiece field
  const targets = sightings.map((s, idx) => {
    const angle = (idx / sightings.length) * Math.PI * 2 + 0.4;
    const distance = 80 + (idx % 3) * 60;
    return {
      ...s,
      x: width / 2 + Math.cos(angle) * distance,
      y: height / 2 + Math.sin(angle) * distance,
      radius: 22
    };
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Deep space circular reticle
    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) / 2 - 10;

    // Outer dark mask
    ctx.save();
    ctx.fillStyle = '#0a0d18';
    ctx.fillRect(0, 0, width, height);

    // Inner brass circle lens
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.clip();

    // Dark space background inside telescope
    const spaceGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, maxR);
    spaceGrad.addColorStop(0, '#192038');
    spaceGrad.addColorStop(0.6, '#0f1424');
    spaceGrad.addColorStop(1, '#070a14');
    ctx.fillStyle = spaceGrad;
    ctx.fillRect(0, 0, width, height);

    // Telescope crosshairs
    ctx.strokeStyle = 'rgba(212, 174, 69, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - maxR);
    ctx.lineTo(cx, cy + maxR);
    ctx.moveTo(cx - maxR, cy);
    ctx.lineTo(cx + maxR, cy);
    ctx.stroke();

    // Fine angle ticks
    for (let r = 0; r < Math.PI * 2; r += Math.PI / 12) {
      const x1 = cx + Math.cos(r) * (maxR - 8);
      const y1 = cy + Math.sin(r) * (maxR - 8);
      const x2 = cx + Math.cos(r) * maxR;
      const y2 = cy + Math.sin(r) * maxR;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw Targets
    targets.forEach((t) => {
      // Glow circle
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(229, 195, 101, 0.15)';
      ctx.fill();

      // Icon
      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.visual, t.x, t.y);

      // Label below
      ctx.font = '11px "Quicksand", sans-serif';
      ctx.fillStyle = '#e8d9c5';
      ctx.fillText(t.name.split('(')[0], t.x, t.y + 24);
    });

    ctx.restore();

    // Brass eyepiece border
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#b38b37';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, maxR - 4, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 240, 180, 0.4)';
    ctx.stroke();
  }

  draw();

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    for (const t of targets) {
      const dist = Math.hypot(t.x - x, t.y - y);
      if (dist <= t.radius + 8) {
        moonAudio.playChime(1.15);
        if (onSelectSighting) onSelectSighting(t);
        break;
      }
    }
  });
}

/**
 * Balcony Interactive Celestial Canvas (Wide Panoramic Stars & Earth)
 */
export function initBalconyCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth || 800);
  let height = (canvas.height = canvas.parentElement.clientHeight || 450);

  const balconyStars = [];
  for (let i = 0; i < 90; i++) {
    balconyStars.push({
      x: Math.random() * width,
      y: Math.random() * (height * 0.7),
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Floating solar wind wisps
  const wisps = [];
  for (let i = 0; i < 18; i++) {
    wisps.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      length: Math.random() * 60 + 40,
      vx: Math.random() * 0.4 + 0.15,
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  function renderBalcony() {
    ctx.clearRect(0, 0, width, height);

    // Deep cosmic gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#090b14');
    skyGrad.addColorStop(0.5, '#121626');
    skyGrad.addColorStop(0.85, '#221e2d');
    skyGrad.addColorStop(1, '#3a2b32');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Distant Earth floating in sky
    const earthX = width * 0.78;
    const earthY = height * 0.32;
    const earthRadius = 38;

    // Earth atmosphere glow
    const earthAtmosphere = ctx.createRadialGradient(earthX, earthY, earthRadius * 0.8, earthX, earthY, earthRadius * 1.4);
    earthAtmosphere.addColorStop(0, 'rgba(80, 160, 240, 0.4)');
    earthAtmosphere.addColorStop(1, 'rgba(80, 160, 240, 0)');
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = earthAtmosphere;
    ctx.fill();

    // Earth Body
    const earthBody = ctx.createRadialGradient(earthX - 10, earthY - 10, 5, earthX, earthY, earthRadius);
    earthBody.addColorStop(0, '#4a90e2');
    earthBody.addColorStop(0.5, '#2c6cb0');
    earthBody.addColorStop(0.8, '#1a365d');
    earthBody.addColorStop(1, '#0d1d36');
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.fillStyle = earthBody;
    ctx.fill();

    // Swirling white clouds
    ctx.save();
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(earthX - 6, earthY - 8, 20, 8, 0.3, 0, Math.PI * 2);
    ctx.ellipse(earthX + 8, earthY + 10, 16, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Stars
    balconyStars.forEach((s) => {
      s.phase += 0.015;
      const alpha = 0.25 + (Math.sin(s.phase) + 1) * 0.35 * s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 250, 235, ${alpha})`;
      ctx.fill();
    });

    // Drifting Solar Wind Wisps
    wisps.forEach((w) => {
      w.x += w.vx;
      if (w.x > width + 100) w.x = -100;

      ctx.beginPath();
      const grad = ctx.createLinearGradient(w.x - w.length, w.y, w.x, w.y);
      grad.addColorStop(0, 'rgba(216, 164, 166, 0)');
      grad.addColorStop(0.5, `rgba(229, 195, 101, ${w.alpha})`);
      grad.addColorStop(1, 'rgba(216, 164, 166, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.moveTo(w.x - w.length, w.y);
      ctx.lineTo(w.x, w.y);
      ctx.stroke();
    });

    // Curving lunar ground / horizon
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.quadraticCurveTo(width * 0.5, height - 70, width, height - 20);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = '#1c1b26';
    ctx.fill();

    requestAnimationFrame(renderBalcony);
  }

  renderBalcony();
}

let isClockPaused = false;
let clockPauseTimer = null;

export function isClockCurrentlyPaused() {
  return isClockPaused;
}

export function pauseClockTemporarily(durationMs = 18000) {
  isClockPaused = true;
  const pendulum = document.getElementById('clock-pendulum');
  if (pendulum) pendulum.style.animationPlayState = 'paused';

  const clockTimeText = document.getElementById('clock-fairy-time');
  const roomClockEl = document.getElementById('clock-room-time');
  const pauseMessage = "Midnight (Paused — Time caught on a moonbeam)";
  if (clockTimeText) clockTimeText.textContent = pauseMessage;
  if (roomClockEl) roomClockEl.textContent = pauseMessage;

  clearTimeout(clockPauseTimer);
  clockPauseTimer = setTimeout(() => {
    isClockPaused = false;
    if (pendulum) pendulum.style.animationPlayState = 'running';
    updateFairyClock();
  }, durationMs);
}

/**
 * Clock & Fairy Time updates
 */
export function updateFairyClock() {
  if (isClockPaused) return;

  const clockEl = document.getElementById('clock-pendulum');
  if (clockEl) clockEl.style.animationPlayState = 'running';

  const clockTimeText = document.getElementById('clock-fairy-time');
  if (!clockTimeText) return;

  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12 || 12;

  const fairyHours = [
    "Dewdrop Hour",
    "Hour of the Moth",
    "Moonrise",
    "Glimmer",
    "Cricket Song",
    "Midnight Blossom",
    "Hush Hour",
    "Silver Dream",
    "Starfall",
    "Whisper Time",
    "Lantern Dim",
    "Dawn Primrose"
  ];

  const fairyName = fairyHours[hours - 1] || "The Witching Hour";
  const formattedTime = `${fairyName} (${hours}:${minutes < 10 ? '0' + minutes : minutes})`;
  clockTimeText.textContent = formattedTime;

  const roomClockEl = document.getElementById('clock-room-time');
  if (roomClockEl) {
    roomClockEl.textContent = formattedTime;
  }
}
