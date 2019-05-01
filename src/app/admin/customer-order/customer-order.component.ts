import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProductManagementService } from 'src/app/admin/_service/product-management.service';
import { MatSnackBar } from '@angular/material';
import _ from 'lodash';
import { Router } from '@angular/router';
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
  deleteId = -1;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private productManagementService: ProductManagementService,
    private router: Router
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
      priceControl: ['', [Validators.required]]
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
    if(filterForm.valid){
      //Validating every field fill
      for (let key of Object.keys(filterForm.value)) {  
        let value = filterForm.value[key];
        if(_.isNull(value)){
          this.snackBar.open('Please select '+ key, 'Error');  
          return;
        }       
      }
      this.snackBar.open('Successfully added product into cart', 'Success');     
      this.cart.push(filterForm.value);
      console.log("====>", filterForm.value);
      this.resetModelForm();
    }
  }

  getTotal(){
    let total = 0;
    for(let i=0; i<_.size(this.cart); i++){
      let product = this.cart[i];
      total = total + (product.priceControl * product.quantityControl);
    }
    return total;
  }

  deleteItemFromCart(deleteModel){
    deleteModel.hide();
    this.cart.splice(this.deleteId, 1);
  }

  checkout(){
    if(_.size(this.cart) <= 0){
      this.snackBar.open('Atleast add one product before checkout', 'Error');     
      return;
    }
     this.nextStep();
  }

  getAddress($event){
    if(_.size(this.cart)<=0){
      this.snackBar.open('Atleast add one product before checkout', 'Error');
      this.prevStep();
      return;
    }
    let placeOrderDetails = {
      address: $event,
      cart: this.cart
    }

    this.productManagementService.placeOrder(placeOrderDetails)
      .subscribe(res =>{
        if(res['invoiceId'])
        this.router.navigate(['/admin/order-confirmation'], { queryParams: { order:  res['invoiceId']} });
        console.log(res);
      })
    console.log("Address", placeOrderDetails);
  }

}
