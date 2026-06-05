import { signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeToggleMorphComponent } from './theme-toggle-morph';

describe('ThemeToggleMorphComponent', () => {
  let fixture: ComponentFixture<ThemeToggleMorphComponent>;
  let isDark: ReturnType<typeof signal<boolean>>;
  let toggleSpy: ReturnType<typeof vi.fn>;

  function render(dark: boolean): void {
    isDark = signal(dark);
    toggleSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [ThemeToggleMorphComponent],
      providers: [
        {
          provide: ThemeService,
          useValue: { isDark, toggle: toggleSpy },
        },
      ],
    });

    fixture = TestBed.createComponent(ThemeToggleMorphComponent);
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('renders the sun icon structure (circle + 8 rays) in light mode', () => {
    render(false);
    const circle = fixture.nativeElement.querySelector('.circle') as HTMLElement;
    const rays = fixture.nativeElement.querySelectorAll('.ray') as NodeListOf<HTMLElement>;
    expect(circle).toBeTruthy();
    expect(rays.length).toBe(8);
  });

  it('aria-label indicates switch to dark mode in light mode', () => {
    render(false);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode');
  });

  it('aria-label indicates switch to light mode in dark mode', () => {
    render(true);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');
  });

  it('clicking the button calls theme.toggle()', () => {
    render(false);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(toggleSpy).toHaveBeenCalledOnce();
  });

  it('aria-label updates reactively when isDark changes', () => {
    render(false);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Switch to dark mode');

    isDark.set(true);
    fixture.detectChanges();
    expect(btn.getAttribute('aria-label')).toBe('Switch to light mode');
  });
});
