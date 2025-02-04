import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecretService } from '../../services/secret.service';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-generate-uuid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate-uuid.component.html',
  styleUrl: './generate-uuid.component.css'
})
export class GenerateUuidComponent {
  secret: string = '';
  uuid: string = '';
  error: string = '';

  constructor(
    private secretService: SecretService,
    private encryptionService: EncryptionService
  ) { }

  generateUuid() {
    if (!this.secret) {
      this.error = 'Please enter a secret';
      return;
    }

    const encryptedSecret = this.encryptionService.encrypt(this.secret);

    this.secretService.generate_uuid(encryptedSecret).subscribe({
      next: (response) => {
        this.uuid = response.uuid;
        this.error = '';
      },
      error: (error) => {
        this.error = error.error.detail || 'Failed to generate UUID';
        this.uuid = '';
      }
    });
  }
}
