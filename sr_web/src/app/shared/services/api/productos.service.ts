import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Producto } from 'src/app/core/interfaces/producto';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }

  subirImg(data: FormData)  {
    return this.http.post<{ imageUrl: string }>(this.apiUrl + `producto/ci/upload/`, data);
  }

  crearProducto(data: Producto)  {
    return this.http.post(this.apiUrl + `producto/cp/`, data);
  }

  obtenerProductosActivos(): Observable<Producto[]>  {
    return this.http.get<Producto[]>(this.apiUrl + `producto/gpa/`);
  }

  eliminarProducto(uid: string)  {
    return this.http.delete(this.apiUrl + `producto/dp/${uid}`);
  }
}
