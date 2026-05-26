import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { ProfileLinksData } from './profile-links';
import { ProfileLinksComponent } from './profile-links';

describe('ProfileLinksComponent', () => {
  let fixture: ComponentFixture<ProfileLinksComponent>;

  function render(links: ProfileLinksData): void {
    fixture = TestBed.createComponent(ProfileLinksComponent);
    fixture.componentRef.setInput('links', links);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLinksComponent],
    }).compileComponents();
  });

  it('renders all three links when all are provided', () => {
    render({
      email: 'test@example.com',
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
    });
    const anchors = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(anchors.length).toBe(3);
  });

  it('email link has mailto href', () => {
    render({ email: 'test@example.com' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.link--email');
    expect(a).toBeTruthy();
    expect(a.href).toContain('mailto:test@example.com');
  });

  it('github link has correct href', () => {
    render({ github: 'https://github.com/test' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.link--github');
    expect(a).toBeTruthy();
    expect(a.href).toBe('https://github.com/test');
  });

  it('linkedin link has correct href', () => {
    render({ linkedin: 'https://linkedin.com/in/test' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.link--linkedin');
    expect(a).toBeTruthy();
    expect(a.href).toBe('https://linkedin.com/in/test');
  });

  it('renders only provided links when some are omitted', () => {
    render({ email: 'test@example.com', linkedin: 'https://linkedin.com/in/test' });
    const anchors = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(anchors.length).toBe(2);
    expect(fixture.nativeElement.querySelector('.link--github')).toBeNull();
  });

  it('renders no links when object is empty', () => {
    render({});
    const anchors = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(anchors.length).toBe(0);
  });
});
