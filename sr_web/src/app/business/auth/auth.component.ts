import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToatsNotificationComponent } from 'src/app/shared/components/toats-notification/toats-notification.component';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loginForm: FormGroup;
  error: boolean = false;
  message: string = '';

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

  login() {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      const cedula = data.cedula;
      this.servAuth.acceso(cedula)
      .subscribe(
        (response: any) => {
          this.error = false;
          this.servUtils.guardarLocalStorageJson('usuario', response.usuario);
          this.servUtils.guardarLocalStorageJson('token', response.token);
          this.servUtils.routerLink('/container');
          
      },(error) => {
        this.message = error.error;
        this.error = true;
        console.log('error: ' + error.error)
      });
    }
  }
}
