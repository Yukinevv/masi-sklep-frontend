import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductViewComponent } from '../components/product-view/product-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductViewComponent // Tutaj deklarujesz swój komponent
  ],
  imports: [
    BrowserModule,
    // Tutaj możesz dodać inne moduły, które są używane w aplikacji
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
