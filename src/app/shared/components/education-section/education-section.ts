import { Component, input } from '@angular/core';
import type { Certificate, Education } from '../../../../portfolio.config';

@Component({
  selector: 'app-education-section',
  imports: [],
  templateUrl: './education-section.html',
  styleUrl: './education-section.scss',
})
export class EducationSectionComponent {
  readonly education = input.required<Education>();
  readonly certificates = input.required<Certificate[]>();
}
