import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl: any;
  form: FormGroup;                    // {1}
  private formSubmitAttempt: boolean; // {2}

  constructor(
    private fb: FormBuilder,         // {3}
    private authService: LoginService, // {4}
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.authService.clearLocalStorage();
  }

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    //this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value)
        .subscribe(response =>{          
          localStorage.setItem('token', response.token)
          this.router.navigate(['/admin']);
        },
        error =>{
            this.snackBar.open('Please check credentials!!', 'Error');
        });; // {7}
    }
    this.formSubmitAttempt = true;             // {8}
  }

}
