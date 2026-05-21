import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { HeroCanvasComponent } from './hero-canvas/hero-canvas';
import { TECH_STACK_CONFIG } from './tech-stack.config';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink, HeroCanvasComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly techStack = TECH_STACK_CONFIG;
}
