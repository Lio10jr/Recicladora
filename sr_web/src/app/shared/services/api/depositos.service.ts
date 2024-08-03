import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deposito } from 'src/app/core/interfaces/depositos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepositosService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }

  crearDeposito(data: Deposito)  {
    return this.http.post(this.apiUrl + `deposito/cd/`, data);
  }
}
