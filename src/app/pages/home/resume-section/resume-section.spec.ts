import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ResumeSectionComponent } from './resume-section';
import { config } from '../../../../portfolio.config';

describe('ResumeSectionComponent', () => {
  let fixture: ComponentFixture<ResumeSectionComponent>;
  let component: ResumeSectionComponent;

  function render(overrides: Partial<ResumeSectionComponent> = {}): void {
    fixture = TestBed.createComponent(ResumeSectionComponent);
    component = fixture.componentInstance;
    Object.assign(component, overrides);
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

  it('renders the profile photo when photo is present', () => {
    render();
    const img: HTMLImageElement | null = fixture.nativeElement.querySelector('img.profile-photo');
    expect(img).not.toBeNull();
    expect(img!.src).toContain(config.preview.photo);
  });

  it('renders account_circle icon when photo is absent', () => {
    render({ photo: undefined });
    expect(fixture.nativeElement.querySelector('img.profile-photo')).toBeNull();
    const icon: HTMLElement | null = fixture.nativeElement.querySelector('mat-icon');
    expect(icon).not.toBeNull();
    expect(icon!.textContent).toContain('account_circle');
  });

  it('renders name and title from config', () => {
    render();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(config.hero.name);
    expect(text).toContain(config.hero.title);
  });

  it('renders location from config', () => {
    render();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain(config.preview.location);
  });

  it('renders email link with mailto href', () => {
    render();
    const link: HTMLAnchorElement | null = fixture.nativeElement.querySelector(
      `a[href="mailto:${config.full.email}"]`,
    );
    expect(link).not.toBeNull();
  });

  it('renders GitHub link with correct href', () => {
    render();
    const link: HTMLAnchorElement | null = fixture.nativeElement.querySelector(
      `a[href="${config.preview.github}"]`,
    );
    expect(link).not.toBeNull();
  });

  it('renders LinkedIn link with correct href', () => {
    render();
    const link: HTMLAnchorElement | null = fixture.nativeElement.querySelector(
      `a[href="${config.preview.linkedin}"]`,
    );
    expect(link).not.toBeNull();
  });

  it('renders all skills as chips', () => {
    render();
    const text = fixture.nativeElement.textContent as string;
    for (const skill of config.preview.skills) {
      expect(text).toContain(skill);
    }
  });

  it('renders work history via TimelineComponent', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-timeline')).not.toBeNull();
    const text = fixture.nativeElement.textContent as string;
    for (const entry of config.full.timeline) {
      expect(text).toContain(entry.company);
      expect(text).toContain(entry.role);
    }
  });
});
