import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../domain/services/auth.service';

export const roleGuard = (requiredRoles: string[]): CanActivateFn => {
  return async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    try {
      const isAuthenticated = await authService.checkAuthStatus();
      if (!isAuthenticated) {
        router.navigate(['/login']);
        return false;
      }

      const roles = await authService.getUserRole();
      const hasAccess = roles?.some(role => requiredRoles.includes(role)) ?? false;

      if (!hasAccess) {
        router.navigate(['/unauthorized']);
      }

      return hasAccess;
    } catch (error) {
      console.error("Error en roleGuard:", error);
      router.navigate(['/login']);
      return false;
    }
  };
};
