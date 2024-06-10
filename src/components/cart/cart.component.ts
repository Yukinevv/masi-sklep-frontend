// cart.component.ts
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
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private authService: AuthService, private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
    }

    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    });
  }

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

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

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
