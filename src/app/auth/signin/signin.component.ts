import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {TokenStorage} from '../token.storage';
import {UserService} from '../../service/user-service';
import {User} from '../../model/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  @ViewChild('f', {static: false}) form: NgForm;
  badCredentials = false;

  constructor(private auth: AuthService,
              private tokenStorage: TokenStorage,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const credentials: {email: string, password: string} = {email: '', password: ''};
    credentials.email = this.form.value.email;
    credentials.password = this.form.value.password;
    this.auth.attemptAuth(credentials.email, credentials.password)
      .subscribe(
        data => {
          this.tokenStorage.saveToken(data.token);
          this.userService.setLogedInUserInfo(
            new User(data.userInfo.username, data.userInfo.password,
              data.userInfo.email, data.userInfo.roles, data.userInfo.id));
          console.log(this.userService.getLogedInUserInfo());
          this.badCredentials = false;
          if (this.userService.hasRole('WORKER')) {
            this.router.navigate(['/joboffers']);
          }
          if (this.userService.hasRole('EMPLOYER')) {
            this.router.navigate(['/my-profile-employer']);
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.badCredentials = true;
            }
            if (error.status === 400) {
              this.badCredentials = true;
            }
          }
        }
        );

  }

}
