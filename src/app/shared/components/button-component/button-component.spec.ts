import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button-component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button type="submit" variant="secondary" [disabled]="true">
      Click me
    </app-button>
  `,
})
class TestHostComponent {}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should render projected content', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent.trim()).toBe('Click me');
  });

  it('should apply the correct classes for variant and disabled', () => {
    const button = fixture.nativeElement.querySelector('button');
    const classList = button.className.split(' ');

    expect(classList).toContain('btn');
    expect(classList).toContain('btn-secondary');
    expect(classList).toContain('btn-disabled');
  });

  it('should use type="submit"', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('type')).toBe('submit');
  });
});
