// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../modules/CartItem';
import { Product } from '../modules/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  addItem(product: Product, quantity: number = 1): void {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }
    this.itemsSubject.next(currentItems);
  }

  removeItem(productId: number): void {
    const currentItems = this.itemsSubject.value.filter(item => item.product.id !== productId);
    this.itemsSubject.next(currentItems);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }
}
