import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private servUtils: UtilsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.servUtils.obtenerLocalStorage('token');
    let modifiedReq = request;
    if (token) {
      const cleanedToken = token.replace(/^"(.*)"$/, '$1');
      modifiedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${cleanedToken}`
        }
      });
    }

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse): Observable<never> => {
        // Manejo de errores
        if (error.status === 401) {
          console.log('No autorizado, interceptor');
          this.servUtils.eliminarLocalStorage('token');
          this.servUtils.eliminarLocalStorage('usuario');
          this.servUtils.routerLink('/auth');
        }
        return throwError(() => error);
      })
    );
  }
}