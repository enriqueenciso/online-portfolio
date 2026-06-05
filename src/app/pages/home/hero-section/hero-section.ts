import { isPlatformBrowser } from '@angular/common';
import type { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Component, PLATFORM_ID, ViewChild, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DevicePerformanceService } from '../../../core/services/device-performance.service';
import { SkillsTickerComponent } from '../../../shared/components/skills-ticker/skills-ticker';
import { HeroCanvasComponent } from '../hero-canvas/hero-canvas';
import type { TechIcon } from '../tech-stack.config';
import { config } from '../../../../portfolio.config';

const TYPED_STRINGS = ['Frontend Engineer', 'Angular Specialist', 'Team Lead'];

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [MatButtonModule, HeroCanvasComponent, SkillsTickerComponent],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  readonly icons = input.required<TechIcon[]>();

  @ViewChild('nameEl') private nameEl!: ElementRef<HTMLElement>;
  @ViewChild('titleEl') private titleEl!: ElementRef<HTMLElement>;
  @ViewChild('ctaEl') private ctaEl!: ElementRef<HTMLElement>;

  protected readonly name = config.hero.name;
  protected readonly title = config.hero.title;

  private readonly platform = inject(PLATFORM_ID);
  private readonly devicePerf = inject(DevicePerformanceService);

  private typedInstance: { destroy(): void } | null = null;
  private startDelay: ReturnType<typeof setTimeout> | null = null;

  protected scrollToAbout(): void {
    if (!isPlatformBrowser(this.platform)) return;
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platform) || this.devicePerf.prefersReducedMotion()) return;
    void this.runAnimations();
  }

  ngOnDestroy(): void {
    if (this.startDelay !== null) clearTimeout(this.startDelay);
    this.typedInstance?.destroy();
  }

  private async runAnimations(): Promise<void> {
    const { gsap } = await import('gsap');
    const { default: Typed } = await import('typed.js');

    gsap.set(this.ctaEl.nativeElement, { opacity: 0, y: 20 });
    gsap.from(this.nameEl.nativeElement, { opacity: 0, y: -30, duration: 0.6, ease: 'power2.out' });

    this.titleEl.nativeElement.textContent = '';
    this.startDelay = setTimeout(() => {
      this.startDelay = null;
      this.typedInstance = new Typed(this.titleEl.nativeElement, {
        strings: TYPED_STRINGS,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        loop: false,
        onComplete: () => {
          gsap.to(this.ctaEl.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
        },
      });
    }, 300);
  }
}
