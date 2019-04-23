import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllBrands(){
    return this.http.get('api/brands');
  }

  getAllProducts(){
    return this.http.get('api/products');
  }

  getAllModels(brand_name, product_name){
    return this.http.get('api/getAllModels?product_name='+ product_name +'&brand_name='+ brand_name);
  }
}
