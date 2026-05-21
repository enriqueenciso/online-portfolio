import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { DevicePerformanceService } from '../../core/services/device-performance.service';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  function render(opts: { platform?: string; isLowPerf?: boolean } = {}): void {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null as any);

    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: opts.platform ?? 'server' },
        {
          provide: DevicePerformanceService,
          useValue: {
            isLowPerf: () => opts.isLowPerf ?? false,
            prefersReducedMotion: () => false,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('renders HeroSectionComponent', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-hero-section')).not.toBeNull();
  });

  it('renders ResumeSectionComponent', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-resume-section')).not.toBeNull();
  });

  it('exitProgress is 0 when scrollY is 0', () => {
    render({ platform: 'browser' });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();

    expect((component as any).exitProgress()).toBe(0);
  });

  it('exitProgress reaches 1 when scrollY equals innerHeight', () => {
    render({ platform: 'browser' });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();

    expect((component as any).exitProgress()).toBe(1);
  });

  it('exitProgress is clamped to 1 when scrollY exceeds innerHeight', () => {
    render({ platform: 'browser' });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 2000 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();

    expect((component as any).exitProgress()).toBe(1);
  });

  it('heroTransform is null on isLowPerf (opacity only)', () => {
    render({ platform: 'browser', isLowPerf: true });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();

    expect((component as any).heroTransform()).toBeNull();
  });

  it('heroTransform contains translateY on desktop', () => {
    render({ platform: 'browser', isLowPerf: false });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();

    expect((component as any).heroTransform()).toContain('translateY');
  });

  it('exitProgress remains 0 on server platform (no browser API access)', () => {
    render({ platform: 'server' });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    component.onScroll();

    expect((component as any).exitProgress()).toBe(0);
  });
});
