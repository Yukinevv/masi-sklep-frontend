import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductViewComponent } from '../components/product-view/product-view.component';
import { ProductListComponent } from '../components/product-list/product-list.component';
import { ProductDetailsComponent } from '../components/product-details/product-details.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductFilterComponent } from '../components/product-filter/product-filter.component';
import { ProductManageComponent } from '../components/product-manage/product-manage.component';
import { ImageManageComponent } from '../components/image-manage/image-manage.component';
import { UserRegistrationComponent } from '../components/user-registration/user-registration.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ProductViewComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductFilterComponent,
    ProductManageComponent,
    ImageManageComponent,
    UserRegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
