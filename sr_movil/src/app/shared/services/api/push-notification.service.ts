import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contenedor } from 'src/app/core/interfaces/contenedor';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }
  
  obtenerToken(): Observable<Contenedor[]> {
    return this.http.get<Contenedor[]>(this.apiUrl + `contenedor/`);
  }

  actualizarToken(cedula: string, token_noti: string) {
    return this.http.post(this.apiUrl + `usuario/ut/${cedula}`, {token_noti: token_noti});
  }
}
