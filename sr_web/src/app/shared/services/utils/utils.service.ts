import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable  } from 'rxjs';
import { Toast } from 'src/app/core/interfaces/toasts';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  toasts: Toast[] = [];
  constructor(
    private router: Router
  ) { }

  routerLink(url: string) {
    return this.router.navigate([url]);
  }
  
  guardarLocalStorageJson(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  obtenerLocalStorageJson(key: string) {
    return JSON.parse(localStorage.getItem(key)!);
  }

  guardarLocalStorage(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  obtenerLocalStorage(key: string): string {
    return localStorage.getItem(key)!;
  }

  eliminarLocalStorage(key: string) {
    return localStorage.removeItem(key);
  }

  show(toast: Toast) {
		this.toasts.push(toast);
	}

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
 
}
