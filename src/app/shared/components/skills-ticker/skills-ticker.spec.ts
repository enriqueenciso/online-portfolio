import { signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { DevicePerformanceService } from '../../../core/services/device-performance.service';
import { config } from '../../../../portfolio.config';
import { SkillsTickerComponent } from './skills-ticker';

const allSkillsFromConfig = config.skillCategories.flatMap((cat) => [...cat.tier1, ...cat.tier2]);

function createFixture(prefersReducedMotion: boolean): ComponentFixture<SkillsTickerComponent> {
  TestBed.overrideProvider(DevicePerformanceService, {
    useValue: { prefersReducedMotion: signal(prefersReducedMotion), isLowPerf: signal(false) },
  });
  const fixture = TestBed.createComponent(SkillsTickerComponent);
  fixture.detectChanges();
  return fixture;
}

describe('SkillsTickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsTickerComponent],
    }).compileComponents();
  });

  describe('normal motion', () => {
    let fixture: ComponentFixture<SkillsTickerComponent>;

    beforeEach(() => {
      fixture = createFixture(false);
    });

    it('renders the marquee wrapper', () => {
      expect(fixture.nativeElement.querySelector('.ticker-wrapper')).toBeTruthy();
    });

    it('does not render the static list', () => {
      expect(fixture.nativeElement.querySelector('.ticker-static')).toBeNull();
    });

    it('contains two ticker-inner strips for seamless loop', () => {
      const inners = fixture.nativeElement.querySelectorAll('.ticker-inner');
      expect(inners.length).toBe(2);
    });

    it('first ticker-inner has one chip per skill in config', () => {
      const firstInner = fixture.nativeElement.querySelector('.ticker-inner') as HTMLElement;
      expect(firstInner.querySelectorAll('.ticker-chip').length).toBe(allSkillsFromConfig.length);
    });

    it('second ticker-inner is aria-hidden for screen readers', () => {
      const inners = fixture.nativeElement.querySelectorAll('.ticker-inner');
      expect(inners[1].getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('reduced motion', () => {
    let fixture: ComponentFixture<SkillsTickerComponent>;

    beforeEach(() => {
      fixture = createFixture(true);
    });

    it('renders the static list instead of the marquee', () => {
      expect(fixture.nativeElement.querySelector('.ticker-static')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.ticker-wrapper')).toBeNull();
    });

    it('static list shows at most 20 chips', () => {
      const chips = fixture.nativeElement.querySelectorAll('.ticker-chip');
      expect(chips.length).toBeLessThanOrEqual(20);
    });
  });
});
