import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../modules/Product';

@Component({
  selector: 'app-product-manage',
  templateUrl: './product-manage.component.html',
  styleUrls: ['./product-manage.component.css']
})
export class ProductManageComponent {
  newProduct = { id: 0, name: '', description: '', category: '', price: 0, quantity: 0, imageUrl: '' };

  @Output() addProductEvent = new EventEmitter<Product>();

  addProduct() {
    this.addProductEvent.emit(this.newProduct)
    this.newProduct = { id: 0, name: '', description: '', category: '', price: 0, quantity: 0, imageUrl: '' }; // Reset formularza
  }

  onImageLoaded(base64Image: string) {
    this.newProduct.imageUrl = base64Image;
  }

}
