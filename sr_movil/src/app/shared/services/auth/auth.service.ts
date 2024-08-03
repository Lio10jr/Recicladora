import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private servUtils: UtilsService
  ) { }

  verifyToken() {
    return this.http.get(this.apiUrl + `usuario/token`);
  }

  acceso(cedula: string) {
    return this.http.post(this.apiUrl + `usuario/login`, { cedula: cedula });
  }

  registro(data: Usuario) {
    return this.http.post(this.apiUrl + `usuario/`, data);
  }

  salir() {
    this.servUtils.eliminarLocalStorage('usuario');
    this.servUtils.eliminarLocalStorage('token');
    this.servUtils.routerLink('/auth');
  }

}
