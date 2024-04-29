import { Injectable } from '@angular/core';
import { Product } from '../modules/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductSharingService {

  private currentProduct: Product | null = null;

  setCurrentProduct(product: Product) {
    this.currentProduct = product;
  }

  getCurrentProduct(): Product | null {
    return this.currentProduct;
  }
}
