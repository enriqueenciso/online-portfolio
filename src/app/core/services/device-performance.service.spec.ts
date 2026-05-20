import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DevicePerformanceService } from './device-performance.service';

describe('DevicePerformanceService', () => {
  afterEach(() => TestBed.resetTestingModule());

  function setup(platformId: string, innerWidth = 1024): DevicePerformanceService {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: innerWidth,
    });
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: platformId }],
    });
    return TestBed.inject(DevicePerformanceService);
  }

  it('isLowPerf is true when viewport width is below 768px', () => {
    const service = setup('browser', 500);
    expect(service.isLowPerf()).toBe(true);
  });

  it('isLowPerf is false when viewport width is 768px or above', () => {
    const service = setup('browser', 768);
    expect(service.isLowPerf()).toBe(false);
  });

  it('prefersReducedMotion reflects matchMedia mock value (false by default)', () => {
    // test-setup.ts mocks matchMedia to always return matches: false
    const service = setup('browser');
    expect(service.prefersReducedMotion()).toBe(false);
  });

  it('signals remain false during SSR', () => {
    const service = setup('server');
    expect(service.isLowPerf()).toBe(false);
    expect(service.prefersReducedMotion()).toBe(false);
  });
});
