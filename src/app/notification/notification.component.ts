import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../service/notification-service';
import {JobOffer} from '../model/joboffer';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: JobOffer[] = [];
  notificationSub: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    // this.notificationSub = this.notificationService.notificationChange
    //   .subscribe((newNotifications: JobOffer[]) => {
    //     this.notifications = newNotifications;
    //   });
    //  this.notificationService.getNotifications();
  }

  onNewNotifications() {
    this.notificationService.getNotifications();
  }

}
