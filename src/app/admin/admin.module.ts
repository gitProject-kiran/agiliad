import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProductsComponent, DisableControlDirective } from './add-products/add-products.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { ProductManagementService } from 'src/app/admin/_service/product-management.service';

@NgModule({
  declarations: [
    MainPageComponent, 
    DashboardComponent, 
    AddProductsComponent, 
    DisableControlDirective, 
    CustomerOrderComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AdminRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    SharedModule,
    FormsModule
  ],
  providers: [
    ProductManagementService
  ]
})
export class AdminModule { }
