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
  layer: 0 | 1;
}

@Component({
  selector: 'app-star-field',
  standalone: true,
  template: `<canvas #canvas style="display:block;width:100%;height:100%"></canvas>`,
  styles: [':host{position:absolute;inset:0;display:block;pointer-events:none;z-index:0}'],
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

      for (const star of this.stars) {
        const dx = star.x - this.mouse.x,
          dy = star.y - this.mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 22500 && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = ((150 - dist) / 150) * 1.5;
          const nx = dx / dist,
            ny = dy / dist;
          // 70% radial push + 30% tangential gives a drifting-orbit feel rather than pure repulsion
          star.vx += nx * force * 0.7 + -ny * force * 0.3;
          star.vy += ny * force * 0.7 + nx * force * 0.3;
        }
        // Very soft spring + high damping → stars lazily drift back to base
        star.vx = (star.vx + (star.baseX - star.x) * 0.008) * 0.96;
        star.vy = (star.vy + (star.baseY - star.y) * 0.008) * 0.96;
        star.x += star.vx;
        star.y += star.vy;

        const offset = this.parallax[star.layer];
        ctx.beginPath();
        ctx.arc(star.x + offset.x, star.y + offset.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,200,255,${star.opacity})`;
        ctx.fill();
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private spawnStars(width: number, height: number) {
    this.stars = Array.from({ length: 90 }, (_, i) => {
      const baseX = Math.random() * width,
        baseY = Math.random() * height;
      return {
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
        baseX,
        baseY,
        size: 0.5 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.6,
        layer: (i < 45 ? 0 : 1) as 0 | 1,
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
