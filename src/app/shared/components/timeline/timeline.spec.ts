import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline';
import type { TimelineEntry } from '../../../../portfolio.config';

const entry1: TimelineEntry = { company: 'Acme Corp', role: 'Engineer', dateRange: '2020 – 2022' };
const entry2: TimelineEntry = { company: 'Beta Inc', role: 'Lead', dateRange: '2022 – present' };

describe('TimelineComponent', () => {
  let fixture: ComponentFixture<TimelineComponent>;

  function render(entries: TimelineEntry[]): void {
    fixture = TestBed.createComponent(TimelineComponent);
    fixture.componentRef.setInput('entries', entries);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
    }).compileComponents();
  });

  it('renders one timeline-entry per entry', () => {
    render([entry1, entry2]);
    const items = fixture.nativeElement.querySelectorAll('app-timeline-entry');
    expect(items.length).toBe(2);
  });

  it('renders the correct entry data in each item', () => {
    render([entry1, entry2]);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Acme Corp');
    expect(text).toContain('Beta Inc');
  });

  it('renders nothing when entries array is empty', () => {
    render([]);
    const items = fixture.nativeElement.querySelectorAll('app-timeline-entry');
    expect(items.length).toBe(0);
  });
});
