import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProductsComponent } from './add-products/add-products.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';

@NgModule({
  declarations: [MainPageComponent, DashboardComponent, AddProductsComponent],
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
    SharedModule
  ]
})
export class AdminModule { }
