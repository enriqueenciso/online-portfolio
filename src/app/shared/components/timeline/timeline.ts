import { Component, input } from '@angular/core';
import type { TimelineEntry } from '../../../../portfolio.config';
import { TimelineEntryComponent } from '../timeline-entry/timeline-entry';

@Component({
  selector: 'app-timeline',
  imports: [TimelineEntryComponent],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class TimelineComponent {
  readonly entries = input.required<TimelineEntry[]>();
}
