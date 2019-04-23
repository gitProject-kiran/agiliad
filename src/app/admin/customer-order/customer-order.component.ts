import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    this.modelForm = this.formBuilder.group({
      brandControl: ['', [Validators.required]],
      productControl: ['', [Validators.required]],
      modelControl: ['', [Validators.required]],
      quantityControl: ['', [Validators.required]],
      priceControl: ['', [Validators.required]],
      dateControl: ['', [Validators.required]],
    });

    this.getAllBrands();
    this.getAllProducts();
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
    //Validating both ara selected or not
    if(!modelForm.value.brandControl || !modelForm.value.productControl){
      this.snackBar.open(modelForm.value.brandControl ? 'Select Product' :  'Select Brand', 'Error');
      return;
    } 

    this.productManagementService.getAllModels(modelForm.value.brandControl, modelForm.value.productControl)
    .subscribe(res =>{
      this.models = res;
    });    
    console.log("===>", modelForm);
  }

  onSubmit(filterForm){
    console.log("===", filterForm);
  }

}
