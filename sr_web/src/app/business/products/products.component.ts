import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductosService } from 'src/app/shared/services/api/productos.service';
import { Producto } from 'src/app/core/interfaces/producto';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { Venta } from 'src/app/core/interfaces/ventas';
import { VentasService } from 'src/app/shared/services/api/ventas.service';
import { UsuariosService } from 'src/app/shared/services/api/usuarios.service';
declare var $: any;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;
  listProductsActivos!: Producto[];
  title: string = '';
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private servProduct: ProductosService,
    private servUtils: UtilsService,
    private servVenta: VentasService,
    private servUsuario: UsuariosService
  ) {
    this.productForm = this.fb.group({
      vendedor_ced: [''],
      nombre_pro: ['', Validators.required],
      descripcion: ['', Validators.required],
      image: [null],
      precio: [0, [Validators.required, Validators.min(0)]],
      estado: [true],
      fecha_publicacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductosActivos();
  }

  cargarProductosActivos() {
    this.servProduct.obtenerProductosActivos()
      .subscribe(
        response => {
          this.listProductsActivos = response;
        },
        error => {
          this.hideLoading();
          console.log('Error al guardar el producto:', error);
          const list: any[] = [];
          this.listProductsActivos = list;
        },
        (() => {
          this.hideLoading();
        })
      )
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      this.showLoading();
      const formData = new FormData();
      const uniqueId = Date.now().toString();
      formData.append('image', this.selectedFile, uniqueId);
      const usuario: Usuario = this.servUtils.obtenerLocalStorageJson('usuario')
      this.servProduct.subirImg(formData).subscribe(
        response => {
          const imageUrl = response.imageUrl;

          const productData: Producto = {
            ...this.productForm.value,
            image: imageUrl,
            vendedor_ced: usuario.cedula
          };

          this.servProduct.crearProducto(productData).subscribe(
            productResponse => {
              this.hideLoading();
              this.message = 'Se ha creado su producto nuevo correctamente';
              this.title = 'Creación exitosa!';
              this.showToast();
              this.limpiarVariables();
              this.hideModalNewProduct();
              this.cargarProductosActivos();
            },
            error => {
              this.hideLoading();
              console.error('Error al guardar el producto:', error);
              this.message = 'Error al guardar el producto, intentalo de nuevo!';
              this.title = 'Error Interno';
              this.showToast();
            },
            (() => {
              this.hideLoading();
            })
          );

        },
        error => {
          this.hideLoading();
          console.error('Error al subir la imagen:', error);
          this.message = 'Error al subir la imagen, intentalo de nuevo!';
          this.title = 'Error Interno';
          this.showToast();
        },
        (() => {
          this.hideLoading();
        })
      );
    } else {
      this.message = 'Debe cargar la imagen de manera obligatoria';
      this.title = 'Formulario inválido';
      this.showToast();
    }
  }

  modalNewProduct() {
    $('#productModal').modal('show');
  }

  hideModalNewProduct() {
    $('#productModal').modal('hide');
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

  hideLoading() {
    $('#loadingModal').modal('hide');
  }

  limpiarVariables() {
    this.productForm.reset({
      vendedor_ced: '',
      descripcion: '',
      image: null,
      precio: 0,
      estado: true,
      fecha_publicacion: new Date()
    });
    this.selectedFile = null;
  }

  regresar() {
    this.servUtils.routerLink('/container');
  }

  showVentaModal() {
    $('#ventaModal').modal('show');
  }

  hideVentaModal() {
    $('#ventaModal').modal('hide');
  }

  user(): Usuario {
    return this.servUtils.obtenerLocalStorageJson('usuario');
  }

  comprarPro(product: Producto) {
    this.title = '';
    this.message = '';
    const user: Usuario = this.servUtils.obtenerLocalStorageJson('usuario');
    if (product.precio <= user.saldo) {
      this.showLoading();
      const comision = 0.10 * product.precio;
      const venta: Venta =
      {
        producto_uid: product.id!,
        vendedor_ced: product.vendedor_ced,
        comprador_ced: user.cedula,
        precio_pro: product.precio,
        comision: comision,
        monto_total: product.precio - comision,
        fecha: new Date()
      }
      this.servVenta.crearVenta(venta)
        .subscribe(
          (response: any) => {
            this.hideLoading();
            this.title = 'Compra exitosa!';
            this.message = response.message;
            this.showToast();
            this.cargarProductosActivos();
            this.servUsuario.obtenerUsuario(user.cedula)
              .subscribe(
                response => {
                  user.saldo = response.saldo;
                  this.servUtils.guardarLocalStorageJson('usuario', user);
                  this.hideLoading();
                },
                error => {
                  this.hideLoading();
                  this.message = error.error.message;
                  this.title = 'Error Interno';
                  this.showToast();
                  this.limpiarVariables();
                },
                (() => {
                  this.hideLoading();
                })
              )
          },
          error => {
            this.hideLoading();
            this.title = 'Error Interno';
            this.message = 'Error al comprar, intentalo de nuevo!';
            this.showToast();
          },
          (() => {
            this.hideLoading();
          })
        )
    } else {
      this.title = 'Compra';
      this.message = 'Imposible, no cuentas con saldo suficiente!';
      this.showToast();
    }
  }

  eliminarPro(id: string) {
    this.showLoading();
    this.servProduct.eliminarProducto(id)
      .subscribe(
        (response: any) => {
          this.hideLoading();
          this.title = 'Eliminación exitosa!';
          this.message = response.message;
          this.showToast();
          this.cargarProductosActivos();
        },
        error => {
          this.hideLoading();
          this.title = 'Error Interno';
          this.message = 'Error al eliminar, intentalo de nuevo!';
          this.showToast();
        },
        (() => {
          this.hideLoading();
        })
      )
  }

  salir() {
    this.servUtils.eliminarLocalStorage('usuario');
    this.servUtils.eliminarLocalStorage('token');
    this.servUtils.routerLink('/auth');
  }

}
