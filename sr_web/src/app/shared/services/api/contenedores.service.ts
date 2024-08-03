import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContenedoresService {

  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }
  
  obtenerContenedores() {
    return this.http.get(this.apiUrl + `contenedor/gca/`);
  }

  obtenerContenedor(id: string) {
    return this.http.get(this.apiUrl + `contenedor/gc/${id}`);
  }
  
}
