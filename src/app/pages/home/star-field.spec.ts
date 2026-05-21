import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { DevicePerformanceService } from '../../core/services/device-performance.service';
import { StarFieldComponent } from './star-field';

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
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
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

describe('StarFieldComponent', () => {
  let fixture: ComponentFixture<StarFieldComponent>;
  let component: StarFieldComponent;

  function setup(prefersReducedMotion: boolean): void {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(makeFakeCtx() as any);

    TestBed.configureTestingModule({
      imports: [StarFieldComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: DevicePerformanceService,
          useValue: {
            isLowPerf: () => false,
            prefersReducedMotion: () => prefersReducedMotion,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(StarFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // afterNextRender does not fire in Vitest by default; call init() directly.
    // Also covers the case where it did fire: ngOnDestroy clears the old listeners
    // so init() starts fresh with a single onResize registration.
    (component as any).ngOnDestroy();
    (component as any).init();
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('re-renders static frame on resize when prefers-reduced-motion is enabled (regression)', () => {
    setup(true);
    const spy = vi.spyOn(component as any, 'renderStatic');

    window.dispatchEvent(new Event('resize'));

    expect(spy).toHaveBeenCalledOnce();
  });

  it('does not call renderStatic on resize when prefers-reduced-motion is disabled', () => {
    setup(false);
    const spy = vi.spyOn(component as any, 'renderStatic');

    window.dispatchEvent(new Event('resize'));

    expect(spy).not.toHaveBeenCalled();
  });
});
