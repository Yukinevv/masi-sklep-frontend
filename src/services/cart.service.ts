// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItem } from '../modules/CartItem';
import { Product } from '../modules/Product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  private apiUrl = 'http://localhost:8090';

  constructor(private http: HttpClient) { }

  placeOrder(cartItems: CartItem[]): Observable<any> {
    const products = cartItems.map(item => ({
      id: item.product.id,
      quantity: item.quantity
    }));

    return this.http.post(`${this.apiUrl}/order`, { products }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  addItem(product: Product, quantity: number = 1): boolean {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);
    const totalQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

    if (totalQuantity <= product.quantity) {
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        currentItems.push({ product, quantity });
      }
      this.itemsSubject.next(currentItems);
      return true; // Produkt został dodany pomyślnie
    } else {
      return false; // Przekroczono maksymalną ilość
    }
  }

  updateItemQuantity(productId: number, quantity: number): void {
    const currentItems = this.itemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.itemsSubject.next(currentItems);
    }
  }

  removeItem(productId: number): void {
    const currentItems = this.itemsSubject.value.filter(item => item.product.id !== productId);
    this.itemsSubject.next(currentItems);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  getTotalQuantity(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }
}
