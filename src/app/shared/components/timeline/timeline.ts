import { Component, computed, input, signal } from '@angular/core';
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

  protected readonly showEarlier = signal(false);

  protected readonly collapsedCount = computed(
    () => this.entries().filter((e) => e.collapsed).length,
  );

  protected readonly visibleEntries = computed(() =>
    this.showEarlier() ? this.entries() : this.entries().filter((e) => !e.collapsed),
  );
}
