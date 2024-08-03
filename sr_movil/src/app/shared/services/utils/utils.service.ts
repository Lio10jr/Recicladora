import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  loading() {
    return this.loadingCtrl.create({
      cssClass: 'custom-loading',
      message:"Cargando..."
    });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  routerLink(url: string) {
    return this.router.navigate([url]);
  }

  guardarLocalStorageJson(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  obtenerLocalStorageJson(key: string) {
    return JSON.parse(localStorage.getItem(key)!);
  }

  guardarLocalStorage(key: string, fecha: string) {
    localStorage.setItem(key, fecha);
  }

  obtenerLocalStorage(key: string): string {
    return localStorage.getItem(key)!;
  }

  eliminarLocalStorage(key: string) {
    return localStorage.removeItem(key);
  }

  async presentarModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  async presentarAlert(opts: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();

    const { data } = await alert.onDidDismiss();
    if (data) return data;
  }
}
