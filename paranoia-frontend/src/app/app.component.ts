import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetSecretComponent } from './components/get-secret/get-secret.component';
import { GenerateUuidComponent } from './components/generate-uuid/generate-uuid.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, GetSecretComponent, GenerateUuidComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'paranoia-frontend';
}
