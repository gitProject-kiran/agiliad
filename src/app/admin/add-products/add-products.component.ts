import { Component, OnInit, Directive, Input } from '@angular/core';
import { FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import _ from 'lodash';
import { Observable } from 'rxjs';

export interface Product {
  name: string;
  sound: string;
}

export interface Tile {
  text: String;
  cols: number;
  rows: number;
  color: String;
}

export interface Item {
  model: string;
  product: string;
  brand: string;
}

import { NgControl } from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl( condition : boolean ) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }

  constructor( private ngControl : NgControl ) {
  }

}

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {
  modelNumber: any;
  isUpdateModel: boolean = false;
  //Add Model
  addModelForm: FormGroup;
  brands: string[] = [];
  products: string[] = [];

  //For table
  public displayedColumns = ['model', 'product', 'brand', 'quantity', 'details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver) {

    //Add Model
    this.addModelForm = this.formBuilder.group({
      brandControl: [{value:''}, [Validators.required]],
      productControl: [{value:''}, [Validators.required]],
      modelNo: [{value:''}, [Validators.required]],
      mrpPrice: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      sgst: ['', [Validators.required]],
      cgst: ['', [Validators.required]],
    });

    //Add Model
    this.getAllBrands();
    this.getAllProducts();
  }

  filteredOptions: Observable<string[]>;
  filteredOptionsForProducts: Observable<string[]>;

  ngOnInit() {
    //For table
    this.dataSource.paginator = this.paginator;
    this.getAllModels();
  }

  private _filter(value: string): string[] {
    if(value == null) value = '';
    const filterValue = value.toLowerCase();
    return this.brands.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterForProducts(value: string): string[] {
    if(value == null) value = '';
    const filterValue = value.toLowerCase();
    return this.products.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public getAllModels = () => {
    this.http.get('api/models')
      .subscribe(res => {
        this.dataSource.data = res['result'] as Item[];
      })
  }

  public getAllBrands = () => {
    this.http.get('api/brands')
      .subscribe(formData => {
        for (var i = 0; i < _.size(formData['result']); i++) {
          this.brands.push(formData['result'][i]['brand_name'])
        }

        this.filteredOptions = this.addModelForm.controls.brandControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      })
  }

  public getAllProducts = () => {
    this.http.get('api/products')
      .subscribe(formData => {
        for (var i = 0; i < _.size(formData['result']); i++) {
          this.products.push(formData['result'][i]['product_name'])
        }

        this.filteredOptionsForProducts = this.addModelForm.controls.productControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterForProducts(value))
        );
      })
  }

  onSubmit(addModel, addModelForm){
    if(addModelForm.valid){
      this.isUpdateModel ? this.updateProduct(addModel, addModelForm) : this.addNewProduct(addModel, addModelForm);
    }   
  }

  addNewProduct(addModel, addModelForm){
    this.http.post('api/registerModel', addModelForm.value)
      .subscribe(response => {
        this.resetModelForm(addModel, addModelForm);
        let serverMessage = response && response['message'] ? response['message'] : 'Succesfully Added!!';      
        this.snackBar.open(serverMessage, 'Success'); 
        
        this.getAllModels();
      },
      error =>{
        let serverMessage = error && error['error']['message'] ? error['error']['message'] : 'Error!!';      
        this.snackBar.open(serverMessage, 'Error');       
      })
  }

  updateProduct(addModel, addModelForm){
    let updateInfo = addModelForm.value;
    updateInfo.modelNo = this.modelNumber;
    this.http.put('api/updateModelInfo', updateInfo)
      .subscribe(response => {
        this.resetModelForm(addModel, addModelForm);
        let serverMessage = response && response['message'] ? response['message'] : 'Succesfully Added!!';      
        this.snackBar.open(serverMessage, 'Success');    
        
        this.getAllModels();
      },
      error =>{
        let serverMessage = error && error['error']['message'] ? error['error']['message'] : 'Error!!';      
        this.snackBar.open(serverMessage, 'Error');       
      })
  }

  resetModelForm(addModel, addModelForm) {
    addModel.hide();
    this.addModelForm.reset();
    let control: AbstractControl = null;
    this.addModelForm.markAsUntouched();
    Object.keys(this.addModelForm.controls).forEach((name) => {
      control = this.addModelForm.controls[name];
      control.setErrors(null);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToUpdate(modelNumber, addModel){
    this.http.get('api/getModelInfo?modelNo='+ modelNumber)
      .subscribe(response => {
        response = response['result'];
          addModel.show();
          this.addModelForm.controls['brandControl'].setValue(response['brandControl']);
          this.addModelForm.controls['productControl'].setValue(response['productControl']);
          this.addModelForm.controls['modelNo'].setValue(response['modelNo']);
          this.addModelForm.controls['mrpPrice'].setValue(response['mrpPrice']);
          this.addModelForm.controls['quantity'].setValue(response['quantity']);
          this.addModelForm.controls['sgst'].setValue(response['sgst']);
          this.addModelForm.controls['cgst'].setValue(response['cgst']);
          this.isUpdateModel = true;
          this.modelNumber = response['modelNo'];
      },
      error =>{
        let serverMessage = error && error['error']['message'] ? error['error']['message'] : 'Error!!';      
        this.snackBar.open(serverMessage, 'Error');       
      })
    console.log("==> model number", modelNumber);
  }
}
