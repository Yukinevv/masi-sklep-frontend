import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../modules/Product';

@Component({
  selector: 'app-product-manage',
  templateUrl: './product-manage.component.html',
  styleUrls: ['./product-manage.component.css']
})
export class ProductManageComponent {
  /**
   * The new product being managed in the form.
   * @type {Product}
   */
  newProduct: Product = { id: 0, name: '', description: '', price: 0, quantity: 0, imageUrl: '' };

  /**
   * Event emitted when a new product is added.
   * @type {EventEmitter<Product>}
   */
  @Output() addProductEvent = new EventEmitter<Product>();

  /**
   * Adds the new product and emits the addProductEvent.
   * Resets the form after adding the product.
   */
  addProduct(): void {
    this.addProductEvent.emit(this.newProduct);
    this.newProduct = { id: 0, name: '', description: '', price: 0, quantity: 0, imageUrl: '' }; // Reset form
  }

  /**
   * Handles the image loaded event and sets the product's imageUrl.
   * 
   * @param {string} base64Image - The base64 string of the loaded image.
   */
  onImageLoaded(base64Image: string): void {
    this.newProduct.imageUrl = base64Image;
  }
}
