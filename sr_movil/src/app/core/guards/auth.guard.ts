import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

export const authGuard: CanActivateFn = (route, state) => {
  const servUtils = inject(UtilsService);
  const servAuth = inject(AuthService);

  const token = servUtils.obtenerLocalStorage('token');

  if (token) {
    return servAuth.verifyToken().pipe(
      map(res => {
        if (res) {
          return true;
        } else {
          servUtils.routerLink('/auth');
          return false;
        }
      }),
      catchError(err => {
        console.error('Error en la verificación del token:', err);
        servUtils.routerLink('/auth');
        return of(false);
      })
    );
  } else {
    servUtils.routerLink('/auth');
    return of(false);
  }
};
