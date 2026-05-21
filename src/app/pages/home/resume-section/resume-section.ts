import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { config } from '../../../../portfolio.config';
import { TimelineComponent } from '../../../shared/components/timeline/timeline';

@Component({
  selector: 'app-resume-section',
  imports: [MatChipsModule, MatDividerModule, MatIconModule, TimelineComponent],
  templateUrl: './resume-section.html',
  styleUrl: './resume-section.scss',
})
export class ResumeSectionComponent {
  photo = config.preview.photo;
  readonly name = config.hero.name;
  readonly title = config.hero.title;
  readonly location = config.preview.location;
  readonly email = config.full.email;
  readonly github = config.preview.github;
  readonly linkedin = config.preview.linkedin;
  readonly skills = config.preview.skills;
  readonly timeline = config.full.timeline;
}
