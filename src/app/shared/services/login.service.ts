import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, CanActivate } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    loggedIn: boolean = false;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {  }

    get isLoggedIn(){
        if(localStorage.getItem('token')){
            return true;
        }
        return false;
    }

    login(data): Observable<any> {
        return this.http.post('/api/login', data)
    }

    logout(){
        this.http.get('/api/logout').subscribe(
            response=>{
                // not logged in so redirect to login page with the return url
                this.router.navigate(['/login']);        
                this.clearLocalStorage();
                },
            error =>{
                console.log("unable to logut", error);
            }
        );
    }

    resetPassword(data){
        return this.http.get('/api/resetPassword?emailId='+ data.EmailId);
    }

    clearLocalStorage(){
        localStorage.removeItem('token');
    }
}