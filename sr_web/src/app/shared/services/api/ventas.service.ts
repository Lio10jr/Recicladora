import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Producto } from 'src/app/core/interfaces/producto';
import { Observable } from 'rxjs';
import { Venta } from 'src/app/core/interfaces/ventas';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }

  crearVenta(data: Venta)  {
    return this.http.post(this.apiUrl + `venta/cv/`, data);
  }

  obtenerVentas(cedula: string): Observable<Venta[]>  {
    return this.http.get<Venta[]>(this.apiUrl + `venta/gvu/${cedula}`);
  }
}
