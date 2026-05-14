import { Injectable, effect, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDark.set(stored ? stored === 'dark' : prefersDark);

      effect(() => {
        const dark = this.isDark();
        document.body.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
      });
    }
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }
}
