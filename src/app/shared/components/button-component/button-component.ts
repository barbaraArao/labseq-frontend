import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button-component.html',
  styleUrl: './button-component.scss',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'danger-outline' = 'primary';
  @Input() ariaLabel?: string;


  get classes(): string[] {
    return [
      'btn',
      `btn-${this.variant}`,
      this.disabled ? 'btn-disabled' : ''
    ];
  }
}
