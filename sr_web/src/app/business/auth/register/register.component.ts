import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: boolean = false;
  message: string = '';
  constructor(
    private fb: FormBuilder,
    private servAuth: AuthService,
    private servUtils: UtilsService,
  ) {
    this.registerForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    });
  }


  get cedula() {
    return this.registerForm.get('cedula');
  }

  get nombre() {
    return this.registerForm.get('nombre');
  }

  get apellido() {
    return this.registerForm.get('apellido');
  }

  register() {
    if (this.registerForm.valid) {
      const data = this.registerForm.value;
      data.saldo = 0;
      data.rol = 'cliente';
      this.servAuth.registro(data)
      .subscribe(
        (response: any) => {
          this.error = false;
          this.servUtils.guardarLocalStorageJson('usuario', response.usuario);
          this.servUtils.guardarLocalStorageJson('token', response.token);
          this.servUtils.routerLink('/container');
      },(error) => {
        this.message = 'Error al crear usuario, intentalo de nuevo!';
        this.error = true;
        console.log('error: ' + error.error)
      });
    }
  }
  
}
