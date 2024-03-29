// product-view.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../modules/Product';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent {
  @Input() product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: ''
  }

}
