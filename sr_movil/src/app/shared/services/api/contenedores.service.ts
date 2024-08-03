import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contenedor } from 'src/app/core/interfaces/contenedor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContenedoresService {

  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }
  
  obtenerContenedores(): Observable<Contenedor[]> {
    return this.http.get<Contenedor[]>(this.apiUrl + `contenedor/`);
  }

  obtenerContenedoresActivo(): Observable<Contenedor[]> {
    return this.http.get<Contenedor[]>(this.apiUrl + `contenedor/gca/`);
  }

  obtenerContenedor(id: string) {
    return this.http.get(this.apiUrl + `contenedor/gc/${id}`);
  }

  despacharContenedor(contenedor: Contenedor) {
    return this.http.post(this.apiUrl + `contenedor/dc/${contenedor.id}`, contenedor);
  }
  
}