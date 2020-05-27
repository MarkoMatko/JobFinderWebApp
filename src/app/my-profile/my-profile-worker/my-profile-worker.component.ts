import { Component, OnInit } from '@angular/core';
import {Employer} from '../../model/employer';
import {UserService} from '../../service/user-service';
import {JobOfferService} from '../../service/job-offer.service';
import {Worker} from '../../model/worker';
import {PeoplesEmployersService} from '../../service/peoples-employers.service';
import {JobOffer} from '../../model/joboffer';

@Component({
  selector: 'app-my-profile-worker',
  templateUrl: './my-profile-worker.component.html',
  styleUrls: ['./my-profile-worker.component.css']
})
export class MyProfileWorkerComponent implements OnInit {

  logedInWorker: Worker = null;
  friendsAndFollowed: (Worker | Employer)[] = [];
  applications: JobOffer[] = [];

  constructor(private userService: UserService,
              private jobOfferService: JobOfferService,
              private peoplesEmployersService: PeoplesEmployersService) { }

  ngOnInit() {
    this.userService.findWorkerByEmail()
      .subscribe((worker: Worker) => {
        this.logedInWorker = worker;
        console.log(worker);
      });

    this.peoplesEmployersService.getFriendsAndFollowedEmployersForWorker(this.userService.getLogedInUserInfo().email)
      .subscribe(pair => {
        if (pair[1] !== null) {
          pair[1].forEach((employer: Employer) => {
            this.friendsAndFollowed.push(employer);
          });
        }
        if (pair[0] !== null) {
          pair[0].forEach((worker: Worker) => {
            this.friendsAndFollowed.push(worker);
          });
        }
        console.log(this.friendsAndFollowed);
      });

    this.jobOfferService.getAllAplicationsForWorker(this.userService.getLogedInUserInfo().email)
      .subscribe((jobOffers: JobOffer[]) => {
        this.applications = jobOffers;
        console.log(this.applications);
      });
  }

  unfollowEmployer(result: Worker | Employer, unfollowElement: HTMLButtonElement) {
    unfollowElement.disabled = true;
    const employer: Employer = result as Employer;
    this.peoplesEmployersService.unfollowEmployer(employer.id)
      .subscribe((status) => {

      });
  }

  unFriendWorker(result: Worker | Employer, unfollowElement: HTMLButtonElement) {
    unfollowElement.disabled = true;
    const worker: Worker = result as Worker;
    this.peoplesEmployersService.unfriendWorker(worker.id)
      .subscribe((status) => {

      });
  }

  removeApplication(jobOffer: JobOffer) {
    this.jobOfferService.removeApplication(jobOffer.id)
      .subscribe(() => {
        this.applications.forEach((jobOffer1: JobOffer) => {
          if (jobOffer1.id === jobOffer.id) {
            const index = this.applications.indexOf(jobOffer1, 0);
            if (index > -1) {
              this.applications.splice(index, 1);
            }
          }
        });
      });
  }
}
