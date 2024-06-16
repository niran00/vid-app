import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Ensure the correct path

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/upload']);
      },
      error: err => {
        console.log(err);
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    });
  }
}
