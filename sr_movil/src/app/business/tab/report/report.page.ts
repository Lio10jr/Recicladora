import { Component, OnInit } from '@angular/core';
import { Contenedor } from 'src/app/core/interfaces/contenedor';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { ContenedoresService } from 'src/app/shared/services/api/contenedores.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  listContainer!: Contenedor[];
  listContainerFilter!: Contenedor[];
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
    this.servContenedor.obtenerContenedores()
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

  onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listContainerFilter = this.listContainer.filter(item => item.tipo_reciclaje === filterValue);
  }


  user(): Usuario {
    return this.servUtils.obtenerLocalStorageJson('usuario');
  }

  salir() {
    this.servAuth.salir();
  }  

}
