import { Component, OnInit } from '@angular/core';
import {JobOffer} from "../../model/joboffer";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {JobOfferService} from "../../service/job-offer.service";
import {UserService} from '../../service/user-service';
import {HttpErrorResponse} from '@angular/common/http';
import {exhaustMap, map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-single-joboffer',
  templateUrl: './single-joboffer.component.html',
  styleUrls: ['./single-joboffer.component.css']
})
export class SingleJobofferComponent implements OnInit {

  jobOffer: JobOffer;
  id: number;
  successfullyApplied = false;
  unSuccessfullyApplied = false;
  alreadyApplied = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private jobOfferService: JobOfferService,
              private userService: UserService) { }

  ngOnInit() {

    // this.route.params
    //   .subscribe((params: Params) => {
    //     this.id = +params['id'];
    //     this.jobOffer = this.jobOfferService.getJobOffer(this.id);
    //     const request: {workerEmail: string, jobOfferId: number} =
    //       {workerEmail: this.userService.getLogedInUserInfo().email, jobOfferId: this.jobOffer.id};
    //     this.jobOfferService.checkIfUserAlreadyApplied(request)
    //       .subscribe(check => {
    //         this.alreadyApplied = check;
    //       });
    //   });
    const obs: Observable<boolean>  =  this.route.params.pipe(map((params: Params) => {
        this.id = +params['id'];
        this.jobOffer = this.jobOfferService.getJobOffer(this.id);
        if (this.jobOffer === null) {
          this.router.navigate(['/joboffers']);
        }
        this.successfullyApplied = false;
        this.unSuccessfullyApplied = false;
        return this.jobOffer;
      }
    ), exhaustMap((jobOffer) => {
      const request: {workerEmail: string, jobOfferId: number} = {workerEmail: '', jobOfferId: -1};
      if (jobOffer === null) {
        request.workerEmail = this.userService.getLogedInUserInfo().email;
        request.jobOfferId = -1;
      } else {
        request.workerEmail = this.userService.getLogedInUserInfo().email;
        request.jobOfferId = jobOffer.id;
      }
      return this.jobOfferService.checkIfUserAlreadyApplied(request);
    }));

    obs.subscribe(check => {
      if (check !== null) {
        this.alreadyApplied = check;
      }
    });
  }

  applyForJob() {
    if (this.alreadyApplied) {
      return;
    }
    const applyRequest: {workerEmail: string, jobOfferId: number, applied: string} =
      {workerEmail: '', jobOfferId: 0, applied: null};
    applyRequest.workerEmail = this.userService.getLogedInUserInfo().email;
    applyRequest.jobOfferId = this.jobOffer.id;
    applyRequest.applied = new Date().toISOString();
    this.jobOfferService.applyWorkerForJob(applyRequest)
      .subscribe(() => {
          this.unSuccessfullyApplied = false;
          this.successfullyApplied = true;
          this.alreadyApplied = true;
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.successfullyApplied = false;
              this.unSuccessfullyApplied = true;
              this.alreadyApplied = false;
            }
          }
        });
  }
}
