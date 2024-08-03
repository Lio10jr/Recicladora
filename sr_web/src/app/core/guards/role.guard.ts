import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const servUtils = inject(UtilsService);
  const usuario = servUtils.obtenerLocalStorageJson('usuario');

  if (usuario){
    if (usuario.rol === 'cliente') return true;
    servUtils.routerLink('/auth');
    return false;
  } else {
    servUtils.routerLink('/auth');
    return false;
  }
};
