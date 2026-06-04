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

  it('renders all three badges when all links are provided', () => {
    render({
      email: 'test@example.com',
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
    });
    const anchors = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(anchors.length).toBe(3);
  });

  it('email badge has mailto href and "Email" label', () => {
    render({ email: 'test@example.com' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.badge--email');
    expect(a).toBeTruthy();
    expect(a.href).toContain('mailto:test@example.com');
    const label = a.querySelector<HTMLElement>('.badge-label');
    expect(label?.textContent?.trim()).toBe('Email');
  });

  it('github badge has correct href and "GitHub" label', () => {
    render({ github: 'https://github.com/test' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.badge--github');
    expect(a).toBeTruthy();
    expect(a.href).toBe('https://github.com/test');
    const label = a.querySelector<HTMLElement>('.badge-label');
    expect(label?.textContent?.trim()).toBe('GitHub');
  });

  it('linkedin badge has correct href and "LinkedIn" label', () => {
    render({ linkedin: 'https://linkedin.com/in/test' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.badge--linkedin');
    expect(a).toBeTruthy();
    expect(a.href).toBe('https://linkedin.com/in/test');
    const label = a.querySelector<HTMLElement>('.badge-label');
    expect(label?.textContent?.trim()).toBe('LinkedIn');
  });

  it('renders only provided badges when some links are omitted', () => {
    render({ email: 'test@example.com', linkedin: 'https://linkedin.com/in/test' });
    const anchors = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(anchors.length).toBe(2);
    expect(fixture.nativeElement.querySelector('.badge--github')).toBeNull();
  });

  it('renders no badges when object is empty', () => {
    render({});
    const anchors = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(anchors.length).toBe(0);
  });
});
