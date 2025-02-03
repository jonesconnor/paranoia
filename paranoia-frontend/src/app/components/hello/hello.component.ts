import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecretService } from '../../services/secret.service';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.css'
})
export class HelloComponent {
  message: string = '';

  constructor(private secretService: SecretService) {}

  sayHello() {
    this.secretService.hello_world().subscribe(
      response => {
        this.message = response.message;
      }
    )
  }
}
