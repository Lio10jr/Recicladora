import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const servUtils = inject(UtilsService);
  const servAuth = inject(AuthService);

  const token = servUtils.obtenerLocalStorage('token');

  if (token) {
    return servAuth.verifyToken().pipe(
      map(res => {
        if (res) {
          servUtils.routerLink('/container');
          return false;
        } else {
          return true;
        }
      }),
      catchError(err => {
        console.error('Error en la verificación del token:', err);
        servUtils.routerLink('/auth');
        return of(true);
      })
    );
  } else {
    return of(true);
  }
};
