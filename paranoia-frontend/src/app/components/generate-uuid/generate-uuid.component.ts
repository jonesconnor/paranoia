import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecretService } from '../../services/secret.service';
import { EncryptionService } from '../../services/encryption.service';
import { ClipboardService } from '../../services/clipboard.service';
import { PasswordStrengthService } from '../../services/passwordstrength.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-generate-uuid',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressBarComponent],
  templateUrl: './generate-uuid.component.html',
  styleUrl: './generate-uuid.component.css'
})
export class GenerateUuidComponent {
  secret: string = '';
  uuid: string = '';
  error: string = '';
  copied: boolean = false;
  passwordStrength: any = null;

  constructor(
    private secretService: SecretService,
    private encryptionService: EncryptionService,
    private clipboardService: ClipboardService,
    private passwordStrengthService: PasswordStrengthService
  ) { }

  checkPasswordStrength() {
    this.passwordStrength = this.passwordStrengthService.checkStrength(this.secret);
  }

  async copyUuid() {
    if (this.uuid) {
      this.copied = await this.clipboardService.copyToClipboard(this.uuid);
      setTimeout(() => this.copied = false, 2000);
    }
  }

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
