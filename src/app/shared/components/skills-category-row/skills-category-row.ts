import { Component, input, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import type { SkillCategory } from '../../../../portfolio.config';

@Component({
  selector: 'app-skills-category-row',
  imports: [MatChipsModule],
  templateUrl: './skills-category-row.html',
  styleUrl: './skills-category-row.scss',
})
export class SkillsCategoryRowComponent {
  readonly category = input.required<SkillCategory>();
  protected readonly expanded = signal(false);
}
