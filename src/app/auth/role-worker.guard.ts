import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {UserService} from '../service/user-service';

@Injectable({providedIn: 'root'})
export class RoleWorkerGuard implements CanActivate {

  constructor(private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.userService.hasRole('WORKER')) {
      console.log('Usao u true');
      return true;
    }
    console.log('Usao u odbijanje');
    return false;
  }
}
