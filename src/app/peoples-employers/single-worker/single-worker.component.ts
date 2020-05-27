import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PeoplesEmployersService} from '../../service/peoples-employers.service';
import {ReviewedRelationship, Worker} from '../../model/worker';
import {UserService} from '../../service/user-service';
import {NgForm} from '@angular/forms';
import {Employer} from '../../model/employer';
import {Observable, zip} from 'rxjs';
import {exhaustMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-single-worker',
  templateUrl: './single-worker.component.html',
  styleUrls: ['./single-worker.component.css']
})
export class SingleWorkerComponent implements OnInit {

  id: number;
  worker: Worker = null;
  @ViewChild('f', {static: false}) reviewForm: NgForm;
  successfullyReviewed = false;
  areFriends = false;
  reviews: ReviewedRelationship[] = [];

  constructor(private peoplesEmployersService: PeoplesEmployersService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {

    const obs: Observable<any>  =  this.route.params.pipe(map((params: Params) => {
        this.id = +params['id'];
        this.worker = this.peoplesEmployersService.getWorkerById(this.id);
        return this.worker;
      }
    ), exhaustMap((worker) => {
      if (worker !== null) {
        return zip(
          this.peoplesEmployersService.getAllWorkersReviews(worker.id),
          this.peoplesEmployersService.checkFriendship(worker.id));
      } else {
        return zip(
          this.peoplesEmployersService.getAllWorkersReviews(-1),
          this.peoplesEmployersService.checkFriendship(-1));
      }
    }));

    obs.subscribe(pair => {
      if (pair[0] === null && pair[1] === null) {
        this.router.navigate(['/peoples-employers']);
      }
      if (pair[0] !== null) {
        this.reviews = pair[0] as ReviewedRelationship[];
      }
      if (pair[1] !== null) {
        this.areFriends = pair[1];
      }
    });
  }

  onSubmit() {
    const reviewRequest: {workerId: number, employerEmail: string, critics: string,
      recommendation: string, workerRate: number, stillWorkingForThisEmployer: boolean} =
      {workerId: 0, employerEmail: '', critics: '', recommendation: '', workerRate: 0, stillWorkingForThisEmployer: false};

    reviewRequest.workerId = this.worker.id;
    reviewRequest.employerEmail = this.userService.getLogedInUserInfo().email;
    reviewRequest.critics = this.reviewForm.value.critics;
    reviewRequest.recommendation = this.reviewForm.value.recommendation;
    reviewRequest.workerRate = +this.reviewForm.value.workerRate;
    reviewRequest.stillWorkingForThisEmployer = this.reviewForm.value.stillWorkingForThisEmployer;
    console.log(this.reviewForm);
    this.reviewForm.reset();
    this.peoplesEmployersService.reviewWorker(reviewRequest)
      .subscribe((reviewedRelationship: ReviewedRelationship) => {
        this.reviews.push(reviewedRelationship);
        this.successfullyReviewed = true;
        setTimeout(() => {
          this.successfullyReviewed = false;
        }, 4000);

      });
  }

  addFriend() {
    this.peoplesEmployersService.createFriendship(this.worker.id)
      .subscribe(() => {
        this.areFriends = true;
      });
  }
}
