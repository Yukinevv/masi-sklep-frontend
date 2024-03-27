// product-view.component.ts
import { Component } from '@angular/core';
import { Product } from '../../modules/Product';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent {
  // Inicjalizacja przykładowego produktu bezpośrednio w komponencie
  product: Product = new Product(
    1,
    'Smartfon XYZ',
    'Najnowszy model smartfona z wieloma funkcjami.',
    999.99,
    'https://example.com/smartfon.jpg'
  );
}
