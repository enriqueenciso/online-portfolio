import { Component } from '@angular/core';
import { config } from '../../../../portfolio.config';
import { EducationSectionComponent } from '../../../shared/components/education-section/education-section';
import { ProfileSidebarComponent } from '../../../shared/components/profile-sidebar/profile-sidebar';
import { TimelineComponent } from '../../../shared/components/timeline/timeline';

@Component({
  selector: 'app-resume-section',
  imports: [ProfileSidebarComponent, TimelineComponent, EducationSectionComponent],
  templateUrl: './resume-section.html',
  styleUrl: './resume-section.scss',
})
export class ResumeSectionComponent {
  readonly timeline = config.timeline;
  readonly education = config.education;
  readonly certificates = config.certificates;
}
