import { Component, input } from '@angular/core';

@Component({
  selector: 'app-profile-bio',
  imports: [],
  templateUrl: './profile-bio.html',
  styleUrl: './profile-bio.scss',
})
export class ProfileBioComponent {
  readonly bio = input.required<string>();
}
