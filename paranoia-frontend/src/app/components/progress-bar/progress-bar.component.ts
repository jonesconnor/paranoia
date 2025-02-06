import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-gray-200 rounded-full h-4">
      <div [style.width.%]="strength * 25" [ngClass]="barClass" class="h-4 rounded-full"></div>
    </div>
  `,
  styles: [`
    .bg-very-weak { background-color: #f44336; }
    .bg-weak { background-color: #ff9800; }
    .bg-medium { background-color: #ffeb3b; }
    .bg-strong { background-color: #4caf50; }
    .bg-very-strong { background-color: #2e7d32; }
  `]
})
export class ProgressBarComponent {
  @Input() strength: number = 0;

  get barClass() {
    switch (this.strength) {
      case 4: return 'bg-very-strong';
      case 3: return 'bg-strong';
      case 2: return 'bg-medium';
      case 1: return 'bg-weak';
      default: return 'bg-very-weak';
    }
  }
}
