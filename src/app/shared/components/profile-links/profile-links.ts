import { Component, input } from '@angular/core';

export interface ProfileLinksData {
  email?: string;
  github?: string;
  linkedin?: string;
}

@Component({
  selector: 'app-profile-links',
  imports: [],
  templateUrl: './profile-links.html',
  styleUrl: './profile-links.scss',
})
export class ProfileLinksComponent {
  readonly links = input.required<ProfileLinksData>();
}
