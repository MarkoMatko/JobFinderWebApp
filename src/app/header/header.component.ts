import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenStorage} from '../auth/token.storage';
import {UserService} from '../service/user-service';
import {Router} from '@angular/router';
import {NotificationService} from '../service/notification-service';
import {Subscription} from 'rxjs';
import {JobOffer} from '../model/joboffer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  notificationsSub: Subscription = new Subscription();
  newNotifications: JobOffer[] = [];
  alreadySeenNotifications: JobOffer[] = [];

  constructor(private tokenStorage: TokenStorage,
              private userService: UserService,
              private router: Router,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationsSub = this.notificationService.notificationChange
      .subscribe((notifications: {newNotifications: JobOffer[], alreadySeenNotifications: JobOffer[]}) => {
        this.newNotifications = notifications.newNotifications;
        this.alreadySeenNotifications = notifications.alreadySeenNotifications;

      });
  }

  signOut() {
    this.tokenStorage.signOut();
    this.userService.resetUserInfo();
    this.router.navigate(['/signin']);
  }

  onNotifications() {
    this.notificationService.getNotifications();
  }

  ngOnDestroy(): void {
    this.notificationsSub.unsubscribe();
  }

  markAsSeen(jobOffer: JobOffer) {
    this.notificationService.markAsSeen(jobOffer.id);
  }
}
