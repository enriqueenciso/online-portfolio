import { Component, input } from '@angular/core';
import type { SkillCategory } from '../../../../portfolio.config';
import { SkillsCategoryRowComponent } from '../skills-category-row/skills-category-row';

@Component({
  selector: 'app-skills-section',
  imports: [SkillsCategoryRowComponent],
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.scss',
})
export class SkillsSectionComponent {
  readonly categories = input.required<SkillCategory[]>();
}
