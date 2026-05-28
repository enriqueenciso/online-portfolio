import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;

  function render(photo: string | undefined, title: string): void {
    fixture = TestBed.createComponent(AvatarComponent);
    if (photo !== undefined) {
      fixture.componentRef.setInput('photo', photo);
    }
    fixture.componentRef.setInput('title', title);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
    }).compileComponents();
  });

  it('renders img with correct src and static alt when photo is provided', () => {
    render('assets/photo.jpg', 'Software Engineer');
    const img: HTMLImageElement = fixture.nativeElement.querySelector('.photo');
    expect(img).toBeTruthy();
    expect(img.src).toContain('assets/photo.jpg');
    expect(img.alt).toBe('Profile photo');
  });

  it('renders fallback icon when photo is absent', () => {
    render(undefined, 'Software Engineer');
    const img = fixture.nativeElement.querySelector('.photo');
    const fallback = fixture.nativeElement.querySelector('.fallback-icon');
    expect(img).toBeNull();
    expect(fallback).toBeTruthy();
  });

  it('renders title and no name overlay', () => {
    render('assets/photo.jpg', 'Software Engineer');
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Software Engineer');
    const overlay = fixture.nativeElement.querySelector('.name-overlay');
    expect(overlay).toBeNull();
  });
});
