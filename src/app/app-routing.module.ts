import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from '../components/product-details/product-details.component';
import { ProductListComponent } from '../components/product-list/product-list.component';
import { UserRegistrationComponent } from '../components/user-registration/user-registration.component';

const routes: Routes = [
  { path: 'registration', component: UserRegistrationComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
  // inne trasy
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

