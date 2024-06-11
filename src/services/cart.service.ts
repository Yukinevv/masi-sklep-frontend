import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CartItem } from '../modules/CartItem';
import { Product } from '../modules/Product';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  /**
   * BehaviorSubject to store the current cart items.
   * @type {BehaviorSubject<CartItem[]>}
   */
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  /**
   * Observable of the cart items.
   * @type {Observable<CartItem[]>}
   */
  items$ = this.itemsSubject.asObservable();

  /**
   * Base URL for the API.
   * @type {string}
   */
  private apiUrl = 'http://localhost:8090';

  /**
   * Creates an instance of CartService.
   *
   * @param {HttpClient} http - HTTP client to make requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Places an order with the current cart items.
   *
   * @param {CartItem[]} cartItems - The items in the cart.
   * @returns {Observable<any>} Observable of the order response.
   */
  placeOrder(cartItems: CartItem[]): Observable<any> {
    const products = cartItems.map(item => ({
      id: item.product.id,
      quantity: item.quantity
    }));

    return this.http.post(`${this.apiUrl}/order`, { products }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Adds an item to the cart.
   *
   * @param {Product} product - The product to add.
   * @param {number} [quantity=1] - The quantity to add.
   * @returns {boolean} True if the product was added successfully, false if the maximum quantity was exceeded.
   */
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

  /**
   * Updates the quantity of an item in the cart.
   *
   * @param {number} productId - The ID of the product.
   * @param {number} quantity - The new quantity of the product.
   */
  updateItemQuantity(productId: number, quantity: number): void {
    const currentItems = this.itemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.itemsSubject.next(currentItems);
    }
  }

  /**
   * Removes an item from the cart.
   *
   * @param {number} productId - The ID of the product to remove.
   */
  removeItem(productId: number): void {
    const currentItems = this.itemsSubject.value.filter(item => item.product.id !== productId);
    this.itemsSubject.next(currentItems);
  }

  /**
   * Clears all items from the cart.
   */
  clearCart(): void {
    this.itemsSubject.next([]);
  }

  /**
   * Gets the total quantity of items in the cart.
   *
   * @returns {Observable<number>} Observable of the total quantity of items in the cart.
   */
  getTotalQuantity(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }
}
