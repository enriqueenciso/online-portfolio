import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline';
import type { TimelineEntry } from '../../../../portfolio.config';

const entry1: TimelineEntry = { company: 'Acme Corp', role: 'Engineer', dateRange: '2020 – 2022' };
const entry2: TimelineEntry = { company: 'Beta Inc', role: 'Lead', dateRange: '2022 – present' };
const collapsedEntry: TimelineEntry = {
  company: 'Old Co',
  role: 'Dev',
  dateRange: '2010 – 2012',
  collapsed: true,
};
const collapsedEntry2: TimelineEntry = {
  company: 'Ancient Co',
  role: 'Junior',
  dateRange: '2008 – 2010',
  collapsed: true,
};

describe('TimelineComponent', () => {
  let fixture: ComponentFixture<TimelineComponent>;

  function render(entries: TimelineEntry[]): void {
    fixture = TestBed.createComponent(TimelineComponent);
    fixture.componentRef.setInput('entries', entries);
    fixture.detectChanges();
  }

  function toggleBtn(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement | null;
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

  it('renders all entries when none have collapsed: true', () => {
    render([entry1, entry2]);
    const items = fixture.nativeElement.querySelectorAll('app-timeline-entry');
    expect(items.length).toBe(2);
  });

  it('hides collapsed entries by default', () => {
    render([entry1, entry2, collapsedEntry]);
    const items = fixture.nativeElement.querySelectorAll('app-timeline-entry');
    expect(items.length).toBe(2);
    expect(fixture.nativeElement.textContent).not.toContain('Old Co');
  });

  it('toggle button is absent when no entries have collapsed: true', () => {
    render([entry1, entry2]);
    expect(toggleBtn()).toBeNull();
  });

  it('toggle button is present and shows correct count when collapsed entries exist', () => {
    render([entry1, collapsedEntry, collapsedEntry2]);
    const btn = toggleBtn();
    expect(btn).not.toBeNull();
    expect(btn!.textContent).toContain('2');
  });

  it('clicking toggle reveals collapsed entries', () => {
    render([entry1, collapsedEntry]);
    toggleBtn()!.click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('app-timeline-entry');
    expect(items.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Old Co');
  });

  it('clicking toggle again hides collapsed entries', () => {
    render([entry1, collapsedEntry]);
    toggleBtn()!.click();
    fixture.detectChanges();
    toggleBtn()!.click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('app-timeline-entry');
    expect(items.length).toBe(1);
    expect(fixture.nativeElement.textContent).not.toContain('Old Co');
  });

  it('toggle label changes when expanded', () => {
    render([entry1, collapsedEntry]);
    const btn = toggleBtn()!;
    expect(btn.textContent).toContain('Show');
    btn.click();
    fixture.detectChanges();
    expect(toggleBtn()!.textContent).toContain('Hide');
  });
});
