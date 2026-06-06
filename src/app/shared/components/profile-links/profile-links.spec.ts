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

  it('email badge has mailto href and descriptive aria-label', () => {
    render({ email: 'test@example.com' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.badge--email');
    expect(a).toBeTruthy();
    expect(a.href).toContain('mailto:test@example.com');
    expect(a.getAttribute('aria-label')).toContain('test@example.com');
  });

  it('github badge has correct href and descriptive aria-label', () => {
    render({ github: 'https://github.com/test' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.badge--github');
    expect(a).toBeTruthy();
    expect(a.href).toBe('https://github.com/test');
    expect(a.getAttribute('aria-label')).toBeTruthy();
  });

  it('linkedin badge has correct href and descriptive aria-label', () => {
    render({ linkedin: 'https://linkedin.com/in/test' });
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('.badge--linkedin');
    expect(a).toBeTruthy();
    expect(a.href).toBe('https://linkedin.com/in/test');
    expect(a.getAttribute('aria-label')).toBeTruthy();
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

  it('.links defaults to flex-direction column (mobile)', () => {
    render({ email: 'test@example.com' });
    const styles = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('');
    expect(styles).toMatch(/flex-direction\s*:\s*column/);
  });

  it('.links switches to flex-direction row with wrap at the 768px breakpoint', () => {
    render({ email: 'test@example.com' });
    const styles = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('');
    expect(styles).toMatch(/@media[^{]*min-width[^}]*768px/);
    expect(styles).toMatch(/flex-direction\s*:\s*row/);
    expect(styles).toMatch(/flex-wrap\s*:\s*wrap/);
    expect(styles).toMatch(/justify-content\s*:\s*center/);
  });
});
