import {User} from '../model/user';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Employer} from '../model/employer';
import {Worker} from '../model/worker';

const USER_INFO_KEY = 'UserInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URLUser = 'http://localhost:8081/api/user/register';
  URLEmployer = 'http://localhost:8081/api/employers';
  URLWorker = 'http://localhost:8081/api/workers'

  private logedInUserInfo: User = null;

  constructor(private http: HttpClient) { }

  getLogedInUserInfo(): User {
    // return this.logedInUserInfo;
    return JSON.parse(window.sessionStorage.getItem(USER_INFO_KEY));
  }
  setLogedInUserInfo(userInfo: User): void {
    // this.logedInUserInfo = userInfo;
    window.sessionStorage.removeItem(USER_INFO_KEY);
    window.sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }
  resetUserInfo() {
    // this.logedInUserInfo = null;
    window.sessionStorage.removeItem(USER_INFO_KEY);
  }
  hasRole(userRole: string): boolean {
    const jobOffer = JSON.parse(window.sessionStorage.getItem(USER_INFO_KEY));
    if (jobOffer !== null) {
      for (const role of jobOffer.roles) {
        if (role === userRole) {
          return true;
        }
      }
    }
    return false;
  }


  registerWorker(worker: any): Observable<any> {
    if (worker.credentials.roles.some(x => x === 'WORKER')) {
      return this.http.post<any>(this.URLUser + '_worker', worker);
    }
  }

  registerEmployer(employer: any): Observable<any> {
    if (employer.credentials.roles.some(x => x === 'EMPLOYER')) {
      return this.http.post<any>(this.URLUser + '_employer', employer);
    }
  }

  searchForEmployer(search: string): Observable<Array<Employer>> {
    return this.http.get<Array<Employer>>('http://localhost:8081/api/employers/search/' + search);
  }

  searchForWorker(search: string): Observable<Array<Worker>> {
    return this.http.get<Array<Worker>>('http://localhost:8081/api/workers/search/' + search);

  }

  findEmployerByEmail(): Observable<Employer> {
    if (this.hasRole('EMPLOYER')) {
      return this.http.get<Employer>(this.URLEmployer + '/find/' + this.getLogedInUserInfo().email);
    } else {
      return null;
    }
  }

  findWorkerByEmail(): Observable<Worker> {
    if (this.hasRole('WORKER')) {
      return this.http.get<Worker>(this.URLWorker + '/find/' + this.getLogedInUserInfo().email);
    } else {
      return null;
    }
  }
}

