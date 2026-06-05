import { Component } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { HeaderComponent } from './header';

@Component({ template: '' })
class StubPageComponent {}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  function render(opts: { platform?: string } = {}): void {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: opts.platform ?? 'server' },
        provideRouter([{ path: '', component: StubPageComponent }]),
      ],
    });

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('is hidden by default', () => {
    render();
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar') as HTMLElement;
    expect(toolbar.classList).not.toContain('visible');
  });

  it('becomes visible when scrollY exceeds 80% of innerHeight', () => {
    render({ platform: 'browser' });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 850 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('mat-toolbar') as HTMLElement).classList).toContain(
      'visible',
    );
  });

  it('stays hidden when scrollY is below 80% of innerHeight', () => {
    render({ platform: 'browser' });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 400 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('mat-toolbar') as HTMLElement).classList,
    ).not.toContain('visible');
  });

  it('does not become visible when platform is server', () => {
    render({ platform: 'server' });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 900 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('mat-toolbar') as HTMLElement).classList,
    ).not.toContain('visible');
  });

  it('renders logo link pointing to /', () => {
    render();
    const logoLink = fixture.nativeElement.querySelector('a[href="/"]') as HTMLAnchorElement | null;
    expect(logoLink).not.toBeNull();
    expect(logoLink!.textContent?.trim()).toBe('Enrique Enciso');
  });

  it('renders "About" link pointing to /#about', () => {
    render();
    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    const aboutLink = Array.from(links).find((a) => a.textContent?.trim() === 'About');
    expect(aboutLink).toBeDefined();
    expect(aboutLink!.getAttribute('href')).toContain('#about');
  });

  it('applies nav-active class to About link on root route', async () => {
    render({ platform: 'browser' });
    const router = TestBed.inject(Router);
    await router.navigate(['/']);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    const aboutLink = Array.from(links).find((a) => a.textContent?.trim() === 'About');
    expect(aboutLink?.classList).toContain('nav-active');
  });

  it('renders the theme-toggle-morph component', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-theme-toggle-morph')).toBeTruthy();
  });
});
