import { signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeToggleSimpleComponent } from './theme-toggle-simple';

describe('ThemeToggleSimpleComponent', () => {
  let fixture: ComponentFixture<ThemeToggleSimpleComponent>;
  let isDark: ReturnType<typeof signal<boolean>>;
  let toggleSpy: ReturnType<typeof vi.fn>;

  function render(dark: boolean): void {
    isDark = signal(dark);
    toggleSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [ThemeToggleSimpleComponent],
      providers: [
        {
          provide: ThemeService,
          useValue: { isDark, toggle: toggleSpy },
        },
      ],
    });

    fixture = TestBed.createComponent(ThemeToggleSimpleComponent);
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('dark_mode icon is active in light mode', () => {
    render(false);
    const icons = fixture.nativeElement.querySelectorAll('mat-icon') as NodeListOf<HTMLElement>;
    const darkIcon = Array.from(icons).find((i) => i.textContent?.trim() === 'dark_mode');
    const lightIcon = Array.from(icons).find((i) => i.textContent?.trim() === 'light_mode');
    expect(darkIcon?.classList).toContain('active');
    expect(lightIcon?.classList).not.toContain('active');
  });

  it('light_mode icon is active in dark mode', () => {
    render(true);
    const icons = fixture.nativeElement.querySelectorAll('mat-icon') as NodeListOf<HTMLElement>;
    const darkIcon = Array.from(icons).find((i) => i.textContent?.trim() === 'dark_mode');
    const lightIcon = Array.from(icons).find((i) => i.textContent?.trim() === 'light_mode');
    expect(lightIcon?.classList).toContain('active');
    expect(darkIcon?.classList).not.toContain('active');
  });

  it('active class switches reactively when isDark changes', () => {
    render(false);
    const icons = () =>
      fixture.nativeElement.querySelectorAll('mat-icon') as NodeListOf<HTMLElement>;
    const darkIcon = () => Array.from(icons()).find((i) => i.textContent?.trim() === 'dark_mode');
    const lightIcon = () => Array.from(icons()).find((i) => i.textContent?.trim() === 'light_mode');

    expect(darkIcon()?.classList).toContain('active');

    isDark.set(true);
    fixture.detectChanges();
    expect(lightIcon()?.classList).toContain('active');
    expect(darkIcon()?.classList).not.toContain('active');
  });

  it('clicking the button calls theme.toggle()', () => {
    render(false);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(toggleSpy).toHaveBeenCalledOnce();
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
});
