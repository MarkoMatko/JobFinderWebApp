import {Injectable} from '@angular/core';
import {JobOffer} from '../model/joboffer';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user-service';
import {User} from '../model/user';
import {Observable, Subject, zip} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly URL: string = 'http://localhost:8081/api/workers';
  notificationChange: Subject<{newNotifications: JobOffer[], alreadySeenNotifications: JobOffer[]}> =
    new Subject<{newNotifications: JobOffer[], alreadySeenNotifications: JobOffer[]}>();
  notifications: JobOffer[] = [];

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getNotifications() {
    // while (true) {
    const user: User = this.userService.getLogedInUserInfo();
    if (user !== null) {
      zip(this.http.get<Array<JobOffer>>(this.URL + '/notification/' + user.email),
        this.http.get<Array<JobOffer>>(this.URL + '/notification/' + user.email + '/5'))
        .subscribe(pair => {
          const newNotifications: JobOffer[] = pair[0] as JobOffer[];
          const alreadySeenNotifications: JobOffer[] = pair[1] as JobOffer[];
          const toReturn: {newNotifications: JobOffer[], alreadySeenNotifications: JobOffer[]} =
            {newNotifications: null, alreadySeenNotifications: null};
          toReturn.newNotifications = newNotifications;
          toReturn.alreadySeenNotifications = alreadySeenNotifications;
          this.notificationChange.next(toReturn);
        });
      // break;
    }
    // setTimeout(() => {
    // }, 10000);
    // }
  }

  markAsSeen(id: number): void {
    const requestBody: {workerEmail: string, jobOfferId: number} = {workerEmail: null, jobOfferId: 0};
    requestBody.workerEmail = this.userService.getLogedInUserInfo().email;
    requestBody.jobOfferId = id;
    this.http.put<boolean>(this.URL + '/mark_as_seen', requestBody)
      .subscribe(success => {
      });
  }
}
