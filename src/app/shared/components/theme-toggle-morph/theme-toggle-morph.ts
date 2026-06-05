import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle-morph',
  imports: [MatButtonModule, MatTooltipModule],
  templateUrl: './theme-toggle-morph.html',
  styleUrl: './theme-toggle-morph.scss',
})
export class ThemeToggleMorphComponent {
  readonly theme = inject(ThemeService);
}
