import { Component } from '@angular/core';
import { config } from '../../../../portfolio.config';
import { AvatarComponent } from '../avatar/avatar';
import { ProfileBioComponent } from '../profile-bio/profile-bio';
import { ProfileLinksComponent } from '../profile-links/profile-links';

@Component({
  selector: 'app-profile-sidebar',
  imports: [AvatarComponent, ProfileBioComponent, ProfileLinksComponent],
  templateUrl: './profile-sidebar.html',
  styleUrl: './profile-sidebar.scss',
})
export class ProfileSidebarComponent {
  readonly photo = config.photo;
  readonly name = config.hero.name;
  readonly title = config.hero.title;
  readonly bio = config.bio;
  readonly links = {
    email: config.email,
    github: config.github,
    linkedin: config.linkedin,
  };
}
