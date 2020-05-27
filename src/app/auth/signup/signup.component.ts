import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from '../../model/user';
import {UserService} from '../../service/user-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('f', {static: false}) userForm: NgForm;

  workerSelect = false;
  employerSelect = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.userForm.valid) {
      return;
    }
    const roles: string[] = [];
    if (this.employerSelect) {
      roles.push('EMPLOYER');
      const employer: EmployerRequest =
        { name: '', branch: '', description: '', siteLink: '', credentials: null, location: '', logoImgPath: ''};
      employer.name = this.userForm.value.employerData.name1;
      employer.siteLink = this.userForm.value.employerData.siteLink;
      employer.description = this.userForm.value.employerData.description;
      employer.branch = this.userForm.value.employerData.branch1;
      employer.location = this.userForm.value.employerData.location;
      employer.logoImgPath = this.userForm.value.employerData.logoImgPath;
      const user: User = new User(this.userForm.value.username, this.userForm.value.password,
        this.userForm.value.email, roles);
      employer.credentials = user;
      console.log('Saljemo podatke : ' + user + ' | ' + employer);
      this.userService.registerEmployer(employer).subscribe(
        (data: any) => {
          console.log('Registrovan employer je : ' + data);
          this.router.navigate(['/signin']);
        }
        // TODO STA U SLUCAJU ERROR-a
      );
    }
    if (this.workerSelect) {
      roles.push('WORKER');
      const worker: WorkerRequest = { firstName: '', secondName: '', branch: '', degree: '', CVLink: '', credentials: null};
      console.log(this.userForm);
      worker.firstName = this.userForm.value.workerData.name;
      worker.secondName = this.userForm.value.workerData.surname;
      worker.degree = this.userForm.value.workerData.degree;
      worker.CVLink = this.userForm.value.workerData.CVLink;
      worker.branch = this.userForm.value.workerData.branch;
      const user: User = new User(this.userForm.value.username, this.userForm.value.password,
        this.userForm.value.email, roles);
      worker.credentials = user;
      console.log('Saljemo podatke : ' + user.email + ' | ' + worker.firstName);
      this.userService.registerWorker(worker).subscribe(
        (data: any) => {
          console.log('Registrovan worker je : ' + data);
          this.router.navigate(['/signin']);
        }
        // TODO STA U SLUCAJU ERROR-a
      );
    }
  }

  workerSelected() {
    this.employerSelect = false;
    this.workerSelect = true;


  }

  employerSelected() {
    this.workerSelect = false;
    this.employerSelect = true;
  }

}

interface WorkerRequest {
  firstName: string;
  secondName: string;
  branch: string;
  degree: string;
  CVLink: string;
  credentials: User;
}

interface EmployerRequest {
  name: string;
  branch: string;
  description: string;
  siteLink: string;
  credentials: User;
  location: string;
  logoImgPath: string;
}

