import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ProfileSidebarComponent } from './profile-sidebar';

describe('ProfileSidebarComponent', () => {
  let fixture: ComponentFixture<ProfileSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSidebarComponent);
    fixture.detectChanges();
  });

  it('mounts without errors', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders AvatarComponent', () => {
    expect(fixture.nativeElement.querySelector('app-avatar')).toBeTruthy();
  });

  it('renders ProfileBioComponent', () => {
    expect(fixture.nativeElement.querySelector('app-profile-bio')).toBeTruthy();
  });

  it('renders ProfileLinksComponent', () => {
    expect(fixture.nativeElement.querySelector('app-profile-links')).toBeTruthy();
  });
});
