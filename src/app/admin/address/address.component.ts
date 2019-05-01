import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {  
  addressForm: FormGroup;
  @Output('addressOutput') addressOutput = new EventEmitter();
  @Output('prevStep') prevStep = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) { 
  }

  ngOnInit() {
    this.setAddressForm();
  }

  setAddressForm(){
    this.addressForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      gstNumber: [''],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
      dateControl: ['', [Validators.required]]
    });
  }

  onSubmit(formDetails){
    if(formDetails.valid){
      this.addressOutput.emit(formDetails.value);
    }
  }

  goToPrevStep($event){
    this.prevStep.emit($event);
  }

}
