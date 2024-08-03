import { Deposito } from './../../../core/interfaces/depositos';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { categorias, Contenedor } from 'src/app/core/interfaces/contenedor';
import { ContenedoresService } from 'src/app/shared/services/api/contenedores.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { DepositosService } from 'src/app/shared/services/api/depositos.service';
import { UsuariosService } from 'src/app/shared/services/api/usuarios.service';
declare var $: any;

@Component({
  selector: 'app-recycle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recycle.component.html',
  styleUrls: ['./recycle.component.scss']
})
export class RecycleComponent implements OnInit {
  id!: string;
  contenedor!: Contenedor;
  precioxKg: number = 0;
  msgValidacion = "";
  validacion: boolean = false;
  peso = 0;
  montoPagado = 0;
  tipoMaterial: string = "";

  title: string = '';
  message: string = '';

  constructor(
    private servUtils: UtilsService,
    private servContainer: ContenedoresService,
    private servDepos: DepositosService,
    private route: ActivatedRoute,
    private servUsuario: UsuariosService
  ) {
  }

  ngOnInit(): void {
    this.cargarContenedor();
  }

  cargarContenedor() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.id = id;
      this.servContainer.obtenerContenedor(id).subscribe(
        (response) => {
          this.contenedor = response as Contenedor;
        },
        error => {
          console.log(error)
        }
      );
    });
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    const selectedOption = this.contenedor.categorias.find(option => option.nombre === selectedValue);

    if (selectedOption) {
      this.tipoMaterial = selectedValue;
      const { precioKg } = selectedOption;
      this.precioxKg = precioKg;
      this.calcularMontoTotal();
    } else {
      console.log('Opción no encontrada');
    }
  }

  onPesoChange(value: number): void {
    if (value && value > 0) {
      if (this.contenedor) {
        const pesoTotal = value + this.contenedor.capacidadActual;
        const pesoResult = this.contenedor.capacidadMax - pesoTotal;
        if (pesoResult >= 0) {
          this.validacion = false;
          this.msgValidacion = 'Peso Aceptado';
          this.calcularMontoTotal();
        } else {
          this.validacion = true;
          this.msgValidacion = 'El peso sobre pasa la cántidad máxima del contenedor';
        }
      }
    } else {
      this.validacion = true;
      this.msgValidacion = 'Debe ser una cantidad mayor a 0';
    }
  }

  calcularMontoTotal() {
    if (this.tipoMaterial != '') {
      if (this.peso > 0) {
        const montoTotal = this.peso * this.precioxKg;
        this.montoPagado = parseFloat(montoTotal.toFixed(2));
      }
    }
  }

  recyclingSubmit() {
    if (this.tipoMaterial != '') {
      if (this.peso > 0) {
        const pesoTotal = this.peso + this.contenedor.capacidadActual;
        const pesoResult = this.contenedor.capacidadMax - pesoTotal;

        if (pesoResult >= 0) {
          this.showLoading();
          const usuario: Usuario = this.servUtils.obtenerLocalStorageJson('usuario');
          const cedulaCliente = usuario.cedula;
          const contenedor_id = this.id!;
          const tipo_reciclaje = this.contenedor.tipo_reciclaje;
          const now = new Date();
          const utcMinus5 = new Date(now.getTime() - 5 * 60 * 60 * 1000);
          const fecha = utcMinus5;
          const deposito: Deposito = {
            cliente: cedulaCliente,
            contenedor_uid: contenedor_id,
            tipo_reciclaje: tipo_reciclaje,
            peso: this.peso,
            montoPagado: this.montoPagado,
            fecha: fecha
          }

          // guardar el deposito
          this.servDepos.crearDeposito(deposito)
            .subscribe(
              response => {
                this.hideLoading();
                this.message = 'Se ha depositado correctamente';
                this.title = 'Creación exitosa!';
                this.showToast();
                this.limpiarVariables();
                this.cargarContenedor();
                const user: Usuario = this.servUtils.obtenerLocalStorageJson('usuario');
                this.servUsuario.obtenerUsuario(user.cedula)
                  .subscribe(
                    response => {
                      user.saldo = response.saldo;
                      this.servUtils.guardarLocalStorageJson('usuario', user);
                      this.hideLoading();
                      this.message = 'Cobro realizado';
                      this.title = 'Saldo actualizado!';
                      this.showToast();
                    },
                    error => {
                      this.hideLoading();
                      this.message = error.error.message;
                      this.title = 'Error Interno';
                      this.showToast();
                      this.limpiarVariables();
                      this.cargarContenedor();
                    },
                    (() => {
                      this.hideLoading();
                    })
                  )
              },
              error => {
                this.hideLoading();
                this.message = error.error.message;
                this.title = 'Error Interno';
                this.showToast();
                this.limpiarVariables();
                this.cargarContenedor();
              },
              (() => {
                this.hideLoading();
              })
            )
        } else {
          this.message = 'El peso sobre pasa la cántidad máxima del contenedor';
          this.title = 'Formulario inválido';
          this.showToast();
        }
      } else {
        this.message = 'Se debe ingresar un peso';
        this.title = 'Formulario inválido';
        this.showToast();
      }
    } else {
      this.message = 'Debe elegir el tipo de material';
      this.title = 'Formulario inválido';
      this.showToast();
    }
  }

  showToast() {
    $('#liveToast').toast('show');
    $('#liveToast').toast({ delay: 5000 });
  }

  hideToast() {
    $('#liveToast').toast('hide');
    $('#liveToast').toast({ delay: 5000 });
  }

  showLoading() {
    $('#loadingModal').modal('show');
  }

  async hideLoading() {
    $('#loadingModal').modal('hide');
  }

  limpiarVariables() {
    this.msgValidacion = "";
    this.validacion = false;
    this.peso = 0;
    this.montoPagado = 0;
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
