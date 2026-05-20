import { isPlatformBrowser } from '@angular/common';
import type { ElementRef, OnDestroy } from '@angular/core';
import { Component, PLATFORM_ID, ViewChild, afterNextRender, inject } from '@angular/core';

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
  layer: 0 | 1;
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
  selector: 'app-star-field',
  standalone: true,
  template: `<canvas #canvas style="display:block;width:100%;height:100%"></canvas>`,
  styles: [
    ':host{position:absolute;inset:0;display:block;pointer-events:none;z-index:0;background:#070714}',
  ],
})
export class StarFieldComponent implements OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private platform = inject(PLATFORM_ID);

  private stars: Star[] = [];
  private mouse = { x: -9999, y: -9999 };
  // Two parallax layers, each with its own position + velocity for inertia-based movement
  private parallax = [
    { x: 0, y: 0, vx: 0, vy: 0 },
    { x: 0, y: 0, vx: 0, vy: 0 },
  ];
  private rafId = 0;
  private onMouseMove?: (e: MouseEvent) => void;
  private onResize?: () => void;
  // Slowly drifts between Gentle Wake (0) and Hard Scatter (1) on a random timer
  private physicsBlend = 0;
  private physicsTarget = 0;
  private blendCount = 0;
  private blendLimit = 480;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platform)) return;
      this.init();
    });
  }

  private init() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    this.onResize = () => {
      canvas.width = canvas.clientWidth || window.innerWidth;
      canvas.height = canvas.clientHeight || window.innerHeight;
      this.spawnStars(canvas.width, canvas.height);
    };
    this.onResize();
    window.addEventListener('resize', this.onResize);

    this.onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', this.onMouseMove);

    this.animate(ctx, canvas);
  }

  private animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const layerConfigs = [
      { depthMultiplier: 0.032, attractionStrength: 0.004, velocityDamping: 0.9 },
      { depthMultiplier: 0.072, attractionStrength: 0.007, velocityDamping: 0.9 },
    ];

    const tick = () => {
      const w = canvas.width,
        h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2,
        centerY = h / 2;

      for (let i = 0; i < 2; i++) {
        const { depthMultiplier, attractionStrength, velocityDamping } = layerConfigs[i];
        const p = this.parallax[i];
        const targetX = (this.mouse.x - centerX) * depthMultiplier;
        const targetY = (this.mouse.y - centerY) * depthMultiplier;
        // Velocity attracted to target then decays — keeps drifting after mouse stops
        p.vx = (p.vx + (targetX - p.x) * attractionStrength) * velocityDamping;
        p.vy = (p.vy + (targetY - p.y) * attractionStrength) * velocityDamping;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Drift physics between Gentle Wake and Hard Scatter on a random timer
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

      for (const star of this.stars) {
        const dx = star.x - this.mouse.x,
          dy = star.y - this.mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < pushRadius * pushRadius && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = ((pushRadius - dist) / pushRadius) * pushForce;
          const nx = dx / dist,
            ny = dy / dist;
          star.vx += nx * force * radial + -ny * force * (1 - radial);
          star.vy += ny * force * radial + nx * force * (1 - radial);
        }
        star.vx = (star.vx + (star.baseX - star.x) * spring) * damping;
        star.vy = (star.vy + (star.baseY - star.y) * spring) * damping;
        star.x += star.vx;
        star.y += star.vy;

        const offset = this.parallax[star.layer];
        ctx.beginPath();
        ctx.arc(star.x + offset.x, star.y + offset.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.rgb},${star.opacity})`;
        ctx.fill();
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private spawnStars(width: number, height: number) {
    this.stars = Array.from({ length: 110 }, (_, i) => {
      const baseX = Math.random() * width,
        baseY = Math.random() * height;
      const r = Math.random();
      const size =
        r < 0.65
          ? 0.3 + Math.random() * 1.2
          : r < 0.92
            ? 1.5 + Math.random() * 1.3
            : 2.8 + Math.random() * 1.2;
      return {
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
        baseX,
        baseY,
        size,
        opacity: 0.2 + Math.random() * 0.65,
        rgb: STAR_RGBS[Math.floor(Math.random() * STAR_RGBS.length)],
        layer: (i < 55 ? 0 : 1) as 0 | 1,
      };
    });
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platform)) return;
    cancelAnimationFrame(this.rafId);
    if (this.onMouseMove) window.removeEventListener('mousemove', this.onMouseMove);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
  }
}
