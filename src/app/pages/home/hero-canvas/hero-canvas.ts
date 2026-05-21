import { isPlatformBrowser } from '@angular/common';
import type { ElementRef, OnDestroy } from '@angular/core';
import { Component, PLATFORM_ID, ViewChild, afterNextRender, inject, input } from '@angular/core';
import { DevicePerformanceService } from '../../../core/services/device-performance.service';
import type { TechIcon } from '../tech-stack.config';

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

interface FlyingLogo {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
  t: number;
  speed: number;
  icon: TechIcon;
  img: HTMLImageElement | null;
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

// Weighted colour pool: mostly blue-white, occasional violet / warm-white / pure-white
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

@Component({
  selector: 'app-hero-canvas',
  standalone: true,
  template: `<canvas #canvas style="display:block;width:100%;height:100%"></canvas>`,
  styles: [
    ':host{position:absolute;inset:0;display:block;pointer-events:none;z-index:0;background:#070714}',
  ],
})
export class HeroCanvasComponent implements OnDestroy {
  readonly icons = input.required<TechIcon[]>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly platform = inject(PLATFORM_ID);
  private readonly perf = inject(DevicePerformanceService);

  private stars: Star[] = [];
  private logos: FlyingLogo[] = [];
  private satellites: Satellite[] = [];
  private bgCanvas: HTMLCanvasElement | null = null;
  private readonly preloadedImages = new Map<string, HTMLImageElement>();
  private mouse = { x: -9999, y: -9999 };
  private rafId = 0;
  private frame = 0;
  private physicsBlend = 0;
  private physicsTarget = 0;
  private blendCount = 0;
  private blendLimit = 480;
  private onMouseMove?: (e: MouseEvent) => void;
  private onResize?: () => void;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platform)) return;
      this.init();
    });
  }

  private init() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const isLowPerf = this.perf.isLowPerf();
    const isReduced = this.perf.prefersReducedMotion();

    this.startPreload(this.icons());

    this.onResize = () => {
      canvas.width = canvas.clientWidth || window.innerWidth;
      canvas.height = canvas.clientHeight || window.innerHeight;
      this.buildBackground(canvas.width, canvas.height);
      this.spawnStars(canvas.width, canvas.height);
      if (!isLowPerf) this.spawnSatellites(canvas.width, canvas.height);
      if (isReduced) {
        this.spawnStaticLogos(canvas.width, canvas.height);
        this.renderStatic(ctx, canvas);
      }
    };
    this.onResize();
    window.addEventListener('resize', this.onResize);

    this.onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    };
    window.addEventListener('mousemove', this.onMouseMove);

    if (isReduced) return;

    this.animate(ctx, canvas);
  }

  private startPreload(icons: TechIcon[]) {
    for (const icon of icons) {
      if (this.preloadedImages.has(icon.iconUrl)) continue;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => this.preloadedImages.set(icon.iconUrl, img);
      img.src = icon.iconUrl;
    }
  }

  private renderStatic(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = '#070714';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (this.bgCanvas && this.bgCanvas.width > 0 && this.bgCanvas.height > 0) {
      ctx.drawImage(this.bgCanvas, 0, 0);
    }
    for (const s of this.stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.rgb},${s.opacity})`;
      ctx.fill();
    }
    for (const l of this.logos) {
      this.drawLogoHead(ctx, l);
    }
  }

  private spawnStaticLogos(w: number, h: number) {
    this.logos = [];
    const icons = this.icons();
    if (icons.length === 0) return;
    for (let i = 0; i < 8; i++) {
      const icon = icons[Math.floor(Math.random() * icons.length)];
      this.logos.push({
        ax: 0,
        ay: 0,
        bx: 0,
        by: 0,
        cx: 0,
        cy: 0,
        t: 1,
        speed: 0,
        icon,
        img: this.preloadedImages.get(icon.iconUrl) ?? null,
        radius: 14 + Math.random() * 8,
        trail: [],
        px: w * (0.08 + Math.random() * 0.84),
        py: h * (0.08 + Math.random() * 0.84),
      });
    }
  }

  // Pre-renders static deep-space elements to an offscreen canvas; blitted cheaply each frame.
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

    // Milky Way — diagonal band of glow + dense micro-stars with colour temperature variation
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

    // Distant galaxies — elliptical halo + power-law star cluster
    const galaxies = [
      { x: w * 0.83, y: h * 0.11, r: 42, tilt: 0.42 },
      { x: w * 0.11, y: h * 0.76, r: 30, tilt: -0.58 },
    ];
    for (const g of galaxies) {
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
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.tilt);
      for (let i = 0; i < 70; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 2.2) * g.r;
        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * dist,
          Math.sin(angle) * dist * 0.32,
          Math.random() * 0.85,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(230,238,255,${0.28 + Math.random() * 0.58})`;
        ctx.fill();
      }
      ctx.restore();
    }

    // Static background stars — adds density without physics cost
    for (let i = 0; i < 380; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${STAR_RGBS[Math.floor(Math.random() * STAR_RGBS.length)]},${0.12 + Math.random() * 0.38})`;
      ctx.fill();
    }

    this.bgCanvas = bg;
  }

  private spawnStars(w: number, h: number) {
    const count = this.perf.isLowPerf() ? 120 : 200;
    this.stars = Array.from({ length: count }, () => {
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
      bh = 13;
    const pw = 30,
      ph = 6;

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);

    // Solar panels — dark blue cells with grid dividers and connecting struts
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
      ctx.strokeStyle = 'rgba(170,175,182,0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(side > 0 ? bw / 2 : -bw / 2, 0);
      ctx.lineTo(side > 0 ? bw / 2 + pw : -bw / 2 - pw, 0);
      ctx.stroke();
    }

    // Main body — silver with sunlit top edge and shadowed bottom edge
    ctx.fillStyle = 'rgba(152,158,168,0.92)';
    ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
    ctx.fillStyle = 'rgba(210,215,225,0.55)';
    ctx.fillRect(-bw / 2, -bh / 2, bw, 2.5);
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

    // Pulsing red beacon
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

  private spawnLogo(w: number, h: number) {
    const icons = this.icons();
    if (icons.length === 0) return;

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

    // 65% chance to exit the opposite edge; 35% chance to exit an adjacent edge
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

    const icon = icons[Math.floor(Math.random() * icons.length)];
    this.logos.push({
      ax,
      ay,
      bx,
      by,
      cx: mx - dy * k,
      cy: my + dx * k,
      t: 0,
      speed: 0.0018 + Math.random() * 0.0022,
      icon,
      img: this.preloadedImages.get(icon.iconUrl) ?? null,
      radius: 14 + Math.random() * 8,
      trail: [],
      px: ax,
      py: ay,
    });
  }

  private drawLogoHead(ctx: CanvasRenderingContext2D, l: FlyingLogo) {
    ctx.save();

    // White circle with brand-coloured glow
    ctx.shadowColor = l.icon.color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(l.px, l.py, l.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Clip to circle so square SVG icons stay inside the bubble
    ctx.beginPath();
    ctx.arc(l.px, l.py, l.radius, 0, Math.PI * 2);
    ctx.clip();

    const img = l.img ?? this.preloadedImages.get(l.icon.iconUrl) ?? null;
    if (img && img.complete && img.naturalWidth > 0) {
      const s = l.radius * 2;
      ctx.drawImage(img, l.px - s / 2, l.py - s / 2, s, s);
    } else {
      // Fallback: brand-coloured fill with text abbreviation
      ctx.fillStyle = l.icon.color;
      ctx.fillRect(l.px - l.radius, l.py - l.radius, l.radius * 2, l.radius * 2);
      ctx.font = `bold ${Math.round(l.radius * 0.75)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(l.icon.label.substring(0, 3), l.px, l.py);
    }

    ctx.restore();
  }

  private animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const isLowPerf = this.perf.isLowPerf();

    const tick = () => {
      const w = canvas.width,
        h = canvas.height;

      // Spawn initial logo quickly, then throttle to max 5 in flight
      this.frame++;
      if (this.frame === 10 && this.logos.length === 0) this.spawnLogo(w, h);
      if (this.frame % 100 === 0 && this.logos.length < 5) this.spawnLogo(w, h);

      // Phase 1: advance logo positions + build trails
      this.logos = this.logos.filter((l) => {
        l.t += l.speed;
        const t = l.t,
          m = 1 - t;
        l.px = m * m * l.ax + 2 * m * t * l.cx + t * t * l.bx;
        l.py = m * m * l.ay + 2 * m * t * l.cy + t * t * l.by;
        l.trail.push({ x: l.px, y: l.py });
        if (l.trail.length > 35) l.trail.shift();
        // Pick up image if it finished loading since spawn
        if (!l.img) l.img = this.preloadedImages.get(l.icon.iconUrl) ?? null;
        return l.t < 1.1;
      });

      // Phase 2: satellite drift + beacon tick; respawn when it exits the canvas
      for (const s of this.satellites) {
        s.x += s.vx;
        s.y += s.vy;
        s.beaconPhase += s.beaconRate;
        if (s.x < -80 || s.x > w + 80 || s.y < -80 || s.y > h + 80) {
          this.spawnSatellites(w, h);
          break;
        }
      }

      // Phase 3: star physics — blend between Gentle Wake and Hard Scatter on a random timer
      if (++this.blendCount > this.blendLimit) {
        this.physicsTarget = Math.random() < 0.5 ? 0 : 1;
        this.blendLimit = 300 + Math.floor(Math.random() * 420);
        this.blendCount = 0;
      }
      this.physicsBlend += (this.physicsTarget - this.physicsBlend) * 0.004;
      const pb = this.physicsBlend;
      const pushRadius = 80 + 70 * pb;
      const pushForce = 1.0 + 1.5 * pb;
      const radial = 0.7 + 0.15 * pb;
      const spring = 0.006 + 0.006 * pb;
      const damping = 0.97 - 0.04 * pb;
      const pushRadiusSq = pushRadius * pushRadius;

      for (const s of this.stars) {
        if (!isLowPerf) {
          // Mouse push — radial/tangential blend gives Hard Scatter its spiral kick
          const mdx = s.x - this.mouse.x,
            mdy = s.y - this.mouse.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < pushRadiusSq && md2 > 0) {
            const md = Math.sqrt(md2);
            const force = ((pushRadius - md) / pushRadius) * pushForce;
            const nx = mdx / md,
              ny = mdy / md;
            s.vx += nx * force * radial + -ny * force * (1 - radial);
            s.vy += ny * force * radial + nx * force * (1 - radial);
          }
          // Logo push — pure radial, 1.5× mouse force for a stronger scatter
          for (const l of this.logos) {
            const cdx = s.x - l.px,
              cdy = s.y - l.py;
            const cd2 = cdx * cdx + cdy * cdy;
            if (cd2 < pushRadiusSq && cd2 > 0) {
              const cd = Math.sqrt(cd2);
              const force = ((pushRadius - cd) / pushRadius) * pushForce * 1.5;
              s.vx += (cdx / cd) * force;
              s.vy += (cdy / cd) * force;
            }
          }
        }
        s.vx = (s.vx + (s.baseX - s.x) * spring) * damping;
        s.vy = (s.vy + (s.baseY - s.y) * spring) * damping;
        s.x += s.vx;
        s.y += s.vy;
      }

      // Phase 4: render
      ctx.fillStyle = '#070714';
      ctx.fillRect(0, 0, w, h);
      if (this.bgCanvas && this.bgCanvas.width > 0 && this.bgCanvas.height > 0) {
        ctx.drawImage(this.bgCanvas, 0, 0);
      }

      for (const s of this.stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.rgb},${s.opacity})`;
        ctx.fill();
      }

      for (const s of this.satellites) this.drawSatellite(ctx, s);

      // Flying logos — tapered glowing trail + icon head
      ctx.lineCap = 'round';
      for (const l of this.logos) {
        for (let i = 1; i < l.trail.length; i++) {
          const pct = i / l.trail.length;
          ctx.beginPath();
          ctx.moveTo(l.trail[i - 1].x, l.trail[i - 1].y);
          ctx.lineTo(l.trail[i].x, l.trail[i].y);
          ctx.strokeStyle = l.icon.color;
          ctx.globalAlpha = pct * 0.55;
          ctx.lineWidth = Math.max(1, l.radius * 1.8 * pct);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        this.drawLogoHead(ctx, l);
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
