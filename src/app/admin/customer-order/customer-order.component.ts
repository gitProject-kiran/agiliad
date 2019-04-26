import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProductManagementService } from 'src/app/admin/_service/product-management.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-customer-order',
  templateUrl: './customer-order.component.html',
  styleUrls: ['./customer-order.component.scss']
})
export class CustomerOrderComponent implements OnInit {
  models: Object;
  products: any;
  brands: Object;
  selected;
  modelForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private productManagementService: ProductManagementService
  ) { 
    
    this.setForm();
    this.getAllBrands();
    this.getAllProducts();
  }

  setForm(){
    this.modelForm = this.formBuilder.group({
      brandControl: ['', [Validators.required]],
      productControl: ['', [Validators.required]],
      modelControl: ['', [Validators.required]],
      quantityControl: ['', [Validators.required]],
      priceControl: ['', [Validators.required]],
      dateControl: ['', [Validators.required]],
    });
  }
  panelOpenState = false;
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnInit() {}

  getAllBrands(){
    this.productManagementService.getAllBrands()
    .subscribe(res => {
      this.brands = res['result'];
    });
  }

  getAllProducts(){
    this.productManagementService.getAllProducts()
    .subscribe(res => {
      this.products = res['result'];
    });
  }

  getModels(modelForm){
    this.selected='';
    //Validating both ara selected or not
    if(!modelForm.value.brandControl || !modelForm.value.productControl ){
      if(!modelForm.value.brandControl){
        this.snackBar.open(modelForm.value.brandControl ? 'Select Product' :  'Select Brand', 'Error');
      }
      return;
    } 

    this.productManagementService.getAllModels(modelForm.value.brandControl, modelForm.value.productControl)
    .subscribe(res =>{
      this.models = res;
    });    
    console.log("===>", modelForm);
  }

  resetModelForm() {    
    this.modelForm.reset();
    let control: AbstractControl = null;
    this.modelForm.markAsUntouched();
    Object.keys(this.modelForm.controls).forEach((name) => {
      control = this.modelForm.controls[name];
      control.setErrors(null);
    });
    this.selected='';
  }

  cart = [];
  onSubmit(filterForm){
    console.log("added",filterForm.valid)
    if(filterForm.valid){
      this.snackBar.open('Successfully added product into cart', 'Success');
      this.cart.push(filterForm.value);
      filterForm.reset();;
      this.resetModelForm();
    }
  }

}
