// Kosmos themes, drawn like the mod draws them (src/main.cpp: drawDeco, drawWindow, the menu
// pages). Coordinates are the mod's: y goes up, the menu window is 440 x 276.
(function () {
  "use strict";

  const TAU = Math.PI * 2;

  const THEMES = [
    { name: "Kosmos", group: 0, main: [104, 122, 255], soft: [198, 206, 255], second: [176, 104, 255], top: [21, 23, 46], bottom: [7, 8, 18], deco: "Stars", about: "A drifting starfield with shooting stars." },
    { name: "Nebula", group: 0, main: [196, 82, 236], soft: [240, 198, 255], second: [255, 96, 168], top: [34, 12, 42], bottom: [11, 6, 20], deco: "Clouds", about: "Pink and purple clouds that wander and swell." },
    { name: "Void", group: 0, main: [124, 132, 150], soft: [232, 234, 240], second: [255, 255, 255], top: [20, 20, 23], bottom: [4, 4, 5], deco: "Orbit", about: "Almost nothing: one orbit and a moon going round." },
    { name: "Saturn", group: 1, main: [218, 160, 56], soft: [252, 226, 168], second: [255, 206, 128], top: [36, 28, 16], bottom: [12, 9, 6], deco: "Rings", about: "A ringed planet, a light running round the ring." },
    { name: "Mars", group: 1, main: [222, 80, 52], soft: [255, 194, 168], second: [255, 146, 78], top: [42, 15, 11], bottom: [14, 6, 5], deco: "Dust", about: "Red dust blowing over the horizon, two moons." },
    { name: "Neptune", group: 1, main: [36, 136, 255], soft: [172, 210, 255], second: [44, 214, 255], top: [8, 24, 52], bottom: [3, 8, 22], deco: "Horizon", about: "A banded blue planet rising in the corner." },
    { name: "Aurora", group: 2, main: [28, 190, 128], soft: [178, 252, 220], second: [136, 100, 255], top: [6, 24, 28], bottom: [3, 8, 14], deco: "Aurora", about: "Curtains of green and violet light, waving." },
    { name: "Supernova", group: 2, main: [246, 68, 114], soft: [255, 194, 208], second: [255, 170, 60], top: [42, 10, 22], bottom: [13, 4, 9], deco: "Burst", about: "Turning rays and shock waves from a hot core." },
    { name: "Comet", group: 2, main: [30, 166, 210], soft: [192, 240, 255], second: [222, 246, 255], top: [10, 26, 38], bottom: [4, 10, 16], deco: "Comets", about: "Comets falling across the window." },
  ];
  const GROUPS = ["DEEP SPACE", "PLANETS", "PHENOMENA"];
  const DECOS = ["Stars", "Clouds", "Orbit", "Rings", "Dust", "Horizon", "Aurora", "Burst", "Comets"];

  const mix = (a, b, t) => [0, 1, 2].map((i) => Math.max(0, Math.min(255, Math.round(a[i] + (b[i] - a[i]) * t))));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const WHITE = [255, 255, 255];
  const ink = (t) => ({ text: mix([240, 242, 248], t.soft, 0.12), muted: mix([138, 145, 162], t.soft, 0.22), dim: mix([94, 100, 118], t.soft, 0.16) });

  function dice(seed) {
    let s = seed >>> 0;
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return (s >>> 8) / 16777216;
    };
  }

  function hash01(x) {
    x >>>= 0;
    x = (x ^ (x >>> 16)) >>> 0;
    x = Math.imul(x, 0x7feb352d) >>> 0;
    x = (x ^ (x >>> 15)) >>> 0;
    x = Math.imul(x, 0x846ca68b) >>> 0;
    x = (x ^ (x >>> 16)) >>> 0;
    return (x >>> 8) / 16777216;
  }

  // drawing in the mod's coordinates (y up) on a canvas
  class Painter {
    constructor(ctx, height, scale) {
      this.ctx = ctx;
      this.H = height;
      this.s = scale;
      this.flip();
    }
    flip() {
      this.ctx.setTransform(this.s, 0, 0, -this.s, 0, this.H * this.s);
    }
    poly(pts, color) {
      const c = this.ctx;
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
      c.closePath();
      c.fillStyle = color;
      c.fill();
    }
    circle(x, y, r, fill, border = 0, borderColor = null) {
      const c = this.ctx;
      c.beginPath();
      c.arc(x, y, Math.max(r, 0.01), 0, TAU);
      if (fill) {
        c.fillStyle = fill;
        c.fill();
      }
      if (border > 0 && borderColor) {
        c.lineWidth = border * 2;
        c.strokeStyle = borderColor;
        c.stroke();
      }
    }
    roundPath(x, y, w, h, rad) {
      rad = Math.min(rad, w / 2, h / 2);
      const c = this.ctx;
      c.beginPath();
      c.moveTo(x + rad, y);
      c.arcTo(x + w, y, x + w, y + h, rad);
      c.arcTo(x + w, y + h, x, y + h, rad);
      c.arcTo(x, y + h, x, y, rad);
      c.arcTo(x, y, x + w, y, rad);
      c.closePath();
    }
    rect(x, y, w, h, rad, fill, border = 0, borderColor = null) {
      this.roundPath(x, y, w, h, rad);
      const c = this.ctx;
      if (fill) {
        c.fillStyle = fill;
        c.fill();
      }
      if (border > 0 && borderColor) {
        c.lineWidth = border * 2;
        c.strokeStyle = borderColor;
        c.stroke();
      }
    }
    seg(x0, y0, x1, y1, r, color) {
      const c = this.ctx;
      c.beginPath();
      c.moveTo(x0, y0);
      c.lineTo(x1, y1);
      c.lineWidth = r * 2;
      c.lineCap = "round";
      c.strokeStyle = color;
      c.stroke();
    }
    // text: y is the middle of the line, like the mod's labels anchored at 0.5
    text(str, size, color, x, y, align = "left", maxWidth) {
      const c = this.ctx;
      c.save();
      c.setTransform(this.s, 0, 0, this.s, 0, 0);
      c.font = `${size}px "Exo 2", system-ui, sans-serif`;
      c.fillStyle = color;
      c.textAlign = align;
      c.textBaseline = "middle";
      if (maxWidth) {
        const w = c.measureText(str).width;
        if (w > maxWidth) {
          c.font = `${size * (maxWidth / w)}px "Exo 2", system-ui, sans-serif`;
        }
      }
      c.fillText(str, x, this.H - y);
      c.restore();
    }
    measure(str, size) {
      const c = this.ctx;
      c.save();
      c.font = `${size}px "Exo 2", system-ui, sans-serif`;
      const w = c.measureText(str).width;
      c.restore();
      return w;
    }
    clipRound(x, y, w, h, rad) {
      this.ctx.save();
      this.roundPath(x, y, w, h, rad);
      this.ctx.clip();
    }
    restore() {
      this.ctx.restore();
    }
  }

  function sparkle(p, x, y, r, color) {
    p.poly([[x, y + r], [x - r * 0.18, y], [x, y - r], [x + r * 0.18, y]], color);
    p.poly([[x + r, y], [x, y + r * 0.18], [x - r, y], [x, y - r * 0.18]], color);
  }

  // the background gradient (flat at the rounded ends, like the mod)
  function gradient(p, t, x, y, w, h, rad) {
    const c = p.ctx;
    const g = c.createLinearGradient(0, y + rad, 0, y + h - rad);
    g.addColorStop(0, rgba(t.bottom, 1));
    g.addColorStop(1, rgba(t.top, 1));
    p.rect(x, y, w, h, rad, g);
  }

  // the theme's art in the rectangle, `time` seconds in (src/main.cpp drawDeco)
  // opts.dot: size of the small things (default: from the height); opts.stars: more stars
  function drawDeco(p, t, rect, mini, time, rad, opts = {}) {
    const [rx0, ry0, w, h] = rect;
    const at = (u, v) => [rx0 + u * w, ry0 + v * h];
    const fromRight = (x, v) => [rx0 + w - x * h, ry0 + v * h];
    const bgAt = (v) => mix(t.bottom, t.top, clamp(v, 0, 1));
    const wave = (speed, phase) => Math.sin(time * speed + phase);
    const wander = (pt, amount, speed, phase) => [pt[0] + amount * h * Math.sin(time * speed + phase), pt[1] + amount * h * 0.7 * Math.cos(time * speed * 0.8 + phase)];
    const edgeFade = (u) => clamp(Math.min(u, 1 - u) / 0.04, 0, 1);
    const dot = opts.dot || Math.max(h / 276, 0.3);
    const more = opts.stars || 1;
    const rnd = dice(DECOS.indexOf(t.deco) * 7919 + 17);

    p.clipRound(rx0, ry0, w, h, rad);

    const stars = (count, alpha, drift) => {
      const n = mini ? Math.max(Math.floor(count / 3), 4) : Math.round(count * more);
      for (let i = 0; i < n; i++) {
        const u0 = rnd(), v = 0.05 + 0.88 * rnd();
        const k = rnd(), shade = rnd(), bright = rnd();
        const phase = rnd() * TAU, rate = 0.6 + 1.6 * rnd();
        let u = u0 - (time * drift * (0.35 + 0.65 * k) * h) / w;
        u -= Math.floor(u);
        const a = alpha * (0.35 + 0.65 * bright) * (0.7 + 0.3 * Math.sin(time * rate + phase)) * edgeFade(u);
        if (a > 0.004) {
          const [x, y] = at(u, v);
          p.circle(x, y, (0.5 + 1.3 * k * k) * dot, rgba(mix(WHITE, t.soft, shade * 0.6), a));
        }
      }
    };
    // a soft round glow (the mod stacks rings; a gradient gives the same build-up, smoothly)
    const glow = (c, radius, color, alpha, rings) => {
      if (radius <= 0) return;
      const g = p.ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], radius);
      for (let i = 0; i <= 8; i++) {
        const f = i / 8;
        const stacked = 1 - Math.pow(1 - alpha, Math.max(0, rings * (1 - f)));
        g.addColorStop(f, rgba(color, stacked));
      }
      p.circle(c[0], c[1], radius, g);
    };
    const faller = (id, period, active, offset, laneLo, laneHi, tail, width, tailColor, alpha, head) => {
      const dir = [0.874, 0.486], side = [-dir[1], dir[0]];
      const clock = time + offset;
      const pass = Math.floor(clock / period);
      const prog = (clock - pass * period) / active;
      if (prog > 1) return;
      const reach = (dir[0] * w) / 2 + (dir[1] * h) / 2;
      const maxLane = (side[1] * h) / 2 - (side[0] * w) / 2;
      const pick = hash01(Math.imul(id, 7349) + Math.imul(pass, 31) + 11);
      const lane = maxLane * (laneLo + (laneHi - laneLo) * pick);
      const start = reach + head * 3, end = -(reach + tail);
      const s = start + (end - start) * prog;
      const cx = rx0 + w / 2 + side[0] * lane + dir[0] * s, cy = ry0 + h / 2 + side[1] * lane + dir[1] * s;
      for (const k of [1, 0.6, 0.3]) {
        const half = width * (0.5 + 0.5 * k);
        const off = [side[0] * half, side[1] * half];
        p.poly([[cx + off[0], cy + off[1]], [cx + dir[0] * tail * k, cy + dir[1] * tail * k], [cx - off[0], cy - off[1]]], rgba(mix(t.soft, tailColor, k), alpha));
      }
      p.circle(cx, cy, head * 2.7, rgba(t.soft, 0.18));
      p.circle(cx, cy, head, rgba(WHITE, 0.9));
    };

    switch (t.deco) {
      case "Stars": {
        const breathe = 0.85 + 0.15 * wave(0.5, 0);
        glow(wander(fromRight(0.62, 0.6), 0.05, 0.11, 0), 0.44 * h, t.second, 0.022 * breathe, 8);
        glow(wander(at(0.42, 0.2), 0.04, 0.09, 2), 0.3 * h, t.main, 0.018 * breathe, 6);
        stars(60, 0.8, 0.025);
        if (!mini) {
          faller(1, 7, 0.9, 2.5, 0.15, 0.85, 0.3 * h, 0.006 * h, t.second, 0.16, 0.006 * h);
          faller(2, 11, 1.1, 8, -0.2, 0.6, 0.24 * h, 0.005 * h, t.soft, 0.12, 0.005 * h);
        }
        let [x, y] = fromRight(0.3, 0.78);
        sparkle(p, x, y, 5.5 * dot * (0.7 + 0.3 * wave(1.3, 0)), rgba(t.soft, 0.8));
        [x, y] = at(0.4, 0.62);
        sparkle(p, x, y, 4 * dot * (0.7 + 0.3 * wave(1.1, 2)), rgba(t.soft, 0.6));
        break;
      }
      case "Clouds": {
        glow(wander(fromRight(0.5, 0.62), 0.06, 0.12, 0), 0.38 * h * (1 + 0.06 * wave(0.3, 0)), t.main, 0.03, 8);
        glow(wander(fromRight(0.95, 0.28), 0.07, 0.09, 2), 0.3 * h * (1 + 0.06 * wave(0.27, 1)), t.second, 0.03, 8);
        glow(wander(fromRight(0.2, 0.22), 0.04, 0.15, 4), 0.2 * h * (1 + 0.08 * wave(0.4, 2)), t.second, 0.026, 6);
        glow(wander(at(0.36, 0.82), 0.05, 0.1, 1), 0.18 * h * (1 + 0.08 * wave(0.35, 3)), t.main, 0.024, 6);
        stars(34, 0.6, 0.012);
        const [x, y] = fromRight(0.62, 0.5);
        sparkle(p, x, y, 4.5 * dot * (0.7 + 0.3 * wave(1.2, 1)), rgba(t.soft, 0.7));
        break;
      }
      case "Orbit": {
        stars(18, 0.45, 0.008);
        const c = fromRight(0.62, 0.42);
        p.circle(c[0], c[1], 0.075 * h * (1 + 0.04 * wave(0.6, 0)), rgba(t.soft, 0.07));
        const ctx = p.ctx;
        ctx.beginPath();
        ctx.ellipse(c[0], c[1], 0.5 * h, 0.15 * h, 0.26, 0, TAU);
        ctx.lineWidth = 0.7 * dot;
        ctx.strokeStyle = rgba(t.soft, 0.16);
        ctx.stroke();
        const cr = Math.cos(0.26), sr = Math.sin(0.26);
        const onOrbit = (a) => {
          const x = 0.5 * h * Math.cos(a), y = 0.15 * h * Math.sin(a);
          return [c[0] + x * cr - y * sr, c[1] + x * sr + y * cr];
        };
        const a = -2.3 + (time * TAU) / 18;
        for (let k = 5; k >= 1; k--) {
          const q = onOrbit(a - k * 0.07);
          p.circle(q[0], q[1], 0.03 * h * (1 - k * 0.13), rgba(t.soft, (0.09 * (6 - k)) / 5));
        }
        const m = onOrbit(a);
        p.circle(m[0], m[1], 0.03 * h, rgba(t.soft, 0.6));
        break;
      }
      case "Rings": {
        glow(fromRight(0.6, 0.4), 0.44 * h, t.main, 0.016 * (0.85 + 0.15 * wave(0.4, 0)), 7);
        stars(26, 0.5, 0.012);
        const c = fromRight(0.6, 0.38);
        const R = 0.17 * h, erx = 0.36 * h, ery = 0.085 * h, rot = 0.33, thick = 0.045 * h;
        const ctx = p.ctx;
        const ringColor = rgba(mix(bgAt(0.38), t.soft, 0.2), 1);
        const shineAt = (time * 0.5) % TAU;
        const ellipseArc = (a0, a1, width, color) => {
          ctx.beginPath();
          ctx.ellipse(c[0], c[1], erx - thick / 2, ery - thick / 2, rot, a0, a1);
          ctx.lineWidth = width;
          ctx.lineCap = "butt";
          ctx.strokeStyle = color;
          ctx.stroke();
        };
        // the light running round the ring, brightest at shineAt (layers add up to the middle)
        const shine = (a0, a1) => {
          for (let i = 0; i < 6; i++) {
            const span = 0.7 * (1 - i / 6);
            for (const turn of [-TAU, 0, TAU]) {
              const lo = Math.max(a0, shineAt + turn - span), hi = Math.min(a1, shineAt + turn + span);
              if (hi > lo) ellipseArc(lo, hi, thick, rgba(t.soft, 0.06));
            }
          }
        };
        const ma = (time * TAU) / 16 + 1, cr = Math.cos(rot), sr = Math.sin(rot);
        const mx = 0.52 * h * Math.cos(ma), my = 0.14 * h * Math.sin(ma);
        const moon = [c[0] + mx * cr - my * sr, c[1] + mx * sr + my * cr];
        const moonInFront = Math.sin(ma) < 0;
        const drawMoon = () => p.circle(moon[0], moon[1], 0.024 * h, rgba(mix(bgAt(0.4), t.soft, 0.55), 1));
        if (!moonInFront) drawMoon();
        ellipseArc(0, TAU, thick, ringColor);
        shine(0, TAU);
        p.circle(c[0], c[1], R, rgba(mix(bgAt(0.38), t.main, 0.2), 1));
        // the front of the ring over the planet, with a gap around it
        ctx.save();
        ctx.beginPath();
        ctx.arc(c[0], c[1], R + 0.5, 0, TAU);
        ctx.clip();
        ellipseArc(Math.PI, TAU, thick * 2.2, rgba(mix(bgAt(0.38), t.main, 0.08), 1));
        ctx.restore();
        ellipseArc(Math.PI, TAU, thick, ringColor);
        shine(Math.PI, TAU);
        if (moonInFront) drawMoon();
        break;
      }
      case "Dust": {
        glow(at(0.5, -0.9), 1.15 * h, t.main, 0.03 * (0.85 + 0.15 * wave(0.35, 0)), 7);
        const n = mini ? 24 : Math.round(80 * more);
        for (let i = 0; i < n; i++) {
          const u0 = rnd(), v0 = 0.05 + 0.86 * Math.pow(rnd(), 1.5);
          const k = rnd(), shade = rnd(), bright = rnd(), phase = rnd() * TAU;
          let u = u0 + (time * (0.012 + 0.05 * k) * h) / w;
          u -= Math.floor(u);
          const v = v0 + 0.012 * Math.sin(time * (0.5 + k) + phase);
          const a = (0.12 + 0.3 * bright) * edgeFade(u);
          if (a > 0.004) {
            const [x, y] = at(u, v);
            p.circle(x, y, (0.5 + 1.4 * k * k) * dot, rgba(mix(t.main, t.second, shade), a));
          }
        }
        let [x, y] = fromRight(0.36 + 0.05 * wave(0.08, 0), 0.68 + 0.015 * wave(0.08, 1.6));
        p.circle(x, y, 0.034 * h, rgba(t.soft, 0.3));
        [x, y] = fromRight(0.8 + 0.04 * wave(0.05, 2), 0.75 + 0.01 * wave(0.05, 3.6));
        p.circle(x, y, 0.019 * h, rgba(t.soft, 0.24));
        break;
      }
      case "Horizon": {
        stars(44, 0.65, 0.015);
        let mu = time / 45 + 0.3;
        mu -= Math.floor(mu);
        const [mx, my] = at(mu, 0.56 + 0.24 * Math.sin((mu * TAU) / 2));
        p.circle(mx, my, 0.02 * h, rgba(t.soft, 0.55 * edgeFade(mu)));
        const c = fromRight(-0.05, -0.62);
        const R = h, pulse = 0.8 + 0.2 * wave(0.5, 0);
        for (let i = 6; i >= 1; i--) {
          p.circle(c[0], c[1], R + i * 0.022 * h * (1 + 0.1 * wave(0.4, 0)), rgba(t.second, 0.035 * pulse));
        }
        const body = mix(bgAt(0.2), t.main, 0.22);
        p.circle(c[0], c[1], R, rgba(body, 1));
        const ctx = p.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.arc(c[0], c[1], R, 0, TAU);
        ctx.clip();
        const bands = [[0.05, 0.09], [0.15, 0.17], [0.23, 0.28]];
        bands.forEach(([b0, b1], i) => {
          const sway = 0.012 * wave(0.3, i * 1.7);
          ctx.fillStyle = rgba(mix(body, t.second, 0.14), 1);
          ctx.fillRect(rx0, ry0 + (b0 + sway) * h, w, (b1 - b0) * h);
        });
        ctx.restore();
        break;
      }
      case "Aurora": {
        stars(36, 0.55, 0.01);
        const n = mini ? 34 : 80;
        for (let ribbon = 0; ribbon < 2; ribbon++) {
          for (let i = 0; i < n; i++) {
            const u = 0.04 + (0.92 * i) / (n - 1);
            const base = ribbon === 0 ? 0.48 + 0.12 * Math.sin(u * 7 + 0.4 + time * 0.35) + 0.05 * Math.sin(u * 17 - time * 0.6) : 0.26 + 0.07 * Math.sin(u * 5 + 2 - time * 0.28);
            const tall = (ribbon === 0 ? 0.2 + 0.14 * Math.pow(Math.sin(u * 5 + 1.3 + time * 0.25), 2) : 0.12 + 0.03 * Math.sin(u * 9 + time * 0.5)) * h;
            const cw = (0.55 * 0.92 * w) / n;
            const x = rx0 + u * w - cw / 2, y = ry0 + base * h;
            const c = mix(t.main, t.second, clamp(u + 0.25 * Math.sin(time * 0.2), 0, 1));
            const a = (ribbon === 0 ? 0.08 : 0.05) * (0.7 + 0.3 * Math.sin(u * 23 + time * 1.1));
            for (const [p0, p1, k] of [[0, 0.3, 1.8], [0.3, 0.65, 1], [0.65, 1, 0.45]]) {
              p.ctx.fillStyle = rgba(c, a * k);
              p.ctx.fillRect(x, y + tall * p0, cw, tall * (p1 - p0));
            }
          }
        }
        break;
      }
      case "Burst": {
        const c = fromRight(0.55, 0.6);
        glow(c, 0.5 * h * (1 + 0.04 * wave(0.8, 0)), t.second, 0.02, 8);
        stars(30, 0.5, 0.01);
        if (!mini) {
          for (let i = 0; i < 2; i++) {
            let q = time / 3.6 + i * 0.5;
            q -= Math.floor(q);
            const radius = (0.06 + 0.75 * q) * h, thick = 0.014 * h * (1 - 0.5 * q);
            const ctx = p.ctx;
            ctx.beginPath();
            ctx.arc(c[0], c[1], Math.max(radius - thick / 2, 0.1), 0, TAU);
            ctx.lineWidth = thick;
            ctx.strokeStyle = rgba(t.soft, 0.11 * (1 - q) * (1 - q));
            ctx.stroke();
          }
        }
        const rays = 22;
        for (let i = 0; i < rays; i++) {
          const a = (i * TAU) / rays + (rnd() - 0.5) * 0.18 + time * 0.05;
          const len = (0.35 + 0.6 * rnd()) * h * (0.82 + 0.18 * Math.sin(time * 1.3 + i * 1.7));
          const half = (0.008 + 0.01 * rnd()) * h;
          const dir = [Math.cos(a), Math.sin(a)], side = [-dir[1] * half, dir[0] * half];
          p.poly([[c[0] + side[0], c[1] + side[1]], [c[0] + dir[0] * len, c[1] + dir[1] * len], [c[0] - side[0], c[1] - side[1]]], rgba(i % 2 ? t.second : t.main, 0.07));
        }
        const beat = 0.5 + 0.5 * wave(2.2, 0);
        glow(c, 0.2 * h * (1 + 0.1 * beat), t.main, 0.04, 6);
        p.circle(c[0], c[1], 0.05 * h * (1 + 0.15 * beat), rgba(t.soft, 0.3));
        p.circle(c[0], c[1], 0.022 * h, rgba(WHITE, 0.85));
        break;
      }
      case "Comets": {
        stars(42, 0.6, 0.02);
        if (mini) {
          const dir = [0.874, 0.486];
          const heads = [at(0.42, 0.34), fromRight(0.55, 0.6), fromRight(0.22, 0.24), at(0.3, 0.72)];
          const lengths = [0.55, 0.42, 0.3, 0.25];
          for (let i = 0; i < 4; i++) {
            const q = heads[i];
            const len = lengths[i] * h, half = 0.022 * h * (lengths[i] + 0.4);
            for (const k of [1, 0.6, 0.3]) {
              const side = [-dir[1] * half * (0.5 + 0.5 * k), dir[0] * half * (0.5 + 0.5 * k)];
              p.poly([[q[0] + side[0], q[1] + side[1]], [q[0] + dir[0] * len * k, q[1] + dir[1] * len * k], [q[0] - side[0], q[1] - side[1]]], rgba(mix(t.soft, t.second, k), 0.06));
            }
            p.circle(q[0], q[1], 0.03 * h * (lengths[i] + 0.4), rgba(t.soft, 0.18));
            p.circle(q[0], q[1], Math.max(0.011 * h, 0.45), rgba(WHITE, 0.85));
          }
          break;
        }
        for (let i = 0; i < 4; i++) {
          const size = 0.6 + 0.4 * hash01(i * 13 + 5);
          faller(10 + i, 5 + 1.9 * i, 2.6 + 0.4 * i, i * 1.7, -0.6, 0.75, (0.3 + 0.25 * size) * h, 0.02 * h * size, t.second, 0.07, 0.011 * h * size);
        }
        break;
      }
    }
    p.restore();
  }

  // the sparkles that pulse over the window (the mod's addTwinkles, as a smooth pulse)
  function twinkles(p, t, w, h, time) {
    const rnd = dice(4242 + DECOS.indexOf(t.deco) * 31);
    for (let i = 0; i < 5; i++) {
      const size = 3 + 2.5 * rnd();
      const x = w * (0.3 + 0.66 * rnd()), y = h * (0.08 + 0.72 * rnd());
      const start = rnd(), up = 1.1 + rnd(), down = 1.3 + rnd();
      const k = 0.575 + 0.425 * Math.sin((time / (up + down)) * TAU + start * TAU);
      sparkle(p, x, y, size * k, rgba(mix(WHITE, t.soft, 0.5), 0.75));
    }
  }

  // ---------- the menu ----------

  const W = 440, H = 276, HEADER = 36, SIDE = 118, L = SIDE + 2, R = W - 12, CW = R - L, TILE_H = 24, PITCH = 28;
  const TABS = ["Buffer", "Prediction", "Modes", "Frames", "Tools", "Themes"];
  const TAB_INFO = [
    "How far back an early click can be held.",
    "What the hidden ghost checks before a click goes through.",
    "Helpers for each game mode, and latency.",
    "Your own limit for each game mode. 0 = no buffer.",
    "What you see while playing, stats, the log and updates.",
    "A whole new look for the menu. Tap one to use it.",
  ];
  const OPTIONS = {
    1: [["Robust saves", 1], ["Orb alignment", 1], ["Orb timing", 1], ["Moving objects", 0], ["Move triggers", 1], ["Through portals", 1], ["Two clicks ahead", 1], ["No-hitch searches", 1], ["Level memory", 1], ["More time at deaths", 1]],
    2: [["Low latency", 1], ["CBF sync", 1], ["Ship buffering", 1], ["Smart robot", 1], ["Smart spider", 1], ["Smart UFO", 1], ["Smart ball", 1], ["Smart swing", 1], ["Auto-click (practice)", 0]],
    4: [["Path view", 0], ["Training (hints)", 0], ["Death heatmap", 1], ["Ding on save", 1], ["Flash when save", 0], ["Performance mode", 0], ["Explain inputs", 0], ["Remove watermark", 0], ["Hide menu buttons", 0], ["Update check", 1]],
  };
  const STAGE_CHIPS = ["0.5f", "1f", "2f", "4f", "6f", "8f", "Custom", "Off"];
  const MODE_NAMES = ["Cube", "Ship", "Ball", "UFO", "Wave", "Robot", "Spider", "Swing"];

  const tinted = new Map();
  let saturnImage = null;
  function loadSaturn(src) {
    saturnImage = new Image();
    saturnImage.src = src;
  }
  function saturnIn(color) {
    if (!saturnImage || !saturnImage.complete || !saturnImage.naturalWidth) return null;
    const key = color.join(",");
    if (!tinted.has(key)) {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const x = c.getContext("2d");
      x.drawImage(saturnImage, 0, 0, 128, 128);
      x.globalCompositeOperation = "source-in";
      x.fillStyle = rgba(color, 1);
      x.fillRect(0, 0, 128, 128);
      tinted.set(key, c);
    }
    return tinted.get(key);
  }

  function glyph(p, tab, x, y, color, colors) {
    switch (tab) {
      case 0:
        for (let i = -1; i <= 1; i++) p.seg(x - 4, y + i * 3.2, x + (i === 1 ? 1.5 : 4), y + i * 3.2, 0.75, color);
        break;
      case 1:
        p.circle(x - 4, y - 3, 1.2, color);
        p.circle(x, y - 0.5, 1.4, color);
        p.circle(x + 4, y + 3, 1.7, color);
        break;
      case 2:
        p.rect(x - 4, y - 4, 8, 8, 1.5, null, 0.7, color);
        p.rect(x - 1.5, y - 1.5, 3, 3, 0.6, color);
        break;
      case 3:
        p.seg(x - 5, y, x + 5, y, 0.6, color);
        p.circle(x + 1.5, y, 2.3, color);
        break;
      case 5:
        p.circle(x, y, 5, null, 0.6, color);
        p.circle(x - 2, y + 1.4, 1.3, rgba(colors[0], 1));
        p.circle(x + 2, y + 1.4, 1.3, rgba(colors[1], 1));
        p.circle(x, y - 2.1, 1.3, rgba(colors[2], 1));
        break;
      default:
        for (let i = 0; i < 4; i++) {
          const gx = x + (i % 2 ? 0.8 : -3.8), gy = y + (i >> 1 ? 0.8 : -3.8);
          p.rect(gx, gy, 3, 3, 0.6, color);
        }
    }
  }

  // the little window drawn on each theme card (src/main.cpp drawPreviewUi)
  function previewUi(p, t, x0, y0, w, h) {
    const top = y0 + h - 6.5;
    p.seg(x0 + 1, top, x0 + w - 1, top, 0.2, rgba(WHITE, 0.08));
    p.seg(x0 + 3, top, x0 + w * 0.45, top, 0.3, rgba(t.main, 0.9));
    p.circle(x0 + 5, y0 + h - 3.3, 1.4, rgba(t.soft, 1));
    p.seg(x0 + 2.6, y0 + h - 4.2, x0 + 7.4, y0 + h - 2.4, 0.25, rgba(t.soft, 1));
    p.rect(x0 + 9, y0 + h - 4.2, 15, 1.8, 0.9, rgba(WHITE, 0.55));
    p.rect(x0 + w - 13, y0 + h - 4.6, 9, 2.6, 1.3, rgba([80, 222, 140], 0.35));
    const sw = w * 0.25;
    p.rect(x0 + 2, y0 + 2, sw, top - y0 - 3.5, 2, rgba([0, 0, 0], 0.28));
    for (let i = 0; i < 3; i++) {
      const ty = top - 4.5 - i * 4;
      if (i === 0) p.rect(x0 + 3, ty - 1.6, sw - 2, 3.2, 1, rgba(t.main, 0.3));
      p.rect(x0 + 4.5, ty - 0.6, sw * (i === 0 ? 0.55 : 0.45), 1.2, 0.6, i === 0 ? rgba(t.soft, 0.9) : rgba(WHITE, 0.3));
    }
    const cx = x0 + sw + 4, cwid = x0 + w - 3 - cx;
    const t1 = top - 8;
    p.rect(cx, t1 - 2.8, cwid, 5.6, 1.5, rgba(t.main, 0.16), 0.2, rgba(t.main, 0.5));
    p.rect(cx + 2, t1 - 0.5, cwid * 0.4, 1, 0.5, rgba(WHITE, 0.6));
    p.rect(cx + cwid - 7, t1 - 1.6, 5.5, 3.2, 1.6, rgba(t.main, 1));
    p.circle(cx + cwid - 3.1, t1, 1, rgba(WHITE, 1));
    const t2 = t1 - 7;
    p.rect(cx, t2 - 2.8, cwid, 5.6, 1.5, rgba(WHITE, 0.05), 0.2, rgba(WHITE, 0.09));
    p.rect(cx + 2, t2 - 0.5, cwid - 4, 1, 0.5, rgba(WHITE, 0.12));
    p.rect(cx + 2, t2 - 0.5, (cwid - 4) * 0.62, 1, 0.5, rgba(t.soft, 0.9));
    p.rect(x0, y0, w, h, 4, null, 0.4, rgba(WHITE, 0.12));
  }

  // a theme card's preview: the backdrop and the little window
  function drawPreview(p, t, x, y, w, h, time) {
    gradient(p, t, x, y, w, h, 4);
    drawDeco(p, t, [x, y, w, h], true, time, 4);
    previewUi(p, t, x, y, w, h);
  }

  // The whole menu, as the mod draws it. `state` holds the tab, the stage, the switches and the
  // theme; taps are matched against `state.hits` (filled while drawing).
  function drawMenu(p, state, time) {
    const t = THEMES[state.theme];
    const k = ink(t);
    const good = [80, 222, 140];
    state.hits = [];
    const hit = (x, y, w, h, action) => state.hits.push({ x, y, w, h, action });

    // the window
    gradient(p, t, 0, 0, W, H, 12);
    drawDeco(p, t, [0, 0, W, H], false, time, 12);
    p.clipRound(0, 0, W, H, 12);
    twinkles(p, t, W, H, time);
    p.restore();
    p.rect(0, 0, W, H, 12, null, 0.6, rgba(WHITE, 0.1));
    p.rect(0, H - HEADER - 1, W, HEADER + 1, 12, rgba(WHITE, 0.025));
    p.seg(1, H - HEADER, W - 1, H - HEADER, 0.4, rgba(WHITE, 0.07));
    const cy = H - HEADER / 2;
    p.rect(10, cy - 11, 22, 22, 6, rgba(t.main, 0.22), 0.6, rgba(t.main, 0.75));
    const g = p.ctx.createLinearGradient(12, 0, 12 + W * 0.6, 0);
    g.addColorStop(0, rgba(t.main, 0.9));
    g.addColorStop(1, rgba(t.second, 0));
    p.ctx.fillStyle = g;
    p.ctx.fillRect(12, H - HEADER - 0.5, W * 0.6, 1);
    const icon = saturnIn(t.soft);
    if (icon) {
      p.ctx.save();
      p.ctx.setTransform(p.s, 0, 0, p.s, 0, 0);
      p.ctx.drawImage(icon, 21 - 8.5, H - cy - 8.5, 17, 17);
      p.ctx.restore();
    }
    p.text("Kosmos", 12, rgba(k.text, 1), 40, cy + 5);
    p.text(state.version || "v3.5.0", 6.8, rgba(k.dim, 1), 40, cy - 7.5);
    // the status pill and the close button
    let pill = state.stage === 7 ? "OFF" : `ON  |  ${STAGE_CHIPS[state.stage]}`;
    if (state.stage !== 7 && state.saveRate < 100) pill += `  |  ${state.saveRate}%`;
    const pw = p.measure(pill, 8.4) + 22, right = W - 40;
    const dotColor = state.stage === 7 ? [240, 92, 104] : good;
    p.rect(right - pw, cy - 9, pw, 18, 9, rgba(dotColor, 0.1), 0.5, rgba(dotColor, 0.45));
    p.circle(right - pw + 8, cy, 2.6, rgba(dotColor, 1));
    p.text(pill, 8.4, rgba(k.text, 1), right - (pw - 12) / 2, cy + 0.5, "center");
    p.rect(W - 32, cy - 10, 20, 20, 6, rgba(WHITE, 0.05), 0.5, rgba(WHITE, 0.1));
    p.seg(W - 25, cy - 3, W - 19, cy + 3, 0.6, rgba(k.text, 0.9));
    p.seg(W - 25, cy + 3, W - 19, cy - 3, 0.6, rgba(k.text, 0.9));

    // the sidebar
    p.rect(8, 8, SIDE - 14, H - HEADER - 16, 9, rgba([0, 0, 0], 0.26), 0.5, rgba(WHITE, 0.05));
    TABS.forEach((name, i) => {
      const active = i === state.tab;
      const tw = SIDE - 22, th = 24;
      const tx = 8 + (SIDE - 14) / 2 - tw / 2, ty = H - HEADER - 24 - i * 28 - th / 2;
      if (active) {
        p.rect(tx, ty, tw, th, 6, rgba(t.main, 0.2));
        p.seg(tx + 1.5, ty + 7, tx + 1.5, ty + th - 7, 1.1, rgba(t.main, 1));
      }
      glyph(p, i, tx + 13, ty + th / 2, active ? rgba(t.soft, 1) : rgba(k.muted, 0.8), [THEMES[7].main, THEMES[0].main, THEMES[3].main]);
      p.text(name, 9.6, rgba(active ? k.text : k.muted, 1), tx + 25, ty + th / 2 + 0.5);
      hit(tx, ty, tw, th, () => (state.tab = i));
    });
    p.text("THIS SESSION", 6, rgba(k.dim, 1), 17, 34);
    p.text(`${state.saves} saves`, 9.2, rgba(k.text, 1), 17, 21);

    // the page
    p.text(TABS[state.tab], 12.8, rgba(k.text, 1), L, H - HEADER - 19);
    p.text(TAB_INFO[state.tab], 7.6, rgba(k.muted, 1), L, H - HEADER - 33, "left", CW);
    const section = (str, y) => p.text(str, 6, rgba(k.dim, 1), L, y);
    const button = (str, cx, cyy, w, primary, h = 20) => {
      if (primary) p.rect(cx - w / 2, cyy - h / 2, w, h, 6, rgba(t.main, 1));
      else p.rect(cx - w / 2, cyy - h / 2, w, h, 6, rgba(WHITE, 0.06), 0.5, rgba(WHITE, 0.1));
      p.text(str, 9.2, rgba(primary ? WHITE : k.text, 1), cx, cyy + 0.5, "center", w - 8);
    };
    const tile = (label, x, y, w, on, action) => {
      p.rect(x, y - TILE_H / 2, w, TILE_H, 6, on ? rgba(t.main, 0.15) : rgba(WHITE, 0.035), 0.5, on ? rgba(t.main, 0.55) : rgba(WHITE, 0.07));
      const sw = 22, sh = 12, sx = x + w - sw - 7, sy = y - sh / 2;
      p.rect(sx, sy, sw, sh, sh / 2, on ? rgba(t.main, 1) : rgba(WHITE, 0.13));
      p.circle(on ? sx + sw - sh / 2 : sx + sh / 2, sy + sh / 2, sh / 2 - 2, rgba(WHITE, on ? 1 : 0.75));
      p.text(label, 9.2, rgba(on ? k.text : k.muted, 1), x + 9, y + 0.5, "left", w - 44);
      if (action) hit(x, y - TILE_H / 2, w, TILE_H, action);
    };

    if (state.tab === 0) {
      let y = H - HEADER - 54;
      section("STAGE", y);
      y -= 16;
      const cw = (CW - 3 * 7) / 8;
      STAGE_CHIPS.forEach((chip, i) => {
        const x = L + i * (cw + 3);
        const active = state.stage === i;
        if (active) p.rect(x, y - 10, cw, 20, 6, rgba(t.main, 1));
        else p.rect(x, y - 10, cw, 20, 6, rgba(WHITE, 0.05), 0.5, rgba(WHITE, 0.08));
        p.text(chip, 8.8, rgba(active ? WHITE : i === 7 ? k.muted : k.text, 1), x + cw / 2, y + 0.5, "center", cw - 5);
        hit(x, y - 10, cw, 20, () => (state.stage = i));
      });
      y -= 18;
      const frames = [0.5, 1, 2, 4, 6, 8, 10][state.stage];
      p.text(state.stage === 7 ? "Buffer: OFF" : state.stage === 6 ? "Buffer (custom): 10f / wave 5f" : `Buffer: ${frames}f / wave ${Math.max(frames / 2, 0.5)}f`, 7.6, rgba(k.muted, 1), L, y);
      y -= 22;
      section("PRESETS", y);
      y -= 22;
      const pw = (CW - 12) / 3;
      [["Safe", "2 frames, extra margin"], ["Balanced", "4 frames, more time at deaths"], ["Aggressive", "8 frames, max reach"]].forEach(([name, about], i) => {
        const x = L + i * (pw + 6);
        p.rect(x, y - 15, pw, 30, 6, rgba(WHITE, 0.035), 0.5, rgba(WHITE, 0.07));
        p.seg(x + 8, y - 6, x + 8, y + 6, 0.9, rgba(t.main, 0.35 + 0.3 * i));
        p.text(name, 9.6, rgba(k.text, 1), x + 14, y + 5);
        p.text(about, 6.4, rgba(k.muted, 1), x + 14, y - 6, "left", pw - 18);
        hit(x, y - 15, pw, 30, () => (state.stage = [2, 3, 5][i]));
      });
      y -= 40;
      // two half cards: the physics TPS, and the save rate's slider (v3.7)
      const half = (CW - 8) / 2, tpsRight = L + half, rateLeft = tpsRight + 8;
      p.rect(L, y - TILE_H / 2, half, TILE_H, 6, rgba(WHITE, 0.035), 0.5, rgba(WHITE, 0.07));
      p.text("Physics TPS", 8.4, rgba(k.text, 1), L + 8, y + 0.5, "left", half - 92);
      button("-", tpsRight - 64, y, 18, false, 18);
      button("+", tpsRight - 12, y, 18, false, 18);
      p.text("240", 8.8, rgba(t.soft, 1), tpsRight - 38, y + 0.5, "center");
      p.rect(rateLeft, y - TILE_H / 2, half, TILE_H, 6, rgba(WHITE, 0.035), 0.5, rgba(WHITE, 0.07));
      p.text("Save rate", 8.4, rgba(k.text, 1), rateLeft + 8, y + 0.5, "left", 40);
      const x0 = rateLeft + 54, x1 = rateLeft + half - 38, kx = x0 + ((x1 - x0) * state.saveRate) / 100;
      p.rect(x0, y - 1.5, x1 - x0, 3, 1.5, rgba(WHITE, 0.1));
      if (kx - x0 > 1) p.rect(x0, y - 1.5, kx - x0, 3, 1.5, rgba(t.main, 1));
      p.circle(kx, y, 5, rgba(WHITE, 1), 0.6, rgba(t.main, 1));
      p.text(`${state.saveRate}%`, 8.4, rgba(t.soft, 1), rateLeft + half - 18, y + 0.5, "center");
      // a tap on the track sets the rate there, in 5% steps
      hit(x0 - 8, y - 11, x1 - x0 + 16, 22, () => {
        const f = clamp(((state.pointer ? state.pointer[0] : kx) - x0) / (x1 - x0), 0, 1);
        state.saveRate = Math.round(f * 20) * 5;
      });
      p.text("Physics 240/s   |   CBF off   |   Memory 12 spots", 6.8, rgba(k.dim, 1), L, 30, "left", CW - 96);
      button("Run check", R - 42, 30, 84, true);
    }
    else if (state.tab === 1 || state.tab === 2 || state.tab === 4) {
      const options = OPTIONS[state.tab];
      const w = (CW - 8) / 2, rows = Math.ceil(options.length / 2), top = H - HEADER - 60;
      options.forEach((o, i) => {
        const key = `${state.tab}:${i}`;
        const on = key in state.switches ? state.switches[key] : !!o[1];
        tile(o[0], L + Math.floor(i / rows) * (w + 8), top - (i % rows) * PITCH, w, on, () => (state.switches[key] = !on));
      });
      if (state.tab === 4) {
        const names = ["Stats", "Console", "Copy log", "Forget level", "Settings", "Updates"];
        const bw = (CW - 25) / 6;
        names.forEach((n, i) => button(n, L + bw / 2 + i * (bw + 5), 30, bw, false));
      }
    }
    else if (state.tab === 3) {
      let y = H - HEADER - 60;
      tile("Use per-mode frames", L, y, CW, state.perMode, () => (state.perMode = !state.perMode));
      y -= 32;
      const w = (CW - 8) / 2;
      const values = [4, 2, 4, 3, 2, 4, 3, 3];
      MODE_NAMES.forEach((name, i) => {
        const x = L + Math.floor(i / 4) * (w + 8), ry = y - (i % 4) * PITCH;
        p.rect(x, ry - TILE_H / 2, w, TILE_H, 6, rgba(WHITE, 0.035), 0.5, rgba(WHITE, 0.07));
        p.rect(x + 7, ry - 6, 12, 12, 3, rgba(t.main, 0.35), 0.5, rgba(t.soft, 0.6));
        p.text(name[0], 7, rgba(k.text, 1), x + 13, ry + 0.3, "center");
        const x0 = x + 30, x1 = x + w - 36, frac = values[i] / 10;
        const kx = x0 + (x1 - x0) * frac;
        p.rect(x0, ry - 1.5, x1 - x0, 3, 1.5, rgba(WHITE, 0.1));
        p.rect(x0, ry - 1.5, kx - x0, 3, 1.5, state.perMode ? rgba(t.main, 1) : rgba(k.muted, 0.5));
        p.circle(kx, ry, 5, rgba(WHITE, state.perMode ? 1 : 0.7), 0.6, state.perMode ? rgba(t.main, 1) : rgba(k.muted, 0.6));
        p.text(`${values[i]}f`, 8.4, rgba(t.soft, 1), x + w - 17, ry + 0.5, "center");
      });
      p.text("Drag a slider: half-frame steps, up to 10 frames. Low latency's 1-frame limit doesn't apply here.", 6.4, rgba(k.dim, 1), L, 30, "left", CW);
    }
    else if (state.tab === 5) {
      const cw = (CW - 12) / 3, ch = 46;
      let y = H - HEADER - 46;
      GROUPS.forEach((group, gi) => {
        section(group, y);
        const lw = p.measure(group, 6);
        p.seg(L + lw + 6, y, R, y, 0.25, rgba(WHITE, 0.07));
        let slot = 0;
        THEMES.forEach((th, i) => {
          if (th.group !== gi) return;
          const active = i === state.theme;
          const x = L + slot * (cw + 6), cyy = y - 7 - ch;
          p.rect(x, cyy, cw, ch, 7, active ? rgba(th.main, 0.14) : rgba(WHITE, 0.035), active ? 0.9 : 0.5, active ? rgba(th.main, 1) : rgba(WHITE, 0.08));
          drawPreview(p, th, x + 3, cyy + 14, cw - 6, ch - 17, time);
          if (active) {
            p.circle(x + cw - 9, cyy + 7.5, 4.5, rgba(th.main, 1));
            p.seg(x + cw - 11.2, cyy + 7.5, x + cw - 9.6, cyy + 5.9, 0.5, rgba(WHITE, 1));
            p.seg(x + cw - 9.6, cyy + 5.9, x + cw - 6.8, cyy + 9, 0.5, rgba(WHITE, 1));
          } else {
            p.circle(x + cw - 14, cyy + 7.5, 2.6, rgba(th.main, 1));
            p.circle(x + cw - 8, cyy + 7.5, 2.6, rgba(th.second, 1));
          }
          p.text(th.name, 8, rgba(active ? k.text : k.muted, 1), x + 6, cyy + 7.5, "left", cw - 28);
          hit(x, cyy, cw, ch, () => state.onTheme && state.onTheme(i));
          slot++;
        });
        y -= ch + 15;
      });
    }
  }

  window.Kosmos = { THEMES, GROUPS, Painter, drawDeco, drawMenu, drawPreview, gradient, twinkles, loadSaturn, mix, rgba, ink, MENU: { W, H } };
})();
