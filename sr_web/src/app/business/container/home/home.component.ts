import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contenedor } from 'src/app/core/interfaces/contenedor';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { ContenedoresService } from 'src/app/shared/services/api/contenedores.service';
declare var $: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  listContainer: Contenedor[] = [];
  title: string = '';
  message: string = '';

  constructor(
    private servUtils: UtilsService,
    private servContainer: ContenedoresService,
  ) { }

  ngOnInit(): void {
    this.servContainer.obtenerContenedores().subscribe(
      (response) => {
        this.listContainer = response as Contenedor[];
      },
      error => {
        console.log(error)
      }
    )
  }

  recyclyPage(container: Contenedor) {
    if (container.estado === 'En uso') {
      this.servUtils.routerLink(`/recycle/${container.id}`);
    } else {
      this.title = 'Contenedor Info';
      this.message = 'El contenedor esta lleno o aun no esta despachado';
      this.showToast();
    }
  }

  tiendaProductos() {
    this.servUtils.routerLink('/products');
  }

  showToast() {
    $('#liveToast').toast('show');
    $('#liveToast').toast({ delay: 5000 });
  }

  hideToast() {
    $('#liveToast').toast('hide');
    $('#liveToast').toast({ delay: 5000 });
  }

  infoUser() {
    this.servUtils.routerLink('/info');
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
