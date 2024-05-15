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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserLoginComponent } from '../components/user-login/user-login.component';
import { AuthInterceptor } from '../services/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { CartComponent } from '../components/cart/cart.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrdersComponent } from '../components/orders/orders.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    ProductViewComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductFilterComponent,
    ProductManageComponent,
    ImageManageComponent,
    UserRegistrationComponent,
    UserLoginComponent,
    ConfirmDialogComponent,
    CartComponent,
    NavbarComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
