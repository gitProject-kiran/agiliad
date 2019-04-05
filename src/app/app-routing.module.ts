import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

const routes: Routes = [ 
  { 
    path: 'login', 
    loadChildren: './authentication/authentication.module#AuthenticationModule' 
  },{ 
    path: 'admin', 
    loadChildren: './admin/admin.module#AdminModule', canActivate: [AuthGuard],
    data: { breadcrumb: 'Homepage'} 
  },{ 
    path: '**', 
    redirectTo: 'login' 
  },{ 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
