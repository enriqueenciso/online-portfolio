import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HeroCanvasComponent } from '../hero-canvas/hero-canvas';
import type { TechIcon } from '../tech-stack.config';
import { config } from '../../../../portfolio.config';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [MatButtonModule, HeroCanvasComponent],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSectionComponent {
  readonly icons = input.required<TechIcon[]>();

  protected readonly name = config.hero.name;
  protected readonly title = config.hero.title;

  private readonly platform = inject(PLATFORM_ID);

  protected scrollToAbout(): void {
    if (!isPlatformBrowser(this.platform)) return;
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }
}
