import { Component, signal } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatButton } from '@angular/material/button';
import { config } from '../../../../portfolio.config';
import { AvatarComponent } from '../avatar/avatar';
import { ProfileBioComponent } from '../profile-bio/profile-bio';
import { ProfileLinksComponent } from '../profile-links/profile-links';
import { SkillsSectionComponent } from '../skills-section/skills-section';

@Component({
  selector: 'app-profile-sidebar',
  imports: [
    AvatarComponent,
    ProfileBioComponent,
    ProfileLinksComponent,
    SkillsSectionComponent,
    MatButton,
  ],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('250ms ease', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [animate('250ms ease', style({ height: 0, opacity: 0 }))]),
    ]),
  ],
  templateUrl: './profile-sidebar.html',
  styleUrl: './profile-sidebar.scss',
})
export class ProfileSidebarComponent {
  readonly name = config.hero.name;
  readonly photo = config.photo;
  readonly title = config.hero.title;
  readonly location = config.location;
  readonly bio = config.bio;
  readonly links = {
    email: config.email,
    github: config.github,
    linkedin: config.linkedin,
  };
  readonly skillCategories = config.skillCategories;

  readonly skillsExpanded = signal(false);

  toggleSkills(): void {
    this.skillsExpanded.update((v) => !v);
  }
}
