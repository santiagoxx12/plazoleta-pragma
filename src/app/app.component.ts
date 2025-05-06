import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth';
import { AuthService } from './core/domain/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    AmplifyAuthenticatorModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  isAuthenticated = false;
  username = '';
  userRole = '';
  isUserMenuOpen = false
  constructor(private authService: AuthService) {}


  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen
  }

  async ngOnInit() {
    console.log('AppComponent inicializado');
    await this.checkAuthStatus();
  }

  async checkAuthStatus() {
    try {
      const authSession = await fetchAuthSession();
      this.isAuthenticated = authSession.tokens !== undefined;

      if (this.isAuthenticated) {
        const user = await getCurrentUser();
        this.username = user.username;

        // Get user role
        const roles = await this.authService.getUserRole();
        if (roles && roles.length > 0) {
          this.userRole = roles[0]; // Taking the first role
          console.log('User role:', this.userRole);
        }

        console.log('Usuario autenticado:', this.username);
      } else {
        console.log('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al verificar el estado de autenticación:', error);
      this.isAuthenticated = false;
    }
  }

  async signOut() {
    try {
      await signOut();
      this.isAuthenticated = false;
      this.username = '';
      console.log('Sesión cerrada con éxito');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }
}
