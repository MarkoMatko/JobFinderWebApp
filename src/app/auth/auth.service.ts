import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private readonly URLLogIn = 'http://localhost:8081/api/authentication';

  attemptAuth(email: string, password: string): Observable<any> {
    const credentials: {email: string, password: string} = {email, password};
    console.log(credentials);
    return this.http.post<any>(this.URLLogIn + '/generate-token', credentials);
  }
}
