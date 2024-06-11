import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../modules/CartItem';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  /**
   * Array of items currently in the cart.
   * @type {CartItem[]}
   */
  cartItems: CartItem[] = [];

  /**
   * Creates an instance of CartComponent.
   *
   * @param {CartService} cartService - Service to handle cart operations.
   * @param {AuthService} authService - Service to handle authentication.
   * @param {Router} router - Router service to navigate between routes.
   * @param {MatSnackBar} snackBar - Service to show snack bar notifications.
   */
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Initializes the component.
   * Redirects to login if user is not authenticated.
   * Subscribes to cart items updates.
   */
  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
    }

    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    });
  }

  /**
   * Updates the quantity of a specific item in the cart.
   * Displays a snack bar notification if the quantity is invalid.
   *
   * @param {number} productId - The ID of the product.
   * @param {Event} event - The input event containing the new quantity.
   */
  updateQuantity(productId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = inputElement.valueAsNumber;

    const maxQuantity = this.cartItems.find(item => item.product.id === productId)?.product.quantity ?? 0;
    if (quantity > 0 && quantity <= maxQuantity) {
      this.cartService.updateItemQuantity(productId, quantity);
    } else {
      this.snackBar.open(`Maksymalna dostępna ilość to ${maxQuantity}`, 'Zamknij', { duration: 2000 });
    }
  }

  /**
   * Removes an item from the cart.
   *
   * @param {number} productId - The ID of the product to remove.
   */
  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  /**
   * Clears all items from the cart.
   */
  clearCart(): void {
    this.cartService.clearCart();
  }

  /**
   * Places an order with the current cart items.
   * Clears the cart and displays a snack bar notification on success.
   * Displays an error message on failure.
   */
  placeOrder(): void {
    this.cartService.placeOrder(this.cartItems).subscribe({
      next: (response) => {
        this.snackBar.open('Zamówienie zostało złożone pomyślnie!', 'Zamknij', { duration: 3000 });
        this.cartItems = [];
        this.cartService.clearCart();
      },
      error: (error) => {
        this.snackBar.open('Wystąpił błąd przy składaniu zamówienia.', 'Zamknij', { duration: 3000 });
        console.error('Error placing order:', error);
      }
    });
  }
}
