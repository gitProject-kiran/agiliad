import { Component, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { Observable, Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { AbstractControl } from '@angular/forms';
import * as crypto from 'crypto-js';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isVerticalMenu: boolean;
  watcher: Subscription;
  myForm: FormGroup;
  visible: boolean = false;
  matcher = new MyErrorStateMatcher();

  oldPasswordHide = true;
  passwordHide = true;
  confirmPasswordHide = true;

  constructor(
    private sidenav: SidenavService,
    private login: LoginService,
    private media: MediaObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.isVerticalMenu = true;
      } else {
        this.isVerticalMenu = false;
      }
    });

    this.myForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: [''],
      oldPassword: ['', [Validators.required]],
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit(changePasswordModel){
    if (this.myForm.valid) {
      var password = crypto.AES.encrypt(this.myForm.value.password, 'secret key 123');
      this.myForm.value.password = password.toString();

      var confirmPassword = crypto.AES.encrypt(this.myForm.value.confirmPassword, 'secret key 123');
      this.myForm.value.confirmPassword = confirmPassword.toString();

      var oldPassword = crypto.AES.encrypt(this.myForm.value.oldPassword, 'secret key 123');
      this.myForm.value.oldPassword = oldPassword.toString();

      this.login.changePassword(this.myForm.value)
        .subscribe(response =>{     
          this.snackBar.open(response['message'], 'Success');
        },
        error =>{
          console.log("response", error, error.error['message']);
            this.snackBar.open(error.error['message'] || 'Please check credentials!!', 'Error');
        });; // {7}

      changePasswordModel.hide();
      this.myForm.reset();
      let control: AbstractControl = null;
      this.myForm.markAsUntouched();
      Object.keys(this.myForm.controls).forEach((name) => {
        control = this.myForm.controls[name];
        control.setErrors(null);
      });
    }
  }

  toggleActive: boolean = false;

  toggleRightSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenav.toggle();
  }
}
