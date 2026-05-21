import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import type { TimelineEntry } from '../../../../portfolio.config';

@Component({
  selector: 'app-timeline-entry',
  imports: [MatChipsModule],
  templateUrl: './timeline-entry.html',
  styleUrl: './timeline-entry.scss',
})
export class TimelineEntryComponent {
  readonly entry = input.required<TimelineEntry>();
}
