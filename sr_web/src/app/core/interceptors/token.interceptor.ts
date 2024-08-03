import { inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { catchError } from 'rxjs/operators';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const servUtils = inject(UtilsService);
  const token = servUtils.obtenerLocalStorage('token');
  let modifiedReq = request;
  if (token) {
    const cleanedToken = token.replace(/^"(.*)"$/, '$1');
    modifiedReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${cleanedToken}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse): Observable<never> => {
      // Manejo de errores
      if (error.status === 401) {
        console.log('No autorizado, interceptor');
        servUtils.eliminarLocalStorage('token');
        servUtils.eliminarLocalStorage('usuario');
        servUtils.routerLink('/auth');
      }
      return throwError(() => error);
    })
  );
};
