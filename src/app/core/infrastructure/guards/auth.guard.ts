import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../domain/services/auth.service';


export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  try {
    // Verificar si el usuario está autenticado usando nuestro servicio
    const isAuthenticated = await authService.checkAuthStatus();

    if (isAuthenticated) {
      console.log('Usuario autenticado, permitiendo navegación');
      return true;
    }
  } catch (error) {
    console.error('Error en el guard de autenticación:', error);
  }

  // Si no está autenticado, redirigir a la página de inicio
  console.log('Usuario no autenticado, redirigiendo a página principal');
  router.navigate(['/login']);
  return false;
};
