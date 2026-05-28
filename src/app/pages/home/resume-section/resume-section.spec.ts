import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ResumeSectionComponent } from './resume-section';
import { config } from '../../../../portfolio.config';

describe('ResumeSectionComponent', () => {
  let fixture: ComponentFixture<ResumeSectionComponent>;

  function render(): void {
    fixture = TestBed.createComponent(ResumeSectionComponent);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeSectionComponent],
    }).compileComponents();
  });

  it('has id="about" on the section element', () => {
    render();
    expect(fixture.nativeElement.querySelector('section#about')).not.toBeNull();
  });

  it('renders ProfileSidebarComponent', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-profile-sidebar')).not.toBeNull();
  });

  it('renders TimelineComponent', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-timeline')).not.toBeNull();
  });

  it('renders EducationSectionComponent', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-education-section')).not.toBeNull();
  });

  it('renders SkillsSectionComponent', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-skills-section')).not.toBeNull();
  });

  it('renders title from config via sidebar', () => {
    render();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(config.hero.title);
  });

  it('renders visible timeline entries', () => {
    render();
    const text = fixture.nativeElement.textContent as string;
    for (const entry of config.timeline.filter((e) => !e.collapsed)) {
      expect(text).toContain(entry.company);
      expect(text).toContain(entry.role);
    }
  });
});
