import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { DevicePerformanceService } from '../../../core/services/device-performance.service';
import { HeroCanvasComponent } from './hero-canvas';
import type { TechIcon } from '../tech-stack.config';

const TEST_ICONS: TechIcon[] = [
  { label: 'TS', color: '#3178C6', iconUrl: 'ts.svg' },
  { label: 'NG', color: '#DD0031', iconUrl: 'ng.svg' },
];

function makeFakeCtx(): CanvasRenderingContext2D {
  const grad = { addColorStop: vi.fn() };
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    globalAlpha: 1,
    shadowColor: '',
    shadowBlur: 0,
    font: '',
    textAlign: 'center' as CanvasTextAlign,
    textBaseline: 'middle' as CanvasTextBaseline,
    lineCap: 'round' as CanvasLineCap,
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    strokeRect: vi.fn(),
    clip: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    drawImage: vi.fn(),
    createRadialGradient: vi.fn(() => grad),
    createLinearGradient: vi.fn(() => grad),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 10 })),
  } as unknown as CanvasRenderingContext2D;
}

describe('HeroCanvasComponent', () => {
  let fixture: ComponentFixture<HeroCanvasComponent>;
  let component: HeroCanvasComponent;

  function render(
    icons: TechIcon[] = TEST_ICONS,
    opts: { prefersReducedMotion?: boolean; isLowPerf?: boolean } = {},
  ): void {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(makeFakeCtx() as any);

    TestBed.configureTestingModule({
      imports: [HeroCanvasComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: DevicePerformanceService,
          useValue: {
            isLowPerf: () => opts.isLowPerf ?? false,
            prefersReducedMotion: () => opts.prefersReducedMotion ?? false,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(HeroCanvasComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icons', icons);
    fixture.detectChanges();

    // afterNextRender does not fire in Vitest; call init() directly.
    (component as any).ngOnDestroy();
    (component as any).init();
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('renders the canvas element given an icons input', () => {
    render();
    const canvas: HTMLCanvasElement | null = fixture.nativeElement.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('does not start the animation loop when prefersReducedMotion is true', () => {
    render(TEST_ICONS, { prefersReducedMotion: true });
    // rafId is only set by animate(); 0 means animate() was never called.
    expect((component as any).rafId).toBe(0);
  });

  it('renders the canvas element when isLowPerf is true', () => {
    render(TEST_ICONS, { isLowPerf: true });
    const canvas: HTMLCanvasElement | null = fixture.nativeElement.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('renders the canvas element with an empty icons array without crashing', () => {
    render([]);
    const canvas: HTMLCanvasElement | null = fixture.nativeElement.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('re-renders static frame on resize when prefersReducedMotion is enabled (regression)', () => {
    render(TEST_ICONS, { prefersReducedMotion: true });
    const spy = vi.spyOn(component as any, 'renderStatic');

    window.dispatchEvent(new Event('resize'));

    expect(spy).toHaveBeenCalledOnce();
  });

  it('does not call renderStatic on resize when prefersReducedMotion is disabled', () => {
    render();
    const spy = vi.spyOn(component as any, 'renderStatic');

    window.dispatchEvent(new Event('resize'));

    expect(spy).not.toHaveBeenCalled();
  });
});
