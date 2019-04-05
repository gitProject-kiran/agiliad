import { Injectable } from '@angular/core';
import { ErrorDialogService } from '../services/errordialog.service';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from 'src/app/shared/services/login.service';

@Injectable() export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(
        public errorDialogService: ErrorDialogService,
        public loginService: LoginService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('token');

        if (token) {
            request = request.clone({ headers: request.headers.set('x-access-token', token) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    //this.errorDialogService.openDialog(event);
                }
                return event;
            }),

            catchError((error: HttpErrorResponse) => {

                if (error.status === 401 || error.status === 403) {
                    // auto logout if 401 || 403 response returned from api
                    this.loginService.logout();
                    location.reload(true);
                }

                let data = {
                    reason: error && error.error.reason ? error.error.reason : error && error.statusText ? error.statusText : '',
                    status: error.status
                };
                //this.errorDialogService.openDialog(data);
                return throwError(error);
            }));
    }
}