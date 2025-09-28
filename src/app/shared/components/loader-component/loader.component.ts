import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
})
export class LoaderComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: string = 'text-blue-600';

  private sizeMap: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  get sizeClass(): string {
    return this.sizeMap[this.size] ?? this.sizeMap['md'];
  }
}
