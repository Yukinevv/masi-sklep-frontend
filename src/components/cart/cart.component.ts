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
