import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;

  function render(photo: string | undefined, name: string, title: string): void {
    fixture = TestBed.createComponent(AvatarComponent);
    if (photo !== undefined) {
      fixture.componentRef.setInput('photo', photo);
    }
    fixture.componentRef.setInput('name', name);
    fixture.componentRef.setInput('title', title);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
    }).compileComponents();
  });

  it('renders img with correct src and alt when photo is provided', () => {
    render('assets/photo.jpg', 'Enrique Enciso', 'Software Engineer');
    const img: HTMLImageElement = fixture.nativeElement.querySelector('.photo');
    expect(img).toBeTruthy();
    expect(img.src).toContain('assets/photo.jpg');
    expect(img.alt).toBe('Enrique Enciso');
  });

  it('renders fallback icon when photo is absent', () => {
    render(undefined, 'Enrique Enciso', 'Software Engineer');
    const img = fixture.nativeElement.querySelector('.photo');
    const fallback = fixture.nativeElement.querySelector('.fallback-icon');
    expect(img).toBeNull();
    expect(fallback).toBeTruthy();
  });

  it('renders name and title', () => {
    render('assets/photo.jpg', 'Enrique Enciso', 'Software Engineer');
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Enrique Enciso');
    expect(text).toContain('Software Engineer');
  });
});
