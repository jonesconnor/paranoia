import { Injectable } from '@angular/core';
import zxcvbn from 'zxcvbn';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {

  checkStrength(password: string) {
    return zxcvbn(password);
  }
}
