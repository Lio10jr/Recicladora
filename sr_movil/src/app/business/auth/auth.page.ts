import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private servAuth: AuthService,
    private servUtils: UtilsService,
  ) { 
    this.loginForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    });
  }

  get cedula() {
    return this.loginForm.get('cedula');
  }

  ngOnInit() {
  }

  async login() {
    if (this.loginForm.valid) {
      const loading = await this.servUtils.loading();
      await loading.present();
      const data = this.loginForm.value;
      const cedula = data.cedula;
      this.servAuth.acceso(cedula)
      .subscribe(
        (response: any) => {
          this.servUtils.guardarLocalStorageJson('usuario', response.usuario);
          this.servUtils.guardarLocalStorageJson('token', response.token);
          this.servUtils.routerLink('/menu/home');
          
      },(error) => {
        loading.dismiss();
        console.log('error: ' + error.error);
        this.servUtils.presentToast({
          message: 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.',
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
    );
    }
  }

}
