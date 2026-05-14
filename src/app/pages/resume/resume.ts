import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-resume',
  imports: [MatCardModule, MatChipsModule, MatDividerModule],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class ResumeComponent {}
