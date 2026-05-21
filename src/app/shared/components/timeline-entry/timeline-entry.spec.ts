import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TimelineEntryComponent } from './timeline-entry';
import type { TimelineEntry } from '../../../../portfolio.config';

const baseEntry: TimelineEntry = {
  company: 'Acme Corp',
  role: 'Software Engineer',
  dateRange: '2020 – 2022',
};

describe('TimelineEntryComponent', () => {
  let fixture: ComponentFixture<TimelineEntryComponent>;

  function render(entry: TimelineEntry): void {
    fixture = TestBed.createComponent(TimelineEntryComponent);
    fixture.componentRef.setInput('entry', entry);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineEntryComponent],
    }).compileComponents();
  });

  it('always renders role, company, and dateRange', () => {
    render(baseEntry);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Software Engineer');
    expect(text).toContain('Acme Corp');
    expect(text).toContain('2020 – 2022');
  });

  it('renders no img element when logo is absent', () => {
    render(baseEntry);
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('renders no chips section when techStack is absent', () => {
    render(baseEntry);
    expect(fixture.nativeElement.querySelector('mat-chip-set')).toBeNull();
  });

  it('renders no achievements list when achievements is absent', () => {
    render(baseEntry);
    expect(fixture.nativeElement.querySelector('.achievements')).toBeNull();
  });

  it('renders img when logo is present', () => {
    render({ ...baseEntry, logo: 'assets/logo.png' });
    const img: HTMLImageElement | null = fixture.nativeElement.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.src).toContain('logo.png');
  });

  it('renders chips for each tech in techStack', () => {
    render({ ...baseEntry, techStack: ['Angular', 'TypeScript'] });
    expect(fixture.nativeElement.querySelector('mat-chip-set')).not.toBeNull();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Angular');
    expect(text).toContain('TypeScript');
  });

  it('renders no chips when techStack is an empty array', () => {
    render({ ...baseEntry, techStack: [] });
    expect(fixture.nativeElement.querySelector('mat-chip-set')).toBeNull();
  });

  it('renders achievements list when achievements are present', () => {
    render({ ...baseEntry, achievements: ['Led migration', 'Reduced bundle size by 35%'] });
    const list = fixture.nativeElement.querySelector('.achievements');
    expect(list).not.toBeNull();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Led migration');
    expect(text).toContain('Reduced bundle size by 35%');
  });

  it('renders no achievements list when achievements is an empty array', () => {
    render({ ...baseEntry, achievements: [] });
    expect(fixture.nativeElement.querySelector('.achievements')).toBeNull();
  });
});
