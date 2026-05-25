import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ProfileBioComponent } from './profile-bio';

describe('ProfileBioComponent', () => {
  let fixture: ComponentFixture<ProfileBioComponent>;

  function render(bio: string): void {
    fixture = TestBed.createComponent(ProfileBioComponent);
    fixture.componentRef.setInput('bio', bio);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileBioComponent],
    }).compileComponents();
  });

  it('renders bio text in a paragraph', () => {
    render('Full-Stack Engineer with 10+ years of experience.');
    const p: HTMLParagraphElement = fixture.nativeElement.querySelector('.bio');
    expect(p).toBeTruthy();
    expect(p.textContent).toContain('Full-Stack Engineer with 10+ years of experience.');
  });
});
