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
  photo = config.photo;
  readonly name = config.hero.name;
  readonly title = config.hero.title;
  readonly location = config.location;
  readonly email = config.email;
  readonly github = config.github;
  readonly linkedin = config.linkedin;
  readonly skills = config.skillCategories.flatMap((c) => [...c.tier1, ...c.tier2]);
  readonly timeline = config.timeline;
}
