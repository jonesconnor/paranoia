import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecretService } from '../../services/secret.service';
import { response } from 'express';

@Component({
  selector: 'app-get-secret',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './get-secret.component.html',
  styleUrl: './get-secret.component.css'
})
export class GetSecretComponent {
  uuid: string = '';
  secret: string = '';
  error: string = '';

  constructor(private secretService: SecretService) { }

  getSecret() {
    if (!this.uuid) {
      this.error = 'Please enter a UUID';
      return;
    }

    this.secretService.get_secret(this.uuid).subscribe({
      next: (response) => {
        this.secret = response.secret;
        this.error = '';
      },
      error: (error) => {
        this.error = error.error.detail || 'Failed to retrieve secret';
        this.secret = '';
      }
    });
  }
}
