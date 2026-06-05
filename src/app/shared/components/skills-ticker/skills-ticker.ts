import { Component, inject } from '@angular/core';
import { DevicePerformanceService } from '../../../core/services/device-performance.service';
import { config } from '../../../../portfolio.config';

const allSkills = config.skillCategories.flatMap((cat) => [...cat.tier1, ...cat.tier2]);
const STATIC_LIMIT = 20;

@Component({
  selector: 'app-skills-ticker',
  templateUrl: './skills-ticker.html',
  styleUrl: './skills-ticker.scss',
})
export class SkillsTickerComponent {
  private readonly devicePerf = inject(DevicePerformanceService);

  protected readonly prefersReducedMotion = this.devicePerf.prefersReducedMotion;
  protected readonly allSkills = allSkills;
  protected readonly staticSkills = allSkills.slice(0, STATIC_LIMIT);
}
