import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user-service';
import {Employer} from '../../model/employer';
import {Observable, zip} from 'rxjs';
import {exhaustMap, map} from 'rxjs/operators';
import {Params} from '@angular/router';
import {JobOfferService} from '../../service/job-offer.service';
import {JobOffer} from '../../model/joboffer';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile-employer.component.html',
  styleUrls: ['./my-profile-employer.component.css']
})
export class MyProfileEmployerComponent implements OnInit {

  logedInEmployer: Employer = null;
  logedInEmployerjobOffers: JobOffer[] = [];

  constructor(private userService: UserService, private jobOfferService: JobOfferService) { }

  ngOnInit() {

    const obs: Observable<any>  =  this.userService.findEmployerByEmail().pipe(map((employer: Employer) => {
        this.logedInEmployer = employer;
        return this.logedInEmployer;
      }
    ), exhaustMap((employer) => {
      return this.jobOfferService.findAllJobOffersPublishedBySpecificEmployer(employer.id);
    }));

    obs.subscribe((jobOffers: JobOffer[]) => {
      this.logedInEmployerjobOffers = jobOffers;
    });
  }

}
