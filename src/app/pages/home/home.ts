import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { DevicePerformanceService } from '../../core/services/device-performance.service';
import { HeroSectionComponent } from './hero-section/hero-section';
import { ResumeSectionComponent } from './resume-section/resume-section';
import { TECH_STACK_CONFIG } from './tech-stack.config';

@Component({
  selector: 'app-home',
  imports: [HeroSectionComponent, ResumeSectionComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly techStack = TECH_STACK_CONFIG;

  private readonly platform = inject(PLATFORM_ID);
  private readonly devicePerf = inject(DevicePerformanceService);

  private readonly scrollY = signal(0);

  protected readonly exitProgress = computed(() => {
    if (!isPlatformBrowser(this.platform)) return 0;
    return Math.min(1, Math.max(0, this.scrollY() / window.innerHeight));
  });

  protected readonly heroOpacity = computed(() => 1 - this.exitProgress());

  protected readonly heroTransform = computed<string | null>(() => {
    if (this.devicePerf.isLowPerf()) return null;
    const p = this.exitProgress();
    return p === 0 ? null : `translateY(${-p * 60}px)`;
  });

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platform)) return;
    this.scrollY.set(window.scrollY);
  }
}
