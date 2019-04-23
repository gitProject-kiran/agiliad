import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from 'src/app/admin/main-page/main-page.component';
import { DashboardComponent } from 'src/app/admin/dashboard/dashboard.component';
import { AddProductsComponent } from 'src/app/admin/add-products/add-products.component';
import { CustomerOrderComponent } from 'src/app/admin/customer-order/customer-order.component';

const routes: Routes = [{
  path:  '',
  component:  MainPageComponent,
  children: [
  {
    path:  'dashboard',
    component:  DashboardComponent,
    data: { breadcrumb: 'Dashboard'} 
  },{
    path:  'add-product',
    component:  AddProductsComponent,
    data: { breadcrumb: 'Dashboard'} 
  },{
    path:  'order',
    component:  CustomerOrderComponent,
    data: { breadcrumb: 'Dashboard'} 
  },{ 
    path: '**', 
    redirectTo: 'dashboard' 
  },{ 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
