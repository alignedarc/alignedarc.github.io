/* ============================================================
   PAGE CONTOUR MAP – Interactive topographic background
   Fixed full-viewport canvas that draws contour-map-style arcs
   in theme pink on a light gray background. Mouse proximity
   creates a smooth radial elevation that deforms the contour
   lines like a 3-D hill.
   Lines never overlap or intersect — they are iso-lines
   (level sets) of a continuous scalar field.
   Sections with opaque backgrounds naturally cover the canvas.
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('contour-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* ── Configuration ─────────────────────────────────────────── */
  var CELL        = 10;          // grid cell size (px)
  var LEVELS      = 14;          // number of contour iso-levels
  var NOISE_SCALE = 0.004;       // spatial frequency of noise
  var OCTAVES     = 4;           // fractal noise octaves
  var BUMP_STR    = 0.55;        // max bump height at mouse center
  var LINE_W      = 1.0;         // regular contour line width
  var MAJOR_W     = 1.6;         // major (every Nth) contour width
  var MAJOR_N     = 4;           // major line interval
  var PINK        = [208, 159, 166]; // theme pink RGB
  var A_MIN       = 0.20;        // min line opacity (lowest level)
  var A_MAX       = 0.60;        // max line opacity (highest level)
  var LERP_RATE   = 0.10;        // mouse-follow speed
  var FADE_IN     = 0.10;        // bump fade-in speed
  var FADE_OUT    = 0.04;        // bump fade-out speed

  /* ── Mutable state ─────────────────────────────────────────── */
  var W = 0, H = 0, cols = 0, rows = 0;
  var baseField   = null;        // Float64Array — pre-computed noise
  var bumpedField = null;        // Float64Array — noise + mouse bump
  var mouseX = -9999, mouseY = -9999;   // target mouse pos
  var curMX  = -9999, curMY  = -9999;   // smoothed mouse pos
  var bumpAlpha  = 0;            // current bump strength (0-1)
  var bumpTarget = 0;            // target bump strength
  var bumpRadius = 160;          // px — computed on resize
  var fieldMin = 0, fieldMax = 0;
  var raf = null;
  var pageVisible = true;
  var reducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ── Perlin Noise 2D ───────────────────────────────────────── */
  var P = new Uint8Array(512);
  var GR = [];                   // gradient vectors

  (function initNoise() {
    var i, j, tmp;
    for (i = 0; i < 256; i++) {
      var a = Math.random() * Math.PI * 2;
      GR[i] = [Math.cos(a), Math.sin(a)];
    }
    var p = [];
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) {
      j = (Math.random() * (i + 1)) | 0;
      tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (i = 0; i < 512; i++) P[i] = p[i & 255];
  })();

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function mix(a, b, t) { return a + t * (b - a); }

  function perlin(x, y) {
    var xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
    var xf = x - Math.floor(x),  yf = y - Math.floor(y);
    var u  = fade(xf), v = fade(yf);
    var g00 = GR[P[P[xi]     + yi]],     g10 = GR[P[P[xi + 1] + yi]];
    var g01 = GR[P[P[xi]     + yi + 1]], g11 = GR[P[P[xi + 1] + yi + 1]];
    return mix(
      mix(g00[0] * xf + g00[1] * yf, g10[0] * (xf - 1) + g10[1] * yf, u),
      mix(g01[0] * xf + g01[1] * (yf - 1), g11[0] * (xf - 1) + g11[1] * (yf - 1), u),
      v
    );
  }

  function fbm(x, y) {
    var val = 0, amp = 1, freq = 1, maxAmp = 0;
    for (var o = 0; o < OCTAVES; o++) {
      val += amp * perlin(x * freq, y * freq);
      maxAmp += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return val / maxAmp;
  }

  /* ── Marching Squares ──────────────────────────────────────── */
  // Case index bits: TL=8 | TR=4 | BR=2 | BL=1
  // Edges: 0=top  1=right  2=bottom  3=left
  var MS = [
    [],              //  0: 0000
    [[3,2]],         //  1: 0001
    [[2,1]],         //  2: 0010
    [[3,1]],         //  3: 0011
    [[0,1]],         //  4: 0100
    [[0,3],[1,2]],   //  5: 0101  saddle
    [[0,2]],         //  6: 0110
    [[0,3]],         //  7: 0111
    [[0,3]],         //  8: 1000
    [[0,2]],         //  9: 1001
    [[0,1],[2,3]],   // 10: 1010  saddle
    [[0,1]],         // 11: 1011
    [[1,3]],         // 12: 1100
    [[1,2]],         // 13: 1101
    [[2,3]],         // 14: 1110
    []               // 15: 1111
  ];

  // Reusable coordinates to avoid allocations in the hot loop
  var _ex = 0, _ey = 0;

  function edgePt(e, tl, tr, br, bl, x, y, th) {
    var d, t;
    switch (e) {
      case 0: d = tr - tl; t = Math.abs(d) < 1e-10 ? 0.5 : (th - tl) / d; _ex = x + t * CELL; _ey = y; break;
      case 1: d = br - tr; t = Math.abs(d) < 1e-10 ? 0.5 : (th - tr) / d; _ex = x + CELL;     _ey = y + t * CELL; break;
      case 2: d = br - bl; t = Math.abs(d) < 1e-10 ? 0.5 : (th - bl) / d; _ex = x + t * CELL; _ey = y + CELL; break;
      case 3: d = bl - tl; t = Math.abs(d) < 1e-10 ? 0.5 : (th - tl) / d; _ex = x;            _ey = y + t * CELL; break;
    }
  }

  /* ── Resize / Init Field ───────────────────────────────────── */
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cols = Math.ceil(W / CELL) + 2;
    rows = Math.ceil(H / CELL) + 2;
    bumpRadius = Math.max(120, Math.min(W, H) * 0.25);
    buildBase();
  }

  function buildBase() {
    var len = cols * rows;
    baseField   = new Float64Array(len);
    bumpedField = new Float64Array(len);
    var mn = Infinity, mx = -Infinity;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var v = fbm(c * CELL * NOISE_SCALE + 73.1, r * CELL * NOISE_SCALE + 41.7);
        baseField[r * cols + c] = v;
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
    }
    fieldMin = mn;
    fieldMax = mx;
    // Copy to bumpedField for the initial (no-bump) draw
    bumpedField.set(baseField);
  }

  /* ── Apply mouse bump to field ─────────────────────────────── */
  function applyBump() {
    var strength = BUMP_STR * bumpAlpha;
    var bRad = bumpRadius;
    var bRadSq = bRad * bRad;
    var r, c, idx, v, px, py, dx, dy, dSq, d, t;
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        idx = r * cols + c;
        v = baseField[idx];
        if (strength > 0.001) {
          px = c * CELL;
          py = r * CELL;
          dx = px - curMX;
          dy = py - curMY;
          dSq = dx * dx + dy * dy;
          if (dSq < bRadSq) {
            d = Math.sqrt(dSq);
            t = 1 - d / bRad;
            v += t * t * (3 - 2 * t) * strength;   // smoothstep bump
          }
        }
        bumpedField[idx] = v;
      }
    }
  }

  /* ── Draw contour lines ────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var mn = fieldMin;
    var mx = fieldMax + BUMP_STR;
    var range = mx - mn;
    if (range < 1e-6) return;

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    var f = bumpedField;
    var lv, th, frac, alpha, isMajor, r, c, rOff, rOff1;
    var tl, tr, br, bl, ci, segs, s, seg, x, y, x1, y1;

    for (lv = 0; lv < LEVELS; lv++) {
      th = mn + (lv + 1) * range / (LEVELS + 1);
      frac = lv / (LEVELS - 1 || 1);
      alpha = A_MIN + frac * (A_MAX - A_MIN);
      isMajor = ((lv + 1) % MAJOR_N === 0);

      ctx.lineWidth   = isMajor ? MAJOR_W : LINE_W;
      ctx.strokeStyle = 'rgba(' + PINK[0] + ',' + PINK[1] + ',' + PINK[2] + ',' + alpha.toFixed(3) + ')';
      ctx.beginPath();

      for (r = 0; r < rows - 1; r++) {
        rOff  = r * cols;
        rOff1 = rOff + cols;
        for (c = 0; c < cols - 1; c++) {
          tl = f[rOff  + c];
          tr = f[rOff  + c + 1];
          br = f[rOff1 + c + 1];
          bl = f[rOff1 + c];

          ci = (tl >= th ? 8 : 0) |
               (tr >= th ? 4 : 0) |
               (br >= th ? 2 : 0) |
               (bl >= th ? 1 : 0);

          if (ci === 0 || ci === 15) continue;

          segs = MS[ci];
          x = c * CELL;
          y = r * CELL;

          for (s = 0; s < segs.length; s++) {
            seg = segs[s];
            edgePt(seg[0], tl, tr, br, bl, x, y, th);
            x1 = _ex; y1 = _ey;
            edgePt(seg[1], tl, tr, br, bl, x, y, th);
            ctx.moveTo(x1, y1);
            ctx.lineTo(_ex, _ey);
          }
        }
      }
      ctx.stroke();
    }
  }

  /* ── Animation loop ────────────────────────────────────────── */
  function loop() {
    if (!pageVisible) { raf = requestAnimationFrame(loop); return; }

    var changed = false;

    // Smooth mouse follow
    var dmx = mouseX - curMX;
    var dmy = mouseY - curMY;
    if (Math.abs(dmx) > 0.3 || Math.abs(dmy) > 0.3) {
      curMX += dmx * LERP_RATE;
      curMY += dmy * LERP_RATE;
      changed = true;
    }

    // Smooth bump fade
    var da = bumpTarget - bumpAlpha;
    if (Math.abs(da) > 0.001) {
      bumpAlpha += da * (da > 0 ? FADE_IN : FADE_OUT);
      if (bumpAlpha < 0.001) bumpAlpha = 0;
      if (bumpAlpha > 0.999) bumpAlpha = 1;
      changed = true;
    }

    if (changed) {
      applyBump();
      draw();
    }

    raf = requestAnimationFrame(loop);
  }

  /* ── Event listeners ───────────────────────────────────────── */

  // Track mouse anywhere on the page (canvas is viewport-fixed,
  // so clientX/Y map directly to canvas coordinates)
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Snap if bump was fully faded so it doesn't animate from old spot
    if (bumpAlpha < 0.05) {
      curMX = mouseX;
      curMY = mouseY;
    }
    bumpTarget = 1;
  });

  document.addEventListener('mouseleave', function () {
    bumpTarget = 0;
  });

  document.addEventListener('touchmove', function (e) {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
    if (bumpAlpha < 0.05) {
      curMX = mouseX;
      curMY = mouseY;
    }
    bumpTarget = 1;
  }, { passive: true });

  document.addEventListener('touchend', function () {
    bumpTarget = 0;
  });

  // Pause animation when tab is hidden
  document.addEventListener('visibilitychange', function () {
    pageVisible = !document.hidden;
  });

  // Resize handler (debounced)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      applyBump();
      draw();
    }, 150);
  });

  /* ── Init ──────────────────────────────────────────────────── */
  resize();
  applyBump();
  draw();

  // If user prefers reduced motion, show static contours only
  if (!reducedMotion) {
    loop();
  }
})();
