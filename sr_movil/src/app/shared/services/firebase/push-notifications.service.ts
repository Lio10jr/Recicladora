import { PushNotificationService } from './../api/push-notification.service';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { UtilsService } from '../utils/utils.service';
import { Usuario } from 'src/app/core/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  fixedTimeZoneOffset = -300;
  constructor(
    public platform: Platform,
    private servUtils: UtilsService,
    private servNoti: PushNotificationService,
    private router: Router
  ) { }

  user(): Usuario {
    return this.servUtils.obtenerLocalStorageJson('usuario');
  }


  inicializarNotificaciones = async () => {
    try {
      if (this.platform.is('capacitor')) {
        this.registerNotifications();
      } else {
        console.log('no es movil');
      }
    } catch (e) {
      console.log(e)
    }
  }

  registerNotifications = async () => {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === 'granted') {
      await PushNotifications.register();
      this.addListeners();
      return true;
    } else {
      return false;
    }
  }

  addListeners = async () => {
    PushNotifications.addListener('registration', async (token: Token) => {
      const tokenValue = token.value;
      try {
        const currentUser: Usuario = this.user();
        if (currentUser) {
          console.log('entro')
          if (currentUser.token_noti) {
            console.log('salio')
            if (currentUser.token_noti !== tokenValue) {
              this.servNoti.actualizarToken(currentUser.cedula, tokenValue);
              currentUser.token_noti = tokenValue;
              this.servUtils.guardarLocalStorageJson('usuario', currentUser);
            }
          } else {
            console.log('salio')
            this.crearToken(currentUser.cedula, tokenValue);
            currentUser.token_noti = tokenValue;
            this.servUtils.guardarLocalStorageJson('usuario', currentUser);
          }
        } else {
          console.error('No se pudo obtener el usuario actual');
        }
      } catch (error) {
        console.error('Error al procesar el token de registro:', error);
      }
    });

    PushNotifications.addListener(
      'registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push notification received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        try {
          const data = notification.notification.data;
          if (data && data.page) {
            this.router.navigate([data.page]);
          } else {
            this.router.navigate(['menu/home']);
          }
        } catch (e) {
          console.log('Error')
        }
      },
    );
  }

  crearToken(cedula: string, token: string) {
    this.servNoti.actualizarToken(cedula, token)
      .subscribe(
        res => {
          console.log('Token creado con exito');
        },
        error => {
          console.log('Ocurrió un error al crear el token de registro de notificaciones');
        }
      )
  }

}
