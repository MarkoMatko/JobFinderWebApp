import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Employer, EvaluationRelationship} from '../../model/employer';
import {PeoplesEmployersService} from '../../service/peoples-employers.service';
import {UserService} from '../../service/user-service';
import {NgForm} from '@angular/forms';
import {Observable, zip} from 'rxjs';
import {ReviewedRelationship} from '../../model/worker';
import {exhaustMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-employer',
  templateUrl: './single-employer.component.html',
  styleUrls: ['./single-employer.component.css']
})
export class SingleEmployerComponent implements OnInit {

  @ViewChild('f', {static: false}) reviewForm: NgForm;
  id: number;
  employer: Employer;
  successfullyEvaluated = false;
  evaluations: EvaluationRelationship[] = [];
  following = false;
  space = '        ';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private peoplesEmployersService: PeoplesEmployersService,
              private userService: UserService) { }

  ngOnInit() {
    const obs: Observable<any>  =  this.route.params.pipe(map((params: Params) => {
        this.id = +params['id'];
        this.employer = this.peoplesEmployersService.getEmployerById(this.id);
        this.evaluations = [];
        this.following = false;
        return this.employer;
      }
    ), exhaustMap((employer) => {
      if (employer !== null) {
        return zip(
          this.peoplesEmployersService.getAllEmployersEvaluations(employer.id),
          this.peoplesEmployersService.checkFollowRelationship(employer.id));
      }
      else {
        return zip(
          this.peoplesEmployersService.getAllEmployersEvaluations(-1),
          this.peoplesEmployersService.checkFollowRelationship(-1));
      }
    }));

    obs.subscribe(pair => {
      if (pair[0] === null && pair[1] === null) {
        this.router.navigate(['/peoples-employers']);
      }
      if (pair[0] !== null) {
        this.evaluations = pair[0] as EvaluationRelationship[];
        console.log(this.evaluations);
      }
      if (pair[1] !== null) {
        console.log('Vratio je : ');
        console.log(pair[1]);
        this.following = pair[1];
      }
    });
  }

  onSubmit() {
    const reviewRequest: {workerEmail: string, employerId: number, workerExperience: string,
      recommendation: string, employerRate: number, stillWorkingForThisEmployer: boolean} =
      {workerEmail: '', employerId: 0, workerExperience: '', recommendation: '', employerRate: 0, stillWorkingForThisEmployer: false};

    reviewRequest.employerId = this.employer.id;
    reviewRequest.workerEmail = this.userService.getLogedInUserInfo().email;
    reviewRequest.workerExperience = this.reviewForm.value.workerExperience;
    reviewRequest.recommendation = this.reviewForm.value.recommendation;
    reviewRequest.employerRate = +this.reviewForm.value.employerRate;
    reviewRequest.stillWorkingForThisEmployer = this.reviewForm.value.stillWorkingForThisEmployer;
    console.log(this.reviewForm);
    this.reviewForm.reset();
    this.peoplesEmployersService.evaluateEmployer(reviewRequest)
      .subscribe((evaluateRelationship: EvaluationRelationship) => {
        this.successfullyEvaluated = true;
        this.evaluations.push(evaluateRelationship);
        setTimeout(() => {
          this.successfullyEvaluated = false;
        }, 4000);

      });
  }

  createFollowRelationship() {
    this.peoplesEmployersService.createFollowRelationship(this.employer.id)
      .subscribe(() => {
        this.following = true;
      });
  }
}
