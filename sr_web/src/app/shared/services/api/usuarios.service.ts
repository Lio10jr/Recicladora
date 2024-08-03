import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Producto } from 'src/app/core/interfaces/producto';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/core/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }

  obtenerUsuario(cedula: string): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl + `usuario/gu/${cedula}`);
  }
}
