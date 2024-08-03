import { Component, OnInit } from '@angular/core';
import { Contenedor } from 'src/app/core/interfaces/contenedor';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { ContenedoresService } from 'src/app/shared/services/api/contenedores.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  listContainer!: Contenedor[];
  constructor(
    private servUtils: UtilsService,
    private servAuth: AuthService,
    private servContenedor: ContenedoresService
  ) { }

  ngOnInit() {
    this.obtenerContanedoresActivos();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.obtenerContanedoresActivos();
      event.target.complete();
    }, 2000);
  }

  async obtenerContanedoresActivos() {
    const loading = await this.servUtils.loading();
    await loading.present();
    this.servContenedor.obtenerContenedoresActivo()
      .subscribe(
        response => {
          this.listContainer = response;
        },
        error => {
          console.log('error: ' + error.error);
          this.servUtils.presentToast({
            message: 'Ocurrió un error al obtener los contenedores. Inténtalo de nuevo.',
            duration: 2500,
            position: 'middle',
            icon: 'alert',
            cssClass: 'custom-toast',
            animated: true
          });
        },
        () => {
          loading.dismiss();
        }
      )
  }

  user(): Usuario {
    return this.servUtils.obtenerLocalStorageJson('usuario');
  }

  salir() {
    this.servAuth.salir();
  }

  async despachar(container: Contenedor) {
    const loading = await this.servUtils.loading();
    await loading.present();
    this.servContenedor.despacharContenedor(container)
      .subscribe(
        response => {
          this.obtenerContanedoresActivos();
        },
        error => {
          loading.dismiss();
          this.servUtils.presentToast({
            message: 'Ocurrió un error al despachar el contenedor. Inténtalo de nuevo.',
            duration: 2500,
            position: 'middle',
            icon: 'alert',
            cssClass: 'custom-toast',
            animated: true
          });
        },
        () => {
          loading.dismiss();
        }
      )
  }

}
