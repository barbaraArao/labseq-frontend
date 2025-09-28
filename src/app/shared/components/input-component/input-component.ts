import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-component.html',
  styleUrls: ['./input-component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class InputComponent {
  @Input() type: 'text' | 'number' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() controlName!: string;

  constructor(private container: ControlContainer) {}

  get control() {
    return this.controlName
      ? this.container.control?.get(this.controlName) ?? null
      : null;
  }
}
