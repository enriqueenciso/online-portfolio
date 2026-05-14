import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StarFieldComponent } from './star-field';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink, StarFieldComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {}
