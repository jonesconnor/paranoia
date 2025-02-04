import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecretService } from '../../services/secret.service';
import { EncryptionService } from '../../services/encryption.service';

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

  constructor(
    private secretService: SecretService,
    private encryptionService: EncryptionService
  ) { }

  getSecret() {
    if (!this.uuid) {
      this.error = 'Please enter a UUID';
      return;
    }

    this.secretService.get_secret(this.uuid).subscribe({
      next: (response) => {
        try {
          this.secret = this.encryptionService.decrypt(response.secret);
          this.error = '';
        } catch (e) {
          this.error = 'Failed to decrypt secret';
          this.secret = '';
        }
      },
      error: (error) => {
        this.error = error.error.detail || 'Failed to retrieve secret';
        this.secret = '';
      }
    });
  }
}
