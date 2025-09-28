import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { InputComponent } from './input-component';

@Component({
  template: `
    <form [formGroup]="form">
      <app-input controlName="seqIdx" label="Test label"></app-input>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
})
class TestHostComponent {
  form = new FormGroup({
    seqIdx: new FormControl(''),
  });
}

describe('InputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create inside a form', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
