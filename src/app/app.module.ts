import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { SharedModule } from './shared/shared.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginService } from 'src/app/shared/services/login.service';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    AngularMaterialModule,
    NgHttpLoaderModule.forRoot()
  ],
  providers: [
    AuthGuard,
    LoginService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
