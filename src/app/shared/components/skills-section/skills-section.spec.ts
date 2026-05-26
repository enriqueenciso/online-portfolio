import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { SkillCategory } from '../../../../portfolio.config';
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
});
