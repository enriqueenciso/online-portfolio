import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { EducationSectionComponent } from './education-section';
import type { Certificate, Education } from '../../../../portfolio.config';

const education: Education = {
  institution: 'Universidad Politécnica de Chiapas',
  degree: 'Software Engineer',
  dateRange: '2010 – 2014',
};

const certificates: Certificate[] = [
  { title: 'Build Deepsearch in TypeScript', issuer: 'AIHero.dev', year: 2025 },
  { title: 'The Complete Agentic AI Engineering Course', issuer: 'Udemy', year: 2025 },
  { title: 'IBM Agile Advocate', issuer: 'IBM', year: 2018 },
];

describe('EducationSectionComponent', () => {
  let fixture: ComponentFixture<EducationSectionComponent>;

  function render(edu: Education, certs: Certificate[]): void {
    fixture = TestBed.createComponent(EducationSectionComponent);
    fixture.componentRef.setInput('education', edu);
    fixture.componentRef.setInput('certificates', certs);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationSectionComponent],
    }).compileComponents();
  });

  it('renders institution, degree, and date range', () => {
    render(education, []);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Universidad Politécnica de Chiapas');
    expect(text).toContain('Software Engineer');
    expect(text).toContain('2010 – 2014');
  });

  it('renders one cert card per certificate', () => {
    render(education, certificates);
    const cards = fixture.nativeElement.querySelectorAll('.cert-card');
    expect(cards.length).toBe(3);
  });

  it('renders no cert cards when certificates array is empty', () => {
    render(education, []);
    const cards = fixture.nativeElement.querySelectorAll('.cert-card');
    expect(cards.length).toBe(0);
  });

  it('renders cert title, issuer, and year in each card', () => {
    render(education, [certificates[0]]);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Build Deepsearch in TypeScript');
    expect(text).toContain('AIHero.dev');
    expect(text).toContain('2025');
  });
});
