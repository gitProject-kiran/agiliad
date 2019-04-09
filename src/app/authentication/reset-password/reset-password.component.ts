import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/shared/services/login.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;                    // {1}
  private formSubmitAttempt: boolean; // {2}
  
  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      EmailId: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.resetPassword(this.form.value)
        .subscribe(response =>{   
          let serverMessage = response && response['message'] ? response['message'] : 'Succesfully reset!! Check email address!!';      
          this.snackBar.open(serverMessage, 'Success');
          this.router.navigate(['/login']);
        },
        error =>{
          let serverError = error && error.error ? error.error.message : 'Internal server error!!';
          this.snackBar.open(serverError, 'Error');
        });; // {7}
    } 
    this.formSubmitAttempt = true;             // {8}
  }

}
