import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/shared/services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  returnUrl: any;
  form: FormGroup;                    // {1}
  private formSubmitAttempt: boolean; // {2}
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

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
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
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

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
  }
  
  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
  }

  onSubmit() {
    if (this.form.valid) {
      var ciphertext = crypto.AES.encrypt(this.form.value.password, 'secret key 123');
      this.form.value.password = ciphertext.toString();
      this.authService.login(this.form.value)
        .subscribe(response =>{          
          localStorage.setItem('token', response.token)
          this.router.navigate(['/admin']);
        },
        error =>{
            this.snackBar.open('Please check credentials!!', 'Error');
        }); // {7}
    }
    this.formSubmitAttempt = true;             // {8}
  }

}
