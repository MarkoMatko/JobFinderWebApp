import {Injectable} from '@angular/core';
import {HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
import {tap} from 'rxjs/internal/operators';
import {TokenStorage} from './auth/token.storage';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private router: Router, private token: TokenStorage) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    if (this.token.getToken() != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.token.getToken())});
    }

    return next.handle(authReq).pipe(
      tap(
        (error) => {

          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.router.navigate(['/signin']);
            }
          }
        }
      )
    );

  }
}
