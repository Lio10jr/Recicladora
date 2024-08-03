import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const servUtils = inject(UtilsService);
  const usuario = servUtils.obtenerLocalStorageJson('usuario');

  if (usuario){
    if (usuario.rol === 'admin') return true;
    servUtils.eliminarLocalStorage('token');
    servUtils.eliminarLocalStorage('usuario');
    servUtils.presentToast({
      message: 'No tienes los permisos adecuados. Inicia como administrador.',
      duration: 2500,
      position: 'middle',
      icon: 'alert',
      cssClass: 'custom-toast',
      animated: true
    });

    servUtils.routerLink('/auth');
    return false;
  } else {
    servUtils.routerLink('/auth');
    return false;
  }
};
