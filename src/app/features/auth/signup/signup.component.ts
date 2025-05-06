import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { AuthService } from '../services/auth.service';
import { AuthService } from '../../../core/domain/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  confirmationForm: FormGroup;
  isConfirmationStep = false;
  isLoading = false;
  errorMessage = '';
  tempUsername = ''; // Para guardar el username durante la confirmación

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
      name: ['', Validators.required]
    });

    this.confirmationForm = this.fb.group({
      code: ['', Validators.required]
    });
  }

  async onSignUp() {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { username, password, name } = this.signupForm.value;
      this.tempUsername = username; // Guardar para la confirmación

      const result = await this.authService.register(username, password, name);
      console.log('Registro exitoso:', result);

      if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        this.isConfirmationStep = true;
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.error('Error durante el registro:', error);

      if (error.name === 'UsernameExistsException') {
        this.errorMessage = 'Este correo ya está registrado. Por favor utiliza otro o intenta recuperar tu contraseña.';
      } else if (error.name === 'InvalidParameterException') {
        this.errorMessage = 'Parámetros inválidos. Verifica que el correo sea válido y la contraseña cumpla los requisitos.';
      } else if (error.name === 'InvalidPasswordException') {
        this.errorMessage = 'La contraseña no cumple con los requisitos de seguridad.';
      } else {
        this.errorMessage = `Error al registrarse: ${error.message || 'Intenta nuevamente más tarde'}`;
      }
    } finally {
      this.isLoading = false;
    }
  }

  async onConfirmSignUp() {
    if (this.confirmationForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { code } = this.confirmationForm.value;
      const username = this.tempUsername || this.signupForm.get('username')?.value;

      const result = await this.authService.confirmSignUp(username, code);
      console.log('Confirmación exitosa:', result);

      if (result.isSignUpComplete) {
        // Intenta iniciar sesión automáticamente
        try {
          await this.authService.login(username, this.signupForm.get('password')?.value);
          this.router.navigate(['/dashboard']);
        } catch (loginError) {
          console.error('Error en auto login:', loginError);
          this.router.navigate(['/login']);
        }
      }
    } catch (error: any) {
      console.error('Error durante la confirmación:', error);

      if (error.name === 'CodeMismatchException') {
        this.errorMessage = 'El código de verificación es incorrecto.';
      } else if (error.name === 'ExpiredCodeException') {
        this.errorMessage = 'El código de verificación ha expirado. Por favor solicita uno nuevo.';
      } else {
        this.errorMessage = `Error al verificar el código: ${error.message || 'Intenta nuevamente más tarde'}`;
      }
    } finally {
      this.isLoading = false;
    }
  }
}
