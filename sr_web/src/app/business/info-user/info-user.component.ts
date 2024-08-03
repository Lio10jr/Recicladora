import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { VentasService } from 'src/app/shared/services/api/ventas.service';
import { Venta } from 'src/app/core/interfaces/ventas';
import { Usuario } from 'src/app/core/interfaces/usuario';
declare var $: any;

@Component({
  selector: 'app-info-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss']
})
export class InfoUserComponent implements OnInit {
  listVentas!: Venta[];
  title: string = '';
  message: string = '';

  constructor(
    private servUtils: UtilsService,
    private servVenta: VentasService
  ) { }

  ngOnInit(): void {
    this.cargarVentas();
  }
  user(): Usuario {
    return this.servUtils.obtenerLocalStorageJson('usuario');
  }

  cargarVentas() {

    this.servVenta.obtenerVentas(this.user().cedula)
      .subscribe(
        response => {
          this.listVentas = response;
        },
        error => {
          console.error('Error al obtener las ventas:', error);
          this.message = 'Error al obtener los productos, intentalo de nuevo!';
          this.title = 'Error Interno';
          this.showToast();
        }
      )
  }

  showToast() {
    $('#liveToast').toast('show');
    $('#liveToast').toast({ delay: 5000 });
  }

  showLoading() {
    $('#loadingModal').modal('show');
  }

  hideLoading() {
    $('#loadingModal').modal('hide');
  }

  regresar() {
    this.servUtils.routerLink('/container');
  }

  salir() {
    this.servUtils.eliminarLocalStorage('usuario');
    this.servUtils.eliminarLocalStorage('token');
    this.servUtils.routerLink('/auth');
  }

}
