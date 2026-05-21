import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section';
import { TECH_STACK_CONFIG } from './tech-stack.config';

@Component({
  selector: 'app-home',
  imports: [HeroSectionComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly techStack = TECH_STACK_CONFIG;
}
