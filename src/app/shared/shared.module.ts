import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor} from './interceptor/httpconfig.interceptor';
import { ErrordialogComponent } from './errordialog/errordialog.component';
import { ErrorDialogService } from './services/errordialog.service';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ErrordialogComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ErrordialogComponent
  ],
  providers: [
    ErrorDialogService,
    SidenavService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ]
})
export class SharedModule { }
