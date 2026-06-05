import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ProfileSidebarComponent } from './profile-sidebar';
import { config } from '../../../../portfolio.config';

describe('ProfileSidebarComponent', () => {
  let fixture: ComponentFixture<ProfileSidebarComponent>;
  let component: ProfileSidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSidebarComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('mounts without errors', () => {
    expect(component).toBeTruthy();
  });

  it('renders name from config', () => {
    const el = fixture.nativeElement.querySelector('.sidebar-name') as HTMLElement;
    expect(el.textContent?.trim()).toBe(config.hero.name);
  });

  it('name is rendered as an h1', () => {
    const el = fixture.nativeElement.querySelector('.sidebar-name') as HTMLElement;
    expect(el.tagName.toLowerCase()).toBe('h1');
  });

  it('name element precedes avatar in the DOM', () => {
    const name = fixture.nativeElement.querySelector('.sidebar-name') as HTMLElement;
    const avatar = fixture.nativeElement.querySelector('app-avatar') as HTMLElement;
    // Node.DOCUMENT_POSITION_FOLLOWING means avatar comes after name
    expect(name.compareDocumentPosition(avatar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders AvatarComponent', () => {
    expect(fixture.nativeElement.querySelector('app-avatar')).toBeTruthy();
  });

  it('renders location from config', () => {
    const el = fixture.nativeElement.querySelector('.sidebar-location') as HTMLElement;
    expect(el.textContent?.trim()).toBe(config.location);
  });

  it('renders ProfileBioComponent', () => {
    expect(fixture.nativeElement.querySelector('app-profile-bio')).toBeTruthy();
  });

  it('renders ProfileLinksComponent', () => {
    expect(fixture.nativeElement.querySelector('app-profile-links')).toBeTruthy();
  });

  it('renders SkillsSectionComponent in the desktop skills area', () => {
    expect(
      fixture.nativeElement.querySelector('app-skills-section.sidebar-skills-desktop'),
    ).toBeTruthy();
  });

  it('skillsExpanded starts false', () => {
    expect(component.skillsExpanded()).toBe(false);
  });

  it('toggleSkills flips skillsExpanded signal', () => {
    component.toggleSkills();
    expect(component.skillsExpanded()).toBe(true);
    component.toggleSkills();
    expect(component.skillsExpanded()).toBe(false);
  });

  it('expand panel is absent when skills are collapsed', () => {
    expect(fixture.nativeElement.querySelector('.skills-expand-panel')).toBeNull();
  });

  it('expand panel appears after toggle', () => {
    component.toggleSkills();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.skills-expand-panel')).toBeTruthy();
  });
});
