import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/domain/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { username, password } = this.loginForm.value;
      const result = await this.authService.login(username, password);
      const groups = result.groups;

      if (groups.includes('admim')) {
        this.router.navigate(['/admin-panel']);
      } else if (groups.includes('empleado')) {
        this.router.navigate(['/empleado-panel']);
      } else if (groups.includes('clientes')) {
        this.router.navigate(['/cliente-panel']);
      } else {
        this.errorMessage = 'Tu cuenta no tiene un rol asignado.';
      }
    } catch (error: any) {
      console.error('Error durante el login:', error);
      if (error.name === 'UserNotFoundException') {
        this.errorMessage = 'Usuario no encontrado. Por favor verifica tus credenciales.';
      } else if (error.name === 'NotAuthorizedException') {
        this.errorMessage = 'Credenciales incorrectas. Por favor verifica tu email y contraseña.';
      } else if (error.name === 'UserNotConfirmedException') {
        this.errorMessage = 'Tu cuenta no ha sido confirmada. Revisa tu email para el código de verificación.';
      } else {
        this.errorMessage = `Error al iniciar sesión: ${error.message || 'Intenta nuevamente más tarde'}`;
      }
    } finally {
      this.isLoading = false;
    }
  }
}
