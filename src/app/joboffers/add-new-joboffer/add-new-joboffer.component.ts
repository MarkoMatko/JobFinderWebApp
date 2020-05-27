import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {TokenStorage} from '../../auth/token.storage';
import {JobOfferService} from '../../service/job-offer.service';
import {User} from '../../model/user';
import {UserService} from '../../service/user-service';
import {JobOffer} from '../../model/joboffer';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-new-joboffer',
  templateUrl: './add-new-joboffer.component.html',
  styleUrls: ['./add-new-joboffer.component.css']
})
export class AddNewJobofferComponent implements OnInit {

  @ViewChild('f', {static: false}) newJobOfferForm: NgForm;

  successfulySaved = false;
  unSuccessfulySaved = false;

  constructor(private router: Router,
              private tokenStorage: TokenStorage,
              private userService: UserService,
              private jobOfferService: JobOfferService) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.newJobOfferForm.valid){
      return;
    }
    const newJobOffer: JobOfferRequest =
      {employerEmail: '', published: '', expired: '', jobDescription: '',
        offer: [], jobResponsibilities: [], experienceRequired: [], imgPath: ''};

    newJobOffer.employerEmail = this.userService.getLogedInUserInfo().email;
    newJobOffer.published = new Date().toISOString();
    newJobOffer.expired = this.newJobOfferForm.value.expired;

    // newJobOffer.expired = '2019-12-29';

    newJobOffer.jobDescription = this.newJobOfferForm.value.jobDescription;
    newJobOffer.offer = this.newJobOfferForm.value.offer.split('.');
    newJobOffer.jobResponsibilities = this.newJobOfferForm.value.jobResponsibilities.split('.');
    newJobOffer.experienceRequired = this.newJobOfferForm.value.experienceRequired.split('.');
    newJobOffer.imgPath = this.newJobOfferForm.value.imgPath;
    console.log("ovo saljemo: ");
    console.log(newJobOffer);

    this.jobOfferService.saveNewJobOffer(newJobOffer)
      .subscribe(
        (date: JobOffer) => {
          this.unSuccessfulySaved = false;
          this.successfulySaved = true;
          this.newJobOfferForm.reset();
          setTimeout(() => {
            this.successfulySaved = false;
          }, 4000);
        }, error => {
          if (error instanceof  HttpErrorResponse) {
            this.successfulySaved = false;
            this.unSuccessfulySaved = true;
          }
        }
      );

  }
}

interface JobOfferRequest {
  employerEmail: string;
  published: string;
  expired: string;
  jobDescription: string;
  offer: string[];
  jobResponsibilities: string[];
  experienceRequired: string[];
  imgPath: string;
}
