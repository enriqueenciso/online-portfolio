import { Injectable, PLATFORM_ID, type Signal, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DevicePerformanceService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _isLowPerf = signal(false);
  private readonly _prefersReducedMotion = signal(false);

  readonly isLowPerf: Signal<boolean> = this._isLowPerf.asReadonly();
  readonly prefersReducedMotion: Signal<boolean> = this._prefersReducedMotion.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._isLowPerf.set(window.innerWidth < 768);
      this._prefersReducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }
}
