import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { DevicePerformanceService } from '../../../core/services/device-performance.service';
import { HeroSectionComponent } from './hero-section';
import type { TechIcon } from '../tech-stack.config';
import { config } from '../../../../portfolio.config';

const TEST_ICONS: TechIcon[] = [{ label: 'TS', color: '#3178C6', iconUrl: 'ts.svg' }];

describe('HeroSectionComponent', () => {
  let fixture: ComponentFixture<HeroSectionComponent>;

  function render(opts: { platform?: string } = {}): void {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null as any);

    TestBed.configureTestingModule({
      imports: [HeroSectionComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: opts.platform ?? 'server' },
        {
          provide: DevicePerformanceService,
          useValue: { isLowPerf: () => false, prefersReducedMotion: () => false },
        },
      ],
    });

    fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.componentRef.setInput('icons', TEST_ICONS);
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('renders a full-viewport section', () => {
    render();
    const section: HTMLElement | null = fixture.nativeElement.querySelector('section');
    expect(section).not.toBeNull();
    expect(section!.classList).toContain('h-screen');
  });

  it('renders the name from PortfolioConfig', () => {
    render();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(config.hero.name);
  });

  it('renders the title from PortfolioConfig', () => {
    render();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(config.hero.title);
  });

  it('renders a CTA button containing "See my work"', () => {
    render();
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
    expect(button).not.toBeNull();
    expect(button!.textContent).toContain('See my work');
  });

  it('renders HeroCanvasComponent as background', () => {
    render();
    expect(fixture.nativeElement.querySelector('app-hero-canvas')).not.toBeNull();
  });

  it('scrolls to #about when CTA is clicked in browser', () => {
    render({ platform: 'browser' });
    const aboutEl = document.createElement('div');
    aboutEl.id = 'about';
    aboutEl.scrollIntoView = vi.fn();
    document.body.appendChild(aboutEl);

    fixture.nativeElement.querySelector('button').click();

    expect(aboutEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(aboutEl);
  });

  it('does not access the DOM when platform is server', () => {
    render({ platform: 'server' });
    const spy = vi.spyOn(document, 'getElementById');

    fixture.nativeElement.querySelector('button').click();

    expect(spy).not.toHaveBeenCalled();
  });
});
