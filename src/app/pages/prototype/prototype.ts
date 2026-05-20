import { isPlatformBrowser } from '@angular/common';
import type { ElementRef, OnDestroy } from '@angular/core';
import { Component, PLATFORM_ID, ViewChild, afterNextRender, inject } from '@angular/core';

// PROTOTYPE — throwaway. Delete before shipping.

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  rgb: string;
}

interface Comet {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
  t: number;
  speed: number;
  label: string;
  color: string;
  radius: number;
  trail: { x: number; y: number }[];
  px: number;
  py: number;
}

interface Satellite {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  beaconPhase: number;
  beaconRate: number;
}

const STAR_RGBS = [
  '180,200,255',
  '180,200,255',
  '180,200,255',
  '180,200,255',
  '180,200,255',
  '210,225,255',
  '210,225,255',
  '210,225,255',
  '255,255,255',
  '255,255,255',
  '215,195,255',
  '255,235,195',
];

const TECH_ITEMS = [
  { label: 'NG', color: '#DD0031' },
  { label: 'TS', color: '#3178C6' },
  { label: 'JS', color: '#F7DF1E' },
  { label: 'RE', color: '#61DAFB' },
  { label: 'ND', color: '#339933' },
  { label: 'RX', color: '#B7178C' },
  { label: 'GIT', color: '#F05032' },
  { label: 'PG', color: '#336791' },
  { label: 'TW', color: '#06B6D4' },
  { label: 'PW', color: '#2EAD33' },
  { label: 'AWS', color: '#FF9900' },
  { label: 'DK', color: '#2496ED' },
  { label: 'NX', color: '#E0234E' },
  { label: 'GQL', color: '#E10098' },
  { label: 'VT', color: '#FCC72B' },
];

@Component({
  selector: 'app-prototype',
  standalone: true,
  template: `
    <canvas #canvas style="display:block;width:100%;height:100vh"></canvas>
    <div class="var-bar">
      <span class="lbl">Path</span>
      <button [class.active]="pathMode === 'straight'" (click)="setMode('straight')">
        Straight
      </button>
      <button [class.active]="pathMode === 'curved'" (click)="setMode('curved')">Curved</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        background: #070714;
        overflow: hidden;
      }
      .var-bar {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(10, 10, 28, 0.88);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 10px 20px;
        display: flex;
        gap: 10px;
        align-items: center;
        color: #ccd;
        font-family: monospace;
        font-size: 13px;
        z-index: 100;
        white-space: nowrap;
      }
      .lbl {
        opacity: 0.55;
      }
      button {
        background: rgba(255, 255, 255, 0.07);
        color: #ccd;
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 5px 14px;
        border-radius: 7px;
        cursor: pointer;
        font-size: 13px;
        font-family: monospace;
      }
      button.active {
        background: rgba(100, 100, 255, 0.35);
        border-color: rgba(130, 130, 255, 0.5);
        color: #fff;
      }
    `,
  ],
})
export class PrototypeComponent implements OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private platform = inject(PLATFORM_ID);

  pathMode: 'straight' | 'curved' = 'curved';

  private stars: Star[] = [];
  private comets: Comet[] = [];
  private satellites: Satellite[] = [];
  private bgCanvas: HTMLCanvasElement | null = null;
  private mouse = { x: -9999, y: -9999 };
  private rafId = 0;
  private frame = 0;
  private onMouseMove?: (e: MouseEvent) => void;
  private onResize?: () => void;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platform)) return;
      this.init();
    });
  }

  setMode(mode: 'straight' | 'curved') {
    this.pathMode = mode;
    this.comets = [];
  }

  private init() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    this.onResize = () => {
      canvas.width = canvas.clientWidth || window.innerWidth;
      canvas.height = canvas.clientHeight || window.innerHeight;
      this.buildBackground(canvas.width, canvas.height);
      this.spawnStars(canvas.width, canvas.height);
      this.spawnSatellites(canvas.width, canvas.height);
    };
    this.onResize();
    window.addEventListener('resize', this.onResize);

    this.onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    };
    window.addEventListener('mousemove', this.onMouseMove);

    this.animate(ctx, canvas);
  }

  // Renders all static elements once; tick blits this as a cheap base layer.
  private buildBackground(w: number, h: number) {
    const bg = document.createElement('canvas');
    bg.width = w;
    bg.height = h;
    const ctx = bg.getContext('2d')!;

    // Nebula clouds — mix of blue/purple and warm pink/fuchsia/amber
    const nebulae = [
      { x: w * 0.15, y: h * 0.22, rx: w * 0.24, ry: h * 0.3, color: 'rgba(110,35,180,0.13)' },
      { x: w * 0.72, y: h * 0.58, rx: w * 0.22, ry: h * 0.32, color: 'rgba(25,65,195,0.10)' },
      { x: w * 0.48, y: h * 0.8, rx: w * 0.32, ry: h * 0.22, color: 'rgba(218,35,115,0.12)' },
      { x: w * 0.86, y: h * 0.14, rx: w * 0.16, ry: h * 0.2, color: 'rgba(195,130,15,0.10)' },
      { x: w * 0.34, y: h * 0.5, rx: w * 0.18, ry: h * 0.22, color: 'rgba(18,108,138,0.08)' },
    ];
    for (const n of nebulae) {
      const maxR = Math.max(n.rx, n.ry);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.scale(n.rx / maxR, n.ry / maxR);
      ctx.beginPath();
      ctx.arc(0, 0, maxR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // Milky Way — diagonal band of glow + dense micro-stars
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.35);
    const bandLen = Math.hypot(w, h) * 1.15;
    const bandH = h * 0.2;
    const mwGrad = ctx.createLinearGradient(0, -bandH / 2, 0, bandH / 2);
    mwGrad.addColorStop(0, 'rgba(0,0,0,0)');
    mwGrad.addColorStop(0.25, 'rgba(165,190,245,0.036)');
    mwGrad.addColorStop(0.5, 'rgba(195,215,255,0.065)');
    mwGrad.addColorStop(0.75, 'rgba(165,190,245,0.036)');
    mwGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = mwGrad;
    ctx.fillRect(-bandLen / 2, -bandH / 2, bandLen, bandH);
    for (let i = 0; i < 700; i++) {
      const sx = (Math.random() - 0.5) * bandLen;
      const sy = (Math.random() - 0.5) * bandH * Math.pow(Math.random(), 1.6);
      ctx.beginPath();
      ctx.arc(sx, sy, Math.random() * 0.75, 0, Math.PI * 2);
      const cr = Math.random();
      const a = 0.12 + Math.random() * 0.48;
      ctx.fillStyle =
        cr < 0.58
          ? `rgba(215,228,255,${a})`
          : cr < 0.78
            ? `rgba(255,200,220,${a})`
            : `rgba(255,232,180,${a})`;
      ctx.fill();
    }
    ctx.restore();

    // Distant galaxies — elliptical halo + concentrated star cluster
    const galaxies = [
      { x: w * 0.83, y: h * 0.11, r: 42, tilt: 0.42 },
      { x: w * 0.11, y: h * 0.76, r: 30, tilt: -0.58 },
    ];
    for (const g of galaxies) {
      // Halo (flattened via scale)
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.tilt);
      ctx.scale(1, 0.32);
      const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, g.r * 2.8);
      halo.addColorStop(0, 'rgba(215,225,255,0.22)');
      halo.addColorStop(0.35, 'rgba(195,210,255,0.10)');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(0, 0, g.r * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();
      ctx.restore();
      // Star cluster — power-law concentration toward centre
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.tilt);
      for (let i = 0; i < 70; i++) {
        const a = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 2.2) * g.r;
        ctx.beginPath();
        ctx.arc(
          Math.cos(a) * dist,
          Math.sin(a) * dist * 0.32,
          Math.random() * 0.85,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(230,238,255,${0.28 + Math.random() * 0.58})`;
        ctx.fill();
      }
      ctx.restore();
    }

    // Static background stars (non-interactive — adds density without physics cost)
    for (let i = 0; i < 380; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${STAR_RGBS[Math.floor(Math.random() * STAR_RGBS.length)]},${0.12 + Math.random() * 0.38})`;
      ctx.fill();
    }

    this.bgCanvas = bg;
  }

  private spawnStars(w: number, h: number) {
    this.stars = Array.from({ length: 200 }, () => {
      const bx = Math.random() * w,
        by = Math.random() * h;
      const r = Math.random();
      const size =
        r < 0.65
          ? 0.3 + Math.random() * 1.2
          : r < 0.92
            ? 1.5 + Math.random() * 1.3
            : 2.8 + Math.random() * 1.2;
      return {
        x: bx,
        y: by,
        vx: 0,
        vy: 0,
        baseX: bx,
        baseY: by,
        size,
        opacity: 0.2 + Math.random() * 0.65,
        rgb: STAR_RGBS[Math.floor(Math.random() * STAR_RGBS.length)],
      };
    });
  }

  private spawnSatellites(w: number, h: number) {
    // One satellite, entering from a random edge, drifting slowly across
    const edge = Math.floor(Math.random() * 4);
    let x: number, y: number, vx: number, vy: number;
    const speed = 0.18 + Math.random() * 0.14;
    if (edge === 0) {
      x = Math.random() * w;
      y = -20;
      vx = (Math.random() - 0.5) * 0.08;
      vy = speed;
    } else if (edge === 1) {
      x = w + 20;
      y = Math.random() * h;
      vx = -speed;
      vy = (Math.random() - 0.5) * 0.08;
    } else if (edge === 2) {
      x = Math.random() * w;
      y = h + 20;
      vx = (Math.random() - 0.5) * 0.08;
      vy = -speed;
    } else {
      x = -20;
      y = Math.random() * h;
      vx = speed;
      vy = (Math.random() - 0.5) * 0.08;
    }
    this.satellites = [
      {
        x,
        y,
        vx,
        vy,
        angle: Math.atan2(vy, vx),
        spin: 0.0008 + Math.random() * 0.001,
        beaconPhase: 0,
        beaconRate: 0.08 + Math.random() * 0.04,
      },
    ];
  }

  private drawSatellite(ctx: CanvasRenderingContext2D, s: Satellite) {
    const bw = 22,
      bh = 13; // body width / height
    const pw = 30,
      ph = 6; // panel width / height

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);

    // Solar panels — dark blue cells with grid lines
    for (const side of [-1, 1]) {
      const px0 = side > 0 ? bw / 2 : -bw / 2 - pw;
      ctx.fillStyle = 'rgba(22,42,105,0.92)';
      ctx.fillRect(px0, -ph / 2, pw, ph);
      ctx.strokeStyle = 'rgba(55,85,165,0.60)';
      ctx.lineWidth = 0.6;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(px0 + (pw / 4) * i, -ph / 2);
        ctx.lineTo(px0 + (pw / 4) * i, ph / 2);
        ctx.stroke();
      }
      ctx.strokeRect(px0, -ph / 2, pw, ph);
      // Thin strut connecting panel to body
      ctx.strokeStyle = 'rgba(170,175,182,0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(side > 0 ? bw / 2 : -bw / 2, 0);
      ctx.lineTo(side > 0 ? bw / 2 + pw : -bw / 2 - pw, 0);
      ctx.stroke();
    }

    // Main body
    ctx.fillStyle = 'rgba(152,158,168,0.92)';
    ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
    // Highlight top edge — suggests sunlit face
    ctx.fillStyle = 'rgba(210,215,225,0.55)';
    ctx.fillRect(-bw / 2, -bh / 2, bw, 2.5);
    // Shadow bottom edge
    ctx.fillStyle = 'rgba(50,53,60,0.45)';
    ctx.fillRect(-bw / 2, bh / 2 - 2.5, bw, 2.5);
    ctx.strokeStyle = 'rgba(185,190,200,0.50)';
    ctx.lineWidth = 0.6;
    ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);

    // Dish antenna — thin mast + arc
    ctx.strokeStyle = 'rgba(190,195,205,0.72)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(4, -bh / 2);
    ctx.lineTo(4, -bh / 2 - 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(4, -bh / 2 - 10, 4, Math.PI * 0.9, Math.PI * 2.1);
    ctx.stroke();

    // Red blinking beacon — sine-wave pulse
    const bPulse = 0.5 + 0.5 * Math.sin(s.beaconPhase);
    ctx.shadowColor = '#ff1a1a';
    ctx.shadowBlur = 8 + 8 * bPulse;
    ctx.beginPath();
    ctx.arc(bw / 2 - 4, bh / 2 - 4, 2 + 0.6 * bPulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,${30 + Math.round(30 * bPulse)},30,${0.65 + 0.35 * bPulse})`;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  private spawnComet(w: number, h: number) {
    const startEdge = Math.floor(Math.random() * 4);
    let ax: number, ay: number;
    if (startEdge === 0) {
      ax = Math.random() * w;
      ay = -40;
    } else if (startEdge === 1) {
      ax = w + 40;
      ay = Math.random() * h;
    } else if (startEdge === 2) {
      ax = Math.random() * w;
      ay = h + 40;
    } else {
      ax = -40;
      ay = Math.random() * h;
    }

    const destEdge =
      Math.random() < 0.65
        ? (startEdge + 2) % 4
        : Math.random() < 0.5
          ? (startEdge + 1) % 4
          : (startEdge + 3) % 4;
    let bx: number, by: number;
    if (destEdge === 0) {
      bx = Math.random() * w;
      by = -40;
    } else if (destEdge === 1) {
      bx = w + 40;
      by = Math.random() * h;
    } else if (destEdge === 2) {
      bx = Math.random() * w;
      by = h + 40;
    } else {
      bx = -40;
      by = Math.random() * h;
    }

    const mx = (ax + bx) / 2,
      my = (ay + by) / 2;
    const dx = bx - ax,
      dy = by - ay;
    const k = (Math.random() - 0.5) * 0.45;

    const tech = TECH_ITEMS[Math.floor(Math.random() * TECH_ITEMS.length)];
    this.comets.push({
      ax,
      ay,
      bx,
      by,
      cx: mx - dy * k,
      cy: my + dx * k,
      t: 0,
      speed: 0.0018 + Math.random() * 0.0022,
      label: tech.label,
      color: tech.color,
      radius: 14 + Math.random() * 8,
      trail: [],
      px: ax,
      py: ay,
    });
  }

  private animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const PUSH_R = 80;
    const PUSH_R_SQ = PUSH_R * PUSH_R;

    const tick = () => {
      const w = canvas.width,
        h = canvas.height;

      // Spawning
      this.frame++;
      if (this.frame === 10 && this.comets.length === 0) this.spawnComet(w, h);
      if (this.frame % 100 === 0 && this.comets.length < 5) this.spawnComet(w, h);

      // Phase 1: advance comet positions + trails
      this.comets = this.comets.filter((c) => {
        c.t += c.speed;
        const t = c.t,
          m = 1 - t;
        c.px =
          this.pathMode === 'curved'
            ? m * m * c.ax + 2 * m * t * c.cx + t * t * c.bx
            : c.ax + (c.bx - c.ax) * t;
        c.py =
          this.pathMode === 'curved'
            ? m * m * c.ay + 2 * m * t * c.cy + t * t * c.by
            : c.ay + (c.by - c.ay) * t;
        c.trail.push({ x: c.px, y: c.py });
        if (c.trail.length > 35) c.trail.shift();
        return c.t < 1.1;
      });

      // Satellite — drift, tick beacon, respawn when it leaves the canvas
      for (const s of this.satellites) {
        s.x += s.vx;
        s.y += s.vy;
        s.beaconPhase += s.beaconRate;
        if (s.x < -80 || s.x > w + 80 || s.y < -80 || s.y > h + 80) {
          this.spawnSatellites(w, h);
          break;
        }
      }

      // Phase 3: star physics — mouse push + comet push, then spring home
      for (const s of this.stars) {
        const mdx = s.x - this.mouse.x,
          mdy = s.y - this.mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < PUSH_R_SQ && md2 > 0) {
          const md = Math.sqrt(md2);
          s.vx += (mdx / md) * ((PUSH_R - md) / PUSH_R) * 1.2;
          s.vy += (mdy / md) * ((PUSH_R - md) / PUSH_R) * 1.2;
        }
        for (const c of this.comets) {
          const cdx = s.x - c.px,
            cdy = s.y - c.py;
          const cd2 = cdx * cdx + cdy * cdy;
          if (cd2 < PUSH_R_SQ && cd2 > 0) {
            const cd = Math.sqrt(cd2);
            s.vx += (cdx / cd) * ((PUSH_R - cd) / PUSH_R) * 1.8;
            s.vy += (cdy / cd) * ((PUSH_R - cd) / PUSH_R) * 1.8;
          }
        }
        s.vx = (s.vx + (s.baseX - s.x) * 0.008) * 0.95;
        s.vy = (s.vy + (s.baseY - s.y) * 0.008) * 0.95;
        s.x += s.vx;
        s.y += s.vy;
      }

      // Phase 4: render
      ctx.fillStyle = '#070714';
      ctx.fillRect(0, 0, w, h);

      // Static layer: nebulae, milky way, galaxies, bg stars
      if (this.bgCanvas) ctx.drawImage(this.bgCanvas, 0, 0);

      // Interactive stars
      for (const s of this.stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.rgb},${s.opacity})`;
        ctx.fill();
      }

      // Satellite
      for (const s of this.satellites) this.drawSatellite(ctx, s);

      // Comets — tapered trail + glowing head
      ctx.lineCap = 'round';
      for (const c of this.comets) {
        for (let i = 1; i < c.trail.length; i++) {
          const pct = i / c.trail.length;
          ctx.beginPath();
          ctx.moveTo(c.trail[i - 1].x, c.trail[i - 1].y);
          ctx.lineTo(c.trail[i].x, c.trail[i].y);
          ctx.strokeStyle = c.color;
          ctx.globalAlpha = pct * 0.55;
          ctx.lineWidth = Math.max(1, c.radius * 1.8 * pct);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        ctx.shadowColor = c.color;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(c.px, c.py, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = `bold ${Math.round(c.radius * 0.75)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 3;
        ctx.fillText(c.label, c.px, c.py);
        ctx.shadowBlur = 0;
      }

      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platform)) return;
    cancelAnimationFrame(this.rafId);
    if (this.onMouseMove) window.removeEventListener('mousemove', this.onMouseMove);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
  }
}
