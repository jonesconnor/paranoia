import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HelloComponent } from './components/hello/hello.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HelloComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'paranoia-frontend';
}
