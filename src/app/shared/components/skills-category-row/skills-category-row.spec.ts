import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { SkillsCategoryRowComponent } from './skills-category-row';
import type { SkillCategory } from '../../../../portfolio.config';

const category: SkillCategory = {
  name: 'Frontend',
  tier1: ['Angular', 'TypeScript', 'React'],
  tier2: ['JavaScript', 'HTML5', 'CSS'],
};

const categoryNoTier2: SkillCategory = {
  name: 'AI & Workflows',
  tier1: ['Cursor', 'LLMs'],
  tier2: [],
};

describe('SkillsCategoryRowComponent', () => {
  let fixture: ComponentFixture<SkillsCategoryRowComponent>;

  function render(cat: SkillCategory): void {
    fixture = TestBed.createComponent(SkillsCategoryRowComponent);
    fixture.componentRef.setInput('category', cat);
    fixture.detectChanges();
  }

  function toggleBtn(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement | null;
  }

  function tier2Container(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.tier2') as HTMLElement | null;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsCategoryRowComponent],
    }).compileComponents();
  });

  it('renders tier 1 chips', () => {
    render(category);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Angular');
    expect(text).toContain('TypeScript');
    expect(text).toContain('React');
  });

  it('tier 2 chips are collapsed by default', () => {
    render(category);
    expect(tier2Container()?.classList.contains('expanded')).toBeFalsy();
  });

  it('clicking the toggle expands tier 2 and shows "Show less"', () => {
    render(category);
    toggleBtn()!.click();
    fixture.detectChanges();
    expect(tier2Container()?.classList.contains('expanded')).toBeTruthy();
    expect(toggleBtn()!.textContent?.trim()).toContain('Show less');
  });

  it('clicking "Show less" collapses tier 2', () => {
    render(category);
    toggleBtn()!.click();
    fixture.detectChanges();
    toggleBtn()!.click();
    fixture.detectChanges();
    expect(tier2Container()?.classList.contains('expanded')).toBeFalsy();
  });

  it('renders no toggle when tier2 is empty', () => {
    render(categoryNoTier2);
    expect(toggleBtn()).toBeNull();
  });
});
