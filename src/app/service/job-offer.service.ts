import { Injectable } from '@angular/core';
import {JobOffer} from "../model/joboffer";
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {exhaustMap, map} from 'rxjs/operators';
import {UserService} from './user-service';
import {Worker} from '../model/worker';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {

  private readonly URL = 'http://localhost:8081/api/job_offers';

  jobOffers: JobOffer[] = [];
  jobOffersChange = new Subject<JobOffer[]>();


  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  getJobOffers() {
    return this.jobOffers.slice();
  }

  getJobOffer(id: number): JobOffer {
    let toReturn: JobOffer = null;
    this.jobOffers.forEach((jobOffer) => {
      if (jobOffer.id === id) {toReturn = jobOffer;}
    });
    return toReturn;
  }

  getAllJobOffers() {
    this.http.get<Array<JobOffer>>(this.URL)
      .subscribe(
        (jobOffers: Array<JobOffer>) => {
          this.jobOffers = jobOffers;
          this.jobOffersChange.next(this.jobOffers.slice());
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.router.navigate(['/signin']);
            }
          }
        });
  }

  saveNewJobOffer(jobOfferRequest): Observable<JobOffer> {
    return  this.http.post<any>(this.URL, jobOfferRequest);
  }

  applyWorkerForJob(applyRequest: {workerEmail: string, jobOfferId: number, applied: string}): Observable<any> {
    return this.http.put<any>(this.URL + '/apply', applyRequest);
  }

  checkIfUserAlreadyApplied(requestBody: {workerEmail: string, jobOfferId: number}): Observable<boolean> {
    return this.http.post<boolean>(this.URL + '/apply_check', requestBody);
  }

  findUserById(route: ActivatedRoute): Observable<boolean> {
    return route.params.pipe(map((params: Params) => {
        const id = +params['id'];
        const jobOffer = this.getJobOffer(id);
        return jobOffer;
      }
    ), exhaustMap((jobOffer) => {
      const request: {workerEmail: string, jobOfferId: number} =
        {workerEmail: this.userService.getLogedInUserInfo().email, jobOfferId: jobOffer.id};
      return this.checkIfUserAlreadyApplied(request);
    }));
  }

  findAllJobOffersPublishedBySpecificEmployer(id: number): Observable<Array<JobOffer>> {
    return this.http.get<Array<JobOffer>>(this.URL + '/published_by_specific_employer/' + id);
  }

  findAllAppliersForSpecificJobOffer(id: number): Observable<Array<Worker>> {
    return this.http.get<Array<Worker>>(this.URL + '/appliers/' + id);
  }

  getAllAplicationsForWorker(email: string): Observable<Array<JobOffer>> {
    return this.http.get<Array<JobOffer>>(this.URL + '/applications/' + email);
  }

  removeApplication(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.URL + '/' + id + '/' + this.userService.getLogedInUserInfo().email);
  }
}
