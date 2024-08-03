import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'src/app/shared/services/firebase/push-notifications.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
})
export class TabPage implements OnInit {

  constructor(
    private serviceNoti: PushNotificationsService
  ) { }

  ngOnInit() {
    this.serviceNoti.inicializarNotificaciones();
  }

  

}
