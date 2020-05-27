import { Injectable } from '@angular/core';
import {Observable, Subject, zip} from 'rxjs';
import {Employer, EvaluationRelationship} from '../model/employer';
import {ReviewedRelationship, Worker} from '../model/worker';
import {UserService} from './user-service';
import {JobOffer} from '../model/joboffer';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router';
import {exhaustMap, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeoplesEmployersService {

  private readonly workerURL = 'http://localhost:8081/api/workers';
  private readonly employerURL = 'http://localhost:8081/api/employers';

  searchedResult: (Worker | Employer)[] = [];
  searchedResultChanged: Subject<(Worker | Employer)[]> = new Subject<(Worker|Employer)[]>();

  constructor(private userService: UserService, private http: HttpClient) { }

  getUsers(search: string) {
    this.searchedResult = [];
    zip(this.userService.searchForEmployer(search), this.userService.searchForWorker(search))
      .subscribe(pair => {
        if (pair[0] !== null) {
          pair[0].forEach((employer: Employer) => {
            if (this.userService.hasRole('EMPLOYER') &&
              this.userService.getLogedInUserInfo().email === employer.credentials.email) {
              return;
            }
            this.searchedResult.push(employer);
          });
        }
        if (pair[1] !== null) {
          console.log('Nasao je nekog workera');
          pair[1].forEach((worker: Worker) => {
            if (this.userService.hasRole('WORKER') &&
              this.userService.getLogedInUserInfo().email === worker.credentials.email) {
              return;
            }
            this.searchedResult.push(worker);
          });
        }
        this.searchedResult = this.shuffle(this.searchedResult);
        this.searchedResultChanged.next(this.searchedResult.slice());
      });
  }

  typeOfWorker(result) {
    if (result.hasOwnProperty('firstName')) {
      return true;
    } else {
      return false;
    }
  }

  getWorkerById(id: number): Worker {
    let toReturn: Worker = null;
    this.searchedResult.forEach((element) => {
      if (element.hasOwnProperty('firstName') && element.id === id) {
        toReturn = element as Worker;
      }
    });
    return toReturn;
  }

  getEmployerById(id: number): Employer {
    let toReturn: Employer = null;
    this.searchedResult.forEach((element) => {
      if (element.hasOwnProperty('name') && element.id === id) {
        toReturn = element as Employer;
      }
    });
    return toReturn;
  }

  reviewWorker(reviewWorkerRequest: any): Observable<ReviewedRelationship> {
    return this.http.put<ReviewedRelationship>(this.workerURL + '/review', reviewWorkerRequest);
  }

  evaluateEmployer(reviewRequest: { workerEmail: string; employerId: number; workerExperience: string;
    recommendation: string; employerRate: number; stillWorkingForThisEmployer: boolean }): Observable<any> {
    return this.http.put<any>(this.employerURL + '/evaluate', reviewRequest);
  }

  getAllWorkersReviews(id: number): Observable<Array<ReviewedRelationship>> {
    return this.http.get<Array<ReviewedRelationship>>(this.workerURL + '/reviews/' + id);
  }

  getAllEmployersEvaluations(id: number) {
    return this.http.get<Array<EvaluationRelationship>>(this.employerURL + '/evaluations/' + id);
  }

  createFriendship(id: number): Observable<any> {
    const friendship: {firstWorkerEmail: string, secondWorkerId: number} = {firstWorkerEmail: '', secondWorkerId: 0};
    friendship.firstWorkerEmail = this.userService.getLogedInUserInfo().email;
    friendship.secondWorkerId = id;
    return this.http.put<any>(this.workerURL + '/create_friendship', friendship);
  }

  createFollowRelationship(id: number): Observable<any> {
    const follow: {workerEmail: string, employerId: number} = {workerEmail: '', employerId: 0};
    follow.workerEmail = this.userService.getLogedInUserInfo().email;
    follow.employerId = id;
    return this.http.put<any>(this.workerURL + '/follow', follow);
  }

  checkFollowRelationship(id: number): Observable<boolean> {
    const checkFollowRequest: {workerEmail: string, employerId: number} = {workerEmail: '', employerId: 0};
    checkFollowRequest.workerEmail = this.userService.getLogedInUserInfo().email;
    checkFollowRequest.employerId = id;
    return this.http.post<boolean>(this.employerURL + '/follow_check', checkFollowRequest);
  }

  checkFriendship(id: number): Observable<boolean> {
    const checkFriendshipRequest: {firstWorkerEmail: string, secondWorkerId: number} = {firstWorkerEmail: '', secondWorkerId: 0};
    checkFriendshipRequest.firstWorkerEmail = this.userService.getLogedInUserInfo().email;
    checkFriendshipRequest.secondWorkerId = id;
    return this.http.post<boolean>(this.workerURL + '/friends_check', checkFriendshipRequest);
  }

  getFriendsAndFollowedEmployersForWorker(email: string): Observable<any> {
    const friendsAndFollowed: (Worker | Employer)[] = [];
    return zip(this.findFriends(email), this.findFollowedEmployers(email));
  }

  findFriends(email: string): Observable<Array<Worker>> {
    return this.http.get<Array<Worker>>(this.workerURL + '/friends/' + email);
  }

  findFollowedEmployers(email: string): Observable<Array<Employer>> {
    return this.http.get<Array<Employer>>(this.workerURL + '/followed_employers/' + email);
  }

  unfollowEmployer(id: number): Observable<boolean> {
    const unfollowRequest: {workerEmail: string, employerId: number} = {workerEmail: '', employerId: 0};
    unfollowRequest.workerEmail = this.userService.getLogedInUserInfo().email;
    unfollowRequest.employerId = id;
    return this.http.put<boolean>(this.workerURL + '/unfollow/', unfollowRequest);
  }

  unfriendWorker(id: number): Observable<boolean> {
    const unfriendRequest: {firstWorkerEmail: string, secondWorkerId: number} = {firstWorkerEmail: '', secondWorkerId: 0};
    unfriendRequest.firstWorkerEmail = this.userService.getLogedInUserInfo().email;
    unfriendRequest.secondWorkerId = id;
    return this.http.put<boolean>(this.workerURL + '/unfriend/', unfriendRequest);
  }

  private shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue: any = null;
    let randomIndex = 0;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
