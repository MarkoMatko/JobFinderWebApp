import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {TokenStorage} from './token.storage';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private tokenStorage: TokenStorage, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
   const auth: boolean =  !!this.tokenStorage.getToken();
   if (auth) {
     return true;
   }
   return this.router.createUrlTree(['/signin']);
  }
}
