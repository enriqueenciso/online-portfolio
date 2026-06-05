import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { config, type SkillCategory } from '../../../../portfolio.config';
import { SkillsSectionComponent } from './skills-section';

const categories: SkillCategory[] = [
  { name: 'Frontend', tier1: ['Angular', 'TypeScript'], tier2: ['JavaScript'] },
  { name: 'AI & Workflows', tier1: ['Cursor', 'LLMs'], tier2: [] },
  { name: 'Backend & Data', tier1: ['Node.js'], tier2: ['GraphQL'] },
];

describe('SkillsSectionComponent', () => {
  let fixture: ComponentFixture<SkillsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsSectionComponent],
    }).compileComponents();
  });

  function render(cats: SkillCategory[]): void {
    fixture = TestBed.createComponent(SkillsSectionComponent);
    fixture.componentRef.setInput('categories', cats);
    fixture.detectChanges();
  }

  it('renders one SkillsCategoryRowComponent per category', () => {
    render(categories);
    const rows = fixture.nativeElement.querySelectorAll('app-skills-category-row');
    expect(rows.length).toBe(categories.length);
  });

  it('renders zero rows when categories is empty', () => {
    render([]);
    const rows = fixture.nativeElement.querySelectorAll('app-skills-category-row');
    expect(rows.length).toBe(0);
  });

  it('renders exactly three Tier 1 chips per category with the production config', () => {
    render(config.skillCategories);
    const rows = fixture.nativeElement.querySelectorAll('app-skills-category-row');
    for (const row of rows) {
      const tier1Chips = row.querySelectorAll('mat-chip-set.tier1 mat-chip');
      expect(tier1Chips.length).toBe(3);
    }
  });
});
