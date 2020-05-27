import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user-service';
import {Employer} from '../model/employer';
import {Worker} from '../model/worker';
import {Observable, zip} from 'rxjs';
import {Router} from '@angular/router';
import {PeoplesEmployersService} from '../service/peoples-employers.service';

@Component({
  selector: 'app-peoples-employers',
  templateUrl: './peoples-employers.component.html',
  styleUrls: ['./peoples-employers.component.css']
})
export class PeoplesEmployersComponent implements OnInit {
  search: string;
  searchedResult: (Worker | Employer)[] = [];

  constructor(private userService: UserService,
              private peoplesEmployersService: PeoplesEmployersService,
              private router: Router) { }

  ngOnInit() {
    this.peoplesEmployersService.searchedResultChanged
      .subscribe((data: (Worker | Employer)[]) => {

        this.searchedResult = data;
      });
  }

  onSearch() {
    this.peoplesEmployersService.getUsers(this.search);
  }


}
